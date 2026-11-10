import {UI_CSS, UI_VERSION, escapeHtml as esc, panelHeader, navigation, section, row, button, iconButton, field, selectField, toggle, feedback, emptyState, loadingState, versionInfo, statusBadge, helpContent, confirmDialog, textareaField, bindUI} from './family-ui/1.2.1/family-ui.js';
const options = values => values.map(([value,label]) => ({value,label}));
const kitSelect = (props,data={},inline=false) => {
  const attrs=Object.entries(data).map(([key,value])=>` data-${key}="${esc(value)}"`).join('');
  const html=selectField(props).replace('<select ',`<select${attrs} `);
  return inline ? html.replace('<span>','<span class="visually-hidden">') : html;
};
const entityLevels = [["none","Kein Zugriff"],["view","Anzeigen"],["control","Bedienen"]];
const dashboardLevels = [...entityLevels,["edit","Bearbeiten · vorgemerkt"]];

class FamilyAccessPanel extends HTMLElement {
  constructor() {
    super(); this.attachShadow({mode:"open"}); this.tab="users"; this.section="entities";
    this.roleId="family"; this.query=""; this.dirty=false; this.busy=false;

    this.shadowRoot.addEventListener("change", (e) => this.change(e));
    this.shadowRoot.addEventListener("input", (e) => {
      if (e.target.id === "search") { this.query=e.target.value; this.renderResourceRows(); }
      if (e.target.id === "role-name") { this.policy.roles[this.roleId].name=e.target.value; this.markDirty(); }
    });
  }
  connectedCallback() {
    this.unbind ||= bindUI(this.shadowRoot, event => {
      if (event.action === 'navigate') { this.tab=event.data.page==='settings'?'scope':event.data.page; this.render(); return; }
      if (event.action === 'setting-change') {
        this.policy[event.data.setting]=event.checked;
        event.element.classList.toggle('on',event.checked);
        event.element.setAttribute('aria-checked',String(event.checked));
        this.markDirty(); return;
      }
      this.click({target:event.element});
    });
  }
  disconnectedCallback() { this.unbind?.(); this.unbind=null; }
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
    if(save) { save.disabled=false; save.querySelector("span").textContent="Änderungen speichern"; }
  }
  async click(e) {
    const button=e.target.closest("button"); if(!button || button.disabled) return;
    if(button.dataset.tab) { this.tab=button.dataset.tab; this.render(); return; }
    const action=button.dataset.action;
    try {
      if(action === "menu") { this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:true,composed:true})); return; }
      if(action === "reload") { if(this.dirty) { this.shadowRoot.getElementById("discard-dialog").showModal(); return; } await this.reload(); return; }
      if(action === "confirm-reload") { this.shadowRoot.getElementById("discard-dialog").close(); await this.reload(); return; }
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
    const users=this.snapshot.users.map(u=>{
      const assigned=this.policy.bindings[u.id],value=assigned===undefined?'unmanaged':assigned[0]||'deny';
      return u.admin ? row({title:u.name,description:'Administrator',trailing:statusBadge({label:'Vollzugriff',state:'active',icon:'lock'})})
        : `<div class="grid">${row({title:u.name,description:u.active?'Benutzer':'Inaktiv'})}${kitSelect({id:'user-'+u.id,label:'Rolle für '+u.name,value,options:options([['unmanaged','Nicht verwaltet'],['deny','Kein Zugriff'],...roles])},{user:u.id})}</div>`;
    }).join('');
    return section({id:'users',title:'Benutzer',content:feedback('Ein Konto erhält die gewählte Rolle. Administratoren behalten Vollzugriff.')+users})
      + section({id:'activation',title:'Prüfversion aktivieren',content:
        row({title:'Dashboard-Konfigurationen für zugeordnete Benutzer sperren',description:'Prüft direkte Lovelace-Konfigurationsanfragen. Geräte, Verlauf und andere HA-APIs bleiben außerhalb dieser Sperre.',trailing:toggle({label:'Dashboard-Konfigurationen sperren',action:'setting-change',iconOnly:true,checked:this.policy.native_dashboard_gate,disabled:!this.status.gate_available,data:{setting:'native_dashboard_gate'}})})
        +row({title:'Freigegebene Geräte über die Family-Access-API bedienen',description:'Ohne diese Option kann über diese API nur der virtuelle Testschalter geschaltet werden.',trailing:toggle({label:'Gerätebedienung freigeben',action:'setting-change',iconOnly:true,checked:this.policy.device_control,data:{setting:'device_control'}})})});
  }
  roleContent() {
    const role=this.policy.roles[this.roleId],add=button({label:'Rolle',icon:'add',action:'add-role',variant:'primary'});
    if(!role)return section({id:'roles',title:'Rollen',trailing:add,content:emptyState('Lege eine Rolle an, um Freigaben zu verwalten.')});
    const fields=`<div class="grid">${kitSelect({id:'role-select',label:'Rolle',value:this.roleId,options:options(Object.entries(this.policy.roles).map(([id,r])=>[id,r.name]))})}${field({id:'role-name',label:'Name',value:role.name,maxLength:80})}</div><div class="toolbar">${iconButton({icon:'trash',label:'Rolle entfernen',action:'delete-role',danger:true})}</div>`;
    const dashboards=this.snapshot.dashboards.map((d,i)=>row({title:d.name,description:d.id,trailing:kitSelect({id:'dashboard-'+i,label:'Berechtigung für '+d.name,value:role.dashboards[d.id]||'none',options:options(dashboardLevels)},{grant:d.id,section:'dashboards'},true)})).join('');
    return section({id:'roles',title:'Rollen',trailing:add,content:fields})
      +section({id:'dashboards',title:'Dashboards',content:feedback('„Bedienen“ benötigt zusätzlich Gerätefreigaben. „Bearbeiten“ wird vorgemerkt; die Freigabe des nativen Editors folgt später.')+(dashboards||emptyState('Keine Dashboards gefunden.'))})
      +section({id:'permissions',title:'Gerätefreigaben',content:feedback('Freigaben werden über Entitäten, Bereiche und Labels zusammengeführt. Die höhere Freigabe gilt; „Kein Zugriff“ entfernt hier nur den jeweiligen Eintrag.')+`<div class="grid">${kitSelect({id:'section-select',label:'Auswahl',value:this.section,options:options([['entities','Entitäten'],['areas','Bereiche'],['labels','Labels']])})}${field({id:'search',label:'Suchen',type:'search',placeholder:'Name oder ID',value:this.query})}</div><div id="resources">${this.resourceRows()}</div>`});
  }
  resourceRows() {
    const role=this.policy.roles[this.roleId];if(!role)return '';
    const q=this.query.toLowerCase(),list=(this.snapshot[this.section]||[]).filter(x=>(x.name+' '+x.id).toLowerCase().includes(q));
    list.sort((a,b)=>Boolean(role[this.section][b.id])-Boolean(role[this.section][a.id])||a.name.localeCompare(b.name));
    return list.slice(0,100).map((x,i)=>row({title:x.name,description:x.id,trailing:kitSelect({id:'grant-'+i,label:'Berechtigung für '+x.name,value:role[this.section][x.id]||'none',options:options(entityLevels)},{grant:x.id,section:this.section},true)})).join('')
      +(list.length>100?feedback('Bitte Suche eingrenzen; die ersten 100 Treffer werden angezeigt.'):!list.length?emptyState('Keine Treffer.'):'');
  }
  renderResourceRows() { const box=this.shadowRoot.getElementById('resources');if(box)box.innerHTML=this.resourceRows(); }
  testContent() {
    return section({id:'checks',title:'Zugriff prüfen',content:feedback('Diese Prüfung führt echte Anfragen mit dem angemeldeten HA-Konto aus. Der virtuelle Schalter bedient kein Gerät im Haus.')
      +`<div class="toolbar">${button({label:'HTTP und WebSocket prüfen',action:'api-check',variant:'primary'})}${button({label:'Testschalter anzeigen',action:'probe-read',disabled:!this.status.probe_entity_id})}${button({label:'Testschalter umschalten',action:'probe-toggle',disabled:!this.status.probe_entity_id})}</div>`
      +row({title:'Testentität',description:this.status.probe_entity_id||'Wird eingerichtet …'})
      +feedback(this.status.is_admin?'Administratoren haben Vollzugriff. Für Ablehnungstests ein separates Konto ohne Administratorrechte verwenden.':'Rollen: '+(this.status.roles.join(', ')||'Keine Freigabe'))
      +(this.output?textareaField({id:'test-result',label:'Ergebnis',value:JSON.stringify(this.output,null,2),rows:12}).replace('<textarea ','<textarea readonly '):'' )})
      +section({id:'allowed-dashboards',title:'Freigegebene Dashboards',content:this.status.dashboards.map(d=>row({title:d.name,trailing:button({label:'Konfiguration abrufen',action:'dashboard-read',data:{path:d.id}})})).join('')||emptyState('Keine Dashboards freigegeben.')});
  }
  scopeContent() {
    const facts=[['Eigene HTTP-/WebSocket-Anfragen','Rechteprüfung aktiv'],['Native Dashboard-Konfigurationen',this.status.native_dashboard_gate&&this.status.gate_available?'Sperre eingeschaltet':'Sperre ausgeschaltet'],['Allgemeine HA-Geräte-APIs','Noch nicht abgesichert'],['Bearbeiten als normaler Benutzer','Noch nicht freigeschaltet'],['Nabu Casa auf deiner Instanz','Vor Ort zu prüfen']];
    return section({id:'scope',title:'Umfang der Prüfversion',content:facts.map(([title,description])=>row({title,description})).join('')
      +helpContent({content:'<p>Vorhandene HA-Gruppen, Tokens und Netzwerkeinstellungen werden nicht verändert. Ausblenden in der Seitenleiste ist kein Bestandteil dieser Version. Beim Entfernen der Integration entfällt auch die optionale Dashboard-Sperre.</p><p>Die gleiche Entität hat innerhalb der Family-Access-API auf allen Dashboards dieselben Rechte. Automationen, Skripte, Kameras, Verlauf, Assist und Drittintegrationen sind noch nicht allgemein abgesichert.</p>'})
      +versionInfo({frontend:'0.2.0',backend:this.status.version,ui:UI_VERSION})})
      +(this.snapshot?section({id:'audit',title:'Letzte Zugriffsprüfungen',content:this.snapshot.events.slice(0,30).map(ev=>row({title:ev.operation,description:ev.target+' · '+new Date(ev.time).toLocaleString('de-DE'),trailing:statusBadge({label:ev.allowed?'Erlaubt':'Abgelehnt',state:ev.allowed?'success':'error',icon:ev.allowed?'success':'failure'})})).join('')||emptyState('Noch keine Prüfungen. Nach einem Test neu laden.')}):'');
  }
  render() {
    const admin=this.status?.is_admin&&this.snapshot;
    const items=admin?[{id:'users',label:'Benutzer'},{id:'roles',label:'Rollen'},{id:'test',label:'Prüfen'}]:[{id:'test',label:'Prüfen'}];
    const content=!this.status?loadingState():this.tab==='users'&&admin?this.userContent():this.tab==='roles'&&admin?this.roleContent():this.tab==='scope'?this.scopeContent():this.testContent();
    this.shadowRoot.innerHTML=`<style>${UI_CSS}</style><div class="ui-card">${panelHeader({title:'Family Access',dirty:this.dirty,busy:this.busy,save:Boolean(admin)})}${this.status?navigation({label:'Family Access',items,active:this.tab==='scope'?'settings':this.tab,settingsLabel:'Umfang',help:false}):''}<main>${feedback('Technische Prüfversion. Eigene Funktionen prüfen Rechte im Backend. Allgemeine Home-Assistant-APIs sind noch nicht abgesichert.',{kind:'warning'})}${this.error?feedback(this.error,{kind:'error'}):''}${this.notice?feedback(this.notice,{kind:'success'}):''}${content}</main></div>${confirmDialog({id:'discard-dialog',title:'Änderungen verwerfen?',message:'Ungespeicherte Änderungen verwerfen und Rechte neu laden?',confirmLabel:'Verwerfen und neu laden',confirmAction:'confirm-reload',cancelAction:'cancel-reload',danger:true})}`;
  }
}
if(!customElements.get('family-access-panel'))customElements.define('family-access-panel',FamilyAccessPanel);
