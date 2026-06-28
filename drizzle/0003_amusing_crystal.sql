CREATE TABLE `payroll_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`month` int NOT NULL,
	`year` int NOT NULL,
	`hours_worked` decimal(8,2) DEFAULT '0',
	`hourly_wage` decimal(8,2) NOT NULL,
	`gross_salary` decimal(10,2) NOT NULL,
	`tax_deduction` decimal(10,2) DEFAULT '0',
	`social_security` decimal(10,2) DEFAULT '0',
	`other_deductions` decimal(10,2) DEFAULT '0',
	`net_salary` decimal(10,2) NOT NULL,
	`bonus` decimal(10,2) DEFAULT '0',
	`vacation_days` int DEFAULT 0,
	`sick_days` int DEFAULT 0,
	`status` enum('draft','finalized','paid') NOT NULL DEFAULT 'draft',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payroll_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `personal_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`category` enum('vertrag','zeugnis','ausweis','krankmeldung','lohnabrechnung','sonstiges') NOT NULL DEFAULT 'sonstiges',
	`file_url` varchar(512),
	`file_key` varchar(512),
	`mime_type` varchar(64),
	`file_size` int,
	`notes` text,
	`uploaded_by` int NOT NULL,
	`signed_by_employee` boolean NOT NULL DEFAULT false,
	`signed_by_admin` boolean NOT NULL DEFAULT false,
	`signed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `personal_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `employees` ADD `hourly_wage` decimal(8,2) DEFAULT '12.41';--> statement-breakpoint
ALTER TABLE `employees` ADD `tax_class` enum('1','2','3','4','5','6') DEFAULT '1';--> statement-breakpoint
ALTER TABLE `employees` ADD `social_security_number` varchar(32);--> statement-breakpoint
ALTER TABLE `employees` ADD `iban` varchar(34);--> statement-breakpoint
ALTER TABLE `employees` ADD `contract_type` enum('vollzeit','teilzeit','minijob','aushilfe') DEFAULT 'minijob';--> statement-breakpoint
ALTER TABLE `employees` ADD `contract_start` date;--> statement-breakpoint
ALTER TABLE `employees` ADD `contract_end` date;--> statement-breakpoint
ALTER TABLE `employees` ADD `address` varchar(256);--> statement-breakpoint
ALTER TABLE `employees` ADD `birth_date` date;