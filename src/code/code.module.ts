import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CodeSchema } from './code.schema';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Code', schema: CodeSchema },
    { name: 'User', schema: UserSchema }
  ])],
  controllers: [CodeController],
  providers: [CodeService]
})
export class CodeModule {}
