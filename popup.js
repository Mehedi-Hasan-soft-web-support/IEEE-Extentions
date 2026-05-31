// ═══════════════════════════════════════════════════════
//  SIGHT Tools — popup.js  |  IEEE SIGHT Companion v1.1
//  100% local · No server · No AI API
// ═══════════════════════════════════════════════════════

const fileStore = {};
let orgPageOrder = [];
let extractedText = '';

document.addEventListener('DOMContentLoaded', () => {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf_worker.js';
  }
  initNav();
  initSignature();
  initDragDrop();
  initClickDelegation();
  initFileInputs();
  initSelectListeners();
  loadSARDraft();
});

// ── Navigation ───────────────────────────────────────
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.page));
  });
}
function switchPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const p = document.getElementById('page-' + id);
  if (p) { p.classList.add('active'); document.getElementById('tool-panels').style.display = 'none'; }
  const b = document.querySelector(`[data-page="${id}"]`);
  if (b) b.classList.add('active');
}
function openTool(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tool-panels').style.display = 'block';
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
}
function closeTool() {
  document.getElementById('tool-panels').style.display = 'none';
  switchPage('home');
}

// ── Global click delegation ──────────────────────────
function initClickDelegation() {
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    switch (action) {
      case 'closeTool':        closeTool(); break;
      case 'openTool':         openTool(el.dataset.tool); break;
      case 'switchPage':       switchPage(el.dataset.pageTarget); break;
      case 'openLink':         openLink(el.dataset.url); break;
      case 'mergePDFs':        mergePDFs(); break;
      case 'splitPDF':         splitPDF(); break;
      case 'rotatePDF':        rotatePDF(); break;
      case 'watermarkPDF':     watermarkPDF(); break;
      case 'protectPDF':       protectPDF(); break;
      case 'unlockPDF':        unlockPDF(); break;
      case 'addPageNumbers':   addPageNumbers(); break;
      case 'compressPDF':      compressPDF(); break;
      case 'signPDF':          signPDF(); break;
      case 'redactPDF':        redactPDF(); break;
      case 'cropPDF':          cropPDF(); break;
      case 'saveOrganized':    saveOrganized(); break;
      case 'extractText':      extractText(); break;
      case 'copyExtracted':    copyExtracted(); break;
      case 'downloadExtracted':downloadExtracted(); break;
      case 'saveMetadata':     saveMetadata(); break;
      case 'addHeaderFooter':  addHeaderFooter(); break;
      case 'flattenPDF':       flattenPDF(); break;
      case 'convertJpgToPdf':  convertJpgToPdf(); break;
      case 'convertPdfToJpg':  convertPdfToJpg(); break;
      case 'convertHtmlToPdf': convertHtmlToPdf(); break;
      case 'convertTxtToPdf':  convertTxtToPdf(); break;
      case 'generateSAR':      generateSAR(); break;
      case 'saveSARDraft':     saveSARDraft(); break;
      case 'clearSig':         clearSig(); break;
      case 'setSigColor':      setSigColor(el.dataset.color); break;
      case 'rmFile': {
        rmFile(el.dataset.tool, +el.dataset.idx);
        break;
      }
    }
  });
  // Drop-zone click
  document.addEventListener('click', e => {
    const zone = e.target.closest('[data-file-trigger]');
    if (!zone) return;
    const inp = document.getElementById(zone.dataset.fileTrigger);
    if (inp) inp.click();
  });
}

// ── File inputs ──────────────────────────────────────
function initFileInputs() {
  document.querySelectorAll('input[type=file][data-tool]').forEach(inp => {
    inp.addEventListener('change', () => {
      const tool = inp.dataset.tool;
      if (tool === 'organize')   loadOrganize(inp.files);
      else if (tool === 'txtfile') loadTxtFile(inp.files);
      else if (tool === 'metadata') loadMetadata(inp.files);
      else handleFiles(tool, inp.files);
    });
  });
}
function initSelectListeners() {
  const h2p = document.getElementById('h2p-source');
  if (h2p) h2p.addEventListener('change', () => {
    document.getElementById('h2p-code').style.display = h2p.value === 'code' ? 'block' : 'none';
  });
}

// ── File handling ────────────────────────────────────
function handleFiles(tool, files) {
  if (!files || !files.length) return;
  fileStore[tool] = fileStore[tool] || [];
  Array.from(files).forEach(f => fileStore[tool].push(f));
  renderList(tool);
  const btn = document.getElementById('btn-' + tool);
  if (btn) btn.disabled = false;
}
function renderList(tool) {
  const el = document.getElementById('fl-' + tool);
  if (!el) return;
  el.innerHTML = (fileStore[tool] || []).map((f, i) => `
    <div class="file-item">
      <span class="file-item-icon">${f.type.includes('pdf') ? '📄' : '🖼️'}</span>
      <span class="file-item-name">${f.name}</span>
      <span class="file-item-size">${fmtSize(f.size)}</span>
      <button class="file-item-remove" data-action="rmFile" data-tool="${tool}" data-idx="${i}">✕</button>
    </div>`).join('');
}
function rmFile(tool, i) {
  if (fileStore[tool]) fileStore[tool].splice(i, 1);
  renderList(tool);
  if (!fileStore[tool] || !fileStore[tool].length) {
    const btn = document.getElementById('btn-' + tool);
    if (btn) btn.disabled = true;
  }
}
function fmtSize(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
  return (b/1048576).toFixed(1) + ' MB';
}

// ── Drag & drop ──────────────────────────────────────
function initDragDrop() {
  document.querySelectorAll('.drop-zone').forEach(z => {
    z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('dragover'); });
    z.addEventListener('dragleave', () => z.classList.remove('dragover'));
    z.addEventListener('drop', e => {
      e.preventDefault(); z.classList.remove('dragover');
      const inp = z.querySelector('input[type=file]');
      if (!inp) return;
      const tool = inp.dataset.tool;
      if (tool === 'organize')   loadOrganize(e.dataTransfer.files);
      else if (tool === 'txtfile') loadTxtFile(e.dataTransfer.files);
      else if (tool === 'metadata') loadMetadata(e.dataTransfer.files);
      else handleFiles(tool, e.dataTransfer.files);
    });
  });
}

// ── Status / download helpers ────────────────────────
function st(id, msg, type = 'info') {
  const el = document.getElementById('st-' + id);
  if (el) { el.className = 'status ' + type; el.textContent = msg; }
}
function dl(bytes, name) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function readAB(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = e => res(e.target.result);
    fr.onerror = rej;
    fr.readAsArrayBuffer(file);
  });
}
function readDU(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = e => res(e.target.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}
function openLink(url) {
  if (typeof chrome !== 'undefined' && chrome.tabs) chrome.tabs.create({ url });
  else window.open(url, '_blank');
}

// ═══════════════════════════════════════════════════════
//  PDF TOOLS
// ═══════════════════════════════════════════════════════
function getPL() {
  const PL = window.PDFLib;
  if (!PL) { alert('pdf-lib not loaded. Please reload.'); return null; }
  return PL;
}

// MERGE
async function mergePDFs() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['merge'];
  if (!files || files.length < 2) { st('merge','⚠️ Add at least 2 PDF files.','error'); return; }
  st('merge','⏳ Merging...','info');
  try {
    const out = await PL.PDFDocument.create();
    for (const f of files) {
      const src = await PL.PDFDocument.load(await readAB(f), { ignoreEncryption:true });
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach(p => out.addPage(p));
    }
    dl(await out.save(), 'merged.pdf');
    st('merge', `✅ Merged ${files.length} PDFs successfully!`, 'success');
  } catch(e) { st('merge','❌ '+e.message,'error'); }
}

// SPLIT
async function splitPDF() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['split'];
  if (!files || !files.length) { st('split','⚠️ Add a PDF file.','error'); return; }
  const rangeStr = document.getElementById('split-range').value.trim();
  if (!rangeStr) { st('split','⚠️ Enter page range e.g. 1-3,5','error'); return; }
  st('split','⏳ Splitting...','info');
  try {
    const src = await PL.PDFDocument.load(await readAB(files[0]), { ignoreEncryption:true });
    const nums = parseRange(rangeStr, src.getPageCount());
    if (!nums.length) { st('split','❌ Invalid range.','error'); return; }
    const out = await PL.PDFDocument.create();
    const copied = await out.copyPages(src, nums.map(n => n-1));
    copied.forEach(p => out.addPage(p));
    dl(await out.save(), 'split.pdf');
    st('split', `✅ Extracted ${nums.length} page(s)!`, 'success');
  } catch(e) { st('split','❌ '+e.message,'error'); }
}
function parseRange(s, total) {
  const set = new Set();
  s.split(',').forEach(p => {
    p = p.trim();
    if (p.includes('-')) {
      const [a,b] = p.split('-').map(Number);
      for (let i=Math.max(1,a); i<=Math.min(total,b); i++) set.add(i);
    } else { const n=+p; if(n>=1&&n<=total) set.add(n); }
  });
  return [...set].sort((a,b)=>a-b);
}

// ROTATE
async function rotatePDF() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['rotate'];
  if (!files || !files.length) { st('rotate','⚠️ Add a PDF file.','error'); return; }
  const angle = +document.getElementById('rotate-angle').value;
  const applyTo = document.getElementById('rotate-pages').value;
  st('rotate','⏳ Rotating...','info');
  try {
    const doc = await PL.PDFDocument.load(await readAB(files[0]), { ignoreEncryption:true });
    doc.getPages().forEach((pg, i) => {
      const n=i+1, ok=applyTo==='all'||(applyTo==='even'&&n%2===0)||(applyTo==='odd'&&n%2!==0);
      if (ok) pg.setRotation(PL.degrees((pg.getRotation().angle+angle)%360));
    });
    dl(await doc.save(), 'rotated.pdf');
    st('rotate','✅ Pages rotated!','success');
  } catch(e) { st('rotate','❌ '+e.message,'error'); }
}

// WATERMARK
async function watermarkPDF() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['watermark'];
  if (!files || !files.length) { st('watermark','⚠️ Add a PDF file.','error'); return; }
  const text = document.getElementById('wm-text').value || 'WATERMARK';
  const opacity = (+document.getElementById('wm-opacity').value||20)/100;
  const colorId = document.getElementById('wm-color').value;
  const colorMap = { gray:PL.rgb(.5,.5,.5), red:PL.rgb(.8,.1,.1), blue:PL.rgb(.1,.2,.8) };
  st('watermark','⏳ Adding watermark...','info');
  try {
    const doc = await PL.PDFDocument.load(await readAB(files[0]), { ignoreEncryption:true });
    const font = await doc.embedFont(PL.StandardFonts.HelveticaBold);
    doc.getPages().forEach(pg => {
      const {width:w,height:h} = pg.getSize();
      const sz=Math.min(w,h)*0.1, tw=font.widthOfTextAtSize(text,sz);
      pg.drawText(text, {x:(w-tw)/2,y:(h-sz)/2,size:sz,font,color:colorMap[colorId]||colorMap.gray,opacity,rotate:PL.degrees(45)});
    });
    dl(await doc.save(), 'watermarked.pdf');
    st('watermark','✅ Watermark added!','success');
  } catch(e) { st('watermark','❌ '+e.message,'error'); }
}

// PROTECT
async function protectPDF() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['protect'];
  if (!files || !files.length) { st('protect','⚠️ Add a PDF file.','error'); return; }
  const p1=document.getElementById('protect-pass').value, p2=document.getElementById('protect-pass2').value;
  if (!p1) { st('protect','⚠️ Enter a password.','error'); return; }
  if (p1!==p2) { st('protect','❌ Passwords do not match.','error'); return; }
  st('protect','⏳ Encrypting...','info');
  try {
    const doc = await PL.PDFDocument.load(await readAB(files[0]), { ignoreEncryption:true });
    const bytes = await doc.save({userPassword:p1,ownerPassword:p1+'_o',permissions:{printing:'lowResolution',copying:false,modifying:false}});
    dl(bytes, 'protected.pdf');
    st('protect','✅ PDF protected with password!','success');
  } catch(e) { st('protect','❌ '+e.message,'error'); }
}

// UNLOCK
async function unlockPDF() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['unlock'];
  if (!files || !files.length) { st('unlock','⚠️ Add a PDF file.','error'); return; }
  const pass = document.getElementById('unlock-pass').value;
  st('unlock','⏳ Unlocking...','info');
  try {
    const doc = await PL.PDFDocument.load(await readAB(files[0]), {password:pass});
    dl(await doc.save(), 'unlocked.pdf');
    st('unlock','✅ PDF unlocked!','success');
  } catch(e) { st('unlock','❌ Wrong password or not encrypted.','error'); }
}

// PAGE NUMBERS
async function addPageNumbers() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['pagenums'];
  if (!files || !files.length) { st('pagenums','⚠️ Add a PDF file.','error'); return; }
  const pos = document.getElementById('pn-pos').value;
  const startNum = +document.getElementById('pn-start').value || 1;
  const fmt = document.getElementById('pn-format').value;
  st('pagenums','⏳ Adding page numbers...','info');
  try {
    const doc = await PL.PDFDocument.load(await readAB(files[0]), { ignoreEncryption:true });
    const font = await doc.embedFont(PL.StandardFonts.Helvetica);
    const total = doc.getPageCount();
    doc.getPages().forEach((pg, i) => {
      const {width:w,height:h} = pg.getSize();
      const n = startNum+i;
      let label = String(n);
      if (fmt==='of') label = `${n} of ${startNum+total-1}`;
      else if (fmt==='p') label = `Page ${n}`;
      const sz=10, tw=font.widthOfTextAtSize(label,sz);
      const positions = {bc:[(w-tw)/2,20],br:[w-tw-20,20],tc:[(w-tw)/2,h-25],tr:[w-tw-20,h-25]};
      const [x,y] = positions[pos]||positions.bc;
      pg.drawText(label, {x,y,size:sz,font,color:PL.rgb(.35,.35,.35)});
    });
    dl(await doc.save(), 'numbered.pdf');
    st('pagenums','✅ Page numbers added!','success');
  } catch(e) { st('pagenums','❌ '+e.message,'error'); }
}

// COMPRESS
async function compressPDF() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['compress'];
  if (!files || !files.length) { st('compress','⚠️ Add a PDF file.','error'); return; }
  st('compress','⏳ Compressing...','info');
  try {
    const doc = await PL.PDFDocument.load(await readAB(files[0]), { ignoreEncryption:true });
    const bytes = await doc.save({useObjectStreams:true,addDefaultPage:false});
    dl(bytes, 'compressed.pdf');
    const orig=files[0].size, saved=Math.round((1-bytes.length/orig)*100);
    st('compress',`✅ ${fmtSize(orig)} → ${fmtSize(bytes.length)} ${saved>0?'('+saved+'% smaller)':'(already optimized)'}`, 'success');
  } catch(e) { st('compress','❌ '+e.message,'error'); }
}

// SIGN
let sigCtx, sigDrawing=false;
function initSignature() {
  const c = document.getElementById('sig-canvas');
  if (!c) return;
  sigCtx = c.getContext('2d');
  sigCtx.strokeStyle='#ffffff'; sigCtx.lineWidth=2.5; sigCtx.lineCap='round'; sigCtx.lineJoin='round';
  const gp=(canvas,e)=>{ const r=canvas.getBoundingClientRect(),sx=canvas.width/r.width,sy=canvas.height/r.height; return [(e.clientX-r.left)*sx,(e.clientY-r.top)*sy]; };
  c.addEventListener('mousedown', e=>{sigDrawing=true;sigCtx.beginPath();sigCtx.moveTo(...gp(c,e));});
  c.addEventListener('mousemove', e=>{if(!sigDrawing)return;sigCtx.lineTo(...gp(c,e));sigCtx.stroke();});
  c.addEventListener('mouseup', ()=>sigDrawing=false);
  c.addEventListener('mouseleave', ()=>sigDrawing=false);
  // Touch support
  c.addEventListener('touchstart', e=>{e.preventDefault();sigDrawing=true;const t=e.touches[0];sigCtx.beginPath();sigCtx.moveTo(...gp(c,t));});
  c.addEventListener('touchmove', e=>{e.preventDefault();if(!sigDrawing)return;const t=e.touches[0];sigCtx.lineTo(...gp(c,t));sigCtx.stroke();});
  c.addEventListener('touchend', ()=>sigDrawing=false);
}
function clearSig() { const c=document.getElementById('sig-canvas'); if(c&&sigCtx) sigCtx.clearRect(0,0,c.width,c.height); }
function setSigColor(col) { if(sigCtx) sigCtx.strokeStyle=col; }

async function signPDF() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['sign'];
  if (!files || !files.length) { st('sign','⚠️ Add a PDF file.','error'); return; }
  const canvas = document.getElementById('sig-canvas');
  const pageNum = +document.getElementById('sign-page').value || 1;
  const pos = document.getElementById('sign-pos').value;
  st('sign','⏳ Embedding signature...','info');
  try {
    const dataUrl=canvas.toDataURL('image/png');
    const b64=dataUrl.split(',')[1];
    const sigBytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    const doc=await PL.PDFDocument.load(await readAB(files[0]),{ignoreEncryption:true});
    const pages=doc.getPages();
    const pg=pages[Math.min(pageNum-1,pages.length-1)];
    const {width:w,height:h}=pg.getSize();
    const img=await doc.embedPng(sigBytes);
    const sw=130, sh=45;
    const positions={br:[w-sw-20,20],bl:[20,20],bc:[(w-sw)/2,20],tr:[w-sw-20,h-sh-20]};
    const [x,y]=positions[pos]||positions.br;
    pg.drawImage(img,{x,y,width:sw,height:sh});
    dl(await doc.save(),'signed.pdf');
    st('sign','✅ Signature added on page '+pageNum+'!','success');
  } catch(e) { st('sign','❌ '+e.message,'error'); }
}

// REDACT
async function redactPDF() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['redact'];
  if (!files || !files.length) { st('redact','⚠️ Add a PDF file.','error'); return; }
  const pageNum=+document.getElementById('redact-page').value||1;
  const x=+document.getElementById('redact-x').value||100;
  const y=+document.getElementById('redact-y').value||100;
  const w=+document.getElementById('redact-w').value||200;
  const h=+document.getElementById('redact-h').value||20;
  st('redact','⏳ Applying redaction...','info');
  try {
    const doc=await PL.PDFDocument.load(await readAB(files[0]),{ignoreEncryption:true});
    const pages=doc.getPages();
    const pg=pages[Math.min(pageNum-1,pages.length-1)];
    pg.drawRectangle({x,y,width:w,height:h,color:PL.rgb(0,0,0)});
    dl(await doc.save(),'redacted.pdf');
    st('redact','✅ Redaction applied!','success');
  } catch(e) { st('redact','❌ '+e.message,'error'); }
}

// CROP
async function cropPDF() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['crop'];
  if (!files || !files.length) { st('crop','⚠️ Add a PDF file.','error'); return; }
  const top=+document.getElementById('crop-top').value||0;
  const bottom=+document.getElementById('crop-bottom').value||0;
  const left=+document.getElementById('crop-left').value||0;
  const right=+document.getElementById('crop-right').value||0;
  st('crop','⏳ Cropping...','info');
  try {
    const doc=await PL.PDFDocument.load(await readAB(files[0]),{ignoreEncryption:true});
    doc.getPages().forEach(pg=>{
      const {width:w,height:h}=pg.getSize();
      pg.setCropBox(left,bottom,w-left-right,h-top-bottom);
    });
    dl(await doc.save(),'cropped.pdf');
    st('crop','✅ PDF cropped!','success');
  } catch(e) { st('crop','❌ '+e.message,'error'); }
}

// ORGANIZE
async function loadOrganize(files) {
  const PL = getPL(); if (!PL) return;
  if (!files || !files.length) return;
  fileStore['organize']=[files[0]]; renderList('organize');
  st('organize','⏳ Loading pages...','info');
  try {
    const doc=await PL.PDFDocument.load(await readAB(files[0]),{ignoreEncryption:true});
    const n=doc.getPageCount();
    orgPageOrder=Array.from({length:n},(_,i)=>i);
    renderThumbs();
    document.getElementById('btn-organize').style.display='block';
    st('organize',`✅ ${n} pages loaded — drag to reorder!`,'success');
  } catch(e) { st('organize','❌ '+e.message,'error'); }
}
function renderThumbs() {
  const c=document.getElementById('org-thumbs');
  c.innerHTML=orgPageOrder.map((idx,i)=>`
    <div class="page-thumb" draggable="true" data-i="${i}">
      📄<span class="page-num">${idx+1}</span>
    </div>`).join('');
  c.querySelectorAll('.page-thumb').forEach(thumb=>{
    thumb.addEventListener('dragstart',()=>{ orgDragSrc=+thumb.dataset.i; thumb.classList.add('dragging'); });
    thumb.addEventListener('dragend',()=>thumb.classList.remove('dragging'));
    thumb.addEventListener('dragover',e=>e.preventDefault());
    thumb.addEventListener('drop',e=>orgDrop(e,+thumb.dataset.i));
  });
}
let orgDragSrc=null;
function orgDrop(e,i) {
  e.preventDefault();
  if(orgDragSrc===null||orgDragSrc===i) return;
  const m=orgPageOrder.splice(orgDragSrc,1)[0];
  orgPageOrder.splice(i,0,m);
  orgDragSrc=null; renderThumbs();
}
async function saveOrganized() {
  const PL=getPL(); if(!PL) return;
  const files=fileStore['organize'];
  if(!files||!files.length) return;
  st('organize','⏳ Saving order...','info');
  try {
    const src=await PL.PDFDocument.load(await readAB(files[0]),{ignoreEncryption:true});
    const out=await PL.PDFDocument.create();
    const copied=await out.copyPages(src,orgPageOrder);
    copied.forEach(p=>out.addPage(p));
    dl(await out.save(),'organized.pdf');
    st('organize','✅ Pages reordered & downloaded!','success');
  } catch(e) { st('organize','❌ '+e.message,'error'); }
}

// ═══════════════════════════════════════════════════════
//  NEW FEATURES
// ═══════════════════════════════════════════════════════

// EXTRACT TEXT
async function extractText() {
  const files = fileStore['extract'];
  if (!files || !files.length) { st('extract','⚠️ Add a PDF file.','error'); return; }
  const pdfjsLib = window.pdfjsLib;
  if (!pdfjsLib) { st('extract','⚠️ PDF.js not loaded.','error'); return; }
  st('extract','⏳ Extracting text...','info');
  try {
    const ab = await readAB(files[0]);
    const pdfDoc = await pdfjsLib.getDocument({data:new Uint8Array(ab)}).promise;
    const total = pdfDoc.numPages;
    const rangeStr = document.getElementById('extract-range').value.trim();
    const pageNums = rangeStr ? parseRange(rangeStr, total) : Array.from({length:total},(_,i)=>i+1);
    let allText = '';
    for (const n of pageNums) {
      const pg = await pdfDoc.getPage(n);
      const tc = await pg.getTextContent();
      const pageText = tc.items.map(i=>i.str).join(' ');
      allText += `\n--- Page ${n} ---\n${pageText}\n`;
    }
    extractedText = allText.trim();
    const out = document.getElementById('extract-output');
    out.style.display = 'block';
    out.textContent = extractedText || '(No text found — may be a scanned/image PDF)';
    document.getElementById('btn-extract-copy').style.display = 'flex';
    document.getElementById('btn-extract-dl').style.display = 'flex';
    st('extract', `✅ Text extracted from ${pageNums.length} page(s)!`, 'success');
  } catch(e) { st('extract','❌ '+e.message,'error'); }
}
function copyExtracted() {
  if (!extractedText) return;
  navigator.clipboard.writeText(extractedText).then(()=>{
    st('extract','✅ Copied to clipboard!','success');
  }).catch(()=>{
    st('extract','❌ Copy failed — try manual select.','error');
  });
}
function downloadExtracted() {
  if (!extractedText) return;
  const blob = new Blob([extractedText],{type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download='extracted_text.txt'; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
  st('extract','✅ Text file downloaded!','success');
}

// METADATA
async function loadMetadata(files) {
  const PL = getPL(); if (!PL) return;
  if (!files || !files.length) return;
  fileStore['metadata']=[files[0]]; renderList('metadata');
  st('metadata','⏳ Reading metadata...','info');
  try {
    const doc=await PL.PDFDocument.load(await readAB(files[0]),{ignoreEncryption:true});
    const info={
      'Title':     doc.getTitle()||'—',
      'Author':    doc.getAuthor()||'—',
      'Subject':   doc.getSubject()||'—',
      'Keywords':  doc.getKeywords()||'—',
      'Creator':   doc.getCreator()||'—',
      'Producer':  doc.getProducer()||'—',
      'Pages':     doc.getPageCount(),
      'Created':   doc.getCreationDate()?doc.getCreationDate().toLocaleDateString():'—',
      'Modified':  doc.getModificationDate()?doc.getModificationDate().toLocaleDateString():'—',
    };
    const table=document.getElementById('meta-table');
    table.innerHTML=Object.entries(info).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('');
    // Pre-fill editable fields
    document.getElementById('meta-title').value=doc.getTitle()||'';
    document.getElementById('meta-author').value=doc.getAuthor()||'';
    document.getElementById('meta-subject').value=doc.getSubject()||'';
    document.getElementById('meta-keywords').value=doc.getKeywords()||'';
    document.getElementById('meta-creator').value=doc.getCreator()||'';
    document.getElementById('meta-view').style.display='block';
    st('metadata','✅ Metadata loaded!','success');
  } catch(e) { st('metadata','❌ '+e.message,'error'); }
}
async function saveMetadata() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['metadata'];
  if (!files || !files.length) { st('metadata','⚠️ Add a PDF file first.','error'); return; }
  st('metadata','⏳ Saving metadata...','info');
  try {
    const doc=await PL.PDFDocument.load(await readAB(files[0]),{ignoreEncryption:true});
    const v=id=>document.getElementById(id).value.trim();
    if(v('meta-title'))   doc.setTitle(v('meta-title'));
    if(v('meta-author'))  doc.setAuthor(v('meta-author'));
    if(v('meta-subject')) doc.setSubject(v('meta-subject'));
    if(v('meta-keywords'))doc.setKeywords([v('meta-keywords')]);
    if(v('meta-creator')) doc.setCreator(v('meta-creator'));
    doc.setModificationDate(new Date());
    dl(await doc.save(),'metadata_updated.pdf');
    st('metadata','✅ Metadata saved & downloaded!','success');
  } catch(e) { st('metadata','❌ '+e.message,'error'); }
}

// HEADER / FOOTER
async function addHeaderFooter() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['headerfooter'];
  if (!files || !files.length) { st('headerfooter','⚠️ Add a PDF file.','error'); return; }
  const headerText = document.getElementById('hf-header').value;
  const footerText = document.getElementById('hf-footer').value;
  if (!headerText && !footerText) { st('headerfooter','⚠️ Enter header or footer text.','error'); return; }
  const align = document.getElementById('hf-align').value;
  const fontSize = +document.getElementById('hf-size').value || 10;
  const colorId = document.getElementById('hf-color').value;
  const colorMap = { black:PL.rgb(0,0,0), gray:PL.rgb(.5,.5,.5), blue:PL.rgb(.1,.2,.8), red:PL.rgb(.8,.1,.1) };
  const color = colorMap[colorId]||colorMap.black;
  st('headerfooter','⏳ Adding header/footer...','info');
  try {
    const doc=await PL.PDFDocument.load(await readAB(files[0]),{ignoreEncryption:true});
    const font=await doc.embedFont(PL.StandardFonts.Helvetica);
    const total=doc.getPageCount();
    doc.getPages().forEach((pg,i)=>{
      const {width:w,height:h}=pg.getSize();
      const n=i+1;
      const resolve=t=>t.replace('{page}',String(n)).replace('{total}',String(total));
      const drawLine=(text,y)=>{
        if (!text.trim()) return;
        const label=resolve(text);
        const tw=font.widthOfTextAtSize(label,fontSize);
        let x=20;
        if (align==='center') x=(w-tw)/2;
        else if (align==='right') x=w-tw-20;
        pg.drawText(label,{x,y,size:fontSize,font,color});
      };
      if (headerText) drawLine(headerText, h-fontSize-10);
      if (footerText) drawLine(footerText, 10);
    });
    dl(await doc.save(),'headerfooter.pdf');
    st('headerfooter','✅ Header/Footer added!','success');
  } catch(e) { st('headerfooter','❌ '+e.message,'error'); }
}

// FLATTEN
async function flattenPDF() {
  const PL = getPL(); if (!PL) return;
  const files = fileStore['flatten'];
  if (!files || !files.length) { st('flatten','⚠️ Add a PDF file.','error'); return; }
  st('flatten','⏳ Flattening PDF...','info');
  try {
    // pdf-lib flattens annotations when saving with flattenForm=true (where supported)
    // We reload & re-save with object streams to flatten most interactive elements
    const doc=await PL.PDFDocument.load(await readAB(files[0]),{ignoreEncryption:true});
    // Attempt to flatten AcroForm fields
    const form = doc.getForm ? doc.getForm() : null;
    if (form) {
      try { form.flatten(); } catch(_) {}
    }
    const bytes=await doc.save({useObjectStreams:true});
    dl(bytes,'flattened.pdf');
    st('flatten','✅ PDF flattened & downloaded!','success');
  } catch(e) { st('flatten','❌ '+e.message,'error'); }
}

// ═══════════════════════════════════════════════════════
//  CONVERT
// ═══════════════════════════════════════════════════════

// JPG → PDF
async function convertJpgToPdf() {
  const PL=getPL(); if(!PL) return;
  const files=fileStore['jpg2pdf'];
  if(!files||!files.length) { st('jpg2pdf','⚠️ Add image files.','error'); return; }
  const szId=document.getElementById('j2p-size').value;
  st('jpg2pdf','⏳ Converting...','info');
  try {
    const doc=await PL.PDFDocument.create();
    for (const f of files) {
      const du=await readDU(f);
      const b64=du.split(',')[1];
      const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
      const img=f.type==='image/png'?await doc.embedPng(bytes):await doc.embedJpg(bytes);
      let pw=595,ph=842;
      if(szId==='Letter'){pw=612;ph=792;}
      else if(szId==='fit'){pw=img.width;ph=img.height;}
      const pg=doc.addPage([pw,ph]);
      const sc=Math.min(pw/img.width,ph/img.height);
      pg.drawImage(img,{x:(pw-img.width*sc)/2,y:(ph-img.height*sc)/2,width:img.width*sc,height:img.height*sc});
    }
    dl(await doc.save(),'images.pdf');
    st('jpg2pdf',`✅ ${files.length} image(s) → PDF!`,'success');
  } catch(e) { st('jpg2pdf','❌ '+e.message,'error'); }
}

// PDF → JPG
async function convertPdfToJpg() {
  const files=fileStore['pdf2jpg'];
  if(!files||!files.length) { st('pdf2jpg','⚠️ Add a PDF file.','error'); return; }
  const scale=+document.getElementById('p2j-dpi').value||2;
  const pdfjsLib=window.pdfjsLib;
  if(!pdfjsLib) { st('pdf2jpg','⚠️ PDF.js not loaded.','error'); return; }
  st('pdf2jpg','⏳ Rendering pages...','info');
  try {
    const ab=await readAB(files[0]);
    const pdfDoc=await pdfjsLib.getDocument({data:new Uint8Array(ab)}).promise;
    const n=pdfDoc.numPages;
    const prog=document.getElementById('prog-pdf2jpg');
    for (let i=1;i<=n;i++) {
      const pg=await pdfDoc.getPage(i);
      const vp=pg.getViewport({scale});
      const canvas=document.createElement('canvas');
      canvas.width=vp.width; canvas.height=vp.height;
      await pg.render({canvasContext:canvas.getContext('2d'),viewport:vp}).promise;
      await new Promise(res=>canvas.toBlob(blob=>{
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a');
        a.href=url; a.download=`page_${i}.jpg`; a.click();
        setTimeout(()=>URL.revokeObjectURL(url),1000); res();
      },'image/jpeg',0.92));
      if(prog) prog.style.width=Math.round(i/n*100)+'%';
    }
    st('pdf2jpg',`✅ ${n} page(s) exported as JPG!`,'success');
  } catch(e) { st('pdf2jpg','❌ '+e.message,'error'); }
}

// HTML → PDF
function convertHtmlToPdf() {
  const src=document.getElementById('h2p-source').value;
  if(src==='tab') {
    if(typeof chrome!=='undefined'&&chrome.tabs) {
      chrome.tabs.query({active:true,currentWindow:true},tabs=>{
        chrome.tabs.sendMessage(tabs[0].id,{action:'printToPDF'});
      });
    }
    st('html2pdf','✅ Use Ctrl+P → Save as PDF on the current tab.','success');
  } else {
    const html=document.getElementById('h2p-code').value;
    if(!html.trim()){st('html2pdf','⚠️ Paste HTML code first.','error');return;}
    const w=window.open('','_blank');
    w.document.write(html); w.document.close();
    setTimeout(()=>w.print(),400);
    st('html2pdf','✅ Print dialog opened — choose Save as PDF.','success');
  }
}

// Text → PDF
function loadTxtFile(files) {
  if(!files||!files.length) return;
  const fr=new FileReader();
  fr.onload=e=>document.getElementById('txt2pdf-content').value=e.target.result;
  fr.readAsText(files[0]);
}
async function convertTxtToPdf() {
  const PL=getPL(); if(!PL) return;
  const text=document.getElementById('txt2pdf-content').value.trim();
  if(!text){st('txt2pdf','⚠️ Enter some text.','error');return;}
  st('txt2pdf','⏳ Creating PDF...','info');
  try {
    const doc=await PL.PDFDocument.create();
    const font=await doc.embedFont(PL.StandardFonts.Courier);
    const fs=11,lh=fs*1.5,mg=50,pw=595,ph=842,maxW=pw-mg*2;
    const lines=[];
    text.split('\n').forEach(line=>{
      const words=line.split(' '); let cur='';
      words.forEach(w=>{
        const t=cur?cur+' '+w:w;
        if(font.widthOfTextAtSize(t,fs)>maxW){lines.push(cur);cur=w;}else cur=t;
      });
      lines.push(cur);
    });
    let pg=doc.addPage([pw,ph]),y=ph-mg;
    lines.forEach(line=>{
      if(y<mg+lh){pg=doc.addPage([pw,ph]);y=ph-mg;}
      pg.drawText(line,{x:mg,y,size:fs,font,color:PL.rgb(.1,.1,.1)});
      y-=lh;
    });
    dl(await doc.save(),'document.pdf');
    st('txt2pdf','✅ PDF created!','success');
  } catch(e){st('txt2pdf','❌ '+e.message,'error');}
}

// ═══════════════════════════════════════════════════════
//  SAR FORM
// ═══════════════════════════════════════════════════════
const SAR_FIELDS=['section','date','title','edate','location','participants','ieeem','sdg','desc','impact','author'];

function saveSARDraft() {
  const data={};
  SAR_FIELDS.forEach(k=>{const el=document.getElementById('sar-'+k); if(el) data[k]=el.value;});
  if(typeof chrome!=='undefined'&&chrome.storage) chrome.storage.local.set({sarDraft:data});
  const s=document.getElementById('sar-status');
  if(s){s.className='status success';s.textContent='💾 Draft saved!';setTimeout(()=>s.className='status',2000);}
}
function loadSARDraft() {
  if(typeof chrome==='undefined'||!chrome.storage) return;
  chrome.storage.local.get('sarDraft',r=>{
    if(!r.sarDraft) return;
    SAR_FIELDS.forEach(k=>{const el=document.getElementById('sar-'+k); if(el&&r.sarDraft[k]) el.value=r.sarDraft[k];});
  });
}
async function generateSAR() {
  const PL=getPL(); if(!PL) return;
  const get=id=>document.getElementById(id)?.value||'';
  const d={
    section:get('sar-section'),date:get('sar-date'),title:get('sar-title'),
    edate:get('sar-edate'),location:get('sar-location'),
    participants:get('sar-participants'),ieeem:get('sar-ieeem'),
    sdg:get('sar-sdg'),desc:get('sar-desc'),impact:get('sar-impact'),author:get('sar-author')
  };
  if(!d.title||!d.section){
    const el=document.getElementById('sar-status');
    if(el){el.className='status error';el.textContent='⚠️ Fill in Section name and Activity title.';}
    return;
  }
  const el=document.getElementById('sar-status');
  if(el){el.className='status info';el.textContent='⏳ Generating SAR PDF...';}
  try {
    const doc=await PL.PDFDocument.create();
    const pg=doc.addPage([595,842]);
    const {width:W,height:H}=pg.getSize();
    const bold=await doc.embedFont(PL.StandardFonts.HelveticaBold);
    const reg=await doc.embedFont(PL.StandardFonts.Helvetica);
    const dBlue=PL.rgb(0,.22,.5),black=PL.rgb(.1,.1,.1),gray=PL.rgb(.5,.5,.5);
    const white=PL.rgb(1,1,1),lightBlue=PL.rgb(.94,.97,1);

    pg.drawRectangle({x:0,y:H-72,width:W,height:72,color:dBlue});
    pg.drawRectangle({x:0,y:H-74,width:W,height:2,color:PL.rgb(.24,.51,.84)});
    pg.drawText('IEEE SIGHT',{x:30,y:H-32,size:20,font:bold,color:white});
    pg.drawText('Special Interest Group on Humanitarian Technology',{x:30,y:H-50,size:9,font:reg,color:PL.rgb(.75,.88,1)});
    pg.drawText('SIGHT Activity Report',{x:W-185,y:H-35,size:13,font:bold,color:white});
    pg.drawText(`Generated: ${new Date().toLocaleDateString()}`,{x:W-185,y:H-52,size:8,font:reg,color:PL.rgb(.75,.88,1)});

    const field=(label,val,x,y,w=250)=>{
      pg.drawText(label.toUpperCase(),{x,y:y+2,size:7,font:bold,color:gray});
      pg.drawRectangle({x,y:y-16,width:w,height:15,color:lightBlue,borderColor:PL.rgb(.8,.88,1),borderWidth:.5});
      pg.drawText(val||'—',{x:x+5,y:y-11,size:9.5,font:reg,color:black});
    };
    const block=(label,val,x,y,w=535,rows=2)=>{
      pg.drawText(label.toUpperCase(),{x,y:y+2,size:7,font:bold,color:gray});
      const bh=rows*13+5;
      pg.drawRectangle({x,y:y-bh,width:w,height:bh,color:lightBlue,borderColor:PL.rgb(.8,.88,1),borderWidth:.5});
      const words=(val||'—').split(' ');let line='',lines=[],mw=w-12;
      words.forEach(w2=>{const t=line?line+' '+w2:w2;if(reg.widthOfTextAtSize(t,9.5)>mw){lines.push(line);line=w2;}else line=t;}); lines.push(line);
      lines.slice(0,rows).forEach((l,i)=>pg.drawText(l,{x:x+5,y:y-12-i*13,size:9.5,font:reg,color:black}));
    };
    const hdr=(text,y)=>{
      pg.drawRectangle({x:28,y:y-2,width:W-56,height:16,color:PL.rgb(.9,.95,1)});
      pg.drawText(text,{x:32,y:y+1,size:10,font:bold,color:dBlue});
    };

    let cy=H-92;
    hdr('Event Information',cy); cy-=22;
    field('Section / Branch Name',d.section,30,cy,255); field('Report Date',d.date,300,cy,265); cy-=34;
    field('Activity / Event Title',d.title,30,cy,535); cy-=34;
    field('Event Date',d.edate,30,cy,255); field('Location',d.location,300,cy,265); cy-=34;
    field('Total Participants',d.participants,30,cy,255); field('IEEE Members',d.ieeem,300,cy,265); cy-=34;
    field('UN SDG Alignment',d.sdg,30,cy,535); cy-=44;
    hdr('Activity Details',cy); cy-=22;
    block('Activity Description',d.desc,30,cy,535,3); cy-=57;
    block('Impact / Outcomes',d.impact,30,cy,535,2); cy-=46;
    hdr('Submission',cy); cy-=22;
    field('Submitted By',d.author,30,cy,255);
    cy-=35;
    pg.drawText('Signature:',{x:30,y:cy,size:9,font:bold,color:gray});
    pg.drawLine({start:{x:90,y:cy},end:{x:280,y:cy},thickness:.5,color:gray});
    pg.drawText('Date:',{x:310,y:cy,size:9,font:bold,color:gray});
    pg.drawLine({start:{x:340,y:cy},end:{x:535,y:cy},thickness:.5,color:gray});
    pg.drawRectangle({x:0,y:0,width:W,height:36,color:PL.rgb(.95,.97,1)});
    pg.drawLine({start:{x:0,y:36},end:{x:W,y:36},thickness:.5,color:PL.rgb(.8,.88,1)});
    pg.drawText('IEEE SIGHT — sight.ieee.org | IEEE DIU Student Branch SIGHT Group | Bangladesh Section',{x:20,y:13,size:7.5,font:reg,color:gray});

    const bytes=await doc.save();
    dl(bytes,`SAR_${(d.title||'report').replace(/\s+/g,'_')}.pdf`);
    if(el){el.className='status success';el.textContent='✅ SAR PDF generated & downloaded!';}
  } catch(err) {
    if(el){el.className='status error';el.textContent='❌ '+err.message;}
  }
}
