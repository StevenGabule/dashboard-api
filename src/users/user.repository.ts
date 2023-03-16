import { injectable } from 'inversify';
import { UserModel } from '@prisma/client';
import { PrismaService } from './../database/prisma.service';
import { TYPES } from '../types';
import { IUsersRepository } from './user.repository.interface';
import { inject } from 'inversify';
import { User } from './user.entity';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ name, email, password }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: { name, email, password },
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({ where: { email } });
	}
}
