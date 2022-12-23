/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import axios from "axios";
import { Model } from "mongoose";
import { CourseDocument } from "src/course/course.schema";
import { TokensDocument } from "src/token/token.schema";
import { TempUserDocument } from "./tempUser.schema";
import { TokenBase, TokenGenerator } from "ts-token-generator";
import { UserDocument } from "./user.schema";
import config from "src/config";
import { isDev, isProduction, normalizePhoneNumber } from "../util";
import kavenegar from "../lib/kavenegar";
import parsePhoneNumber from "libphonenumber-js";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import * as mime from "mime";
import * as sharp from "sharp";
import * as uuid from "uuid";
import { ProgressDocument } from "src/progress/progress.schema";
import { AudioDocument } from "src/audio/audio.schema";
import { VideoDocument } from "src/video/video.schema";
import { WalletDocument } from "../wallet/wallet.schema";

export const farazSmsURL = "https://ippanel.com/api/select";
export const smsUsername = "09396057575";
export const smsPassword = "0014966786";
export const smsLine = "+983000505";
export const verificationCodePatternId = "puqq3wa58w";
export const tokenGenerator = new TokenGenerator({
  bitSize: 512,
  baseEncoding: TokenBase.BASE62,
});
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const finalPath = isProduction()
  ? "//var/www/admin.salamatful.com/source/public"
  : "public";

@Injectable()
export class UserService {
  constructor(
    @InjectModel("User") private UserModel: Model<UserDocument>,
    @InjectModel("Token") private tokenModel: Model<TokensDocument>,
    @InjectModel("Course") private courseModel: Model<CourseDocument>,
    @InjectModel("TempUser") private tempUserModel: Model<TempUserDocument>,
    @InjectModel("Progress") private progressModel: Model<ProgressDocument>,
    @InjectModel("Audio") private audioModel: Model<AudioDocument>,
    @InjectModel("Video") private videoModel: Model<VideoDocument>,
    @InjectModel("Wallet") private walletModel: Model<WalletDocument>
  ) {}

  async verifyPhone(body): Promise<any> {
    try {
      let { phone } = body;
      phone = normalizePhoneNumber(phone);
      if (phone) {
        const code = `${Math.floor(Math.random() * 90000) + 10000}`;
        const userExists = await this.UserModel.findOne({
          phone: phone,
          validated: true,
        });
        if (userExists) {
          return { code: 0, message: "Sign in to your account" };
        } else {
          await this.tempUserModel.deleteMany({ phone: phone });
          await this.tempUserModel.create({
            phone: phone,
            smsCode: code,
          });
        }
        // send verification code
        return await this.sendVerificationSMS(phone, code);
      }
      return { code: 0, message: "Phone number missed" };
    } catch (error) {
      return { code: -1, message: error };
    }
  }

  async sendVerificationSMS(phone, code): Promise<any> {
    try {
      return await this.sendSMS({ phone, code });
    } catch (error) {
      return { code: -1, message: error };
    }
  }

  /**
   * Verify phone number.
   *
   * @param body
   */
  async verifyCode(body): Promise<any> {
    try {
      let { phone, code } = body;

      phone = normalizePhoneNumber(phone);

      const user = await this.tempUserModel.findOne({
        phone: phone,
        smsCode: code,
      });
      if (user) {
        await this.tempUserModel.updateOne(
          { _id: user._id },
          { confirmed: true }
        );
        const token = tokenGenerator.generate();
        await this.tokenModel.create({
          userId: user._id.toString(),
          token,
        });

        return { code: 1, data: user, token };
      }
      return { code: 0, message: "Invalid code or phone number" };
    } catch (error) {
      return { code: -1, message: error };
    }
  }
  /**
   *
   * @param body
   * @returns object
   */
  async createAccount(body): Promise<any> {
    try {
      let { phone, name, pass } = body;
      phone = normalizePhoneNumber(phone);
      const tempUserExists = await this.tempUserModel.findOne({
        phone: phone,
      });
      if (phone && tempUserExists) {
        const newUser = await this.UserModel.create({
          name: name,
          role: "user",
          pass: `${this.hashPassword(pass)}`,
          phone: tempUserExists.phone,
          validated: true,
        });
        await this.walletModel.create({ userId: newUser.id });
        await this.tempUserModel.deleteMany({ phone: phone });
        const user = await this.UserModel.findOne(
          { phone: phone },
          "_id name phone validated"
        );
        const newToken = tokenGenerator.generate();
        await this.tokenModel.create({
          userId: user._id.toString(),
          token: newToken,
        });
        return {
          code: 1,
          data: await this.UserModel.findOne(
            { phone: phone, validated: true },
            "_id name"
          ),
          token: newToken,
        };
      }
      return { code: 0, message: "Incorrect Data" };
    } catch (error) {
      return { code: -1, message: error };
    }
  }

  async signIn(body): Promise<any> {
    try {
      let { phone, pass } = body;
      phone = normalizePhoneNumber(phone);
      if (phone && pass) {
        const user = await this.UserModel.findOne(
          { phone: phone, validated: true },
          "_id name year phone sub progress validated pass"
        );
        if (user) {
          if (this.verifyPassword(pass, user.pass)) {
            const tokenExists = await this.tokenModel.findOne({
              userId: user._id.toString(),
            });
            let token;
            if (!tokenExists) {
              const newToken = tokenGenerator.generate();
              await this.tokenModel.create({
                userId: user._id.toString(),
                token: newToken,
              });
              token = newToken;
            } else {
              token = tokenExists.token;
            }
            return {
              code: 1,
              data: {
                _id: user.id,
                name: user.name,
              },
              token,
            };
          } else {
            return { code: -1, message: "Wrong Password" };
          }
        } else {
          return { code: -1, message: "No match found" };
        }
      } else {
        return { code: -1, message: "Some parameters have been missed." };
      }
    } catch (error) {
      return { code: -1, message: "An Error Occurred" };
    }
  }

  async updateAvatar(userId: string, bg): Promise<any> {
    try {
      const user = await this.UserModel.findById(userId);
      if (user) {
        if (bg) {
          if (user.bg && user.bg.path) {
            await this.delete([user.bg.path], "profiles");
          }
          const files = await this.save([bg], "profiles");
          await this.UserModel.updateOne(
            { _id: user._id },
            {
              bg: files[0],
              bgURL: `${config.serverURL}${config.profiles}/${files[0].path}`,
            }
          );
        }
        const profile = await this.UserModel.findById(
          user.id,
          "_id name year phone sub progress validated cDate uDate bg"
        );
        profile.bg.path = `${config.serverURL}${config.profiles}/${profile.bg.path}`;
        return {
          code: 1,
          user: profile,
        };
      }
      return { code: 0, message: "No match found" };
    } catch (error) {
      return { code: -1, message: error };
    }
  }

  async updateName(userId, body): Promise<any> {
    try {
      const { name } = body;
      const user = await this.UserModel.findById(userId);
      if (user && name) {
        await this.UserModel.updateOne({ _id: user._id }, { name });
        const profile = await this.UserModel.findById(
          user.id,
          "_id name year phone sub progress validated cDate uDate bg"
        );
        profile.bg.path = `${config.serverURL}${config.profiles}/${profile.bg.path}`;
        return {
          code: 1,
          user: profile,
        };
      }
      return { code: 0, message: "Some of the parameters have been missed" };
    } catch (error) {
      return { code: -1, message: "An error occurred" };
    }
  }

  async getUser(userId): Promise<any> {
    try {
      const user =
        userId && (await this.UserModel.findById(userId, "_id progress"));
      if (user) {
        await this.UserModel.updateOne(
          { _id: user._id },
          {
            $inc: {
              "progress.days":
                user.progress.last &&
                new Date().getDay() - user.progress.last.getDay() != 0
                  ? 1
                  : 0,
            },
            $set: { "progress.last": new Date() },
          }
        );
        const audios = await this.progressModel.find(
          { uId: userId, t: "audio" },
          "oId"
        );
        const videos = await this.progressModel.find(
          { uId: userId, t: "video" },
          "oId"
        );
        let minsOfAudio = 0;
        let minsOfVideo = 0;
        let minsOfMeditaion = 0;
        let minsOfPractice = 0;
        audios.map(async (audio) => {
          const document = await this.audioModel.findById(
            audio.oId,
            "length type"
          );
          if (document.type === "meditation") {
            minsOfMeditaion += document.length;
          } else if (document.type === "practice") {
            minsOfPractice += document.length;
          }
          minsOfAudio += document.length;
        });
        videos.map(async (video) => {
          const document = await this.videoModel.findById(
            video.oId,
            "length type"
          );
          if (document.type === "meditation") {
            minsOfMeditaion += document.length;
          } else if (document.type === "practice") {
            minsOfPractice += document.length;
          }
          minsOfVideo += document.length;
        });
        const u = await this.UserModel.findById(
          userId,
          "name sub progress validated bg cDate uDate"
        );
        return {
          code: 1,
          data: {
            name: u.name,
            sub: u.sub,
            progress: u.progress,
            validated: u.validated,
            bg: u.bg && `${config.serverURL}${config.profiles}/${u.bg.path}`,
            cDate: u.cDate,
            uDate: u.uDate,
            minsOfAudio,
            minsOfVideo,
            minsOfMeditaion,
            minsOfPractice,
          },
        };
      }
      return { code: 0, message: `Invalid user Id.` };
    } catch (error) {
      return { code: -1, message: "Error Occurred" };
    }
  }
  /**
   * Sends verification code to the phone.
   *
   * @param data
   */
  async sendSMS(data): Promise<any> {
    try {
      let { phone, code } = data;
      phone = normalizePhoneNumber(phone);

      const res = await kavenegar.sendVerificationSMS({
        phone,
        code,
      });

      return { code: 1, message: "Code sent successfully" };
    } catch (error) {
      let message = "";
      if (error.response) {
        message = error.response.data.return.message;
      }
      return { code: -1, message };
    }
  }

  /**
   * The old way of sending verification code using faraz SMS api.
   *
   * @param data
   * @deprecated
   */
  async _sendSMSDeprecated(data): Promise<any> {
    try {
      if (isDev()) {
        return { code: 1, message: "" };
      }

      const res = await axios.post(farazSmsURL, {
        op: "pattern",
        user: smsUsername,
        pass: smsPassword,
        fromNum: smsLine,
        toNum: data.phone,
        patternCode: verificationCodePatternId,
        inputData: [{ "verification-code": data.message }],
      });

      return { code: 1, message: res.data };
    } catch (error) {
      return { code: -1, message: error };
    }
  }

  // get favorite courses
  async getFavoriteCourses(userId): Promise<any> {
    try {
      const result = [];
      const user = await this.UserModel.findById(userId, "fav");
      for (const fav of user.fav) {
        const course = await this.courseModel.findById(fav.cId, "bg slug");
        result.push({
          cId: fav.cId,
          slug: course.slug,
          name: fav.name,
          bg: `${config.serverURL}${config.courseImages}/${course.bg.path}`,
        });
      }
      return result;
    } catch (error) {
      return { code: -1, message: "Invalid user Id." };
    }
  }

  async getdefaultcourses(): Promise<any> {
    try {
    } catch (error) {
      return { code: -1, message: "Invalid user Id." };
    }
  }

  // check account subscription
  async verifySubscription(userId): Promise<any> {
    try {
      const user = await this.UserModel.findOne(userId, "_id sub");
      let isVerified = false;
      if (user) {
        if (user.sub.getTime() >= new Date().getTime()) {
          isVerified = true;
        }
      }
      return isVerified;
    } catch (error) {
      return { code: -1, message: "Error occurred." };
    }
  }

  // check if course have been liked
  async checkCourseLiked(body, userId): Promise<any> {
    try {
      const { courseId } = body;
      return {
        code: 1,
        data: (await this.UserModel.findOne({
          $and: [{ _id: userId }, { fav: { $elemMatch: { cId: courseId } } }],
        }))
          ? true
          : false,
      };
    } catch (error) {
      return { code: -1, message: error };
    }
  }

  async logout(userId) {
    try {
      if (!userId) return { code: 0, msg: "Invalid data." };
      const user = await this.UserModel.findById(userId, "_id phone");
      if (!user) return { code: 0, msg: "Invalid data." };
      await this.tokenModel.deleteMany({ userId });
      return { code: 1, msg: "Account logged out successfully." };
    } catch (error) {
      return { code: -1, message: error };
    }
  }

  // hash password
  hashPassword(password): Promise<any> {
    return bcrypt.hashSync(password, salt);
  }

  // compare passwords on user sign in
  verifyPassword(rawPassword, hashedPassword): Promise<any> {
    return bcrypt.compareSync(rawPassword, hashedPassword);
  }

  /**
   * Validates a given phone number and ensure it's valid.
   *
   * @param phone
   */
  validatePhone(phone): any {
    phone = normalizePhoneNumber(phone);

    const phoneNumber = parsePhoneNumber(phone);
    if (phoneNumber && phoneNumber.isValid()) {
      return {
        status: "success",
        message: "شماره تلفن صحیح است.",
        normalizedNumber: phoneNumber.number,
      };
    }
    return { status: "error", message: "شماره تلفن وارد شده صحیح نمی باشد." };
  }

  // file handler methods
  async save(
    files: Array<any>,
    dest: string,
    otherOptions?: any
  ): Promise<any> {
    if (!Array.isArray(files)) {
      files = [files];
    }

    let output = [];
    for (let file of files) {
      const prefix = config[dest] || config["defaultImages"];
      const subFolder =
        otherOptions && otherOptions.subFolder ? otherOptions.subFolder : "";
      const filename = uuid.v1() + "." + file.originalname.split(".").pop();
      const pathToOutput = join(prefix, subFolder, filename);
      const pathToWrite = join(finalPath, pathToOutput);

      await this.compressAndSave({
        input: file.buffer,
        fileOut: pathToWrite,
        mimetype: file.mimetype,
      });

      output.push({
        name: file.originalname,
        path: filename,
        mime: file.mimetype,
      });
    }

    return output;
  }

  async delete(paths, dest): Promise<any> {
    try {
      if (!Array.isArray(paths)) {
        paths = [paths];
      }
      const prefix = dest ? config[dest] || config["defaultImages"] : "";
      if (!prefix) return false;
      for (let path of paths) {
        if (!path.startsWith("public")) path = join(finalPath, prefix, path);

        if (existsSync(path)) {
          unlinkSync(path);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async compressAndSave({ input, fileOut, mimetype }): Promise<any> {
    if (!config.imageCompression.enable || mime.extension(mimetype) === "gif") {
      return new Promise((resolve, reject) => {
        writeFileSync(fileOut, fileOut, { mode: 0o777, flag: "wx" });
        resolve("");
      });
    }

    let compressed = await sharp(input).resize(
      config.imageCompression.maxWidth,
      config.imageCompression.maxHeight,
      {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      }
    );

    compressed = await this.compressByMimeType(compressed, {
      mimetype,
      quality: config.imageCompression.quality,
    });

    return await compressed.toFile(fileOut);
  }

  async compressByMimeType(sharp, { mimetype, quality }): Promise<any> {
    switch (mime.extension(mimetype)) {
      case "jpeg":
        if (config.imageCompression.useWebpForJPEG) {
          return await sharp.webp({ quality });
        }
        return await sharp.jpeg({ quality });
      case "png":
        if (config.imageCompression.useWebpForPNG) {
          return await sharp.webp({ quality });
        }
        return await sharp.png({ quality });
    }

    return sharp;
  }
}
