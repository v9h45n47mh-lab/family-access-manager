# Zentrale Berechtigungen

Acht eigene Anwendungstabs: Light Manager, Shutter Manager, Essensplaner, Hausarbeiten, Gartenarbeit, Spülmaschine, Music Manager und Wecker. Mehrfachrollen sind in der Benutzerverwaltung auswählbar. Fehlgeschlagene Anwendungsprüfungen erscheinen im bestehenden Fehlerprotokoll. Rollen werden weiterhin erst nach Bestätigung gelöscht.

Berechtigungen werden jetzt in **Family Access → Anwendung → Rolle** verwaltet. Benutzer können mehrere Rollen erhalten; ihre Freigaben ergänzen sich. Vorhandene Anwendungsrechte werden einmalig in Rollen mit dem Zusatz „übernommen“ importiert und den bisherigen Benutzern zugeordnet. Dashboardfreigaben und die Aktivierung der Dashboardnavigation werden dadurch nicht verändert.

Zum Entziehen eines Rechts alle zugewiesenen Rollen einschließlich übernommener Rollen prüfen. Neue Benutzer erhalten nach der Übernahme keine automatischen Anwendungsrechte. Echte HA-Administratoren behalten Vollzugriff zur Wiederherstellung. Geräte-, Eigentümer- und externe Kontoberechtigungen gelten zusätzlich; eine Rolle erzeugt keine HA-Administratorrechte.

**Aktualisierung:** zuerst Family Access Manager 1.1.0 oder neuer, danach die beteiligten Anwendungen aktualisieren und Home Assistant neu starten. Solange Family Access nicht eingerichtet ist, bleibt die bisherige Rechtevergabe erhalten. Ist Family Access eingerichtet, aber nicht verfügbar oder zu alt, werden Anwendungsaktionen für normale Benutzer abgelehnt. Lokale Benutzer-/Personen-, Geräte- und Musikkontozuordnungen bleiben für Identität und Eigentum erhalten; Rechte werden zentral vergeben.

Die Rollen werden im Tab **Rollenverwaltung** angelegt, umbenannt und gelöscht. **Dashboards** verwaltet die Dashboardfreigaben und Reihenfolge je Rolle; die Anwendungstabs verwalten deren jeweilige Rechte. Benutzerzuordnungen stehen unter **Benutzer**.
