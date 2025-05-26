import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
@ObjectType()
export class User {
    @Field(() => ID)
    _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    @Field()
    username: string;

    @Prop({ required: true, unique: true })
    @Field()
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: Date.now })
    @Field()
    createdAt: Date;

    @Prop({ default: Date.now })
    @Field()
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);