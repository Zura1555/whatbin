const form = document.querySelector('#recognize-form');
const citySelect = document.querySelector('#jurisdiction');
const descriptionInput = document.querySelector('#description');
const imageInput = document.querySelector('#image');
const recognitionFeedback = document.querySelector('#recognition-feedback');
const candidatePanel = document.querySelector('#candidate-panel');
const candidateName = document.querySelector('#candidate-name');
const confirmButton = document.querySelector('#confirm-button');
const correctButton = document.querySelector('#correct-button');
const resultPanel = document.querySelector('#result-panel');
const resultStatus = document.querySelector('#result-status');
const resultContent = document.querySelector('#result-content');
const recognizeButton = document.querySelector('#recognize-button');

let candidate = null;
let requestVersion = 0;

function clearResults() {
  candidate = null;
  candidatePanel.hidden = true;
  resultPanel.hidden = true;
  resultStatus.textContent = '';
  resultContent.replaceChildren();
  candidateName.textContent = '';
  recognitionFeedback.textContent = '';
  recognitionFeedback.hidden = true;
}

function showFeedback(message, isError = false) {
  recognitionFeedback.textContent = message;
  recognitionFeedback.classList.toggle('feedback-error', isError);
  recognitionFeedback.hidden = false;
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
      showFeedback(typeof data?.message === 'string' && data.message ? data.message : 'I could not confidently identify that item. Add or correct the description and try again.', true);
      return;
    }
    candidate = { canonicalItemId: proposed.canonicalItemId, itemName: proposed.itemName };
    recognitionFeedback.hidden = true;
    candidateName.textContent = candidate.itemName;
    candidatePanel.hidden = false;
    confirmButton.focus();
  } catch (error) {
    if (version === requestVersion) showFeedback(error instanceof Error ? error.message : 'Recognition failed. Please try again.', true);
  } finally {
    if (version === requestVersion) recognizeButton.disabled = false;
  }
});

citySelect.addEventListener('change', () => {
  requestVersion++;
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
  } else {
    candidatePanel.hidden = true;
    candidateName.textContent = '';
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

function renderResolution(data, city) {
  const status = typeof data?.status === 'string' ? data.status : '';
  resultPanel.hidden = false;
  resultStatus.textContent = status || 'UNAVAILABLE';
  resultStatus.className = 'status-pill' + (status === 'MATCHED' ? ' status-matched' : '');
  resultContent.replaceChildren();
  addText(resultContent, 'p', cityName(city), 'result-city');

  if (status !== 'MATCHED') {
    if (status === 'UNKNOWN' || status === 'CONFLICT') {
      addText(resultContent, 'p', typeof data.message === 'string' && data.message ? data.message : 'No single active rule is available for this item in this city.', 'result-message');
    } else addText(resultContent, 'p', 'The service did not return a usable matched result. Please try again later.', 'result-message');
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
  resultContent.append(dates);

  renderSources(data.sourceReferences);
  const supportingPassages = Array.isArray(data.supportingPassages) ? data.supportingPassages : [];
  if (supportingPassages.length) {
    const section = document.createElement('section');
    section.className = 'result-section supporting-passage';
    addText(section, 'h3', 'Supporting passages (original Vietnamese)');
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
}

confirmButton.addEventListener('click', async () => {
  if (!candidate) return;
  const confirmedItem = candidate;
  const city = citySelect.value;
  const version = ++requestVersion;
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
    renderResolution(data, city);
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
