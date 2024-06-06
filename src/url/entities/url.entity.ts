import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'url' })
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text' })
  shortUrl: string;

  @Column({ type: 'text' })
  code: string;
}
