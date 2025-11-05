import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/Categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';




  @Injectable()
export class CategoriesService {
  async addCategory(categoryBody: CreateCategoryDto): Promise<Category> {
    try {
      const category = this.categoryRepo.create(categoryBody);
      return await this.categoryRepo.save(category);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepo.find();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  //   }
  //   getOneCategory(id:string):Promise<Category | null>{
  //     try{
  //       return this.categoriesRepository.findOneBy({id})
  //     }
  //     catch(error){
  //       throw new InternalServerErrorException(error)
  //     }
  //   }
  //   async deleteCategory(id:string):Promise<void>{
  //     try{
  //       await this.categoriesRepository.delete({id})
  //       return;
  //     }
  //     catch(error){
  //       throw new InternalServerErrorException(error)
  //     }
  //   }
  //   addCategory(createCategoryDto: CreateCategoryDto):Promise<Category> {
  //     try {
  //       const category = this.categoriesRepository.create(createCategoryDto);
  //       return this.categoriesRepository.save(category);
  //     } catch (error) {
  //       console.log(error)
  //       throw new InternalServerErrorException(error);
  //     }
  //   }
  //   async updateCategory(id: string,updateCategoryDto:UpdateCategoryDto):Promise<Category>{
  //     try{
  //       const existingCategory= await this.categoriesRepository.findOneBy({ id });
  //       if(!existingCategory){
  //         throw new NotFoundException('category not found')
  //       }
  //       const updatedCategory= this.categoriesRepository.merge(
  //         existingCategory,
  //         updateCategoryDto,
  //       );
  //        return this.categoriesRepository.save(updatedCategory)
  //     }catch(error){
  //       throw new InternalServerErrorException(error);
  //     }
  //     }
  //   }
  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      const category = await this.categoryRepo.findOneBy({ id: Number(id) });
      if (!category) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }
      this.categoryRepo.merge(category, updateCategoryDto);
      return await this.categoryRepo.save(category);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getOneCategory(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepo.findOneBy({ id: Number(id) });
      if (!category) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }
      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  //     }
  //   }
  //   addCategory(createCategoryDto: CreateCategoryDto):Promise<Category> {
  //     try {
  //       const category = this.categoriesRepository.create(createCategoryDto);
  //       return this.categoriesRepository.save(category);
  //     } catch (error) {
  //       console.log(error)
  //       throw new InternalServerErrorException(error);
  //     }
  //   }
  //   async updateCategory(id: string,updateCategoryDto:UpdateCategoryDto):Promise<Category>{
  //     try{
  //       const existingCategory= await this.categoriesRepository.findOneBy({ id });
  //       if(!existingCategory){
  //         throw new NotFoundException('category not found')
  //       }
  //       const updatedCategory= this.categoriesRepository.merge(
  //         existingCategory,
  //         updateCategoryDto,
  //       );
  //        return this.categoriesRepository.save(updatedCategory)
  //     }catch(error){
  //       throw new InternalServerErrorException(error);
  //     }
  //     }
  //   }
  async deleteCategory(id: string): Promise<void> {
    try {
      const result = await this.categoryRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

}
