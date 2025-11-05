import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { promises } from 'dns';
import { AuthGuard } from './auth/auth.guard';
import {loggedInUser, type RequestWithUser} from './decorators/user.decorator'
import {CustomBody} from "./decorators/customBody.decorator"
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from './auth/roles.guard';
import { Auth } from './decorators/auth.decorator';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Create User
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //  Get All Users
  // @Get("/")
  // @UseGuards(AuthGuard)
  // findAll() {
  //   return this.usersService.findAll();
  // }
  //foranother'
  @Get("/")
  
  // @UseGuards(AuthGuard)
  //if we olny use @Auth() decorator, it will use aAuthguard by default but do not use roleguard
  //if we pass role as parameter to Auth() decorator, it will use both Authguard and RoleGuard
@Auth(UserRole.USER,UserRole.ADMIN)
  findAll(@Req() req:RequestWithUser){
    const user = req.user;
    console.log(user);
    return this.usersService.findAll();
  }

  // Get One User
  @Get('/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard,RolesGuard)
  findOne(@loggedInUser('email') user,@Param('id') id: string) {
    console.log('logged in user',user)
    return this.usersService.findOne(id);
  }

  //  Update User
  @Put('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  //  Delete User
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  // we are using cus
   @Post('/login')
   login(
    @CustomBody('email') email:string,
    @CustomBody('password') password:string): Promise<string>{
      return this.usersService.login(email,password);
    }
   
}