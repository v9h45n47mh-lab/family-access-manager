# Dashboardfreigaben lokal und über Nabu Casa prüfen

## Vorbereitung

1. Als Administrator eine Rolle „Zugriffstest“ anlegen.
2. Ein Dashboard auf **Freigegeben**, die übrigen auf **Kein Zugriff** setzen.
3. Unter **Benutzer** beim Testkonto Family Access einschalten, die Rolle wählen und speichern. Das Testkonto darf kein HA-Administrator und nicht der Eigentümer sein.
4. **Dashboard-Konfigurationen sperren** einschalten und speichern.
5. Mit dem Testkonto in einem separaten Browserprofil anmelden. Nach einem Update HA neu starten und den Testbrowser vollständig neu laden.

## Erwartete Ergebnisse

| Prüfung | Erwartung | Lokal | Nabu Casa |
|---|---|---|---|
| Seitenleiste | Nur freigegebene Dashboards, Family Access und feste Konto-/Benachrichtigungselemente | Offen | Offen |
| Freigegebenes Dashboard öffnen | Anzeige möglich; Bedienung folgt den nativen HA-Rechten | Offen | Offen |
| Family Access öffnen | Nur Prüfen und Umfang, keine Verwaltung und kein Fehlerprotokoll | Offen | Offen |
| HTTP und WebSocket prüfen | Dieselbe Prüfinstanz erreicht | Offen | Offen |
| Nicht freigegebene Konfiguration direkt per WebSocket abfragen | Abgelehnt; als Administrator Fehler mit Benutzer, Ziel und Grund sichtbar | Offen | Offen |
| Freigabe bei offenem Browser ändern und speichern | Seitenleiste aktualisiert sich; neue Konfigurationsanfrage verwendet aktuelle Rechte | Offen | Offen |
| Family Access ausschalten und speichern | Rolle erhalten, native Panelliste wiederhergestellt | Offen | Offen |
| Normales Konto ruft Fehlerprotokoll-API auf | Abgelehnt; kein fremder Protokollinhalt | Offen | Offen |
| HA neu starten | Gespeicherte Rollen, Aktivierungen und letzte Fehler vorhanden | Offen | Offen |
| Administrator weiterverwenden | Vollzugriff und native Administratorprüfungen unverändert | Offen | Offen |

Eine nicht verfügbare Frontendroute kann schon vor einer Serveranfrage abgewiesen werden. Das allein erzeugt keinen protokollierten Backend-Berechtigungsfehler. Für einen eindeutigen Ablehnungstest die native Konfiguration mit authentifiziertem WebSocket abfragen:

```json
{"id":1,"type":"lovelace/config","url_path":"DEIN_NICHT_FREIGEGEBENES_DASHBOARD"}
```

Administratoren können das Fehlerprotokoll direkt abrufen:

```json
{"id":2,"type":"family_access_manager/request","action":"admin_error_log"}
```

IDs innerhalb einer Verbindung müssen ansteigen. Identität und Administratorrechte stammen aus der HA-Verbindung. Niemals Tokens in Screenshots oder Rückmeldungen kopieren.

Für die Cloudprüfung ausdrücklich die Nabu-Casa-Adresse verwenden; eine Erfolgsmeldung im Heimnetz beweist keinen Cloudzugriff. Bereits im Browser geladene Inhalte können zwischengespeichert sein und werden nicht nachträglich zurückgeholt. Dieser Ablauf prüft Dashboardzugriff, keine zusätzliche Geräte- oder allgemeine HA-Systemberechtigung.
