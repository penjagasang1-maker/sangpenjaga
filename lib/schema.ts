import {
  mysqlTable,
  varchar,
  int,
  text,
  boolean,
  timestamp,
  datetime,
  mysqlEnum,
  json,
} from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'

// 1. Users table
export const users = mysqlTable('users', {
  id: varchar('id', { length: 21 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull(),
  hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  role: mysqlEnum('role', ['user', 'admin']).default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 2. Sessions table (for Lucia Auth)
export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: datetime('expires_at').notNull(),
})

// 3. Comics table
export const comics = mysqlTable('comics', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  synopsis: text('synopsis'),
  coverUrl: varchar('cover_url', { length: 500 }),
  genre: varchar('genre', { length: 100 }),
  status: mysqlEnum('status', ['ongoing', 'completed', 'hiatus'])
    .default('ongoing')
    .notNull(),
  viewCount: int('view_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 4. Chapters table
export const chapters = mysqlTable('chapters', {
  id: int('id').autoincrement().primaryKey(),
  comicId: int('comic_id')
    .notNull()
    .references(() => comics.id, { onDelete: 'cascade' }),
  chapterNumber: int('chapter_number').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  isFree: boolean('is_free').default(true).notNull(),
  price: int('price').default(0).notNull(),
  publishedAt: timestamp('published_at').defaultNow(),
})

// 5. Pages table
export const pages = mysqlTable('pages', {
  id: int('id').autoincrement().primaryKey(),
  chapterId: int('chapter_id')
    .notNull()
    .references(() => chapters.id, { onDelete: 'cascade' }),
  pageNumber: int('page_number').notNull(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  width: int('width'),
  height: int('height'),
})

// 6. Subscription Plans table
export const subscriptionPlans = mysqlTable('subscription_plans', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  price: int('price').notNull(),
  durationDays: int('duration_days').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
})

// 7. Subscriptions table
export const subscriptions = mysqlTable('subscriptions', {
  id: int('id').autoincrement().primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  planId: int('plan_id')
    .notNull()
    .references(() => subscriptionPlans.id, { onDelete: 'cascade' }),
  startsAt: timestamp('starts_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  status: mysqlEnum('status', ['active', 'expired', 'cancelled'])
    .default('active')
    .notNull(),
})

// 8. Payments table
export const payments = mysqlTable('payments', {
  id: int('id').autoincrement().primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  midtransOrderId: varchar('midtrans_order_id', { length: 255 }).notNull().unique(),
  amount: int('amount').notNull(),
  type: mysqlEnum('type', ['chapter', 'subscription']).notNull(),
  status: mysqlEnum('status', ['pending', 'success', 'failed', 'expired'])
    .default('pending')
    .notNull(),
  midtransResponse: json('midtrans_response'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 9. Chapter Purchases table
export const chapterPurchases = mysqlTable('chapter_purchases', {
  id: int('id').autoincrement().primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  chapterId: int('chapter_id')
    .notNull()
    .references(() => chapters.id, { onDelete: 'cascade' }),
  paymentId: int('payment_id').references(() => payments.id, {
    onDelete: 'set null',
  }),
  purchasedAt: timestamp('purchased_at').defaultNow().notNull(),
})

// 10. Reading History table
export const readingHistory = mysqlTable('reading_history', {
  id: int('id').autoincrement().primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  chapterId: int('chapter_id')
    .notNull()
    .references(() => chapters.id, { onDelete: 'cascade' }),
  lastPage: int('last_page').default(1).notNull(),
  lastReadAt: timestamp('last_read_at').defaultNow().notNull(),
})

// 11. Banners table
export const banners = mysqlTable('banners', {
  id: int('id').autoincrement().primaryKey(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  linkUrl: varchar('link_url', { length: 500 }),
  sortOrder: int('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  subscriptions: many(subscriptions),
  payments: many(payments),
  chapterPurchases: many(chapterPurchases),
  readingHistory: many(readingHistory),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const comicsRelations = relations(comics, ({ many }) => ({
  chapters: many(chapters),
}))

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  comic: one(comics, {
    fields: [chapters.comicId],
    references: [comics.id],
  }),
  pages: many(pages),
  chapterPurchases: many(chapterPurchases),
  readingHistory: many(readingHistory),
}))

export const pagesRelations = relations(pages, ({ one }) => ({
  chapter: one(chapters, {
    fields: [pages.chapterId],
    references: [chapters.id],
  }),
}))

export const subscriptionPlansRelations = relations(
  subscriptionPlans,
  ({ many }) => ({
    subscriptions: many(subscriptions),
  })
)

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [subscriptions.planId],
    references: [subscriptionPlans.id],
  }),
}))

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  chapterPurchases: many(chapterPurchases),
}))

export const chapterPurchasesRelations = relations(
  chapterPurchases,
  ({ one }) => ({
    user: one(users, {
      fields: [chapterPurchases.userId],
      references: [users.id],
    }),
    chapter: one(chapters, {
      fields: [chapterPurchases.chapterId],
      references: [chapters.id],
    }),
    payment: one(payments, {
      fields: [chapterPurchases.paymentId],
      references: [payments.id],
    }),
  })
)

export const readingHistoryRelations = relations(readingHistory, ({ one }) => ({
  user: one(users, {
    fields: [readingHistory.userId],
    references: [users.id],
  }),
  chapter: one(chapters, {
    fields: [readingHistory.chapterId],
    references: [chapters.id],
  }),
}))

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Comic = typeof comics.$inferSelect
export type NewComic = typeof comics.$inferInsert
export type Chapter = typeof chapters.$inferSelect
export type NewChapter = typeof chapters.$inferInsert
export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect
export type NewSubscriptionPlan = typeof subscriptionPlans.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
export type ChapterPurchase = typeof chapterPurchases.$inferSelect
export type NewChapterPurchase = typeof chapterPurchases.$inferInsert
export type ReadingHistory = typeof readingHistory.$inferSelect
export type NewReadingHistory = typeof readingHistory.$inferInsert
export type Banner = typeof banners.$inferSelect
export type NewBanner = typeof banners.$inferInsert
