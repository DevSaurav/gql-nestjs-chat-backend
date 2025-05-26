import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  receiverId: string;
}