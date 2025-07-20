import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getPostgresConfig } from './database.config';
import { DatabaseSeeder } from './database.seeder';
import { DatabaseService } from './database.service';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const postgresConfigProvider: Provider = {
      provide: 'POSTGRES_CONFIG',
      useFactory: (configService: ConfigService) =>
        getPostgresConfig(configService),
      inject: [ConfigService],
    };

    return {
      module: DatabaseModule,
      imports: [ConfigModule],
      providers: [postgresConfigProvider, DatabaseService, DatabaseSeeder],
      exports: [DatabaseService],
      global: true,
    };
  }
}
