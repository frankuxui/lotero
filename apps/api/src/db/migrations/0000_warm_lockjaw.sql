CREATE TABLE `bet_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`bet_id` text NOT NULL,
	`numbers` text NOT NULL,
	`extras` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`bet_id`) REFERENCES `bets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `bets` (
	`id` text PRIMARY KEY NOT NULL,
	`game` text NOT NULL,
	`label` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `draws` (
	`id` text PRIMARY KEY NOT NULL,
	`game` text NOT NULL,
	`draw_date` text NOT NULL,
	`numbers` text NOT NULL,
	`extras` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
