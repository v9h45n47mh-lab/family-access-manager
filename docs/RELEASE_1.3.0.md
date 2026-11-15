# Family Administration 1.3.0

Die Integration heißt jetzt **Family Administration**. Darstellung und App-Rollen werden getrennt zugewiesen: Maximilian kann Darstellung „Maximilian“ und App-Rolle „Benutzer“ erhalten, Paul Darstellung „Paul“ und dieselbe App-Rolle „Benutzer“. Rechte je App einmal in der gemeinsamen Rolle pflegen; Änderungen gelten für alle zugeordneten Benutzer.

Unter **Dashboards** werden Darstellungen angelegt, umbenannt, nach Rückfrage gelöscht und sortiert. **Nicht gewählt** ist standardmäßig zugeklappt; die Suche macht Treffer sichtbar. In der **Rollenverwaltung** stehen die App-Rollen **Admin** und **Benutzer** sowie eigene Rollen. App-Admin ist keine HA-Administratorrolle. Der Zugriff auf Family Administration und den zentralen Urlaubsschalter bleibt echten HA-Administratoren und Eigentümern vorbehalten.

Der **Urlaubsmodus** hat einen eigenen zentralen Tab. Vorhandene Zustände und vergangene Hausarbeitspausen bleiben erhalten. Bestehende gemischte Rollen werden einmalig getrennt; gleiche App-Freigaben werden gemeinsam genutzt. Bestehende Rechte, explizite Ablehnungen, Dashboardfreigaben und die Aktivierung bleiben erhalten. Übernommene App-Rechte lassen sich anschließend bewusst durch die gemeinsame Rolle „Benutzer“ oder „Admin“ ersetzen. Es gibt keine automatische Hochstufung.

Update über das bestehende Repository/HACS installieren, HA neu starten und Browser/App vollständig neu laden. Der technische Integrationspfad, Protokolle und gespeicherte Zuordnungen bleiben updatefähig. Bereits verbundene Anwendungen benötigen für die getrennten App-Rollen kein neues Berechtigungsmodul. Light Manager 1.5.1 zeigt Urlaubspausen auch in der Zeitübersicht; Shutter Manager 1.9.1 aktualisiert die Hilfe auf den neuen Tab.
