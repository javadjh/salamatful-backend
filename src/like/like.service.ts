import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LikeDocument } from "./like.schema";

@Injectable()
export class LikeService {
  constructor(
    @InjectModel("Like") private likeModel: Model<LikeDocument>
  ) {
  }

  async createLike(body, uId) {
    const { objId, cat } = body;
    if (objId && cat && uId) {
      const recordExists = await this.likeModel.findOne({ uId, objId, cat });
      if (recordExists) {
        await this.likeModel.deleteOne({ id: recordExists.id });
        return { code: 1, message: "Record deleted successfully" };
      } else {
        await this.likeModel.create({ objId, cat, uId });
        return { code: 1, message: "Record created successfully" };
      }
    }
    return { code: -1, message: "Some parameters have been missed" };
  }
}
