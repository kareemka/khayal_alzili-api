import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  findAll(): Promise<Client[]> {
    return this.clientRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<Client>): Promise<Client> {
    const client = this.clientRepository.create(data);
    return this.clientRepository.save(client);
  }

  findOne(id: number): Promise<Client | null> {
    return this.clientRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }
}
