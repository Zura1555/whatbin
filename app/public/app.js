const form = document.querySelector('#recognize-form');
const citySelect = document.querySelector('#jurisdiction');
const descriptionInput = document.querySelector('#description');
const imageInput = document.querySelector('#image');
const imagePreview = document.querySelector('#image-preview');
const imagePreviewImage = document.querySelector('#image-preview-image');
const imagePreviewName = document.querySelector('#image-preview-name');
const removeImageButton = document.querySelector('#remove-image-button');
const recognitionFeedback = document.querySelector('#recognition-feedback');
const candidatePanel = document.querySelector('#candidate-panel');
const candidateName = document.querySelector('#candidate-name');
const confirmButton = document.querySelector('#confirm-button');
const correctButton = document.querySelector('#correct-button');
const resultPanel = document.querySelector('#result-panel');
const resultStatus = document.querySelector('#result-status');
const resultContent = document.querySelector('#result-content');
const recognizeButton = document.querySelector('#recognize-button');
const manualPanel = document.querySelector('#manual-panel');
const manualItemSelect = document.querySelector('#manual-item');
const manualChooseButton = document.querySelector('#manual-choose-button');

let candidate = null;
let requestVersion = 0;
let explanationHistory = [];
let manualItems = [];
let explanationVersion = 0;
let imagePreviewUrl = null;

function clearResults() {
  candidate = null;
  candidatePanel.hidden = true;
  manualPanel.hidden = true;
  manualItemSelect.replaceChildren();
  resultPanel.hidden = true;
  resultStatus.textContent = '';
  resultContent.replaceChildren();
  candidateName.textContent = '';
  recognitionFeedback.textContent = '';
  recognitionFeedback.hidden = true;
  explanationHistory = [];
  explanationVersion++;
}

function showFeedback(message, isError = false) {
  recognitionFeedback.textContent = message;
  recognitionFeedback.classList.toggle('feedback-error', isError);
  recognitionFeedback.hidden = false;
}

async function offerManualSelection(message, version) {
  showFeedback(`${message} Loading supported items…`, true);
  manualPanel.hidden = true;
  manualChooseButton.disabled = true;
  manualItemSelect.disabled = true;
  manualItemSelect.replaceChildren();
  try {
    const response = await fetch('/api/items');
    const data = await response.json();
    if (!response.ok || !Array.isArray(data?.items) || !data.items.length) throw new Error();
    manualItems = data.items;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose a supported item';
    manualItemSelect.append(placeholder);
    for (const item of manualItems) {
      if (typeof item?.canonicalItemId !== 'string' || typeof item?.itemName !== 'string') throw new Error();
      const option = document.createElement('option');
      option.value = item.canonicalItemId;
      option.textContent = item.itemName;
      manualItemSelect.append(option);
    }
    if (version !== requestVersion) return;
    manualPanel.hidden = false;
    manualItemSelect.disabled = false;
    manualChooseButton.disabled = false;
    showFeedback(`${message} Choose from the supported-item list below.`, true);
    manualItemSelect.focus();
  } catch {
    if (version === requestVersion) {
      manualPanel.hidden = true;
      showFeedback(`${message} The supported-item list could not be loaded. Please try again.`, true);
    }
  }
}

function setCandidate(item) {
  candidate = { canonicalItemId: item.canonicalItemId, itemName: item.itemName };
  manualPanel.hidden = true;
  recognitionFeedback.hidden = true;
  candidateName.textContent = candidate.itemName;
  candidatePanel.hidden = false;
  confirmButton.focus();
}

function cityName(city) {
  return city === 'hanoi' ? 'Hanoi' : 'Ho Chi Minh City';
}

async function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const result = String(reader.result || '');
      const comma = result.indexOf(',');
      if (comma < 0) reject(new Error('Could not read that photo. Choose it again or continue with a description.'));
      else resolve({ mimeType: file.type, base64: result.slice(comma + 1) });
    }, { once: true });
    reader.addEventListener('error', () => reject(new Error('Could not read that photo. Choose it again or continue with a description.')), { once: true });
    reader.readAsDataURL(file);
  });
}

function clearImagePreview() {
  if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
  imagePreviewUrl = null;
  imagePreviewImage.removeAttribute('src');
  imagePreviewImage.alt = '';
  imagePreviewName.textContent = '';
  imagePreview.hidden = true;
}

imageInput.addEventListener('change', () => {
  const file = imageInput.files?.[0];
  clearImagePreview();
  if (!file) return;
  imagePreviewUrl = URL.createObjectURL(file);
  imagePreviewImage.src = imagePreviewUrl;
  imagePreviewImage.alt = `Preview of selected photo: ${file.name}`;
  imagePreviewName.textContent = file.name;
  imagePreview.hidden = false;
});

removeImageButton.addEventListener('click', () => {
  imageInput.value = '';
  clearImagePreview();
  imageInput.focus();
});

async function postJson(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The service returned an unreadable response. Please try again.');
  }
  if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : typeof data?.message === 'string' ? data.message : 'The request could not be completed. Please try again.');
  return data;
}
async function postTextStream(path, body, onText) {
  const response = await fetch(path, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    let data;
    try { data = await response.json(); } catch {}
    throw new Error(typeof data?.error === 'string' ? data.error : 'The request could not be completed. Please try again.');
  }
  if (!response.body) throw new Error('The service did not provide a response stream.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      text += decoder.decode(value, {stream: true});
      onText(text);
    }
    text += decoder.decode();
    if (text) onText(text);
  } finally {
    reader.releaseLock();
  }
  return text;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const description = descriptionInput.value.trim();
  const file = imageInput.files?.[0];
  if (!description && !file) {
    showFeedback('Add a short description or choose a photo to identify the item.', true);
    (descriptionInput).focus();
    return;
  }

  const version = ++requestVersion;
  clearResults();
  recognizeButton.disabled = true;
  showFeedback('Identifying your item…');
  try {
    const payload = {};
    if (description) payload.description = description;
    if (file) payload.image = await readImage(file);
    if (version !== requestVersion) return;
    const data = await postJson('/api/recognize', payload);
    if (version !== requestVersion) return;
    const proposed = data?.candidate;
    if (!proposed || typeof proposed.canonicalItemId !== 'string' || !proposed.canonicalItemId.trim() || typeof proposed.itemName !== 'string' || !proposed.itemName.trim()) {
      await offerManualSelection(typeof data?.message === 'string' && data.message
        ? `${data.message} Or choose a supported item:`
        : 'I could not confidently identify that item. Choose a supported item instead:', version);
      return;
    }
    setCandidate(proposed);
  } catch (error) {
    if (version === requestVersion) await offerManualSelection(`${error instanceof Error ? error.message : 'Recognition failed.'} Choose a supported item instead:`, version);
  } finally {
    if (version === requestVersion) recognizeButton.disabled = false;
  }
});

manualChooseButton.addEventListener('click', () => {
  const selected = manualItems.find((item) => item.canonicalItemId === manualItemSelect.value);
  if (!selected) {
    showFeedback('Choose an item from the supported-item list.', true);
    manualItemSelect.focus();
    return;
  }
  setCandidate(selected);
});

citySelect.addEventListener('change', () => {
  requestVersion++;
  explanationVersion++;
  explanationHistory = [];
  recognizeButton.disabled = false;
  confirmButton.disabled = false;
  correctButton.disabled = false;
  resultPanel.hidden = true;
  resultStatus.textContent = '';
  resultContent.replaceChildren();
  recognitionFeedback.textContent = '';
  recognitionFeedback.hidden = true;
  if (candidate) {
    candidatePanel.hidden = false;
    showFeedback('Confirm the identified item to get guidance for ' + cityName(citySelect.value) + '.');
  } else if (manualPanel.hidden) {
    candidatePanel.hidden = true;
    candidateName.textContent = '';
    manualItemSelect.replaceChildren();
  } else {
    candidatePanel.hidden = true;
  }
});

correctButton.addEventListener('click', () => {
  requestVersion++;
  clearResults();
  descriptionInput.focus();
});

function addText(parent, tag, text, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  parent.append(node);
  return node;
}

function appendMarkdownInline(parent, text) {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let position = 0;
  for (const match of text.matchAll(pattern)) {
    parent.append(document.createTextNode(text.slice(position, match.index)));
    const strong = match[0].startsWith('**');
    const node = document.createElement(strong ? 'strong' : 'em');
    node.textContent = match[0].slice(strong ? 2 : 1, strong ? -2 : -1);
    parent.append(node);
    position = match.index + match[0].length;
  }
  parent.append(document.createTextNode(text.slice(position)));
}

function renderMarkdown(container, markdown) {
  container.replaceChildren();
  let paragraph = [];
  let list = null;
  const flushParagraph = () => {
    if (!paragraph.length) return;
    const node = document.createElement('p');
    appendMarkdownInline(node, paragraph.join(' '));
    container.append(node);
    paragraph = [];
  };

  for (const line of markdown.split(/\r?\n/)) {
    if (!line.trim()) {
      flushParagraph();
      list = null;
      continue;
    }
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+)$/);
    if (heading) {
      flushParagraph();
      list = null;
      const node = document.createElement('h4');
      appendMarkdownInline(node, heading[1]);
      container.append(node);
      continue;
    }
    const item = line.match(/^\s{0,3}(?:(\d+)[.)]\s+|[-*+]\s+)(.+)$/);
    if (item) {
      flushParagraph();
      const tag = item[1] ? 'ol' : 'ul';
      if (!list || list.tagName.toLowerCase() !== tag) {
        list = document.createElement(tag);
        if (item[1]) list.start = Number(item[1]);
        container.append(list);
      }
      const node = document.createElement('li');
      appendMarkdownInline(node, item[2]);
      list.append(node);
      continue;
    }
    list = null;
    paragraph.push(line.trim());
  }
  flushParagraph();
}


function safeUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

function renderSources(references) {
  const section = document.createElement('section');
  section.className = 'result-section';
  addText(section, 'h3', 'Official sources');
  if (!Array.isArray(references) || references.length === 0) {
    addText(section, 'p', 'No source references were provided.', 'muted-copy');
    resultContent.append(section);
    return;
  }
  const list = document.createElement('ul');
  list.className = 'source-list';
  for (const reference of references) {
    const item = document.createElement('li');
    if (typeof reference === 'string') {
      const url = safeUrl(reference);
      if (url) {
        const link = addText(item, 'a', reference);
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else addText(item, 'span', reference);
    } else if (reference && typeof reference === 'object') {
      const label = [reference.title, reference.citation, reference.label].find(value => typeof value === 'string' && value.trim());
      const href = safeUrl(reference.url || reference.href);
      if (href) {
        const link = addText(item, 'a', label || href);
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        if (typeof reference.citation === 'string' && label !== reference.citation) addText(item, 'span', ' — ' + reference.citation);
      } else if (label) addText(item, 'span', label);
      else addText(item, 'span', 'Source reference');
    } else continue;
    list.append(item);
  }
  if (list.childElementCount) section.append(list);
  else addText(section, 'p', 'No usable source links were provided.', 'muted-copy');
  resultContent.append(section);
}

function renderResolution(data, city, canonicalItemId) {
  const status = typeof data?.status === 'string' ? data.status : '';
  resultPanel.hidden = false;
  resultStatus.textContent = status || 'UNAVAILABLE';
  let statusClass = 'status-unavailable';
  if (status === 'MATCHED') statusClass = 'status-matched';
  else if (status === 'UNKNOWN') statusClass = 'status-unknown';
  else if (status === 'CONFLICT') statusClass = 'status-conflict';
  resultStatus.className = `status-pill ${statusClass}`;
  resultContent.replaceChildren();
  addText(resultContent, 'p', cityName(city), 'result-city');

  if (status !== 'MATCHED') {
    if (status === 'UNKNOWN') {
      const date = typeof data.asOf === 'string' ? data.asOf : 'the current local date';
      addText(resultContent, 'p', `WhatBin has no reviewed rule for this item in ${cityName(city)} as of ${date}. This does not establish that no legal route exists.`, 'result-message');
      renderExplainer(city, canonicalItemId);
    } else if (status === 'CONFLICT') {
      addText(resultContent, 'p', typeof data.message === 'string' && data.message ? data.message : 'Published records conflict for this item and city; no disposal action is provided.', 'result-message');
      renderExplainer(city, canonicalItemId);
    } else addText(resultContent, 'p', 'The service did not return a usable matched result. Please try again later.', 'result-message');
    if ((status === 'UNKNOWN' || status === 'CONFLICT') && typeof data.asOf === 'string') {
      addText(resultContent, 'p', `Resolved for local date ${data.asOf}.`, 'muted-copy');
    }
    return;
  }

  const itemName = typeof data.itemName === 'string' ? data.itemName : '';
  if (itemName) addText(resultContent, 'p', itemName, 'result-item-name');
  if (typeof data.category === 'string' && data.category) addText(resultContent, 'p', data.category, 'result-category');
  if (typeof data.instruction === 'string' && data.instruction) {
    const instruction = document.createElement('div');
    instruction.className = 'instruction';
    addText(instruction, 'p', data.instruction);
    resultContent.append(instruction);
  }

  const from = data.effectiveFrom ?? data.validFrom;
  const until = data.effectiveUntil ?? data.validUntil;
  const dates = document.createElement('dl');
  dates.className = 'effective-dates';
  addText(dates, 'dt', 'Effective from');
  addText(dates, 'dd', typeof from === 'string' && from ? from : 'Not provided');
  addText(dates, 'dt', 'Effective until');
  addText(dates, 'dd', typeof until === 'string' && until ? until : 'Not provided');
  addText(dates, 'dt', 'Resolved for local date');
  addText(dates, 'dd', typeof data.asOf === 'string' && data.asOf ? data.asOf : 'Not provided');
  resultContent.append(dates);

  renderSources(data.sourceReferences);
  const supportingPassages = Array.isArray(data.supportingPassages) ? data.supportingPassages : [];
  if (supportingPassages.length) {
    const section = document.createElement('details');
    section.className = 'result-section supporting-passage passage-disclosure';
    addText(section, 'summary', 'Supporting passages (original Vietnamese)');
    for (const passage of supportingPassages) {
      const entry = document.createElement('div');
      entry.className = 'supporting-passage-entry';
      addText(entry, 'h4', `${passage.sourceTitle} — ${passage.citation}`);
      if (typeof passage.sourceVersion === 'string' && passage.sourceVersion) {
        addText(entry, 'p', passage.sourceVersion, 'muted-copy');
      }
      addText(entry, 'blockquote', passage.text);
      const href = safeUrl(passage.sourceUrl);
      if (href) {
        const link = addText(entry, 'a', 'Open cited source');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      section.append(entry);
    }
    resultContent.append(section);
  }
  renderExplainer(city, canonicalItemId);
}

function renderExplainer(city, canonicalItemId) {
  const section = document.createElement('section');
  section.className = 'explainer result-section';
  addText(section, 'h3', 'Ask about this result');
  addText(section, 'p', 'Get an explanation of the reviewed sources. WhatBin’s displayed status and instruction stay authoritative.', 'muted-copy');

  const thread = document.createElement('div');
  thread.className = 'explainer-thread';
  thread.setAttribute('role', 'log');
  thread.setAttribute('aria-live', 'polite');
  thread.setAttribute('aria-relevant', 'additions');

  const form = document.createElement('form');
  form.className = 'explainer-form';
  const label = addText(form, 'label', 'Ask a question about this item');
  const question = document.createElement('textarea');
  question.id = 'explainer-question';
  question.rows = 3;
  question.maxLength = 1200;
  question.required = true;
  question.setAttribute('aria-describedby', 'explainer-feedback');
  label.htmlFor = question.id;
  form.append(question);
  const submit = document.createElement('button');
  submit.className = 'button button-primary';
  submit.type = 'submit';
  submit.textContent = 'Ask WhatBin';
  form.append(submit);

  const feedback = document.createElement('p');
  feedback.id = 'explainer-feedback';
  feedback.className = 'explainer-feedback';
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
  feedback.hidden = true;
  section.append(thread, form, feedback);
  resultContent.append(section);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = question.value.trim();
    if (!text) {
      feedback.textContent = 'Enter a question first.';
      feedback.classList.add('feedback-error');
      feedback.hidden = false;
      question.focus();
      return;
    }
    const version = ++explanationVersion;
    const resultVersion = requestVersion;
    const history = explanationHistory.slice(-10);
    submit.disabled = true;
    feedback.textContent = 'Checking the published sources…';
    feedback.classList.remove('feedback-error');
    feedback.hidden = false;
    addText(thread, 'p', text, 'explainer-user');
    const reply = document.createElement('div');
    reply.className = 'explainer-reply';
    thread.append(reply);
    try {
        const answer = await postTextStream('/api/explain', {
          canonicalItemId, jurisdiction: city, question: text, history, confirmed: true
        }, (value) => {
          renderMarkdown(reply, value);
          feedback.hidden = true;
        });
        if (version !== explanationVersion || resultVersion !== requestVersion) return;
        if (!answer.trim()) throw new Error('The explainer returned no answer.');

        explanationHistory = [...history, {role: 'user', content: text}, {role: 'assistant', content: answer}].slice(-10);
        question.value = '';
        feedback.hidden = true;
        question.focus();
    } catch (error) {
      reply.remove();
      if (version === explanationVersion && resultVersion === requestVersion) {
        feedback.textContent = error instanceof Error ? error.message : 'The explanation could not be retrieved. Try again.';
        feedback.classList.add('feedback-error');
        feedback.hidden = false;
      }
    } finally {
      if (version === explanationVersion && resultVersion === requestVersion) submit.disabled = false;
    }
  });
}

confirmButton.addEventListener('click', async () => {
  if (!candidate) return;
  const confirmedItem = candidate;
  const city = citySelect.value;
  const version = ++requestVersion;
  explanationVersion++;
  explanationHistory = [];
  confirmButton.disabled = true;
  correctButton.disabled = true;
  resultPanel.hidden = true;
  showFeedback('Checking active guidance for ' + cityName(city) + '…');
  try {
    const data = await postJson('/api/resolve', {
      jurisdiction: city,
      canonicalItemId: confirmedItem.canonicalItemId,
      confirmed: true
    });
    if (version !== requestVersion || city !== citySelect.value) return;
    recognitionFeedback.hidden = true;
    renderResolution(data, city, confirmedItem.canonicalItemId);
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    if (version === requestVersion) showFeedback(error instanceof Error ? error.message : 'Could not retrieve city guidance. Please try again.', true);
  } finally {
    if (version === requestVersion) {
      confirmButton.disabled = false;
      correctButton.disabled = false;
    }
  }
});
