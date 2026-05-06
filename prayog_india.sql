-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2026 at 08:21 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `prayog_india`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `batch_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `type` enum('online','offline') NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `selfie_url` varchar(255) DEFAULT NULL,
  `status` enum('present','absent') DEFAULT 'present',
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `user_id`, `course_id`, `batch_id`, `date`, `type`, `latitude`, `longitude`, `selfie_url`, `status`, `recorded_at`) VALUES
(1, 16, 2, NULL, '2026-04-30', 'offline', 28.61390000, 77.20900000, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', 'present', '2026-04-30 10:35:29');

-- --------------------------------------------------------

--
-- Table structure for table `batches`
--

CREATE TABLE `batches` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `schedule` varchar(255) DEFAULT NULL,
  `type` enum('online','offline') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `batches`
--

INSERT INTO `batches` (`id`, `course_id`, `name`, `schedule`, `type`, `created_at`) VALUES
(1, 1, 'Delta Batch (Online)', 'Mon-Fri 07:00 PM - 09:00 PM', 'online', '2026-04-30 10:35:29'),
(2, 2, 'Alpha Batch (Offline Hub)', 'Sat-Sun 10:00 AM - 02:00 PM', 'offline', '2026-04-30 10:35:29'),
(3, 3, 'Morning Batch (8:00 AM - 11:00 AM)', 'Mon-Sat 8:00 AM - 11:00 AM', 'offline', '2026-05-01 11:09:13'),
(4, 3, 'Evening Batch (4:00 PM - 7:00 PM)', 'Mon-Sat 4:00 PM - 7:00 PM', 'offline', '2026-05-01 11:09:13');

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `certificate_number` varchar(50) NOT NULL,
  `issue_date` date NOT NULL,
  `qr_code_data` text DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`id`, `user_id`, `course_id`, `certificate_number`, `issue_date`, `qr_code_data`, `file_url`) VALUES
(1, 2, 1, 'PR-2026-8986', '2026-04-29', 'https://prayogindia.in/verify/PR-2026-8986', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `type` enum('online','offline') NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `price`, `type`, `image`, `duration`, `created_at`) VALUES
(1, 'AI & Machine Learning (Online Pro)', 'Master Neural Networks, NLP, and Computer Vision from home. Includes high-performance cloud GPU access.', 25000.00, 'online', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', '6 Months', '2026-04-30 10:35:29'),
(2, 'AI & Machine Learning (Offline Hub)', 'Intensive lab-based training at Prayog Hub. Work with NVIDIA Jetson kits and high-end workstations.', 45000.00, 'offline', 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=800', '6 Months', '2026-04-30 10:35:29'),
(3, 'Robotics Summer Camp 2026', 'A 15-day hands-on journey into the world of building and programming robots.', 2999.00, 'offline', NULL, '15 Days', '2026-05-01 11:09:13');

-- --------------------------------------------------------

--
-- Table structure for table `course_materials`
--

CREATE TABLE `course_materials` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('document','video','link','step') NOT NULL,
  `content` text DEFAULT NULL,
  `module_number` int(11) DEFAULT 1,
  `is_locked` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_materials`
--

INSERT INTO `course_materials` (`id`, `course_id`, `title`, `type`, `content`, `module_number`, `is_locked`, `created_at`) VALUES
(1, 1, '01. Orientation & Cloud Setup', 'step', 'Instructions to access your cloud GPU instance.', 1, 0, '2026-04-30 10:35:29'),
(2, 1, '02. Mathematics for Deep Learning', 'document', 'https://mml-book.github.io/book/mml-book.pdf', 1, 0, '2026-04-30 10:35:29'),
(3, 1, '03. Python for AI: Performance Optimization', 'video', 'https://www.youtube.com/embed/rfscVS0vtbw', 1, 0, '2026-04-30 10:35:29'),
(4, 1, '04. Linear Algebra Mastery Quiz', 'step', 'Check your mathematical foundations.', 1, 0, '2026-04-30 10:35:29'),
(5, 1, '05. Neural Network Architectures (Locked)', 'document', 'https://arxiv.org/pdf/1512.03385.pdf', 2, 1, '2026-04-30 10:35:29'),
(6, 2, '01. Hub Safety & Induction', 'step', 'Safety protocols for high-voltage server handling.', 1, 0, '2026-04-30 10:35:29'),
(7, 2, '02. Probability & Stats for ML', 'document', 'https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/pdfs/CS109Notes.pdf', 1, 0, '2026-04-30 10:35:29'),
(8, 2, '03. Workshop: Data Wrangling with Pandas', 'video', 'https://www.youtube.com/embed/P_q0tkYqvSk', 1, 0, '2026-04-30 10:35:29'),
(9, 2, '04. Hub Access ID Generation', 'step', 'Follow these steps to generate your digital entry key.', 1, 0, '2026-04-30 10:35:29'),
(10, 2, '05. Computer Vision with NVIDIA Jetson (Locked)', 'step', 'Hardware setup for edge AI.', 2, 1, '2026-04-30 10:35:29');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `batch_id` int(11) DEFAULT NULL,
  `status` enum('active','completed','dropped') DEFAULT 'active',
  `payment_status` enum('paid','partial','pending') DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL,
  `amount_paid` decimal(10,2) DEFAULT 0.00,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `batch_id`, `status`, `payment_status`, `total_amount`, `amount_paid`, `enrolled_at`) VALUES
(1, 16, 2, 2, 'active', 'partial', 45000.00, 15000.00, '2026-04-30 10:35:29'),
(2, 17, 1, 1, 'active', 'paid', 25000.00, 25000.00, '2026-04-30 10:35:29'),
(3, 18, 3, 3, 'active', 'paid', 2999.00, 2999.00, '2026-05-01 11:21:17');

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `total_marks` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `course_id`, `title`, `description`, `duration`, `total_marks`, `is_active`, `created_at`) VALUES
(1, 1, 'AI Foundations - Mid Term', 'Covers Python, Linear Algebra, and Calculus foundations.', 45, 50, 1, '2026-04-30 10:35:29');

-- --------------------------------------------------------

--
-- Table structure for table `exam_questions`
--

CREATE TABLE `exam_questions` (
  `id` int(11) NOT NULL,
  `exam_id` int(11) DEFAULT NULL,
  `question_text` text DEFAULT NULL,
  `type` enum('objective','subjective') DEFAULT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `correct_answer` varchar(255) DEFAULT NULL,
  `marks` int(11) DEFAULT NULL,
  `order_num` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam_questions`
--

INSERT INTO `exam_questions` (`id`, `exam_id`, `question_text`, `type`, `options`, `correct_answer`, `marks`, `order_num`) VALUES
(1, 1, 'What is the primary function of an activation function in a Neural Network?', 'objective', '[\"To add non-linearity\",\"To multiply weights\",\"To calculate loss\",\"To normalize input\"]', 'To add non-linearity', 5, 1),
(2, 1, 'Explain the difference between Overfitting and Underfitting in your own words.', 'subjective', NULL, NULL, 10, 2),
(3, 1, 'Which optimizer is most commonly used for Deep Learning tasks?', 'objective', '[\"Adam\",\"SGD\",\"RMSProp\",\"Adagrad\"]', 'Adam', 5, 3);

-- --------------------------------------------------------

--
-- Table structure for table `exam_submissions`
--

CREATE TABLE `exam_submissions` (
  `id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`answers`)),
  `score` int(11) DEFAULT NULL,
  `status` enum('pending','graded') DEFAULT 'pending',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `installments`
--

CREATE TABLE `installments` (
  `id` int(11) NOT NULL,
  `enrollment_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `due_date` date NOT NULL,
  `status` enum('paid','pending') DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `receipt_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `installments`
--

INSERT INTO `installments` (`id`, `enrollment_id`, `amount`, `due_date`, `status`, `paid_at`, `receipt_url`) VALUES
(1, 1, 15000.00, '2026-04-01', 'paid', NULL, NULL),
(2, 1, 15000.00, '2026-05-01', 'pending', NULL, NULL),
(3, 1, 15000.00, '2026-06-01', 'pending', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `material_completions`
--

CREATE TABLE `material_completions` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `material_id` int(11) DEFAULT NULL,
  `completed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `material_completions`
--

INSERT INTO `material_completions` (`id`, `student_id`, `material_id`, `completed_at`) VALUES
(1, 16, 6, '2026-04-30 10:35:29'),
(2, 16, 7, '2026-04-30 10:35:29');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `type` enum('mcq','text') NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `correct_answer` text DEFAULT NULL,
  `marks` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','student') DEFAULT 'student',
  `phone` varchar(20) DEFAULT NULL,
  `student_class` varchar(50) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `student_class`, `profile_img`, `created_at`) VALUES
(1, 'Admin Head', 'admin@prayogindia.in', '$2b$10$wOZEOBQKpmvyQbZ7KA9FSuYyz0HiCWxoxUU8/bdzbZpyASpBpMney', 'admin', NULL, NULL, NULL, '2026-04-27 08:11:22'),
(16, 'Aditi Singh', 'aditi@example.com', '$2b$10$z7yYSJDNUduk9EWM9vgU2OghXvv8bcb9bIFQUcz9wOOB6/7pAZxR6', 'student', '9876543210', NULL, NULL, '2026-04-30 10:35:29'),
(17, 'Ahmed Khan', 'ahmed@example.com', '$2b$10$z7yYSJDNUduk9EWM9vgU2OghXvv8bcb9bIFQUcz9wOOB6/7pAZxR6', 'student', '8765432109', NULL, NULL, '2026-04-30 10:35:29'),
(18, 'Kunal Bose', 'kunalbose.2525@gmail.com', 'guest_password_123', 'student', '+9156486646565', '5', NULL, '2026-05-01 11:21:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- Indexes for table `batches`
--
ALTER TABLE `batches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `certificate_number` (`certificate_number`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course_materials`
--
ALTER TABLE `course_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam_submissions`
--
ALTER TABLE `exam_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_id` (`exam_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `installments`
--
ALTER TABLE `installments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enrollment_id` (`enrollment_id`);

--
-- Indexes for table `material_completions`
--
ALTER TABLE `material_completions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_completion` (`student_id`,`material_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `batches`
--
ALTER TABLE `batches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `course_materials`
--
ALTER TABLE `course_materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `exam_questions`
--
ALTER TABLE `exam_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `exam_submissions`
--
ALTER TABLE `exam_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `installments`
--
ALTER TABLE `installments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `material_completions`
--
ALTER TABLE `material_completions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`);

--
-- Constraints for table `batches`
--
ALTER TABLE `batches`
  ADD CONSTRAINT `batches_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `certificates_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Constraints for table `course_materials`
--
ALTER TABLE `course_materials`
  ADD CONSTRAINT `course_materials_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`);

--
-- Constraints for table `exam_submissions`
--
ALTER TABLE `exam_submissions`
  ADD CONSTRAINT `exam_submissions_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`),
  ADD CONSTRAINT `exam_submissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `installments`
--
ALTER TABLE `installments`
  ADD CONSTRAINT `installments_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
