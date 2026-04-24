import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { Category } from './categories/category.entity';
import { Show } from './shows/show.entity';
import { User } from './users/user.entity';
import { Setting } from './settings/setting.entity';
import { Banner } from './banners/banner.entity';
import { Client } from './clients/client.entity';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { ClientsModule } from './clients/clients.module';

// Controllers and Services
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { ShowsController } from './shows/shows.controller';
import { ShowsService } from './shows/shows.service';
import { BannersController } from './banners/banners.controller';
import { BannersService } from './banners/banners.service';
import { ClientsController } from './clients/clients.controller';
import { ClientsService } from './clients/clients.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'khayal_alzili',
      entities: [Category, Show, User, Setting, Banner, Client],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Category, Show, User, Setting, Banner, Client]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    SettingsModule,
    ClientsModule,
  ],
  controllers: [AppController, CategoriesController, ShowsController, BannersController, ClientsController],
  providers: [AppService, CategoriesService, ShowsService, BannersService, ClientsService],
})
export class AppModule { }
