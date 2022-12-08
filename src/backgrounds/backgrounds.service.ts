import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import config from "src/config";
import { BackgroundDocument } from "./backgrounds.schema";

@Injectable()
export class BackgroundsService {
  constructor(
    @InjectModel("Background") private backgroundModel: Model<BackgroundDocument>
  ) {
  }

  async getRandomly(body): Promise<any> {
    try {
      const { type, time } = body;
      if (type && time) {
        const count_of_backgrounds = await this.backgroundModel.find().count();
        const random = Math.floor(Math.random() * count_of_backgrounds);
        let bg = await this.backgroundModel.find({
          types: type,
          times: time
        }, "url file wide").skip(random).limit(1);
        // @ts-ignore
        bg = bg[0]
        if (bg["url"]) {
          return bg;
        } else if (bg["file"]) {
          bg["file"].path = `${config.serverURL}${config.backgrounds}/${bg["file"].path}`;
          return bg;
        } else {
          return { code: 0, message: 'No background found' }
        }
      } else {
        return { code: 0, message: "Some of the parameters have been missed (type or time)" };
      }
    } catch (error) {
      console.error(error);
      return { code: -1, message: "Error occurred while getting a random background" };
    }
  }
}
