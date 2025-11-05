import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  publicId: string;

  @Column()
  secureUrl: string;

  @Column({ nullable: true })
  originalFilename: string;

  @Column()
  bytes: number;

  @Column()
  format: string;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}