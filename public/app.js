const $ = selector => document.querySelector(selector);
const categories = ['Typography', 'Branding', 'Packaging', 'UI & Web', 'Editorial', 'Motion'];
const colors = [['#e4e9cf','#34422c','Aa'],['#eac5af','#573924','form.'],['#dadce8','#34374f','LESS\n& MORE'],['#d9e8dc','#2d4b42','hello'],['#eddfb9','#544b29','folio'],['#ddcfe8','#4d345c','move']];
let items = [], discipline = '', editing = null, removing = null, lastRemoved = null;
let loading = false;
const editor = $('#editor');
const form = $('#reference-form');
const toast = $('#toast');
const dateFormat = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });
function notify(message, undo = false) {
  $('#toast-message').textContent = message;
  $('#undo').hidden = !undo;
  toast.hidden = false;
}
async function api(path = '', options = {}) {
  const response = await fetch(`/api/references${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  if (response.status === 204) return;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Try again.');
  return data;
}
function render() {
  const query = $('#search').value.toLowerCase().trim();
  const project = $('#project-filter').value;
  const filtered = items.filter(item => (!discipline || item.category === discipline) && (!project || item.project === project) && [item.title, item.note, item.project, item.category].some(value => (value || '').toLowerCase().includes(query)));
  if ($('#sort').value === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
  $('#grid').replaceChildren(...filtered.map(item => {
    const fragment = $('#card').content.cloneNode(true);
    const index = Math.max(0, categories.indexOf(item.category));
    const [background, ink, word] = colors[index];
    const art = fragment.querySelector('.card-art');
    art.classList.add(`art-${index}`);
    art.style.setProperty('--art-bg', background); art.style.setProperty('--art-ink', ink);
    fragment.querySelector('.art-category').textContent = item.category.toUpperCase();
    fragment.querySelector('.art-word').textContent = word;
    fragment.querySelector('.art-detail').textContent = 'A THOUGHT WORTH KEEPING';
    fragment.querySelector('.category-pill').textContent = item.category;
    fragment.querySelector('.card-date').textContent = dateFormat.format(new Date(item.createdAt));
    const link = fragment.querySelector('.source'); link.textContent = item.title; link.href = item.url;
    fragment.querySelector('.card-note').textContent = item.note;
    fragment.querySelector('.card-note').title = item.note;
    fragment.querySelector('.project-tag').textContent = item.project || 'Unassigned';
    const edit = fragment.querySelector('.edit'); edit.setAttribute('aria-label', `Edit ${item.title}`); edit.onclick = () => openEditor(item);
    const remove = fragment.querySelector('.remove'); remove.setAttribute('aria-label', `Remove ${item.title}`); remove.onclick = () => {
      removing = item; $('#delete-description').textContent = `“${item.title}” will be removed from your shelf.`; $('#delete-status').textContent = ''; $('#delete-dialog').showModal();
    };
    return fragment;
  }));
  $('#count').textContent = filtered.length; $('#total').textContent = items.length;
  $('#empty').hidden = loading || filtered.length > 0;
  $('#empty h3').textContent = items.length ? 'Nothing on this shelf yet.' : 'A little room for inspiration.';
  $('#empty p').textContent = items.length ? 'Try another search, project or discipline.' : 'Save your first reference and a thought worth returning to.';
  $('#empty-add').hidden = items.length > 0;
  $('#filter-summary').textContent = discipline ? `${discipline} · ${filtered.length} reference${filtered.length === 1 ? '' : 's'}` : '';
  document.querySelectorAll('nav button').forEach(button => button.classList.toggle('active', button.dataset.category === discipline));
}
function refreshProjects() {
  const selected = $('#project-filter').value;
  const projects = [...new Set(items.map(item => item.project).filter(Boolean))].sort();
  $('#project-filter').replaceChildren(new Option('All projects', ''), ...projects.map(p => new Option(p, p)));
  $('#project-filter').value = projects.includes(selected) ? selected : '';
  $('#projects').replaceChildren(...projects.map(p => new Option(p, p)));
}
async function load() {
  loading = true; $('#load-state').hidden = false; $('#load-state').textContent = 'Opening your library…';
  try { items = await api(); refreshProjects(); $('#load-state').hidden = true; }
  catch(error) { $('#load-state').textContent = error.message; }
  finally { loading = false; render(); }
}
function openEditor(item = null) {
  editing = item; form.reset(); $('#form-status').textContent = '';
  form.querySelectorAll('.field-error').forEach(element => element.textContent = '');
  form.querySelectorAll('[aria-invalid]').forEach(element => element.removeAttribute('aria-invalid'));
  if (item) for (const key of ['title','url','category','project','note']) form.elements[key].value = item[key] || '';
  $('#editor-title').textContent = item ? 'Edit your reference' : 'Save a reference';
  $('#save').textContent = item ? 'Save changes' : 'Save reference';
  editor.showModal(); form.elements.title.focus();
}
function validate(input) {
  input.setCustomValidity('');
  if (input.required && !input.value.trim()) input.setCustomValidity('Please fill in this field.');
  if (input.name === 'url' && input.value) {
    try { const url = new URL(input.value); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) input.setCustomValidity('Use a public http or https link.'); }
    catch { input.setCustomValidity('Enter a complete link beginning with https://.'); }
  }
  const valid = input.checkValidity();
  input.setAttribute('aria-invalid', String(!valid));
  $(`#${input.name}-error`).textContent = valid ? '' : input.validationMessage;
  return valid;
}
for (const name of ['title','url','category','project','note']) form.elements[name].addEventListener('input', event => { if (event.target.hasAttribute('aria-invalid')) validate(event.target); });
form.onsubmit = async event => {
  event.preventDefault();
  const controls = ['title','url','category','project','note'].map(name => form.elements[name]);
  const valid = controls.map(validate);
  if (valid.includes(false)) { controls[valid.indexOf(false)].focus(); return; }
  const body = Object.fromEntries(new FormData(form));
  const existing = editing;
  if (existing) body.__v = existing.__v;
  $('#save').disabled = true; $('#form-status').textContent = 'Saving your reference…';
  try {
    const saved = await api(existing ? `/${existing._id}` : '', { method: existing ? 'PUT' : 'POST', body: JSON.stringify(body) });
    items = existing ? items.map(item => item._id === saved._id ? saved : item) : [saved, ...items];
    discipline = ''; $('#search').value = ''; $('#project-filter').value = ''; refreshProjects(); render();
    editor.close(); notify(existing ? 'Your changes are saved.' : 'Reference saved to your shelf.');
  } catch(error) { $('#form-status').textContent = `${error.message} Your form is kept here. Check the library before retrying if the connection dropped.`; }
  finally { $('#save').disabled = false; }
};
$('#delete-confirm').onclick = async () => {
  const item = removing; $('#delete-confirm').disabled = true;
  try { await api(`/${item._id}`, { method: 'DELETE' }); items = items.filter(row => row._id !== item._id); lastRemoved = item; refreshProjects(); render(); $('#delete-dialog').close(); notify('Reference removed from your shelf.', true); }
  catch(error) { $('#delete-status').textContent = error.message; }
  finally { $('#delete-confirm').disabled = false; }
};
$('#undo').onclick = async () => {
  $('#undo').disabled = true;
  try { const restored = await api(`/${lastRemoved._id}/restore`, { method: 'POST' }); items = [restored, ...items.filter(item => item._id !== restored._id)].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); refreshProjects(); render(); notify('Reference restored.'); }
  catch(error) { notify(error.message, true); }
  finally { $('#undo').disabled = false; }
};
$('#all').dataset.category = '';
$('#all').onclick = () => { discipline = ''; render(); };
for (const [index, category] of categories.entries()) {
  form.elements.category.add(new Option(category, category));
  const button = document.createElement('button'); button.dataset.category = category;
  const dot = document.createElement('span'); dot.className = 'category-dot'; dot.style.setProperty('--tone', colors[index][1]);
  button.append(dot, document.createTextNode(category)); button.onclick = () => { discipline = discipline === category ? '' : category; render(); }; $('#categories').append(button);
}
$('#new').onclick = $('#empty-add').onclick = () => openEditor();
$('#close').onclick = $('#cancel').onclick = () => editor.close();
$('#delete-cancel').onclick = () => $('#delete-dialog').close();
$('#toast-close').onclick = () => toast.hidden = true;
$('#search').oninput = $('#project-filter').onchange = $('#sort').onchange = render;
load();
