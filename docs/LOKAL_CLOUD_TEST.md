# Prüfung auf deiner HA-Instanz

Ziel: dieselben erwarteten Erlaubnisse und Ablehnungen lokal und über Nabu Casa bestätigen. Für diese Prüfung wird der virtuelle Testschalter verwendet.

## Vorbereitung

1. Integration gemäß README installieren.
2. Als Administrator eine Rolle „Zugriffstest“ anlegen.
3. Genau ein Dashboard freigeben und den Testschalter zunächst nur zum Anzeigen erlauben.
4. Rolle einem normalen Testkonto zuordnen. Das Konto darf kein HA-Administrator und nicht der Eigentümer sein.
5. Speichern. Optional die native Dashboard-Konfigurationssperre einschalten.
6. Testkonto in einem separaten Browserprofil oder privaten Fenster anmelden.

## Erwartete Ergebnisse

| Prüfung | Erwartung | Lokal | Nabu Casa |
|---|---|---|---|
| Family Access öffnen | Nur Prüfen und Umfang; keine Benutzer-/Rollenverwaltung | Offen | Offen |
| HTTP und WebSocket prüfen | Beide erreichen dieselbe Prüfinstanz | Offen | Offen |
| Testschalter anzeigen | Erlaubt | Offen | Offen |
| Testschalter umschalten bei „Anzeigen“ | Abgelehnt; Zustand unverändert | Offen | Offen |
| Freigegebenes Dashboard über Family Access abrufen | Erlaubt | Offen | Offen |
| Nicht freigegebenes Dashboard direkt neu öffnen, Sperre eingeschaltet | Konfigurationsabfrage abgelehnt | Offen | Offen |
| Testschalter auf „Bedienen“ ändern, dann umschalten | Erlaubt; virtueller Zustand wechselt | Offen | Offen |
| Rolle bei offener Verbindung auf „Kein Zugriff“ ändern, erneut abfragen | Neue Anfrage abgelehnt | Offen | Offen |
| Als Administrator weiterarbeiten | Vollzugriff bleibt erhalten | Offen | Offen |

Für die Cloudprüfung ausdrücklich die **Nabu-Casa-Adresse** verwenden. In der Companion-App kann eine interne URL automatisch bevorzugt werden. Der Test zeigt die aufrufende Adresse an; eine allgemeine Erfolgsmeldung im Heimnetz beweist noch keinen Cloudzugriff.

Ein neuer Aufruf desselben Tabs kann zwischengespeicherte Dashboardinhalte verwenden. Für den direkten Dashboardtest einmal vollständig neu laden beziehungsweise ein frisches Fenster verwenden. Bereits an den Browser übermittelte Inhalte lassen sich nachträglich nicht zurückholen.

## Direkte WebSocket-Aufrufe

Die folgenden Nachrichten dienen zum Prüfen mit einer bereits authentifizierten Verbindung. Die Integration übernimmt die Identität aus der Verbindung und akzeptiert keinen frei wählbaren Benutzer. IDs müssen innerhalb der Verbindung ansteigen.

```json
{"id":1,"type":"family_access_manager/request","action":"status"}
```

```json
{"id":2,"type":"family_access_manager/request","action":"read_entity","payload":{"entity_id":"switch.DEINE_TESTENTITAET"}}
```

```json
{"id":3,"type":"family_access_manager/request","action":"call_service","payload":{"domain":"switch","service":"toggle","entity_ids":["switch.DEINE_TESTENTITAET"],"data":{}}}
```

```json
{"id":4,"type":"lovelace/config","url_path":"DEIN_NICHT_FREIGEGEBENES_DASHBOARD"}
```

Für direkte HTTP-Tests lautet die Route `POST /api/family_access_manager/request`. Der JSON-Body enthält genau `action` und `payload`; die Authentifizierung erfolgt wie bei anderen HA-REST-Anfragen. Tokens niemals in Screenshots, Rückmeldungen oder Testprotokolle kopieren.

## Erwartete Grenze

Ein nativer Geräteaufruf kann in dieser Version weiterhin funktionieren, obwohl die Family-Access-API ihn verweigert. Dieser bekannte Unterschied darf nicht als bestandener vollständiger Zugriffsschutz gewertet werden. Die nächste Stufe muss diese alternativen Wege absichern.

