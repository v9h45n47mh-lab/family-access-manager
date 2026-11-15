# Änderungen

## 0.3.0 – 15.11.2026

- Aktivierung von Family Access getrennt von der Rollenzuordnung je Benutzer.
- Ausschalten behält die Rolle; neue Benutzer sind standardmäßig ausgeschaltet.
- Bestehende Benutzerzuordnungen werden beim Laden sicher in aktive Zuordnungen übernommen.
- HTTP, WebSocket und die optionale Dashboard-Sperre berücksichtigen die Auswahl serverseitig.
- Tests für Migration, Speicherung, selektive Sperre, bestehende Verbindungen und Selbstaktivierungsversuche ergänzt.
- Separates Original-Stylesheet des UI Kits vollständig in beide ZIP-Pakete aufgenommen.

## 0.2.0 – 10. November 2026

Oberfläche auf die unveränderten Komponenten von HA UI Kit 1.2.1 umgestellt; lokale CSS-Regeln entfernt. Gemeinsamer Kopf, Navigation, Benutzer-/Berechtigungszeilen, Auswahlfelder, Schalter, Buttons und Verwerfendialog. Marketplace-Logo ergänzt. Funktionen und Backend-Berechtigungslogik unverändert.


## 0.1.0 – 10. November 2026

Erste installierbare Prüfversion mit Benutzer-/Rollenverwaltung, getrennten Dashboard- und Gerätefreigaben, Entitäts-/Bereichs-/Labelfreigaben, geschützten eigenen HTTP-/WebSocket-Funktionen, virtuellem Testschalter und optionaler nativer Sperre von Dashboard-Konfigurationsanfragen.

Allgemeine HA-Geräte-APIs und die Freigabe des nativen Dashboardeditors sind noch nicht Bestandteil dieser Version. Der lokale Test ist abgeschlossen; der Live-Test über Nabu Casa steht aus.

