import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GuestsService } from './guests.service';
import { AdminAuthGuard } from '../auth/admin.guard';
import type {
  CreateGuestDto,
  SharedRsvpDto,
  UpdateRsvpDto,
} from './guests.dto';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  // ==========================================
  // ADMIN ROUTES (Protected)
  // ==========================================

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll() {
    return this.guestsService.findAll();
  }

  @UseGuards(AdminAuthGuard)
  @Get('stats')
  getStats() {
    return this.guestsService.getStats();
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(createGuestDto);
  }

  @UseGuards(AdminAuthGuard)
  @Post('bulk')
  createMany(@Body() createGuestsDto: CreateGuestDto[]) {
    return this.guestsService.createMany(createGuestsDto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':shortId')
  remove(@Param('shortId') shortId: string) {
    return this.guestsService.remove(shortId);
  }

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  @Post('rsvp')
  createFromSharedRsvp(@Body() sharedRsvpDto: SharedRsvpDto) {
    return this.guestsService.createFromSharedRsvp(sharedRsvpDto);
  }

  @Get(':shortId')
  findOne(@Param('shortId') shortId: string) {
    return this.guestsService.findByShortId(shortId);
  }

  @Patch(':shortId/rsvp')
  updateRsvp(
    @Param('shortId') shortId: string,
    @Body() updateRsvpDto: UpdateRsvpDto,
  ) {
    return this.guestsService.updateRsvp(shortId, updateRsvpDto);
  }
}
