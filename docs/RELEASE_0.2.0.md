Family Access Manager verwendet jetzt **HA UI Kit 1.2.1** aus `v9h45n47mh-lab/ha-ui-kit`.

- Gemeinsamer Panel-Kopf, Navigation, Benutzer- und Berechtigungszeilen, Auswahlfelder, Schalter, Buttons, Meldungen und Bestätigungsdialog.
- Keine lokalen CSS-Überschreibungen für Schriften, Farben, Größen, Abstände und Symbole.
- Marketplace-Logo ergänzt.
- Funktionen und Backend-Berechtigungslogik beibehalten. Family Access besitzt weiterhin keinen Kalender.

Geprüft: **39 HA-Tests, 12 aktuelle Core-Prüfungen und 40 Browservarianten** (Desktop und Mobil, hell und dunkel). Berechnete Stile wurden direkt mit den Originalkomponenten verglichen; ergänzende Sichtprüfung der Screenshots. Details und Grenzen: [Prüfergebnisse](https://github.com/v9h45n47mh-lab/family-access-manager/blob/v0.2.0/docs/TESTERGEBNISSE.md).

Die Version bleibt eine **Prüfversion mit dem bisherigen Schutzumfang**. Die Umstellung erweitert keine HA-Zugriffssperren und ersetzt keinen Live-Test über Nabu Casa.

Installation über das benutzerdefinierte Marketplace/HACS-Repository oder das angehängte `family_access_manager.zip`. HA danach neu starten. Vorabversionen gegebenenfalls einblenden.
