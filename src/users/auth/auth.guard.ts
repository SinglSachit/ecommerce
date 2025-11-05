import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {Request} from "express";
import { UsersService } from "../users.service";
interface JwtPayLoad{
  id:string;
  email:string;
  iat?: number;
  exp?: number;
}
@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private readonly usersService :UsersService,
    private readonly jwtService: JwtService){}

    
   async canActivate (context: ExecutionContext): Promise<boolean>{
   const request = context.switchToHttp().getRequest<Request>();

   const token= this.extractTokenFromHeader(request);
   if(!token){
    throw new UnauthorizedException('no token provoded');
   }
   const payload = await this.jwtService.verifyAsync<JwtPayLoad>(token,{
    secret: process.env.JWT_SECRET || 'defaultSecret',
   })
   if(!payload){
    throw new UnauthorizedException('invalid token');
   }
  //todo:similar to authmiddleware from express,get user infi from database and attach to request
  // as of now we are just attaching the payload
  const user = await this.usersService.findOne(payload.id);
   request['user']=user;
   return true;
}
private extractTokenFromHeader(request:Request):string | undefined {
  const[type,token]=request.headers.authorization?.split( ' ') ?? [];
  return type == 'Bearer' ? token:undefined;  
}
}
