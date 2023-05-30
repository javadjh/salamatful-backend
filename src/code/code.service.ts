import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import kavenegar from "src/lib/kavenegar";
import { UserDocument } from "src/user/user.schema";
import { hashPassword } from "src/util";
import { CodeDocument } from "./code.schema";
import { Sms } from "src/utility/Sms";

@Injectable()
export class CodeService {
  constructor(
    @InjectModel("Code") private codeModel: Model<CodeDocument>,
    @InjectModel("User") private userModel: Model<UserDocument>
  ) {}

  async createCode({ phone }) {
    try {
      if (phone) {
        const account = await this.userModel.findOne({ phone });
        if (account) {
          const userCantGetAnotherCode = await this.codeModel.findOne({
            phone,
          });
          if (!userCantGetAnotherCode) {
            const code = this.generateCodeDigits();
            const time = this.setTimeForNextCode();
            await this.codeModel.create({ phone, code, validDate: time });
            // await kavenegar.sendForgotPasswordCode({ phone, code });
            await Sms.sendSms(
              "forgotpasswordcode",
              {
                token: code,
              },
              phone
            );
            return { time };
          } else if (userCantGetAnotherCode.validDate > new Date()) {
            return {
              code: 0,
              message: "Your previous code has not expired yet",
            };
          } else {
            const code = this.generateCodeDigits();
            const validDate = this.setTimeForNextCode();
            await this.codeModel.updateOne(
              { phone, code: userCantGetAnotherCode.code },
              { code, validDate }
            );
            // await kavenegar.sendForgotPasswordCode({ phone, code });
            await Sms.sendSms(
              "forgotpasswordcode",
              {
                token: code,
              },
              phone
            );
            return { time: validDate };
          }
        } else {
          return {
            code: 0,
            message: "No account exists with this phone number in the database",
          };
        }
      } else {
        return { code: 0, message: "Please fill the phone number field" };
      }
    } catch (error) {
      return {
        code: -1,
        message: "Error occurred: while creating a code in the code service",
      };
    }
  }

  async validateCodeWithPhoneNumber({ phone, code, pass }) {
    try {
      if (phone && code && pass) {
        const account = await this.userModel.findOne({ phone });
        if (account) {
          const codeIsValid = await this.codeModel.findOne({ phone, code });
          if (codeIsValid && codeIsValid.validDate > new Date()) {
            await this.codeModel.deleteOne({ phone, code });
            pass = hashPassword(pass);
            await this.userModel.updateOne({ phone }, { pass });
            return { code: 1, message: "Password updated successfully" };
          } else {
            return { code: -1, message: "Entered code is not valid" };
          }
        } else {
          return { code: 0, message: "No account matched the phone number" };
        }
      } else {
        return {
          code: 0,
          message: "Missing attributes: Phone and Code and Password",
        };
      }
    } catch (error) {
      return {
        code: -1,
        message:
          "Error occurred: while trying to validate the code with the phone number",
      };
    }
  }

  generateCodeDigits() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  setTimeForNextCode() {
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 6);
    return currentTime;
  }
}
