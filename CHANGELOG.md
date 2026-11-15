# Änderungen

## 1.3.0

Die Integration heißt jetzt **Family Administration**. Darstellung und App-Rollen werden getrennt zugewiesen: Maximilian kann Darstellung „Maximilian“ und App-Rolle „Benutzer“ erhalten, Paul Darstellung „Paul“ und dieselbe App-Rolle „Benutzer“. Rechte je App einmal in der gemeinsamen Rolle pflegen; Änderungen gelten für alle zugeordneten Benutzer.

Unter **Dashboards** werden Darstellungen angelegt, umbenannt, nach Rückfrage gelöscht und sortiert. **Nicht gewählt** ist standardmäßig zugeklappt; die Suche macht Treffer sichtbar. In der **Rollenverwaltung** stehen die App-Rollen **Admin** und **Benutzer** sowie eigene Rollen. App-Admin ist keine HA-Administratorrolle. Der Zugriff auf Family Administration und den zentralen Urlaubsschalter bleibt echten HA-Administratoren und Eigentümern vorbehalten.

Der **Urlaubsmodus** hat einen eigenen zentralen Tab. Vorhandene Zustände und vergangene Hausarbeitspausen bleiben erhalten. Bestehende gemischte Rollen werden einmalig getrennt; gleiche App-Freigaben werden gemeinsam genutzt. Bestehende Rechte, explizite Ablehnungen, Dashboardfreigaben und die Aktivierung bleiben erhalten. Übernommene App-Rechte lassen sich anschließend bewusst durch die gemeinsame Rolle „Benutzer“ oder „Admin“ ersetzen. Es gibt keine automatische Hochstufung.

Update über das bestehende Repository/HACS installieren, HA neu starten und Browser/App vollständig neu laden. Der technische Integrationspfad, Protokolle und gespeicherte Zuordnungen bleiben updatefähig. Bereits verbundene Anwendungen benötigen für die getrennten App-Rollen kein neues Berechtigungsmodul. Light Manager 1.5.1 zeigt Urlaubspausen auch in der Zeitübersicht; Shutter Manager 1.9.1 aktualisiert die Hilfe auf den neuen Tab.


## 1.2.1

Beim nachträglichen Start von Hausarbeiten bleiben auch vergangene Tage einer noch laufenden lokalen Urlaubspause erhalten, wenn der zentrale Modus bereits bewusst geändert wurde. Die zentrale Entscheidung für heute bleibt erhalten. Zwei zusätzliche echte HA-Tests prüfen beide zentralen Zustände und den Neustart.

Empfohlenes Update: Family Access Manager 1.2.1 zuerst installieren, danach Light Manager 1.5.0, Shutter Manager 1.9.0 und Hausarbeiten 0.5.0. Home Assistant neu starten und Browser/App neu laden.

## 1.2.0

Der Urlaubsmodus wird ausschließlich unter **Family Access → Einstellungen → Urlaubsmodus** bedient. Die eigenen Urlaubsmodus-Bereiche und Schalter entfallen aus Light Manager, Shutter Manager und Hausarbeiten. Die Option „Im Urlaub pausieren“ je Programm bleibt erhalten; Programme ohne diese Option laufen weiter. Hausarbeiten pausieren ohne Änderung ihres Wiederholungsrhythmus und laufen beim Ausschalten ab heute weiter.

Beim ersten Start wird ein bisher aktiver Urlaubsmodus einmalig zentral als aktiv übernommen. Vergangene Urlaubstage aus Hausarbeiten bleiben erhalten. Eine bewusste zentrale Änderung hat Vorrang vor später startenden Anwendungen. Bei vorübergehend fehlendem Family Access bleibt der zuletzt bestätigte Zustand erhalten.

**Update:** zuerst Family Access Manager 1.2.0, danach Light Manager 1.5.0, Shutter Manager 1.9.0 und Hausarbeiten 0.5.0 installieren. Anschließend Home Assistant neu starten und Browser/App vollständig neu laden. Der zentrale Schalter speichert sofort, unabhängig von noch ungespeicherten Rollenänderungen. Bedienen dürfen echte HA-Administratoren und Eigentümer.

Automationen können `family_access_manager.set_vacation` mit `enabled: true/false` verwenden. Die bisherigen Light-/Shutter-Dienste leiten an diesen Dienst weiter und behalten den ursprünglichen HA-Benutzerkontext: echte Administratoren oder vertrauenswürdige HA-Automationen dürfen schalten. Ein reines Anwendungs-Verwaltungsrecht berechtigt nicht zum globalen Umschalten. Alte lokale WebSocket-Schreibzugriffe und Sicherungswerte können den zentralen Modus nicht überschreiben.


## 1.1.2

Der bisherige Tab „Rollen“ heißt jetzt „Dashboards“ und enthält ausschließlich die rollenspezifischen Dashboardfreigaben, Suche, Sortierung und Übernahme der Reihenfolge auf Benutzer.

Der neue Tab „Rollenverwaltung“ ist für das Anlegen, Umbenennen und Löschen von Rollen zuständig. Löschen erfordert weiterhin eine Bestätigung; zugewiesene Rollen bleiben geschützt. Die Rollenauswahl bleibt beim Wechsel zwischen Dashboards, Rollenverwaltung und Anwendungstabs erhalten.

Benutzerzuordnungen, Berechtigungen und gespeicherte Freigaben bleiben erhalten. Die Oberfläche verwendet weiterhin ausschließlich die gemeinsamen Komponenten und Styles des HA UI Kit 1.6.0.


## 1.1.1

Die aktive Anwendung bleibt auf Mobilgeräten beim Wechseln und Bearbeiten von Rollen in der horizontalen Tab-Leiste sichtbar. Berechtigungsschalter behalten ihren Tastaturfokus nach Änderungen. Originalkomponenten und Styles des HA UI Kit 1.6.0 bleiben unverändert. Zentrale Anwendungsrechte und Übernahme aus Version 1.1.0 bleiben erhalten.

## 1.1.0

Acht eigene Anwendungstabs: Light Manager, Shutter Manager, Essensplaner, Hausarbeiten, Gartenarbeit, Spülmaschine, Music Manager und Wecker. Mehrfachrollen sind in der Benutzerverwaltung auswählbar. Fehlgeschlagene Anwendungsprüfungen erscheinen im bestehenden Fehlerprotokoll. Rollen werden weiterhin erst nach Bestätigung gelöscht.

Berechtigungen werden jetzt in **Family Access → Anwendung → Rolle** verwaltet. Benutzer können mehrere Rollen erhalten; ihre Freigaben ergänzen sich. Vorhandene Anwendungsrechte werden einmalig in Rollen mit dem Zusatz „übernommen“ importiert und den bisherigen Benutzern zugeordnet. Dashboardfreigaben und die Aktivierung der Dashboardnavigation werden dadurch nicht verändert.

Zum Entziehen eines Rechts alle zugewiesenen Rollen einschließlich übernommener Rollen prüfen. Neue Benutzer erhalten nach der Übernahme keine automatischen Anwendungsrechte. Echte HA-Administratoren behalten Vollzugriff zur Wiederherstellung. Geräte-, Eigentümer- und externe Kontoberechtigungen gelten zusätzlich; eine Rolle erzeugt keine HA-Administratorrechte.

**Aktualisierung:** zuerst Family Access Manager 1.1.0 oder neuer, danach die beteiligten Anwendungen aktualisieren und Home Assistant neu starten. Solange Family Access nicht eingerichtet ist, bleibt die bisherige Rechtevergabe erhalten. Ist Family Access eingerichtet, aber nicht verfügbar oder zu alt, werden Anwendungsaktionen für normale Benutzer abgelehnt. Lokale Benutzer-/Personen-, Geräte- und Musikkontozuordnungen bleiben für Identität und Eigentum erhalten; Rechte werden zentral vergeben.


## 1.0.1 – 15.11.2026

- Prüfversionskennzeichnungen aus Einrichtung und Meldungen entfernt; reguläre Veröffentlichung ohne Beta-Zusatz.
- Rollen nur nach ausdrücklicher Bestätigung löschen; Abbrechen, Schließen und Escape erhalten die Rolle. Zugewiesene Rollen bleiben geschützt.
- Eigener sichtbarer Versionsbereich in den Einstellungen für Oberfläche, Integration und UI Kit.
- Native Dashboardliste im HA-Profil für aktivierte Benutzer nach Dashboardfreigaben filtern; Administrator- und nicht aktivierte Konten behalten ihre Auswahl.
- Persönliche und systemweite Startseite aus dem tatsächlichen nativen HA-Profil lesen; die Adminauswahl schreibt die Startseite an die richtige Stelle, erhält andere Profileinstellungen und aktualisiert native Abonnements.

## 1.0.0 – 15.11.2026

- Nur gewählte Dashboards sortierbar; übrige Dashboards im aufklappbaren Block Nicht gewählt ohne Pfeile. Reihenfolge nicht gewählter Dashboards bleibt bei der Übernahme erhalten.
- Speicherfehler durch unveränderte alte Admin-/gelöschte Benutzerzuordnungen behoben. Neue Versuche, Administratoren einzuschränken, bleiben gesperrt. Die Oberfläche übernimmt die bereinigte gespeicherte Konfiguration.

- Den zuletzt geprüften Funktionsstand als reguläres GitHub-Release veröffentlicht, damit HACS bei ausgeblendeten Vorabversionen eine Versionsnummer statt eines Commit-Hashes anbietet.
- Veröffentlichung unterscheidet automatisch reguläre Versionen und Versionen mit Vorabzusatz; reguläre Versionen werden explizit als neueste Version markiert.
- Einheitliche Versionsangaben in Integration, Oberfläche und Paketen. HACS-Anzeigename ohne Prüfversionszusatz.
- Rollen, Dashboardrechte, Benutzeraktivierungen und persönliche Seitenleisteneinstellungen unverändert.

## 1.0.0-beta.3 – 15.11.2026

- Doppeltes Rollennamensfeld durch eine eigene Umbenennen-Aktion mit Dialog ersetzt.
- Technischen Tab Prüfen nach Einstellungen → Diagnose verschoben.
- Dashboardreihenfolge je Rolle und Übernahme auf ausgewählte persönliche Benutzer über den nativen HA-Benutzerspeicher.
- Sichtbare Dashboards und Startseite je Administrator, ohne dessen Vollzugriff zu ändern.
- Migration vorhandener Rollen, Erkennung veralteter Seitenleistenstände und präzise Rückmeldung bei einzelnen Übernahmefehlern.
- Originalkomponenten von HA UI Kit 1.6.0 einschließlich Pfeilen, Schaltern, Auswahl- und Umbenennungsdialogen; keine lokalen CSS-Regeln.

## 1.0.0-beta.2 – 15.11.2026

- Kompakte gemeinsame Benutzerzeile mit Name, Rolle und Aktivierung aus HA UI Kit 1.6.0.
- Dauerhaften Warnbanner und lange Einleitung aus der Benutzeransicht entfernt; Zugriffsschutz in die Einstellungen verschoben.
- Family Access als Admin-Panel registriert und für eingeschränkte Benutzer aus der Panelliste entfernt.
- Serverseitig geschützter Panel-Start; zwischengespeicherte Oberflächen zeigen normalen Benutzern keine Inhalte.

## 1.0.0-beta.1 – 15.11.2026

- Klare semantische Vorabversionierung eingeführt.
- Oberfläche vollständig auf unverändertes HA UI Kit 1.5.2 aktualisiert.
- Dashboardfreigaben in den Mittelpunkt gestellt; Gerätefreigaben und Testschalter aus der Oberfläche entfernt.
- Administrator-Fehlerprotokoll mit Benutzer, Zeitpunkt, Aktion, Ziel, Grund und Anfrageweg; maximal 200 dauerhaft gespeicherte Einträge.
- Eigene HTTP-/WebSocket- und native Dashboardablehnungen erfasst, ohne Tokens oder vollständige Anfrageinhalte zu speichern.

## 0.4.0 – 15.11.2026

- Native Seitenleistenliste je aktiviertem Benutzer nach Dashboardrechten filtern.
- Nicht freigegebene Dashboards und allgemeine Panels ausblenden; Profil und Family Access beibehalten.
- Bestehende Browser über panels_updated nach erfolgreichen Rechteänderungen aktualisieren.
- HA-eigene Administratorprüfungen und Panelüberschreibungen beibehalten; Originalhandler beim Entladen wiederherstellen.
- Zusatztests für native Panelantworten, Benutzertrennung, Aktualisierung und Entladen.

## 0.3.0 – 15.11.2026

- Aktivierung von Family Access getrennt von der Rollenzuordnung je Benutzer.
- Ausschalten behält die Rolle; neue Benutzer sind standardmäßig ausgeschaltet.
- Bestehende Benutzerzuordnungen werden beim Laden sicher in aktive Zuordnungen übernommen.
- HTTP, WebSocket und die optionale Dashboard-Sperre berücksichtigen die Auswahl serverseitig.
- Tests für Migration, Speicherung, selektive Sperre, bestehende Verbindungen und Selbstaktivierungsversuche ergänzt.
- Separates Original-Stylesheet des UI Kits vollständig in beide ZIP-Pakete aufgenommen.

## 0.2.0 – 10. November 2026

Oberfläche auf die unveränderten Komponenten von HA UI Kit 1.2.1 umgestellt; lokale CSS-Regeln entfernt. Gemeinsamer Kopf, Navigation, Benutzer-/Berechtigungszeilen, Auswahlfelder, Schalter, Buttons und Verwerfendialog. Marketplace-Logo ergänzt. Funktionen und Backend-Berechtigungslogik unverändert.


## 0.1.0 – 10. November 2026

Erste installierbare Prüfversion mit Benutzer-/Rollenverwaltung, getrennten Dashboard- und Gerätefreigaben, Entitäts-/Bereichs-/Labelfreigaben, geschützten eigenen HTTP-/WebSocket-Funktionen, virtuellem Testschalter und optionaler nativer Sperre von Dashboard-Konfigurationsanfragen.

Allgemeine HA-Geräte-APIs und die Freigabe des nativen Dashboardeditors sind noch nicht Bestandteil dieser Version. Der lokale Test ist abgeschlossen; der Live-Test über Nabu Casa steht aus.

