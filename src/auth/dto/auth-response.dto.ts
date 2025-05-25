import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../schemas/user.schema';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => User)
  user: User;
}