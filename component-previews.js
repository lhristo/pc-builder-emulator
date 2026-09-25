import * as THREE from 'three';

// One offscreen renderer, lazy snapshots: no per-card contexts or animation loop.
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(480, 280);
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff, 1.8));
scene.add(new THREE.HemisphereLight(0xcce4ff, 0x334155, 3));
for (const [position, power] of [[[3, 5, 6], 65], [[-4, 2, -2], 45]]) {
  const light = new THREE.PointLight(0xffffff, power);
  light.position.set(...position); scene.add(light);
}
const camera = new THREE.PerspectiveCamera(32, 480 / 280, 0.1, 100);
const cache = new Map();

function model(category, name) {
  const group = new THREE.Group();
  const materials = new Map();
  function material(color) {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.25 }));
    return materials.get(color);
  }
  function box(w, h, d, x=0, y=0, z=0, color=0x252d38) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material(color));
    mesh.position.set(x,y,z); group.add(mesh); return mesh;
  }
  function ring(radius, tube, x,y,z, color=0x61d6ed) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius,tube,8,40), material(color));
    mesh.position.set(x,y,z); group.add(mesh);
  }
  function fan(x,y,z,r=0.42) {
    box(r*2.2,r*2.2,0.12,x,y,z,0x131920);
    ring(r,0.035,x,y,z+0.09); ring(r*0.23,0.055,x,y,z+0.13,0x697584);
    for(let i=0;i<9;i++) {
      const a=i*Math.PI*2/9;
      const blade=box(r*0.26,r*0.65,0.035,x+Math.cos(a)*r*0.55,y+Math.sin(a)*r*0.55,z+0.1,0x46515f);
      blade.rotation.z=a-0.6;
    }
  }
  function contacts(count, x,y,z, spacing=0.08) {
    for(let i=0;i<count;i++) box(0.04,0.12,0.025,x+i*spacing,y,z,0xd4ad55);
  }
  if(category==='Case') {
    const small=/mATX|mini|cube/i.test(name), h=small?2.1:2.7;
    box(1.65,0.12,1.35,0,-h/2); box(1.65,0.12,1.35,0,h/2);
    box(1.65,h,0.07,0,0,-0.65);
    for(const x of [-0.78,0.78]) for(const z of [-0.61,0.61]) box(0.09,h,0.09,x,0,z);
    box(1.55,0.42,1.25,0,-h/2+0.27);
    box(0.08,h,1.3,0.77,0,0);
    for(let i=0;i<3;i++) fan(0,(-1+i)*h*0.29,0.64,0.32);
    for(const x of [-0.57,0.57]) box(0.24,0.13,0.8,x,-h/2-0.1);
    box(0.3,0.025,0.06,0.35,h/2+0.07,0.4,0x68d9eb);
  } else if(category==='Motherboard') {
    box(1.9,2.3,0.09,0,0,0,0x24423b);
    box(0.64,0.64,0.08,-0.08,0.38,0.08,0x9babb2);
    box(0.49,0.49,0.09,-0.08,0.38,0.14,0x252d38);
    for(let i=0;i<4;i++) box(0.07,1.05,0.15,0.48+i*0.12,0.35,0.13);
    for(let i=0;i<3;i++) box(1.05,0.08,0.15,-0.14,-0.35-i*0.23,0.13,0x737e89);
    box(0.3,1.6,0.35,-0.77,0.2,0.18);
    for(let i=0;i<8;i++) box(0.055,0.6,0.18,-0.56+i*0.08,0.91,0.17,0x72808b);
    for(let i=0;i<16;i++) box(0.12,0.11,0.04,-0.67+(i%4)*0.34,-0.92+Math.floor(i/4)*0.17,0.08,0x11151c);
  } else if(category==='Processor') {
    box(1.6,1.6,0.12,0,0,0,0x235443);
    box(1.35,1.35,0.14,0,0,0.12,0xbcc7d1);
    for(let i=0;i<4;i++) contacts(16,-0.61,-0.72+i*0.025,0.08);
    box(0.7,0.04,0.01,0,0.2,0.2,0x616d77); box(0.45,0.025,0.01,0,0.09,0.2,0x616d77);
  } else if(category==='RAM') {
    for(const y of [-0.4,0.4]) {
      box(2.55,0.56,0.08,0,y,0,0x255647);
      box(2.45,0.4,0.15,0,y+0.04,0.08);
      contacts(29,-1.14,y-0.28,0.055);
      box(2.4,0.065,0.15,0,y+0.29,0.08,/RGB/i.test(name)?0x70d9df:0x9ba7b3);
      for(let i=0;i<9;i++) box(0.04,0.32,0.02,-1+i*0.25,y+0.03,0.17,0x566170);
    }
  } else if(category==='Graphics') {
    const count=/4090|4080|7900|7800|5090|5080/i.test(name)?3:2;
    const w=count*0.96+0.18;
    box(w,1.1,0.42); box(w+0.08,0.06,0.48,0,0.58,0,0x8c99a5);
    for(let i=0;i<count;i++) fan((i-(count-1)/2)*0.96,0,0.28,0.4);
    box(0.1,1.3,0.55,-w/2-0.06,0,0,0xb4bec5);
    contacts(18,-0.75,-0.61,-0.1);
    for(let i=0;i<24;i++) box(0.03,0.15,0.4,-w/2+0.1+i*(w-0.2)/24,0.43,0,0x9eabb3);
  } else if(category==='Storage') {
    if(/NVMe|M\.2/i.test(name)) {
      box(2.7,0.72,0.07,0,0,0,0x285348);
      for(let i=0;i<4;i++) box(0.46,0.48,0.07,-0.85+i*0.55,0,0.07,0x151c25);
      contacts(8,-1.28,-0.3,0.08); ring(0.07,0.022,1.22,0,0.06,0xb6c0c8);
    } else {
      box(1.65,2.0,0.22); box(1.35,1.45,0.015,0,0.06,0.12,0x8b99a8);
      box(0.75,0.2,0.035,0,0.4,0.14,0x203747); contacts(12,-0.55,-1.01,0);
    }
  } else if(category==='Power') {
    box(1.85,1.55,1.1); fan(0,0,0.57,0.61);
    for(let i=0;i<5;i++) ring(0.22+i*0.09,0.012,0,0,0.8,0x95a1af);
    for(let i=0;i<4;i++) box(0.16,0.23,0.08,-0.6+i*0.4,-0.54,-0.59,0x090d12);
  } else if(category==='Cooling') {
    if(/liquid|AIO|240|360|radiator/i.test(name)) {
      box(2.35,1.1,0.26); fan(-0.57,0,0.2,0.47); fan(0.57,0,0.2,0.47);
      box(0.6,0.6,0.3,0,-1,0.2); ring(0.23,0.045,0,-1,0.38);
      for(const x of [-0.18,0.18]) {
        const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,-1,0.2),new THREE.Vector3(x+1.4,-0.8,0.1),new THREE.Vector3(1,-0.3,0)]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(curve,24,0.045,8,false),material(0x151b24)));
      }
    } else {
      for(let i=0;i<17;i++) box(1.35,0.035,0.85,0,-0.65+i*0.08,0,0xa5b0bb);
      fan(0,0,0.5,0.59);
      for(const x of [-0.45,-0.15,0.15,0.45]) box(0.055,1.6,0.06,x,0,-0.38,0xb78655);
    }
  }
  return group;
}

function snapshot(category,name) {
  const key=category+name;
  if(cache.has(key)) return cache.get(key);
  const group=model(category,name); scene.add(group);
  const bounds=new THREE.Box3().setFromObject(group), center=bounds.getCenter(new THREE.Vector3());
  group.position.sub(center);
  const size=bounds.getSize(new THREE.Vector3());
  const distance=Math.max(size.y,size.x/1.5,size.z)*2.15;
  camera.position.set(distance*0.48,distance*0.32,distance); camera.lookAt(0,0,0);
  renderer.render(scene,camera);
  const url=renderer.domElement.toDataURL('image/png');
  scene.remove(group);
  const materials=new Set();
  group.traverse(o=>{if(o.isMesh){o.geometry.dispose(); materials.add(o.material);}});
  materials.forEach(m=>m.dispose());
  if(cache.size>=120) cache.delete(cache.keys().next().value);
  cache.set(key,url); return url;
}
const observer=new IntersectionObserver(entries=>{
  for(const entry of entries) if(entry.isIntersecting) {
    const img=entry.target; observer.unobserve(img);
    if(img.isConnected) img.src=snapshot(img.dataset.category,img.dataset.name);
  }
},{rootMargin:'180px'});
function decorate() {
  document.querySelectorAll('.component-card:not([data-preview])').forEach(card=>{
    card.dataset.preview='true';
    const name=card.querySelector('h3').textContent, category=card.querySelector('.badge').textContent;
    const figure=document.createElement('figure'); figure.className='component-preview';
    const img=document.createElement('img'); img.alt=`Representative 3D ${category.toLowerCase()} model`; img.width=480; img.height=280; img.draggable=false;
    img.dataset.category=category; img.dataset.name=name;
    const caption=document.createElement('figcaption'); caption.textContent='3D preview · representative design';
    figure.append(img,caption); card.prepend(figure); observer.observe(img);
  });
}
const list=document.querySelector('#componentList');
new MutationObserver(()=>{observer.disconnect(); decorate(); list.querySelectorAll('.component-preview img:not([src])').forEach(img=>observer.observe(img));}).observe(list,{childList:true});
decorate();
