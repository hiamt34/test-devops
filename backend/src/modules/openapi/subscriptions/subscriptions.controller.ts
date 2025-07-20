import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  async findAll() {
    return this.subscriptionsService.findAll();
  }

  @Patch(':id/use')
  async useSession(@Param('id') id: string) {
    return this.subscriptionsService.useSession(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const subscription = await this.subscriptionsService.findOne(id);
    if (!subscription) {
      throw new NotFoundException(`Subscription not found`);
    }
    return subscription;
  }
}
