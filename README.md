# Family Access Manager 1.0.0-beta.2

Benutzerrollen und Dashboardfreigaben für Home Assistant. Die Oberfläche verwendet vollständig das lokal eingebundene **HA UI Kit 1.6.0**.

Family Access ist eine reine Verwaltungsoberfläche für Administratoren und Eigentümer. Normale Benutzer sehen keinen Family-Access-Eintrag; auch der direkte Panel-Start ist serverseitig geschützt.

## Dashboardzugriff einrichten

1. Unter **Rollen** eine Rolle anlegen und die gewünschten Dashboards auf **Freigegeben** setzen.
2. Unter **Benutzer** das Konto aktivieren, die Rolle wählen und **Änderungen speichern**.
3. Die Seitenleiste zeigt diesem Konto nur freigegebene Dashboards sowie die eigenen Konto-/internen Routen. Allgemeine Panels wie Verlauf, Kalender und Medien werden ausgeblendet; das feste Konto- und Benachrichtigungsmenü bleibt bestehen.
4. Für direkte Dashboard-Konfigurationsanfragen unter **Einstellungen → Dashboard-Konfigurationen sperren** die Sperre einschalten und speichern.
5. Mit einem separaten Testkonto prüfen. Nach einem Update Home Assistant neu starten und den Browser vollständig neu laden.

Eine Rolle lässt sich vorbereiten, ohne das Konto zu aktivieren. Beim Ausschalten bleibt die Rolle gespeichert und die normale HA-Navigation wird wiederhergestellt. Administratoren und Eigentümer behalten Vollzugriff.

Gerätefreigaben sind für diesen Ablauf nicht erforderlich und werden nicht mehr angeboten. Die Bedienung in freigegebenen Dashboards folgt den nativen HA-Rechten. Vorhandene Anzeigen-/Bedienen-/Bearbeiten-Zuordnungen erscheinen als freigegeben und bleiben bis zu einer Änderung gespeichert; es wird damit kein eigener schreibgeschützter HA-Modus oder Administratorzugriff vergeben.

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

Das Repository `https://github.com/v9h45n47mh-lab/family-access-manager` als benutzerdefiniertes Repository der Kategorie **Integration** hinzufügen. Vorabversionen gegebenenfalls einblenden, die gewünschte Version installieren und HA neu starten. Anschließend unter **Einstellungen → Geräte & Dienste → Integration hinzufügen** den **Family Access Manager** einrichten.

Die Quelle ist als benutzerdefiniertes Repository nutzbar; sie wird nicht automatisch Teil des offiziellen Katalogs.

### Manuell

Das [GitHub-Release](https://github.com/v9h45n47mh-lab/family-access-manager/releases) enthält `family_access_manager.zip`. Den Ordner `custom_components/family_access_manager` nach `/config/custom_components/family_access_manager` kopieren und HA neu starten. Das vollständige Quellpaket heißt `Family_Access_Manager_1.0.0-beta.2.zip`.

## Schutzumfang und Grenzen

Diese Vorabversion verwaltet **Dashboardzugriff und Navigation**. Die optionale native Sperre schützt neue Lovelace-Konfigurationsanfragen; bereits geladene Inhalte lassen sich nicht zurückholen. Allgemeine HA-Geräte-/System-APIs, Suche, Historie, Kameras, Assist, Automationen und Drittintegrationen bleiben durch die nativen HA-Rechte bestimmt. Das Ausblenden einer Seitenleiste ist allein keine allgemeine Sicherheitsgrenze.

Eine bisherige, nicht freigegebene Startseite kann als nicht verfügbar erscheinen; dann ein freigegebenes Dashboard öffnen. Die Integration verändert keine Startseitenpräferenzen, HA-Gruppen, Tokens oder Netzwerkeinstellungen. Beim Entfernen oder fehlgeschlagenen Laden entfällt auch ihre Filterung und zusätzliche Sperre.

Die Oberfläche bietet keine Geräteverwaltung und keinen eigenen Dashboardeditor. Altfelder und bisherige interne Prüfendpunkte bleiben für die Abwärtskompatibilität erhalten. Ein Live-Test mit deiner produktiven HA-Instanz und deinem Nabu-Casa-Konto ist noch erforderlich. [Prüfablauf](docs/LOKAL_CLOUD_TEST.md) und [Prüfergebnisse](docs/TESTERGEBNISSE.md) beschreiben den nachgewiesenen Umfang.

## Versionen und Entwicklung

[Semantische Versionierung](docs/VERSIONING.md): `MAJOR.MINOR.PATCH`, Vorabstände als `1.0.0-beta.1`, `1.0.0-beta.2` usw. Die bisherigen Tags bleiben erhalten.

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
