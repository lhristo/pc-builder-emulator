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

export async function setupWebUI({add, zoom, reset, resize}) {
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
}
