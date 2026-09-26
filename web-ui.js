export function renderWebCard(part, original, selected, multi, escapeHtml, entries, formatKey, compatibility) {
  const doc = document.createElement('template');
  doc.innerHTML = original;
  const card = doc.content.firstElementChild;
  const count = selected.filter(item => item.id === part.id).length;
  card.classList.toggle('is-selected', count > 0);
  const specs = card.querySelector('.specs');
  const rows = entries(part);
  const row = ([key,value]) => `<div class="spec-row"><span>${formatKey(key)}</span><strong>${escapeHtml(value)}</strong></div>`;
  specs.innerHTML = rows.slice(0,2).map(row).join('');
  if(rows.length>2) {
    const details = document.createElement('details');
    details.className='part-details';
    details.innerHTML=`<summary>All specifications</summary><div class="specs">${rows.map(row).join('')}</div>`;
    card.append(details);
  }
  const assessment = document.createElement('section');
  assessment.className = `part-compatibility compatibility-${compatibility.status}`;
  assessment.dataset.compatibility = compatibility.status;
  const labels = { compatible: 'Compatible', pending: 'Needs another component', incompatible: 'Incompatible', review: 'Needs review' };
  const heading = document.createElement('strong');
  heading.textContent = labels[compatibility.status];
  assessment.append(heading);
  const scope = document.createElement('small');
  scope.textContent = multi && selected.length ? 'Checks adding another' : selected.length && !count ? 'Checks replacing current part' : 'Based on your current build';
  assessment.append(scope);
  const reasons = document.createElement('ul');
  for (const reason of compatibility.reasons) {
    const item = document.createElement('li'); item.textContent = reason; reasons.append(item);
  }
  assessment.append(reasons); card.append(assessment);
  const action = document.createElement('div'); action.className='part-actions';
  const button = document.createElement('button'); button.type='button'; button.dataset.webAdd=part.id;
  button.textContent=count ? (multi ? 'Add another' : 'Selected ✓') : selected.length && !multi ? 'Replace' : 'Add to build';
  button.disabled=!!count && !multi;
  button.setAttribute('aria-label',`${button.textContent}: ${part.name}`);
  if(count) {
    const status=document.createElement('span'); status.className='selected-label'; status.textContent=`Selected${multi ? ` ×${count}` : ''}`; action.append(status);
  }
  action.append(button); card.append(action);
  return card.outerHTML;
}

export async function setupWebUI({add, zoom, reset, resize, progress, browse}) {
  const stylesheet=document.createElement('link'); stylesheet.rel='stylesheet'; stylesheet.href=new URL('./web-ui.css',import.meta.url).href;
  await new Promise((resolve,reject)=>{stylesheet.onload=resolve;stylesheet.onerror=reject;document.head.append(stylesheet);});
  document.body.classList.add('web-builder');
  const filter = document.createElement('div'); filter.className = 'compatibility-filter';
  filter.innerHTML = '<label><input id="compatibleOnly" type="checkbox" aria-describedby="compatibilityHelp"> Compatible only</label><small id="compatibilityHelp">Hides conflicts, parts awaiting another component, and parts needing review. Checks use catalog specs, not a manufacturer guarantee.</small>';
  document.querySelector('.filter-actions').before(filter);
  const list=document.querySelector('#componentList');
  list.addEventListener('click',event=>{
    const button=event.target.closest('[data-web-add]');
    if(!button || button.disabled)return;
    const id=button.dataset.webAdd; add(id);
    list.querySelector(`[data-web-add="${CSS.escape(id)}"]`)?.focus({preventScroll:true});
    announcement.textContent=''; requestAnimationFrame(()=>{announcement.textContent='Build updated. Your selected component is in its matching slot.';});
  });
  // Nested controls own Enter/Space; do not also trigger the card's Enter handler.
  list.addEventListener('keydown',event=>{if(event.target.closest('button, summary, details'))event.stopPropagation();},true);
  list.addEventListener('dragstart',event=>{if(event.target.closest('button, summary, details'))event.preventDefault();},true);
  const announcement=document.createElement('p'); announcement.className='web-announcement'; announcement.setAttribute('role','status');document.body.append(announcement);
  const presets=document.querySelector('.presets-panel');
  const disclosure=document.createElement('details'); disclosure.className='preset-disclosure';
  const summary=document.createElement('summary');summary.textContent='Start with a preset build';presets.before(disclosure);disclosure.append(summary,presets);
  const panel=document.querySelector('.scene-panel');
  const heading=document.createElement('div'); heading.className='viewer-heading';
  heading.innerHTML='<strong>Your PC · 3D preview</strong><span>Drag to rotate · Scroll or pinch to zoom</span>';
  panel.prepend(heading);
  const tools=panel.querySelector('.scene-tools');
  for(const [id,label] of [['rotateLeft','↶ Rotate left'],['rotateRight','↷ Rotate right'],['fitView','Reset view']]) document.getElementById(id).textContent=label;
  for(const [label,factor] of [['+ Zoom in',0.8],['− Zoom out',1.25]]) {
    const button=document.createElement('button');button.type='button';button.className='icon-button';button.textContent=label;button.setAttribute('aria-label',label.slice(2));button.addEventListener('click',()=>zoom(factor));tools.append(button);
  }
  document.getElementById('fitView').addEventListener('click',reset);
  document.querySelector('.panel-heading .eyebrow').textContent='Selected parts';
  new ResizeObserver(resize).observe(panel);
  setupBuildNavigation({progress, browse, resize});
}

function setupBuildNavigation({progress, browse, resize}) {
  const shell=document.querySelector('.shell');
  const bar=document.createElement('section'); bar.className='build-progress'; bar.setAttribute('aria-label','Build progress');
  bar.innerHTML='<div><strong id="buildProgressText"></strong><span id="buildProgressTotals"></span></div><progress id="buildProgressMeter" max="8" value="0" aria-label="Filled component categories"></progress><button type="button" id="nextPart"></button>';
  shell.before(bar);
  const nav=document.createElement('div'); nav.className='mobile-build-tabs';nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Builder views');
  const panels=[['parts','Parts','.library'],['preview','PC Preview','.scene-panel'],['build','Your Build','.build-panel']];
  let active='parts';
  const mobile=matchMedia('(max-width: 760px)');
  function select(id, focus=false) {
    active=id; document.body.dataset.builderView=id;
    for(const [key,,selector] of panels) {
      const target=document.querySelector(selector), button=nav.querySelector(`[data-view="${key}"]`);
      button.setAttribute('aria-selected',String(key===id));button.tabIndex=key===id?0:-1;
      if(mobile.matches){target.setAttribute('role','tabpanel');target.setAttribute('aria-labelledby',button.id);}else{target.removeAttribute('role');target.removeAttribute('aria-labelledby');}
    }
    if(focus)nav.querySelector(`[data-view="${id}"]`).focus();
    requestAnimationFrame(resize);
  }
  for(const [id,label,selector] of panels) {
    const target=document.querySelector(selector);target.id ||= `view-${id}`;
    const button=document.createElement('button');button.type='button';button.id=`tab-${id}`;button.dataset.view=id;button.textContent=label;button.setAttribute('role','tab');button.setAttribute('aria-controls',target.id);button.onclick=()=>select(id);nav.append(button);
  }
  nav.addEventListener('keydown',event=>{
    const keys=['ArrowRight','ArrowLeft','Home','End'];if(!keys.includes(event.key))return;event.preventDefault();
    const i=panels.findIndex(p=>p[0]===active);const n=event.key==='Home'?0:event.key==='End'?2:(i+(event.key==='ArrowRight'?1:2))%3;select(panels[n][0],true);
  });
  bar.after(nav); mobile.addEventListener('change',()=>select(active));select(active);
  function update(){
    const state=progress();document.getElementById('buildProgressText').textContent=`${state.filled} of ${state.total} categories filled`;
    document.getElementById('buildProgressTotals').textContent=`${state.price} · Estimated ${state.watts} W`;
    document.getElementById('buildProgressMeter').value=state.filled;
    const next=document.getElementById('nextPart');next.textContent=state.next?`Next: choose ${state.next.label}`:'All categories filled · Review build';
    document.querySelectorAll('[data-slot]').forEach(slot=>slot.classList.toggle('next-missing',slot.dataset.slot===state.next?.id));
  }
  document.getElementById('nextPart').onclick=()=>{const state=progress();if(state.next){browse(state.next.id);select('parts');document.querySelector('#categoryTabs button[aria-selected="true"]')?.focus();}else{select('build');document.querySelector('.build-panel').scrollIntoView({block:'nearest'});}};
  new MutationObserver(update).observe(document.querySelector('#slots'),{childList:true});update();
}
