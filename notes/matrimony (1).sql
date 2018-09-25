-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 25, 2018 at 06:54 PM
-- Server version: 5.7.20-0ubuntu0.16.04.1-log
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
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
  `sun_sign` varchar(20) DEFAULT NULL,
  `moon_sign` varchar(20) DEFAULT NULL,
  `nakshatra` varchar(20) DEFAULT NULL,
  `is_manglik` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `candidates_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_arranged` tinyint(4) DEFAULT NULL,
  `arranged_with` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `contact_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL,
  `title` varchar(20) DEFAULT NULL,
  `address` varchar(40) DEFAULT NULL,
  `address_street_1` varchar(40) DEFAULT NULL,
  `address_street_2` varchar(40) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL,
  `zip` varchar(20) DEFAULT NULL
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
  `religion` varchar(20) DEFAULT NULL,
  `community` varchar(20) DEFAULT NULL,
  `sub_community` varchar(40) DEFAULT NULL,
  `mother_tongue` varchar(20) DEFAULT NULL,
  `gothra` varchar(40) DEFAULT NULL,
  `fathers_details` varchar(100) DEFAULT NULL,
  `mothers_details` varchar(100) DEFAULT NULL,
  `family_location` varchar(20) DEFAULT NULL,
  `native_place` varchar(20) DEFAULT NULL,
  `no_of_brothers` int(2) DEFAULT NULL,
  `no_of_sisters` int(2) DEFAULT NULL,
  `family_type` varchar(20) DEFAULT NULL,
  `family_affluence` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL,
  `image_url` varchar(100) DEFAULT NULL,
  `biodata_url` varchar(100) DEFAULT NULL,
  `is_display_picture` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `personal_details`
--

CREATE TABLE `personal_details` (
  `personal_details_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL,
  `first_name` varchar(40) DEFAULT NULL,
  `middle_name` varchar(40) DEFAULT NULL,
  `last_name` varchar(40) DEFAULT NULL,
  `date_time_of_birth` datetime DEFAULT NULL,
  `place_of_birth` varchar(40) DEFAULT NULL,
  `height` double DEFAULT NULL,
  `weight` int(3) DEFAULT NULL,
  `body_type` varchar(20) DEFAULT NULL,
  `is_disabled` tinyint(1) DEFAULT NULL,
  `health_problem` varchar(20) DEFAULT NULL,
  `marrital_status` varchar(20) DEFAULT NULL,
  `about_myself` varchar(250) DEFAULT NULL,
  `diet` varchar(20) DEFAULT NULL,
  `drink` varchar(20) DEFAULT NULL,
  `smoke` varchar(20) DEFAULT NULL
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

--
-- Dumping data for table `role_master`
--

INSERT INTO `role_master` (`role_id`, `role_name`) VALUES
(0, 'Admin'),
(1, 'User');

-- --------------------------------------------------------

--
-- Table structure for table `social_contact_id`
--

CREATE TABLE `social_contact_id` (
  `social_contact_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `candidates_id` int(11) NOT NULL,
  `facebook` varchar(20) DEFAULT NULL,
  `instagram` varchar(20) DEFAULT NULL,
  `twitter` varchar(20) DEFAULT NULL,
  `gmail` varchar(20) DEFAULT NULL
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
  MODIFY `role_id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
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
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
