CREATE TABLE "UserProfile" (
	"userEmail" varchar(160) PRIMARY KEY NOT NULL,
	"userName" varchar(120),
	"accountId" varchar(120),
	"phone" varchar(64),
	"address" text,
	"gender" varchar(32),
	"birthDate" varchar(16),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
