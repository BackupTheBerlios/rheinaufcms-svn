-- 12. Juni 2007 um 18:36
--
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `RheinaufCMS>Groups`
--

CREATE TABLE `RheinaufCMS>Groups` (
  `id` int(11) NOT NULL auto_increment,
  `Name` varchar(100) NOT NULL,
  `Rechte` varchar(100) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM ;

--
-- Daten für Tabelle `RheinaufCMS>Groups`
--


INSERT INTO `RheinaufCMS>Groups` VALUES ('', 'Admin', 'a:9:{i:0;s:13:"GruppenRechte";i:1;s:6:"Module";i:2;s:18:"NaviEditRubrikEdit";i:3;s:17:"NaviEditRubrikNeu";i:4;s:17:"NaviEditSeiteEdit";i:5;s:16:"NaviEditSeiteNeu";i:6;s:5:"Seite";i:7;s:12:"EditSnippets";i:8;s:7:"UserNeu";}');
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
INSERT INTO `RheinaufCMS>Module` VALUES ('', 'NaviEdit', 'Navigation bearbeiten', '', 'System/Admin/NaviEdit.php', '/Libraries/Icons/32x32/folder_new.png', 1);
INSERT INTO `RheinaufCMS>Module` VALUES ('', 'User', 'User registrieren', '', 'System/Admin/User.php', '/Libraries/Icons/32x32/edit_user.png', 1);
INSERT INTO `RheinaufCMS>Module` VALUES ('', 'Module', 'Module verwalten', '', 'System/Admin/Module.php', '/Libraries/Icons/32x32/connect_no.png', 1);
INSERT INTO `RheinaufCMS>Module` VALUES ('', 'Gruppen', 'Gruppen verwalten', '', 'System/Admin/Gruppen.php', '/Libraries/Icons/32x32/edit_group.png', 1);
INSERT INTO `RheinaufCMS>Module` VALUES ('', 'SnippetEditor', 'Snippets bearbeiten', '', 'Module/SnippetEditor.php', '/Module/SnippetEditor/icon.png', 0);
INSERT INTO `RheinaufCMS>Module` VALUES ('', 'SeiteEdit', 'Seiten bearbeiten', '', 'System/Admin/SeiteEdit.php', '/Libraries/Icons/32x32/filenew.png', 1);



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
INSERT INTO `RheinaufCMS>Rechte` VALUES ('EditSnippets', 'Backend', 'SnippetEditor', 'Snippets bearbeiten');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `RheinaufCMS>User`
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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `RheinaufCMS>User`
--
INSERT INTO `RheinaufCMS>User` VALUES ('', '', '', '{admin_name}', '', '', '', '', '{admin_name}', '{admin_pass}', '', '', 0, 'Admin', '');


-- 
-- Tabellenstruktur für Tabelle `RheinaufCMS>Snippets`
-- 

CREATE TABLE `RheinaufCMS>Snippets` (
  `id` int(11) NOT NULL auto_increment,
  `Name` varchar(255) NOT NULL default '',
  `Content` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM;
