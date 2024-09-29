import { relations, sql } from 'drizzle-orm';
import {
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `sappho_${name}`);

export const products = createTable('product', {
  id: serial('id').primaryKey(),
  publishedVersionId: integer('published_version_id').references(
    () => productVersions.id
  ),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const productVersions = createTable('product_version', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  name: varchar('name', { length: 255 }),
  price: integer('price').notNull(),
  sizeOunces: integer('size_ounces').notNull(),
  image: varchar('image', { length: 255 }).notNull(),
  tastingNotes: varchar('tasting_notes', { length: 255 }),
  story: text('story'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const productRelations = relations(products, ({ one, many }) => ({
  publishedVersion: one(productVersions, {
    fields: [products.publishedVersionId],
    references: [productVersions.id],
  }),
  versions: many(productVersions),
}));

export const productVersionsRelations = relations(
  productVersions,
  ({ one }) => ({
    product: one(products, {
      fields: [productVersions.productId],
      references: [products.id],
    }),
  })
);
