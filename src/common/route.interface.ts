import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response, Router } from 'express';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middleware?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
