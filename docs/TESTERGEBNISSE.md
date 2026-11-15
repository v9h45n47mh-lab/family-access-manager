# Prüfungen – Family Access Manager 1.0.0-beta.1

Stand: 15. November 2026. Getesteter Implementierungsstand: `19d2d9e4d8abb72806ebd7d9cb1be0c0ef71a37f`.

[Erfolgreicher CI-Lauf](https://github.com/v9h45n47mh-lab/family-access-manager/actions/runs/43708769305). Der Release-Commit führt dieselben Prüfungen einschließlich der ergänzten lokalen Altversionsprüfung erneut aus.

| Prüfung | Umgebung | Ergebnis |
|---|---|---|
| Bestehende Autorisierung, Rollen, Aktivierung, Seitenleistenfilterung sowie neues Protokoll | HA 2026.10.4, Python 3.14.10 | 79 pytest-Tests bestanden |
| Fehlerprotokoll und Zugriffsschutz | Echte authentifizierte HTTP-/WebSocket-Testverbindungen | Ablehnungen mit Benutzer, Ziel, Grund und Transport; Protokollabruf durch normale Benutzer abgelehnt |
| Native Dashboardablehnungen | Originale HA-Lovelace-Handler | Fehlende Freigaben und native Administratorablehnungen erfasst; Administratorrechte werden nicht erweitert |
| Technische Fehler | Kontrollierte Ausnahmen in eigener und nativer Prüfung | Fehler sicher protokolliert, Zugriff bleibt abgelehnt; Exception-Inhalte nicht ins Protokoll übernommen |
| Speicherung und Begrenzung | HA-Store, Neuladen und 205 Testfehler | Letzte 200 Einträge erhalten; Kopien verändern keinen gespeicherten Eintrag |
| Diagnosespeicherfehler | Simulierter Speicherfehler und beschädigtes Diagnoseformat | Berechtigungsergebnis und gültige Policy unverändert |
| Datenbegrenzung | Präparierte Payloads mit Geheimnis und fremder Benutzer-ID | Weder Tokens noch vollständige Anfrageinhalte gespeichert; Identität stammt aus HA |
| Aktueller Core mit Installation, API, nativer Seitenleiste, Diagnose und Neuladen | Isolierter HA Core 2026.11.1, Frontend 20261028.5 | 20 Prüfungen bestanden; Ausgabe in `current_core_result.json` |
| Vollständige Kit-Übernahme | HA UI Kit 1.5.2, Commit `c548bf4242c66294226b8175b0a2f8b5ac3c7475` | JS/CSS/Lizenz unverändert, feste lokale Imports und ausschließlich gemeinsames UI_CSS |
| Bedienlogik | Node.js, LinkeDOM | Acht Funktionsprüfungen einschließlich Fehlerprotokoll und Dashboardfokus bestanden |
| Alte Dashboardstufen | Zusätzliche lokale DOM-Prüfung | Alte Bedienfreigabe wird als Freigegeben angezeigt; Rendern verändert gespeicherte Altzuordnung nicht |
| Browserdarstellung | Chromium; 1100/430/390/375/320 px; hell/dunkel; Benutzer/Rollen/Prüfen/Fehler/Umfang | 50 Varianten bestanden, direkte berechnete Stilvergleiche mit Kit-Originalen und kein horizontaler Überlauf |
| Browserabläufe | Echter Browser mit HA-Client-Fixture | Aktivierung, Dashboardfreigabe, Suche, Speichern, Dialog/Escape/Fokus, HTTP/WS-Prüfung, Protokoll-Aktualisierung und versteckte Adminfunktionen erfolgreich |
| Protokoll-Aktualisierung und Escaping | Ungespeicherte Rollenänderung sowie schädlicher Beispieltext | Rollenentwurf bleibt erhalten; Namen und Diagnosen werden als Text angezeigt |
| Visuelle Sichtprüfung | Rollen Mobil hell / Desktop dunkel, Protokoll Mobil dunkel / Desktop hell | Umbrüche und Bedienelemente ohne Abschneiden oder Überlagerung, Kit-Gestaltung übernommen |

Die 50 Browservarianten prüfen die Family-Access-Oberfläche mit festen HA-Client-Testdaten. Die Core-Tests verwenden echte HA-HTTP-/WebSocket-Endpunkte und den originalen Panellistenhandler. 20 Screenshots stehen im CI-Artefakt `ui-screenshots`.

## Nachgewiesener Umfang

Dashboardfreigaben, Benutzeraktivierung, gefilterte Navigation und die zusätzliche native Dashboard-Konfigurationsprüfung bleiben erhalten. Die Oberfläche enthält keine Gerätefreigaben oder Testschalter mehr. Native HA-Geräte-/Systemrechte werden nicht geändert; alte interne Prüfendpunkte und Konfigurationsfelder bleiben kompatibel.

Das Protokoll erfasst tatsächliche Backendprüfungen. Eine bereits vor dem Backend abgefangene Frontendroute erzeugt keinen Protokolleintrag. Diagnosefehler beeinflussen keine Freigaben.

## Offene Prüfung vor Ort

Kein Live-Test mit deiner produktiven HA-Instanz, deinem Nabu-Casa-Konto, physischen iPhones oder individuellen Themes. Die isolierte Core-Umgebung verwendet eine simulierte Loopback-Netzwerkschnittstelle; Netzwerkgeräte und automatische Erkennung gehören nicht zum Testergebnis. Der dokumentierte Dashboardumfang ist keine zusätzliche allgemeine Sicherheitsgrenze um alle HA-APIs.
