import {UI_CSS, UI_VERSION, escapeHtml as esc, panelHeader, navigation, section, row, button, iconButton, field, selectField, toggle, feedback, emptyState, loadingState, versionInfo, statusBadge, helpContent, confirmDialog, dialog, multiSelect, textareaField, userAccessRow, bindUI} from './family-ui/1.6.0/family-ui.js';
const options = values => values.map(([value,label]) => ({value,label}));
const kitSelect = (props,data={},inline=false) => {
  const attrs=Object.entries(data).map(([key,value])=>` data-${key}="${esc(value)}"`).join('');
  const html=selectField({...props,hideLabel:inline}).replace('<select ',`<select${attrs} `);
  return html;
};


class FamilyAccessPanel extends HTMLElement {
  constructor() {
    super(); this.attachShadow({mode:"open"}); this.tab="users"; this.errorLog=[];
    this.roleId="family"; this.query=""; this.dirty=false; this.busy=false;

    this.shadowRoot.addEventListener("change", (e) => this.change(e));
    this.shadowRoot.addEventListener("input", (e) => {
      if (e.target.id === "search") { this.query=e.target.value; this.renderDashboardRows(); }
    });
  }
  connectedCallback() {
    this.unbind ||= bindUI(this.shadowRoot, event => {
      if (event.action === 'navigate') { this.tab=event.data.page==='settings'?'scope':event.data.page; this.render(); return; }
      if (event.action === 'dashboard-grant') {
        const role=this.policy.roles[this.roleId],path=event.data.path;
        if(event.checked)role.dashboards[path]='view';else delete role.dashboards[path];
        event.element.classList.toggle('on',event.checked);event.element.setAttribute('aria-checked',String(event.checked));
        this.markDirty();
        this.renderDashboardRows({expandUnchosen:!event.checked});
        [...this.shadowRoot.querySelectorAll('[data-action="dashboard-grant"]')].find(el=>el.dataset.path===path)?.focus();return;
      }
      if (event.action === 'user-activation') {
        const uid=event.data.user;
        if(event.checked) {
          this.policy.bindings[uid] ||= [];
          if(!this.policy.enabled_users.includes(uid))this.policy.enabled_users.push(uid);
        } else this.policy.enabled_users=this.policy.enabled_users.filter(id=>id!==uid);
        event.element.classList.toggle('on',event.checked);
        event.element.setAttribute('aria-checked',String(event.checked));
        const user=this.snapshot.users.find(u=>u.id===uid);
        event.element.closest('.setting-row').querySelector('.row-text small').textContent=this.userDescription(user);
        this.markDirty(); return;
      }
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
    if (who && this.who !== who) { this.who=who; this.status=null; this.snapshot=null; this.policy=null; this.errorLog=[]; this.output=null; this.notice=""; this.accessDenied=false; this.reload(); }
  }
  set narrow(value) { this.toggleAttribute("narrow", value); }
  set panel(value) { this._panel=value; }
  async api(action,payload={}) { return this._hass.callWS({type:"family_access_manager/request",action,payload}); }
  async reload() {
    if (!this._hass || this.busy) return;
    this.busy=true;
    try {
      this.status=await this.api("admin_panel_status");
      if (this.status.is_admin) {
        this.snapshot=await this.api("admin_snapshot"); this.policy=structuredClone(this.snapshot.policy);
        this.errorLog=structuredClone(this.snapshot.error_log||[]);
        if (!this.policy.roles[this.roleId]) this.roleId=Object.keys(this.policy.roles)[0] || "";
      } else this.tab="test";
      this.dirty=false; this.error="";
    } catch(e) { if(e.code==="unauthorized")this.denyAccess();else this.error=e.message || String(e); }
    finally { this.busy=false; this.render(); }
  }
  denyAccess() {
    this.accessDenied=true; this.status={is_admin:false}; this.snapshot=null; this.policy=null; this.errorLog=[]; this.output=null; this.notice=""; this.dirty=false;
  }
  markDirty() {
    this.dirty=true;
    const save=this.shadowRoot.querySelector('[data-action="save"]');
    if(save) { save.disabled=false; save.querySelector("span").textContent="Änderungen speichern"; }
  }
  async click(e) {
    const control=e.target.closest("button"); if(!control || control.disabled) return;
    if(control.dataset.tab) { this.tab=control.dataset.tab; this.render(); return; }
    const action=control.dataset.action;
    try {
      if(action === "menu") { this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:true,composed:true})); return; }
      if(action === "reload") { if(this.dirty) { this.shadowRoot.getElementById("discard-dialog").showModal(); return; } await this.reload(); return; }
      if(action === "confirm-reload") { this.shadowRoot.getElementById("discard-dialog").close(); await this.reload(); return; }
      if(action === "save") {
        control.disabled=true; await this.api("save_policy",this.policy); await this.reload(); this.notice="Rechte gespeichert."; this.render(); return;
      }
      if(action === "add-role") {
        const id="role_"+Date.now(); this.policy.roles[id]={name:"Neue Rolle",dashboard_order:[],dashboards:{},entities:{},areas:{},labels:{}};
        this.roleId=id; this.dirty=true; this.tab="roles"; this.render(); return;
      }
      if(action === "rename-role") {
        this.showModal('rename-dialog','Rolle umbenennen',field({id:'rename-name',label:'Neuer Name',value:this.policy.roles[this.roleId].name,maxLength:80}),button({label:'Übernehmen',action:'confirm-rename',variant:'primary'}));return;
      }
      if(action === "confirm-rename") {
        const name=this.shadowRoot.getElementById('rename-name').value.trim();
        if(!name||name.length>80)throw Error('Bitte einen Namen mit 1–80 Zeichen eingeben.');
        this.policy.roles[this.roleId].name=name;this.closeModal();this.markDirty();this.render();return;
      }
      if(action === "move-dashboard") {
        const list=this.selectedDashboards().map(d=>d.id),index=list.indexOf(control.dataset.path),next=index+Number(control.dataset.direction);
        if(this.query||index<0||next<0||next>=list.length)return;
        [list[index],list[next]]=[list[next],list[index]];this.policy.roles[this.roleId].dashboard_order=list;this.markDirty();this.renderDashboardRows();
        [...this.shadowRoot.querySelectorAll('[data-action="move-dashboard"]')].find(el=>el.dataset.path===control.dataset.path&&el.dataset.direction===control.dataset.direction&&!el.disabled)?.focus();return;
      }
      if(action === "apply-order") {
        const users=this.snapshot.users;
        this.showModal('order-dialog','Reihenfolge übernehmen',feedback(this.dirty?'Dabei werden alle vorbereiteten Rollen- und Rechteänderungen gespeichert.':'Übernimmt nur die Reihenfolge. Rollen, Freigaben, Aktivierung, ausgeblendete Einträge und Startseiten bleiben erhalten.')+multiSelect({id:'order-users',label:'Benutzer',searchLabel:'Benutzer suchen',items:users.map(u=>({value:u.id,label:u.name,description:u.admin?'Administrator':''})),values:users.filter(u=>this.policy.bindings[u.id]?.includes(this.roleId)).map(u=>u.id)}),button({label:this.dirty?'Speichern und übernehmen':'Übernehmen',action:'confirm-order',variant:'primary'}));return;
      }
      if(action === "confirm-order") {
        const ids=this.checkedValues('order-users');if(!ids.length)throw Error('Bitte mindestens einen Benutzer auswählen.');
        control.disabled=true;
        if(this.dirty){const saved=await this.api('save_policy',this.policy);this.policy=saved.policy?structuredClone(saved.policy):{...this.policy,revision:saved.revision};this.dirty=false;}
        const result=await this.api('apply_dashboard_order',{role_id:this.roleId,user_ids:ids,revision:this.policy.revision});
        this.closeModal();this.notice=`Reihenfolge für ${result.applied.length} Benutzer übernommen.`;
        this.error=result.failed.length?'Nicht übernommen für: '+result.failed.map(id=>this.snapshot.users.find(u=>u.id===id)?.name||id).join(', ')+'. Details im Fehlerprotokoll.':'';
        this.render();return;
      }
      if(action === "admin-sidebar") {
        control.disabled=true;this.adminSidebar=await this.api('admin_sidebar',{user_id:control.dataset.user});control.disabled=false;
        const data=this.adminSidebar,user=this.snapshot.users.find(u=>u.id===data.user_id);
        const defaults=this.snapshot.dashboards.map(d=>({value:d.id,label:d.name}));
        if(!defaults.some(d=>d.value===data.default_panel))defaults.unshift({value:data.default_panel,label:data.default_panel==='home'?'HA-Startseite':data.default_panel});
        if(!defaults.some(d=>d.value==='profile'))defaults.push({value:'profile',label:'Eigenes Profil'});
        this.showModal('admin-sidebar-dialog','Dashboards für '+user.name,feedback('Nur die Seitenleiste dieses Administrators wird angepasst. Der volle Zugriff bleibt erhalten. Die gewählte Startseite muss sichtbar bleiben.')+multiSelect({id:'admin-dashboards',label:'Sichtbare Dashboards',searchLabel:'Dashboards suchen',items:this.snapshot.dashboards.map(d=>({value:d.id,label:d.name,description:d.id})),values:data.visible_dashboards})+kitSelect({id:'admin-default',label:'Startseite',value:data.default_panel,options:defaults}),button({label:'Seitenleiste speichern',action:'confirm-admin-sidebar',variant:'primary'}));return;
      }
      if(action === "confirm-admin-sidebar") {
        const visible=this.checkedValues('admin-dashboards'),defaultPanel=this.shadowRoot.getElementById('admin-default').value;
        if(this.snapshot.dashboards.some(d=>d.id===defaultPanel)&&!visible.includes(defaultPanel))throw Error('Die Startseite muss sichtbar bleiben. Bitte eine andere Startseite wählen.');
        control.disabled=true;
        await this.api('save_admin_sidebar',{user_id:this.adminSidebar.user_id,token:this.adminSidebar.token,visible_dashboards:visible,default_panel:defaultPanel});
        this.closeModal();this.notice='Admin-Seitenleiste gespeichert.';this.error='';this.render();return;
      }
      if(action === "close-modal"){this.closeModal();return;}
      if(action === "delete-role") {
        if(Object.values(this.policy.bindings).some(r=>r.includes(this.roleId))) throw Error("Diese Rolle ist noch einem Benutzer zugewiesen.");
        delete this.policy.roles[this.roleId]; this.roleId=Object.keys(this.policy.roles)[0] || ""; this.dirty=true; this.render(); return;
      }
      if(action === "refresh-errors") {
        control.disabled=true;
        const result=await this.api("admin_error_log"); this.errorLog=result.events;
        this.error=""; this.render(); return;
      }
      if(action === "dashboard-read") {
        this.output=await this.api("read_dashboard",{url_path:control.dataset.path}); this.error=""; this.render(); return;
      }
      if(action === "api-check") {
        const ws=await this.api("status");
        const rest=await this._hass.callApi("POST","family_access_manager/request",{action:"status",payload:{}});
        const same=ws.instance_id === rest.result.instance_id;
        this.output={"WebSocket und HTTP":same ? "Dieselbe Prüfinstanz erreicht" : "Abweichung erkannt", "Aufrufadresse":location.origin,"Cloudzugriff":location.hostname.endsWith(".ui.nabu.casa")?"Von der Nabu-Casa-Adresse aufgerufen":"Für die Cloudprüfung auch von der Nabu-Casa-Adresse ausführen", "Prüfumfang":"Dashboardfreigaben"};
        this.error=""; this.render(); return;
      }
    } catch(err) {
      control.disabled=false;
      if(err.code==='unauthorized'){this.denyAccess();this.render();return;}
      const modal=this.shadowRoot.querySelector('#modal-host dialog[open]');
      if(modal){modal.querySelector('#modal-error').innerHTML=feedback(err.message||String(err),{kind:'error'});return;}
      this.error=err.message||String(err);this.render();
    }
  }
  change(e) {
    const el=e.target;
    if(el.id === "role-select") { this.roleId=el.value; this.query=""; this.render(); return; }
    if(el.dataset.user) {
      this.policy.bindings[el.dataset.user]=el.value === "deny"?[]:[el.value];
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
  userDescription(user) {
    return !user.active?'HA-Konto inaktiv':this.policy.enabled_users.includes(user.id)?'Eingeschränkt':'HA-Standardzugriff';
  }
  userContent() {
    const roles=Object.entries(this.policy.roles).map(([value,r])=>({value,label:r.name}));
    const users=this.snapshot.users.map(u=>u.admin?row({title:u.name,description:'Administrator',trailing:statusBadge({label:'Vollzugriff',state:'neutral',icon:'lock'})+iconButton({icon:'edit',label:'Dashboards für '+u.name,action:'admin-sidebar',data:{user:u.id}})}):userAccessRow({id:u.id,title:u.name,description:u.admin?'Administrator':this.userDescription(u),admin:u.admin,value:this.policy.bindings[u.id]?.[0]||'deny',options:[{value:'deny',label:'Keine Rolle'},...roles],enabled:this.policy.enabled_users.includes(u.id),toggleAction:'user-activation',toggleLabel:'Family Access für '+u.name})).join('');
    return section({id:'users',title:'Benutzer',content:feedback('Aktivierte Benutzer sehen die Dashboards ihrer Rolle.')+users});
  }
  showModal(id,title,content,actions) {
    this.shadowRoot.getElementById('modal-host').innerHTML=dialog({id,title,content:'<div id="modal-error"></div>'+content,actions:button({label:'Abbrechen',action:'close-modal'})+actions});
    this.shadowRoot.getElementById(id).showModal();
  }
  closeModal(){this.shadowRoot.querySelector('#modal-host dialog[open]')?.close();}
  checkedValues(id){return [...this.shadowRoot.getElementById(id).querySelectorAll('input[type="checkbox"]:checked')].map(el=>el.value);}
  orderedDashboards(){
    const role=this.policy.roles[this.roleId],byId=new Map(this.snapshot.dashboards.map(d=>[d.id,d]));
    const saved=(role?.dashboard_order||[]).filter(id=>byId.has(id));
    return [...saved.map(id=>byId.get(id)),...this.snapshot.dashboards.filter(d=>!saved.includes(d.id))];
  }
  selectedDashboards(){return this.orderedDashboards().filter(d=>['view','control','edit'].includes(this.policy.roles[this.roleId].dashboards[d.id]));}
  roleContent() {
    const role=this.policy.roles[this.roleId],add=button({label:'Rolle',icon:'add',action:'add-role',variant:'primary'});
    if(!role)return section({id:'roles',title:'Rollen',trailing:add,content:emptyState('Lege eine Rolle an, um Freigaben zu verwalten.')});
    const fields=kitSelect({id:'role-select',label:'Rolle',value:this.roleId,options:options(Object.entries(this.policy.roles).map(([id,r])=>[id,r.name]))})+`<div class="toolbar">${iconButton({icon:'edit',label:'Rolle umbenennen',action:'rename-role'})}${iconButton({icon:'trash',label:'Rolle entfernen',action:'delete-role',danger:true})}</div>`;
    return section({id:'roles',title:'Rollen',trailing:add,content:fields})
      +section({id:'dashboards',title:'Dashboards',content:feedback('Gewählte Dashboards mit den Pfeilen sortieren. Weitere Dashboards stehen unter „Nicht gewählt“. Die Reihenfolge lässt sich auf ausgewählte Benutzer übernehmen.')+`<div class="toolbar">${button({label:'Reihenfolge übernehmen',action:'apply-order',icon:'copy',disabled:!this.selectedDashboards().length})}</div>`+field({id:'search',label:'Dashboards suchen',type:'search',placeholder:'Name oder Pfad',value:this.query})+`<div id="dashboard-rows">${this.dashboardRows()}</div>`});
  }
  dashboardRows() {
    const role=this.policy.roles[this.roleId];if(!role)return '';
    const q=this.query.toLowerCase(),all=this.selectedDashboards(),ids=new Set(all.map(d=>d.id));
    const matches=x=>(x.name+' '+x.id).toLowerCase().includes(q);
    const chosen=all.filter(matches),unchosen=this.snapshot.dashboards.filter(d=>!ids.has(d.id)&&matches(d)).sort((a,b)=>a.name.localeCompare(b.name,'de'));
    const renderRow=(x,selected)=>{
      const i=all.findIndex(d=>d.id===x.id);
      const arrows=selected?iconButton({icon:'up',label:x.name+' nach oben',action:'move-dashboard',disabled:Boolean(q)||i===0,data:{path:x.id,direction:-1}})+iconButton({icon:'down',label:x.name+' nach unten',action:'move-dashboard',disabled:Boolean(q)||i===all.length-1,data:{path:x.id,direction:1}}):'';
      return row({title:x.name,description:x.id,trailing:arrows+toggle({label:'Dashboard '+x.name+' freigeben',action:'dashboard-grant',checked:selected,iconOnly:true,data:{path:x.id}})});
    };
    return (q?feedback('Zum Sortieren die Suche leeren.'):'')+chosen.map(x=>renderRow(x,true)).join('')
      +(!chosen.length?emptyState(q?'Keine gewählten Dashboards gefunden.':'Noch keine Dashboards gewählt.'):'')
      +(unchosen.length?section({id:'unchosen-dashboards',title:'Nicht gewählt',expanded:Boolean(q)||Boolean(this.unchosenExpanded??true),content:unchosen.map(x=>renderRow(x,false)).join('')}):'');
  }
  renderDashboardRows({expandUnchosen=false}={}) {
    const box=this.shadowRoot.getElementById('dashboard-rows');
    if(box){const old=this.shadowRoot.getElementById('unchosen-dashboards-content');if(old&&!this.query)this.unchosenExpanded=!old.hidden;if(expandUnchosen)this.unchosenExpanded=true;box.innerHTML=this.dashboardRows();}
  }
  testContent() {
    return section({id:'checks',title:'Zugriff prüfen',content:feedback('Diese Prüfung führt echte Dashboard-Anfragen mit dem angemeldeten HA-Konto aus.')
      +`<div class="toolbar">${button({label:'HTTP und WebSocket prüfen',action:'api-check',variant:'primary'})}</div>`
      +feedback(this.status.is_admin?'Administratoren haben Vollzugriff. Für Ablehnungstests ein separates Konto ohne Administratorrechte verwenden.':this.status.managed?'Family Access aktiv · Rollen: '+(this.status.roles.join(', ')||'Keine Freigabe'):'Family Access ist für dieses Konto ausgeschaltet. Der native HA-Zugriff bleibt unverändert.')
      +(this.output?textareaField({id:'test-result',label:'Ergebnis',value:JSON.stringify(this.output,null,2),rows:12}).replace('<textarea ','<textarea readonly '):'' )})
      +section({id:'allowed-dashboards',title:'Freigegebene Dashboards',content:this.status.dashboards.map(d=>row({title:d.name,trailing:button({label:'Konfiguration abrufen',action:'dashboard-read',data:{path:d.id}})})).join('')||emptyState('Keine Dashboards freigegeben.')});
  }
  errorContent() {
    const entries=this.errorLog.map(ev=>row({title:(ev.user_name||ev.user_id)+' · '+ev.operation,description:[new Date(ev.time).toLocaleString('de-DE'),ev.target,ev.reason,ev.source].join(' · '),trailing:statusBadge({label:ev.kind==='denied'?'Abgelehnt':'Prüffehler',state:'error',icon:'failure'})})).join('');
    return section({id:'permission-errors',title:'Fehlerprotokoll',trailing:button({label:'Aktualisieren',action:'refresh-errors'}),content:feedback('Die letzten 200 fehlgeschlagenen Prüfungen bleiben über Neustarts erhalten. Nur Administratoren können das Protokoll einsehen. Anmeldeinformationen und Anfrageinhalte werden nicht gespeichert.')+(entries||emptyState('Keine Berechtigungsfehler protokolliert.'))});
  }
  scopeContent() {
    const facts=[['Dashboardfreigaben','Rollen und Benutzeraktivierung'],['Seitenleiste',this.status.sidebar_filter?'Nach Rollen gefiltert':this.status.sidebar_available?'Für aktivierte Benutzer gefiltert':'Nicht verfügbar'],['Native Dashboard-Konfigurationen',this.status.native_dashboard_gate&&this.status.gate_available?'Sperre eingeschaltet':'Sperre ausgeschaltet'],['Geräte- und Systemrechte','Durch Home Assistant verwaltet'],['Nabu Casa auf deiner Instanz','Vor Ort zu prüfen']];
    return section({id:'activation',title:'Zugriffsschutz',content:row({title:'Dashboard-Konfigurationen sperren',description:'Blockiert nicht freigegebene Dashboard-Konfigurationen für aktivierte Benutzer.',trailing:toggle({label:'Dashboard-Konfigurationen sperren',action:'setting-change',iconOnly:true,checked:this.policy.native_dashboard_gate,disabled:!this.status.gate_available,data:{setting:'native_dashboard_gate'}})})})
      +section({id:'diagnosis',title:'Diagnose',expanded:Boolean(this.output),content:this.testContent()})
      +section({id:'scope',title:'Hinweise',expanded:false,content:facts.map(([title,description])=>row({title,description})).join('')
      +helpContent({content:'<p>Family Access verwaltet Dashboardzugriff und Navigation. Freigegebene Dashboards benötigen keine zusätzlichen Gerätefreigaben. Vorhandene HA-Benutzerrechte, Gruppen, Tokens und Netzwerkeinstellungen bleiben bestehen.</p><p>Die zusätzliche Dashboard-Sperre schützt neue Konfigurationsanfragen. Bereits geladene Inhalte lassen sich nicht zurückholen. Profil und feste Konto-/Benachrichtigungselemente bleiben erreichbar. Beim Entfernen der Integration entfällt die Filterung.</p>'})
      +versionInfo({frontend:'1.0.0',backend:this.status.version,ui:UI_VERSION})})
      +(this.snapshot?section({id:'audit',title:'Letzte Zugriffsprüfungen',expanded:false,content:this.snapshot.events.slice(0,30).map(ev=>row({title:ev.operation,description:ev.target+' · '+new Date(ev.time).toLocaleString('de-DE'),trailing:statusBadge({label:ev.allowed?'Erlaubt':'Abgelehnt',state:ev.allowed?'success':'error',icon:ev.allowed?'success':'failure'})})).join('')||emptyState('Noch keine Prüfungen. Nach einem Test neu laden.')}):'');
  }
  render() {
    const styles=`<style>${UI_CSS}</style>`;
    if(this.accessDenied||this.status?.is_admin===false||(this._hass?.user?.is_admin===false&&!this._hass.user.is_owner)) {
      this.shadowRoot.innerHTML=`${styles}${feedback('Family Access ist nur für Administratoren verfügbar.',{kind:'error'})}`;return;
    }
    const admin=this.status?.is_admin&&this.snapshot;
    const items=admin?[{id:'users',label:'Benutzer'},{id:'roles',label:'Rollen'},{id:'errors',label:'Fehler'}]:[{id:'test',label:'Prüfen'}];
    const content=!this.status?loadingState():this.tab==='users'&&admin?this.userContent():this.tab==='roles'&&admin?this.roleContent():this.tab==='errors'&&admin?this.errorContent():this.tab==='scope'?this.scopeContent():this.testContent();
    this.shadowRoot.innerHTML=`${styles}<div class="ui-card">${panelHeader({title:'Family Access',dirty:this.dirty,busy:this.busy,save:Boolean(admin)})}${this.status?navigation({label:'Family Access',items,active:this.tab==='scope'?'settings':this.tab,settingsLabel:'Einstellungen',help:false}):''}<main>${this.error?feedback(this.error,{kind:'error'}):''}${this.notice?feedback(this.notice,{kind:'success'}):''}${content}</main></div><div id="modal-host"></div>${confirmDialog({id:'discard-dialog',title:'Änderungen verwerfen?',message:'Ungespeicherte Änderungen verwerfen und Rechte neu laden?',confirmLabel:'Verwerfen und neu laden',confirmAction:'confirm-reload',cancelAction:'cancel-reload',danger:true})}`;
  }
}
if(!customElements.get('family-access-panel'))customElements.define('family-access-panel',FamilyAccessPanel);
