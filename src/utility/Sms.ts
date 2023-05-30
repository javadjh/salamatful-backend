import axios from "axios";

export class Sms {
  static async sendSms(template: string, tokens: any, phone: string) {
    let baseUrl =
      "https://api.kavenegar.com/v1/6437747A4B38423271357977414A6B6C6B6D484F666B6B584D57445475444538474E6E7777424A784F42633D/verify/lookup.json";
    const res = await axios.get(baseUrl, {
      params: {
        receptor: phone,
        ...tokens,
        template,
      },
    });

    return res;
  }
}
