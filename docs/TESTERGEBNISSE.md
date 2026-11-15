# Prüfungen – Family Access Manager 1.0.0-beta.3

Stand: 15. November 2026. Implementierungsprüfung von `602dfc63628262b840a8b70f3e7b0ebb257593d5`: [erfolgreiche CI](https://github.com/v9h45n47mh-lab/family-access-manager/actions/runs/43718759199). Der Release-Commit ergänzt Dokumentation und passende Suchfeldbeschriftungen und führt dieselben Prüfungen erneut aus.

| Prüfung | Umgebung | Ergebnis |
|---|---|---|
| Rollen, Migration, Dashboardzugriff, Aktivierung, Fehlerprotokoll und Seitenleisteneinstellungen | HA 2026.10.4/Python 3.14 | 101 pytest-Tests bestanden |
| Native Benutzerspeicherung | Echte frontend UserStore-Instanzen | Reihenfolge und Admin-Sichtbarkeit dauerhaft gespeichert; andere Konten, Rechte und persönliche Felder erhalten |
| Live-Aktualisierung | Echter frontend/subscribe_user_data-WebSocket | Bestehende authentifizierte Sitzung erhält die übernommene Reihenfolge |
| Schutz der Seitenleistenverwaltung | Echte HTTP-/WebSocket-Anfragen | Normale Benutzer bei allen drei neuen Aktionen abgelehnt; Eigentümer/Administratoren zugelassen |
| Konflikte und Speicherfehler | HA-Tests mit gezielten Fehlern | Veraltete Stände zurückgewiesen; Teilerfolge je Konto gemeldet und ohne Geheimnisse protokolliert; fehlgeschlagene Admin-Speicherung setzt eigene Werte zurück |
| Aktueller Core | HA 2026.11.1/Frontend 20261028.5, isolierte echte HTTP-/WebSocket-Instanz | 25 Prüfungen bestanden; [Ergebnis](current_core_result.json) |
| Original-UI-Kit | Unveränderte lokale Originaldateien 1.6.0 | Lizenz/Prüfsummen/Import bestätigt, keine lokalen CSS-Regeln |
| Bedienlogik | Node.js/LinkeDOM | Vorhandene Bedienabläufe, Legacyfreigaben, Sortierung, Umbenennen, Diagnose und gesperrte Nichtadminansicht bestanden |
| Desktop und Mobil, hell und dunkel | Chromium; 1100/430/390/375/320 px | 40 Seitenvarianten plus 30 Dialogvarianten bestanden; kein horizontaler Überlauf |
| Übereinstimmung mit UI Kit | Direkte berechnete Stilvergleiche | Kopf, Navigation, Zeilen, Auswahlen, Schalter, Buttons und gemeinsame Benutzerzeilen stimmen mit Originalbausteinen überein |
| Interaktion | Browser mit HA-Client-Fixture | Umbenennen, Freigeben, Sortieren, Übernahme auf ein ausgewähltes Konto, persönliche Adminauswahl und expliziter Startseitenwechsel; Suche, Escape und Fokus erfolgreich |
| Visuelle Sichtprüfung | Desktop dunkel, Rollen mobil hell, Benutzer mobil dunkel, Adminauswahl mobil hell | Ausgerichtete Bedienfelder, Rollenauswahl ohne doppeltes Namensfeld, lesbare Dialoge und umbrechende lange Namen |

Die bisherigen 29 Unit-Tests und sieben Browsersuiten von [Kit 1.6.0](https://github.com/v9h45n47mh-lab/ha-ui-kit/releases/tag/v1.6.0) bleiben unverändert; die App verwendet dieselben geprüften Dateien. Die CI liefert 19 Screenshots im Artefakt ui-screenshots.

## Prüfumfang

Die Browserdarstellung verwendet feste HA-Client-Daten. Native Speicherung, Benutzertrennung, Revisionsprüfung und WebSocket-Abonnements werden getrennt im echten Core geprüft. Family Access bleibt ein Admin-Panel; normale Benutzer erhalten auch beim direkten Aufruf keine Verwaltungsdaten. Reihenfolgeübernahmen ändern keine Rolle, Aktivierung, Freigabe, Startseite oder bestehende Ausblendung. Die gesonderte Adminauswahl speichert ausdrücklich Sichtbarkeit und gewählte Startseite.

Globale HA-Dashboard-Sichtbarkeit bleibt maßgeblich. Die HA-Startseite muss sichtbar bleiben oder ausdrücklich gewechselt werden. Keine produktive HA-/Nabu-Casa-Instanz und keine physischen iPhones getestet. Die Core-Instanz verwendet eine simulierte Loopback-Netzwerkschnittstelle, echte Netzwerkgeräte gehören nicht zum Ergebnis.
