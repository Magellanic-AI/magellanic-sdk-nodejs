import { v4 as uuid } from 'uuid';
import axios, { AxiosInstance } from 'axios';
import { decryptAes } from './helpers';

const API_URL = 'https://api.magellanic.one/public-api/workloads';

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
        'magellanic-tdti-id': tdtiId,
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
        this.currentToken = data.myToken;
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

  private decryptPayload(payload: any) {
    if (!this.secret) {
      throw new Error('secret not set');
    }
    const decrypted = decryptAes(payload.encrypted, this.secret);
    return JSON.parse(decrypted);
  }
}
