Family Access Manager **1.0.0-beta.1** konzentriert sich auf Benutzerrollen und Dashboardfreigaben.

- Aktuelles **HA UI Kit 1.5.2** vollständig lokal eingebunden: Kopfbereich, Navigation, Rollen-/Benutzerzeilen, Auswahlfelder, Schalter, Buttons, Dialoge und Protokollzeilen. Keine lokalen CSS-Überschreibungen.
- Gerätefreigaben, Geräteauswahl, Gerätebedienungsschalter und Testschalter sind aus der Oberfläche entfernt. Dashboardfreigaben benötigen keine zusätzlichen Gerätefreigaben.
- Dashboardauswahl mit „Freigegeben“ / „Kein Zugriff“. Vorhandene Anzeigen-/Bedienen-/Bearbeiten-Zuordnungen erscheinen als freigegeben und bleiben bis zur Änderung gespeichert. Die Bedienung folgt den nativen HA-Rechten; Family Access vergibt keine Administratorrechte.
- Neues **Fehlerprotokoll** für Administratoren mit Zeitpunkt, Benutzer, Aktion, Ziel, Ablehnungsgrund und Anfrageweg.
- Die letzten 200 Fehler bleiben über Neuladen und HA-Neustarts erhalten. Authentifizierte eigene API-Ablehnungen, die Dashboard-Sperre sowie native HA-Administratorablehnungen werden protokolliert. Tokens, Header und vollständige Anfrageinhalte werden nicht gespeichert.
- Benutzeraktivierung, Seitenleistenfilterung und die zusätzliche Dashboard-Konfigurationssperre bleiben erhalten.

Versionierung künftig nach SemVer: Vorabstände `1.0.0-beta.1`, `1.0.0-beta.2` usw.; regulär Korrekturen als Patch, Erweiterungen als Minor und inkompatible Änderungen als Major.

Geprüft mit **79 HA-Tests, 20 aktuellen Core-Prüfungen und 50 Browservarianten** für Desktop/Mobil und helle/dunkle Themes. Zusätzlich Protokollzugriff, Persistenz, Datenschutz und Altfreigaben geprüft. Details: [Prüfergebnisse](https://github.com/v9h45n47mh-lab/family-access-manager/blob/v1.0.0-beta.1/docs/TESTERGEBNISSE.md).

Die Version ist weiterhin eine Vorabversion. Ihr Umfang sind Dashboardzugriff und Navigation; die nativen HA-Geräte- und Systemrechte bleiben bestehen. Bereits geladene Dashboardinhalte lassen sich nicht zurückholen.

Nach dem Update Home Assistant neu starten und den Browser vollständig neu laden. Administratoren finden die Diagnose unter **Family Access → Fehler**. Vorabversionen in Marketplace/HACS gegebenenfalls einblenden.
