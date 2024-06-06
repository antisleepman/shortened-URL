import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl({ protocols: ['http', 'https'] })
  url: string;
}
