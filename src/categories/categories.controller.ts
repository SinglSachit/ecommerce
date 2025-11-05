import {Controller,Get,Post,Body,Delete,Put,Param} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';
import { Category } from './entities/Categories.entity';

@Controller('category')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post('/')
  addCategory(
    @Body() categoryBody: CreateCategoryDto,
  ) {
    return this.categoriesService.addCategory(categoryBody);
  }
  @Put('/:id')
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto,
   @Param('id') id:string,){
    return this.categoriesService.updateCategory(id,updateCategoryDto);

   }
  
       @Get('/')
    getAllCategories():Promise<Category[]>{
        return this.categoriesService.getAllCategories();
    }
   @Get('/:id')
   getOneCategories(
   @Param('id') id :string,){
    return this.categoriesService.getOneCategory(id);
   }
   @Delete('/id')
   deleteCategory(@Param('id') id:string):Promise<void>{
    return this.categoriesService.deleteCategory(id);

   }
  }