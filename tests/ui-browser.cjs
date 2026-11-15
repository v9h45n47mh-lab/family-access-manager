const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),frontend='/custom_components/family_access_manager/frontend/';
const fixture=`<!doctype html><html lang="de"><head><meta charset="utf-8"><style>body{margin:0;--primary-color:#03a9f4;--primary-text-color:#212121;--secondary-text-color:#727272;--card-background-color:#fff;--ha-card-background:#fff;--primary-background-color:#fafafa;--secondary-background-color:#f5f5f5;--divider-color:#e0e0e0;--ha-font-family-body:Arial,sans-serif;background:var(--primary-background-color)}body.dark{--primary-text-color:#e1e1e1;--secondary-text-color:#9b9b9b;--card-background-color:#1c1c1c;--ha-card-background:#1c1c1c;--primary-background-color:#111;--secondary-background-color:#282828;--divider-color:#424242}</style></head><body><script type="module">
import '${frontend}panel.js';
const policy={revision:0,native_dashboard_gate:false,device_control:false,roles:{family:{name:'Maximilian',dashboard_order:[],dashboards:{'dashboard-paul':'view'},entities:{'switch.probe':'view'},areas:{},labels:{}}},bindings:{paul:['family'],test:['family']},enabled_users:['paul','test']};
const snapshot={policy,users:[{id:'manuel',name:'Manuel',admin:true,active:true},{id:'paul',name:'Paul',admin:false,active:true},{id:'max',name:'Maximilian',admin:false,active:true},{id:'vera',name:'Vera',admin:true,active:true},{id:'test',name:'Test',admin:false,active:true}],dashboards:[{id:'dashboard-paul',name:'Paul'},{id:'dashboard-parents',name:'Eltern'}],entities:[{id:'switch.probe',name:'Testschalter'},{id:'light.paul',name:'Licht Paul'},{id:'light.very_long_entity_name_for_testing',name:'LangeEntitätsbezeichnungOhneLeerzeichenDieAufDemHandyUmgebrochenWerdenMuss'},{id:'light.escape',name:'<img src=x onerror=alert(1)>'}],areas:[{id:'paul',name:'Paul'}],labels:[{id:'paul',name:'Paul'}],events:[{operation:'entity/view',target:'switch.probe',allowed:true,time:'2026-11-10T10:00:00Z'}]};
snapshot.dashboards.push({id:'dashboard-long-name',name:'LangeDashboardbezeichnungOhneLeerzeichenDieAufDemHandyUmgebrochenWerdenMuss'},{id:'dashboard-unsafe',name:'<img src=x onerror=alert(1)>'});
snapshot.error_log=[{time:'2026-11-15T10:00:00Z',user_id:'paul',user_name:'Paul',operation:'read_dashboard',target:'dashboard-parents',reason:'Die Rolle enthält keine Freigabe für dieses Dashboard.',source:'websocket',kind:'denied'}];
snapshot.error_log.push({...snapshot.error_log[0],user_name:'<img src=x onerror=alert(1)>',reason:'<img src=x onerror=alert(1)> Lange Diagnose für einen sicheren Umbruch auf Mobilgeräten'});
const status={is_admin:true,sidebar_available:true,sidebar_filter:false,roles:[],gate_available:true,native_dashboard_gate:false,device_control:false,version:'1.0.0',probe_entity_id:'switch.probe',dashboards:snapshot.dashboards,instance_id:'fixture'};
window.fixture={snapshot,status,saves:[],calls:[],state:'off'};
const hass={user:{id:'manuel'},callWS:async msg=>{window.fixture.calls.push(msg.action);if(msg.action==='admin_panel_status'){if(!status.is_admin)throw Object.assign(new Error('Nur Administratoren'),{code:'unauthorized'});return structuredClone(status);}if(msg.action==='status')return structuredClone(status);if(msg.action==='admin_snapshot'){if(!status.is_admin)throw Error('Nicht freigegeben');return structuredClone(snapshot);}if(msg.action==='admin_sidebar')return {user_id:msg.payload.user_id,token:'fixture-token',visible_dashboards:snapshot.dashboards.map(d=>d.id),default_panel:'dashboard-paul'};if(msg.action==='save_admin_sidebar'){window.fixture.adminSave=structuredClone(msg.payload);return msg.payload;}if(msg.action==='apply_dashboard_order'){window.fixture.orderApply=structuredClone(msg.payload);return {applied:msg.payload.user_ids,failed:[]};}if(msg.action==='save_policy'){if(!status.is_admin)throw Error('Nicht freigegeben');snapshot.policy=structuredClone(msg.payload);snapshot.policy.revision++;window.fixture.saves.push(structuredClone(msg.payload));for(const u of snapshot.users.filter(u=>u.admin)){delete snapshot.policy.bindings[u.id];snapshot.policy.enabled_users=snapshot.policy.enabled_users.filter(id=>id!==u.id);}return {revision:snapshot.policy.revision,policy:structuredClone(snapshot.policy)};}if(msg.action==='read_entity')return {state:window.fixture.state};if(msg.action==='call_service'){if(!status.is_admin)throw Error('Nicht freigegeben');window.fixture.state=window.fixture.state==='off'?'on':'off';return {executed:true};}if(msg.action==='admin_error_log'){if(!status.is_admin)throw Error('Nicht freigegeben');return {events:structuredClone(snapshot.error_log),limit:200};}if(msg.action==='read_dashboard'){if(!status.is_admin)throw Error('Nicht freigegeben');return {views:[]};}throw Error('Unknown action');},callApi:async()=>({result:structuredClone(status)})};
window.fixture.hass=hass;const app=document.createElement('family-access-panel');document.body.append(app);app.hass=hass;window.app=app;
</script></body></html>`;
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');if(url.pathname==='/'){res.setHeader('Content-Type','text/html');res.end(fixture);return;}
 const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.png')?'image/png':'text/plain');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1100,height:1000}}),errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);
 fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
 try{
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  const app=page.locator('family-access-panel');await app.locator('.card-top').getByRole('button',{name:'Benutzer',exact:true}).waitFor();
  const pages=[['users','Benutzer'],['roles','Rollen'],['errors','Fehler'],['settings','Einstellungen']];
  for(const width of [1100,430,390,375,320])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:1000});await page.evaluate(dark=>document.body.classList.toggle('dark',dark),theme==='dark');
   for(const [id,label] of pages){
    await app.locator('.card-top').getByRole('button',{name:label,exact:true}).click();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No document overflow: '+[width,theme,id]);
    const bad=await app.evaluate(el=>[...el.shadowRoot.querySelectorAll('.setting-row,.grid,.card-top,.fui-panel-header')].filter(n=>n.scrollWidth>n.clientWidth+1).map(n=>[n.className,n.scrollWidth,n.clientWidth]));
    assert.deepEqual(bad,[],'No control overflow: '+[width,theme,id]);
    const compared=await page.evaluate(async({base,id})=>{
     const kit=await import(base+'family-ui/1.6.0/family-ui.js'),ref=document.createElement('div');ref.attachShadow({mode:'open'});document.body.append(ref);
     ref.shadowRoot.innerHTML='<style>'+kit.UI_CSS+'</style><div class="ui-card">'+kit.panelHeader({title:'Family Access'})+kit.navigation({label:'Family Access',items:[{id:'users',label:'Benutzer'},{id:'roles',label:'Rollen'},{id:'errors',label:'Fehler'}],active:id,help:false,settingsLabel:'Einstellungen'})+'<main>'+kit.section({id:'ref',title:'Benutzer',content:kit.row({title:'Paul',description:'Benutzer',trailing:kit.toggle({label:'Schalter',action:'noop',checked:document.querySelector('family-access-panel').shadowRoot.querySelector('[role="switch"]')?.getAttribute('aria-checked')==='true'})})+kit.selectField({id:'ref-select',label:'Rolle',value:'none',options:[{value:'none',label:'Kein Zugriff'}]})})+'<div id="user-reference">'+kit.userAccessRow({id:'reference',title:'Paul',description:'Eingeschränkt',value:'family',options:[{value:'family',label:'Maximilian'}],enabled:true})+kit.row({title:'Next'})+'</div></main></div>';
     const actual=document.querySelector('family-access-panel').shadowRoot,pairs=[['.fui-panel-header',['padding','gap','minHeight','backgroundColor']],['.fui-panel-header strong',['fontFamily','fontSize','fontWeight']],['nav button',['padding','fontSize','fontWeight','color']],['main',['padding']],['.settings-fold span',['fontSize','fontWeight']],['.row-text strong',['fontSize','fontWeight','lineHeight']],['.row-text small',['fontSize','color']],['select',['padding','borderRadius','fontSize','color','backgroundColor']],['.switch-track',['width','height','backgroundColor']],['.switch-thumb',['width','height']],['button.primary',['backgroundColor','color','borderRadius','padding','fontSize']]];
     const user=actual.querySelector('[data-access-user="paul"]'),userRef=ref.shadowRoot.querySelector('[data-access-user="reference"]');
     if(user&&userRef){const keys=['display','gridTemplateColumns','gap','padding','borderBottomWidth'];const a=getComputedStyle(user),b=getComputedStyle(userRef);window.userComparison={actual:Object.fromEntries(keys.map(k=>[k,a[k]])),reference:Object.fromEntries(keys.map(k=>[k,b[k]]))};}else window.userComparison=null;
     const result=[];if(window.userComparison)result.push({selector:'userAccessRow',...window.userComparison});for(const [selector,keys] of pairs){const a=actual.querySelector(selector),b=ref.shadowRoot.querySelector(selector);if(a&&b)result.push({selector,actual:Object.fromEntries(keys.map(k=>[k,getComputedStyle(a)[k]])),reference:Object.fromEntries(keys.map(k=>[k,getComputedStyle(b)[k]]))});}ref.remove();return result;
    },{base:frontend,id});
    for(const item of compared)assert.deepEqual(item.actual,item.reference,'Exact UI-kit style '+item.selector+' '+[width,theme,id]);
    assert(compared.length>=5);results.push({width,theme,page:id,matched:compared.length});
    if(width===1100||width===390)await app.screenshot({path:path.join(root,'test-results',id+'-'+width+'-'+theme+'.png')});
   }
  }
  await page.setViewportSize({width:390,height:1000});await app.locator('.card-top').getByRole('button',{name:'Benutzer',exact:true}).click();
  const paulSwitch=app.getByRole('switch',{name:'Family Access für Paul',exact:true});
  const maxSwitch=app.getByRole('switch',{name:'Family Access für Maximilian',exact:true});
  assert.equal(await paulSwitch.getAttribute('aria-checked'),'true');
  assert.equal(await maxSwitch.getAttribute('aria-checked'),'false');
  assert.equal(await app.getByRole('switch',{name:'Family Access für Manuel',exact:true}).count(),0);
  await app.locator('select[data-user="max"]').selectOption('family');
  assert.equal(await maxSwitch.getAttribute('aria-checked'),'false','Role preparation must not enable Family Access');
  await maxSwitch.click();await paulSwitch.click();
  assert.equal(await maxSwitch.getAttribute('aria-checked'),'true');
  assert.equal(await paulSwitch.getAttribute('aria-checked'),'false');
  await app.locator('select[data-user="paul"]').selectOption('deny');
  await app.locator('.card-top').getByRole('button',{name:'Einstellungen',exact:true}).click();
  await app.getByRole('switch',{name:'Dashboard-Konfigurationen sperren',exact:true}).click();
  assert.equal(await app.getByRole('switch',{name:'Dashboard-Konfigurationen sperren',exact:true}).getAttribute('aria-checked'),'true');
  await app.getByRole('button',{name:'Änderungen speichern',exact:true}).click();
  await app.getByRole('status').filter({hasText:'Rechte gespeichert'}).waitFor();
  assert.deepEqual(await page.evaluate(()=>window.fixture.saves.at(-1).bindings.paul),[]);
  assert.deepEqual(await page.evaluate(()=>window.fixture.saves.at(-1).enabled_users),['test','max']);
  await app.locator('.card-top').getByRole('button',{name:'Benutzer',exact:true}).click();
  assert.equal(await maxSwitch.getAttribute('aria-checked'),'true','Selection survives saving and reload');
  await maxSwitch.click();
  assert.deepEqual(await page.evaluate(()=>window.app.policy.bindings.max),['family'],'Deactivation retains the role');
  await maxSwitch.click();
  assert.equal(await maxSwitch.evaluate(el=>el===el.getRootNode().activeElement),true,'Toggling retains keyboard focus');
  await app.locator('.card-top').getByRole('button',{name:'Rollen',exact:true}).click();assert.equal(await app.locator('img').count(),0);
  await app.getByRole('switch',{name:'Dashboard Eltern freigeben',exact:true}).click();
  await app.getByRole('button',{name:'Neu laden',exact:true}).click();
  const modal=app.getByRole('dialog',{name:'Änderungen verwerfen?',exact:true});await modal.waitFor();
  await page.keyboard.press('Escape');assert.equal(await modal.isVisible(),false);assert.equal(await app.getByRole('button',{name:'Neu laden',exact:true}).evaluate(el=>el===el.getRootNode().activeElement),true);
  await app.getByRole('button',{name:'Neu laden',exact:true}).click();await modal.getByRole('button',{name:'Abbrechen',exact:true}).click();assert.equal(await modal.isVisible(),false);
  await app.getByRole('button',{name:'Änderungen speichern',exact:true}).click();await app.getByRole('status').filter({hasText:'Rechte gespeichert'}).waitFor();assert.equal(await page.evaluate(()=>window.fixture.saves.at(-1).roles.family.dashboards['dashboard-parents']),'view');
  await app.locator('.card-top').getByRole('button',{name:'Rollen',exact:true}).click();await app.getByRole('searchbox',{name:'Dashboards suchen',exact:true}).fill('Eltern');assert.equal(await app.locator('#dashboard-rows .setting-row').count(),1);await app.getByRole('searchbox',{name:'Dashboards suchen',exact:true}).fill('');
  await app.locator('.card-top').getByRole('button',{name:'Einstellungen',exact:true}).click();await app.getByRole('button',{name:'Diagnose',exact:true}).click();await app.getByRole('button',{name:'HTTP und WebSocket prüfen',exact:true}).click();await app.getByRole('textbox',{name:'Ergebnis',exact:true}).waitFor();assert((await app.getByRole('textbox',{name:'Ergebnis',exact:true}).inputValue()).includes('Dieselbe Prüfinstanz erreicht'));
  await app.getByRole('button',{name:'Konfiguration abrufen',exact:true}).first().click();
  assert((await app.getByRole('textbox',{name:'Ergebnis',exact:true}).inputValue()).includes('views'));
  await app.locator('.card-top').getByRole('button',{name:'Rollen',exact:true}).click();
  await app.getByRole('button',{name:'Rolle umbenennen',exact:true}).click();await app.getByRole('textbox',{name:'Neuer Name',exact:true}).fill('Vorbereitete Rolle');await app.getByRole('dialog',{name:'Rolle umbenennen',exact:true}).getByRole('button',{name:'Übernehmen',exact:true}).click();
  await app.locator('.card-top').getByRole('button',{name:'Fehler',exact:true}).click();
  await app.getByRole('button',{name:'Aktualisieren',exact:true}).click();
  assert((await app.locator('#permission-errors-content').textContent()).includes('Keine')||(await app.locator('#permission-errors-content').textContent()).includes('keine Freigabe'));
  assert.equal(await app.locator('img').count(),0);
  assert.equal(await page.evaluate(()=>window.app.policy.roles.family.name),'Vorbereitete Rolle');
  assert.equal(await page.evaluate(()=>window.app.dirty),true,'Refreshing diagnostics preserves unsaved policy edits');
  // Shared dialogs and controls at every requested width and both themes.
  for(const width of [1100,430,390,375,320])for(const theme of ['light','dark']){
    await page.setViewportSize({width,height:1000});await page.evaluate(dark=>document.body.classList.toggle('dark',dark),theme==='dark');
    await app.locator('.card-top').getByRole('button',{name:'Rollen',exact:true}).click();
    await app.getByRole('button',{name:'Rolle umbenennen',exact:true}).click();
    for(const [kind,title] of [['rename','Rolle umbenennen'],['order','Reihenfolge übernehmen'],['admin','Dashboards für Manuel']]){
      if(kind==='order')await app.getByRole('button',{name:'Reihenfolge übernehmen',exact:true}).click();
      if(kind==='admin'){await app.locator('.card-top').getByRole('button',{name:'Benutzer',exact:true}).click();await app.getByRole('button',{name:'Dashboards für Manuel',exact:true}).click();}
      const modal=app.getByRole('dialog',{name:title,exact:true});await modal.waitFor();
      const overflow=await modal.evaluate(el=>[el,...el.querySelectorAll('.modal-body,.modal-head,footer,.fui-selection-list,.cover-option')].filter(n=>n.scrollWidth>n.clientWidth+1).map(n=>n.className));
      assert.deepEqual(overflow,[],'Dialog overflow '+[kind,width,theme]);
      const style=await modal.evaluate(el=>{const style=getComputedStyle(el);return {fontSize:style.fontSize,color:style.color,padding:style.padding};});
      assert.equal(style.fontSize,'14px');assert.equal(style.padding,'0px');
      if(width===390&&theme==='light')await modal.screenshot({path:path.join(root,'test-results',kind+'-dialog-390-light.png')});
      await page.keyboard.press('Escape');assert.equal(await modal.isVisible(),false);
      results.push({width,theme,page:kind+'-dialog',matched:3});
    }
  }
  await app.locator('.card-top').getByRole('button',{name:'Rollen',exact:true}).click();
  assert.equal(await app.locator('#unchosen-dashboards-content [data-action="move-dashboard"]').count(),0,'Unchosen dashboards have no sort controls');
  await page.evaluate(()=>{window.app.policy.bindings.manuel=['family'];window.app.policy.enabled_users.push('manuel');});
  const beforeOrder=await page.evaluate(()=>window.app.selectedDashboards().map(d=>d.id));
  await app.locator('[data-action="move-dashboard"][data-direction="1"]').first().click();
  const afterOrder=await page.evaluate(()=>window.app.selectedDashboards().map(d=>d.id));
  assert.equal(afterOrder[1],beforeOrder[0]);assert.equal(afterOrder[0],beforeOrder[1]);
  await app.getByRole('button',{name:'Reihenfolge übernehmen',exact:true}).click();
  const orderModal=app.getByRole('dialog',{name:'Reihenfolge übernehmen',exact:true});
  for(const checkbox of await orderModal.locator('input[type="checkbox"]').all())await checkbox.uncheck();
  await orderModal.locator('input[value="test"]').check();
  await orderModal.getByRole('button',{name:'Speichern und übernehmen',exact:true}).click();
  await app.getByRole('status').filter({hasText:'Reihenfolge für 1 Benutzer übernommen'}).waitFor();
  assert.deepEqual(await page.evaluate(()=>window.fixture.orderApply.user_ids),['test']);
  assert.equal(await page.evaluate(()=>window.app.policy.bindings.manuel),undefined,'Use canonical policy after removing stale admin assignments');
  assert.deepEqual(await page.evaluate(()=>window.fixture.saves.at(-1).roles.family.dashboard_order),afterOrder);
  await app.locator('.card-top').getByRole('button',{name:'Benutzer',exact:true}).click();
  await app.getByRole('button',{name:'Dashboards für Manuel',exact:true}).click();
  const adminModal=app.getByRole('dialog',{name:'Dashboards für Manuel',exact:true});
  await adminModal.locator('input[value="dashboard-paul"]').uncheck();
  await adminModal.getByRole('button',{name:'Seitenleiste speichern',exact:true}).click();
  await adminModal.getByRole('alert').filter({hasText:'Startseite muss sichtbar bleiben'}).waitFor();
  await adminModal.getByRole('combobox',{name:'Startseite',exact:true}).selectOption('dashboard-parents');
  await adminModal.getByRole('button',{name:'Seitenleiste speichern',exact:true}).click();
  await app.getByRole('status').filter({hasText:'Admin-Seitenleiste gespeichert'}).waitFor();
  assert.equal(await page.evaluate(()=>window.fixture.adminSave.user_id),'manuel');
  assert.equal(await page.evaluate(()=>window.fixture.adminSave.visible_dashboards.includes('dashboard-paul')),false);
  assert.equal(await page.evaluate(()=>window.fixture.adminSave.default_panel),'dashboard-parents');
  await page.evaluate(()=>{window.fixture.status.is_admin=false;window.app.hass={...window.fixture.hass,user:{id:'paul',is_admin:false}};});
  await app.getByRole('alert').filter({hasText:'nur für Administratoren'}).waitFor();
  assert.equal(await app.locator('.card-top').count(),0);
  assert.equal(await app.locator('[data-action="save"]').count(),0);
  assert.equal(await app.locator('[data-access-user]').count(),0);
  assert.equal(await page.evaluate(()=>window.app.snapshot),null);
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'test-results/validation.json'),JSON.stringify({ui:'1.6.0',variants:results,actions:['user_activation','user_assignment','controlled_switch','permission_save','search','escaping','native_dialog_escape','cancel_and_focus','http_ws_check','dashboard_read','admin_error_protocol','restricted_panel_denied'],consoleErrors:errors},null,2));
  console.log(JSON.stringify({variants:results.length,themes:2,widths:[1100,430,390,375,320],behavior:'passed'}));
  if(process.env.CI)for(const name of ['users-1100-light.png','users-390-dark.png','roles-1100-dark.png','roles-390-light.png','admin-dialog-390-light.png','order-dialog-390-light.png']){
    const encoded=fs.readFileSync(path.join(root,'test-results',name)).toString('base64'),size=16000,count=Math.ceil(encoded.length/size);
    console.log('FAM_VISUAL_META '+JSON.stringify({name,chunks:count,length:encoded.length}));
    for(let i=0;i<count;i++)console.log('FAM_VISUAL_DATA '+name+' '+i+' '+encoded.slice(i*size,(i+1)*size));
  }
 }catch(err){console.error(JSON.stringify({pageErrors:errors}));await page.screenshot({path:path.join(root,'test-results/failure.png'),fullPage:true});throw err;}finally{await browser.close();server.close();}
})().catch(err=>{console.error(err);process.exitCode=1;server.close();});
