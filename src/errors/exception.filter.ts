import { ILogger } from './../logger/logger.interface';
import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { LoggerService } from '../logger/logger.service';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error.class';
import { TYPES } from './../types';
import 'reflect-metadata';
@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Error Code ${err.statusCode} : ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
