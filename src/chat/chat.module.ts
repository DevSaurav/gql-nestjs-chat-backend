import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Message, MessageSchema } from './schemas/message.schema';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from 'src/auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema },{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  providers: [ChatService, ChatResolver],
})
export class ChatModule {}