# Abgeschlossene Prüfungen – Version 0.2.0

Stand: 10. November 2026. Getesteter Implementierungsstand: `21de74b4017d7dfa6e9c982011f97af53e1080fa`.

[Erfolgreicher GitHub-Actions-Lauf](https://github.com/v9h45n47mh-lab/family-access-manager/actions/runs/42872609399). Die Veröffentlichung führt dieselben Prüfungen auf dem Release-Commit erneut aus.

| Prüfung | Umgebung | Ergebnis |
|---|---|---|
| Rechteauswertung, Manipulationsversuche, Parameterprüfung, HTTP-/WebSocket-Autorisierung, native Dashboard-Konfigurationssperre, Einrichtung und Entladen | Home Assistant Core 2026.10.4, Python 3.14.10, pytest | 39 Tests bestanden |
| Installation, virtueller Schalter, echte HTTP-/WebSocket-Anfragen, Autorisierung, Dashboard-Sperre, Entladen und erneutes Einrichten | Isolierte HA-Instanz 2026.11.1, Frontend 20261028.5 | 12 Prüfungen bestanden; Ausgabe in `current_core_result.json` |
| Lokal eingebundenes UI-Kit-Modul | Echter HA-Frontend-Endpunkt | HTTP 200 und JavaScript-MIME-Typ |
| Marketplace-Logo | Echter lokaler HA-Marketplace-Brand-Endpunkt | HTTP 200, PNG-Bytes entsprechen dem mitgelieferten Logo |
| UI-Kit-Herkunft und Gestaltung | Prüfsummenvergleich mit HA UI Kit 1.2.1 | JavaScript, CSS und Lizenz unverändert; Panel importiert gemeinsame Komponenten und enthält ausschließlich `UI_CSS` |
| Oberfläche: Administratoransicht, Rollenspeicherung, HTML-Escaping, HTTP-/WS-Prüfaktion und ausgeblendete Verwaltung beim Kind | Node.js, LinkeDOM | 5 Funktionsprüfungen bestanden |
| Browserdarstellung | Echtes Chromium, Breiten 1100, 430, 390, 375 und 320 px; helles und dunkles Theme; Benutzer, Rollen, Prüfen und Umfang | 40 Varianten bestanden |
| Übereinstimmung mit dem UI Kit | Berechnete Browserstile im direkten Vergleich mit separat gerenderten Originalkomponenten | Panel-Kopf, Navigation, Typografie, Inhaltsbereich, Zeilen, Auswahlfelder, Schalter und Buttons entsprechen dem Kit |
| Umbruch und Platzbedarf | Alle 40 Browservarianten, einschließlich langer Entitätsnamen | Kein horizontaler Überlauf von Seite, Zeilen, Raster, Kopf oder Bedienelementen |
| Browserbedienung | Chromium mit Testkonten und HA-Client-Fixture | Zuordnung, Schalter, Berechtigungen speichern, Suche, Escaping, Dialogabbruch/Escape/Fokusrückgabe, API-Prüfung und virtueller Testschalter bestanden; Kind ohne Verwaltung |
| Visuelle Sichtprüfung | Erzeugte Screenshots: Benutzer Desktop hell / Mobil dunkel, Rollen Desktop dunkel / Mobil hell | Lesbare Umbrüche, keine abgeschnittenen oder überlagerten Bedienelemente; Gestaltung entspricht dem Kit |
| Backend-Vergleich | Quellcodevergleich mit Version 0.1.0 | API, Gate, Policy, Runtime, Services, Switch, Config Flow und Einrichtung unverändert |
| JavaScript-Syntax und Release-Pakete | Node.js und Python | Bestanden; Kit, Lizenz und Branding in den ZIPs enthalten |

Die Browserprüfungen erzeugen 16 Screenshots der vier Ansichten bei 1100 und 390 px in beiden Themes. Sie werden im CI-Artefakt `ui-screenshots` gespeichert. Die HA-Client-Antworten sind dort feste Testdaten; das Rendering und die UI-Kit-Komponenten laufen im echten Browser. Die unabhängigen Core-Prüfungen verwenden echte HA-HTTP-/WebSocket-Endpunkte.

## Grenzen der Prüfung

- Kein Livezugriff über dein Nabu-Casa-Konto oder deine produktive HA-Instanz. Die Prüfung des Cloud-Adapters bestätigt den gemeinsamen HA-AppRunner im Quellcode und ersetzt keinen Relaytest.
- Keine vollständige Absicherung der nativen HA-Geräte-APIs und alternativer Datenwege; dies ist weiterhin nicht implementiert.
- Keine allgemeine Freigabe des nativen Dashboardeditors für normale Benutzer.
- Kein Zusammenspieltest mit deinen installierten Custom Cards, Light Manager, Shutter Manager oder Weckern.
- Die Integration besitzt keinen Kalender. Die Umstellung fügt keine Kalenderfunktion hinzu.
- Die Browserprüfung verwendet Chromium und festgelegte Test-Themes; ein Test auf einem physischen iPhone oder mit individuellen Themes wurde nicht durchgeführt.

Die isolierte Core-Testumgebung verwendet eine simulierte Loopback-Netzwerkschnittstelle. Die HTTP-/WebSocket-Aufrufe und die HA-Serviceausführung sind echt. Netzwerkgeräte, automatische Erkennung und das Cloudkonto sind nicht Teil des Testergebnisses.

## Schutzumfang des Prototyps

Die bestandenen Tests gelten für die eigene Family-Access-API und die ausdrücklich eingeschaltete Dashboard-Konfigurationssperre. Version 0.2.0 behält diesen Schutzumfang und die bisherigen Berechtigungsregeln bei.
