import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import { Message } from './schemas/message.schema';
import { User } from '../auth/schemas/user.schema';
import { SendMessageInput } from './dto/send-message.input';

@Resolver(() => Message)
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Query(() => [Message])
  @UseGuards(JwtAuthGuard)
  async messages(@CurrentUser() user: User): Promise<Message[]> {
    return this.chatService.getMessages(user);
  }

  @Mutation(() => Message)
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Args('sendMessageInput') sendMessageInput: SendMessageInput,
    @CurrentUser() user: User,
  ): Promise<Message| null> {
    return this.chatService.sendMessage(sendMessageInput, user);
  }

  @Subscription(() => Message, {
    name: 'messageAdded',
  })
  messageAdded() {
    return this.chatService.messageAdded();
  }
}