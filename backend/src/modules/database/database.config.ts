import { ConfigService } from '@nestjs/config';

export interface PostgresConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export const getPostgresConfig = (
  configService: ConfigService,
): PostgresConfig => ({
  host: configService.get<string>('db.host', 'localhost'),
  port: configService.get<number>('db.port', 5432),
  user: configService.get<string>('db.user', 'postgres'),
  password: configService.get<string>('db.pass', 'postgres'),
  database: configService.get<string>('db.name', 'postgres'),
});
