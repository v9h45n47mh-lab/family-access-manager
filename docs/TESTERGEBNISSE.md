# Prüfungen – Family Access Manager 1.0.1

Stand: 15. November 2026. Geprüfter Implementierungsstand `d9683c543d8a34508bcd9d8b46130e82bdd58d41`: [erfolgreiche CI](https://github.com/v9h45n47mh-lab/family-access-manager/actions/runs/43727525206). Der Release-Commit ergänzt Nachweise und ein zusätzlich ausgegebenes Versions-Screenshot und führt alle Prüfjobs vor Veröffentlichung erneut aus.

| Prüfung | Umgebung | Ergebnis |
|---|---|---|
| Rollen, Migration, Dashboardzugriff, Aktivierung, Fehlerprotokoll, native Listen und Profileinstellungen | HA 2026.10.4/Python 3.14 | 120 pytest-Tests bestanden |
| Native Profilauswahl | Echter lovelace/dashboards/list-Handler und authentifizierte WebSockets | Aktivierte Benutzer erhalten nur freigegebene, nicht ausschließlich Admins vorbehaltene Dashboards; bestehende Verbindung beachtet Rollenänderung und Deaktivierung bei der nächsten Anfrage |
| Unveränderte native Auswahl | Admin-, Eigentümer- und nicht aktivierte Konten | Katalog bleibt unverändert; Schema, Identität, Fehlerantworten und ursprünglicher Handler bleiben erhalten |
| Leere Rolle und fehlender Filter | Native HA-Tests | Keine Dashboardoptionen ohne Freigabe; Aktivierung wird bei fehlendem nativen Listenfilter abgelehnt |
| Tatsächliche Startseitenspeicherung | Echte frontend UserStores und frontend/get_user_data/subscribe_user_data, Schlüssel core | core.default_panel wird gelesen, gespeichert und über native Abonnements aktualisiert; andere Profileinstellungen bleiben erhalten; veraltete Dialogstände erkannt; Speicherfehler setzen eigene Werte zurück |
| Aktueller Core | Isolierter HA Core 2026.11.1/Frontend 20261028.5, echte HTTP-/WebSocket-Endpunkte | 29 Prüfungen bestanden; [Ergebnis](current_core_result.json), einschließlich nativer Profilauswahl und Wiederherstellung der Originalhandler beim Entladen |
| Originales UI Kit | Unveränderte lokale Dateien von HA UI Kit 1.6.0 | Prüfsummen/Lizenz/Import unverändert, keine lokalen CSS-Regeln |
| Rolle löschen | DOM und echter Browser | Öffnen löscht nichts; Abbrechen/Escape erhalten die Rolle; ausdrückliche Bestätigung löscht den Entwurf; zugewiesene Rollen bleiben geschützt |
| Versionen sichtbar | DOM und Browser unter Einstellungen | Oberfläche 1.0.1, Integration 1.0.1 und UI 1.6.0 in eigenem aufgeklapptem Bereich |
| Desktop und Mobil, hell und dunkel | Chromium; 1100/430/390/375/320 px | 40 Seiten- und 40 Dialogvarianten bestanden; kein horizontaler Überlauf; direkte berechnete Vergleiche mit Original-Kit-Bausteinen |
| Weitere Interaktion | Browser mit HA-Client-Fixture | Gewählte Dashboards sortieren, Block Nicht gewählt ohne Pfeile, Übernahme auf ausgewählte Konten, bereinigte Altzuordnungen, Admin-Sichtbarkeit, explizite Startseite, Suche, Tastaturfokus und verweigerte Nichtadmin-Verwaltung erfolgreich |
| Visuelle Sichtprüfung | Neuer Löschdialog mobil hell; frühere Desktop-/Mobilbilder und Themes | Klare getrennte Aktionen, lesbarer Rollentitel und Hinweis auf anschließendes Speichern; gemeinsame Kit-Geometrie erhalten |
| Reguläres Release | Versionskonsistenz und Build | Backend/Frontend/Manifest 1.0.1; kein Beta-/Prüfversionstext in Einrichtung, Oberfläche oder API-Meldungen; Veröffentlichungsworkflow wählt normalen latest-Kanal |

Die 29 Unit-Tests und sieben Browsersuiten des unveränderten [UI Kits 1.6.0](https://github.com/v9h45n47mh-lab/ha-ui-kit/releases/tag/v1.6.0) gelten weiterhin. Die App-CI erzeugt 20 Screenshots, darunter den neuen Löschdialog; der Release-Lauf gibt zusätzlich die Einstellungen mit Versionsbereich zur Sichtprüfung aus.

## Umfang

Die Browserprüfung verwendet feste HA-Client-Daten; die getrennten HA-/Core-Tests verwenden native Handler, Benutzerspeicher und authentifizierte WebSocket-/HTTP-Anfragen. Die Profilauswahl ist eine eigene Liste neben der Seitenleiste. Administratoren und nicht aktivierte Konten behalten die native Auswahl. Die HA-Option Auto (Systemeinstellungen verwenden) bleibt bestehen. Bereits geöffnete Profilansichten nach Änderungen neu öffnen; nach Updates HA und Browser neu laden.

Rollen, Dashboardfreigaben, Benutzeraktivierungen und native Geräte-/Systemrechte bleiben erhalten. Die optionale Dashboard-Sperre schützt weiterhin neue Konfigurationsanfragen. Die Versionsbereinigung ändert den dokumentierten Schutzumfang nicht. Keine produktive HA-/Nabu-Casa-Instanz und keine physischen iPhones getestet. Die isolierte Core-Instanz verwendet eine simulierte Loopback-Netzwerkschnittstelle.
