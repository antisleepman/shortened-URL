import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Request } from 'express';
import { isNotEmpty, isString } from 'class-validator';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url) private readonly urlRepository: Repository<Url>,
  ) {}

  async create(createUrlDto: CreateUrlDto, req: Request): Promise<string> {
    const url = this.formatUrl(createUrlDto.url);

    const response = await this.urlRepository.findOne({
      where: { url, isActive: true },
      select: ['id'],
    });

    if (response) {
      throw new BadRequestException('Url already exists');
    }

    const code = nanoid(10);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const shortUrl = `${baseUrl}/${code}`;

    await this.urlRepository.save(
      await this.urlRepository.create({
        url,
        code,
        shortUrl,
      }),
    );

    return shortUrl;
  }

  async redirect(code: string): Promise<string> {
    if (!isString(code) &&  !isNotEmpty(code)) {
      throw new BadRequestException('Invalid code');
    }

    const url = await this.urlRepository.findOneBy({ code });

    if (!url) {
      throw new BadRequestException(`Url with code ${code} not found`);
    }

    if (!url.isActive) {
      throw new BadRequestException('Url is not active');
    }

    this.urlRepository.update({ id: url.id }, { isActive: false });

    return url.url;
  }

  private formatUrl(string: string): string {
    let url: URL;

    try {
      url = new URL(string);

      if (!url.hostname) {
        url = new URL('http://' + string);
      }
    } catch (error) {
      url = new URL('http://' + string);
    }

    return url.toString();
  }
}
