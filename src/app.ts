import { inject } from 'inversify';
import { injectable } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { ExceptionFilter } from './errors/exception.filter';
import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/users.controller';
import { TYPES } from './types';
import 'reflect-metadata';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.json());
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
		this.server = this.app.listen(this.port);
		this.logger.log(`App is running on port: http://localhost:${this.port}`);
	}
}
