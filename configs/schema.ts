import { integer, pgTable, varchar, json, timestamp } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),

});

export const AiThumbnail = pgTable("thumbnails", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userInput: varchar({ length: 255 }).notNull(),
  thumbnailUrl: varchar({ length: 500 }).notNull(),
  refImage: json().notNull(), // store uploadedImages as JSON
  userEail: varchar({ length: 255 }).references(() => usersTable.email),
  createdOn: timestamp().defaultNow(), // store as proper timestamp
});


export const AiContentTable = pgTable(`AiContent`,{
  id : integer().primaryKey().generatedAlwaysAsIdentity(),
  userInput: varchar({ length: 255 }).notNull(),
  thumbnailUrl: varchar({ length: 500 }).notNull(),
   userEmail: varchar({ length: 255 }).references(() => usersTable.email),
  createdOn: timestamp().defaultNow(), // store as proper timestamp

})
