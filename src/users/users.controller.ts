import { IUser } from './users.interface';
import { ILogger } from './../logger/logger.interface';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { LoggerService } from '../logger/logger.service';
import { TYPES } from './../types';
import 'reflect-metadata';

@injectable()
export class UserController extends BaseController implements IUser {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/register', method: 'post', func: this.register },
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/login-with-google', method: 'post', func: this.loginGoogle },
			{ path: '/forgot-password', method: 'post', func: this.forgotPassword },
			{ path: '/reset-password', method: 'post', func: this.resetPassword },
		]);
	}

	loginGoogle(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'login with google');
	}

	loginTwitter(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'login with twitter');
	}

	loginApple(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'login with apple');
	}

	login(req: Request, res: Response, next: NextFunction): void {
		next(new HTTPError(401, 'Unauthorized.', 'login'));
	}
	register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'register');
	}
	forgotPassword(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'forgot password');
	}
	resetPassword(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'reset password');
	}
}
