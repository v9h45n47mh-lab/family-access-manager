const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const choices = (value, levels) => levels.map(([id, title]) => `<option value="${esc(id)}"${id === value ? " selected" : ""}>${esc(title)}</option>`).join("");
const entityLevels = [["none","Kein Zugriff"],["view","Anzeigen"],["control","Bedienen"]];
const dashboardLevels = [...entityLevels,["edit","Bearbeiten · vorgemerkt"]];

class FamilyAccessPanel extends HTMLElement {
  constructor() {
    super(); this.attachShadow({mode:"open"}); this.tab="users"; this.section="entities";
    this.roleId="family"; this.query=""; this.dirty=false; this.busy=false;
    this.shadowRoot.addEventListener("click", (e) => this.click(e));
    this.shadowRoot.addEventListener("change", (e) => this.change(e));
    this.shadowRoot.addEventListener("input", (e) => {
      if (e.target.id === "search") { this.query=e.target.value; this.renderResourceRows(); }
      if (e.target.id === "role-name") { this.policy.roles[this.roleId].name=e.target.value; this.markDirty(); }
    });
  }
  set hass(value) {
    this._hass=value;
    const who=value?.user?.id;
    if (who && this.who !== who) { this.who=who; this.status=null; this.snapshot=null; this.reload(); }
  }
  set narrow(value) { this.toggleAttribute("narrow", value); }
  set panel(value) { this._panel=value; }
  async api(action,payload={}) { return this._hass.callWS({type:"family_access_manager/request",action,payload}); }
  async reload() {
    if (!this._hass || this.busy) return;
    this.busy=true;
    try {
      this.status=await this.api("status");
      if (this.status.is_admin) {
        this.snapshot=await this.api("admin_snapshot"); this.policy=structuredClone(this.snapshot.policy);
        if (!this.policy.roles[this.roleId]) this.roleId=Object.keys(this.policy.roles)[0] || "";
      } else this.tab="test";
      this.dirty=false; this.error="";
    } catch(e) { this.error=e.message || String(e); }
    finally { this.busy=false; this.render(); }
  }
  markDirty() {
    this.dirty=true;
    const save=this.shadowRoot.querySelector('[data-action="save"]');
    if(save) { save.disabled=false; save.textContent="Änderungen speichern"; }
  }
  async click(e) {
    const button=e.target.closest("button"); if(!button || button.disabled) return;
    if(button.dataset.tab) { this.tab=button.dataset.tab; this.render(); return; }
    const action=button.dataset.action;
    try {
      if(action === "menu") { this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:true,composed:true})); return; }
      if(action === "reload") { if(this.dirty && !confirm("Ungespeicherte Änderungen verwerfen?")) return; await this.reload(); return; }
      if(action === "save") {
        button.disabled=true; await this.api("save_policy",this.policy); await this.reload(); this.notice="Rechte gespeichert."; this.render(); return;
      }
      if(action === "add-role") {
        const id="role_"+Date.now(); this.policy.roles[id]={name:"Neue Rolle",dashboards:{},entities:{},areas:{},labels:{}};
        this.roleId=id; this.dirty=true; this.tab="roles"; this.render(); return;
      }
      if(action === "delete-role") {
        if(Object.values(this.policy.bindings).some(r=>r.includes(this.roleId))) throw Error("Diese Rolle ist noch einem Benutzer zugewiesen.");
        delete this.policy.roles[this.roleId]; this.roleId=Object.keys(this.policy.roles)[0] || ""; this.dirty=true; this.render(); return;
      }
      if(action === "probe-read") { this.output=await this.api("read_entity",{entity_id:this.status.probe_entity_id}); this.error=""; this.render(); return; }
      if(action === "probe-toggle") {
        await this.api("call_service",{domain:"switch",service:"toggle",entity_ids:[this.status.probe_entity_id],data:{}});
        this.output=await this.api("read_entity",{entity_id:this.status.probe_entity_id}); this.error=""; this.render(); return;
      }
      if(action === "dashboard-read") {
        this.output=await this.api("read_dashboard",{url_path:button.dataset.path}); this.error=""; this.render(); return;
      }
      if(action === "api-check") {
        const ws=await this.api("status");
        const rest=await this._hass.callApi("POST","family_access_manager/request",{action:"status",payload:{}});
        const same=ws.instance_id === rest.result.instance_id;
        this.output={"WebSocket und HTTP":same ? "Dieselbe Prüfinstanz erreicht" : "Abweichung erkannt", "Aufrufadresse":location.origin,"Cloudzugriff":location.hostname.endsWith(".ui.nabu.casa")?"Von der Nabu-Casa-Adresse aufgerufen":"Für die Cloudprüfung auch von der Nabu-Casa-Adresse ausführen", "Allgemeine HA-API abgesichert":false};
        this.error=""; this.render(); return;
      }
    } catch(err) { this.error=err.message || String(err); this.render(); }
  }
  change(e) {
    const el=e.target;
    if(el.id === "role-select") { this.roleId=el.value; this.query=""; this.render(); return; }
    if(el.id === "section-select") { this.section=el.value; this.query=""; this.render(); return; }
    if(el.dataset.user) {
      if(el.value === "unmanaged") delete this.policy.bindings[el.dataset.user];
      else this.policy.bindings[el.dataset.user]=el.value === "deny"?[]:[el.value];
      this.markDirty(); return;
    }
    if(el.dataset.grant) {
      const section=el.dataset.section, key=el.dataset.grant;
      if(el.value === "none") delete this.policy.roles[this.roleId][section][key];
      else this.policy.roles[this.roleId][section][key]=el.value;
      this.markDirty(); return;
    }
    if(el.dataset.setting) { this.policy[el.dataset.setting]=el.checked; this.markDirty(); }
  }
  userContent() {
    const roles=Object.entries(this.policy.roles).map(([id,r])=>[id,r.name]);
    return `<section><h2>Benutzer</h2><p>Ein Konto erhält die gewählte Rolle. Administratoren behalten Vollzugriff.</p><div class="rows">${this.snapshot.users.map(u=>{
      const assigned=this.policy.bindings[u.id];
      const selected=assigned === undefined?"unmanaged":assigned[0] || "deny";
      return `<div class="row"><div><strong>${esc(u.name)}</strong><small>${u.admin?"Administrator":u.active?"Benutzer":"Inaktiv"}</small></div>${u.admin?'<span class="badge">Vollzugriff</span>':`<select data-user="${esc(u.id)}">${choices(selected,[["unmanaged","Nicht verwaltet"],["deny","Kein Zugriff"],...roles])}</select>`}</div>`;
    }).join("")}</div></section><section><h2>Prüfversion aktivieren</h2><label class="check"><input type="checkbox" data-setting="native_dashboard_gate" ${this.policy.native_dashboard_gate?"checked":""} ${!this.status.gate_available?"disabled":""}> Dashboard-Konfigurationen für zugeordnete Benutzer sperren</label><p>Prüft direkte Lovelace-Konfigurationsanfragen. Geräte, Verlauf und andere HA-APIs bleiben außerhalb dieser Sperre.</p><label class="check"><input type="checkbox" data-setting="device_control" ${this.policy.device_control?"checked":""}> Freigegebene Geräte über die Family-Access-API bedienen</label><p>Ohne diese Option kann über diese API nur der virtuelle Testschalter geschaltet werden.</p></section>`;
  }
  roleContent() {
    const role=this.policy.roles[this.roleId];
    return `<section><div class="section-head"><h2>Rollen</h2><button data-action="add-role">+ Rolle</button></div>${Object.keys(this.policy.roles).length?`<div class="fields"><label>Rolle<select id="role-select">${choices(this.roleId,Object.entries(this.policy.roles).map(([id,r])=>[id,r.name]))}</select></label><label>Name<input id="role-name" maxlength="80" value="${esc(role.name)}"></label><button class="subtle" data-action="delete-role">Entfernen</button></div><h3>Dashboards</h3><p>„Bedienen“ benötigt zusätzlich Gerätefreigaben. „Bearbeiten“ wird vorgemerkt; die Freigabe des nativen Editors folgt später.</p><div class="rows">${this.snapshot.dashboards.map(d=>`<div class="row"><span>${esc(d.name)}<small>${esc(d.id)}</small></span><select data-grant="${esc(d.id)}" data-section="dashboards">${choices(role.dashboards[d.id]||"none",dashboardLevels)}</select></div>`).join("") || '<p>Keine Dashboards gefunden.</p>'}</div><h3>Gerätefreigaben</h3><p>Freigaben werden über Entitäten, Bereiche und Labels zusammengeführt. Die höhere Freigabe gilt; „Kein Zugriff“ entfernt hier nur den jeweiligen Eintrag.</p><div class="fields"><label>Auswahl<select id="section-select">${choices(this.section,[["entities","Entitäten"],["areas","Bereiche"],["labels","Labels"]])}</select></label><label>Suchen<input id="search" type="search" placeholder="Name oder ID" value="${esc(this.query)}"></label></div><div class="rows" id="resources"></div>`:'<p>Lege eine Rolle an, um Freigaben zu verwalten.</p>'}</section>`;
  }
  resourceRows() {
    const role=this.policy.roles[this.roleId]; if(!role) return "";
    const q=this.query.toLowerCase();
    const list=(this.snapshot[this.section]||[]).filter(x=>(x.name+" "+x.id).toLowerCase().includes(q));
    list.sort((a,b)=>Boolean(role[this.section][b.id])-Boolean(role[this.section][a.id]) || a.name.localeCompare(b.name));
    return list.slice(0,100).map(x=>`<div class="row"><span>${esc(x.name)}<small>${esc(x.id)}</small></span><select data-grant="${esc(x.id)}" data-section="${this.section}">${choices(role[this.section][x.id]||"none",entityLevels)}</select></div>`).join("")+(list.length>100?'<p>Bitte Suche eingrenzen; die ersten 100 Treffer werden angezeigt.</p>':!list.length?'<p>Keine Treffer.</p>':"");
  }
  renderResourceRows() { const box=this.shadowRoot.getElementById("resources"); if(box) box.innerHTML=this.resourceRows(); }
  testContent() {
    return `<section><h2>Zugriff prüfen</h2><p>Diese Prüfung führt echte Anfragen mit dem angemeldeten HA-Konto aus. Der virtuelle Schalter bedient kein Gerät im Haus.</p><div class="actions"><button data-action="api-check">HTTP und WebSocket prüfen</button><button data-action="probe-read" ${!this.status.probe_entity_id?"disabled":""}>Testschalter anzeigen</button><button data-action="probe-toggle" ${!this.status.probe_entity_id?"disabled":""}>Testschalter umschalten</button></div><p class="muted">Testentität: ${esc(this.status.probe_entity_id || "Wird eingerichtet …")}</p>${this.status.is_admin?'<p>Administratoren haben Vollzugriff. Für Ablehnungstests ein separates Konto ohne Administratorrechte verwenden.</p>':`<p>Rollen: ${esc(this.status.roles.join(", ") || "Keine Freigabe")}</p>`}${this.output?`<pre>${esc(JSON.stringify(this.output,null,2))}</pre>`:""}<h3>Freigegebene Dashboards</h3><div class="rows">${this.status.dashboards.map(d=>`<div class="row"><span>${esc(d.name)}</span><button data-action="dashboard-read" data-path="${esc(d.id)}">Konfiguration abrufen</button></div>`).join("") || "<p>Keine Dashboards freigegeben.</p>"}</div></section>`;
  }
  scopeContent() {
    return `<section><h2>Umfang der Prüfversion</h2><div class="facts"><div><span>Eigene HTTP-/WebSocket-Anfragen</span><strong>Rechteprüfung aktiv</strong></div><div><span>Native Dashboard-Konfigurationen</span><strong>${this.status.native_dashboard_gate && this.status.gate_available?"Sperre eingeschaltet":"Sperre ausgeschaltet"}</strong></div><div><span>Allgemeine HA-Geräte-APIs</span><strong>Noch nicht abgesichert</strong></div><div><span>Bearbeiten als normaler Benutzer</span><strong>Noch nicht freigeschaltet</strong></div><div><span>Nabu Casa auf deiner Instanz</span><strong>Vor Ort zu prüfen</strong></div></div><p>Vorhandene HA-Gruppen, Tokens und Netzwerkeinstellungen werden nicht verändert. Ausblenden in der Seitenleiste ist kein Bestandteil dieser Version. Beim Entfernen der Integration entfällt auch die optionale Dashboard-Sperre.</p><p>Die gleiche Entität hat innerhalb der Family-Access-API auf allen Dashboards dieselben Rechte. Automationen, Skripte, Kameras, Verlauf, Assist und Drittintegrationen sind noch nicht allgemein abgesichert.</p><small>Family Access Manager · ${esc(this.status.version)}</small></section>${this.snapshot?`<section><h2>Letzte Zugriffsprüfungen</h2><div class="rows">${this.snapshot.events.slice(0,30).map(ev=>`<div class="row"><span>${esc(ev.operation)}<small>${esc(ev.target)} · ${esc(new Date(ev.time).toLocaleString("de-DE"))}</small></span><span class="badge ${ev.allowed?"":"denied"}">${ev.allowed?"Erlaubt":"Abgelehnt"}</span></div>`).join("") || "<p>Noch keine Prüfungen. Nach einem Test neu laden.</p>"}</div></section>`:""}`;
  }
  render() {
    const admin=this.status?.is_admin && this.snapshot;
    const tabs=admin?[["users","Benutzer"],["roles","Rollen"],["test","Prüfen"],["scope","Umfang"]]:[["test","Prüfen"],["scope","Umfang"]];
    this.shadowRoot.innerHTML=`<style>
      :host{display:block;color:var(--primary-text-color,#242a28);background:var(--primary-background-color,#f5f6f5);min-height:100vh;font-family:var(--paper-font-body1_-_font-family,system-ui,sans-serif);--accent:#ff7000}
      *{box-sizing:border-box}header{height:64px;background:var(--card-background-color,#fff);border-bottom:1px solid var(--divider-color,#e4e7e4);display:flex;align-items:center;padding:0 24px;gap:12px;position:sticky;top:0;z-index:5}header strong{font-size:20px}header .grow{flex:1}.menu{font-size:23px;background:none;color:inherit;padding:4px 8px}main{max-width:1040px;margin:0 auto;padding:26px 24px 50px}.intro{margin-bottom:22px}.intro h1{font-size:29px;margin:0 0 7px}.intro p{margin:0;color:var(--secondary-text-color,#65706a)}.warning{border:1px solid #f0c69d;border-left:4px solid var(--accent);background:var(--card-background-color,#fff);padding:14px 18px;border-radius:12px;font-size:14px;line-height:1.55;margin:18px 0}nav{display:flex;gap:6px;margin:23px 0 18px;border-bottom:1px solid var(--divider-color,#ddd)}nav button{background:none;color:var(--secondary-text-color,#65706a);border-radius:0;padding:12px 16px}nav button.active{color:var(--accent);border-bottom:3px solid var(--accent)}section{background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#e0e5e0);border-radius:16px;padding:24px;margin-bottom:18px}h2{font-size:19px;margin:0 0 12px}h3{font-size:16px;margin:26px 0 10px}p{font-size:14px;line-height:1.6;color:var(--secondary-text-color,#65706a)}button{border:0;border-radius:10px;padding:10px 15px;background:var(--accent);color:#fff;font:inherit;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap}button:disabled{opacity:.45;cursor:default}.subtle{color:var(--secondary-text-color,#65706a);background:var(--secondary-background-color,#f0f2ef)}.rows{display:grid;gap:0}.row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 0;border-top:1px solid var(--divider-color,#ebeeeb);min-width:0}.row>span,.row>div{min-width:0;overflow-wrap:anywhere}.row select{width:230px;flex-shrink:0}small{display:block;font-size:12px;color:var(--secondary-text-color,#778079);margin-top:4px;overflow-wrap:anywhere}.badge{border-radius:30px;padding:6px 11px;background:var(--secondary-background-color,#eef4ed);font-size:12px;color:var(--primary-text-color,#2f4837);white-space:nowrap}.badge.denied{background:#fff0e7;color:#9d4300}select,input{font:inherit;color:inherit;background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#d9dfd9);border-radius:9px;padding:10px;max-width:100%;font-size:14px}input[type=checkbox]{accent-color:var(--accent);width:18px;height:18px}.fields{display:flex;align-items:end;gap:14px;flex-wrap:wrap;margin:15px 0}.fields label{display:grid;gap:6px;font-size:13px;flex:1;min-width:150px}.check{display:flex;gap:10px;align-items:center;font-size:14px;margin-top:18px}.section-head{display:flex;align-items:center;justify-content:space-between}.actions{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0}pre{background:var(--secondary-background-color,#f4f6f3);border-radius:12px;padding:18px;white-space:pre-wrap;overflow-wrap:anywhere;max-height:350px;overflow:auto;font-size:12px;line-height:1.6}.error{color:#b54120;background:#fff0ea;padding:12px 16px;border-radius:10px;margin:14px 0}.notice{color:#30633e;margin:12px 0}.facts>div{display:flex;justify-content:space-between;gap:18px;padding:15px 0;border-bottom:1px solid var(--divider-color,#eee);font-size:14px}.facts strong{text-align:right;font-size:13px}.muted{font-size:12px}@media(max-width:650px){header{padding:0 12px}header strong{font-size:17px}main{padding:22px 14px}section{padding:18px}.intro h1{font-size:25px}nav{gap:0}nav button{flex:1;padding:12px 8px;font-size:13px}.row{gap:10px;align-items:start}.row select{width:155px;font-size:13px}.facts>div{flex-direction:column;gap:6px}.facts strong{text-align:left}header button{font-size:12px;padding:9px}.fields{gap:10px}.actions button{flex:1}}
    </style><header><button class="menu" data-action="menu" aria-label="Menü öffnen">☰</button><strong>Family Access</strong><span class="grow"></span><button class="subtle" data-action="reload">Neu laden</button>${admin?`<button data-action="save" ${!this.dirty?"disabled":""}>${this.dirty?"Änderungen speichern":"Gespeichert"}</button>`:""}</header><main><div class="intro"><h1>Wer darf was?</h1><p>Dashboards und Geräte gezielt freigeben.</p></div><div class="warning"><strong>Technische Prüfversion.</strong> Eigene Funktionen prüfen Rechte im Backend. Allgemeine Home-Assistant-APIs sind noch nicht abgesichert.</div>${this.error?`<div class="error" role="alert">${esc(this.error)}</div>`:""}${this.notice?`<div class="notice" role="status">${esc(this.notice)}</div>`:""}${this.status?`<nav aria-label="Bereiche">${tabs.map(([id,title])=>`<button data-tab="${id}" class="${this.tab===id?"active":""}">${title}</button>`).join("")}</nav>${this.tab==="users" && admin?this.userContent():this.tab==="roles" && admin?this.roleContent():this.tab==="scope"?this.scopeContent():this.testContent()}`:"<p>Wird geladen …</p>"}</main>`;
    this.renderResourceRows();
  }
}
if(!customElements.get("family-access-panel")) customElements.define("family-access-panel",FamilyAccessPanel);
