-- phpMyAdmin SQL Dump
-- version 2.6.3-pl1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 01. Januar 2006 um 20:59
-- Server Version: 4.1.15
-- PHP-Version: 5.0.4
--
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `RheinaufCMS>Admin>Module`
--

CREATE TABLE `RheinaufCMS>Admin>Module` (
  `ID` int(11) NOT NULL default '0',
  `Name` text NOT NULL,
  `LongName` text NOT NULL,
  `Icon` text NOT NULL
) ENGINE=MyISAM ;

--
-- Daten für Tabelle `RheinaufCMS>Admin>Module`
--


INSERT INTO `RheinaufCMS>Admin>Module` VALUES (0, 'SeiteEdit', 'Seiten bearbeiten', 'Classes/Admin/Icons/32x32/filenew.png');
INSERT INTO `RheinaufCMS>Admin>Module` VALUES (1, 'NaviEdit', 'Navigation bearbeiten', 'Classes/Admin/Icons/32x32/folder_new.png');
INSERT INTO `RheinaufCMS>Admin>Module` VALUES (2, 'User', 'User registrieren', 'Classes/Admin/Icons/32x32/edit_user.png');
INSERT INTO `RheinaufCMS>Admin>Module` VALUES (3, 'Module', 'Module', 'Classes/Admin/Icons/32x32/connect_no.png');
INSERT INTO `RheinaufCMS>Admin>Module` VALUES (4, 'Gruppen', 'Gruppen verwalten', 'Classes/Admin/Icons/32x32/edit_group.png');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `RheinaufCMS>Groups`
--

CREATE TABLE `RheinaufCMS>Groups` (
  `id` int(11) NOT NULL auto_increment,
  `Name` text NOT NULL,
  `Rechte` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM ;

--
-- Daten für Tabelle `RheinaufCMS>Groups`
--


INSERT INTO `RheinaufCMS>Groups` VALUES (0, 'Verwalter', 'a:8:{i:0;s:13:"GruppenRechte";i:1;s:6:"Module";i:2;s:18:"NaviEditRubrikEdit";i:3;s:17:"NaviEditRubrikNeu";i:4;s:17:"NaviEditSeiteEdit";i:5;s:16:"NaviEditSeiteNeu";i:6;s:5:"Seite";i:7;s:7:"UserNeu";}');
-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `RheinaufCMS>Module`
--

CREATE TABLE `RheinaufCMS>Module` (
  `id` int(11) NOT NULL default '0',
  `Name` text NOT NULL
) ENGINE=MyISAM ;

--
-- Daten für Tabelle `RheinaufCMS>Module`
--

INSERT INTO `RheinaufCMS>Module` VALUES (0, 'Admin');


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `RheinaufCMS>Navi`
--

CREATE TABLE `RheinaufCMS>Navi` (
  `id` int(11) NOT NULL default '0',
  `Hierarchy` tinyint(4) NOT NULL default '0',
  `Rubrik_key` int(11) NOT NULL default '0',
  `Rubrik` varchar(100) character set latin1 NOT NULL default '',
  `Page_key` int(11) NOT NULL default '0',
  `Seite` varchar(100) character set latin1 NOT NULL default '',
  `Show` tinyint(4) NOT NULL default '0',
  `Show_to` varchar(200) character set latin1 NOT NULL default '',
  `Modul` varchar(100) character set latin1 NOT NULL default '',
  `ext_link` varchar(200) character set latin1 NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM ;

--
-- Daten für Tabelle `RheinaufCMS>Navi`
--

INSERT INTO `RheinaufCMS>Navi` VALUES (0, 0, 0, 'Startseite', 0, '', 1, '', '', '');
INSERT INTO `RheinaufCMS>Navi` VALUES (1, 1, 0, 'Startseite', 0, 'index', 1, '', '', '');
INSERT INTO `RheinaufCMS>Navi` VALUES (2, 0, 1, 'Admin', 0, '', 0, '', 'Admin', '');
INSERT INTO `RheinaufCMS>Navi` VALUES (3, 1, 1, 'Admin', 0, 'index', 1, '', '', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `RheinaufCMS>Rechte`
--

CREATE TABLE `RheinaufCMS>Rechte` (
  `id` varchar(30) NOT NULL default '',
  `Frontend_Backend` text NOT NULL,
  `ModulName` text NOT NULL,
  `RechtName` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM ;

--
-- Daten für Tabelle `RheinaufCMS>Rechte`
--

INSERT INTO `RheinaufCMS>Rechte` VALUES ('NaviEditRubrikNeu', 'Backend', 'NaviEdit', 'Rubrik erstellen');
INSERT INTO `RheinaufCMS>Rechte` VALUES ('NaviEditRubrikEdit', 'Backend', 'NaviEdit', 'Rubrik bearbeiten');
INSERT INTO `RheinaufCMS>Rechte` VALUES ('NaviEditSeiteNeu', 'Backend', 'NaviEdit', 'Seite erstellen');
INSERT INTO `RheinaufCMS>Rechte` VALUES ('NaviEditSeiteEdit', 'Backend', 'NaviEdit', 'Seite Eigenschaften bearbeiten');
INSERT INTO `RheinaufCMS>Rechte` VALUES ('Seite', 'Backend', 'SeiteEdit', 'Seite bearbeiten');
INSERT INTO `RheinaufCMS>Rechte` VALUES ('GruppenRechte', 'Backend', 'Gruppen', 'Gruppen bearbeiten');
INSERT INTO `RheinaufCMS>Rechte` VALUES ('UserNeu', 'Backend', 'User', 'Benutzer eintragen');
INSERT INTO `RheinaufCMS>Rechte` VALUES ('Module', 'Backend', 'Module', 'Module installieren');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `RheinaufCMS>User`
--

CREATE TABLE `RheinaufCMS>User` (
  `id` int(11) NOT NULL auto_increment,
  `Name` text NOT NULL,
  `LoginName` text NOT NULL,
  `Password` text NOT NULL,
  `E-Mail` text NOT NULL,
  `Verantwortlichkeitsbereich` text NOT NULL,
  `Kontaktierbar` tinyint(4) NOT NULL default '0',
  `Group` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM ;

--
-- Daten für Tabelle `RheinaufCMS>User`
--

INSERT INTO `RheinaufCMS>User` VALUES (0, 'admin', '', 'admin', '', '', 0, 'dev');

