// DOM behavior test. This does not claim browser layout or a live HA frontend test.
const {parseHTML}=require('linkedom');
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const {window}=parseHTML('<html><body><family-access-panel></family-access-panel></body></html>');
const context=vm.createContext({window,document:window.document,HTMLElement:window.HTMLElement,customElements:window.customElements,CustomEvent:window.CustomEvent,Event:window.Event,structuredClone,console,location:{origin:'https://example.ui.nabu.casa',hostname:'example.ui.nabu.casa'},confirm:()=>true});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../custom_components/family_access_manager/frontend/panel.js'),'utf8'),context);
const panel=window.document.querySelector('family-access-panel');
const policy={revision:0,native_dashboard_gate:false,device_control:false,roles:{family:{name:'Kinder',dashboards:{'dashboard-paul':'view'},entities:{},areas:{},labels:{}}},bindings:{paul:['family']}};
const status={is_admin:true,roles:[],gate_available:true,native_dashboard_gate:false,device_control:false,version:'0.1.0',probe_entity_id:'switch.probe',dashboards:[{id:'dashboard-paul',name:'Paul'}],instance_id:'test'};
const snapshot={policy,users:[{id:'manuel',name:'Manuel',admin:true,active:true},{id:'paul',name:'Paul',admin:false,active:true}],dashboards:[{id:'dashboard-paul',name:'Paul'}],entities:[{id:'switch.probe',name:'Testschalter'},{id:'light.paul',name:'<img src=x onerror=alert(1)>'}],areas:[],labels:[],events:[]};
let saves=0;
const settle=()=>new Promise(setImmediate);
const click=(selector)=>{const el=panel.shadowRoot.querySelector(selector);assert(el,selector);el.click();};
(async()=>{
  panel.hass={user:{id:'manuel'},callWS:async msg=>{
    if(msg.action==='status')return structuredClone(status);
    if(msg.action==='admin_snapshot')return structuredClone(snapshot);
    if(msg.action==='save_policy'){saves++;snapshot.policy=structuredClone(msg.payload);return {revision:1};}
    throw Error('unexpected action');
  },callApi:async()=>({result:status})};
  await settle();
  assert(panel.shadowRoot.innerHTML.includes('Benutzer'));
  click('[data-tab="roles"]');
  assert.equal(panel.shadowRoot.querySelectorAll('img').length,0,'Entity names must be escaped');
  const select=panel.shadowRoot.querySelector('[data-grant="switch.probe"]');
  for(const option of select.querySelectorAll('option')) option.selected=option.value==='control';
  select.dispatchEvent(new window.Event('change',{bubbles:true}));
  assert.equal(panel.policy.roles.family.entities['switch.probe'],'control');
  assert(!panel.shadowRoot.querySelector('[data-action="save"]').disabled);
  click('[data-action="save"]');await settle();
  assert.equal(saves,1);
  assert.equal(snapshot.policy.roles.family.entities['switch.probe'],'control');
  click('[data-tab="test"]');click('[data-action="api-check"]');await settle();
  assert(panel.shadowRoot.innerHTML.includes('Dieselbe Prüfinstanz erreicht'));
  status.is_admin=false;
  panel.hass={user:{id:'paul'},callWS:async msg=>structuredClone(status)};await settle();
  assert.equal(panel.shadowRoot.querySelector('[data-tab="users"]'),null);
  assert.equal(panel.shadowRoot.querySelector('[data-action="save"]'),null);
  console.log(JSON.stringify({admin_view:true,role_save:true,html_escaping:true,transport_check:true,child_admin_controls_hidden:true,browser_layout_verified:false}));
})().catch(err=>{console.error(err);process.exitCode=1});
