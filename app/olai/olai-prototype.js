// Olai·AI prototype — client-side logic extracted from olaiprototype/olai-ai-prototype.html
// Runs the restoration workbench against a DOM root passed in by the React host.

export function initOlaiPrototype(root) {
  if (!root) return;
  if (root.dataset.olaiInitialized) return;
  root.dataset.olaiInitialized = "1";

/* ============================= RNG ============================= */
function mulberry32(seed){
  return function(){
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ============================= SAMPLE DATA ============================= */
// Ten leaves from the demo dataset (olaiprototype/dataset/*.jpg). Each photo
// is mapped to the Tamil line with the same number in text.txt.
const SAMPLES = [
  {
    id: "leaf1",
    title: "Birthday greeting leaf",
    desc: "Dataset photo 1",
    image: "dataset/1.jpg",
    damage: 0.57,
    text: "இனிய பிறந்த நாள் வாழ்த்துக்கள் தல",
    modern: "இனிய பிறந்த நாள் வாழ்த்துக்கள் தல",
    english: "Wishing you a happy birthday, boss.",
    context: "Leaf 1 from the demo dataset. Text: இனிய பிறந்த நாள் வாழ்த்துக்கள் தல — restoration and translation are simulated in this prototype."
  },
  {
    id: "leaf2",
    title: "Temple-era observation leaf",
    desc: "Dataset photo 2",
    image: "dataset/2.jpg",
    damage: 0.69,
    text: "இந்தக் காலத்தில் கோவில்கள்",
    modern: "இந்தக் காலத்தில் கோவில்கள்",
    english: "In these times, temples...",
    context: "Leaf 2 from the demo dataset. Text: இந்தக் காலத்தில் கோவில்கள் — restoration and translation are simulated in this prototype."
  },
  {
    id: "leaf3",
    title: "Folk saying — digestion",
    desc: "Dataset photo 3",
    image: "dataset/3.jpg",
    damage: 0.45,
    text: "உண்ட உணவு வயிற்றுக்குள் செல்லும் முன் மீண்டும் வேலை",
    modern: "உண்ட உணவு வயிற்றுக்குள் செல்லும் முன் மீண்டும் வேலை",
    english: "The food you ate begins working again before it reaches the stomach.",
    context: "Leaf 3 from the demo dataset. Text: உண்ட உணவு வயிற்றுக்குள் செல்லும் முன் மீண்டும் வேலை — restoration and translation are simulated in this prototype."
  },
  {
    id: "leaf4",
    title: "Reflection on selfishness",
    desc: "Dataset photo 4",
    image: "dataset/4.jpg",
    damage: 0.57,
    text: "இந்த சுயநலமும் பொறாமையும் இருக்கும் வரை",
    modern: "இந்த சுயநலமும் பொறாமையும் இருக்கும் வரை",
    english: "As long as this selfishness and envy remain...",
    context: "Leaf 4 from the demo dataset. Text: இந்த சுயநலமும் பொறாமையும் இருக்கும் வரை — restoration and translation are simulated in this prototype."
  },
  {
    id: "leaf5",
    title: "Erikal lake — first life",
    desc: "Dataset photo 5",
    image: "dataset/5.jpg",
    damage: 0.69,
    text: "எரிகல் ஏரியின் முதல் உயிர்",
    modern: "எரிகல் ஏரியின் முதல் உயிர்",
    english: "The first life of the Erikal lake.",
    context: "Leaf 5 from the demo dataset. Text: எரிகல் ஏரியின் முதல் உயிர் — restoration and translation are simulated in this prototype."
  },
  {
    id: "leaf6",
    title: "Thoothukudi rain report",
    desc: "Dataset photo 6",
    image: "dataset/6.jpg",
    damage: 0.45,
    text: "தூத்துக்குடி மாவட்டத்தில் பரவலாக பலத்த மழை வாகன ஓட்டிகள் சிரமம்",
    modern: "தூத்துக்குடி மாவட்டத்தில் பரவலாக பலத்த மழை வாகன ஓட்டிகள் சிரமம்",
    english: "Heavy rain widespread across Thoothukudi district; drivers in difficulty.",
    context: "Leaf 6 from the demo dataset. Text: தூத்துக்குடி மாவட்டத்தில் பரவலாக பலத்த மழை வாகன ஓட்டிகள் சிரமம் — restoration and translation are simulated in this prototype."
  },
  {
    id: "leaf7",
    title: "Proverb leaf — justice",
    desc: "Dataset photo 7",
    image: "dataset/7.jpg",
    damage: 0.57,
    text: "நியாயம் செய்து விடும்",
    modern: "நியாயம் செய்து விடும்",
    english: "Justice will prevail.",
    context: "Leaf 7 from the demo dataset. Text: நியாயம் செய்து விடும் — restoration and translation are simulated in this prototype."
  },
  {
    id: "leaf8",
    title: "Forest journey tale",
    desc: "Dataset photo 8",
    image: "dataset/8.jpg",
    damage: 0.69,
    text: "அவனும் சம்மதித்து காட்டுக்கு அழைத்து சென்றபோது திடீர் என மனைவி காட்டு வழியில்",
    modern: "அவனும் சம்மதித்து காட்டுக்கு அழைத்து சென்றபோது திடீர் என மனைவி காட்டு வழியில்",
    english: "When he agreed and took them to the forest, suddenly the wife, on the forest path...",
    context: "Leaf 8 from the demo dataset. Text: அவனும் சம்மதித்து காட்டுக்கு அழைத்து சென்றபோது திடீர் என மனைவி காட்டு வழியில் — restoration and translation are simulated in this prototype."
  },
  {
    id: "leaf9",
    title: "Truth and three keepers",
    desc: "Dataset photo 9",
    image: "dataset/9.jpg",
    damage: 0.45,
    text: "நீ உண்மை பேசியதால் மூன்றுபேரையும் வைத்திரு என்பீர்கள்",
    modern: "நீ உண்மை பேசியதால் மூன்றுபேரையும் வைத்திரு என்பீர்கள்",
    english: "Because you spoke the truth, you will be told to keep all three.",
    context: "Leaf 9 from the demo dataset. Text: நீ உண்மை பேசியதால் மூன்றுபேரையும் வைத்திரு என்பீர்கள் — restoration and translation are simulated in this prototype."
  },
  {
    id: "leaf10",
    title: "Request letter fragment",
    desc: "Dataset photo 10",
    image: "dataset/10.jpg",
    damage: 0.57,
    text: "உங்கள் வேண்டுகோள்",
    modern: "உங்கள் வேண்டுகோள்",
    english: "Your request.",
    context: "Leaf 10 from the demo dataset. Text: உங்கள் வேண்டுகோள் — restoration and translation are simulated in this prototype."
  }
];

/* ============================= STATE ============================= */
let state = {
  step: 1,
  sampleIndex: 0,
  customImage: null,
  filters: { contrast:false, denoise:false, sharpen:false },
  heatmapOn: false,
  damageReport: null,
  restorationWords: null,
  restorationDone: false,
  archive: SAMPLES.slice(0, 3).map(s=>({ title: s.title, text: s.text, translation: s.english }))
};

/* ============================= LEAF RENDERER ============================= */
function drawLeaf(canvas, seed, damageLevel, filters={}){
  const rnd = mulberry32(seed);
  const w = canvas.width, h = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,w,h);

  // base parchment gradient
  const grad = ctx.createLinearGradient(0,0,w,h);
  grad.addColorStop(0, '#e9deb9');
  grad.addColorStop(0.5, '#dcc998');
  grad.addColorStop(1, '#c9b077');
  ctx.fillStyle = grad;
  roundRect(ctx, 4,4,w-8,h-8, 18);
  ctx.fill();

  // fiber lines
  ctx.strokeStyle = 'rgba(120,100,60,0.25)';
  ctx.lineWidth = 1;
  for(let y=14; y<h-10; y+=6){
    ctx.beginPath();
    ctx.moveTo(10, y + (rnd()-0.5)*2);
    for(let x=10;x<w-10;x+=30){ ctx.lineTo(x, y + (rnd()-0.5)*3); }
    ctx.stroke();
  }

  // age speckles
  for(let i=0;i<120;i++){
    ctx.fillStyle = `rgba(90,70,40,${0.03+rnd()*0.08})`;
    ctx.beginPath();
    ctx.arc(rnd()*w, rnd()*h, rnd()*1.6, 0, 7);
    ctx.fill();
  }

  // simulated script strokes (abstract, not real glyphs)
  ctx.strokeStyle = 'rgba(40,30,15,0.55)';
  ctx.lineWidth = 1.4;
  for(let row=0; row<Math.floor((h-40)/26); row++){
    let x = 20;
    const y = 30 + row*26;
    while(x < w-24){
      ctx.beginPath();
      const cw = 6 + rnd()*10;
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x+cw*0.3, y-6-rnd()*4, x+cw*0.6, y+2);
      ctx.quadraticCurveTo(x+cw*0.85, y+8, x+cw, y-2);
      ctx.stroke();
      x += cw + 3 + rnd()*3;
    }
  }

  // damage: insect holes
  const holes = Math.floor(damageLevel * 14);
  for(let i=0;i<holes;i++){
    const hx = 20 + rnd()*(w-40), hy = 20 + rnd()*(h-40), r = 2+rnd()*4;
    ctx.fillStyle = '#3a2f1e';
    ctx.beginPath(); ctx.arc(hx,hy,r,0,7); ctx.fill();
    ctx.strokeStyle = 'rgba(90,70,40,0.5)';
    ctx.beginPath(); ctx.arc(hx,hy,r+2,0,7); ctx.stroke();
  }

  // damage: cracks
  const cracks = Math.floor(damageLevel * 5);
  for(let i=0;i<cracks;i++){
    let x = rnd()*w, y = rnd()*h;
    ctx.strokeStyle = 'rgba(245,238,215,0.85)';
    ctx.lineWidth = 1.5 + rnd()*1.5;
    ctx.beginPath(); ctx.moveTo(x,y);
    for(let j=0;j<6;j++){ x += (rnd()-0.5)*30; y += (rnd()-0.5)*30; ctx.lineTo(x,y); }
    ctx.stroke();
  }

  // damage: fade patches
  const fades = Math.floor(damageLevel * 4);
  for(let i=0;i<fades;i++){
    const fx = rnd()*w, fy = rnd()*h, fr = 15+rnd()*30;
    const fg = ctx.createRadialGradient(fx,fy,0,fx,fy,fr);
    fg.addColorStop(0,'rgba(238,230,205,0.7)');
    fg.addColorStop(1,'rgba(238,230,205,0)');
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.arc(fx,fy,fr,0,7); ctx.fill();
  }

  // leaf border
  ctx.strokeStyle = 'rgba(90,70,40,0.35)';
  ctx.lineWidth = 2;
  roundRect(ctx, 4,4,w-8,h-8, 18);
  ctx.stroke();

  // ---- filters (applied as post pixel ops, real computation) ----
  if(filters.contrast || filters.denoise || filters.sharpen){
    let imgData = ctx.getImageData(0,0,w,h);
    if(filters.denoise) imgData = boxBlur(imgData, w, h, 1);
    if(filters.contrast) imgData = adjustContrast(imgData, 35);
    if(filters.sharpen) imgData = sharpen(imgData, w, h);
    ctx.putImageData(imgData,0,0);
  }

  return { holes, cracks, fades };
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

function adjustContrast(imgData, amount){
  const d = imgData.data;
  const factor = (259*(amount+255))/(255*(259-amount));
  for(let i=0;i<d.length;i+=4){
    d[i]   = clamp(factor*(d[i]-128)+128);
    d[i+1] = clamp(factor*(d[i+1]-128)+128);
    d[i+2] = clamp(factor*(d[i+2]-128)+128);
  }
  return imgData;
}
function clamp(v){ return Math.max(0,Math.min(255,v)); }

function boxBlur(imgData,w,h,radius){
  const src = imgData.data;
  const out = new Uint8ClampedArray(src.length);
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      let r=0,g=0,b=0,a=0,count=0;
      for(let dy=-radius;dy<=radius;dy++){
        for(let dx=-radius;dx<=radius;dx++){
          const nx=x+dx, ny=y+dy;
          if(nx>=0&&nx<w&&ny>=0&&ny<h){
            const idx=(ny*w+nx)*4;
            r+=src[idx]; g+=src[idx+1]; b+=src[idx+2]; a+=src[idx+3]; count++;
          }
        }
      }
      const oidx=(y*w+x)*4;
      out[oidx]=r/count; out[oidx+1]=g/count; out[oidx+2]=b/count; out[oidx+3]=a/count;
    }
  }
  return new ImageData(out,w,h);
}

function sharpen(imgData,w,h){
  const src = imgData.data;
  const out = new Uint8ClampedArray(src.length);
  const kernel = [0,-0.5,0,-0.5,3,-0.5,0,-0.5,0];
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      for(let c=0;c<3;c++){
        let sum=0, k=0;
        for(let dy=-1;dy<=1;dy++){
          for(let dx=-1;dx<=1;dx++){
            const nx=Math.min(w-1,Math.max(0,x+dx)), ny=Math.min(h-1,Math.max(0,y+dy));
            sum += src[(ny*w+nx)*4+c]*kernel[k]; k++;
          }
        }
        out[(y*w+x)*4+c] = clamp(sum);
      }
      out[(y*w+x)*4+3] = src[(y*w+x)*4+3];
    }
  }
  return new ImageData(out,w,h);
}

/* small thumbnail renders for picker */
function renderThumbs(){
  SAMPLES.forEach((s, i) => {
    const c = root.querySelector("#thumb-" + i);
    if(c) drawThumb(c, s.image);
  });
}

/* load a dataset photo into a thumbnail canvas (object-fit cover) */
function drawThumb(canvas, src){
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = ()=>{
    const w = canvas.width, h = canvas.height;
    const scale = Math.max(w / img.width, h / img.height);
    const dw = img.width * scale, dh = img.height * scale;
    ctx.clearRect(0,0,w,h);
    ctx.drawImage(img, (w-dw)/2, (h-dh)/2, dw, dh);
  };
  img.src = src;
}

/* ============================= STEP RENDERERS ============================= */
const stage = root.querySelector("#stage");
const inspector = root.querySelector("#inspector");

function damageBadge(level){
  if(level < 0.4) return '<span class="badge low">low damage</span>';
  if(level < 0.6) return '<span class="badge med">moderate damage</span>';
  return '<span class="badge high">severe damage</span>';
}

function render(){
  root.querySelectorAll('.step').forEach(el=>{
    const n = parseInt(el.dataset.step);
    el.classList.toggle('active', n===state.step);
    el.classList.toggle('done', n < state.step || (n===4 && state.restorationDone));
  });

  if(state.step===1) renderStep1();
  else if(state.step===2) renderStep2();
  else if(state.step===3) renderStep3();
  else if(state.step===4) renderStep4();
  else if(state.step===5) renderStep5();
  else if(state.step===6) renderStep6();
}

function stageHead(eyebrow,title,sub){
  return `<div class="stage-head">
    <div class="stage-eyebrow">${eyebrow}</div>
    <div class="stage-title">${title}</div>
    <div class="stage-sub">${sub}</div>
  </div>`;
}

/* --- STEP 1: select --- */
function renderStep1(){
  stage.innerHTML = stageHead('Step 1', 'Select a palm leaf', 'Choose a sample manuscript from the archive, or scan your own. Everything below runs live in your browser.') +
    `<div class="sample-grid">` +
    SAMPLES.map((s,i)=>`
      <div class="sample-card ${i===state.sampleIndex && !state.customImage ? 'selected':''}" data-idx="${i}" tabindex="0">
        <canvas id="thumb-${i}" width="220" height="130"></canvas>
      </div>`).join('') +
    `</div>
    <div class="upload-zone" id="uploadZone">
      <div style="font-weight:600;color:var(--ink);margin-bottom:4px;">Upload your own leaf photo</div>
      Drop an image here or click to browse (JPG/PNG). Preprocessing &amp; damage diagnosis run for real on it.
      <input type="file" id="fileInput" accept="image/*" style="display:none;">
    </div>`;

  renderThumbs();

  root.querySelectorAll('.sample-card').forEach(card=>{
    card.addEventListener('click', ()=>{ state.sampleIndex = parseInt(card.dataset.idx); state.customImage=null; resetPipeline(); goStep(2); });
    card.addEventListener('keydown', e=>{ if(e.key==='Enter') card.click(); });
  });
  const zone = root.querySelector("#uploadZone");
  const fileInput = root.querySelector("#fileInput");
  zone.addEventListener('click', ()=>fileInput.click());
  fileInput.addEventListener('change', e=>{
    const file = e.target.files[0];
    if(!file) return;
    const img = new Image();
    img.onload = ()=>{ state.customImage = img; resetPipeline(); goStep(2); };
    img.src = URL.createObjectURL(file);
  });

  inspector.innerHTML = `
    <div class="card">
      <h4>Why start here</h4>
      <p style="font-size:13px;color:var(--ink-soft);line-height:1.6;">Most collections lose material before anyone reads it. Getting a high-fidelity scan is step one — restoration and translation only matter if the leaf survives long enough to be digitized.</p>
    </div>
    <div class="card">
      <h4>Archive snapshot</h4>
      <div class="kv"><span class="k">Sample leaves loaded</span><span class="v">${SAMPLES.length}</span></div>
      <div class="kv"><span class="k">Restored &amp; searchable</span><span class="v">${state.archive.length}</span></div>
    </div>`;
}

function resetPipeline(){
  state.filters = { contrast:false, denoise:false, sharpen:false };
  state.heatmapOn = false;
  state.damageReport = null;
  state.restorationWords = null;
  state.restorationDone = false;
}

/* --- STEP 2: preprocess --- */
function renderStep2(){
  const sample = state.customImage ? null : SAMPLES[state.sampleIndex];
  stage.innerHTML = stageHead('Step 2', 'Preprocess the scan', 'Toggle real image-processing filters — contrast enhancement, fiber-noise denoising, and edge sharpening — computed live on the pixels below.') +
    `<div class="canvas-wrap">
      <canvas id="leafCanvas" width="640" height="360"></canvas>
      <div class="toggle-row">
        <div class="chip ${state.filters.contrast?'on':''}" data-f="contrast">Contrast boost</div>
        <div class="chip ${state.filters.denoise?'on':''}" data-f="denoise">Fiber denoise</div>
        <div class="chip ${state.filters.sharpen?'on':''}" data-f="sharpen">Edge sharpen</div>
      </div>
    </div>
    <div style="margin-top:18px;display:flex;justify-content:flex-end;">
      <button class="btn primary" id="toStep3">Run damage diagnosis →</button>
    </div>`;

  paintCanvas();
  root.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      const f = chip.dataset.f;
      state.filters[f] = !state.filters[f];
      chip.classList.toggle('on');
      paintCanvas();
    });
  });
  root.querySelector("#toStep3").addEventListener('click', ()=>goStep(3));

  inspector.innerHTML = `
    <div class="card">
      <h4>What's happening</h4>
      <p style="font-size:13px;color:var(--ink-soft);line-height:1.6;">Each toggle runs a real per-pixel operation on the canvas: contrast stretching, a box-blur denoise pass, and a convolution sharpen kernel — the same category of preprocessing a production OCR pipeline runs before segmentation.</p>
    </div>
    <div class="card">
      <h4>Source</h4>
      <div class="kv"><span class="k">Type</span><span class="v">${sample ? 'Sample leaf' : 'Uploaded image'}</span></div>
      ${sample ? `<div class="kv"><span class="k">Title</span><span class="v">${sample.title}</span></div>` : ''}
    </div>`;
}

function paintCanvas(){
  const canvas = root.querySelector("#leafCanvas");
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let srcImg = state.customImage || loadSampleImage();
  if(!srcImg) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawCover(srcImg, canvas);
  let imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
  if(state.filters.denoise) imgData = boxBlur(imgData, canvas.width, canvas.height, 1);
  if(state.filters.contrast) imgData = adjustContrast(imgData, 35);
  if(state.filters.sharpen) imgData = sharpen(imgData, canvas.width, canvas.height);
  ctx.putImageData(imgData,0,0);
}

/* object-fit: cover draw of an image into a canvas */
function drawCover(img, canvas){
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale, dh = img.height * scale;
  ctx.drawImage(img, (w-dw)/2, (h-dh)/2, dw, dh);
}

/* shared cached Image per sample so re-renders don't reload the photo */
const imageCache = {};
function loadSampleImage(){
  const s = SAMPLES[state.sampleIndex];
  if(!s || !s.image) return null;
  if(imageCache[s.id]) return imageCache[s.id];
  const img = new Image();
  img.src = s.image;
  imageCache[s.id] = img;
  return img;
}

/* --- STEP 3: damage diagnosis --- */
function analyzeDamage(){
  const canvas = root.querySelector("#diagCanvas");
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
  const d = imgData.data;
  let darkCount=0, lightCount=0, variance=0, mean=0, n=0;
  for(let i=0;i<d.length;i+=4){
    const lum = 0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];
    mean += lum; n++;
    if(lum < 60) darkCount++;
    if(lum > 235) lightCount++;
  }
  mean /= n;
  for(let i=0;i<d.length;i+=4){
    const lum = 0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];
    variance += (lum-mean)*(lum-mean);
  }
  variance /= n;

  const darkRatio = darkCount/n;
  const lightRatio = lightCount/n;
  const severity = Math.min(100, Math.round((darkRatio*900 + lightRatio*400 + Math.sqrt(variance)/3)));

  let level = 'Low';
  if(severity>65) level='Severe';
  else if(severity>35) level='Moderate';

  return {
    severity, level,
    insectDamage: Math.round(darkRatio*3000)/10,
    fading: Math.round(lightRatio*1200)/10,
    textureVariance: Math.round(variance),
    recommendation: severity>65
      ? 'Prioritize for physical conservation within 30 days; digitize before further handling.'
      : severity>35
      ? 'Schedule conservation review this quarter; safe for continued digitization.'
      : 'Stable — proceed with standard digitization workflow.'
  };
}

function renderStep3(){
  stage.innerHTML = stageHead('Step 3', 'Damage diagnosis', 'A pixel-level analysis pass scores structural risk — the same signal a conservator uses to triage which leaves need urgent physical intervention first.') +
    `<div class="canvas-wrap">
      <canvas id="diagCanvas" width="640" height="360"></canvas>
    </div>
    <div style="margin-top:18px;display:flex;justify-content:flex-end;">
      <button class="btn primary" id="toStep4">Continue to AI restoration →</button>
    </div>`;

  const canvas = root.querySelector("#diagCanvas");
  if(state.customImage){
    drawCover(state.customImage, canvas);
  } else {
    const img = loadSampleImage();
    if(img) drawCover(img, canvas);
    else drawLeaf(canvas, 11, 0.5, {}); // fallback: synthetic leaf
  }

  const report = analyzeDamage();
  state.damageReport = report;

  root.querySelector("#toStep4").addEventListener('click', ()=>goStep(4));

  inspector.innerHTML = `
    <div class="card">
      <h4>Conservation report</h4>
      <div class="kv"><span class="k">Overall severity</span><span class="v">${report.severity}/100</span></div>
      <div class="meter"><div style="width:${report.severity}%"></div></div>
      <div class="kv" style="margin-top:10px;"><span class="k">Risk level</span><span class="v">${report.level}</span></div>
      <div class="kv"><span class="k">Insect / hole damage</span><span class="v">${report.insectDamage}%</span></div>
      <div class="kv"><span class="k">Fading / fiber loss</span><span class="v">${report.fading}%</span></div>
      <div class="kv"><span class="k">Texture variance</span><span class="v">${report.textureVariance}</span></div>
    </div>
    <div class="card">
      <h4>Recommendation</h4>
      <div class="note">${report.recommendation}</div>
    </div>`;
}

/* --- STEP 4: AI restoration --- */
function buildRestoration(){
  const rnd = mulberry32( state.customImage ? 999 : 100 + state.sampleIndex * 7 );
  const sample = state.customImage ? SAMPLES[2] : SAMPLES[state.sampleIndex]; // fallback text for custom uploads
  const words = sample.text.split(' ').map(w=>({
    word: w,
    masked: rnd() < sample.damage,
    confidence: 82 + Math.round(rnd()*16)
  }));
  return { words, sample };
}

function renderStep4(){
  if(!state.restorationWords){
    const built = buildRestoration();
    state.restorationWords = built.words;
  }
  const sample = state.customImage ? SAMPLES[2] : SAMPLES[state.sampleIndex];

  stage.innerHTML = stageHead('Step 4', 'AI restoration', state.customImage
      ? 'Custom uploads need a connected Tamil OCR + language model in production. Shown below is the restoration mechanic applied to a representative sample text.'
      : 'Masked characters are reconstructed using grammar-constrained language modeling. Toggle the heatmap to see per-word confidence.') +
    `<div class="canvas-wrap" style="align-items:stretch;">
      <div class="toggle-row" style="justify-content:space-between;">
        <div class="chip ${state.heatmapOn?'on':''}" id="heatToggle">Confidence heatmap</div>
        <button class="btn primary" id="runRestore" ${state.restorationDone?'disabled':''}>${state.restorationDone ? 'Restoration complete' : 'Run restoration'}</button>
      </div>
      <div class="restored-text ${state.heatmapOn?'heat':''}" id="restoredText" style="margin-top:16px;"></div>
      <div class="legend">
        <span><span class="dot" style="background:rgba(91,107,62,0.6)"></span> Original / legible</span>
        <span><span class="dot" style="background:rgba(184,132,46,0.6)"></span> AI-reconstructed</span>
        <span><span class="dot" style="background:#ded2ac"></span> Awaiting reconstruction</span>
      </div>
    </div>
    <div style="margin-top:18px;display:flex;justify-content:flex-end;">
      <button class="btn primary" id="toStep5" ${!state.restorationDone?'disabled':''}>Continue to translation →</button>
    </div>`;

  paintRestoredText();

  root.querySelector("#heatToggle").addEventListener('click', (e)=>{
    state.heatmapOn = !state.heatmapOn;
    root.querySelector("#restoredText").classList.toggle('heat');
    e.target.classList.toggle('on');
  });
  root.querySelector("#runRestore").addEventListener('click', runRestoreAnimation);
  root.querySelector("#toStep5").addEventListener('click', ()=>{ if(state.restorationDone) goStep(5); });

  inspector.innerHTML = `
    <div class="card">
      <h4>Reconstruction method (demo)</h4>
      <p style="font-size:13px;color:var(--ink-soft);line-height:1.6;">Masked words are revealed with a simulated per-word confidence score. In production, each score comes from a Tamil masked-language model cross-checked against Tholkappiyam grammar rules — low-confidence predictions are flagged for scholar review, never presented as fact.</p>
    </div>
    <div class="card">
      <h4>This passage</h4>
      <div class="kv"><span class="k">Source</span><span class="v">${sample.title}</span></div>
      <div class="kv"><span class="k">Words total</span><span class="v">${state.restorationWords.length}</span></div>
      <div class="kv"><span class="k">Masked (damaged)</span><span class="v">${state.restorationWords.filter(w=>w.masked).length}</span></div>
    </div>`;
}

function paintRestoredText(revealMasked=false){
  const container = root.querySelector("#restoredText");
  if(!container) return;
  container.innerHTML = state.restorationWords.map((w,i)=>{
    if(!w.masked) return `<span class="word original">${w.word}</span>`;
    if(revealMasked) return `<span class="word restored" data-i="${i}" title="Confidence: ${w.confidence}%">${w.word}</span>`;
    return `<span class="word pending">${w.word}</span>`;
  }).join(' ');
}

function runRestoreAnimation(){
  const btn = root.querySelector("#runRestore");
  btn.disabled = true; btn.textContent = 'Reconstructing…';
  const maskedIdx = state.restorationWords.map((w,i)=>w.masked?i:null).filter(i=>i!==null);
  let i=0;
  paintRestoredText(false);
  const spans = ()=>root.querySelectorAll('#restoredText .word.pending');
  const interval = setInterval(()=>{
    if(i>=maskedIdx.length){
      clearInterval(interval);
      state.restorationDone = true;
      paintRestoredText(true);
      btn.textContent = 'Restoration complete';
      root.querySelector("#toStep5").disabled = false;
      // push into archive
      const sample = state.customImage ? SAMPLES[2] : SAMPLES[state.sampleIndex];
      const fullText = state.restorationWords.map(w=>w.word).join(' ');
      if(!state.archive.find(a=>a.text===fullText)){
        state.archive.unshift({ title: sample.title, text: fullText, translation: sample.english });
      }
      render();
      return;
    }
    const idx = maskedIdx[i];
    const el = root.querySelector(`#restoredText .word[data-i="${idx}"], #restoredText .word.pending:nth-of-type(${idx+1})`);
    // simpler: re-render progressively
    const words = state.restorationWords;
    root.querySelector("#restoredText").innerHTML = words.map((w,k)=>{
      if(!w.masked) return `<span class="word original">${w.word}</span>`;
      if(maskedIdx.slice(0,i+1).includes(k)) return `<span class="word restored" title="Confidence: ${w.confidence}%">${w.word}</span>`;
      return `<span class="word pending">${w.word}</span>`;
    }).join(' ');
    i++;
  }, 450);
}

/* --- STEP 5: translation --- */
function renderStep5(){
  const sample = state.customImage ? SAMPLES[2] : SAMPLES[state.sampleIndex];
  stage.innerHTML = stageHead('Step 5', 'Translation & context', 'Restored text is rendered in modern Tamil and English, with literary context retrieved from a reference corpus.') +
    `<div class="card">
      <div class="translation-block">
        <div class="lbl">Restored — original register</div>
        <div class="txt tamil">${sample.text}</div>
      </div>
      <div class="translation-block">
        <div class="lbl">Modern Tamil</div>
        <div class="txt tamil" style="font-size:16px;">${sample.modern}</div>
      </div>
      <div class="translation-block">
        <div class="lbl">English</div>
        <div class="txt en">"${sample.english}"</div>
      </div>
    </div>
    <div class="card">
      <h4>Literary context</h4>
      <p style="font-size:13.5px;line-height:1.6;color:var(--ink-soft);">${sample.context}</p>
    </div>
    <div style="margin-top:18px;display:flex;justify-content:flex-end;">
      <button class="btn primary" id="toStep6">Go to archive search →</button>
    </div>`;
  root.querySelector("#toStep6").addEventListener('click', ()=>goStep(6));

  inspector.innerHTML = `
    <div class="card">
      <h4>Pipeline recap</h4>
      <div class="kv"><span class="k">Preprocessing</span><span class="v">done</span></div>
      <div class="kv"><span class="k">Damage severity</span><span class="v">${state.damageReport ? state.damageReport.severity+'/100' : '—'}</span></div>
      <div class="kv"><span class="k">Restoration</span><span class="v">${state.restorationDone ? 'complete' : 'pending'}</span></div>
    </div>
    <div class="card">
      <h4>Next in production</h4>
      <p style="font-size:13px;color:var(--ink-soft);line-height:1.6;">Text-to-speech narration and a scholar correction portal feed verified fixes back into model fine-tuning — not included in this offline prototype.</p>
    </div>`;
}

/* --- STEP 6: archive search --- */
function renderStep6(){
  stage.innerHTML = stageHead('Step 6', 'Archive search', 'Every restored manuscript becomes instantly searchable — this is what turns a pile of scans into a living reference collection.') +
    `<div class="search-bar">
      <input type="text" id="searchInput" placeholder="Search restored manuscripts, e.g. 'கேளிர்' or 'record'">
    </div>
    <div id="results"></div>`;

  const input = root.querySelector("#searchInput");
  input.addEventListener('input', doSearch);
  doSearch();

  inspector.innerHTML = `
    <div class="card">
      <h4>Archive stats</h4>
      <div class="kv"><span class="k">Manuscripts restored</span><span class="v">${state.archive.length}</span></div>
      <div class="kv"><span class="k">Total words indexed</span><span class="v">${state.archive.reduce((a,c)=>a+c.text.split(' ').length,0)}</span></div>
    </div>
    <div class="card">
      <h4>Why this matters</h4>
      <p style="font-size:13px;color:var(--ink-soft);line-height:1.6;">Scholars currently search manuscript collections by walking to a shelf. A restored, indexed archive turns months of manual lookup into a query that returns cited passages in seconds.</p>
    </div>`;
}

function doSearch(){
  const q = root.querySelector("#searchInput").value.trim();
  const results = root.querySelector("#results");
  const matches = q ? state.archive.filter(a => a.text.includes(q) || a.translation.toLowerCase().includes(q.toLowerCase()) || a.title.toLowerCase().includes(q.toLowerCase())) : state.archive;
  if(matches.length===0){
    results.innerHTML = `<div class="empty">No matches. Try a Tamil word from a restored passage, or an English keyword.</div>`;
    return;
  }
  results.innerHTML = matches.map(m=>{
    let snippet = m.text;
    if(q) snippet = m.text.split(q).join(`<mark>${q}</mark>`);
    return `<div class="archive-item">
      <div class="t">${m.title}</div>
      <div class="snippet">${snippet}</div>
      <div style="font-size:12.5px;color:var(--ink-soft);margin-top:6px;font-style:italic;">${m.translation}</div>
    </div>`;
  }).join('');
}

/* ============================= NAV ============================= */
function goStep(n){
  if(n===4 && state.step!==4){ state.restorationWords = null; state.restorationDone = false; }
  state.step = n;
  render();
  stage.scrollTop = 0;
}

root.querySelectorAll('.step').forEach(el=>{
  el.addEventListener('click', ()=>goStep(parseInt(el.dataset.step)));
  el.addEventListener('keydown', e=>{ if(e.key==='Enter') goStep(parseInt(el.dataset.step)); });
});

root.querySelector("#resetBtn").addEventListener('click', ()=>{
  state = { step:1, sampleIndex:0, customImage:null, filters:{contrast:false,denoise:false,sharpen:false}, heatmapOn:false, damageReport:null, restorationWords:null, restorationDone:false,
    archive: SAMPLES.slice(0, 3).map(s=>({ title: s.title, text: s.text, translation: s.english })) };
  render();
});

  render();
}
