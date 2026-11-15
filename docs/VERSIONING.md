# Versionsnummern

Family Access Manager verwendet semantische Versionen: `MAJOR.MINOR.PATCH`.

- Patch, z. B. `1.0.1`: Fehlerkorrekturen ohne neue Funktionen.
- Minor, z. B. `1.1.0`: kompatible Erweiterungen.
- Major, z. B. `2.0.0`: inkompatible Änderungen.
- Vorabversionen werden eindeutig markiert: `1.0.0-beta.1`, danach `1.0.0-beta.2`. Die endgültige `1.0.0` erhält keinen Beta-Zusatz.

Die bisherigen `0.x`-Tags bleiben unverändert. Die Versionsangabe ist keine Aussage über eine vollständige Absicherung aller Home-Assistant-APIs. Maßgeblich ist der dokumentierte Schutzumfang.

## GitHub und HACS

Reguläre Versionen wie **1.0.0** werden ohne `prerelease`-Markierung und mit `latest` veröffentlicht. Nur Versionen mit einem Vorabzusatz, etwa **1.1.0-beta.1**, erhalten `prerelease=true` und werden nicht als neueste reguläre Version markiert. Der CI-Releaseprozess wählt diese Eigenschaften anhand der Manifestversion.

Damit erhalten HACS-Nutzer auch ohne eingeschaltete Vorabversionen eine normale Updateversionsnummer. Ein früher von `main` installierter Stand kann bis zur ersten Installation eines regulären Releases noch als Commit-Hash angezeigt werden.
