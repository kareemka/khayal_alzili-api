import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['shows'],
      order: {
        id: 'ASC',
        shows: {
          sortOrder: 'ASC',
          id: 'DESC',
        },
      },
    });
  }

  async findAllPaginated(page: number, limit: number) {
    const [data, total] = await this.categoriesRepository.findAndCount({
      relations: ['shows'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: 'DESC',
        shows: {
          sortOrder: 'ASC',
          id: 'DESC',
        },
      },
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  findOne(id: number): Promise<Category | null> {
    return this.categoriesRepository.findOne({
      where: { id },
      relations: ['shows'],
      order: {
        shows: {
          sortOrder: 'ASC',
          id: 'DESC',
        },
      },
    });
  }

  async create(category: Partial<Category>): Promise<Category> {
    const newCategory = this.categoriesRepository.create(category);
    return this.categoriesRepository.save(newCategory);
  }

  async update(id: number, category: Partial<Category>): Promise<Category | null> {
    await this.categoriesRepository.save({ ...category, id });
    return this.categoriesRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);
  }
}
