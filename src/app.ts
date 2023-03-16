import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IUserController } from './users/users.controller.interface';
import { ConfigService } from './config/config.service';
import { inject } from 'inversify';
import { injectable } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { ExceptionFilter } from './errors/exception.filter';
import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/users.controller';
import { TYPES } from './types';
import 'reflect-metadata';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRouter(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRouter();
		this.useExceptionFilters();

		await this.prismaService.connect();

		this.server = this.app.listen(this.port);
		this.logger.log(`App is running on port: http://localhost:${this.port}`);
	}
}
