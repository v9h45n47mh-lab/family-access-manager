Family Access Manager **1.0.0-beta.2** überarbeitet die Benutzeransicht und macht die Verwaltung ausschließlich für Administratoren zugänglich.

- Gemeinsame kompakte Benutzerzeile aus **HA UI Kit 1.6.0**: Name links, Rolle und Aktivierung rechts; mobil als zusammengehörige Zeile mit Rollenauswahl darunter.
- Keine dauerhaft sichtbare Vorab-Warnung und keine lange Einleitung in der Benutzerliste. Der Dashboard-Sperrschalter liegt unter dem Zahnrad **Einstellungen**.
- Family Access erscheint bei eingeschränkten Benutzern nicht mehr in der Seitenleiste. Die native HA-Panelregistrierung verlangt Administratorrechte.
- Auch der Start der Oberfläche wird serverseitig geprüft. Ein direkt aufgerufener oder zwischengespeicherter Panel-Client erhält als normaler Benutzer keine Verwaltungsoberfläche.
- Rollen, Aktivierungen, Dashboardfreigaben und gespeicherte Fehler bleiben erhalten.

Geprüft: **82 HA-Tests, 21 aktuelle Core-Prüfungen und 50 Browservarianten**, ergänzt durch 29 Kit-Unit-Tests und sieben Kit-Browsersuiten. Details: [Prüfergebnisse](https://github.com/v9h45n47mh-lab/family-access-manager/blob/v1.0.0-beta.2/docs/TESTERGEBNISSE.md).

Nach dem Update Home Assistant neu starten und den Testbrowser vollständig neu laden. Vorabversionen in Marketplace/HACS gegebenenfalls einblenden.
