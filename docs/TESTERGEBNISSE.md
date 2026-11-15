# Prüfungen – Family Access Manager 1.0.0-beta.3

Stand: 15. November 2026. Lokale HA-Prüfungen erfolgreich; unabhängige CI mit Chromium und aktuellem Core wird vor Veröffentlichung ausgeführt.

- 101 pytest-Tests mit HA 2026.10.4/Python 3.14: Rollen, Migration, Aktivierung, Zugriffsschutz, native Benutzerspeicherung, Reihenfolgeübernahme, Admin-Sichtbarkeit, Revisionskonflikte, Teilausfälle und HTTP-/WebSocket-Adminschutz.
- Node.js/LinkeDOM: bestehende Bedienabläufe sowie Sortierung, Umbenennen und verschobene Diagnose erfolgreich.
- Originaldateien von HA UI Kit 1.6.0, Lizenz und Prüfsummen bestätigt. Keine lokalen CSS-Regeln.

Die Browserprüfung umfasst fünf Breiten (1100/430/390/375/320 px), helle/dunkle Themes, vier Seiten und drei Dialoge. Die aktuellen Core-Prüfungen laufen getrennt mit HA 2026.11.1 und Frontend 20261028.5.

Kein Live-Test mit der produktiven HA-/Nabu-Casa-Instanz oder physischen iPhones. Die Browserdarstellung verwendet feste HA-Client-Daten; native Speicherung und WebSocket-Abonnements werden getrennt im echten Core geprüft. Globale HA-Dashboard-Sichtbarkeit bleibt maßgeblich; die Startseite muss sichtbar bleiben oder ausdrücklich gewechselt werden.
