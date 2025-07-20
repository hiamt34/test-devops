import { Inject, Injectable, Logger } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool, QueryResult } from 'pg';
import { PostgresConfig } from './database.config';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly nodes: NodePgDatabase[] = []; // Danh sách các Pool
  private readonly maxNodes: number = 5; // Giới hạn số lượng Pool tối đa
  public readonly db: NodePgDatabase; // Pool mặc định ban đầu

  constructor(@Inject('POSTGRES_CONFIG') private config: PostgresConfig) {
    // Tạo Pool đầu tiên (mặc định)
    const initialPool = this.createPool();
    this.db = drizzle(initialPool);
    this.nodes.push(this.db);
  }

  // Hàm tạo Pool mới
  public createNewNode(maxConnection?: number): NodePgDatabase {
    if (this.nodes.length >= this.maxNodes) {
      this.logger.error(
        `Maximum number of pools (${this.maxNodes}) reached. Cannot create more pools.`,
      );
      return this.db;
    }

    const newPool = this.createPool(maxConnection);
    const newNode = drizzle(newPool);
    this.nodes.push(newNode);
    this.logger.log(`New pool created.`);
    return newNode;
  }

  // Hàm hỗ trợ tạo Pool
  private createPool(maxConnection = 100): Pool {
    return new Pool({
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      password: this.config.password,
      database: this.config.database,
      max: maxConnection, // Mỗi Pool hỗ trợ tối đa 100 kết nối
    });
  }

  // Lấy instance Drizzle từ Pool mặc định
  public getDrizzle(): NodePgDatabase {
    return this.db;
  }

  // Lấy danh sách tất cả Pool (nếu cần)
  public getNode(): NodePgDatabase[] {
    return this.nodes;
  }
}
