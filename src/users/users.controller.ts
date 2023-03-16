import { AuthGuard } from './../common/auth.guard';
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
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.ConfigService) private configService: ConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/register', method: 'post', func: this.register, middleware: [new ValidateMiddleware(UserRegisterDto)] },
			{ path: '/login', method: 'post', func: this.login, middleware: [new ValidateMiddleware(UserLoginDto)] },
			{ path: '/info', method: 'get', func: this.info, middleware: [new AuthGuard()] },
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

	async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			return next(new HTTPError(401, 'The email or password not found.', 'login'));
		}
		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Something goes wrong!'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	forgotPassword(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'forgot password');
	}

	resetPassword(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'reset password');
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign({ email, iat: Math.floor(Date.now() / 1000) }, secret, { algorithm: 'HS256' }, (err, token) => {
				if (err) {
					reject(err);
				}
				resolve(token as string);
			});
		});
	}
}
