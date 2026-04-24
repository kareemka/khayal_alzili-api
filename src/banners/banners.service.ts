import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private bannersRepository: Repository<Banner>,
  ) {}

  findAll(): Promise<Banner[]> {
    return this.bannersRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }

  findActive(): Promise<Banner[]> {
    return this.bannersRepository.find({
      where: { isActive: true },
      order: {
        order: 'ASC',
      },
    });
  }

  findOne(id: number): Promise<Banner | null> {
    return this.bannersRepository.findOneBy({ id });
  }

  async create(banner: Partial<Banner>): Promise<Banner> {
    const newBanner = this.bannersRepository.create(banner);
    return this.bannersRepository.save(newBanner);
  }

  async update(id: number, banner: Partial<Banner>): Promise<Banner | null> {
    await this.bannersRepository.save({ ...banner, id });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.bannersRepository.delete(id);
  }
}
