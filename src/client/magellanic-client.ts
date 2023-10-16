import { v4 as uuid } from 'uuid';
import axios, { AxiosInstance, isAxiosError } from 'axios';
import { Request } from 'express';
import { ClientOptions } from './types';
import { readFileSync } from 'fs';
import Go from '../crypto/wasm-exec.helper';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { AuthData } from './types/dilithium-data.interface';
import { AuthPayload } from './types/auth-payload.interface';
import { Provider } from './types/provider.type';
import {
  ProjectKeyMissingError,
  AuthenticateError,
  NotInitializedError,
  RequestValidationError,
  TokenValidationError,
  WasmError,
} from './errors';
import { CryptoService } from '../crypto/types/interfaces/crypto-service.interface';
import {
  DilithiumGenerateKeysResponse,
  DilithiumSignResponse,
  DilithiumVerifyResponse,
  KyberDecryptResponse,
  KyberEncryptResponse,
  KyberGenerateKeysResponse,
  DilithiumMode,
} from '../crypto';
import { verify } from 'jsonwebtoken';

const API_URL = 'https://api.magellanic.one/public-api/workloads';
const ID_HEADER_NAME = 'magellanic-workload-id';

/**
 * Magellanic SDK Client base class
 */
export class MagellanicClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly name: string;
  private readonly projectKey: string;
  private readonly provider?: Provider;
  private readonly apiKey?: string;

  private token?: string;

  private cryptoService?: CryptoService;
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
   * @returns authenticated {@link MagellanicClient} instance
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
    const id = uuid();
    if (!name) {
      name = process.env.MAGELLANIC_WORKLOAD_NAME;
      if (!name) {
        name = id;
      }
    }
    this.apiKey = clientOptions?.apiKey || process.env.MAGELLANIC_API_KEY;
    this.projectKey = projectKey;
    this.name = name;
    this.provider = <Provider>provider;
    this.axiosInstance = axios.create({
      baseURL: API_URL,
    });
  }

  /**
   * Method used to authenticate the workload.
   *
   * @throws {@link AuthenticateError}
   */
  async authenticate(): Promise<void> {
    let k8sToken;
    if (this.provider === 'k8s') {
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
        providerType: this.provider,
        name: this.name,
        token: k8sToken,
        projectKey: this.projectKey,
        apiKey: this.apiKey,
      };

      const response = await this.axiosInstance.post(`auth`, payload);
      const { token, tokenExpiryDate, authData } = response.data;
      this.token = token;
      this.authData = authData;
      this.axiosInstance.interceptors.request.use((config) => {
        config.headers[ID_HEADER_NAME] = this.authData?.id;
        return config;
      });
      await this.instantiateWasm();
      const timeout =
        new Date(tokenExpiryDate).getTime() - new Date().getTime() - 30 * 1000;
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
      Authorization: `Bearer ${this.getMyToken()}`,
      [ID_HEADER_NAME]: this.authData!.id,
    };
  }

  /**
   * Method used to validate request from another workload. It throws errors on bad requests and returns nothing if
   * everything is as expected.
   * If you don't want to pass Express.js Request object, see {@link validateToken} method instead.
   *
   * @param req Express.js Request object
   * @throws {@link RequestValidationError}
   * @throws {@link NotInitializedError}
   * @throws {@link TokenValidationError}
   */
  validateRequest(req: Request) {
    const id = req.header(ID_HEADER_NAME);
    if (!id) {
      throw new RequestValidationError('workload id header not defined');
    }
    const tokenHeader = req.header('Authorization');
    if (!tokenHeader) {
      throw new RequestValidationError('Authorization header not defined');
    }
    const token = tokenHeader.split(' ')[1];
    return this.validateToken(id, token);
  }

  /**
   * Method used to validate token. It throws errors on bad requests and returns nothing if
   * everything is as expected.
   *
   * See {@link validateRequest} method if using Express.js
   *
   * @param workloadId unique sender's ID (acquired from the "magellanic-workload-id" header)
   * @param token sender's token (acquired from the "Authorization" header. Remove the "Bearer " prefix first)
   * @throws {@link TokenValidationError}
   * @throws {@link NotInitializedError}
   */
  validateToken(workloadId: string, token: string) {
    this.checkState();
    try {
      const payload = verify(token, this.authData!.publicKey, {
        algorithms: ['RS256'],
      });
      if (
        typeof payload === 'string' ||
        !payload.workloadId ||
        payload.workloadId !== workloadId
      ) {
        throw new Error();
      }
    } catch {
      throw new TokenValidationError('bad token');
    }
  }

  /**
   * Method used to generate Kyber private key/public key pair.
   *
   * @throws {@link WasmError}
   */
  async kyberGenerateKeys(): Promise<KyberGenerateKeysResponse> {
    await this.instantiateWasm();
    const kyberGenerateKeysResponse = this.cryptoService!.kyberGenerateKeys();
    if ('error' in kyberGenerateKeysResponse) {
      throw new WasmError(kyberGenerateKeysResponse.error);
    }
    return kyberGenerateKeysResponse;
  }

  /**
   * Method used to generate Kyber secret and ciphertext
   *
   * @param publicKey Kyber public key generated using {@link kyberGenerateKeys}
   * @throws {@link WasmError}
   */
  async kyberEncrypt(publicKey: string): Promise<KyberEncryptResponse> {
    await this.instantiateWasm();
    const kyberEncryptResponse = this.cryptoService!.kyberEncrypt(publicKey);
    if ('error' in kyberEncryptResponse) {
      throw new WasmError(kyberEncryptResponse.error);
    }
    return kyberEncryptResponse;
  }

  /**
   * Method used to decrypt a secret using ciphertext
   *
   * @param privateKey Kyber public key generated using {@link kyberGenerateKeys}
   * @param ciphertext Kyber ciphertext generated using {@link kyberEncrypt}
   * @throws {@link WasmError}
   */
  async kyberDecrypt(
    privateKey: string,
    ciphertext: string,
  ): Promise<KyberDecryptResponse> {
    await this.instantiateWasm();
    const kyberDecryptResponse = this.cryptoService!.kyberDecrypt(
      privateKey,
      ciphertext,
    );
    if ('error' in kyberDecryptResponse) {
      throw new WasmError(kyberDecryptResponse.error);
    }
    return kyberDecryptResponse;
  }

  /**
   * Method used to generate Dilithium private key/public key pair.
   * @param mode Dilithium mode - 2 or 3
   * @throws {@link WasmError}
   */
  async dilithiumGenerateKeys(
    mode: DilithiumMode,
  ): Promise<DilithiumGenerateKeysResponse> {
    await this.instantiateWasm();
    const dilithiumGenerateKeysResponse =
      this.cryptoService!.dilithiumGenerateKeys(mode);
    if ('error' in dilithiumGenerateKeysResponse) {
      throw new Error(dilithiumGenerateKeysResponse.error);
    }
    return dilithiumGenerateKeysResponse;
  }

  /**
   * Method used to generate a signature of provided message using Dilithium.
   * @param mode Dilithium mode - 2 or 3
   * @param privateKey Dilithium private key generated using {@link dilithiumGenerateKeys}
   * @param message message you want to sign
   * @throws {@link WasmError}
   */
  async dilithiumSign(
    mode: DilithiumMode,
    privateKey: string,
    message: string,
  ): Promise<DilithiumSignResponse> {
    await this.instantiateWasm();
    const dilithiumSignResponse = this.cryptoService!.dilithiumSign(
      mode,
      privateKey,
      message,
    );
    if ('error' in dilithiumSignResponse) {
      throw new Error(dilithiumSignResponse.error);
    }
    return dilithiumSignResponse;
  }

  /**
   * Method used to verify a signature of provided message using Dilithium.
   * @param mode Dilithium mode - 2 or 3. Use the same as when signing.
   * @param publicKey Dilithium public key generated using {@link dilithiumGenerateKeys}
   * @param message message received
   * @param signature signature received
   * @throws {@link WasmError}
   */
  async dilithiumVerify(
    mode: DilithiumMode,
    publicKey: string,
    message: string,
    signature: string,
  ): Promise<DilithiumVerifyResponse> {
    await this.instantiateWasm();
    const dilithiumVerifyResponse = this.cryptoService!.dilithiumVerify(
      mode,
      publicKey,
      message,
      signature,
    );
    if ('error' in dilithiumVerifyResponse) {
      throw new Error(dilithiumVerifyResponse.error);
    }
    return dilithiumVerifyResponse;
  }

  // TODO: handle errors
  private async rotateToken(): Promise<void> {
    const payload = await this.createIdentityPayload();
    const response = await this.axiosInstance.post('rotate-token', payload);
    this.token = response.data.token;
    const timeout =
      new Date(response.data.tokenExpiryDate).getTime() -
      new Date().getTime() -
      1000;
    setTimeout(() => this.rotateToken(), timeout);
  }

  private async createIdentityPayload() {
    const message = new Date().toISOString();
    const response = this.cryptoService!.dilithiumSign(
      this.authData!.mode,
      this.authData!.dilithiumPrivateKey,
      message,
    );
    if ('error' in response) {
      throw new Error(response.error);
    }
    return {
      signature: response.signature,
      message,
    };
  }

  private async instantiateWasm() {
    if (!this.cryptoService) {
      const go = new Go();
      const buf = await readFile(
        resolve(__dirname, '..', '..', 'crypto', 'crypto-ext.wasm'),
      );
      const wasm = await WebAssembly.instantiate(buf, go.importObject);
      go.run(wasm.instance);
      const {
        // @ts-ignore
        mglDilithiumGenerateKeys,
        // @ts-ignore
        mglDilithiumSign,
        // @ts-ignore
        mglDilithiumVerify,
        // @ts-ignore
        mglKyberGenerateKeys,
        // @ts-ignore
        mglKyberEncrypt,
        // @ts-ignore
        mglKyberDecrypt,
      } = globalThis;
      this.cryptoService = {
        dilithiumGenerateKeys: mglDilithiumGenerateKeys,
        dilithiumSign: mglDilithiumSign,
        dilithiumVerify: mglDilithiumVerify,
        kyberGenerateKeys: mglKyberGenerateKeys,
        kyberEncrypt: mglKyberEncrypt,
        kyberDecrypt: mglKyberDecrypt,
      };
    }
  }

  private checkState() {
    if (!this.token || !this.authData) {
      throw new NotInitializedError();
    }
  }
}
