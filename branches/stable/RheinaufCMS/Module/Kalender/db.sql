-- phpMyAdmin SQL Dump
-- version 2.10.1
-- http://www.phpmyadmin.net
-- 
-- Host: 127.0.0.2
-- Erstellungszeit: 14. Februar 2008 um 12:18
-- Server Version: 4.1.22
-- PHP-Version: 4.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- Datenbank: `db23624_7`
-- 

-- --------------------------------------------------------

-- 
-- Tabellenstruktur für Tabelle `RheinaufCMS>Kalender>Kategorien`
-- 

CREATE TABLE `RheinaufCMS>Kalender>Kategorien` (
  `id` int(11) NOT NULL default '0',
  `Name` varchar(250) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `Access` varchar(200) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `event` tinyint(4) NOT NULL default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- Tabellenstruktur für Tabelle `RheinaufCMS>Kalender>MemoMail`
-- 

CREATE TABLE `RheinaufCMS>Kalender>MemoMail` (
  `id` int(11) NOT NULL auto_increment,
  `KalenderID` int(11) NOT NULL default '0',
  `E-Mail` varchar(50) NOT NULL default '',
  `Datum` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- Tabellenstruktur für Tabelle `RheinaufCMS>Kalender>Termine`
-- 

CREATE TABLE `RheinaufCMS>Kalender>Termine` (
  `id` int(11) NOT NULL auto_increment,
  `UID` varchar(32) NOT NULL default '0',
  `SUMMARY` varchar(250) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `DESCRIPTION` text character set latin1 collate latin1_german1_ci NOT NULL,
  `LOCATION` varchar(250) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `CATEGORIES` varchar(250) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `URL` varchar(250) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `STATUS` varchar(20) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `CLASS` varchar(10) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `DTSTART` timestamp NOT NULL default '0000-00-00 00:00:00',
  `DTEND` timestamp NOT NULL default '0000-00-00 00:00:00',
  `DTSTAMP` timestamp NOT NULL default '0000-00-00 00:00:00',
  `X-RHEINAUF-LOGO` varchar(100) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `X-RHEINAUF-BILD` varchar(100) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `X-RHEINAUF-PREIS` varchar(10) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `CONTACT` varchar(100) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `X-RHEINAUF-EVENT` tinyint(4) NOT NULL default '0',
  `X-OTHER-VCAL` text NOT NULL,
  `X-HKGW-FLAG` tinyint(4) NOT NULL default '0',
  PRIMARY KEY  (`id`),
  KEY `EVENT` (`X-RHEINAUF-EVENT`),
  KEY `CATEGORIES` (`CATEGORIES`),
  KEY `DTSTART` (`DTSTART`),
  KEY `CLASS` (`CLASS`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

