-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 24, 2018 at 08:09 PM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 7.2.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `matrimony`
--

-- --------------------------------------------------------

--
-- Table structure for table `astro_details`
--

CREATE TABLE `astro_details` (
  `astro_details_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL,
  `sun_sign` varchar(20) NOT NULL,
  `moon_sign` varchar(20) NOT NULL,
  `nakshatra` varchar(20) NOT NULL,
  `is_manglik` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `candidates_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_arranged` tinyint(1) NOT NULL,
  `arranged_with` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `contact_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL,
  `title` varchar(20) NOT NULL,
  `address` varchar(40) NOT NULL,
  `address_street_1` varchar(40) NOT NULL,
  `address_street_2` varchar(40) NOT NULL,
  `city` varchar(20) NOT NULL,
  `state` varchar(20) NOT NULL,
  `country` varchar(20) NOT NULL,
  `zip` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `credentials`
--

CREATE TABLE `credentials` (
  `user_id` int(11) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `family_background`
--

CREATE TABLE `family_background` (
  `family_background_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL,
  `religion` varchar(20) NOT NULL,
  `community` varchar(20) NOT NULL,
  `sub_community` varchar(40) NOT NULL,
  `mother_tongue` varchar(20) NOT NULL,
  `gothra` varchar(40) NOT NULL,
  `fathers_details` varchar(100) NOT NULL,
  `mothers_details` varchar(100) NOT NULL,
  `family_location` varchar(20) NOT NULL,
  `native_place` varchar(20) NOT NULL,
  `no_of_brothers` int(2) NOT NULL,
  `no_of_sisters` int(2) NOT NULL,
  `family_type` varchar(20) NOT NULL,
  `family_affluence` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL,
  `image_url` varchar(100) NOT NULL,
  `biodata_url` varchar(100) NOT NULL,
  `is_display_picture` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `personal_details`
--

CREATE TABLE `personal_details` (
  `personal_details_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL,
  `first_name` varchar(40) NOT NULL,
  `middle_name` varchar(40) NOT NULL,
  `last_name` varchar(40) NOT NULL,
  `date_time_of_birth` datetime NOT NULL,
  `place_of_birth` varchar(40) NOT NULL,
  `height` double NOT NULL,
  `weight` int(3) NOT NULL,
  `body_type` varchar(20) NOT NULL,
  `is_disabled` tinyint(1) NOT NULL,
  `health_problem` varchar(20) NOT NULL,
  `marrital_status` varchar(20) NOT NULL,
  `about_myself` varchar(250) NOT NULL,
  `diet` varchar(20) NOT NULL,
  `drink` varchar(20) NOT NULL,
  `smoke` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `professional_details`
--

CREATE TABLE `professional_details` (
  `professional_details_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL,
  `education_level` varchar(100) NOT NULL,
  `university` varchar(40) NOT NULL,
  `company` varchar(100) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `annual_income` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `role_master`
--

CREATE TABLE `role_master` (
  `role_id` int(2) NOT NULL,
  `role_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `social_contact_id`
--

CREATE TABLE `social_contact_id` (
  `social_contact_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL,
  `facebook` varchar(20) NOT NULL,
  `instagram` varchar(20) NOT NULL,
  `twitter` varchar(20) NOT NULL,
  `gmail` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `telephone`
--

CREATE TABLE `telephone` (
  `telephone_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `email_id` varchar(20) NOT NULL,
  `role_id` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `astro_details`
--
ALTER TABLE `astro_details`
  ADD PRIMARY KEY (`astro_details_id`);

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`candidates_id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`contact_id`);

--
-- Indexes for table `family_background`
--
ALTER TABLE `family_background`
  ADD PRIMARY KEY (`family_background_id`);

--
-- Indexes for table `personal_details`
--
ALTER TABLE `personal_details`
  ADD PRIMARY KEY (`personal_details_id`);

--
-- Indexes for table `professional_details`
--
ALTER TABLE `professional_details`
  ADD PRIMARY KEY (`professional_details_id`);

--
-- Indexes for table `role_master`
--
ALTER TABLE `role_master`
  ADD PRIMARY KEY (`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `social_contact_id`
--
ALTER TABLE `social_contact_id`
  ADD PRIMARY KEY (`social_contact_id`);

--
-- Indexes for table `telephone`
--
ALTER TABLE `telephone`
  ADD PRIMARY KEY (`telephone_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `email_id` (`email_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `astro_details`
--
ALTER TABLE `astro_details`
  MODIFY `astro_details_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `candidates_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_details`
--
ALTER TABLE `personal_details`
  MODIFY `personal_details_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `professional_details`
--
ALTER TABLE `professional_details`
  MODIFY `professional_details_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role_master`
--
ALTER TABLE `role_master`
  MODIFY `role_id` int(2) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `social_contact_id`
--
ALTER TABLE `social_contact_id`
  MODIFY `social_contact_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telephone`
--
ALTER TABLE `telephone`
  MODIFY `telephone_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
