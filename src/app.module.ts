import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: Number(config.get<string>('DB_PORT') ?? 5435),
        username: config.get<string>('DB_USERNAME') ?? 'postgres',
        password: config.get<string>('DB_PASSWORD') ?? 'postgres',
        database: config.get<string>('DB_DATABASE') ?? 'library_practice',
        autoLoadEntities: true,
        // Only for the disposable classroom database.
        synchronize: config.get<string>('DB_SYNC') !== 'false',
        ssl: config.get<string>('NODE_ENV') === 'production',
      }),
    }),
    CategoriesModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
