
-- --------------------------------------------------------

-- 
-- Tabellenstruktur für Tabelle `RheinaufCMS>Exhibition>Bilder`
-- 

CREATE TABLE `RheinaufCMS>Exhibition>Bilder` (
  `id` int(11) NOT NULL auto_increment,
  `Name` varchar(250) character set latin1 collate latin1_german1_ci NOT NULL default '',
  `Jahr` varchar(4) NOT NULL default '',
  `Höhe` varchar(4) NOT NULL default '',
  `Breite` varchar(4) NOT NULL default '',
  `Technik` varchar(250) NOT NULL default '',
  `Standort` varchar(250) NOT NULL default '',
  `Beschreibung` text NOT NULL,
  `BildDesMonats` varchar(6) NOT NULL default '',
  `Dateiname` varchar(250) NOT NULL default '',
  PRIMARY KEY  (`id`),
  KEY `Jahr` (`Jahr`)
) ENGINE=MyISAM AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

-- 
-- Tabellenstruktur für Tabelle `RheinaufCMS>Exhibition>ExhibitionIndices`
-- 

CREATE TABLE `RheinaufCMS>Exhibition>ExhibitionIndices` (
  `id` int(11) NOT NULL auto_increment,
  `Exhibition_id` int(11) NOT NULL default '0',
  `Raum_id` int(11) default NULL,
  `index` int(11) NOT NULL default '0',
  PRIMARY KEY  (`id`),
  KEY `Raum_id` (`Exhibition_id`)
) ENGINE=MyISAM ;

-- --------------------------------------------------------

-- 
-- Tabellenstruktur für Tabelle `RheinaufCMS>Exhibition>Exhibitions`
-- 

CREATE TABLE `RheinaufCMS>Exhibition>Exhibitions` (
  `ExhibitionId` int(11) NOT NULL auto_increment,
  `Exhibitionname` varchar(250) NOT NULL default '',
  `ExhibitionIndex` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ExhibitionId`)
) ENGINE=MyISAM;

-- --------------------------------------------------------

-- 
-- Tabellenstruktur für Tabelle `RheinaufCMS>Exhibition>Indices`
-- 

CREATE TABLE `RheinaufCMS>Exhibition>Indices` (
  `id` int(11) NOT NULL auto_increment,
  `Raum_id` int(11) NOT NULL default '0',
  `Bild_id` int(11) default NULL,
  `index` int(11) NOT NULL default '0',
  PRIMARY KEY  (`id`),
  KEY `Raum_id` (`Raum_id`)
) ENGINE=MyISAM ;

-- --------------------------------------------------------

-- 
-- Tabellenstruktur für Tabelle `RheinaufCMS>Exhibition>Rooms`
-- 

CREATE TABLE `RheinaufCMS>Exhibition>Rooms` (
  `RoomId` int(11) NOT NULL auto_increment,
  `Roomname` varchar(250) NOT NULL default '',
  `RoomIndex` int(11) NOT NULL default '0',
  `Titelbild` varchar(250) NOT NULL default '',
  PRIMARY KEY  (`RoomId`)
) ENGINE=MyISAM ;


-------------------
INSERT INTO `RheinaufCMS>Rechte` VALUES ('ExhibitionAdmin', 'Backend', 'RheinaufExhibitionAdmin', 'Austellungen bearbeiten');

INSERT INTO `RheinaufCMS>Admin>Module` VALUES ('', 'RheinaufExhibitionAdmin', 'Galerie bearbeiten', 'Module/RheinaufExhibition/Backend/icons/gallery_icon.png', 'Module/RheinaufExhibition/Backend/RheinaufExhibitionAdmin.php');
