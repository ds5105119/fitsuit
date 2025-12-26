CREATE TABLE "UserCredential" (
	"userEmail" varchar(160) PRIMARY KEY NOT NULL,
	"passwordHash" text NOT NULL,
	"salt" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userEmail_UserCredential_userEmail_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."UserCredential"("userEmail") ON DELETE cascade ON UPDATE no action;