# Family Administration 1.5.0

**Administration** steht ganz links und bündelt Benutzer, Urlaubsmodus und Rollenverwaltung. Neue Darstellungen erhalten direkt beim Anlegen einen Namen. Die gemeinsame Versionszeile steht ganz unten in den Einstellungen. Der separate Zugriffsschutz-Schalter entfällt; direkte Dashboard-Konfigurationsanfragen werden für aktiv eingeschränkte Konten automatisch gegen ihre Freigaben geprüft.

## Neu in 1.4.0

Manuell sortierbare Einträge werden am gemeinsamen Sortiergriff gedrückt gehalten und an die gewünschte Position gezogen. Die bisherigen Auf-/Ab-Pfeile entfallen. Maus, Touch und Tastatur am Griff werden unterstützt; Escape bricht den Vorgang ab. HA UI Kit 1.7.0 liefert Griff, Rückmeldung und Interaktion gemeinsam. Bestehende Rechte und gespeicherte Daten bleiben erhalten.

HA-Administratoren erhalten unter Administration → Benutzer ebenfalls eine eigene Darstellung. Diese bestimmt sichtbare Dashboards; Family Administration und HA-Systembereiche bleiben erreichbar. Native Administratorrechte bleiben vollständig erhalten. Die bisherige Standarddarstellung bleibt beim Update bestehen, bis ausdrücklich eine Darstellung zugewiesen wird. Die Reihenfolge lässt sich anschließend auf die zugeordneten Admins übernehmen.

Zentrale Verwaltung für Dashboard-Darstellungen, App-Rollen und Urlaubsmodus in Home Assistant. Die Oberfläche verwendet ausschließlich die mitgelieferten Originalkomponenten und Styles aus **HA UI Kit 1.7.0**.

## Darstellung und App-Rolle getrennt zuweisen

| Benutzer | Darstellung | App-Rolle |
| --- | --- | --- |
| Maximilian | Maximilian | Benutzer |
| Paul | Paul | Benutzer |

Eine **Darstellung** legt die sichtbaren Dashboards und deren Reihenfolge fest. Eine **App-Rolle** legt die Rechte in allen beteiligten Anwendungen fest. Die Rechte der Rolle „Benutzer“ werden je App einmal gepflegt und gelten für alle zugeordneten Benutzer. Das Ändern einer Darstellung verändert keine App-Rechte.

1. Unter **Dashboards** eine Darstellung anlegen, benennen und Dashboards freigeben. Nur gewählte Dashboards lassen sich am Sortiergriff gedrückt halten und ziehen. **Nicht gewählt** ist zunächst zugeklappt; die Suche zeigt auch Treffer in diesem Bereich.
2. Unter **Administration → Rollenverwaltung** die gemeinsamen App-Rollen **Admin** und **Benutzer** oder eigene Rollen verwalten. In jedem Anwendungstab die Rechte der ausgewählten App-Rolle festlegen.
3. Unter **Administration → Benutzer → Zuordnung** die Darstellung und die App-Rolle wählen. Der separate Dashboard-Schalter aktiviert die Beschränkung von Seitenleiste und Dashboardauswahl. Ohne diesen Schalter bleibt die native HA-Navigation erhalten; App-Rechte gelten unabhängig davon.
4. **Änderungen speichern**. Mehrere App-Rollen ergänzen sich. Bereits bestehende Kombinationen mehrerer Darstellungen bleiben erhalten, bis bewusst eine andere Darstellung gewählt wird.
Die Aktivierung für das Benutzerkonto schützt automatisch auch neue direkte Lovelace-Konfigurationsanfragen nach der Darstellung. Einen zusätzlichen Zugriffsschutz-Schalter gibt es nicht.

**Admin** ist eine App-Rolle und erzeugt keine HA-Administratorrechte. **Family Administration** und der zentrale Urlaubsschalter sind ausschließlich für echte HA-Administratoren und Eigentümer verfügbar. Eingeschränkte Konten sehen keinen Verwaltungseintrag; direkte Panel- und API-Aufrufe sind ebenfalls geschützt. Native Geräte-, Eigentümer- und persönliche Kontoprüfungen der Anwendungen gelten zusätzlich.

Die Rolle „Benutzer“ wird mit Rechten für eigene Aufgaben, eigene Essenseinträge, eigene Wecker und Musik sowie der Bedienung von Rollladenprogrammen vorbereitet. Verwaltungsrechte, das Ändern fremder Essenseinträge und die Verwaltung fremder Wecker bleiben zunächst ausgeschaltet. Die Voreinstellungen können je App zentral angepasst werden. Neue Benutzer erhalten keine automatische Rollenzuweisung.

## Vorhandene Rechte übernehmen

Beim Update werden bisher gemischte Rollen einmalig in Darstellungen und App-Rollen getrennt. Gleiche App-Freigaben werden wiederverwendet. Effektive Berechtigungen, ausdrücklich verweigerte Freigaben, Dashboardfreigaben und die bisherige Benutzeraktivierung bleiben erhalten. Reine App-Rollen erscheinen nicht mehr als leere Dashboard-Darstellungen.

Übernommene App-Rechte bleiben unter „Übernommene Rechte …“ verfügbar. Um alle Kinder auf ein gemeinsames Profil umzustellen, unter **Administration → Benutzer → Zuordnung** die bisherigen App-Rollen bewusst durch **Benutzer** ersetzen. Vorher die Rechte dieser gemeinsamen Rolle in den Anwendungstabs prüfen. Mehrere zugewiesene Rollen ergänzen sich; zum Entziehen eines Rechts auch übernommene Rollen beachten.

Rollen und Darstellungen werden erst nach Rückfrage aus dem Entwurf gelöscht. Abbrechen, Schließen und Escape erhalten den Eintrag. Zugewiesene Einträge lassen sich nicht löschen. Erst **Änderungen speichern** übernimmt den Entwurf dauerhaft. Gleichzeitige Änderungen werden über Revisionen erkannt; alte Browser müssen vor dem Speichern neu laden.

## Zentraler Urlaubsmodus

Der Bereich **Administration → Urlaubsmodus** steuert Light Manager, Shutter Manager und Hausarbeiten. Es gibt keinen weiteren globalen Urlaubsschalter in diesen Anwendungen. Die Option „Im Urlaub pausieren“ je Programm bleibt erhalten; andere Programme laufen weiter. Hausarbeiten pausieren ohne Änderung ihres Wiederholungsrhythmus und laufen beim Ausschalten ab heute weiter.

Ein bisher aktiver Urlaubsmodus wird einmalig übernommen. Vergangene Hausarbeitspausen bleiben erhalten, auch bei späterem Start nach einer zentralen Änderung. Eine bewusste zentrale Entscheidung hat Vorrang. Bei Ausfall der Zentrale behalten die Anwendungen den zuletzt bestätigten Zustand.

Der Schalter speichert sofort, unabhängig von ungespeicherten Rollenänderungen. Automationen können weiterhin `family_access_manager.set_vacation` mit `enabled: true` oder `enabled: false` verwenden. Die bisherigen Light-/Shutter-Dienste leiten den ursprünglichen HA-Kontext an diesen Dienst weiter. Echte HA-Administratoren und vertrauenswürdige Automationen dürfen schalten; App-Verwaltungsrechte allein genügen dafür nicht.

**Light Manager 1.5.1** zeigt pausierte Schaltungen in der Zeitübersicht mit „Urlaubspause“. **Shutter Manager 1.9.1** zeigt pausierte Fahrten weiterhin und verwendet in der Hilfe den neuen zentralen Tab. Die Anzeige führt keine Schaltung aus.

## Reihenfolge und persönliche Admin-Seitenleiste

**Dashboards → Reihenfolge übernehmen** überträgt die Sortierung auf ausgewählte Konten. Zugeordnete Konten sind vorausgewählt; auch andere persönliche Benutzer und Administratoren lassen sich auswählen. Bei offenen Änderungen speichert **Speichern und übernehmen** zunächst den Rechteentwurf. Die Aktion ändert ausschließlich die native Seitenleistenreihenfolge. Sichtbarkeit, Rollen, Startseiten und andere persönliche HA-Einstellungen bleiben erhalten. Teilweise fehlgeschlagene Übernahmen werden angezeigt und protokolliert.

Unter **Administration → Benutzer** können echte Administratoren für jedes Administratorkonto eigene Dashboards ein- und ausblenden. Der native Vollzugriff bleibt bestehen. Eine ausgeblendete Startseite muss ausdrücklich durch eine sichtbare Startseite oder das eigene Profil ersetzt werden.

Für aktivierte normale Benutzer werden sowohl die Seitenleiste als auch **Profil → Erscheinungsbild → Dashboard** nach der Darstellung gefiltert. „Auto (Systemeinstellungen verwenden)“ bleibt verfügbar. Bereits geöffnete Profilansichten nach Änderungen neu öffnen.

## Fehlerprotokoll und Versionen

**Fehler** enthält die letzten 200 fehlgeschlagenen Berechtigungsprüfungen mit Benutzer, Aktion, Ziel und Grund, auch nach HA-Neustarts. Nur echte HA-Administratoren können es abrufen. Tokens, Authentifizierungsheader, vollständige Anfragen und Serviceparameter werden nicht gespeichert. Allgemeine Integrations- oder Anmeldefehler gehören weiterhin in das HA-Protokoll.

Ganz unten unter **Einstellungen** stehen Oberfläche, Integration und HA UI Kit. Reguläre Versionen verwenden MAJOR.MINOR.PATCH ohne Beta- oder Commit-Hash.

## Installation und Update

Das bestehende Repository `https://github.com/v9h45n47mh-lab/family-access-manager` in HACS als **Integration** verwenden. Version **1.5.0** installieren, HA neu starten und Browser/App vollständig neu laden. Bestehende Installationen erhalten den neuen Anzeigenamen automatisch. Der technische Integrationspfad und die verbundenen App-Protokolle bleiben kompatibel.

Bei Erstinstallation unter **Einstellungen → Geräte & Dienste → Integration hinzufügen → Family Administration** einrichten. Die Quelle ist ein benutzerdefiniertes Repository und nicht automatisch Teil des offiziellen Katalogs.

Für die manuelle Installation aus [GitHub Releases](https://github.com/v9h45n47mh-lab/family-access-manager/releases) `family_access_manager.zip` laden und `custom_components/family_access_manager` nach `/config/custom_components/family_access_manager` kopieren. Das vollständige Quellpaket heißt `Family_Administration_1.5.0.zip`. HACS bei alten Commit-Hash-Anzeigen neu laden und ausdrücklich die reguläre Version wählen.

## Schutzumfang

Für aktiv eingeschränkte Benutzer prüft die native Dashboard-Sperre automatisch neue Lovelace-Konfigurationsanfragen. Ein zusätzlicher globaler Schalter ist nicht erforderlich; bisher gespeicherte Abschaltungen werden beim Update aufgehoben. Bereits geladene Inhalte lassen sich nicht zurückholen. Allgemeine HA-Geräte-/System-APIs, Suche, Historie, Kameras, Assist, Automationen und Drittintegrationen folgen weiterhin den nativen HA-Rechten. Das Ausblenden einer Seitenleiste ist allein keine allgemeine Sicherheitsgrenze. HA-Gruppen, Tokens und Netzwerkeinstellungen werden nicht verändert.

Die App-Rollen werden von den beteiligten eigenen Integrationen im Backend geprüft. Bei eingerichteter, aber nicht verfügbarer zentraler Verwaltung werden normale Benutzer nicht auf frühere lokale Verwaltungsrechte zurückgestuft. Echte HA-Administratoren behalten Wiederherstellungszugriff. Beim Entfernen der Integration entfallen die eigene Navigationsfilterung und Dashboard-Sperre.

## Entwicklung und Prüfung

Backendtests verwenden echte HA-Testinstanzen. Zusätzlich läuft eine unabhängige Installations-/API-Prüfung gegen HA Core 2026.11.1 sowie ein gepinnter Integrationstest mit den tatsächlichen Light-, Shutter- und Hausarbeiten-Managern. Chromium prüft 1100/430/390/375/320 px in hellen und dunklen Themes mit direktem Kit-Stilabgleich. Die produktive HA-/Nabu-Casa-Instanz wird dadurch nicht installiert oder verändert.

```bash
pip install -r requirements-test.txt
python -m pytest
npm ci --ignore-scripts
npm run check:kit
npm run test:panel
npx playwright install --with-deps chromium
npm run test:browser
python scripts/build_release.py
```

Tests ausschließlich mit temporären HA-Konfigurationen ausführen. [Prüfablauf](docs/LOKAL_CLOUD_TEST.md) · [Versionierung](docs/VERSIONING.md) · [Änderungen](CHANGELOG.md)
