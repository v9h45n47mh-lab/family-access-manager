# Family Access Manager 1.2.0

Der Urlaubsmodus wird ausschließlich unter **Family Access → Einstellungen → Urlaubsmodus** bedient. Die eigenen Urlaubsmodus-Bereiche und Schalter entfallen aus Light Manager, Shutter Manager und Hausarbeiten. Die Option „Im Urlaub pausieren“ je Programm bleibt erhalten; Programme ohne diese Option laufen weiter. Hausarbeiten pausieren ohne Änderung ihres Wiederholungsrhythmus und laufen beim Ausschalten ab heute weiter.

Beim ersten Start wird ein bisher aktiver Urlaubsmodus einmalig zentral als aktiv übernommen. Vergangene Urlaubstage aus Hausarbeiten bleiben erhalten. Eine bewusste zentrale Änderung hat Vorrang vor später startenden Anwendungen. Bei vorübergehend fehlendem Family Access bleibt der zuletzt bestätigte Zustand erhalten.

**Update:** zuerst Family Access Manager 1.2.0, danach Light Manager 1.5.0, Shutter Manager 1.9.0 und Hausarbeiten 0.5.0 installieren. Anschließend Home Assistant neu starten und Browser/App vollständig neu laden. Der zentrale Schalter speichert sofort, unabhängig von noch ungespeicherten Rollenänderungen. Bedienen dürfen echte HA-Administratoren und Eigentümer.

Automationen können `family_access_manager.set_vacation` mit `enabled: true/false` verwenden. Die bisherigen Light-/Shutter-Dienste leiten an diesen Dienst weiter und behalten den ursprünglichen HA-Benutzerkontext: echte Administratoren oder vertrauenswürdige HA-Automationen dürfen schalten. Ein reines Anwendungs-Verwaltungsrecht berechtigt nicht zum globalen Umschalten. Alte lokale WebSocket-Schreibzugriffe und Sicherungswerte können den zentralen Modus nicht überschreiben.

Die Rollen- und Dashboardrechte bleiben unverändert. Der zentrale Zustand wird separat und dauerhaft gespeichert; fehlgeschlagene Administratorprüfungen erscheinen im Fehlerprotokoll. Oberfläche ausschließlich mit den vorhandenen Originalkomponenten aus HA UI Kit 1.6.0.
