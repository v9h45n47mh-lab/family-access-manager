Family Access lässt sich jetzt **je Benutzer einzeln ein- und ausschalten**.

- Unter **Benutzer** hat jedes persönliche Konto ohne Administratorrechte einen Schalter „Family Access für …“.
- Eine Rolle lässt sich vorbereiten, ohne den Benutzer bereits zu aktivieren. Ausschalten erhält die gespeicherte Rollenzuordnung.
- Neue Benutzer bleiben ausgeschaltet. Beim Update werden bisher verwaltete Benutzer einschließlich leerer Zuordnungen automatisch als aktiv übernommen.
- Änderungen werden erst mit **Änderungen speichern** wirksam. Die serverseitige Prüfung berücksichtigt sie auch auf bereits offenen Verbindungen.
- Die optionale Dashboard-Konfigurationssperre gilt ausschließlich für aktivierte Benutzer. Administratoren behalten Vollzugriff.
- Die gemeinsamen Bedienelemente von HA UI Kit 1.2.1 bleiben unverändert eingebunden.

Für den Test: **Benutzer → Testuser → Family Access einschalten → Rolle wählen → Änderungen speichern**. Für die native Dashboard-Konfigurationsprüfung zusätzlich den globalen Schalter „Dashboard-Konfigurationen sperren“ einschalten.

Die Version bleibt eine Prüfversion mit dem bisherigen Schutzumfang. Allgemeine HA-Geräte-APIs werden dadurch weiterhin nicht gesperrt. Für ausgeschaltete Benutzer bleibt der native HA-Zugriff unverändert; die eigenen Family-Access-Gerätefunktionen erteilen ihnen keine zusätzlichen Freigaben.

Installation über das benutzerdefinierte Marketplace/HACS-Repository oder `family_access_manager.zip`. Vorabversionen gegebenenfalls einblenden und Home Assistant nach dem Update neu starten.
