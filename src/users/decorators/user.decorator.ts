import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { User } from "../entities/user.entity";

export interface RequestWithUser extends Request{
  //ToDo: we need to update this type once we attach more info of the user from database in authguard
  user:Omit<User,'password'>;
}
export const loggedInUser = createParamDecorator(
  (data:keyof RequestWithUser['user'], context: ExecutionContext)=>{
    const request= context.switchToHttp().getRequest<RequestWithUser>();
    const user= request.user;
    return data? user[data]:user;
  }
)
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // populated by JwtAuthGuard
  },
);