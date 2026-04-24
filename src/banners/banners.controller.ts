import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BannersService } from './banners.service';
import { Banner } from './banner.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  findActive() {
    return this.bannersService.findActive();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.bannersService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `banner-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() bannerData: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('يجب رفع صورة للبانر'); // This will be caught by NestJS as 500 or 400 depending on filters, but for now let's be explicit
    }

    const banner: Partial<Banner> = {
      title: bannerData.title,
      link: bannerData.link,
      order: parseInt(bannerData.order || '0'),
      isActive: bannerData.isActive === 'true' || bannerData.isActive === true || bannerData.isActive === undefined,
      image: file.filename,
    };
    
    return this.bannersService.create(banner);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `banner-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async update(@Param('id') id: string, @Body() bannerData: any, @UploadedFile() file: Express.Multer.File) {
    const existing = await this.bannersService.findOne(+id);
    const banner: Partial<Banner> = {
      ...bannerData,
      isActive: bannerData.isActive === 'true' || bannerData.isActive === true,
      order: parseInt(bannerData.order || '0'),
    };
    if (file) {
      banner.image = file.filename;
      if (existing?.image) {
        this.deleteFile(existing.image);
      }
    }
    return this.bannersService.update(+id, banner);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    const existing = await this.bannersService.findOne(+id);
    if (existing?.image) {
      this.deleteFile(existing.image);
    }
    return this.bannersService.remove(+id);
  }

  private deleteFile(filename: string) {
    const filePath = join(process.cwd(), 'uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete banner file: ${filePath}`, err);
      }
    }
  }
}
