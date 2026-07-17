CREATE TABLE `suggestions` (
	`id` text PRIMARY KEY NOT NULL,
	`game` text NOT NULL,
	`suggestion_date` text NOT NULL,
	`numbers` text NOT NULL,
	`extras` text NOT NULL,
	`algorithm_version` text NOT NULL,
	`signals` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `suggestions_game_date_unique` ON `suggestions` (`game`,`suggestion_date`);