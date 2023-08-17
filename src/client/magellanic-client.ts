import { v4 as uuid } from 'uuid';
import axios, { AxiosInstance, isAxiosError } from 'axios';
import { decryptAes } from '../helpers';
import { Request } from 'express';
import { ClientOptions } from './interfaces';
import { readFileSync } from 'fs';

const API_URL = 'https://api.magellanic.one/public-api/workloads';
const ID_HEADER_NAME = 'magellanic-workload-id';

/**
 * Magellanic SDK Client base class
 */
export class MagellanicClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly id: string;
  private readonly name: string;
  private readonly provider: string;
  private readonly projectKey: string;

  private currentTokensSecret?: string;
  private previousTokensSecret?: string;

  private secret?: string;
  private currentTokens?: Record<string, string>;
  private previousTokens?: Record<string, string>;
  private currentToken?: string;
  private previousToken?: string;

  /**
   * The constructor of the "MagellanicClient" class.
   *
   * @param tdtiId unique TDTI ID assigned by Magellanic to the workload. Can be found on the workload's details page in
   * Magellanic.
   */
  constructor({ projectKey, provider, name }: ClientOptions) {
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
    this.id = id;
    this.name = name;
    this.provider = provider;
    this.projectKey = projectKey;
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        [ID_HEADER_NAME]: id,
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
      await this.axiosInstance.post(`auth`, {
        projectKey: this.projectKey,
        providerType: this.provider,
        name: this.name,
        token,
      });
      return {
        authenticated: true,
      };
    } catch (err) {
      if (isAxiosError(err)) {
        return {
          authenticated: false,
          reason: err.message,
        };
      } else {
        return {
          authenticated: false,
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
    if (!this.currentToken) {
      throw new Error('not initialized');
    }
    return this.currentToken;
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
    if (!this.currentToken) {
      throw new Error('not initialized');
    }
    return {
      Authorization: `Bearer ${this.currentToken}`,
      [ID_HEADER_NAME]: this.id,
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
    const tdtiId = req.header(ID_HEADER_NAME);
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
  validateToken(tdtiId: string, token: string) {
    if (!this.currentTokens) {
      throw new Error('not initialized');
    }
    const currentToken = this.currentTokens[tdtiId];
    if (currentToken !== token) {
      const previousToken = this.previousTokens?.[tdtiId];
      if (!previousToken) {
        throw new Error('bad token');
      }
    }
  }

  private reauthenticate() {
    return this.authenticate();
  }

  private decryptPayload(payload: any) {
    if (!this.secret) {
      throw new Error('secret not set');
    }
    const decrypted = decryptAes(payload.encrypted, this.secret);
    return JSON.parse(decrypted);
  }
}
