CREATE TABLE "AdminUser" (
	"username" varchar(64) PRIMARY KEY NOT NULL,
	"passwordHash" text NOT NULL,
	"salt" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ConciergeOrder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"userEmail" varchar(160) NOT NULL,
	"userName" varchar(120),
	"status" varchar(32) DEFAULT '접수' NOT NULL,
	"selections" jsonb NOT NULL,
	"measurements" jsonb,
	"previewUrl" text,
	"originalUpload" text,
	"backgroundPreview" text
);
--> statement-breakpoint
CREATE TABLE "Inquiry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(160) NOT NULL,
	"phone" varchar(64),
	"message" text NOT NULL,
	"attachmentUrl" text
);
