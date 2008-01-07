RheinaufCMS 

Mini-Installations-Anleitung

Vorraussetzungen:
Webhosting mit
	-PHP-Interpreter
	-SQL-Datenbank-Zugriff
	-Mindestens 15 MByte Server-Festplattenplatz
	
Notwendige Angaben (vom Webhoster):
	-Datenbankzugang (DB-Name, User, Passwort, Servername)
	-ftp-Zugang (Servername, User, Passwort, eventuell Root-Directory)
	
Frei zu vergebende notwendige Angaben
	-Projektname
	-User
	-Passwort
	
Separat zu erstellen / anzupassen: 
	-Design mittels CSS
	-eventuell Templates

Zur Installation laden Sie das (entpackten) Verzeichnis RheinaufCMS inklusive der Unterverzeichnisse ins Stammverzeichnis des Servers.
Ausserdem m�ssen die Dateien .htaccess und CMSinit.php auf der gelichen Ebene liegen.

rufen Sie die Datei RheinaufCMS/install.php auf.
Dort fragt ein Formular die notwendigen Angaben ab. Die Installation legt automatisch die n�tigen Datenbankstrukturen an, setzt Zugriffsrechte f�r Verzeichnisse und schreibt die Zugangsdaten in die Konfigurationsdatei.

Ab jetzt wird jeder Aufruf der Domain 'Ihre-Domain.xy' auf die Startseite des CMS geleitet. Eine eventuell vorhanden index.html wird ignoriert. 

Zur Verwaltung des CMS gelangen Sie �ber den Link 'weiter zum Login'.
Direkte Aufrufe sind �ber 'Ihre-Domain.xy/Admin' m�glich. Unter Angabe der vorher vergebenen Zugangsdaten f�r den Stammnutzer (Username und Passwort) erhalten Sie Zugriff auf die RheinaufCMS-Kommandozentrale. Hier definieren sie unter anderem die Navigationsstruktur der Site legen Inhalte an.

