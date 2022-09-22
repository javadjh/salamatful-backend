import axios from 'axios';
import { getEnv } from '../util';

class Kavenegar {
  async sendVerificationSMS({ phone, code }) {
    let endpoint = this._generateEndpoint('verify/lookup.json');

    console.log({ phone, code, apiKey: getEnv('KAVENEGAR_API_KEY') });

    return await this._sendPostRequest(endpoint, {
      receptor: phone,
      token: code,
      template: getEnv('KAVENEGAR_VERIFY_TEMPLATE'),
    });
  }

  async sendForgotPasswordCode({ phone, code }) {
    let endpoint = this._generateEndpoint('verify/lookup.json');

    console.log({ phone, code, apiKey: getEnv('KAVENEGAR_API_KEY') });

    return await this._sendPostRequest(endpoint, {
      receptor: phone,
      token: code,
      template: getEnv('KAVENEGAR_VERIFY_TEMPLATE'),
    });
  }

  async sendSucceedPurchaseMessage({ phone, message }) {
    let endpoint = this._generateEndpoint('/sms/send.json');
    return await this._sendPostRequest(endpoint, {
      receptor: phone,
      message,
    });
  }

  async _sendPostRequest(endpoint, params) {
    let data: any = new URLSearchParams();
    for (let key in params) {
      data.append(key, params[key]);
    }

    return await axios.post(endpoint, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  _generateEndpoint(method) {
    let apiBase = getEnv('KAVENEGAR_API_BASE');
    let apiKey = getEnv('KAVENEGAR_API_KEY');
    return `${apiBase}/${apiKey}/${method}`;
  }
}

export default new Kavenegar();
