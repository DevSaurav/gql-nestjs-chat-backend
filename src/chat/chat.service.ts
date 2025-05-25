import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';

import { Message, MessageDocument } from './schemas/message.schema';
import { User } from '../auth/schemas/user.schema';
import { SendMessageInput } from './dto/send-message.input';
import { AuthService } from '../auth/auth.service';

const pubSub = new PubSub();

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private authService: AuthService,
  ) { }

  async sendMessage(sendMessageInput: SendMessageInput, user: User): Promise<Message  | null> {
    const { content } = sendMessageInput;

    // Create message
    const message = new this.messageModel({
      content,
      userId: user._id,
    });

    const savedMessage = await message.save();

    // Populate user data for the response
    const populatedMessage = await this.messageModel
      .findById(savedMessage._id)
      .populate('userId', 'username email _id createdAt updatedAt')
      .exec();

    // Transform for GraphQL response
    const messageWithUser = populatedMessage?{
      userId: populatedMessage?.userId,
      content: populatedMessage?.content,
      createdAt: populatedMessage?.createdAt,
      updatedAt: populatedMessage?.updatedAt,
      // ...populatedMessage?.toObject(),
      user,
    }  : null;

    // Publish to subscription
    pubSub.publish('messageAdded', { messageAdded: messageWithUser });

    return messageWithUser;
  }

  async getMessages(): Promise<Message[]> {
    const messages = await this.messageModel
      .find()
      .populate('userId', 'username email _id createdAt updatedAt')
      .sort({ createdAt: 1 })
      .exec();

    // Transform for GraphQL response
    return messages.map(message => ({
      ...message?.toObject(),
      // user: message?.userId,
    }));
  }

  messageAdded() {
    return pubSub.asyncIterableIterator('messageAdded');
  }
}