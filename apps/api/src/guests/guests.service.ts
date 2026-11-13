import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateGuestDto,
  SharedRsvpDto,
  UpdateRsvpDto,
} from './guests.dto';

const MAX_NAME_LENGTH = 100;
const MAX_WISH_LENGTH = 1000;

// Public RSVP input: pick only the allowed fields and bound their size
function parseRsvp(data: UpdateRsvpDto) {
  if (typeof data?.isAttending !== 'boolean') {
    throw new BadRequestException('isAttending must be true or false');
  }
  const wish = typeof data.wish === 'string' ? data.wish.trim() : '';
  if (wish.length > MAX_WISH_LENGTH) {
    throw new BadRequestException(
      `Wish must be at most ${MAX_WISH_LENGTH} characters`,
    );
  }
  return { isAttending: data.isAttending, wish: wish || null };
}

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  private generateShortId() {
    return randomBytes(4).toString('hex'); // 8-character hex string
  }

  findAll() {
    return this.prisma.guest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByShortId(shortId: string) {
    const guest = await this.prisma.guest.findUnique({
      where: { shortId },
    });
    if (!guest) {
      throw new NotFoundException('Guest not found');
    }
    return guest;
  }

  create(data: CreateGuestDto) {
    return this.prisma.guest.create({
      data: { ...data, shortId: this.generateShortId() },
    });
  }

  async createMany(data: CreateGuestDto[]) {
    const { count } = await this.prisma.guest.createMany({
      data: data.map((guest) => ({
        ...guest,
        shortId: this.generateShortId(),
      })),
    });
    return { message: `${count} guests created successfully.` };
  }

  updateRsvp(shortId: string, data: UpdateRsvpDto) {
    return this.rethrowNotFound(
      this.prisma.guest.update({ where: { shortId }, data: parseRsvp(data) }),
    );
  }

  createFromSharedRsvp(data: SharedRsvpDto) {
    const rsvp = parseRsvp(data);
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name || name.length > MAX_NAME_LENGTH) {
      throw new BadRequestException(
        `Name must be 1-${MAX_NAME_LENGTH} characters`,
      );
    }
    return this.prisma.guest.create({
      data: {
        ...rsvp,
        name,
        title: 'Bạn',
        type: 'Tất cả',
        shortId: this.generateShortId(),
      },
    });
  }

  remove(shortId: string) {
    return this.rethrowNotFound(
      this.prisma.guest.delete({ where: { shortId } }),
    );
  }

  async getStats() {
    const [total, attending, notAttending, noResponse] = await Promise.all([
      this.prisma.guest.count(),
      this.prisma.guest.count({ where: { isAttending: true } }),
      this.prisma.guest.count({ where: { isAttending: false } }),
      this.prisma.guest.count({ where: { isAttending: null } }),
    ]);
    return { total, attending, notAttending, noResponse };
  }

  // Map Prisma's "record not found" (P2025) to a 404; let other errors surface as 500
  private async rethrowNotFound<T>(query: Promise<T>): Promise<T> {
    try {
      return await query;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Guest not found');
      }
      throw error;
    }
  }
}
