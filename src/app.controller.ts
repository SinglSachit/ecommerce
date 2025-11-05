import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
///2@controller is the main controller it is called as a decodator.yedi ('api') vaye yo prefix vayo..yo class sabai ma applicable hunxa.
@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}
// 1. /hello garda uta routes change hunxa
  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

@Post('/data')
postData(): string{
  return 'Data received';
}
//@put()
@Put('hi')
gethi():string{
  return'hi its me';
}

//@Delete()
@Delete('/del')
getdel():string{
  return'deleted data';
}
//@Patch()

}
