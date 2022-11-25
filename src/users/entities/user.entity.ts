import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  FullName: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
