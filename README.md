# Family Access Manager 0.2.0

Erste installierbare Prüfversion einer Benutzerberechtigungsverwaltung für Home Assistant.

**Diese Version ist noch keine umfassende Zugriffssperre für Home Assistant.** Sie prüft die eigenen HTTP- und WebSocket-Funktionen im Backend. Optional sperrt sie direkte Abfragen ausgewählter Lovelace-Dashboard-Konfigurationen für zugeordnete Benutzer. Allgemeine HA-Geräte-APIs, Suche, Verlauf, Kameras, Assist und Drittintegrationen sind noch nicht allgemein abgesichert.

## Oberfläche ab 0.2.0

Die Oberfläche verwendet die lokal mitgelieferten Originalkomponenten von **HA UI Kit 1.2.1** aus `v9h45n47mh-lab/ha-ui-kit`, einschließlich Panel-Kopf, Navigation, Zeilen, Auswahlfeldern, Schaltern, Buttons und Dialogen. Gemeinsame Darstellung und Symbole stammen vollständig aus dem Kit; es gibt keine lokale CSS-Überschreibung. Die Kit-Version ist per Prüfsummen fest gebunden.

Die Umstellung verändert keine Berechtigungsregeln und ergänzt keine Kalenderfunktion. Ein Marketplace-Logo wird im lokalen `brand/`-Verzeichnis mitgeliefert.

## Enthalten

- Vorhandene HA-Benutzer verwenden; Einstellungen ausschließlich für echte HA-Administratoren und den Eigentümer.
- Rollen anlegen, benennen und zuordnen.
- Dashboardfreigaben sowie Gerätefreigaben über Entitäten, Bereiche und Labels getrennt verwalten.
- Eigene Lese- und Bedienfunktionen mit serverseitiger Rechteprüfung; identische Prüfinstanz für HTTP und WebSocket.
- Virtueller Testschalter zum Prüfen echter Schaltaktionen ohne Geräte im Haus zu bedienen.
- Optionale native Prüfung von `lovelace/config`, `lovelace/config/save` und `lovelace/config/delete` im gemeinsamen WebSocket-Handler.
- Begrenztes Prüfprotokoll im Arbeitsspeicher, maximal 200 Einträge. Keine Tokens oder vollständigen Aktionsparameter werden protokolliert.
- Gespeicherte Rechte bleiben beim Neuladen der Integration erhalten. Gleichzeitige Änderungen werden über eine Revisionsnummer erkannt.

## Installation

### Über Marketplace / HACS

1. `https://github.com/v9h45n47mh-lab/family-access-manager` als **benutzerdefiniertes Repository** mit der Kategorie **Integration** hinzufügen.
2. Da 0.2.0 ausdrücklich als Vorabversion veröffentlicht wird, gegebenenfalls Vorab-/Betaversionen in der Versionsauswahl anzeigen lassen.
3. **Family Access Manager (Prüfversion)** herunterladen und HA neu starten.
4. Unter **Einstellungen → Geräte & Dienste → Integration hinzufügen** den **Family Access Manager** einrichten.

Das Repository ist als benutzerdefinierte Quelle nutzbar; es ist nicht automatisch in den offiziellen Katalog aufgenommen.

### Manuell über GitHub

Im [GitHub-Release](https://github.com/v9h45n47mh-lab/family-access-manager/releases) steht `family_access_manager.zip` als Installationspaket bereit. Das vollständige Quellpaket heißt `Family_Access_Manager_0.2.0_Prototyp.zip`.

1. ZIP entpacken. Den Ordner `custom_components/family_access_manager` nach `/config/custom_components/family_access_manager` kopieren.
2. Home Assistant neu starten.
3. **Einstellungen → Geräte & Dienste → Integration hinzufügen → Family Access Manager** auswählen.
4. Den neuen Seitenleisteneintrag **Family Access** öffnen.

Es werden keine Ports, Netzwerkeinstellungen, HA-Gruppen oder vorhandenen Tokens verändert. Nach der Einrichtung sind keine Benutzer zugeordnet und beide optionalen Schalter ausgeschaltet.

## Erster Test

1. Unter **Rollen** eine Rolle beispielsweise „Paul“ anlegen.
2. Ein vorhandenes Dashboard zum **Anzeigen** freigeben.
3. Unter **Gerätefreigaben → Entitäten** nach **Family Access Testschalter** suchen und zunächst **Anzeigen** wählen. Die tatsächliche Entitäts-ID wird auch unter **Prüfen** angezeigt.
4. Unter **Benutzer** dem normalen HA-Konto von Paul diese Rolle zuordnen und speichern. Ein Konto mit Administratorrechten kann nicht eingeschränkt werden.
5. Mit diesem Konto in einem separaten Browserfenster anmelden. Unter **Family Access → Prüfen** muss das Anzeigen des Testschalters funktionieren und das Umschalten abgelehnt werden.
6. Als Administrator die Gerätefreigabe des Testschalters auf **Bedienen** ändern. Danach muss das Umschalten über **Family Access** funktionieren. Der virtuelle Schalter betätigt keine echte Hardware.
7. Optional unter **Benutzer → Prüfversion aktivieren** die Prüfung der Dashboard-Konfigurationen einschalten. Ein nicht freigegebenes Dashboard muss bei einer neuen Konfigurationsabfrage abgelehnt werden.
8. Dieselben Tests über die Nabu-Casa-Adresse wiederholen. Für den Prüfablauf siehe [docs/LOKAL_CLOUD_TEST.md](docs/LOKAL_CLOUD_TEST.md).

**Die Freigaben der Prüfversion ändern noch nicht die allgemeinen HA-Entitätsrechte.** Deshalb kann ein Aufruf über die native HA-Geräte-API weiterhin erfolgreich sein, obwohl ihn die Family-Access-API verweigert. Genau diese zusätzliche Absicherung gehört in die nächste Entwicklungsstufe.

## Bedeutung der Rechte

| Auswahl | Wirkung in 0.2.0 |
|---|---|
| Dashboard: Anzeigen | Konfiguration über die eigene API abrufen; bei eingeschalteter Dashboard-Sperre auch native Konfigurationsabfragen zulassen. |
| Dashboard: Bedienen | Schließt Anzeigen ein; tatsächliche Bedienung braucht zusätzlich eine Gerätefreigabe. |
| Dashboard: Bearbeiten | Wird im Rechtemodell vorgemerkt. Ein normaler HA-Benutzer erhält in dieser Version noch keinen nativen Dashboardeditor. |
| Gerät: Anzeigen | Zustand und Attribute über die eigene API lesen. |
| Gerät: Bedienen | Zusätzlich die unterstützten Aktionen über die eigene API ausführen. |
| Administrator/Eigentümer | Echte HA-Administratoren und der Eigentümer behalten Vollzugriff. Rollen können keine Administratorrechte verleihen. |

Gerätebedienung ist zunächst nur für den virtuellen Testschalter eingeschaltet. Die Option **Freigegebene Geräte über die Family-Access-API bedienen** erlaubt darüber hinaus ausdrücklich freigegebene Lampen, Schalter, Input-Booleans und Abdeckungen. Es gibt dafür in 0.2.0 noch keine allgemeine Gerätebedienoberfläche; die Funktionen sind für die spätere Einbindung vorbereitet.

Freigaben aus mehreren Quellen werden addiert; die höhere Freigabe gilt. **Kein Zugriff** entfernt einen Eintrag, ist aber kein ausdrückliches Verbot gegenüber einer zusätzlichen Bereichs- oder Labelfreigabe. Labels werden bei jeder Anfrage anhand der aktuellen Entitäts- und Gerätezuordnung ausgewertet. Bereiche werden direkt von der Entität oder ersatzweise vom Gerät übernommen. Neue entsprechend zugeordnete Entitäten erhalten damit automatisch die Freigabe. Labels auf anderen Objekttypen werden nicht geerbt.

**Nicht verwaltet** entfernt die Benutzerzuordnung und lässt den nativen Dashboardzugriff unverändert. **Kein Zugriff** im Benutzerfeld speichert dagegen ausdrücklich eine leere Rollenzuordnung: Bei eingeschalteter Dashboard-Sperre darf dieses Konto keine Dashboard-Konfiguration abrufen. Ohne Zuweisung verweigert die eigene Family-Access-API normalen Benutzern Geräte- und Dashboardoperationen.

Die Berechtigung für eine Entität gilt innerhalb dieser API auf allen Dashboards gleich. Der aktuelle Dashboardpfad oder ein `Referer` kann keine Geräteberechtigung erweitern.

## Grenzen

- Die Seitenleiste wird noch nicht benutzerspezifisch gefiltert.
- Die optionale native Sperre schützt Dashboard-Konfigurationsanfragen. Sie entfernt keine zuvor im Browser gespeicherten Inhalte und sperrt nicht automatisch Daten über andere HA-APIs.
- Es wird kein Benutzer gegenüber HA als Administrator ausgegeben. Native Administratorprüfungen bleiben bestehen.
- Ein freigegebenes Dashboard erteilt niemals automatisch Zugriff auf die darauf genannten Geräte.
- Automationen, Skripte, Szenen, Webhooks, Assist, Historie, Statistiken, Kamerastreams, Suche und Custom-Integration-Endpunkte sind noch nicht allgemein abgesichert.
- Die Integration verwendet für die experimentelle Dashboard-Sperre die interne WebSocket-Command-Registry. HA-Updates können Anpassungen erfordern.
- Deaktivieren oder Entfernen der Integration entfernt auch die optionale Dashboard-Sperre. Eine fehlgeschlagene Einrichtung ist kein garantierter Zugriffsschutz.
- Es wurde kein Test mit deinem Nabu-Casa-Konto und deiner produktiven HA-Instanz durchgeführt. Lokale Tests und die Prüfung des gemeinsamen Cloud-Einstiegspunkts ersetzen diesen Test nicht.

## Nächste Entwicklungsstufen

1. Verhalten der ersten Prüfversion lokal und über die echte Nabu-Casa-Verbindung bestätigen.
2. Native Entitätsrechte und weitere HA-Endpunkte gezielt absichern, einschließlich Zustandsabonnements und alternativer Schaltwege. Dazu auch das Zusammenspiel mit Light Manager, Shutter Manager und den Weckern prüfen.
3. Benutzerabhängige Sidebar und Dashboarddarstellung ergänzen.
4. Einen begrenzten Dashboardeditor und gezielte Bearbeitungsfunktionen für eigene Wecker und Programme ergänzen.

## Entwicklung und Prüfungen

- Die automatisierten pytest-Tests verwenden `pytest-homeassistant-custom-component==0.13.375` und dessen HA-Version **2026.10.4**.
- Für den aktuellen HA-Core existiert ein davon unabhängiger Installations- und API-Test: `tests/smoke_current_core.py`. Dieser startet eine isolierte HA-Instanz und sendet echte lokale HTTP-/WebSocket-Anfragen. Die Netzwerkschnittstellenliste wird dabei auf eine simulierte Loopback-Schnittstelle begrenzt.
- `tests/panel_dom.cjs` prüft die Bedienlogik und sicheres Escaping mit einer lokalen DOM-Implementierung. Das ist kein Browser-Renderingtest.
- `tests/ui-browser.cjs` prüft 40 Desktop-/Mobil-/Themevarianten in Chromium, vergleicht berechnete Stile mit den Originalkomponenten und prüft die Bedienabläufe. Screenshots stehen als CI-Artefakt bereit.
- Die tatsächlich abgeschlossenen Prüfungen und die verbleibenden Grenzen stehen in `docs/TESTERGEBNISSE.md`.

```bash
# In einer separaten Python-3.14-Umgebung:
pip install pytest-homeassistant-custom-component==0.13.375 home-assistant-frontend==20260930.5
python -m pytest

# Aktueller Core: eigene separate Umgebung, Frontend passend zum HA-Manifest:
pip install homeassistant==2026.11.1 home-assistant-frontend==20261028.5
PYTHONPATH=. python tests/smoke_current_core.py

# UI-Kit, DOM-Bedienlogik und Browserdarstellung:
npm ci --ignore-scripts
npm run check:kit
npm run test:panel
npx playwright install --with-deps chromium
npm run test:browser
```

Die Tests arbeiten ausschließlich mit Testkonten und temporären Konfigurationen. Nicht gegen ein produktives HA-Konfigurationsverzeichnis ausführen.

