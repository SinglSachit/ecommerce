import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  findByEmail(email: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ Create User
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  // ✅ Find All Users
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['orders'] });
  }

  // ✅ Find One User
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // ✅ Update User
  async update(id:string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    Object.assign(user, updateUserDto);

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  // ✅ Delete User
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async login(email: string, password:string){
//get user from given email
//if no user found throw unauthorized error
//otherwise check password and send token
try{
  const user =await this.userRepository.findOne({
    where:{email:email},
    select:{id:true,
      email:true,
      password:true,
    }
  })
  if(!user)
{ throw new UnauthorizedException('invalid Credential');
}if(user.password !==password){
  throw new UnauthorizedException('invalid Credential')
}
//generate jwt token and return to users
const token = await this.jwtService.signAsync({
  id:user.id,
  email: user.email,
})
return token;
 }catch(error){
  throw new InternalServerErrorException(error);
}
  }
}

