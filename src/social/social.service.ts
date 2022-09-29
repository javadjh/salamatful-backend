import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SocialDocument } from "./social.schema";

@Injectable()
export class SocialService {
  constructor(
    @InjectModel("Social") private socialModel: Model<SocialDocument>
  ) {
  }

  async getAllSocialConnections(): Promise<any> {
    try {
      return await this.socialModel.find();
    } catch (error) {
      return { code: -1, message: "An Error Occurred" };
    }
  }

  async createSocial(body): Promise<any> {
    try {
      return await this.socialModel.create(body);
    } catch(error) {
      return { code: -1, message: 'An Error Occurred' }
    }
  }
}
