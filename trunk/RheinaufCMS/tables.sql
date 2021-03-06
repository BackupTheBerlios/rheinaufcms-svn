-- Erstellungszeit: 02. November 2007 um 19:30
-- 

-- --------------------------------------------------------

-- 
-- Tabellenstruktur f�r Tabelle `RheinaufCMS>Groups`
-- 

CREATE TABLE `RheinaufCMS>Groups` (
  `id` int(11) NOT NULL auto_increment,
  `Name` text NOT NULL,
  `Rechte` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Daten f�r Tabelle `RheinaufCMS>Groups`
-- 

INSERT INTO `RheinaufCMS>Groups` (`Name`, `Rechte`) 
VALUES ( 'Admin', 'a:9:{i:0;s:13:"GruppenRechte";i:1;s:6:"Module";i:2;s:18:"NaviEditRubrikEdit";i:3;s:17:"NaviEditRubrikNeu";i:4;s:17:"NaviEditSeiteEdit";i:5;s:16:"NaviEditSeiteNeu";i:6;s:5:"Seite";i:7;s:12:"EditSnippets";i:8;s:7:"UserNeu";}');

-- 
-- Tabellenstruktur f�r Tabelle `RheinaufCMS>Module`
-- 

CREATE TABLE `RheinaufCMS>Module` (
  `id` int(11) NOT NULL auto_increment,
  `sysID` varchar(100) NOT NULL default '',
  `Name` varchar(255) NOT NULL default '',
  `Frontend` varchar(255) NOT NULL default '',
  `Backend` varchar(100) NOT NULL default '',
  `Icon` varchar(255) NOT NULL default '',
  `SYSTEM` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Daten f�r Tabelle `RheinaufCMS>Module`
-- 

INSERT INTO `RheinaufCMS>Module` ( `sysID`, `Name`, `Frontend`, `Backend`, `Icon`, `SYSTEM`)
VALUES 
('SeiteEdit', 'Seiten bearbeiten', '', 'System/Admin/SeiteEdit.php', '/Libraries/Icons/32x32/filenew.png', 1),
('SnippetEditor', 'Snippets bearbeiten', '', 'Module/SnippetEditor.php', '/Module/SnippetEditor/icon.png', 0),
('NaviEdit', 'Navigation bearbeiten', '', 'System/Admin/NaviEdit.php', '/Libraries/Icons/32x32/folder_new.png', 1),
('User', 'User registrieren', '', 'System/Admin/User.php', '/Libraries/Icons/32x32/edit_user.png', 1),
('Module', 'Module verwalten', '', 'System/Admin/Module.php', '/Libraries/Icons/32x32/connect_no.png', 1),
('Gruppen', 'Gruppen verwalten', '', 'System/Admin/Gruppen.php', '/Libraries/Icons/32x32/edit_group.png', 1);

-- --------------------------------------------------------

-- 
-- Tabellenstruktur f�r Tabelle `RheinaufCMS>Navi`
-- 

CREATE TABLE `RheinaufCMS>Navi` (
  `id` int(11) NOT NULL default '0',
  `Hierarchy` tinyint(4) NOT NULL default '0',
  `Rubrik_key` int(11) NOT NULL default '0',
  `Rubrik` varchar(100) NOT NULL default '',
  `Page_key` int(11) NOT NULL default '0',
  `Seite` varchar(100) NOT NULL default '',
  `Show` tinyint(4) NOT NULL default '0',
  `Show_to` varchar(200) NOT NULL default '',
  `Modul` varchar(100) NOT NULL default '',
  `ext_link` varchar(200) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Daten f�r Tabelle `RheinaufCMS>Navi`
-- 

INSERT INTO `RheinaufCMS>Navi` (`id`,`Hierarchy`, `Rubrik_key`, `Rubrik`, `Page_key`, `Seite`, `Show`, `Show_to`, `Modul`, `ext_link`) 
VALUES (0, 0, 0, 'Startseite', 0, '', 1, '', '', ''),
( 1, 1, 0, 'Startseite', 0, 'index', 1, '', '', ''),
(2, 0, 1, 'Admin', 0, '', 0, '', 'Admin', ''),
(3, 1, 1, 'Admin', 0, 'index', 1, '', '', '');

-- --------------------------------------------------------

-- 
-- Tabellenstruktur f�r Tabelle `RheinaufCMS>Rechte`
-- 

CREATE TABLE `RheinaufCMS>Rechte` (
  `id` varchar(30) NOT NULL default '',
  `Frontend_Backend` text NOT NULL,
  `ModulName` text NOT NULL,
  `RechtName` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Daten f�r Tabelle `RheinaufCMS>Rechte`
-- 

INSERT INTO `RheinaufCMS>Rechte` (`id`, `Frontend_Backend`, `ModulName`, `RechtName`) VALUES ('NaviEditRubrikNeu', 'Backend', 'NaviEdit', 'Rubrik erstellen'),
('NaviEditRubrikEdit', 'Backend', 'NaviEdit', 'Rubrik bearbeiten'),
('NaviEditSeiteNeu', 'Backend', 'NaviEdit', 'Seite erstellen'),
('NaviEditSeiteEdit', 'Backend', 'NaviEdit', 'Seite Eigenschaften bearbeiten'),
('Seite', 'Backend', 'SeiteEdit', 'Seite bearbeiten'),
('GruppenRechte', 'Backend', 'Gruppen', 'Gruppen bearbeiten'),
('UserNeu', 'Backend', 'User', 'Benutzer eintragen'),
('Module', 'Backend', 'Module', 'Module installieren'),
('EditSnippets', 'Backend', 'SnippetEditor', 'Snippets bearbeiten');

-- --------------------------------------------------------

-- 
-- Tabellenstruktur f�r Tabelle `RheinaufCMS>Snippets`
-- 

CREATE TABLE `RheinaufCMS>Snippets` (
  `id` int(11) NOT NULL auto_increment,
  `Name` varchar(255) NOT NULL default '',
  `category` varchar(100) NOT NULL default '',
  `Content` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


-- 
-- Tabellenstruktur f�r Tabelle `RheinaufCMS>Snippets>Options`
-- 

CREATE TABLE `RheinaufCMS>Snippets>Options` (
  `id` int(11) NOT NULL auto_increment,
  `Text` varchar(100) NOT NULL default '',
  `Context` varchar(50) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- Tabellenstruktur f�r Tabelle `RheinaufCMS>User`
-- 

CREATE TABLE `RheinaufCMS>User` (
  `id` int(11) NOT NULL auto_increment,
  `Anrede` varchar(255) NOT NULL default '',
  `Titel` varchar(255) NOT NULL default '',
  `Name` varchar(255) NOT NULL default '',
  `Vorname` varchar(255) NOT NULL default '',
  `Anschrift` varchar(255) NOT NULL default '',
  `PLZ` varchar(255) NOT NULL default '',
  `Stadt` varchar(255) NOT NULL default '',
  `Login` varchar(255) NOT NULL default '',
  `Password` varchar(255) NOT NULL default '',
  `E-Mail` varchar(255) NOT NULL default '',
  `Verantwortlichkeitsbereich` varchar(255) NOT NULL default '',
  `Kontaktierbar` tinyint(4) NOT NULL default '0',
  `Group` varchar(255) NOT NULL default '',
  `last_login` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ;