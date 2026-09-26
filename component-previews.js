import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createComponentModel, disposeComponentModel } from './component-models.js';

const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff, 1.8));
scene.add(new THREE.HemisphereLight(0xcce4ff, 0x334155, 3));
for (const [position, power] of [[[3, 5, 6], 65], [[-4, 2, -2], 45]]) {
  const light = new THREE.PointLight(0xffffff, power);
  light.position.set(...position); scene.add(light);
}

function decorate() {
  document.querySelectorAll('.component-card:not([data-preview])').forEach(card=>{
    card.dataset.preview='true';
    if (!card.dataset.component) return;
    const part=JSON.parse(card.dataset.component), name=part.name;
    const inspect=document.createElement('button');
    inspect.type='button';inspect.className='inspect-component';
    inspect.textContent='Inspect in 3D';
    inspect.setAttribute('aria-label',`Inspect ${name} in 3D`);
    inspect.addEventListener('click',()=>openInspector(card,part,inspect));
    card.querySelector('.part-actions').prepend(inspect);
  });
}
const list=document.querySelector('#componentList');
new MutationObserver(decorate).observe(list,{childList:true});
decorate();

// One interactive renderer per open dialog, released on close.
function openInspector(card, part, trigger) {
  const name=part.name;
  const dialog=document.createElement('dialog');dialog.className='component-inspector';dialog.setAttribute('aria-labelledby','inspectorTitle');
  dialog.innerHTML='<header><h2 id="inspectorTitle"></h2><button type="button" class="inspector-close" aria-label="Close component inspection" autofocus>Close ×</button></header><p>Illustration based on this part’s catalog specs and name, not manufacturer CAD. Shared enclosures may differ only in markings. Drag to rotate · Scroll or pinch to zoom.</p><div class="inspector-stage"></div><div class="inspector-tools"></div><section class="inspector-specs"><h3>Specifications</h3></section>';
  dialog.querySelector('h2').textContent=name;
  const specs=card.querySelector('.part-details .specs') || card.querySelector('.specs');if(specs)dialog.querySelector('.inspector-specs').append(specs.cloneNode(true));
  const price=card.querySelector('.price');if(price)dialog.querySelector('header').after(price.cloneNode(true));
  document.body.append(dialog);dialog.showModal();
  const stage=dialog.querySelector('.inspector-stage');let live, control, observer, frame, group;
  function cleanup(){cancelAnimationFrame(frame);observer?.disconnect();control?.dispose();if(group)disposeComponentModel(group);live?.dispose();live?.forceContextLoss();dialog.remove();if(trigger.isConnected)trigger.focus({preventScroll:true});}
  dialog.addEventListener('close',cleanup,{once:true});dialog.querySelector('.inspector-close').onclick=()=>dialog.close();
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  setupPhotoView(dialog,part,stage);
  try {
    live=new THREE.WebGLRenderer({antialias:true,alpha:true});live.setPixelRatio(Math.min(devicePixelRatio,2));live.outputColorSpace=THREE.SRGBColorSpace;live.toneMapping=THREE.ACESFilmicToneMapping;
    stage.append(live.domElement);live.domElement.setAttribute('aria-label',`Interactive ${name} model`);
    const world=new THREE.Scene();for(const light of scene.children.filter(o=>o.isLight))world.add(light.clone());
    group=createComponentModel(part);world.add(group);const bounds=new THREE.Box3().setFromObject(group);group.position.sub(bounds.getCenter(new THREE.Vector3()));
    const size=bounds.getSize(new THREE.Vector3()), radius=size.length()/2;
    const view=new THREE.PerspectiveCamera(38,1,0.01,100);control=new OrbitControls(view,live.domElement);control.enableDamping=true;control.enablePan=false;control.minDistance=radius*1.2;control.maxDistance=radius*12;
    function reset(){const angle=Math.atan(Math.tan(THREE.MathUtils.degToRad(view.fov/2))*Math.min(1,view.aspect));const distance=radius/Math.sin(angle)*1.1;view.position.set(distance*.45,distance*.3,distance);control.target.set(0,0,0);control.update();}
    function fit(){const width=stage.clientWidth,height=stage.clientHeight;if(!width||!height)return;live.setSize(width,height);view.aspect=width/height;view.updateProjectionMatrix();}observer=new ResizeObserver(fit);observer.observe(stage);fit();reset();
    const actions=[['Rotate left',()=>{view.position.applyAxisAngle(new THREE.Vector3(0,1,0),-.25);}],['Rotate right',()=>{view.position.applyAxisAngle(new THREE.Vector3(0,1,0),.25);}],['Zoom in',()=>{view.position.setLength(Math.max(control.minDistance,view.position.length()*.8));}],['Zoom out',()=>{view.position.setLength(Math.min(control.maxDistance,view.position.length()*1.25));}],['Reset',reset]];
    for(const [label,action] of actions){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{action();control.update();};dialog.querySelector('.inspector-tools').append(b);}
    function animateInspection(){if(!stage.hidden){control.update();live.render(world,view);}frame=requestAnimationFrame(animateInspection);}animateInspection();
  } catch(error){stage.textContent='Interactive preview is unavailable on this device. Specifications are shown below.';console.warn('Inspection unavailable:',error);}
}

function setupPhotoView(dialog,part,stage) {
  const raw=part.specs?.image;
  let url;try { url=new URL(raw); if(url.protocol!=='https:')return; } catch { return; }
  const modes=document.createElement('div');modes.className='inspector-view-switch';modes.setAttribute('role','group');modes.setAttribute('aria-label','Component view');
  const photo=document.createElement('section');photo.className='inspector-photo';photo.hidden=true;
  const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Loading supplier image…';
  const img=document.createElement('img');img.alt=`Supplier image for ${part.name}`;img.referrerPolicy='no-referrer';img.decoding='async';img.hidden=true;
  const source=document.createElement('a');source.href=url.href;source.target='_blank';source.rel='noopener noreferrer';source.referrerPolicy='no-referrer';source.textContent=`Supplier image · ${url.hostname}`;
  const caption=document.createElement('p');caption.textContent='Photo from the product listing; it may show packaging or a shared product-family image. Loads from the supplier when selected.';
  photo.append(status,img,source,caption);stage.before(modes);stage.after(photo);
  let requested=false,timeout;
  img.onload=()=>{clearTimeout(timeout);status.textContent='';img.hidden=false;};
  img.onerror=()=>{clearTimeout(timeout);status.textContent='The supplier image is unavailable. You can still use the 3D illustration or open the source link.';img.hidden=true;};
  for(const [mode,label] of [['model','3D illustration'],['photo','Product photo']]){
    const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.inspectorView=mode;button.setAttribute('aria-pressed',String(mode==='model'));
    button.onclick=()=>{const showPhoto=mode==='photo';stage.hidden=showPhoto;photo.hidden=!showPhoto;dialog.querySelector('.inspector-tools').hidden=showPhoto;
      for(const b of modes.children)b.setAttribute('aria-pressed',String(b===button));
      if(showPhoto&&!requested){requested=true;timeout=setTimeout(()=>{status.textContent='The supplier is taking longer to respond. You can return to the 3D illustration.';},12000);img.src=url.href;}
    };modes.append(button);
  }
  dialog.addEventListener('close',()=>{clearTimeout(timeout);img.onload=null;img.onerror=null;img.removeAttribute('src');},{once:true});
}
