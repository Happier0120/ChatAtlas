CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`tip_turn_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tip_turn_id`) REFERENCES `turns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `turns` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`parent_turn_id` text,
	`prompt` text NOT NULL,
	`response` text,
	`status` text NOT NULL,
	`provider_id` text NOT NULL,
	`model_id` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parent_turn_id`) REFERENCES `turns`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "turn_status" CHECK("turns"."status" in ('generating', 'completed')),
	CONSTRAINT "completed_response" CHECK("turns"."status" != 'completed' or "turns"."response" is not null)
);
