import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @Length(3, 18, { message: 'Имя минимум 3 символа' })
  fullName?: string;

  @IsEmail(undefined, { message: 'Неверная почта' })
  email: string;

  @IsNotEmpty()
  @Length(4, 32, { message: 'Пароль минимум 4 символа' })
  password: string;
}
