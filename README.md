# Family Access Manager 1.2.0

## Zentraler Urlaubsmodus · 1.2.0

Der Urlaubsmodus wird ausschließlich unter **Family Access → Einstellungen → Urlaubsmodus** bedient. Die eigenen Urlaubsmodus-Bereiche und Schalter entfallen aus Light Manager, Shutter Manager und Hausarbeiten. Die Option „Im Urlaub pausieren“ je Programm bleibt erhalten; Programme ohne diese Option laufen weiter. Hausarbeiten pausieren ohne Änderung ihres Wiederholungsrhythmus und laufen beim Ausschalten ab heute weiter.

Beim ersten Start wird ein bisher aktiver Urlaubsmodus einmalig zentral als aktiv übernommen. Vergangene Urlaubstage aus Hausarbeiten bleiben erhalten. Eine bewusste zentrale Änderung hat Vorrang vor später startenden Anwendungen. Bei vorübergehend fehlendem Family Access bleibt der zuletzt bestätigte Zustand erhalten.

**Update:** zuerst Family Access Manager 1.2.0, danach Light Manager 1.5.0, Shutter Manager 1.9.0 und Hausarbeiten 0.5.0 installieren. Anschließend Home Assistant neu starten und Browser/App vollständig neu laden. Der zentrale Schalter speichert sofort, unabhängig von noch ungespeicherten Rollenänderungen. Bedienen dürfen echte HA-Administratoren und Eigentümer.

Automationen können `family_access_manager.set_vacation` mit `enabled: true/false` verwenden. Die bisherigen Light-/Shutter-Dienste leiten an diesen Dienst weiter und behalten den ursprünglichen HA-Benutzerkontext: echte Administratoren oder vertrauenswürdige HA-Automationen dürfen schalten. Ein reines Anwendungs-Verwaltungsrecht berechtigt nicht zum globalen Umschalten. Alte lokale WebSocket-Schreibzugriffe und Sicherungswerte können den zentralen Modus nicht überschreiben.


Benutzerrollen und Dashboardfreigaben für Home Assistant. Die Oberfläche verwendet vollständig das lokal eingebundene **HA UI Kit 1.6.0**.

Family Access ist eine reine Verwaltungsoberfläche für Administratoren und Eigentümer. Normale Benutzer sehen keinen Family-Access-Eintrag; auch der direkte Panel-Start ist serverseitig geschützt.

## Dashboardzugriff einrichten

1. Unter **Rollenverwaltung** eine Rolle anlegen.
2. Unter **Dashboards** die Rolle wählen und die gewünschten Dashboards über die Schalter freigeben. Hier auch sortieren und die Reihenfolge auf Benutzer übernehmen.
3. Unter **Benutzer** das Konto aktivieren, die Rolle wählen und **Änderungen speichern**.
4. Die Seitenleiste zeigt diesem Konto nur freigegebene Dashboards sowie die eigenen Konto-/internen Routen. Allgemeine Panels wie Verlauf, Kalender und Medien werden ausgeblendet; das feste Konto- und Benachrichtigungsmenü bleibt bestehen.
5. Für direkte Dashboard-Konfigurationsanfragen unter **Einstellungen → Dashboard-Konfigurationen sperren** die Sperre einschalten und speichern.
6. Mit einem separaten Benutzerkonto prüfen. Nach einem Update Home Assistant neu starten und den Browser vollständig neu laden.

Eine Rolle lässt sich vorbereiten, ohne das Konto zu aktivieren. Beim Ausschalten bleibt die Rolle gespeichert und die normale HA-Navigation wird wiederhergestellt. Administratoren und Eigentümer behalten Vollzugriff.

Gerätefreigaben sind für diesen Ablauf nicht erforderlich und werden nicht mehr angeboten. Die Bedienung in freigegebenen Dashboards folgt den nativen HA-Rechten. Vorhandene Anzeigen-/Bedienen-/Bearbeiten-Zuordnungen erscheinen als freigegeben und bleiben bis zu einer Änderung gespeichert; es wird damit kein eigener schreibgeschützter HA-Modus oder Administratorzugriff vergeben.

## Rollen löschen und Versionen

Unter **Rollenverwaltung** stehen Anlegen, Umbenennen und Löschen separat zur Verfügung. Das Stiftsymbol benennt eine Rolle um. Das Papierkorbsymbol öffnet zuerst **Rolle löschen?**. **Abbrechen**, Schließen oder Escape erhalten die Rolle. Erst **Rolle löschen** entfernt sie aus dem Entwurf; **Änderungen speichern** übernimmt den Entwurf dauerhaft. Zugewiesene Rollen können weiterhin nicht gelöscht werden.

Unter **Einstellungen → Versionen** stehen Oberfläche, Integration und HA UI Kit in einem eigenen sichtbaren Bereich. Die veröffentlichte Version ist ein reguläres Release ohne Beta-/Prüfversionskennzeichnung.

## Dashboardauswahl im HA-Profil

Bei aktivierten Family-Access-Benutzern wird auch **Profil → Erscheinungsbild → Dashboard** nach den Freigaben ihrer Rolle gefiltert. Diese Liste wird separat von der Seitenleiste geladen. Nicht freigegebene oder ausschließlich Administratoren vorbehaltene Dashboards erscheinen dort nicht. Nicht aktivierte Konten und Administratoren behalten die native HA-Auswahl. Die HA-Option **Auto (Systemeinstellungen verwenden)** bleibt bestehen.

Die Filterung wirkt auf neue Anfragen. Eine bereits geöffnete Profilansicht nach Änderungen neu öffnen; nach dem Update HA neu starten und den Browser vollständig neu laden. Für Paul muss Family Access aktiviert und die gewünschte Rolle zugewiesen sein.

Die persönliche Startseite wird im nativen HA-Profil gespeichert. Andere Profileinstellungen bleiben erhalten.

## Reihenfolge und Admin-Seitenleiste

Unter **Rollen → Dashboards** nur die freigegebenen Dashboards mit den Pfeilen sortieren. Die übrigen Dashboards stehen im aufklappbaren Block **Nicht gewählt** darunter und haben keine Sortierpfeile. **Reihenfolge übernehmen** öffnet die Benutzerauswahl; die Konten der Rolle sind vorausgewählt. Es lassen sich auch andere persönliche Benutzer einschließlich Administratoren auswählen. Bei ungespeicherten Änderungen zeigt die Aktion **Speichern und übernehmen** ausdrücklich an, dass zunächst alle vorbereiteten Rollen-/Rechteänderungen gespeichert werden.

Die Übernahme ändert nur die native HA-Seitenleistenreihenfolge der gewählten Dashboards bei den gewählten Konten. Freigaben, Aktivierungen, ausgeblendete Einträge, andere persönliche Einstellungen und Startseiten bleiben erhalten. Nicht freigegebene Dashboards bleiben unsichtbar. Andere Panels behalten ihre relative Reihenfolge. Neu freigegebene Dashboards werden an die gewählte Reihenfolge angehängt; nicht gewählte und entfernte Pfade werden bei der Übernahme ignoriert. Ihre persönliche Reihenfolge bleibt unberührt. Die Benutzer können ihre persönliche Reihenfolge anschließend weiterhin in HA ändern. Bei einzelnen Speicherfehlern nennt die Oberfläche die betroffenen Konten; Details stehen im Fehlerprotokoll.

Unter **Benutzer** öffnet das Stiftsymbol beim jeweiligen Administrator dessen **sichtbare Dashboards**. Diese Auswahl gilt pro Admin und erteilt oder entzieht keine Rechte. Im selben Dialog lässt sich die **Startseite** wählen. Da HA die Startseite immer zeigt, muss sie sichtbar bleiben; alternativ ein anderes Dashboard oder **Eigenes Profil** wählen. Die Aktion **Seitenleiste speichern** speichert diese persönliche Auswahl sofort, unabhängig von vorbereiteten Rollenänderungen. Globale HA-Einstellungen für die Dashboard-Sichtbarkeit bleiben maßgeblich.

HA übernimmt diese Einstellungen über seinen eigenen Benutzerspeicher und dessen Live-Abonnements in offene Browser. Ohne solche Abonnements hilft vollständiges Neuladen. Bestehende ausschließlich im Browser gespeicherte ältere Einstellungen werden durch die hier explizit gewählte Auswahl ersetzt.

**Prüfen** war eine technische Diagnose für eigene Dashboardanfragen sowie HTTP und WebSocket. Sie liegt jetzt unter **Einstellungen → Diagnose**. Bei Rollen wählt nur noch ein Feld die Rolle; das Stiftsymbol öffnet **Rolle umbenennen**.

## Fehlerprotokoll

Administratoren öffnen **Family Access → Fehler**. Pro Eintrag werden Zeitpunkt, Benutzer, Aktion, Ziel, Grund und Anfrageweg angezeigt. **Aktualisieren** lädt neue Einträge, ohne ungespeicherte Rollenänderungen zu verwerfen.

Die letzten **200 Fehler** werden begrenzt gespeichert und bleiben über HA-Neustarts erhalten. Erfasst werden abgelehnte authentifizierte eigene HTTP-/WebSocket-Anfragen, Ablehnungen der zusätzlichen Dashboard-Sperre, native HA-Administratorablehnungen dieser Dashboardaktionen sowie technische Fehler eigener Anfragen. Die Datei liegt getrennt von der Rechtekonfiguration im HA-Storage. Tokens, Authentifizierungsheader, vollständige Anfrageinhalte und Serviceparameter werden nicht protokolliert. Normale Benutzer können das Protokoll auch nicht über einen direkten API-Aufruf lesen.

Fehler vor der Anmeldung oder beim Laden einer anderen Integration gehören in das allgemeine HA-Protokoll. Ein Fehler beim Speichern der Diagnose verändert keine Berechtigungsentscheidung.

## Funktionsumfang

- Bestehende persönliche HA-Konten verwenden; Verwaltung ausschließlich durch Administratoren und Eigentümer.
- Rollen und Dashboardfreigaben verwalten, Benutzer einzeln aktivieren.
- Native Panelliste je aktiviertem Benutzer filtern, ohne globale Panels oder Startseitenpräferenzen zu verändern.
- Offene Browser nach erfolgreichen Rechteänderungen über das native Ereignis `panels_updated` aktualisieren.
- Eigene Dashboard-Anfragen im Backend prüfen; identische Prüfinstanz für HTTP und WebSocket.
- Optional `lovelace/config`, `lovelace/config/save` und `lovelace/config/delete` prüfen. Native HA-Administratorprüfungen bleiben erhalten.
- Revisionsprüfung gegen gleichzeitiges Überschreiben, gespeicherte Rollen und Aktivierungen ohne Datenverlust übernehmen.
- Kompakte gemeinsame Benutzerzeilen für Name, Rolle und Aktivierung; mobil zusammengehörig untereinander. Gemeinsame Komponenten für Kopf, Navigation, Listen, Auswahlfelder, Schalter, Buttons, Dialoge, Meldungen und Protokoll. Keine lokalen CSS-Überschreibungen oder CDN-Abhängigkeiten.

## Installation

### Marketplace / HACS

Das Repository `https://github.com/v9h45n47mh-lab/family-access-manager` als benutzerdefiniertes Repository der Kategorie **Integration** hinzufügen. Die reguläre Version **1.1.0** installieren und HA neu starten. Dafür müssen keine Vorabversionen eingeblendet werden. Anschließend unter **Einstellungen → Geräte & Dienste → Integration hinzufügen** den **Family Access Manager** einrichten.

Die Quelle ist als benutzerdefiniertes Repository nutzbar; sie wird nicht automatisch Teil des offiziellen Katalogs.

### Manuell

Das [GitHub-Release](https://github.com/v9h45n47mh-lab/family-access-manager/releases) enthält `family_access_manager.zip`. Den Ordner `custom_components/family_access_manager` nach `/config/custom_components/family_access_manager` kopieren und HA neu starten. Das vollständige Quellpaket heißt `Family_Access_Manager_1.1.0.zip`.

### Falls HACS noch einen Commit-Hash anzeigt

In HACS beim **Family Access Manager** die Repositoryinformationen neu laden und die reguläre Version **1.1.0** installieren. Bis zu dieser Installation kann die bisher installierte Version weiterhin als Commit-Hash erscheinen. Danach HA neu starten und den Browser vollständig neu laden. Falls bisher ausdrücklich der Entwicklungszweig `main` gewählt war, beim erneuten Herunterladen **1.1.0** wählen.

Der GitHub-Endpunkt `releases/latest` liefert jetzt die reguläre Version. Künftige reguläre Releases werden automatisch ohne Vorabversionsmarkierung und als neueste Version veröffentlicht; Beta-/RC-Versionen bleiben im Vorabkanal.

## Schutzumfang und Grenzen

Diese Integration verwaltet **Dashboardzugriff und Navigation**. Die optionale native Sperre schützt neue Lovelace-Konfigurationsanfragen; bereits geladene Inhalte lassen sich nicht zurückholen. Allgemeine HA-Geräte-/System-APIs, Suche, Historie, Kameras, Assist, Automationen und Drittintegrationen bleiben durch die nativen HA-Rechte bestimmt. Das Ausblenden einer Seitenleiste ist allein keine allgemeine Sicherheitsgrenze.

Eine bisherige, nicht freigegebene Startseite kann als nicht verfügbar erscheinen; dann ein freigegebenes Dashboard öffnen. Die Rollenfilterung verändert keine Startseitenpräferenzen, HA-Gruppen, Tokens oder Netzwerkeinstellungen. Nur die ausdrückliche Admin-Seitenleistenaktion speichert die dort gewählte Startseite. Beim Entfernen oder fehlgeschlagenen Laden entfällt auch ihre Filterung und zusätzliche Sperre.

Die Oberfläche bietet keine Geräteverwaltung und keinen eigenen Dashboardeditor. Altfelder und bisherige interne Prüfendpunkte bleiben für die Abwärtskompatibilität erhalten. Ein Live-Test mit deiner produktiven HA-Instanz und deinem Nabu-Casa-Konto ist noch erforderlich. [Prüfablauf](docs/LOKAL_CLOUD_TEST.md) und [Prüfergebnisse](docs/TESTERGEBNISSE.md) beschreiben den nachgewiesenen Umfang.

## Versionen und Entwicklung

[Semantische Versionierung](docs/VERSIONING.md): reguläre Releases als `1.0.0`, `1.1.0`, `1.1.0` usw. Nur gezielte Vorabtests erhalten einen Zusatz wie `1.1.0-beta.1`. Die bisherigen Tags bleiben erhalten.

Die Benutzeransicht enthält nur einen kurzen Hinweis; ausführliche Hinweise und Zugriffsschutz liegen unter dem Zahnrad **Einstellungen**.

Die pytest-Suite verwendet HA 2026.10.4; ein unabhängiger Installations-/API-Test verwendet Core 2026.11.1. Die Browserprüfung vergleicht die tatsächlich gerenderten Komponenten direkt mit dem gepinnten UI Kit bei 1100/430/390/375/320 px und hellen/dunklen Themes.

```bash
# Separate Python-3.14-Umgebung
pip install -r requirements-test.txt
python -m pytest

# Separate Umgebung für aktuellen Core
pip install homeassistant==2026.11.1 home-assistant-frontend==20261028.5
PYTHONPATH=. python tests/smoke_current_core.py

npm ci --ignore-scripts
npm run check:kit
npm run test:panel
npx playwright install --with-deps chromium
npm run test:browser
python scripts/build_release.py
```

Tests ausschließlich mit temporären Konfigurationen ausführen. Ein produktives HA-Konfigurationsverzeichnis ist kein Testverzeichnis.


## Zentrale Rollenrechte

Acht eigene Anwendungstabs: Light Manager, Shutter Manager, Essensplaner, Hausarbeiten, Gartenarbeit, Spülmaschine, Music Manager und Wecker. Mehrfachrollen sind in der Benutzerverwaltung auswählbar. Fehlgeschlagene Anwendungsprüfungen erscheinen im bestehenden Fehlerprotokoll. Rollen werden weiterhin erst nach Bestätigung gelöscht.

Berechtigungen werden jetzt in **Family Access → Anwendung → Rolle** verwaltet. Benutzer können mehrere Rollen erhalten; ihre Freigaben ergänzen sich. Vorhandene Anwendungsrechte werden einmalig in Rollen mit dem Zusatz „übernommen“ importiert und den bisherigen Benutzern zugeordnet. Dashboardfreigaben und die Aktivierung der Dashboardnavigation werden dadurch nicht verändert.

Zum Entziehen eines Rechts alle zugewiesenen Rollen einschließlich übernommener Rollen prüfen. Neue Benutzer erhalten nach der Übernahme keine automatischen Anwendungsrechte. Echte HA-Administratoren behalten Vollzugriff zur Wiederherstellung. Geräte-, Eigentümer- und externe Kontoberechtigungen gelten zusätzlich; eine Rolle erzeugt keine HA-Administratorrechte.

**Aktualisierung:** zuerst Family Access Manager 1.1.0 oder neuer, danach die beteiligten Anwendungen aktualisieren und Home Assistant neu starten. Solange Family Access nicht eingerichtet ist, bleibt die bisherige Rechtevergabe erhalten. Ist Family Access eingerichtet, aber nicht verfügbar oder zu alt, werden Anwendungsaktionen für normale Benutzer abgelehnt. Lokale Benutzer-/Personen-, Geräte- und Musikkontozuordnungen bleiben für Identität und Eigentum erhalten; Rechte werden zentral vergeben.
