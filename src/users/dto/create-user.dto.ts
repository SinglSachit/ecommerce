import { IsString, IsOptional, IsNumber, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  phoneNumber?: number;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
  
  @IsEnum(UserRole)
    role:UserRole;
  
}


