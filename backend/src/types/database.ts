import {
  SQL,
  Table,
  AnyColumn,
  Column,
  GetColumnData,
  MapColumnName,
  RequiredKeyOnly,
  Simplify,
} from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

type OptionalKeyOnly<TKey extends string, T extends Column> =
  T extends AnyColumn<{
    notNull: true;
    hasDefault: false;
  }>
    ? never
    : TKey;

type RequiredSelectKey<TKey extends string, T extends Column> =
  T extends AnyColumn<{
    notNull: true;
  }>
    ? TKey
    : never;

type OptionalSelectKey<TKey extends string, T extends Column> =
  T extends AnyColumn<{
    notNull: false;
    hasDefault: false;
  }>
    ? TKey
    : never;

export type Infer<
  TColumns extends Record<string, Column>,
  TInferMode extends 'select' | 'insert' = 'select',
  TConfig extends {
    dbColumnNames: boolean;
    override?: boolean;
  } = {
    dbColumnNames: false;
    override: false;
  },
> = Simplify<
  TInferMode extends 'insert'
    ? {
        [Key in keyof TColumns & string as RequiredKeyOnly<
          MapColumnName<Key, TColumns[Key], TConfig['dbColumnNames']>,
          TColumns[Key]
        >]: GetColumnData<TColumns[Key], 'query'>;
      } & {
        [Key in keyof TColumns & string as OptionalKeyOnly<
          MapColumnName<Key, TColumns[Key], TConfig['dbColumnNames']>,
          TColumns[Key]
        >]?: GetColumnData<TColumns[Key], 'query'> | undefined;
      }
    : {
        [Key in keyof TColumns & string as RequiredSelectKey<
          MapColumnName<Key, TColumns[Key], TConfig['dbColumnNames']>,
          TColumns[Key]
        >]: GetColumnData<TColumns[Key], 'query'>;
      } & {
        [Key in keyof TColumns & string as OptionalSelectKey<
          MapColumnName<Key, TColumns[Key], TConfig['dbColumnNames']>,
          TColumns[Key]
        >]?: GetColumnData<TColumns[Key], 'query'>;
      }
>;

export type InferEntity<
  TTable extends Table,
  TInferMode extends 'select' | 'insert' = 'select',
  TConfig extends {
    dbColumnNames: boolean;
    override?: boolean;
  } = {
    dbColumnNames: false;
    override: false;
  },
> = Infer<TTable['_']['columns'], TInferMode, TConfig>;

export type Entity<T extends Table> = InferEntity<T, 'select'>;

export type Insert<T extends Table> = InferEntity<T, 'insert'>;

export type Update<TTable extends Table> = {
  [Key in keyof TTable['_']['columns'] as Key extends 'id' ? never : Key]?:
    | TTable['_']['columns'][Key]['_']['data']
    | SQL
    | PgColumn
    | undefined;
} & {};
