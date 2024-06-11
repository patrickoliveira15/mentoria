import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    // checar se o email já existe
    const emailExists = this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (!emailExists) {
      throw new HttpException('Email already exists', 400);
    }

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const createdUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });

      return createdUser;
    } catch (error) {
      console.error(error);
    }
  }
}
