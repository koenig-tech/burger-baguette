CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`user_name` varchar(128) NOT NULL,
	`user_role` varchar(32) NOT NULL,
	`action` varchar(64) NOT NULL,
	`section` varchar(128) NOT NULL,
	`field` varchar(256),
	`old_value` text,
	`new_value` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intranet_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(64) NOT NULL,
	`password_hash` varchar(256) NOT NULL,
	`name` varchar(128) NOT NULL,
	`role` enum('admin','manager','staff') NOT NULL DEFAULT 'staff',
	`can_edit_kalkulation` boolean NOT NULL DEFAULT false,
	`can_edit_rezepte` boolean NOT NULL DEFAULT false,
	`can_edit_finanzen` boolean NOT NULL DEFAULT false,
	`can_edit_dashboard` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`last_login` timestamp,
	CONSTRAINT `intranet_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `intranet_users_username_unique` UNIQUE(`username`)
);
