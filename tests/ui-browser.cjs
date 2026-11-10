const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),frontend='/custom_components/family_access_manager/frontend/';
const fixture=`<!doctype html><html lang="de"><head><meta charset="utf-8"><style>body{margin:0;--primary-color:#03a9f4;--primary-text-color:#212121;--secondary-text-color:#727272;--card-background-color:#fff;--ha-card-background:#fff;--primary-background-color:#fafafa;--secondary-background-color:#f5f5f5;--divider-color:#e0e0e0;--ha-font-family-body:Arial,sans-serif;background:var(--primary-background-color)}body.dark{--primary-text-color:#e1e1e1;--secondary-text-color:#9b9b9b;--card-background-color:#1c1c1c;--ha-card-background:#1c1c1c;--primary-background-color:#111;--secondary-background-color:#282828;--divider-color:#424242}</style></head><body><script type="module">
import '${frontend}panel.js';
const policy={revision:0,native_dashboard_gate:false,device_control:false,roles:{family:{name:'Kinder',dashboards:{'dashboard-paul':'view'},entities:{'switch.probe':'view'},areas:{},labels:{}}},bindings:{paul:['family']}};
const snapshot={policy,users:[{id:'manuel',name:'Manuel',admin:true,active:true},{id:'paul',name:'Paul',admin:false,active:true},{id:'max',name:'Maximilian',admin:false,active:true}],dashboards:[{id:'dashboard-paul',name:'Paul'},{id:'dashboard-parents',name:'Eltern'}],entities:[{id:'switch.probe',name:'Testschalter'},{id:'light.paul',name:'Licht Paul'},{id:'light.very_long_entity_name_for_testing',name:'LangeEntitätsbezeichnungOhneLeerzeichenDieAufDemHandyUmgebrochenWerdenMuss'},{id:'light.escape',name:'<img src=x onerror=alert(1)>'}],areas:[{id:'paul',name:'Paul'}],labels:[{id:'paul',name:'Paul'}],events:[{operation:'entity/view',target:'switch.probe',allowed:true,time:'2026-11-10T10:00:00Z'}]};
const status={is_admin:true,roles:[],gate_available:true,native_dashboard_gate:false,device_control:false,version:'0.2.0',probe_entity_id:'switch.probe',dashboards:snapshot.dashboards,instance_id:'fixture'};
window.fixture={snapshot,status,saves:[],calls:[],state:'off'};
const hass={user:{id:'manuel'},callWS:async msg=>{window.fixture.calls.push(msg.action);if(msg.action==='status')return structuredClone(status);if(msg.action==='admin_snapshot'){if(!status.is_admin)throw Error('Nicht freigegeben');return structuredClone(snapshot);}if(msg.action==='save_policy'){if(!status.is_admin)throw Error('Nicht freigegeben');snapshot.policy=structuredClone(msg.payload);snapshot.policy.revision++;window.fixture.saves.push(structuredClone(msg.payload));return {revision:snapshot.policy.revision};}if(msg.action==='read_entity')return {state:window.fixture.state};if(msg.action==='call_service'){if(!status.is_admin)throw Error('Nicht freigegeben');window.fixture.state=window.fixture.state==='off'?'on':'off';return {executed:true};}if(msg.action==='read_dashboard')return {views:[]};throw Error('Unknown action');},callApi:async()=>({result:structuredClone(status)})};
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
  const pages=[['users','Benutzer'],['roles','Rollen'],['test','Prüfen'],['settings','Umfang']];
  for(const width of [1100,430,390,375,320])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:1000});await page.evaluate(dark=>document.body.classList.toggle('dark',dark),theme==='dark');
   for(const [id,label] of pages){
    await app.locator('.card-top').getByRole('button',{name:label,exact:true}).click();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No document overflow: '+[width,theme,id]);
    const bad=await app.evaluate(el=>[...el.shadowRoot.querySelectorAll('.setting-row,.grid,.card-top,.fui-panel-header')].filter(n=>n.scrollWidth>n.clientWidth+1).map(n=>[n.className,n.scrollWidth,n.clientWidth]));
    assert.deepEqual(bad,[],'No control overflow: '+[width,theme,id]);
    const compared=await page.evaluate(async({base,id})=>{
     const kit=await import(base+'family-ui/1.2.1/family-ui.js'),ref=document.createElement('div');ref.attachShadow({mode:'open'});document.body.append(ref);
     ref.shadowRoot.innerHTML='<style>'+kit.UI_CSS+'</style>'+kit.panelHeader({title:'Family Access'})+kit.navigation({label:'Family Access',items:[{id:'users',label:'Benutzer'},{id:'roles',label:'Rollen'},{id:'test',label:'Prüfen'}],active:id,help:false,settingsLabel:'Umfang'})+'<main>'+kit.section({id:'ref',title:'Benutzer',content:kit.row({title:'Paul',description:'Benutzer',trailing:kit.toggle({label:'Schalter',action:'noop'})})+kit.selectField({id:'ref-select',label:'Rolle',value:'none',options:[{value:'none',label:'Kein Zugriff'}]})})+'</main>';
     const actual=document.querySelector('family-access-panel').shadowRoot,pairs=[['.fui-panel-header',['padding','gap','minHeight','backgroundColor']],['.fui-panel-header strong',['fontFamily','fontSize','fontWeight']],['nav button',['padding','fontSize','fontWeight','color']],['main',['padding']],['.settings-fold span',['fontSize','fontWeight']],['.row-text strong',['fontSize','fontWeight','lineHeight']],['.row-text small',['fontSize','color']],['select',['padding','borderRadius','fontSize','color','backgroundColor']],['.switch-track',['width','height','backgroundColor']],['.switch-thumb',['width','height']],['button.primary',['backgroundColor','color','borderRadius','padding','fontSize']]];
     const result=[];for(const [selector,keys] of pairs){const a=actual.querySelector(selector),b=ref.shadowRoot.querySelector(selector);if(a&&b)result.push({selector,actual:Object.fromEntries(keys.map(k=>[k,getComputedStyle(a)[k]])),reference:Object.fromEntries(keys.map(k=>[k,getComputedStyle(b)[k]]))});}ref.remove();return result;
    },{base:frontend,id});
    for(const item of compared)assert.deepEqual(item.actual,item.reference,'Exact UI-kit style '+item.selector+' '+[width,theme,id]);
    assert(compared.length>=5);results.push({width,theme,page:id,matched:compared.length});
    if(width===1100||width===390)await app.screenshot({path:path.join(root,'test-results',id+'-'+width+'-'+theme+'.png')});
   }
  }
  await page.setViewportSize({width:390,height:1000});await app.locator('.card-top').getByRole('button',{name:'Benutzer',exact:true}).click();
  await app.locator('[data-user="paul"]').selectOption('deny');
  await app.getByRole('switch',{name:'Dashboard-Konfigurationen sperren',exact:true}).click();
  assert.equal(await app.getByRole('switch',{name:'Dashboard-Konfigurationen sperren',exact:true}).getAttribute('aria-checked'),'true');
  await app.getByRole('button',{name:'Änderungen speichern',exact:true}).click();
  await app.getByRole('status').filter({hasText:'Rechte gespeichert'}).waitFor();
  assert.deepEqual(await page.evaluate(()=>window.fixture.saves.at(-1).bindings.paul),[]);
  await app.locator('.card-top').getByRole('button',{name:'Rollen',exact:true}).click();assert.equal(await app.locator('img').count(),0);
  await app.locator('[data-grant="switch.probe"]').selectOption('control');
  await app.getByRole('button',{name:'Neu laden',exact:true}).click();
  const modal=app.getByRole('dialog',{name:'Änderungen verwerfen?',exact:true});await modal.waitFor();
  await page.keyboard.press('Escape');assert.equal(await modal.isVisible(),false);assert.equal(await app.getByRole('button',{name:'Neu laden',exact:true}).evaluate(el=>el===el.getRootNode().activeElement),true);
  await app.getByRole('button',{name:'Neu laden',exact:true}).click();await modal.getByRole('button',{name:'Abbrechen',exact:true}).click();assert.equal(await modal.isVisible(),false);
  await app.getByRole('button',{name:'Änderungen speichern',exact:true}).click();await app.getByRole('status').filter({hasText:'Rechte gespeichert'}).waitFor();assert.equal(await page.evaluate(()=>window.fixture.saves.at(-1).roles.family.entities['switch.probe']),'control');
  await app.locator('.card-top').getByRole('button',{name:'Rollen',exact:true}).click();await app.getByRole('textbox',{name:'Suchen',exact:true}).fill('Licht Paul');assert.equal(await app.locator('#resources .setting-row').count(),1);
  await app.locator('.card-top').getByRole('button',{name:'Prüfen',exact:true}).click();await app.getByRole('button',{name:'HTTP und WebSocket prüfen',exact:true}).click();await app.getByRole('textbox',{name:'Ergebnis',exact:true}).waitFor();assert((await app.getByRole('textbox',{name:'Ergebnis',exact:true}).inputValue()).includes('Dieselbe Prüfinstanz erreicht'));
  await app.getByRole('button',{name:'Testschalter umschalten',exact:true}).click();assert.equal(await page.evaluate(()=>window.fixture.state),'on');
  await page.evaluate(()=>{window.fixture.status.is_admin=false;window.app.hass={...window.fixture.hass,user:{id:'paul'}};});
  await app.locator('.card-top').getByRole('button',{name:'Prüfen',exact:true}).waitFor();assert.equal(await app.locator('.card-top').getByRole('button',{name:'Benutzer',exact:true}).count(),0);assert.equal(await app.locator('[data-action="save"]').count(),0);
  await app.getByRole('button',{name:'Testschalter umschalten',exact:true}).click();await app.getByRole('alert').filter({hasText:'Nicht freigegeben'}).waitFor();
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'test-results/validation.json'),JSON.stringify({ui:'1.2.1',variants:results,actions:['user_assignment','controlled_switch','permission_save','search','escaping','native_dialog_escape','cancel_and_focus','http_ws_check','virtual_switch','child_permissions'],consoleErrors:errors},null,2));
  console.log(JSON.stringify({variants:results.length,themes:2,widths:[1100,430,390,375,320],behavior:'passed'}));
 }catch(err){await page.screenshot({path:path.join(root,'test-results/failure.png'),fullPage:true});throw err;}finally{await browser.close();server.close();}
})().catch(err=>{console.error(err);process.exitCode=1;server.close();});
