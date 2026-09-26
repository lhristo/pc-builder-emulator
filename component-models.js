import * as THREE from 'three';

// Catalog-driven illustrations, not verified manufacturer CAD. Never randomize
// geometry by ID: two capacity variants may genuinely use the same enclosure.
const number = (value, fallback) => Number.parseFloat(String(value ?? '').replace(/,/g, '')) || fallback;
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
export function visualProfile(part) {
  const s = part.specs || {}, name = part.name || '', text = `${name} ${s.partNumber || ''}`;
  const white = /\b(WHITE|WH|SNOW|ICE)\b|M580-W|S380-W/i.test(text);
  const silver = /\b(SILVER|AERO|CREATOR)\b/i.test(text);
  const body = white ? '#e6e8e9' : silver ? '#9ca6b0' : '#222831';
  const accent = /RGB|ARGB|LIGHT/i.test(text) ? '#66ddf2' : '#737c85';
  const form = /E[- ]?ATX|ULTRA|FULL TOWER|\bXL\b/i.test(name) ? 'E-ATX' : /ITX|\bSFF\b/i.test(name) ? 'Mini-ITX' : /M[- ]?ATX|MATX|\bCUBE/i.test(name) ? 'mATX' : s.formFactor || 'ATX';
  const socket = text.match(/\b(AM[345]|LGA[- ]?\d{4})\b/i)?.[0].toUpperCase().replace(/[- ]/g,'') || s.socket || 'Unknown';
  const p = { id: part.id, category: part.category, name, body, accent, form, socket, specs:s };
  if (part.category === 'case') Object.assign(p, {height:form==='Mini-ITX'?2:form==='mATX'?2.6:form==='E-ATX'?3.6:3.15, depth:clamp(number(s.maxGpu,340)/150,1.8,3.2), front:/glass|view|showcase|panoram/i.test(name)?'glass':/wood/i.test(name)?'slats':/air|mesh|flow/i.test(name)?'mesh':'panel'});
  if (part.category === 'motherboard') Object.assign(p,{width:form==='Mini-ITX'?1.7:form==='E-ATX'?2.7:2.44,height:form==='Mini-ITX'?1.7:form==='mATX'?2.44:3.05,dimms:clamp(number(s.ramSlots,form==='Mini-ITX'||/HDV|H610|H510/.test(name)?2:4),1,8),m2:clamp(number(s.m2,1),0,5),premium:/HERO|ROG|AORUS|TAICHI|CREATOR|X[68]70|Z[78]90/i.test(name)});
  if (part.category === 'cpu') Object.assign(p,{long:/1700|1851|TR[45]|SP[35]/i.test(socket),am5:socket==='AM5',pins:socket==='AM4',brand:/AMD|RYZEN|AM[345]/i.test(text+' '+socket)?'AMD':/INTEL|CORE|LGA|CELERON|PENTIUM/i.test(text+' '+socket)?'INTEL':'CPU'});
  if (part.category === 'ram') Object.assign(p,{modules:clamp(number(s.modules,2),1,8),short:/SO[- ]?DIMM|SODIMM/i.test(text+' '+s.sourceSubcategory),bare:/ELITE|VALUE|PREMIER|SO[- ]?DIMM|SODIMM|DDR3/i.test(text)&&!/RGB|FURY|GAMING/i.test(text),rgb:/RGB|ARGB/i.test(text),low:/LOW|LPX|SODIMM/i.test(text)});
  if (part.category === 'gpu') {
    const length=clamp(number(s.length,260),140,400), slots=clamp(number(s.slots,2),1,4);
    const blower=/BLOWER|TURBO/i.test(text), passive=/PASSIVE|SILENT|FANLESS/i.test(text);
    const fans=passive?0:blower||/STORMX|SINGLE|AERO ITX/i.test(text)?1:/DUAL|TWIN|VENTUS 2|WINDFORCE 2/i.test(text)?2:/TRIO|TRIPLE|VENTUS 3|WINDFORCE 3/i.test(text)?3:length<190?1:length>=300?3:2;
    Object.assign(p,{length,slots,fans,blower,passive});
  }
  if (part.category === 'storage') Object.assign(p,{kind:/HDD|3\.5|7200|5400/i.test(text+' '+s.sourceCategory+' '+s.sourceSubcategory)?'hdd':/M\.2|NVME/i.test(text+' '+s.interface)?'m2':'sata',heatsink:/HEATSINK|\bHS\b|FURY RENEGADE/i.test(text),capacity:s.capacity || '',short:/2230|2242/i.test(text)});
  if (part.category === 'psu') Object.assign(p,{watts:number(name.match(/(\d{3,4})\s*W\b/i)?.[1],number(s.watts,650)),sfx:/\bSFX\b/i.test(text),modular:/MODULAR|ION|FOCUS|RM\d|PRIME|HX\d/i.test(text),rating:s.rating||'Power supply'});
  if (part.category === 'cooler') {
    const liquid=/LIQUID|AIO|WATER/i.test(text)||s.style==='Liquid';
    const radiator=number(name.match(/\b(120|140|240|280|360|420)\b/)?.[1],number(s.radiator,240));
    Object.assign(p,{kind:liquid?'aio':/OEM|STOCK|WRAITH|LOW PROFILE|NH-L/i.test(text)?'low':'tower',radiator,fans:radiator>=360?3:radiator>=240?2:1,towers:/TWIN|DUAL TOWER|NH-D|ASSASSIN|PEERLESS|PHANTOM SPIRIT/i.test(text)?2:1,pipes:clamp(number(name.match(/SHP(\d)|([46])\s*HEATPIPE/i)?.slice(1).find(Boolean),4),2,8),height:clamp(number(s.height,155)/100,0.5,1.8)});
  }
  return p;
}

export function disposeComponentModel(group) {
  const materials=new Set(),textures=new Set();
  group.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});
  for(const m of materials){if(m.map)textures.add(m.map);m.dispose();}for(const t of textures)t.dispose();
}

export function createComponentModel(part) {
  const p=visualProfile(part), s=p.specs, group=new THREE.Group(), materials=new Map();
  group.userData={partId:part.id,profile:p};
  function mat(color,metalness=.45){const key=color+':'+metalness;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,metalness,roughness:.4}));return materials.get(key);}
  function mesh(geometry,color,x=0,y=0,z=0){const o=new THREE.Mesh(geometry,mat(color));o.position.set(x,y,z);group.add(o);return o;}
  const box=(w,h,d,x=0,y=0,z=0,color=p.body)=>mesh(new THREE.BoxGeometry(w,h,d),color,x,y,z);
  const ring=(r,t,x,y,z,color=p.accent)=>mesh(new THREE.TorusGeometry(r,t,8,40),color,x,y,z);
  function disc(r,d,x,y,z,color){const o=mesh(new THREE.CylinderGeometry(r,r,d,36),color,x,y,z);o.rotation.x=Math.PI/2;return o;}
  function label(lines,w,h,x,y,z,bg='#202732',fg='#e5ebef'){
    const canvas=document.createElement('canvas');canvas.width=768;canvas.height=256;const ctx=canvas.getContext('2d');
    ctx.fillStyle=bg;ctx.fillRect(0,0,768,256);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';
    lines.filter(Boolean).slice(0,3).forEach((line,i,a)=>{let font=52;do{ctx.font=`600 ${font--}px sans-serif`;}while(ctx.measureText(String(line)).width>710&&font>14);ctx.fillText(String(line),384,(i+.5)*256/a.length);});
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:texture,roughness:.7,metalness:.1}));o.position.set(x,y,z);group.add(o);return o;
  }
  function screws(w,h,z,x=0,y=0){for(const dx of [-1,1])for(const dy of [-1,1]){disc(.025,.014,x+dx*(w/2-.065),y+dy*(h/2-.065),z,'#a1a6ad');box(.025,.006,.018,x+dx*(w/2-.065),y+dy*(h/2-.065),z+.008,'#333942');}}
  function contacts(n,w,x,y,z){for(let i=0;i<n;i++)box(w/n*.55,.10,.022,x-w/2+(i+.5)*w/n,y,z,'#d4b063');}
  function fan(x,y,z,r=.4,rgb=false){box(r*2.2,r*2.2,.09,x,y,z);disc(r,.05,x,y,z+.06,'#0f141b');ring(r*.95,rgb?.024:.012,x,y,z+.10,rgb?p.accent:'#737c85');for(let i=0;i<9;i++){const a=i*Math.PI*2/9;const blade=box(r*.28,r*.62,.024,x+Math.cos(a)*r*.54,y+Math.sin(a)*r*.54,z+.12,'#4c555e');blade.rotation.z=a-.55;}disc(r*.23,.05,x,y,z+.15,p.body);screws(r*2.2,r*2.2,z+.06,x,y);}
  function cable(points,r=.035,color='#242831'){group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(a=>new THREE.Vector3(...a))),24,r,8,false),mat(color)));}
  const identity=()=>label([part.name,s.partNumber||part.id],2.6,.26,0,new THREE.Box3().setFromObject(group).min.y-.22,.1);
  if(p.category==='case'){
    const h=p.height,d=p.depth,w=p.form==='Mini-ITX'?1.35:1.6;
    box(w,.08,d,0,-h/2);box(w,.08,d,0,h/2);box(w,h,.06,0,0,-d/2);
    for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])box(.055,h,.055,x,0,z);
    box(.045,h,d,-w/2,0,0);box(w-.07,.40,d-.06,0,-h/2+.24);
    box(w-.12,h-.18,.05,0,0,d/2-.12,'#11161d');
    const count=p.form==='Mini-ITX'?1:p.form==='mATX'?2:3;
    for(let i=0;i<count;i++)fan(0,(i-(count-1)/2)*.82,d/2-.04,.34,/RGB|GLASS|VIEW/i.test(p.name));
    if(p.front==='slats')for(let i=0;i<11;i++)box(.045,h-.15,.07,-w/2+.1+i*(w-.2)/10,0,d/2+.12,'#8b6b45');
    if(p.front==='mesh')for(let i=0;i<19;i++)box(w-.12,.009,.02,0,-h/2+.12+i*(h-.24)/18,d/2+.12,'#5c6268');
    if(p.front==='panel'){box(w*.68,h-.12,.035,0,0,d/2+.12);for(let i=0;i<14;i++)box(.07,.018,.04,w*.4,-h*.38+i*h*.055,d/2+.14,'#06090e');}
    const glass=new THREE.MeshStandardMaterial({color:'#a7cbd9',transparent:true,opacity:.13,roughness:.12,metalness:.25,depthWrite:false,side:THREE.DoubleSide});
    const side=box(.025,h-.16,d-.16,w/2,0,0);side.material=glass;
    if(p.front==='glass'){const front=box(w-.10,h-.12,.025,0,0,d/2+.15);front.material=glass;}
    for(const x of [-w*.33,w*.33])for(const z of [-d*.35,d*.35])box(.20,.12,.3,x,-h/2-.09,z,'#0b0f15');
    for(let i=0;i<2;i++)box(.14,.04,.055,-.24+i*.2,h/2+.05,d*.27,'#0a1018');
    identity();
  }else if(p.category==='motherboard'){
    const w=p.width,h=p.height;box(w,h,.055,0,0,0,'#283b35');screws(w,h,.045);
    const cx=-w*.07,cy=h*.20;box(.60,.66,.045,cx,cy,.06,'#b6bdc5');box(.49,.54,.035,cx,cy,.09,'#303039');label([p.socket],.40,.12,cx,cy,.115,'#303039');
    for(let i=0;i<p.dimms;i++){const x=w*.16+i*.115;box(.062,h*.48,.11,x,h*.16,.085,'#10151c');for(const y of [h*.40,-h*.08])box(.085,.05,.13,x,y,.10,'#a1a9ac');}
    box(.29,h*.54,.25,-w/2+.18,h*.20,.16,p.premium?p.body:'#aeb6bb');
    for(let i=0;i<(p.premium?12:6);i++)box(.038,.25,.16,-w*.28+i*.056,h*.41,.10,'#8a969e');
    const slots=p.form==='Mini-ITX'?1:p.form==='mATX'?2:3;
    for(let i=0;i<slots;i++)box(w*.57,.07,.12,-w*.06,-h*.16-i*.28,.09,i===0?'#a5adb8':'#161c24');
    for(let i=0;i<p.m2;i++){const y=-h*.1-i*.24;box(w*.42,.12,.07,-w*.12,y,.08,p.premium?p.body:'#3a4b44');}
    for(let i=0;i<12;i++){const x=-w*.30+(i%4)*w*.13,y=-h*.39+Math.floor(i/4)*.11;box(.08,.06,.04,x,y,.06,'#0f151b');}
    for(let i=0;i<6;i++){box(w*.36,.007,.003,-w*.05,-h*.34+i*.02,.031,'#69806e');}
    label([s.chipset||p.name,p.form],w*.46,.20,w*.03,-h*.38,.12);identity();
  }else if(p.category==='cpu'){
    const h=p.long?1.8:1.5,w=1.5;box(w,h,.075,0,0,0,'#234c3e');
    if(p.am5){box(1.13,1.13,.12,0,0,.09,'#bdc3c9');for(const x of [-.65,.65])for(const y of [-.42,0,.42])box(.18,.20,.12,x,y,.09,'#bdc3c9');}
    else box(w-.15,h-.15,.12,0,0,.09,'#bdc3c9');
    label([p.brand,p.name,p.socket],1.07,.50,0,.04,.155,'#bdc3c9','#343d44');
    for(let x=0;x<13;x++)for(let y=0;y<13;y++){if(x>4&&x<8&&y>4&&y<8)continue;box(.033,.033,p.pins?.08:.008,-.59+x*.098,-h*.40+y*h*.8/12,-(p.pins?.075:.041),'#d4b063');}
    box(.07,.07,.002,-w*.4,-h*.4,.045,'#d4b063');
  }else if(p.category==='ram'){
    const w=p.short?1.45:2.75,h=p.low||p.bare?.47:.68;
    for(let j=0;j<p.modules;j++){const y=(j-(p.modules-1)/2)*(h+.20);box(w,h,.035,0,y,0,'#235542');contacts(p.short?24:40,w-.10,0,y-h/2+.015,.03);
      if(p.bare){for(let i=0;i<(p.short?4:8);i++)box(w*.085,h*.48,.045,-w*.4+i*w*.8/(p.short?3:7),y,.045,'#11171d');}
      else {box(w-.06,h*.72,.11,0,y+.05,.04);for(let i=0;i<7;i++){const fin=box(.045,h*.55,.014,-w*.38+i*w*.76/6,y+.05,.105,p.accent);fin.rotation.z=.22;}}
      if(p.rgb)for(let i=0;i<5;i++)box(w/5-.01,.065,.10,-w*.4+i*w/5,y+h/2+.02,.035,['#78c7ff','#a2a0ff','#ef8bc8','#9cdeab','#f3d398'][i]);
      label([p.name,`${s.capacity||''} ${s.speed||''}`],w*.70,h*.22,0,y+.01,.11);
    }
  }else if(p.category==='gpu'){
    const w=p.length/100,h=1.15,d=p.slots*.18;box(w,h,d);box(w-.08,h-.04,.055,0,0,-d/2-.028,'#4e5862');
    for(let i=0;i<34;i++)box(.021,h*.80,d*.8,-w/2+.08+i*(w-.16)/33,0,0,'#89949d');
    box(w,.13,d+.04,0,h/2);box(w,.10,d+.04,0,-h/2);
    if(p.blower){box(w,h,.06,0,0,d/2+.02);fan(w*.27,0,d/2+.07,.38,false);for(let i=0;i<10;i++)box(.012,.8,.012,-w*.37+i*.04,0,d/2+.06,'#8d99a3');}
    else for(let i=0;i<p.fans;i++){const r=Math.min(.46,(w-.10)/(p.fans*2.25));fan((i-(p.fans-1)/2)*(w-.08)/p.fans,0,d/2+.02,r,/RGB|AORUS|ROG/i.test(p.name));}
    box(.07,1.3,d+.03,-w/2-.04,0,0,'#b1bbc4');for(let i=0;i<3;i++)box(.025,.14,.12,-w/2-.082,-.32+i*.25,0,'#18212a');contacts(22,1.2,-.18,-.66,-d*.25);
    label([p.name,`${s.memory||''} · ${p.slots} slots`],w*.86,.12,0,.51,d/2+.07);identity();
  }else if(p.category==='storage'){
    if(p.kind==='m2'){const w=p.short?1.45:2.8;box(w,.77,.045,0,0,0,'#294c3e');for(let i=0;i<(p.short?2:4);i++)box(.40,.49,.04,-w*.35+i*w*.70/(p.short?1:3),0,.045,'#0e151d');contacts(8,.32,-w/2+.16,-.33,.034);ring(.055,.02,w/2-.10,0,.03,'#afb6bd');
      if(p.heatsink){box(w-.28,.58,.16,0,0,.14);for(let i=0;i<8;i++)box(w-.33,.025,.10,0,-.25+i*.07,.25,'#535d68');}
      label([p.name,s.capacity||''],w*.77,.36,0,0,p.heatsink?.307:.071,'#d9ddde','#202934');
    }else if(p.kind==='hdd'){box(1.75,2.5,.43,0,0,0,'#777f87');box(1.66,2.40,.025,0,0,.23,'#c5cbd0');ring(.59,.025,0,-.34,.25,'#a4acb2');screws(1.73,2.47,.25);label([p.name,s.capacity||'',s.partNumber||'HDD'],1.4,.87,0,.45,.252,'#e0e3e6','#202934');contacts(14,1.3,0,-1.26,-.02);}
    else{box(1.7,2.35,.15);screws(1.7,2.35,.084);label([p.name,s.capacity||'',s.partNumber||'SATA SSD'],1.5,1.45,0,.16,.084,'#d9ddde','#202934');contacts(12,1.20,0,-1.17,-.02);}
  }else if(p.category==='psu'){
    const w=p.sfx?1.35:1.85,h=p.sfx?1.15:1.5,d=p.sfx?.9:clamp(p.watts/1000+.55,1.1,1.8);box(w,h,d);fan(0,0,d/2+.02,h*.39,false);for(let i=0;i<6;i++)ring(h*.1+i*h*.053,.012,0,0,d/2+.20,'#9aa3ac');
    label([p.name,`${p.watts} W · ${p.rating}`],w*.92,.15,0,-h*.42,d/2+.055);
    const rear=label([s.partNumber||p.name,`${p.watts} W`,p.rating],w*.83,h*.63,0,0,-d/2-.01);rear.rotation.y=Math.PI;
    if(p.modular){for(let i=0;i<6;i++)box(.16,.12,.04,-w*.35+(i%3)*w*.35,-h*.15+Math.floor(i/3)*.25,-d/2-.03,'#080d12');}
    else for(let i=0;i<5;i++)cable([[w/2,-h*.2,0],[w/2+.18,-h*.45,.10],[w/2+.34,-h*.65,.22+i*.03]],.018,['#252931','#8f4d30','#a9903e'][i%3]);
    identity();
  }else if(p.category==='cooler'){
    if(p.kind==='aio'){const w=p.radiator/115;box(w,1.05,.26);for(let i=0;i<p.fans;i++)fan((i-(p.fans-1)/2)*w/p.fans,0,.19,Math.min(.45,w/p.fans*.43),/RGB|ARGB/i.test(p.name));disc(.32,.25,0,-1.03,.15,p.body);ring(.27,.025,0,-1.03,.29,p.accent);label([p.name],.48,.16,0,-1.03,.28);for(const x of [-.16,.16])cable([[x,-1.03,.2],[w/2+.42,-.8,.13],[w/2-.06,-.3,0]],.035);identity();}
    else if(p.kind==='low'){disc(.6,.26,0,0,0,'#a2abb3');for(let i=0;i<32;i++){const a=i*Math.PI/16;const fin=box(.025,.5,.22,Math.cos(a)*.4,Math.sin(a)*.4,0,'#b2b9be');fin.rotation.z=a-Math.PI/2;}fan(0,0,.20,.51,false);label([p.name],1.0,.12,0,-.51,.31);}
    else {const h=p.height;for(let tower=0;tower<p.towers;tower++){const z=(tower-(p.towers-1)/2)*.63;for(let i=0;i<22;i++)box(1.13,.021,.48,0,-h/2+i*h/21,z,'#a6b0b7');for(let i=0;i<p.pipes;i++)cable([[-.43+i*.86/(p.pipes-1),h*.43,z],[-.43+i*.86/(p.pipes-1),-h*.52,z],[0,-h*.60,0]],.025,'#b78654');}fan(0,0,(p.towers-1)*.315+.31,.50,/RGB|ARGB/i.test(p.name));box(.48,.09,.48,0,-h*.62,0,'#b6bec4');label([p.name],1.05,.13,0,h*.41,(p.towers-1)*.315+.47);identity();}
  }
  return group;
}
