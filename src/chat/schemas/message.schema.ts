import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../auth/schemas/user.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Message {
  @Field(() => ID,)
  _id?: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Field(() => ID)
  userId: User;

  @Field(() => User)
  user: User;

  @Prop({ default: Date.now })
  @Field()
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field()
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);