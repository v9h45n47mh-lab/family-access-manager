Die Seitenleiste wird für Benutzer mit aktiviertem Family Access jetzt nach ihren Dashboardfreigaben gefiltert.

- Nicht freigegebene Dashboards werden aus der nativen HA-Panelliste entfernt, einschließlich einer nicht freigegebenen bisherigen Startseite.
- Allgemeine Panels wie Verlauf, Kalender und Medien werden für diese Benutzer ebenfalls ausgeblendet. Family Access sowie das eigene Profil und interne Frontend-Routen bleiben erreichbar. Das native Kontomenü und der Benachrichtigungsbereich bleiben bestehen.
- Die Filterung gilt sofort bei aktiviertem Family Access und ist unabhängig vom zusätzlichen Schalter für die Dashboard-Konfigurationssperre.
- Administratoren, Eigentümer und Benutzer ohne aktiviertes Family Access erhalten ihre unveränderte HA-Panelliste.
- Nach erfolgreichem Speichern lädt die native HA-Oberfläche ihre Panelliste über das übliche `panels_updated`-Ereignis neu. Der Filter verändert keine globale Panelkonfiguration und keine Benutzerpräferenzen.
- Direkte Lovelace-Konfigurationsanfragen werden weiterhin durch die separate optionale Dashboard-Sperre geprüft. Das Ausblenden ersetzt keine allgemeine Geräte-/API-Zugriffskontrolle.

Nach dem Update Home Assistant neu starten und den Testbrowser einmal vollständig neu laden. Anschließend ein freigegebenes Dashboard öffnen, beispielsweise „Maximilian“. Ist eine bisherige Startseite nicht freigegeben, wird sie nicht automatisch freigegeben oder als Benutzerpräferenz ersetzt.

Installation über Marketplace/HACS mit eingeblendeten Vorabversionen oder `family_access_manager.zip`.
