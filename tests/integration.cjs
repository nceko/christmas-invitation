/** Offline smoke test — Google Apps Script sandbox mock + Cloudflare Function. */
const fs=require('fs'), vm=require('vm'), assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..');
let counter=0;
const props={};
class Sheet {
  constructor(name) {this.name=name; this.rows=[];}
  setFrozenRows(){} setColumnWidth(){}
  getLastRow() {let n=0;this.rows.forEach((row,i)=> {if(row.some(v=>v!=='' && v!==undefined && v!==null))n=i+1});return n;}
  getRange(a,b,r=1,c=1) {
    if(typeof a==='string') {
      const m=a.match(/^([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?$/);
      if(m){b=col(m[1]);a=+m[2];r=m[4]?+m[4]-a+1:1;c=m[3]?col(m[3])-b+1:1}
      else if(a.match(/^([A-Z]+):([A-Z]+)$/)){const z=a.split(':');b=col(z[0]);c=col(z[1])-b+1;a=1;r=1500}
      else throw Error('Unsupported Range '+a);
    }
    const sheet=this;
    const rg={
      getValue(){return (sheet.rows[a-1]||[])[b-1]||''},
      getDisplayValue(){return String(this.getValue())},
      getValues(){return Array.from({length:r},(_,i)=>Array.from({length:c},(_,j)=>(sheet.rows[a+i-1]||[])[b+j-1]||''))},
      setValue(value){sheet.rows[a-1]??=[];sheet.rows[a-1][b-1]=value;return this},
      setValues(values){assert.equal(values.length,r);values.forEach((row,i)=>{assert.equal(row.length,c);sheet.rows[a+i-1]??=[]; row.forEach((v,j)=>sheet.rows[a+i-1][b+j-1]=v)});return this},
      setFormulas(rows){return this.setValues(rows)},setBackground(){return this},setFontColor(){return this},setFontWeight(){return this},setNumberFormat(){return this},setDataValidation(){return this}
    };
    return rg;
  }
}
function col(letters) {return [...letters].reduce((num,ch)=>num*26+ch.charCodeAt(0)-64,0)}
const sheets={};
const ss={getId(){return 'fake-spreadsheet-id'},getSheetByName(n){return sheets[n]||null},insertSheet(n){return(sheets[n]=new Sheet(n))}};
let alerts=[];
const ui={alert(v){alerts.push(String(v))},createMenu(){return {addItem(){return this},addToUi(){return this}}},showModalDialog(){} };
const runtime={
  SpreadsheetApp:{getActiveSpreadsheet:()=>ss,openById:id=>{if(id!==ss.getId())throw Error('bad id');return ss},getUi:()=>ui,flush(){},newDataValidation:()=>({requireValueInList(){return this},build(){return {}}})},
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k],setProperties(o){Object.assign(props,o)}})},
  Utilities:{getUuid:()=>`${('00000000'+(++counter).toString(16)).slice(-8)}-e89b-12d3-a456-426614174000`},
  LockService:{getScriptLock:()=>({tryLock(){return true},releaseLock(){}})},
  ContentService:{MimeType:{JSON:'application/json'},createTextOutput(text){return {text,setMimeType(){return this}}}},
  HtmlService:{createHtmlOutput:()=>({setWidth(){return this},setHeight(){return this}})},
  console,Date,JSON,
};
vm.createContext(runtime);
vm.runInContext(fs.readFileSync(path.join(root,'google-apps-script/Code.gs'),'utf8'),runtime);
assert.equal(runtime.installOrCheck(),'INSTALASI BERHASIL');
assert.deepEqual(Object.keys(sheets).sort(),['Konfigurasi','Ringkasan','Tamu']);
assert.equal(props.RSVP_SHARED_SECRET.length,96);
assert.equal(runtime.installOrCheck(),'INSTALASI BERHASIL');
assert.equal(props.RSVP_SHARED_SECRET.length,96);
sheets.Konfigurasi.getRange('B2').setValue('https://natal-example.pages.dev/');
let t=sheets.Tamu;
t.getRange('B2:C3').setValues([['Sinta Ayu','081234567891'],['Budi Natal','+62811111112']]);
runtime.generateInvitationLinks();
const invite1=t.getRange('D2').getValue();
const token1=t.getRange('H2').getValue();
const token2=t.getRange('H3').getValue();
assert(invite1.includes('to=Sinta%20Ayu'));
assert(invite1.includes('token='+token1));
assert.equal(token1.length,64);
assert.notEqual(token1,token2);
assert(t.getRange('J2').getValue().includes('wa.me/6281234567891'));
assert.equal(t.getRange('E2').getValue(),'Belum Konfirmasi');
const post=(opts={})=>JSON.parse(runtime.doPost({parameter:{shared_secret:props.RSVP_SHARED_SECRET,guest_token:token1,attendance:'HADIR',absence_reason:'',...opts}}).text);
assert.equal(post().ok,true);
assert.equal(t.getRange('E2').getValue(),'Hadir');
assert.equal(post({attendance:'TIDAK HADIR',absence_reason:'Ada kegiatan keluarga'}).ok,true);
assert.equal(t.getRange('F2').getValue(),'Ada kegiatan keluarga');
assert.equal(post({attendance:'TIDAK HADIR',absence_reason:''}).ok,false);
assert.equal(post({shared_secret:'wrong'}).ok,false);
assert.equal(post({attendance:'TIDAK HADIR',absence_reason:'=2+2'}).ok,true);
assert.equal(t.getRange('F2').getValue(),"'=2+2");
runtime.generateInvitationLinks();
assert.equal(t.getRange('E2').getValue(),'Tidak Hadir');
t.getRange('B2').setValue('Maria Baru');
runtime.generateInvitationLinks();
assert.notEqual(t.getRange('H2').getValue(),token1);
assert.equal(t.getRange('E2').getValue(),'Belum Konfirmasi');
assert.equal(t.getRange('F2').getValue(),'');
assert.equal(post().ok,false);
const get=JSON.parse(runtime.doGet().text);assert(get.configured);assert.equal(get.service,'natal-rsvp-v3');
console.log('OK: install, secret, links, unique tokens, WhatsApp, hadir, tidak hadir, formula defense, link rotation, reset status, health.');

(async()=>{
  const ts=require(path.join(root,'node_modules/typescript'));
  const file=fs.readFileSync(path.join(root,'functions/api/rsvp.ts'),'utf8');
  const compiled=ts.transpileModule(file,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const js={exports:{}};
  vm.runInNewContext(compiled,{
    module:js,exports:js.exports,Request,Response,URLSearchParams,AbortSignal,
    fetch:async (url,opts)=>new Response(runtime.doPost({parameter:Object.fromEntries(new URLSearchParams(opts.body))}).text,{status:200,headers:{'content-type':'application/json'}}),
  });
  const env={APPS_SCRIPT_URL:'https://script.google.com/macros/s/AKfycbFake/exec',RSVP_SHARED_SECRET:props.RSVP_SHARED_SECRET};
  let response=js.exports.onRequestGet({env});
  assert.equal((await response.json()).configured,true);
  const latestToken=t.getRange('H2').getValue();
  response=await js.exports.onRequestPost({env,request:new Request('https://natal-example.pages.dev/api/rsvp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:latestToken,attendance:'HADIR',reason:''})})});
  assert.equal(response.status,200);
  assert.equal((await response.json()).ok,true);
  assert.equal(t.getRange('E2').getValue(),'Hadir');
  response=await js.exports.onRequestPost({env:{},request:new Request('https://natal-example.pages.dev/api/rsvp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:latestToken,attendance:'HADIR',reason:''})})});
  assert.equal(response.status,503);
  console.log('OK: simulated Cloudflare Pages → Google Apps Script → Google Sheets RSVP, missing secret 503.');
})().catch(e=>{console.error(e);process.exitCode=1});
