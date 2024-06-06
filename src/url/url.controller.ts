import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Req,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Request, Response } from 'express';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() createUrlDto: CreateUrlDto,
  ): Promise<string> {
    return this.urlService.create(createUrlDto, req);
  }

  @Get(':code')
  async redirect(
    @Res() res: Response,
    @Param('code') code: string,
  ): Promise<void> {
    return res.redirect(await this.urlService.redirect(code));
  }
}
