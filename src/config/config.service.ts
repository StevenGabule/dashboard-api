import { IConfigService } from './config.service.interface';
import { injectable, inject } from 'inversify';
import { ILogger } from './../logger/logger.interface';
import { config, DotenvParseOutput, DotenvConfigOutput } from 'dotenv';
import { TYPES } from '../types';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] Failed to read .env file or is missing.');
		} else {
			this.logger.log('[ConfigService] Configuration .epν loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
