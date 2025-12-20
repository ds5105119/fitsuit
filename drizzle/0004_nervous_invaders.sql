ALTER TABLE "Inquiry" ADD COLUMN "orderId" uuid;--> statement-breakpoint
ALTER TABLE "Inquiry" ADD COLUMN "replyMessage" text;--> statement-breakpoint
ALTER TABLE "Inquiry" ADD COLUMN "replyUpdatedAt" timestamp;