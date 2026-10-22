/**
 * NATAL DIGITAL v3 — GOOGLE SHEETS RSVPs
 * Langkah paling aman: dari Google Sheets (BUKAN Apps Script standalone),
 * Ekstensi > Apps Script > gunakan file default "Code.gs" > paste SEMUA isi file ini.
 * Di dropdown editor pilih "installOrCheck" > Jalankan (bukan onOpen).
 * Script mengisi tab Tamu, Konfigurasi, Ringkasan jika belum ada.
 * Publish Web App: Execute as Me; Access Anyone. Hubungkan via Cloudflare secret.
 */
const LIST_NAME = 'Tamu';
const SETTINGS_NAME = 'Konfigurasi';
const SUMMARY_NAME = 'Ringkasan';
const COLS = {no:1, name:2, phone:3, invite:4, status:5, reason:6, time:7, token:8, fingerprint:9, whatsapp:10};
const HEADERS = ['No','Nama yang Diundang','No HP','Link Undangan (otomatis)','Status Kehadiran','Alasan','Waktu Respons','Token Internal','Nama Saat Link Dibuat','Kirim WhatsApp'];

/** Trigger otomatis dari GOOGLE SHEETS. Tidak perlu dijalankan di editor. */
function onOpen(e) {
  SpreadsheetApp.getUi().createMenu('🎄 Undangan Natal')
    .addItem('1. Instal / Periksa Spreadsheet', 'installOrCheck')
    .addItem('2. Lihat Kunci Cloudflare', 'showConnectionSecret')
    .addItem('3. Generate / Perbarui Link Tamu', 'generateInvitationLinks')
    .addItem('4. Diagnostik Koneksi', 'diagnosticCheck')
    .addItem('5. Ringkasan RSVP', 'showSummary')
    .addToUi();
}

/** Bisa dijalankan langsung dari editor. TIDAK memerlukan pop-up Sheets. */
function installOrCheck() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Script harus dibuka DARI Google Sheets: Ekstensi > Apps Script. Jangan buat project melalui script.google.com/home.');
  let guests = ss.getSheetByName(LIST_NAME);
  if (!guests) guests = ss.insertSheet(LIST_NAME);
  guests.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  guests.getRange('A1:J1').setBackground('#73162e').setFontColor('#ffdf9a').setFontWeight('bold');
  guests.setFrozenRows(1);
  guests.getRange('C:C').setNumberFormat('@');
  guests.getRange('H:I').setFontColor('#777777');
  guests.setColumnWidth(2,220); guests.setColumnWidth(3,160); guests.setColumnWidth(4,380); guests.setColumnWidth(5,165);
  guests.setColumnWidth(6,225); guests.setColumnWidth(10,240);
  guests.getRange('E2:E1000').setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['Belum Konfirmasi','Hadir','Tidak Hadir'], true).build());
  let conf = ss.getSheetByName(SETTINGS_NAME);
  if (!conf) conf = ss.insertSheet(SETTINGS_NAME);
  conf.getRange('A1:B5').setValues([
    ['Pengaturan','Nilai'],
    ['URL Website Cloudflare Pages',String(conf.getRange('B2').getDisplayValue() || '')],
    ['Batas RSVP (ISO 8601, opsional)',String(conf.getRange('B3').getDisplayValue() || '')],
    ['Instruksi','Isi B2: https://nama-project.pages.dev/'],
    ['Secret','JANGAN simpan secret di Sheet. Gunakan menu Lihat Kunci Cloudflare.'],
  ]);
  conf.getRange('A1:B1').setBackground('#184936').setFontColor('#f9dc9b').setFontWeight('bold');
  conf.setColumnWidth(1,305); conf.setColumnWidth(2,490);
  let summary = ss.getSheetByName(SUMMARY_NAME);
  if (!summary) summary = ss.insertSheet(SUMMARY_NAME);
  summary.getRange('A1:B5').setValues([
    ['Ringkasan Undangan Natal','Jumlah'],
    ['Total Tamu',''],['Hadir',''],['Tidak Hadir',''],['Belum Konfirmasi',''],
  ]);
  summary.getRange('A1:B1').setBackground('#73162e').setFontColor('#ffdf9a').setFontWeight('bold');
  summary.getRange('B2:B5').setFormulas([
    ["=COUNTIF(Tamu!B2:B,\"?*\")"],
    ["=COUNTIF(Tamu!E2:E,\"Hadir\")"],
    ["=COUNTIF(Tamu!E2:E,\"Tidak Hadir\")"],
    ["=B2-B3-B4"],
  ]);
  summary.setColumnWidth(1,255); summary.setColumnWidth(2,135);
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty('RSVP_SHARED_SECRET');
  if (!secret || secret.length < 32) {
    secret = (Utilities.getUuid() + Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
  }
  props.setProperties({ SPREADSHEET_ID: ss.getId(), RSVP_SHARED_SECRET: secret });
  console.log('INSTALASI BERHASIL — Spreadsheet ID terpasang; tab Tamu/Konfigurasi/Ringkasan tersedia; secret dibuat/disimpan. Refresh Google Sheets, buka menu 🎄 Undangan Natal, lanjut ke Lihat Kunci Cloudflare.');
  return 'INSTALASI BERHASIL';
}

/** Hanya dapat dilihat editor melalui menu Google Sheets. Tidak di-log. */
function showConnectionSecret() {
  const secret = PropertiesService.getScriptProperties().getProperty('RSVP_SHARED_SECRET');
  if (!secret) { SpreadsheetApp.getUi().alert('Jalankan 1. Instal / Periksa Spreadsheet terlebih dahulu.'); return; }
  const html = HtmlService.createHtmlOutput('<div style="font:14px system-ui;padding:16px;color:#252525"><h2>🔐 Kunci Cloudflare</h2><p>Salin ke Cloudflare sebagai <b>RSVP_SHARED_SECRET</b>. Jangan bagikan kepada tamu atau upload ke GitHub.</p><textarea id="k" readonly style="width:100%;height:78px;padding:10px;box-sizing:border-box">'+secret+'</textarea><button onclick="document.getElementById(\'k\').select();document.execCommand(\'copy\')" style="margin-top:12px;padding:10px">Salin Kunci</button></div>')
    .setWidth(530).setHeight(275);
  SpreadsheetApp.getUi().showModalDialog(html, 'Koneksi Natal — hanya untuk panitia');
}

/** Jalankan dari dropdown editor; tidak membutuhkan modal UI. */
function diagnosticCheck() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SPREADSHEET_ID');
  const secret = props.getProperty('RSVP_SHARED_SECRET');
  if (!id || !secret) throw new Error('Belum diinstall. Jalankan installOrCheck dahulu.');
  const ss = SpreadsheetApp.openById(id);
  const tabs = [LIST_NAME,SETTINGS_NAME,SUMMARY_NAME];
  tabs.forEach(n => { if (!ss.getSheetByName(n)) throw new Error('Tab ' + n + ' tidak ada.'); });
  const url = String(ss.getSheetByName(SETTINGS_NAME).getRange('B2').getDisplayValue()).trim();
  console.log('DIAGNOSTIK: Spreadsheet OK, tab OK, kunci OK, URL ' + (/^https:\/\//.test(url) ? 'sudah diisi' : 'belum diisi') + '. Untuk tes RSVP dari website, Cloudflare harus deploy dan kedua secret terpasang.');
  return { spreadsheet: true, sheets: true, secret: true, baseUrlConfigured: /^https:\/\//.test(url) };
}

function normalizePhone(value) {
  let phone = String(value || '').replace(/[^\d+]/g, '');
  if (phone.startsWith('+')) phone = phone.substring(1);
  if (phone.startsWith('0')) phone = '62' + phone.substring(1);
  if (phone.startsWith('8')) phone = '62' + phone;
  return /^\d{9,16}$/.test(phone) ? phone : '';
}

function generateInvitationLinks() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Gunakan menu Google Sheets, bukan project Apps Script standalone.');
  const guests = ss.getSheetByName(LIST_NAME);
  const config = ss.getSheetByName(SETTINGS_NAME);
  if (!guests || !config) throw new Error('Jalankan installOrCheck terlebih dahulu.');
  const base = String(config.getRange('B2').getDisplayValue()).trim().replace(/\/+$/, '');
  if (!/^https:\/\/[\w.-]+(?::\d+)?(?:\/[^\s?#]*)?$/.test(base)) {
    SpreadsheetApp.getUi().alert('Konfigurasi!B2 belum valid. Contoh: https://undangan-natal.pages.dev/'); return;
  }
  const lastRow = guests.getLastRow();
  if (lastRow < 2) { SpreadsheetApp.getUi().alert('Isi nama di Tamu!B2 terlebih dahulu.'); return; }
  const rows = guests.getRange(2,1,lastRow-1,10).getValues();
  let generated = 0;
  const numbers = [];
  const detail = [];
  const internal = [];
  rows.forEach((row,idx) => {
    const name = String(row[COLS.name-1] || '').trim();
    if (!name) {
      numbers.push(['']); detail.push(['','','','']); internal.push(['','','']);
      return;
    }
    let token = String(row[COLS.token-1] || '').trim();
    const fingerprint = String(row[COLS.fingerprint-1] || '').trim();
    const rotated = !/^[a-f0-9]{64,96}$/i.test(token) || fingerprint !== name;
    if (rotated) token = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
    const link = base + '/?to=' + encodeURIComponent(name) + '&token=' + token;
    const phone = normalizePhone(row[COLS.phone-1]);
    const message = 'Shalom ' + name + '! 🎄 Anda diundang ke Perayaan Natal. Undangan pribadi: ' + link + ' Mohon konfirmasi kehadiran melalui website. Tuhan memberkati.';
    const wa = phone ? 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message) : '';
    numbers.push([idx+1]);
    // A renamed/reassigned invitation must NOT inherit the old guest's attendance.
    detail.push([link,rotated ? 'Belum Konfirmasi' : (String(row[COLS.status-1] || '').trim() || 'Belum Konfirmasi'),rotated ? '' : row[COLS.reason-1],rotated ? '' : row[COLS.time-1]]);
    internal.push([token,name,wa]);
    generated++;
  });
  // 3 batched writes instead of 4 API calls for every guest (much faster on 100+ rows).
  guests.getRange(2,COLS.no,rows.length,1).setValues(numbers);
  guests.getRange(2,COLS.invite,rows.length,4).setValues(detail);
  guests.getRange(2,COLS.token,rows.length,3).setValues(internal);
  SpreadsheetApp.getUi().alert('Berhasil! ' + generated + ' link dibuat/diperbarui. Kolom D = link undangan, J = link WhatsApp.');
}

function showSummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Buka melalui Google Sheets.');
  const sheet = ss.getSheetByName(LIST_NAME);
  if (!sheet || sheet.getLastRow()<2) { SpreadsheetApp.getUi().alert('Belum ada tamu.'); return; }
  const rows=sheet.getRange(2,2,sheet.getLastRow()-1,4).getValues();
  let total=0,yes=0,no=0;
  rows.forEach(row => { if (!String(row[0]||'').trim()) return; total++; if (row[3]==='Hadir') yes++; else if(row[3]==='Tidak Hadir') no++; });
  SpreadsheetApp.getUi().alert('Total: '+total+'\nHadir: '+yes+'\nTidak Hadir: '+no+'\nBelum Konfirmasi: '+(total-yes-no));
}

function output_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }

/** Buka URL /exec di browser: pastikan service ter-deploy, tanpa membuka data tamu. */
function doGet(e) {
  const props = PropertiesService.getScriptProperties();
  return output_({ok:true,service:'natal-rsvp-v3',configured:!!(props.getProperty('SPREADSHEET_ID') && props.getProperty('RSVP_SHARED_SECRET'))});
}

function doPost(e) {
  const props=PropertiesService.getScriptProperties();
  const secret=props.getProperty('RSVP_SHARED_SECRET');
  const spreadsheetId=props.getProperty('SPREADSHEET_ID');
  const params=(e && e.parameter)||{};
  if (!secret || !spreadsheetId || params.shared_secret !== secret) return output_({ok:false,error:'Akses ditolak atau konfigurasi belum selesai.'});
  const token=String(params.guest_token || '').trim();
  const attendance=String(params.attendance || '').trim();
  const reason=String(params.absence_reason || '').trim();
  if (!/^[a-f0-9]{64,96}$/i.test(token)) return output_({ok:false,error:'Token tidak valid.'});
  if (attendance!=='HADIR' && attendance!=='TIDAK HADIR') return output_({ok:false,error:'Status tidak valid.'});
  if (reason.length>400 || (attendance==='TIDAK HADIR' && !reason)) return output_({ok:false,error:'Alasan wajib untuk Tidak Hadir (maks. 400 karakter).'});
  const lock=LockService.getScriptLock();
  if (!lock.tryLock(10000)) return output_({ok:false,error:'Sistem sibuk. Silakan coba lagi.'});
  try {
    const ss=SpreadsheetApp.openById(spreadsheetId);
    const config=ss.getSheetByName(SETTINGS_NAME);
    const deadline=config && String(config.getRange('B3').getDisplayValue()).trim();
    if (deadline && !isNaN(Date.parse(deadline)) && new Date()>new Date(deadline)) return output_({ok:false,error:'Batas RSVP telah berakhir.'});
    const sheet=ss.getSheetByName(LIST_NAME);
    if (!sheet || sheet.getLastRow()<2) return output_({ok:false,error:'Daftar tamu masih kosong.'});
    const rows=sheet.getRange(2,2,sheet.getLastRow()-1,7).getValues();
    const index=rows.findIndex(row=>String(row[6]||'').trim()===token && !!String(row[0]||'').trim());
    if (index<0) return output_({ok:false,error:'Token undangan tidak ditemukan atau sudah diganti.'});
    // Protect against formula injection. Reason is provided by end users.
    const safeReason=/^[=+\-@\t\r]/.test(reason)? "'"+reason:reason;
    sheet.getRange(index+2,COLS.status,1,3).setValues([[attendance==='HADIR'?'Hadir':'Tidak Hadir',attendance==='HADIR'?'':safeReason,new Date()]]);
    SpreadsheetApp.flush();
    return output_({ok:true});
  } catch(err) {
    console.error(err);
    return output_({ok:false,error:'Google Sheets gagal menyimpan jawaban. Periksa Deploy/izin Apps Script.'});
  } finally { lock.releaseLock(); }
}
