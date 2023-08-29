import { v4 as uuid } from 'uuid';
import axios, { AxiosInstance, isAxiosError } from 'axios';
import { Request } from 'express';
import { ClientOptions } from './types';
import { readFileSync } from 'fs';
import Go from '../crypto/wasm-exec.helper';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { DilithiumData } from './types/dilithium-data.interface';
import { AuthPayload } from './types/auth-payload.interface';
import { Provider } from './types/provider.type';
import { State } from './types/state.interface';
import {
  CryptoService,
  DilithiumMode,
} from '../crypto/crypto-service.interface';

const API_URL = 'https://api.magellanic.one/public-api/workloads';
const TDTI_ID_HEADER_NAME = 'magellanic-tdti-id';

/**
 * Magellanic SDK Client base class
 */
export class MagellanicClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly tdtiId: string;
  private readonly name: string;
  private readonly provider: Provider;
  private readonly projectKey: string;

  private state?: State;
  private prevState?: State;

  private cryptoService?: CryptoService;
  private dilithiumData?: DilithiumData;
  private nextPullTimeoutId?: number;

  /**
   * The constructor of the "MagellanicClient" class.
   *
   * Magellanic.
   * @param clientOptions
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
        throw new Error('Magellanic project key is undefined');
      }
    }
    if (!provider) {
      provider = 'k8s';
      // TODO: support other providers
      // provider = process.env.MAGELLANIC_PROVIDER_TYPE;
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
    this.tdtiId = `${projectKey}/${id}`;
    this.name = name;
    this.provider = <Provider>provider;
    this.projectKey = projectKey;
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        [TDTI_ID_HEADER_NAME]: this.tdtiId,
      },
    });
  }

  /**
   * Method used to authenticate the workload.
   *
   * <b>IMPORTANT: This method must be called after the webhook endpoint has been initialized. Magellanic will attempt
   * to send an HTTP request during authentication and the application must be already able to respond correctly to
   * complete the authentication process.</b>
   *
   * Does not throw errors, so it's safe to use in event listener function.
   *
   */
  async authenticate(): Promise<{ authenticated: boolean; reason?: any }> {
    let token;
    if (this.provider === 'k8s') {
      try {
        token = readFileSync(
          '/var/run/secrets/kubernetes.io/serviceaccount/token',
          { encoding: 'utf8' },
        );
      } catch (err) {
        return {
          authenticated: false,
          reason: err,
        };
      }
    }
    try {
      const payload: AuthPayload = {
        projectKey: this.projectKey,
        providerType: this.provider,
        name: this.name,
        token,
      };

      const response = await this.axiosInstance.post(`auth`, payload);
      if (!this.dilithiumData) {
        this.dilithiumData = response.data;
      }
      await this.instantiateWasm();
      await this.pullTokens();
      return {
        authenticated: true,
      };
    } catch (err) {
      if (isAxiosError(err)) {
        return {
          authenticated: false,
          reason: { message: err.message, response: err.response?.data },
        };
      } else {
        return {
          authenticated: false,
          reason: err,
        };
      }
    }
  }

  /**
   * Method used to obtain the latest workload's token.
   *
   * @returns the latest token of this workload
   */
  getMyToken() {
    if (!this.state) {
      throw new Error('not initialized');
    }
    return this.state.tokens[this.tdtiId];
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
   */
  generateHeaders(): Record<string, string> {
    if (!this.state) {
      throw new Error('not initialized');
    }
    return {
      Authorization: `Bearer ${this.getMyToken()}`,
      [TDTI_ID_HEADER_NAME]: this.tdtiId,
    };
  }

  /**
   * Method used to validate request from another workload. It throws errors on bad requests and returns nothing if
   * everything is as expected.
   * If you don't want to pass Express.js Request object, see {@link validateToken} method.
   *
   * @param req Express.js Request object
   */
  validateRequest(req: Request) {
    const tdtiId = req.header(TDTI_ID_HEADER_NAME);
    if (!tdtiId) {
      throw new Error('tdtiId header not defined');
    }
    const tokenHeader = req.header('Authorization');
    if (!tokenHeader) {
      throw new Error('Authorization header not defined');
    }
    const token = tokenHeader.split(' ')[1];
    return this.validateToken(tdtiId, token);
  }

  /**
   * Method used to validate token. It throws errors on bad requests and returns nothing if
   * everything is as expected.
   *
   * See {@link validateRequest} method if using Express.js
   *
   * @param tdtiId unique sender's TDTI ID (acquired from the "magellanic-tdti-id" header)
   * @param token sender's token (acquired from the "Authorization" header. Remove the "Bearer " prefix first)
   */
  async validateToken(tdtiId: string, token: string) {
    if (!this.state) {
      throw new Error('not initialized');
    }
    if (this.state.tokens[tdtiId] !== token) {
      if (this.prevState?.tokens[tdtiId] !== token) {
        await this.pullTokens();
        if (this.state.tokens[tdtiId] !== token) {
          if (this.prevState?.tokens[tdtiId] !== token) {
            throw new Error('bad token');
          }
        }
      }
    }
  }

  async kyberGenerateKeys() {
    await this.instantiateWasm();
    const kyberGenerateKeysResponse = this.cryptoService!.kyberGenerateKeys();
    if ('error' in kyberGenerateKeysResponse) {
      throw new Error(kyberGenerateKeysResponse.error);
    }
    return kyberGenerateKeysResponse;
  }

  async kyberEncrypt(publicKey: string) {
    await this.instantiateWasm();
    const kyberEncryptResponse = this.cryptoService!.kyberEncrypt(publicKey);
    if ('error' in kyberEncryptResponse) {
      throw new Error(kyberEncryptResponse.error);
    }
    return kyberEncryptResponse;
  }

  async kyberDecrypt(privateKey: string, ciphertext: string) {
    await this.instantiateWasm();
    const kyberDecryptResponse = this.cryptoService!.kyberDecrypt(
      privateKey,
      ciphertext,
    );
    if ('error' in kyberDecryptResponse) {
      throw new Error(kyberDecryptResponse.error);
    }
    return kyberDecryptResponse;
  }

  async dilithiumGenerateKeys(mode: DilithiumMode) {
    await this.instantiateWasm();
    const dilithiumGenerateKeysResponse =
      this.cryptoService!.dilithiumGenerateKeys(mode);
    if ('error' in dilithiumGenerateKeysResponse) {
      throw new Error(dilithiumGenerateKeysResponse.error);
    }
    return dilithiumGenerateKeysResponse;
  }

  async dilithiumSign(
    mode: DilithiumMode,
    privateKey: string,
    message: string,
  ) {
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

  async dilithiumVerify(
    mode: DilithiumMode,
    publicKey: string,
    message: string,
    signature: string,
  ) {
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
  private async pullTokens() {
    clearTimeout(this.nextPullTimeoutId);
    const payload = await this.createIdentityPayload();
    const response = await this.axiosInstance.post('pull-tokens', payload);
    this.state = response.data.state;
    if (response.data.prevState) {
      this.prevState = response.data.prevState;
    }
    const timeout =
      new Date(this.state!.nextRotation).getTime() - new Date().getTime();
    setTimeout(() => this.pullTokens(), timeout > 0 ? timeout : 60 * 1000);
  }

  private async createIdentityPayload() {
    const message = new Date().toISOString();
    const response = this.cryptoService!.dilithiumSign(
      this.dilithiumData!.mode,
      this.dilithiumData!.privateKey,
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
}
