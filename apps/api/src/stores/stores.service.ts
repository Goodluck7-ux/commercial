import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { StoreRole, StoreStatus } from '../generated/prisma/enums.js';

const ALLOWED_TRANSITIONS: Record<StoreStatus, StoreStatus[]> = {
  PENDING: ['ACTIVE', 'REJECTED'],
  ACTIVE: ['SUSPENDED'],
  SUSPENDED: ['ACTIVE'],
  REJECTED: [],
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  private async uniqueSlug(name: string) {
    const base = slugify(name) || 'store';
    let slug = base;
    while (await this.prisma.store.findUnique({ where: { slug } })) {
      slug = `${base}-${randomBytes(2).toString('hex')}`;
    }
    return slug;
  }

  async create(userId: string, input: { name: string; description?: string }) {
    const pending = await this.prisma.storeMember.count({
      where: {
        userId,
        role: StoreRole.OWNER,
        store: { status: StoreStatus.PENDING },
      },
    });
    if (pending > 0) {
      throw new ConflictException('You already have a store application under review');
    }

    const slug = await this.uniqueSlug(input.name);
    return this.prisma.store.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        members: { create: { userId, role: StoreRole.OWNER } },
      },
      select: { id: true, name: true, slug: true, status: true, createdAt: true },
    });
  }

  findMine(userId: string) {
    return this.prisma.storeMember.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        role: true,
        store: {
          select: { id: true, name: true, slug: true, status: true, createdAt: true },
        },
      },
    });
  }

  listByStatus(status: StoreStatus) {
    return this.prisma.store.findMany({
      where: { status },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        status: true,
        createdAt: true,
        members: {
          where: { role: StoreRole.OWNER },
          select: { user: { select: { name: true, email: true } } },
        },
      },
    });
  }

  async setStatus(id: string, status: StoreStatus) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');

    if (!ALLOWED_TRANSITIONS[store.status].includes(status)) {
      throw new BadRequestException(`Cannot change a ${store.status} store to ${status}`);
    }

    return this.prisma.store.update({
      where: { id },
      data: { status },
      select: { id: true, name: true, slug: true, status: true },
    });
  }
}