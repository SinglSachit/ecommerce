
import {Request}  from "express";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CustomBody= createParamDecorator(
  (data: unknown, Context: ExecutionContext):unknown=>{
    const request = Context.switchToHttp().getRequest<Request>();
    if(typeof data === 'string'){
      return (request.body as Record<string,unknown>)?.[data];
    }
    return request.body as unknown;
  }
);
