import {
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { QueryDto } from './app.dto';

@Controller('/currency')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/convert')
  async convert(@Res() response: Response, @Query() query: QueryDto) {
    return await this.appService.convert(query).then((result) => {
      return response.json(result);
    });
  }
}
