import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Backstage } from './backstage.entity';

@Injectable()
export class BackstageService {
  constructor(
    @InjectRepository(Backstage)
    private readonly backstageRepository: Repository<Backstage>,
  ) {}

  findAll(): Promise<Backstage[]> {
    return this.backstageRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<Backstage>): Promise<Backstage> {
    const backstage = this.backstageRepository.create(data);
    return this.backstageRepository.save(backstage);
  }

  findOne(id: number): Promise<Backstage | null> {
    return this.backstageRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.backstageRepository.delete(id);
  }
}
