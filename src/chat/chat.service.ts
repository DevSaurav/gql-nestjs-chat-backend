import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';

import { Message, MessageDocument } from './schemas/message.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { SendMessageInput } from './dto/send-message.input';
import { AuthService } from '../auth/auth.service';

const pubSub = new PubSub();

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,

    private authService: AuthService,
  ) {}

  /**
   * Send messages between the users from chat box
   * @param sendMessageInput
   * @param user
   * @returns Object
   */
  async sendMessage(
    sendMessageInput: SendMessageInput,
    user: User,
  ): Promise<Message | null> {
    const { content, receiverId } = sendMessageInput;

    // Create message
    const message = new this.messageModel({
      content,
      receiverId: new mongoose.Types.ObjectId(receiverId),
      userId: user._id,
    });

    const savedMessage = await message.save();

    // Populate user data for the response
    const populatedMessage = await this.messageModel
      .findById(savedMessage._id)
      .populate({
        path: 'userId',
        select: 'username email _id createdAt updatedAt',
      })
      .populate({
        path: 'receiverId',
        select: 'username email _id createdAt updatedAt',
      })
      .exec();
    // Transform for GraphQL response
    const messageWithUser = populatedMessage
      ? {
          ...populatedMessage?.toObject(),
          user: populatedMessage?.userId,
          receiver: populatedMessage?.receiverId,
        }
      : null;

    // Publish to subscription
    pubSub.publish('messageAdded', { messageAdded: messageWithUser });

    return messageWithUser;
  }

  /**
   * Get messages between me and current user from inbox
   * @param user
   * @returns Object
   */
  async getMessages(user: User, receiverId): Promise<Message[]> {
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
    const messages = await this.messageModel
      //get messages sent by me or sent to me by a user
      .find({
        $or: [{ $and: [{ userId: user._id }, { receiverId: receiverObjectId }] }, { $and: [{ receiverId: user._id }, { userId: receiverObjectId}] }],
      })
      .populate({
        path: 'userId',
        select: 'username email _id createdAt updatedAt',
      })
      .populate({
        path: 'receiverId',
        select: 'username email _id createdAt updatedAt',
      })
      .sort({ createdAt: 1 })
      .exec();

    // Transform for GraphQL response
    return messages.map((message) => ({
      ...message?.toObject(),
      user: message?.userId,
      receiver: message?.receiverId,
    }));
  }

  /**
   * Get all users for inbox
   * @param user
   * @returns Object
   */
  async getInboxUsers(user: User): Promise<User[]> {
    const users = await this.userModel
      //get messages sent by me or sent to me by a user
      .find({_id: {$ne:user._id}})
      .sort({ createdAt: 1 })
      .exec();

    // Transform for GraphQL response
    return users;
  }

  /**
   * Subscription function
   * @returns null
   */
  messageAdded() {
    return pubSub.asyncIterableIterator('messageAdded');
  }
}
