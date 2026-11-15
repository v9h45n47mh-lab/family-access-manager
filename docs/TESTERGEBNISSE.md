# Abgeschlossene Prüfungen – Version 0.4.0

Stand: 15. November 2026. Implementierungsstand: `f00fe137aa1088b6d597c53de645184714c39a03`.

[Erfolgreicher CI-Lauf](https://github.com/v9h45n47mh-lab/family-access-manager/actions/runs/43705678899). Der Release-Commit durchläuft dieselben Prüfungen erneut.

| Prüfung | Umgebung | Ergebnis |
|---|---|---|
| Bestehende Rechte-, Aktivierungs- und Migrationslogik sowie neue Seitenleistenfilterung | HA 2026.10.4, Python 3.14.10 | 67 pytest-Tests bestanden, einschließlich 14 neuer Filterprüfungen |
| Native Panelliste | Originaler HA-Handler `get_panels` über echte authentifizierte WebSocket-Testverbindungen | Aktivierter Benutzer sieht nur freigegebene Dashboards, Family Access und Konto-/interne Routen; Administrator erhält unveränderte Liste |
| Allgemeine Panels und bisherige Startseite | Native Testpanels für Verlauf, Kalender, Medien, Logbuch, To-do und unbekanntes Panel; nicht freigegebene Übersicht | Nicht in der gefilterten Panelliste enthalten |
| HA-eigene Regeln und Darstellung | Originalhandler und originale Panelantworten | Native Adminsperre bleibt wirksam; eigene Titel und ausgeblendete erlaubte Panels bleiben erhalten; globale Registry unverändert |
| Offene Browser | Native Ereignisabonnements und bestehende WebSocket-Verbindungen | Erfolgreiches Speichern sendet `panels_updated`; erneute Panelabfrage verwendet neue Freigaben; Deaktivieren stellt normale Liste wieder her |
| Kompatibilität und Entladen | Native Ergebnisformate als Objekt, JSON, Bytes und `send_result`; Handlerregistrierung | Filter greift; Originalhandler sauber wiederhergestellt, fremde spätere Handler nicht überschrieben |
| Aktueller Core einschließlich Installation, HTTP/WS, Serviceausführung, Aktivierung, Panelliste, Ereignissen und Entladen | Isolierte HA-Instanz 2026.11.1 mit Frontend 20261028.5 | 17 Prüfungen bestanden; Ausgabe in `current_core_result.json` |
| Gemeinsame Oberfläche | Originalprüfsummen von HA UI Kit 1.2.1 und LinkeDOM | Kit, CSS und Lizenz unverändert; sechs Funktionsprüfungen bestanden |
| Browserdarstellung der Family-Access-Oberfläche | Chromium; 1100/430/390/375/320 px; hell/dunkel; vier Ansichten | 40 Varianten bestanden; direkte berechnete Stil-/Überlaufvergleiche mit Originalkomponenten und bestehende Bedienabläufe erfolgreich |
| Visuelle Sichtprüfung | Neue Hinweise in Benutzeransicht, Desktop hell und Mobil dunkel | Lesbarer Umbruch ohne überlagerte oder abgeschnittene Bedienelemente |
| Pakete | Deterministischer Build und Quellprüfsummen | Filtermodul, Kit, CSS, Lizenz und Branding in Installationspaketen enthalten |

Die native Seitenleistenquelle wurde mit dem echten HA-Handler und echten WebSocket-Anfragen geprüft. Die 40 Browservarianten betreffen die Family-Access-Oberfläche mit HA-Client-Fixture, nicht einen angemeldeten Browser auf deiner produktiven HA-Instanz. Das bestehende native HA-Frontend lädt seine Panelliste bei `panels_updated` erneut; es wird kein eigener Seitenleistenstil injiziert.

## Grenzen und Schutzumfang

Kein Live-Test mit deinem HA-System, Nabu-Casa-Konto, physischen iPhone oder individuellen Themes. Die isolierte Core-Instanz verwendet eine simulierte Loopback-Netzwerkschnittstelle; HTTP/WS und Serviceausführung sind echt.

Die Filterung steuert die Navigation aktivierter Benutzer unabhängig vom globalen Dashboard-Sperrschalter. Feste Konto- und Benachrichtigungselemente bleiben bestehen. Die separate optionale Dashboard-Konfigurationssperre schützt direkte Lovelace-Konfigurationsanfragen. Allgemeine Geräte-APIs, Suche, Historie und alternative Datenwege sind dadurch nicht vollständig abgesichert. Administratoren, Eigentümer und nicht aktivierte Benutzer behalten ihre native Panelliste. Startseitenpräferenzen werden nicht geändert.
