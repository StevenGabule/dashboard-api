import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { LoggerService } from "../logger/logger.service";

export class UserController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      {path: '/register', method: 'post', func: this.register},
      {path: '/login', method: 'post', func: this.login},
      {path: '/forgot-password', method: 'post', func: this.forgotPassword},
      {path: '/reset-password', method: 'post', func: this.resetPassword},
    ])
  }

  loginFacebook() {}
  loginGoogle() {}
  loginTwitter() {}
  loginApple() {}
  login(req: Request, res: Response, next: NextFunction) {
    next(new HTTPError(401, 'Unauthorized.', 'login'))
  }
  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'register');
  }
  forgotPassword() {}
  resetPassword() {}
}