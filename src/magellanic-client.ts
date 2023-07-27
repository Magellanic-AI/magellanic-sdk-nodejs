import { v4 as uuid } from 'uuid';
import axios, { AxiosInstance, isAxiosError } from 'axios';
import { decryptAes } from './helpers';
import { Request } from 'express';

const API_URL = 'https://api.magellanic.one/public-api/workloads';
const TDTI_ID_HEADER_NAME = 'magellanic-tdti-id';

/**
 * Magellanic SDK Client base class
 */
export class MagellanicClient {
  private readonly axiosInstance: AxiosInstance;
  private authRandomString: string;

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
  constructor(private readonly tdtiId: string) {
    this.authRandomString = uuid();
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        [TDTI_ID_HEADER_NAME]: tdtiId,
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
  async authenticate(): Promise<{ authenticated: boolean; reason?: string }> {
    try {
      await this.axiosInstance.post(`auth`, {
        randomString: this.authRandomString,
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
   * Method used to handle incoming webhook event. Its return value should be sent as a response.
   *
   * ```ts
   * public webhooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   *     try {
   *       const response = await magellanicClient.handleWebhook(req.body);
   *       res.status(200).send(response);
   *     } catch (error) {
   *       next(error);
   *     }
   *   };
   * app.get('/magellanic-webhook', async (req: Request, res: Response) => {
   *   const response = await magellanicClient.handleWebhook(req.body);
   *   res.status(200).send(response);
   * });
   * ```
   * @param payload request payload - Express.js Request object's body property
   * @returns promise with a boolean indicating the validation status of the payload
   */
  //TODO: errors handling
  async handleWebhook(payload: any): Promise<boolean> {
    if (!payload.action) {
      return false;
    }
    switch (payload.action) {
      case 'auth': {
        this.secret = payload.secret;
        return payload && payload.randomString === this.authRandomString;
      }
      case 'init': {
        const data = this.decryptPayload(payload);
        this.secret = data.secret;
        if (data.state) {
          this.currentTokensSecret = data.state.tokensSecret;
          this.currentTokens = data.state.tokens;
        }
        break;
      }
      case 'rotateTokens': {
        const data = this.decryptPayload(payload);
        this.secret = data.secret;
        this.previousTokensSecret = this.currentTokensSecret;
        this.currentTokensSecret = data.tokensSecret;
        this.previousTokens = this.currentTokens;
        this.currentTokens = data.tokens;
        this.previousToken = this.currentToken;
        this.currentToken = data.tokens[this.tdtiId];
        break;
      }
      case 'reauth': {
        await this.reauthenticate();
        break;
      }
      default:
        return false;
    }
    return true;
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
      TDTI_ID_HEADER: this.tdtiId,
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
    this.authRandomString = uuid();
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
