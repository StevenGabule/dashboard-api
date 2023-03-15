import { LoggerService } from './logger/logger.service';
import express, { Express } from "express";
import {Server} from 'http';
import { UserController } from './users/users.controller';

export class App {
  app: Express;
  server: Server;
  port: number;
  logger: LoggerService;
  userController: UserController;

  constructor(logger: LoggerService, userController: UserController) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
    this.userController = userController
  }

  useRouter() {
    this.app.use('/users', this.userController.router);
  }
  
  useExceptionFilters() {

  }

  public async init() {
    this.useRouter();
    this.useExceptionFilters();
    this.server = this.app.listen(this.port);
    this.logger.log(`App is running on port: http://localhost:${this.port}`)
  }
}