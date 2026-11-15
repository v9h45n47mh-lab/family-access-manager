# Abgeschlossene Prüfungen – Version 0.3.0

Stand: 15. November 2026. Getesteter Implementierungsstand: `a8c1cce09255de313a777f0710604a456a1913e5`.

[Erfolgreicher CI-Lauf](https://github.com/v9h45n47mh-lab/family-access-manager/actions/runs/43689876862). Der Release-Commit durchläuft dieselben Prüfungen erneut.

| Prüfung | Umgebung | Ergebnis |
|---|---|---|
| Bestehende Rechteauswertung, Manipulationsversuche, Autorisierung, Einrichtung und neue Benutzeraktivierung | HA 2026.10.4, Python 3.14.10, pytest | 53 Tests bestanden, darunter 14 neue Aktivierungs- und Migrationsprüfungen |
| Aktivierung unabhängig von der Rolle | Policy und Browser | Neue Benutzer aus; Rolle vorbereiten aktiviert nicht; Ausschalten erhält die Rolle; Wiedereinschalten stellt ihre Freigaben wieder her |
| Selektive native Dashboard-Sperre | Zwei HA-Konten und offene WebSocket-Verbindungen | Nur gewähltes Konto eingeschränkt; Ein-/Ausschalten wirkt auf der nächsten Anfrage |
| Speicherung und Migration | HA-Store und strikte Policy-Validierung | Alte Zuordnungen einschließlich leerer Zuordnungen bleiben aktiv; deaktivierte Auswahl und Rolle über Neuladen erhalten |
| Selbstaktivierung und ungültige Eingaben | Echte HA-HTTP-/WebSocket-Testendpunkte | Normale Benutzer können sich nicht selbst aktivieren; Administratorzuordnung und fehlerhafte Aktivierungslisten abgelehnt |
| Installation, echte Serviceausführung, HTTP/WebSocket, Aktivierung, Entladen und Neuladen | Isolierter HA Core 2026.11.1 mit Frontend 20261028.5 | 14 Prüfungen bestanden; Ausgabe in `current_core_result.json` |
| Aktuelle Core-Aktivierung | Admin speichert über echte HTTP-Anfragen; Benutzerverbindung bleibt offen | Ausschalten erhält die Rolle und entzieht eigene API-Freigaben; Wiedereinschalten greift auf bestehender Verbindung |
| UI-Kit und Marketplace-Logo | Originalprüfsummen und echte HA-Endpunkte | HA UI Kit 1.2.1 unverändert, nur gemeinsames UI_CSS; JavaScript-MIME-Typ und lokale PNG-Bytes korrekt |
| Bedienlogik und Escaping | Node.js, LinkeDOM | Sechs Funktionsprüfungen einschließlich Benutzeraktivierung bestanden |
| Browserdarstellung | Chromium; 1100/430/390/375/320 px; hell/dunkel; Benutzer/Rollen/Prüfen/Umfang | 40 Varianten bestanden; berechnete Stile direkt mit Originalkomponenten verglichen; kein horizontaler Überlauf |
| Browserbedienung | HA-Client-Fixture im echten Browser | Aktivierung, gespeicherte Auswahl, erhaltene Rolle und Tastaturfokus sowie bestehende Berechtigungs-, Such- und Dialogabläufe erfolgreich |
| Visuelle Sichtprüfung | Neue Benutzeransicht Desktop hell / Mobil dunkel | Schalter, Status und Rollenfelder lesbar, keine abgeschnittenen oder überlagerten Bedienelemente |
| Release-Pakete | Deterministischer Python-Build | Kit einschließlich separater Original-CSS, Lizenz und Branding vollständig in den ZIPs enthalten |

Die Browserprüfung erzeugt 16 Screenshots bei 1100 und 390 px in beiden Themes im CI-Artefakt `ui-screenshots`. HA-Client-Antworten sind feste Testdaten; Rendering und UI-Kit-Komponenten laufen im echten Chromium. Die unabhängigen Core-Prüfungen verwenden echte HA-HTTP-/WebSocket-Endpunkte.

## Grenzen der Prüfung

Kein Test mit deiner produktiven HA-Instanz, deinem Nabu-Casa-Konto, physischen iPhones, individuellen Themes oder deinen übrigen Custom-Integrationen. Die Core-Testumgebung verwendet eine simulierte Loopback-Netzwerkschnittstelle; HTTP/WebSocket und Serviceausführung sind echt. Die Cloud-Adapter-Prüfung bestätigt den gemeinsamen HA-AppRunner im Quellcode und ersetzt keinen Relaytest.

## Schutzumfang

Die Aktivierung steuert den vorhandenen Family-Access-Schutzumfang je Benutzer. Ausgeschaltete Konten behalten ihren nativen HA-Zugriff und erhalten über die eigene Family-Access-API keine zusätzlichen Geräte- oder Dashboardfreigaben. Die optionale Dashboard-Konfigurationssperre greift nur bei aktivierten Konten und eingeschaltetem globalem Schalter. Administratoren behalten Vollzugriff. Allgemeine native HA-Geräte-APIs und der native Dashboardeditor werden dadurch nicht zusätzlich freigeschaltet oder abgesichert.
