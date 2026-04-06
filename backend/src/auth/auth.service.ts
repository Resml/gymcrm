import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(email: string, passwordPlain: string, gymName: string) {
    const existing = await this.prisma.gymOwner.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    const user = await this.prisma.gymOwner.create({
      data: { email, passwordHash, gymName }
    });

    return this.generateToken(user);
  }

  async login(email: string, passwordPlain: string) {
    const user = await this.prisma.gymOwner.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      gymName: user.gymName,
      email: user.email
    };
  }

}
