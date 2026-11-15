Family Access Manager **1.0.0** korrigiert Updateanzeige und Reihenfolgeübernahme.

**Korrektur der Updateanzeige:** Alle bisherigen Releases waren als Vorabversion markiert. Bei ausgeblendeten Vorabversionen bot HACS deshalb einen Entwicklungsstand mit Commit-Hash an. Dieses Release ist regulär und explizit als neueste Version markiert. Auch künftige Veröffentlichungen unterscheiden den normalen Kanal automatisch von Beta-/RC-Versionen.

- Nur freigegebene Dashboards mit Pfeilen sortieren; übrige Dashboards stehen darunter im aufklappbaren Block **Nicht gewählt** ohne Pfeile. Ihre persönliche Reihenfolge wird nicht überschrieben.
- Unveränderte alte Zuordnungen zu Admin- oder gelöschten Konten blockieren das Speichern und Übernehmen nicht mehr. Neue Einschränkungen für Administratoren bleiben gesperrt.
- Der Client übernimmt die bereinigte gespeicherte Konfiguration, damit auch nachfolgendes Speichern funktioniert.

Gültige Rollen, Dashboardfreigaben, Aktivierungen und persönliche Seitenleisteneinstellungen bleiben erhalten. Versionsangaben in Backend, Oberfläche und Paketen stimmen überein.

In HACS die Repositoryinformationen neu laden und **1.0.0** installieren. Falls bisher `main` gewählt war, beim erneuten Herunterladen ausdrücklich **1.0.0** auswählen. Die bisher installierte Version kann bis zur Installation weiterhin als Hash erscheinen. Danach HA neu starten und den Browser vollständig neu laden.

Geprüft: **105 HA-Tests, 25 aktuelle Core-Prüfungen und 70 Browservarianten** bei Desktop-/Mobilbreiten und hellen/dunklen Themes.

[Prüfnachweis und Umfang](https://github.com/v9h45n47mh-lab/family-access-manager/blob/v1.0.0/docs/TESTERGEBNISSE.md). Der dokumentierte Schutzumfang bleibt unverändert.
