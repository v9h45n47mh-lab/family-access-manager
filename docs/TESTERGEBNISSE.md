# Prüfungen – Family Access Manager 1.0.0-beta.2

Stand: 15. November 2026. Implementierungsstand `caf6bda1db00f856c5117c1b3d317cfb8e5f8588`.

[Erfolgreicher App-CI-Lauf](https://github.com/v9h45n47mh-lab/family-access-manager/actions/runs/43711701945). Der Release-Commit führt dieselben Prüfungen erneut aus.

| Prüfung | Umgebung | Ergebnis |
|---|---|---|
| Rollen, Aktivierungen, Dashboardfreigaben, Seitenleiste, Fehlerprotokoll und neue Adminsperre | HA 2026.10.4, Python 3.14.10 | 82 pytest-Tests bestanden |
| Native Family-Access-Panelregistrierung | Echte HA-Einrichtung und nativer get_panels-Handler | Panel verlangt Administratorrechte; für normale Benutzer verborgen, auch ohne aktivierte Family-Access-Rolle |
| Direkter Panel-Start | Echte authentifizierte HTTP-/WebSocket-Anfragen | admin_panel_status für normale Benutzer abgelehnt und protokolliert; Administrator zugelassen |
| Manipulierte Dashboardfreigabe | Family-Panelpfad absichtlich als Dashboard freigegeben | Eingeschränkter Benutzer erhält dadurch keinen Family-Access-Eintrag |
| Aktueller Core einschließlich nativer Panelliste und Admin-Panel-Start | Isolierter HA Core 2026.11.1, Frontend 20261028.5 | 21 Prüfungen bestanden; Ausgabe in current_core_result.json |
| Gemeinsame Benutzerzeile | HA UI Kit 1.6.0, lokale Originaldateien | Name, Rolle und Aktivierung als zusammengehörige Zeile; keine lokalen CSS-Überschreibungen |
| Kit-Prüfungen | Unabhängiger Kit-CI-Lauf | 29 Unit-Tests und sieben Browsersuiten erfolgreich; darunter zehn neue Benutzerzeilenvarianten |
| App-Bedienlogik | Node.js und LinkeDOM | Acht Funktionsprüfungen einschließlich Rollen, Aktivierung, Protokoll und ausgeblendeter Verwaltung bestanden |
| Browserdarstellung | Chromium; 1100/430/390/375/320 px; hell/dunkel; fünf Ansichten | 50 Varianten bestanden; direkte berechnete Stilvergleiche einschließlich neuer Zeilengeometrie; kein horizontaler Überlauf |
| Rollen, Einstellungen und Speichern | Browser mit HA-Client-Fixture | Aktivierung/Rollenzuordnung bleiben erhalten, Sperrschalter unter Einstellungen bedienbar, Suche und Dialogbedienung erfolgreich |
| Normaler Benutzer mit zwischengespeichertem Panel-Client | Browser mit abgelehntem Admin-Start | Keine Navigation, Benutzerzeilen, Speicherfunktion oder Protokolldaten sichtbar; alter Snapshot entfernt |
| Visuelle Sichtprüfung | Benutzer Desktop hell und Mobil dunkel | Kompakte ausgerichtete Zeilen, keine überlagerten Felder; Warnbanner und lange Einleitung entfernt |

[Kit-CI](https://github.com/v9h45n47mh-lab/ha-ui-kit/actions/runs/43711519587) und [veröffentlichtes Kit 1.6.0](https://github.com/v9h45n47mh-lab/ha-ui-kit/releases/tag/v1.6.0). Die App bindet die lokalen Originaldateien dieses Kits ein. Bestehende Kit-Komponenten wurden nicht verändert.

Die App-Browserprüfung verwendet feste HA-Client-Testdaten. Die getrennten Core-Prüfungen verwenden echte HTTP-/WebSocket-Endpunkte und den nativen Panellistenhandler. Die 20 App-Screenshots stehen im CI-Artefakt ui-screenshots.

## Umfang und verbleibende Prüfung

Nur Administratoren und Eigentümer verwenden die Family-Access-Oberfläche. Normale Benutzer verwenden ihre freigegebenen Dashboards und behalten die festen Konto-/Benachrichtigungselemente von HA. Der zusätzliche Dashboard-Sperrschalter wirkt weiterhin auf neue Konfigurationsanfragen; bereits geladene Inhalte lassen sich nicht zurückholen.

Kein Live-Test mit deiner produktiven HA-/Nabu-Casa-Instanz, physischen iPhones oder individuellen Themes. Die isolierte Core-Instanz verwendet eine simulierte Loopback-Netzwerkschnittstelle; Netzwerkgeräte und automatische Erkennung gehören nicht zum Ergebnis. Native HA-Geräte-/Systemrechte bleiben unverändert.
