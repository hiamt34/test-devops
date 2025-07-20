import { SelectedFields } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { parents, students } from 'drizzle/schemas';
import {
  classes,
  classRegistrations,
  subscriptions,
} from './../../drizzle/schemas/index';

export type FieldOptions<T extends PgTable = never> = {
  join?: {
    [K in keyof JoinMap]?: {
      table: PgTable;
      options?: FieldOptions<ExtractTableType<K>>;
    };
  };
  alias?: Partial<Record<keyof T['_']['columns'], string>>;
  exclude?: (keyof T['_']['columns'])[];
  select?: (keyof T['_']['columns'])[];
};

type ExtractTableType<K extends string> = K extends keyof JoinMap
  ? JoinMap[K]
  : never;

type JoinMap = {
  parents: typeof parents;
  students: typeof students;
  classes: typeof classes;
  classRegistrations: typeof classRegistrations;
  subscriptions: typeof subscriptions;
};

export function createSelectOptions<T extends PgTable>(
  table: T,
  options: FieldOptions<T>,
): SelectedFields<PgColumn, T> {
  const selectFields: SelectedFields<PgColumn, T> = {};

  let allColumns = Object.keys(table).filter(
    (column) => column !== 'enableRLS',
  );
  if (options.select?.length > 0) {
    allColumns = allColumns.filter((column) =>
      options.select?.includes(column),
    );
  }
  for (const columnName of allColumns) {
    if (options.exclude?.includes(columnName)) {
      continue;
    }

    const aliasName = options.alias?.[columnName] ?? columnName;
    selectFields[aliasName as string] = table[columnName];
  }

  if (options.join) {
    for (const joinKey in options.join) {
      selectFields[joinKey] = {};
      const join = options.join[joinKey];
      if (join && join.table && join.options) {
        const joinFields = createSelectOptions(join.table, join.options);
        selectFields[joinKey] = joinFields;
      }
    }
  }

  return selectFields;
}
