import { UserService } from './users.service';
import { IUserController } from './users.controller.interface';
import { ILogger } from './../logger/logger.interface';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { TYPES } from './../types';
import 'reflect-metadata';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
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

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		next(new HTTPError(401, 'Unauthorized.', 'login'));
	}

	async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Something goes wrong!'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}
	forgotPassword(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'forgot password');
	}
	resetPassword(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'reset password');
	}
}
