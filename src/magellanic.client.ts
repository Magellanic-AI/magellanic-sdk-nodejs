import { v4 as uuid } from 'uuid';
import axios, { AxiosInstance } from 'axios';

const API_URL = 'https://api.magellanic.one';

export class MagellanicClient {
  private readonly randomInitString: string;
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly tdtiId: string) {
    this.randomInitString = uuid();
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'magellanic-tdti-id': tdtiId,
      },
    });
  }

  async authenticate() {
    await this.axiosInstance.post(`workloads`, {
      randomString: this.randomInitString,
    });
  }

  validateAuthWebhookPayload(payload: any): {
    result: boolean;
  } {
    return {
      result: payload && payload.randomString === this.randomInitString,
    };
  }
}
