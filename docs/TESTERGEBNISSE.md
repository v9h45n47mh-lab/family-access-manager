# Abgeschlossene Prüfungen – Version 0.1.0

Stand: 10. November 2026.

| Prüfung | Umgebung | Ergebnis |
|---|---|---|
| Rechteauswertung, Manipulationsversuche, Parameterprüfung, HTTP-/WebSocket-Autorisierung, native Dashboard-Konfigurationssperre, Einrichtung und Entladen | Home Assistant Core 2026.10.4, Python 3.14.10, pytest-Testumgebung | 39 Tests bestanden |
| Installation und echter virtueller Schalter | Home Assistant Core 2026.11.1, passende Frontendversion 20261028.5 | Bestanden |
| HTTP ohne Anmeldung | Isolierte HA-Instanz 2026.11.1, echte TCP-Anfrage | HTTP 401 |
| Verwaltung mit normalem Benutzerkonto | Gleiche Instanz | HTTP 403 |
| Anzeigen ohne Bedienrecht | Gleiche Instanz | Lesen erlaubt, Schalten abgelehnt |
| Bedienrecht auf virtuellem Schalter | Gleiche Instanz | Reale HA-Serviceausführung, Zustand wechselt |
| Gemeinsame Prüfinstanz für HTTP und WebSocket | Gleiche Instanz, authentifizierte HTTP-/WS-Anfragen | Bestanden |
| Native Dashboard-Konfigurationssperre auf bestehender Verbindung | Gleiche Instanz, direkter `lovelace/config`-Aufruf | Abgelehnt |
| Cloud-Einstiegspunkt | Quellcodeprüfung des installierten offiziellen Cloud-Adapters | Verweist auf denselben HA-AppRunner; kein zusätzlicher Netzwerkproxy erforderlich |
| Entladen und erneutes Einrichten | Gleiche Instanz | Sperre sauber entfernt; gespeicherte Rechte nach erneutem Laden vorhanden |
| Oberfläche: Administratoransicht, Rollenspeicherung, HTML-Escaping, HTTP-/WS-Prüfaktion und ausgeblendete Verwaltungsfunktionen beim Kind | Node.js, LinkeDOM | 5 Funktionsprüfungen bestanden |
| JavaScript-Syntax | Node.js | Bestanden |

Der eigenständige Test für HA 2026.11.1 umfasst **zehn erfolgreiche Prüfungen**. Seine maschinenlesbare Ausgabe liegt in `current_core_result.json`.

## Was damit noch nicht nachgewiesen ist

- Kein Livezugriff über eine angemeldete Nabu-Casa-Verbindung; dafür fehlt der Zugriff auf deine HA-Instanz. Die Prüfung des Cloud-Adapters ist eine Architekturprüfung, kein erfolgreicher Relaytest.
- Keine vollständige Absicherung der nativen HA-Geräte-APIs und alternativer Datenwege. Das ist bewusst noch nicht implementiert.
- Keine allgemeine Freigabe des nativen Dashboardeditors für normale Benutzer.
- Kein ausgeführter Browser-Renderingtest für Desktop und Mobilgeräte. Der Testbrowser konnte die lokale Vorschau in dieser Umgebung nicht öffnen. Die Bedienlogik wurde separat mit einer DOM-Implementierung geprüft.
- Kein Zusammenspieltest mit deinen installierten Custom Cards, Light Manager, Shutter Manager oder Weckern.

Die isolierte Testumgebung verwendet eine simulierte Loopback-Netzwerkschnittstelle. Die HTTP-/WebSocket-Aufrufe und die HA-Serviceausführung sind echt; Netzwerkgeräte und Cloudkonto werden nicht simuliert als erfolgreich getestet ausgegeben. Automatische Netzwerkerkennung ist in dieser Umgebung eingeschränkt und nicht Teil des Ergebnisses.

## Schutzumfang des Prototyps

Die bestandenen Tests gelten für die eigene Family-Access-API und die ausdrücklich eingeschaltete Dashboard-Konfigurationssperre. Sie sind kein Nachweis einer umfassenden Sicherheitsgrenze um Home Assistant.

