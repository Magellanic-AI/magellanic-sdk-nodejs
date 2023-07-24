import { v4 as uuid } from 'uuid';
import axios, { AxiosInstance } from 'axios';
import { decryptAes } from './helpers';
import { Request } from 'express';

const API_URL = 'https://api.magellanic.one/public-api/workloads';
const TDTI_ID_HEADER_NAME = 'magellanic-tdti-id';

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

  constructor(private readonly tdtiId: string) {
    this.authRandomString = uuid();
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        [TDTI_ID_HEADER_NAME]: tdtiId,
      },
    });
  }

  async authenticate(reauth = false) {
    if (reauth) {
      this.authRandomString = uuid();
    }
    await this.axiosInstance.post(`auth`, {
      randomString: this.authRandomString,
    });
  }

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
        await this.authenticate(true);
        break;
      }
      default:
        return false;
    }
    return true;
  }

  getMyToken() {
    if (!this.currentToken) {
      throw new Error('not initialized');
    }
    return this.currentToken;
  }

  generateHeaders(): Record<string, string> {
    if (!this.currentToken) {
      throw new Error('not initialized');
    }
    return {
      Authorization: `Bearer ${this.currentToken}`,
      TDTI_ID_HEADER: this.tdtiId,
    };
  }

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

  private decryptPayload(payload: any) {
    if (!this.secret) {
      throw new Error('secret not set');
    }
    const decrypted = decryptAes(payload.encrypted, this.secret);
    return JSON.parse(decrypted);
  }
}
