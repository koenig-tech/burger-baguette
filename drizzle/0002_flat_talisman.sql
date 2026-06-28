CREATE TABLE `absences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`type` enum('vacation','sick','other') NOT NULL DEFAULT 'vacation',
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`note` varchar(256),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `absences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`username` varchar(64) NOT NULL,
	`password_hash` varchar(256) NOT NULL,
	`role` enum('admin','manager','staff') NOT NULL DEFAULT 'staff',
	`position` varchar(64) DEFAULT 'Servicekraft',
	`color` varchar(16) DEFAULT '#C9A84C',
	`phone` varchar(32),
	`email` varchar(128),
	`hours_per_week` int DEFAULT 20,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`last_login` timestamp,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`),
	CONSTRAINT `employees_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `shift_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`start_time` varchar(8) NOT NULL,
	`end_time` varchar(8) NOT NULL,
	`color` varchar(16) DEFAULT '#C9A84C',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shift_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shifts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`shift_date` date NOT NULL,
	`start_time` varchar(8) NOT NULL,
	`end_time` varchar(8) NOT NULL,
	`note` varchar(256),
	`status` enum('planned','confirmed','cancelled') NOT NULL DEFAULT 'planned',
	`template_id` int,
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shifts_id` PRIMARY KEY(`id`)
);
