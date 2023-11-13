import axios, { AxiosError, AxiosInstance, isAxiosError } from 'axios';
import { Request } from 'express';
import {
  ClientOptions,
  ValidationOptions,
  DilithiumGenerateKeysResponse,
  DilithiumSignResponse,
  DilithiumVerifyResponse,
  KyberDecryptResponse,
  KyberEncryptResponse,
  KyberGenerateKeysResponse,
  DilithiumMode,
} from './types';
import { readFileSync } from 'fs';
import { AuthData } from './types/auth-data.interface';
import { Provider } from './types/provider.type';
import {
  ProjectKeyMissingError,
  AuthenticateError,
  NotInitializedError,
  RequestValidationError,
  TokenValidationError,
  ForbiddenError,
  BadArgumentError,
  UnauthorizedError,
} from './errors';
import { JwtPayload, verify } from 'jsonwebtoken';
import axiosRetry from 'axios-retry';
import { AuthPayload } from './types/auth-payload.interface';
import { Config } from './types/config.interface';
import { UnknownError } from './errors/unknown.error';

const API_URL =
  (process.env.MAGELLANIC_API_URL || 'https://api.magellanic.ai') +
  '/public-api/workloads';
const ID_HEADER_NAME = 'magellanic-workload-id';
const AUTH_HEADER_NAME = 'magellanic-authorization';
const SECRET_HEADER_NAME = 'magellanic-workload-secret';

/**
 * Magellanic SDK Client base class
 */
export class MagellanicClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly config: Config;

  private token?: string;
  private authData?: AuthData;

  /**
   * A shorthand for
   * ```ts
   * const magellanicClient = new MagellanicClient(clientOptions);
   * await magellanicClient.authenticate();
   * ```
   *
   * @param clientOptions
   * @throws {@link AuthenticateError}
   * @throws {@link ProjectKeyMissingError} if projectKey is missing
   * @returns {@link MagellanicClient | authenticated} instance
   */
  static async createClient(
    clientOptions?: ClientOptions,
  ): Promise<MagellanicClient> {
    const client = new MagellanicClient(clientOptions);
    await client.authenticate();
    return client;
  }

  /**
   * The constructor of the "MagellanicClient" class.
   *
   * @param clientOptions
   * @throws {@link ProjectKeyMissingError} if projectKey is missing
   */
  constructor(clientOptions?: ClientOptions) {
    let projectKey;
    let name;
    let provider;
    if (clientOptions) {
      ({ projectKey, name, provider } = clientOptions);
    }
    if (!projectKey) {
      projectKey = process.env.MAGELLANIC_PROJECT_KEY;
      if (!projectKey) {
        throw new ProjectKeyMissingError();
      }
    }
    if (!provider) {
      // TODO: support other providers
      provider = process.env.MAGELLANIC_PROVIDER_TYPE;
      // TODO: detect provider properly
      // if (!provider) {
      //   provider = 'k8s';
      // }
    }
    if (!name) {
      name = process.env.MAGELLANIC_WORKLOAD_NAME;
    }
    this.config = {
      apiKey: clientOptions?.apiKey || process.env.MAGELLANIC_API_KEY,
      projectKey,
      providerType: provider ? <Provider>provider : undefined,
      name,
      roleKey: clientOptions?.roleKey || process.env.MAGELLANIC_ROLE_KEY,
    };
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      timeout: 15000,
    });
    axiosRetry(this.axiosInstance, { shouldResetTimeout: true });
  }

  /**
   * Method used to authenticate the workload.
   *
   * @throws {@link AuthenticateError}
   */
  async authenticate(): Promise<void> {
    let k8sToken;
    if (this.config.providerType === 'k8s') {
      const tokenPath = '/var/run/secrets/kubernetes.io/serviceaccount/token';
      try {
        k8sToken = readFileSync(tokenPath, { encoding: 'utf8' });
      } catch (err) {
        if (err instanceof Error) {
          throw new AuthenticateError(
            `Error when trying to read the token file (path: ${tokenPath}): \n${err.message}`,
          );
        } else {
          throw err;
        }
      }
    }
    try {
      const payload: AuthPayload = {
        ...this.config,
        token: k8sToken,
        type: 'sdk',
      };

      const response = await this.axiosInstance.post(`auth`, payload);
      const { token, tokenExpiryDate, ...authData } = response.data;
      this.token = token;
      this.authData = authData;
      this.axiosInstance.interceptors.request.use((config) => {
        config.headers[ID_HEADER_NAME] = this.authData?.id;
        config.headers[AUTH_HEADER_NAME] = this.getMyToken();
        config.headers[SECRET_HEADER_NAME] = this.authData?.secret;
        return config;
      });
      const timeout =
        new Date(tokenExpiryDate).getTime() - new Date().getTime() - 10 * 1000;
      setTimeout(() => this.rotateToken(), timeout);
    } catch (err) {
      if (isAxiosError(err)) {
        throw new AuthenticateError(err.message, err.response?.data);
      } else if (err instanceof Error) {
        throw new AuthenticateError(err.message);
      } else {
        throw err;
      }
    }
  }

  /**
   * Method used to obtain the latest workload's token.
   *
   * @returns the latest token of this workload
   * @throws {@link NotInitializedError}
   */
  getMyToken(): string {
    this.checkState();
    return this.token as string;
  }

  /**
   * Method used to generate required HTTP headers for requests between two workloads.
   *
   * ```ts
   * await axios.post('.../external-app/example', payload, {
   *    headers: magellanicClient.generateHeaders(),
   * });
   * ```
   *
   * @returns headers object
   * @throws {@link NotInitializedError}
   */
  generateHeaders(): Record<string, string> {
    this.checkState();
    return {
      [AUTH_HEADER_NAME]: this.getMyToken(),
      [ID_HEADER_NAME]: this.authData!.id,
    };
  }

  /**
   * Method used to validate request from another workload. It throws errors on bad requests and returns nothing if
   * everything is as expected.
   * If you don't want to pass Express.js Request object, see {@link validateToken} method instead.
   *
   * @param req Express.js Request object
   * @param validationOptions additional validation options
   * @throws {@link RequestValidationError}
   * @throws {@link NotInitializedError}
   * @throws {@link TokenValidationError}
   */
  validateRequest(req: Request, validationOptions?: ValidationOptions): void {
    const id = req.header(ID_HEADER_NAME);
    if (!id) {
      throw new RequestValidationError(`${ID_HEADER_NAME} header not defined`);
    }
    const token = req.header(AUTH_HEADER_NAME);
    if (!token) {
      throw new RequestValidationError(
        `${AUTH_HEADER_NAME} header not defined`,
      );
    }
    return validationOptions
      ? this.validateToken(id, token, validationOptions)
      : this.validateToken(id, token);
  }

  /**
   * Method used to validate token. It throws errors on bad requests and returns nothing if
   * everything is as expected.
   *
   * See {@link validateRequest} method if using Express.js
   *
   * @param workloadId unique sender's ID (acquired from the "magellanic-workload-id" header)
   * @param token sender's token (acquired from the "magellanic-authorization" header)
   * @throws {@link TokenValidationError}
   * @throws {@link NotInitializedError}
   */
  validateToken(workloadId: string, token: string): void;
  /**
   * Method used to validate token. It throws errors on bad requests and returns nothing if
   * everything is as expected.
   *
   * See {@link validateRequest} method if using Express.js
   *
   * @param workloadId unique sender's ID (acquired from the "magellanic-workload-id" header)
   * @param token sender's token (acquired from the "magellanic-authorization" header)
   * @param validationOptions additional validation options
   * @throws {@link TokenValidationError}
   * @throws {@link NotInitializedError}
   */
  validateToken(
    workloadId: string,
    token: string,
    validationOptions: ValidationOptions,
  ): void;
  validateToken(
    workloadId: string,
    token: string,
    validationOptions?: ValidationOptions,
  ): void {
    this.checkState();
    let payload: string | JwtPayload;
    try {
      payload = verify(token, this.authData!.publicKey, {
        algorithms: ['RS256'],
      });
    } catch {
      throw new TokenValidationError('bad token');
    }
    if (
      typeof payload === 'string' ||
      !payload.workloadId ||
      payload.workloadId !== workloadId
    ) {
      throw new TokenValidationError('bad token');
    }

    if (validationOptions) {
      if (
        !payload.resources ||
        !payload.resources[validationOptions.resource] ||
        !payload.resources[validationOptions.resource][validationOptions.action]
      ) {
        throw new TokenValidationError('no required permissions');
      }
    }
  }

  /**
   * Method used to pull configuration
   *
   * @param configId ID of the configuration to pull
   * @throws {@link BadArgumentError}
   * @throws {@link UnauthorizedError}
   * @throws {@link UnknownError}
   */
  async getConfig(configId: string): Promise<Record<string, unknown>> {
    this.checkState();
    try {
      const response = await this.axiosInstance.post<Record<string, unknown>>(
        'config',
        {
          configId,
        },
      );
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        throw this.handleAxiosError(err);
      } else {
        throw err;
      }
    }
  }

  /**
   * Method used to generate Kyber private key/public key pair.
   *
   * @throws {@link UnauthorizedError}
   * @throws {@link UnknownError}
   */
  async kyberGenerateKeys(): Promise<KyberGenerateKeysResponse> {
    try {
      const response = await this.axiosInstance.post<KyberGenerateKeysResponse>(
        'kyber/generate-keys',
      );
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        throw this.handleAxiosError(err);
      } else {
        throw err;
      }
    }
  }

  /**
   * Method used to generate Kyber secret and ciphertext
   *
   * @param publicKey Kyber public key generated using {@link kyberGenerateKeys}
   * @throws {@link BadArgumentError}
   * @throws {@link UnauthorizedError}
   * @throws {@link UnknownError}
   */
  async kyberEncrypt(publicKey: string): Promise<KyberEncryptResponse> {
    try {
      const response = await this.axiosInstance.post<KyberEncryptResponse>(
        'kyber/encrypt',
        { publicKey },
      );
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        throw this.handleAxiosError(err);
      } else {
        throw err;
      }
    }
  }

  /**
   * Method used to decrypt a secret using ciphertext
   *
   * @param privateKey Kyber public key generated using {@link kyberGenerateKeys}
   * @param ciphertext Kyber ciphertext generated using {@link kyberEncrypt}
   * @throws {@link BadArgumentError}
   * @throws {@link UnauthorizedError}
   * @throws {@link UnknownError}
   */
  async kyberDecrypt(
    privateKey: string,
    ciphertext: string,
  ): Promise<KyberDecryptResponse> {
    try {
      const response = await this.axiosInstance.post<KyberDecryptResponse>(
        'kyber/decrypt',
        { privateKey, ciphertext },
      );
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        throw this.handleAxiosError(err);
      } else {
        throw err;
      }
    }
  }

  /**
   * Method used to generate Dilithium private key/public key pair.
   * @param mode Dilithium mode - 2 or 3
   * @throws {@link BadArgumentError}
   * @throws {@link UnauthorizedError}
   * @throws {@link UnknownError}
   */
  async dilithiumGenerateKeys(
    mode: DilithiumMode,
  ): Promise<DilithiumGenerateKeysResponse> {
    try {
      const response =
        await this.axiosInstance.post<DilithiumGenerateKeysResponse>(
          'dilithium/generate-keys',
          { mode },
        );
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        throw this.handleAxiosError(err);
      } else {
        throw err;
      }
    }
  }

  /**
   * Method used to generate a signature of provided message using Dilithium.
   * @param mode Dilithium mode - 2 or 3
   * @param privateKey Dilithium private key generated using {@link dilithiumGenerateKeys}
   * @param message message you want to sign
   * @throws {@link BadArgumentError}
   * @throws {@link UnauthorizedError}
   * @throws {@link UnknownError}
   */
  async dilithiumSign(
    mode: DilithiumMode,
    privateKey: string,
    message: string,
  ): Promise<DilithiumSignResponse> {
    try {
      const response = await this.axiosInstance.post<DilithiumSignResponse>(
        'dilithium/sign',
        { mode, privateKey, message },
      );
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        throw this.handleAxiosError(err);
      } else {
        throw err;
      }
    }
  }

  /**
   * Method used to verify the signature of provided message using Dilithium.
   * @param mode Dilithium mode - 2 or 3. Use the same as when signing.
   * @param publicKey Dilithium public key generated using {@link dilithiumGenerateKeys}
   * @param message message received
   * @param signature signature received
   * @throws {@link BadArgumentError}
   * @throws {@link UnauthorizedError}
   * @throws {@link UnknownError}
   */
  async dilithiumVerify(
    mode: DilithiumMode,
    publicKey: string,
    message: string,
    signature: string,
  ): Promise<DilithiumVerifyResponse> {
    try {
      const response = await this.axiosInstance.post<DilithiumVerifyResponse>(
        'dilithium/verify',
        {
          mode,
          publicKey,
          message,
          signature,
        },
      );
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        throw this.handleAxiosError(err);
      } else {
        throw err;
      }
    }
  }

  // TODO: handle errors
  private async rotateToken(): Promise<void> {
    const response = await this.axiosInstance.post('rotate-token');
    this.token = response.data.token;
    const timeout =
      new Date(response.data.tokenExpiryDate).getTime() -
      new Date().getTime() -
      10 * 1000;
    setTimeout(() => this.rotateToken(), timeout);
  }

  private handleAxiosError(error: AxiosError) {
    if (error.response?.status === 400) {
      return new BadArgumentError(error.response?.data);
    } else if (error.response?.status === 401) {
      return new UnauthorizedError(error.response?.data);
    } else if (error.response?.status === 403) {
      return new ForbiddenError(error.response?.data);
    }
    return new UnknownError(error.response?.data);
  }

  private checkState() {
    if (!this.token || !this.authData) {
      throw new NotInitializedError();
    }
  }
}
