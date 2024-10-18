CREATE TABLE IF NOT EXISTS "sappho_product_version" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"name" varchar(255),
	"price" integer NOT NULL,
	"size_ounces" integer NOT NULL,
	"image" varchar(255) NOT NULL,
	"tasting_notes" varchar(255),
	"processing" varchar(25),
	"country" varchar(100),
	"region" varchar(100),
	"lot" varchar(100),
	"story" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sappho_product" (
	"id" serial PRIMARY KEY NOT NULL,
	"published_version_id" integer,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sappho_product" ADD CONSTRAINT "sappho_product_published_version_id_sappho_product_version_id_fk" FOREIGN KEY ("published_version_id") REFERENCES "public"."sappho_product_version"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
