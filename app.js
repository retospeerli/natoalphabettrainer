const NATO = {
  A: 'ALFA',
  B: 'BRAVO',
  C: 'CHARLIE',
  D: 'DELTA',
  E: 'ECHO',
  F: 'FOXTROT',
  G: 'GOLF',
  H: 'HOTEL',
  I: 'INDIA',
  J: 'JULIETT',
  K: 'KILO',
  L: 'LIMA',
  M: 'MIKE',
  N: 'NOVEMBER',
  O: 'OSCAR',
  P: 'PAPA',
  Q: 'QUEBEC',
  R: 'ROMEO',
  S: 'SIERRA',
  T: 'TANGO',
  U: 'UNIFORM',
  V: 'VICTOR',
  W: 'WHISKEY',
  X: 'X-RAY',
  Y: 'YANKEE',
  Z: 'ZULU'
};

const NATO_DIGITS = {
  '0': 'ZERO',
  '1': 'ONE',
  '2': 'TWO',
  '3': 'THREE',
  '4': 'FOUR',
  '5': 'FIVE',
  '6': 'SIX',
  '7': 'SEVEN',
  '8': 'EIGHT',
  '9': 'NINE'
};

const REVERSE_NATO = {
  ...Object.fromEntries(Object.entries(NATO).map(([k, v]) => [v, k])),
  ...Object.fromEntries(Object.entries(NATO_DIGITS).map(([k, v]) => [v, k]))
};

const LETTERS = Object.keys(NATO);
const DIGITS = Object.keys(NATO_DIGITS);
const SESSION_LENGTH = 10;
const AUTO_STOP_SILENCE_MS = 2200;
const AUDIO_BASE_PATH = 'audio';
const AUDIO_EXT = '.mp3';

const FEEDBACK_AUDIO = {
  correct: `${AUDIO_BASE_PATH}/verstanden.mp3`,
  wrong: `${AUDIO_BASE_PATH}/wiederholen.mp3`
};

const WORD_LISTS = {
  nativeAnimals: [
    'FUCHS', 'DACHS', 'REH', 'HIRSCH', 'IGEL', 'MARDER', 'HASE', 'KANINCHEN',
    'EICHHOERNCHEN', 'SPATZ', 'AMSEL', 'RABE', 'FALKE', 'MILAN', 'STORCH',
    'FROSCH', 'KROETE', 'MOLCH', 'FORELLE', 'HECHT', 'BIBER', 'OTTER', 'MAUS'
  ],
  technologyVehicles: [
    'TRACTOR', 'BAGGER', 'KRAN', 'AUTO', 'LASTWAGEN',
    'BUS', 'TRAM', 'ZUG', 'MOTORRAD', 'FAHRRAD', 'ROLLER',
    'SCHIFF', 'BOOT', 'UBOOT', 'FLUGZEUG', 'HELIKOPTER',
    'RAKETE', 'SATELLIT', 'ROVER', 'DROHNE', 'COMPUTER',
    'TABLET', 'ROBOTER', 'FERNSTEUERUNG'
  ],
  buildingsLandscape: [
    'HAUS', 'SCHULE', 'TURM', 'BRUECKE', 'SCHEUNE', 'STALL', 'BAHNHOF',
    'KIRCHE', 'RATHAUS', 'STRASSE', 'PLATZ', 'WALD', 'WIESE', 'BERG',
    'HUEGEL', 'TAL', 'BACH', 'FLUSS', 'SEE', 'UFER', 'HAFEN', 'INSEL', 'FELS', 'WEG'
  ],
  names: [
    'ANNA', 'LEA', 'LINA', 'SARA', 'NORA', 'NOAH', 'LUCA', 'LEON',
    'JONAS', 'SIMON', 'ELIN', 'MILA', 'PAUL', 'DAVID', 'MIA', 'FINN',
    'JAN', 'NINA', 'LARA', 'TIM'
  ],
  leftLakeZurich: [
    'WAEDENSWIL',
    'RICHTERSWIL',
    'HORGEN',
    'THALWIL',
    'RUESCHLIKON',
    'KILCHBERG',
    'ADLISWIL',
    'LANGNAU',
    'SCHOENENBERG',
    'HUETTEN',
    'AU'
  ]
};

const CATEGORY_META = [
  {
    id: 'nativeAnimals',
    title: 'Tiere',
    sub: 'Einheimische Tiere aus Wald, Wiese und Gewässer'
  },
  {
    id: 'technologyVehicles',
    title: 'Technik',
    sub: 'Fahrzeuge, Geräte, Flugzeuge, Weltall und Spielgeräte'
  },
  {
    id: 'buildingsLandscape',
    title: 'Landschaft',
    sub: 'Gebäude, Wege und Landschaftsmerkmale'
  },
  {
    id: 'names',
    title: 'Namen',
    sub: 'Einfache Namen ohne Umlaute'
  },
  {
    id: 'leftLakeZurich',
    title: 'Orte',
    sub: 'Ortschaften am linken Zürichseeufer'
  },
  {
    id: 'codes4',
    title: 'Code 4',
    sub: 'Codes mit 4 Zeichen aus Buchstaben und Ziffern'
  },
  {
    id: 'codes5',
    title: 'Code 5',
    sub: 'Codes mit 5 Zeichen aus Buchstaben und Ziffern'
  },
  {
    id: 'codes6',
    title: 'Code 6',
    sub: 'Codes mit 6 Zeichen aus Buchstaben und Ziffern'
  },
  {
    id: 'codes7',
    title: 'Code 7',
    sub: 'Codes mit 7 Zeichen aus Buchstaben und Ziffern'
  },
  {
    id: 'codes8',
    title: 'Code 8',
    sub: 'Codes mit 8 Zeichen aus Buchstaben und Ziffern'
  }
];

const CATEGORY_LABELS = Object.fromEntries(CATEGORY_META.map((item) => [item.id, item.title]));
const DEFAULT_CATEGORIES = ['nativeAnimals', 'technologyVehicles'];

const menuScreen = document.getElementById('menuScreen');
const exerciseScreen = document.getElementById('exerciseScreen');
const resultScreen = document.getElementById('resultScreen');

const speechStatusPill = document.getElementById('speechStatusPill');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const speedInfoPill = document.getElementById('speedInfoPill');

const openHelpBtn = document.getElementById('openHelpBtn');
const openHelpBtnExercise = document.getElementById('openHelpBtnExercise');

const overviewGrid = document.getElementById('overviewGrid');
const categorySelectionGrid = document.getElementById('categorySelectionGrid');
const selectAllCategoriesBtn = document.getElementById('selectAllCategoriesBtn');
const clearAllCategoriesBtn = document.getElementById('clearAllCategoriesBtn');

const modeLabel = document.getElementById('modeLabel');
const progressLabel = document.getElementById('progressLabel');
const scoreLabel = document.getElementById('scoreLabel');
const exerciseTypeLabel = document.getElementById('exerciseTypeLabel');
const exerciseTitle = document.getElementById('exerciseTitle');
const exerciseInstruction = document.getElementById('exerciseInstruction');
const promptText = document.getElementById('promptText');
const promptSubText = document.getElementById('promptSubText');
const playBtn = document.getElementById('playBtn');
const startRecBtn = document.getElementById('startRecBtn');
const stopRecBtn = document.getElementById('stopRecBtn');
const checkBtn = document.getElementById('checkBtn');
const typedAnswerBox = document.getElementById('typedAnswerBox');
const typedAnswerText = document.getElementById('typedAnswerText');
const touchKeyboard = document.getElementById('touchKeyboard');
const speechBox = document.getElementById('speechBox');
const recognizedCodeWordsText = document.getElementById('recognizedCodeWordsText');
const derivedLettersText = document.getElementById('derivedLettersText');
const feedbackBox = document.getElementById('feedbackBox');
const sideHintText = document.getElementById('sideHintText');
const resultTitle = document.getElementById('resultTitle');
const resultSummary = document.getElementById('resultSummary');
const resultList = document.getElementById('resultList');

let recognition = null;
let recognitionSupported = false;
let recognitionRunning = false;
let currentMode = null;
let currentIndex = 0;
let score = 0;
let tasks = [];
let results = [];
let typedAnswer = '';
let playbackRate = 0.85;

let currentTranscriptRaw = '';
let currentRecognizedCodeWords = [];
let currentDerivedText = '';

let silenceTimer = null;
let manualStopRequested = false;
let feedbackAudio = null;

const modeMeta = {
  alphabetListen: {
    label: 'Alphabet hören',
    title: 'Höre zu und wähle',
    instruction: 'Höre den NATO-Begriff und tippe den passenden Buchstaben.',
    hint: 'Es wird immer nur ein einzelner NATO-Begriff abgespielt.',
    useKeyboard: true,
    useSpeech: false
  },
  wordListen: {
    label: 'Wörter hören',
    title: 'Höre zu und tippe',
    instruction: 'Höre die Buchstabierung und tippe das ganze Wort oder den ganzen Code.',
    hint: 'Die Auswahl im Menü bestimmt, welche Wörter oder Codes geübt werden.',
    useKeyboard: true,
    useSpeech: false
  },
  alphabetSpeak: {
    label: 'Alphabet sprechen',
    title: 'Sprich den NATO-Begriff',
    instruction: 'Sprich zum angezeigten Buchstaben den passenden NATO-Begriff.',
    hint: 'Die App prüft den erkannten NATO-Begriff.',
    useKeyboard: false,
    useSpeech: true
  },
  wordSpeak: {
    label: 'Wörter sprechen',
    title: 'Buchstabiere laut',
    instruction: 'Sprich für jedes Zeichen den passenden NATO-Begriff langsam und deutlich.',
    hint: 'Die App zeigt getrennt NATO-Wörter und daraus abgeleitete Zeichen.',
    useKeyboard: false,
    useSpeech: true
  }
};

function normalizeText(text) {
  return (text || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Ä/g, 'AE')
    .replace(/Ö/g, 'OE')
    .replace(/Ü/g, 'UE')
    .replace(/ß/g, 'SS')
    .replace(/[^A-Z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCodeWord(text) {
  return normalizeText(text).replace(/X RAY/g, 'X-RAY');
}

function getSpokenTokenForChar(char) {
  if (NATO[char]) return NATO[char];
  if (NATO_DIGITS[char]) return NATO_DIGITS[char];
  return null;
}

function spokenSequenceForText(text) {
  return normalizeText(text)
    .split('')
    .filter(Boolean)
    .map((char) => getSpokenTokenForChar(char))
    .filter(Boolean);
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample(array, count) {
  return shuffle(array).slice(0, count);
}

function randomCharForCode() {
  const all = [...LETTERS, ...DIGITS];
  return all[Math.floor(Math.random() * all.length)];
}

function generateRandomCode(length) {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += randomCharForCode();
  }
  return code;
}

function formatSpeed(value) {
  return `${Number(value).toFixed(2)}×`;
}

function updateSpeedUI() {
  if (speedValue) speedValue.textContent = formatSpeed(playbackRate);
  if (speedInfoPill) speedInfoPill.textContent = `Tempo: ${formatSpeed(playbackRate)}`;
}

function loadSavedSpeed() {
  const saved = localStorage.getItem('natoPlaybackRate');
  if (saved) {
    const num = Number(saved);
    if (!Number.isNaN(num) && num >= 0.5 && num <= 1.5) {
      playbackRate = num;
    }
  }
  if (speedSlider) speedSlider.value = String(playbackRate);
  updateSpeedUI();
}

function getSelectedCategories() {
  const checked = [...document.querySelectorAll('.category-checkbox:checked')].map((el) => el.value);
  return checked.length ? checked : [...DEFAULT_CATEGORIES];
}

function saveSelectedCategories() {
  localStorage.setItem('natoSelectedCategories', JSON.stringify(getSelectedCategories()));
}

function loadSelectedCategories() {
  try {
    const saved = JSON.parse(localStorage.getItem('natoSelectedCategories') || 'null');
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (error) {
    /* ignore */
  }
  return [...DEFAULT_CATEGORIES];
}

function buildCategorySelection() {
  const selected = new Set(loadSelectedCategories());
  categorySelectionGrid.innerHTML = '';

  CATEGORY_META.forEach((category) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'category-option tooltip-anchor';
    wrapper.setAttribute('data-tooltip', category.sub);
    wrapper.setAttribute('title', category.sub);

    const checked = selected.has(category.id) ? 'checked' : '';

    wrapper.innerHTML = `
      <input class="category-checkbox" type="checkbox" value="${category.id}" ${checked}>
      <span class="category-option-label">
        <span class="category-option-title">${category.title}</span>
      </span>
    `;

    categorySelectionGrid.appendChild(wrapper);
  });

  document.querySelectorAll('.category-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', saveSelectedCategories);
  });
}

function buildOverview() {
  overviewGrid.innerHTML = '';

  Object.entries(NATO).forEach(([letter, codeWord]) => {
    const item = document.createElement('div');
    item.className = 'overview-item';
    item.innerHTML = `<strong>${letter}</strong> – ${codeWord}`;
    overviewGrid.appendChild(item);
  });

  Object.entries(NATO_DIGITS).forEach(([digit, word]) => {
    const item = document.createElement('div');
    item.className = 'overview-item';
    item.innerHTML = `<strong>${digit}</strong> – ${word}`;
    overviewGrid.appendChild(item);
  });
}

function collectSelectableTasks() {
  const selected = getSelectedCategories();
  const pool = [];

  selected.forEach((categoryId) => {
    if (WORD_LISTS[categoryId]) {
      WORD_LISTS[categoryId].forEach((value) => {
        pool.push({ type: 'text', value, category: categoryId });
      });
      return;
    }

    if (categoryId.startsWith('codes')) {
      const length = Number(categoryId.replace('codes', ''));
      for (let i = 0; i < 18; i += 1) {
        pool.push({
          type: 'code',
          value: generateRandomCode(length),
          category: categoryId
        });
      }
    }
  });

  return pool;
}

function generateTasks(mode) {
  if (mode === 'alphabetListen' || mode === 'alphabetSpeak') {
    return sample(LETTERS, SESSION_LENGTH).map((letter) => ({ type: 'alphabet', value: letter }));
  }

  const pool = collectSelectableTasks();
  if (!pool.length) {
    return sample(WORD_LISTS.nativeAnimals, SESSION_LENGTH).map((value) => ({
      type: 'text',
      value,
      category: 'nativeAnimals'
    }));
  }

  return sample(pool, Math.min(SESSION_LENGTH, pool.length));
}

function setFeedback(message, type) {
  feedbackBox.textContent = message;
  feedbackBox.className = `feedback ${type}`;
}

function playFeedbackSound(kind) {
  const src = kind === 'correct' ? FEEDBACK_AUDIO.correct : FEEDBACK_AUDIO.wrong;

  try {
    if (feedbackAudio) {
      feedbackAudio.pause();
      feedbackAudio.currentTime = 0;
    }

    feedbackAudio = new Audio(src);
    feedbackAudio.play().catch(() => {});
  } catch (error) {
    /* ignore */
  }
}

function updateTypedAnswerView() {
  typedAnswerText.textContent = typedAnswer || '—';
}

function addTypedCharacter(character) {
  typedAnswer += character;
  updateTypedAnswerView();
}

function removeTypedCharacter() {
  typedAnswer = typedAnswer.slice(0, -1);
  updateTypedAnswerView();
}

function clearTypedAnswer() {
  typedAnswer = '';
  updateTypedAnswerView();
}

function buildKeyboard() {
  touchKeyboard.innerHTML = '';

  const addKey = (label, value, extraClass = '') => {
    const btn = document.createElement('button');
    btn.className = `key-btn ${extraClass}`.trim();
    btn.textContent = label;
    btn.addEventListener('click', () => {
      if (value === 'BACKSPACE') {
        removeTypedCharacter();
      } else if (value === 'CLEAR') {
        clearTypedAnswer();
      } else {
        addTypedCharacter(value);
      }
    });
    touchKeyboard.appendChild(btn);
  };

  [...LETTERS, ...DIGITS].forEach((char) => addKey(char, char));
  addKey('⌫', 'BACKSPACE', 'action');
  addKey('Löschen', 'CLEAR', 'action');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function playAudioFile(src) {
  return new Promise((resolve) => {
    const audio = new Audio(src);
    audio.playbackRate = playbackRate;
    audio.onended = () => resolve(true);
    audio.onerror = () => resolve(false);
    audio.play().then(() => {}).catch(() => resolve(false));
  });
}

function playWithTTS(parts) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(parts.join(' ... '));
    utterance.lang = 'en-US';
    utterance.rate = playbackRate;
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);
    window.speechSynthesis.speak(utterance);
  });
}

async function playCodeWord(codeWord) {
  const fileName = `${AUDIO_BASE_PATH}/${codeWord.toLowerCase().replace(/[^a-z-]/g, '')}${AUDIO_EXT}`;
  const played = await playAudioFile(fileName);
  if (!played) {
    await playWithTTS([codeWord]);
  }
}

async function playCurrentTask() {
  const task = tasks[currentIndex];
  setFeedback('Audio läuft …', 'neutral');

  if (currentMode === 'alphabetListen') {
    await playCodeWord(NATO[task.value]);
    return;
  }

  const spokenParts = spokenSequenceForText(task.value);
  for (const part of spokenParts) {
    await playCodeWord(part);
    await sleep(Math.max(120, 320 / playbackRate));
  }
}

function extractRecognizedCodeWords(transcript) {
  return normalizeCodeWord(transcript)
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => REVERSE_NATO[token]);
}

function textFromCodeWords(codeWords) {
  return codeWords.map((word) => REVERSE_NATO[word]).join('');
}

function updateSpeechViews() {
  recognizedCodeWordsText.textContent = currentRecognizedCodeWords.join(' ') || '—';
  derivedLettersText.textContent = currentDerivedText || '—';
}

function resetSpeechState() {
  currentTranscriptRaw = '';
  currentRecognizedCodeWords = [];
  currentDerivedText = '';
  updateSpeechViews();
}

function clearSilenceTimer() {
  if (silenceTimer) {
    clearTimeout(silenceTimer);
    silenceTimer = null;
  }
}

function restartSilenceTimer() {
  clearSilenceTimer();
  if (!recognitionRunning) return;

  silenceTimer = setTimeout(() => {
    if (recognitionRunning) {
      manualStopRequested = true;
      stopRecognition();
      setFeedback('Aufnahme wegen Sprechpause beendet.', 'neutral');
    }
  }, AUTO_STOP_SILENCE_MS);
}

function stopRecognition() {
  clearSilenceTimer();
  if (recognition && recognitionRunning) {
    recognition.stop();
  }
}

function updateSpeechAvailability() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognitionSupported = Boolean(SpeechRecognition);

  if (!recognitionSupported) {
    speechStatusPill.textContent = 'Spracherkennung nicht verfügbar';
    return;
  }

  speechStatusPill.textContent = 'Spracherkennung verfügbar';
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    recognitionRunning = true;
    restartSilenceTimer();
    setFeedback('Aufnahme läuft.', 'neutral');
  };

  recognition.onend = () => {
    recognitionRunning = false;
    clearSilenceTimer();

    if (!manualStopRequested && (currentMode === 'alphabetSpeak' || currentMode === 'wordSpeak')) {
      try {
        recognition.start();
        return;
      } catch (error) {
        /* ignore */
      }
    }

    manualStopRequested = false;
  };

  recognition.onerror = (event) => {
    recognitionRunning = false;
    clearSilenceTimer();
    setFeedback(`Spracherkennung: ${event.error}`, 'bad');
  };

  recognition.onresult = (event) => {
    let sessionTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      sessionTranscript += `${event.results[i][0].transcript} `;
    }

    currentTranscriptRaw = `${currentTranscriptRaw} ${sessionTranscript}`.trim();
    currentRecognizedCodeWords = extractRecognizedCodeWords(currentTranscriptRaw);
    currentDerivedText = textFromCodeWords(currentRecognizedCodeWords);
    updateSpeechViews();
    restartSilenceTimer();
  };
}

function startRecognition() {
  if (!recognitionSupported || !recognition) {
    setFeedback('Spracherkennung ist nicht verfügbar.', 'bad');
    return;
  }

  stopRecognition();
  resetSpeechState();
  manualStopRequested = false;

  try {
    recognition.start();
  } catch (error) {
    setFeedback('Aufnahme konnte nicht gestartet werden.', 'bad');
  }
}

function getCategoryLabel(categoryId) {
  return CATEGORY_LABELS[categoryId] || categoryId || '—';
}

function evaluateTask() {
  const task = tasks[currentIndex];
  let isCorrect = false;
  let expected = '';
  let user = '';
  let prompt = '';
  let expectedDisplay = '';
  let userDisplay = '';

  if (currentMode === 'alphabetListen') {
    expected = task.value;
    user = typedAnswer;
    prompt = NATO[task.value];
    expectedDisplay = expected;
    userDisplay = user || '—';
    isCorrect = user === expected;
  }

  if (currentMode === 'wordListen') {
    expected = normalizeText(task.value).replace(/\s+/g, '');
    user = typedAnswer;
    prompt = task.value;
    expectedDisplay = expected;
    userDisplay = user || '—';
    isCorrect = user === expected;
  }

  if (currentMode === 'alphabetSpeak') {
    expected = NATO[task.value];
    user = currentRecognizedCodeWords[0] || '';
    prompt = task.value;
    expectedDisplay = `${expected} → ${task.value}`;
    userDisplay = `NATO-Wort: ${user || '—'} | Zeichen: ${currentDerivedText || '—'}`;
    isCorrect = user === expected;
  }

  if (currentMode === 'wordSpeak') {
    expected = normalizeText(task.value).replace(/\s+/g, '');
    user = currentDerivedText;
    prompt = task.value;
    expectedDisplay = `${expected} (${spokenSequenceForText(task.value).join(' ')})`;
    userDisplay = `NATO-Wörter: ${currentRecognizedCodeWords.join(' ') || '—'} | Zeichen: ${user || '—'}`;
    isCorrect = user === expected;
  }

  if (isCorrect) {
    score += 1;
    scoreLabel.textContent = `${score} Punkte`;
    setFeedback('Richtig.', 'good');
    playFeedbackSound('correct');
  } else {
    setFeedback(`Nicht korrekt. Richtig wäre: ${expectedDisplay}`, 'bad');
    playFeedbackSound('wrong');
  }

  results.push({
    prompt,
    expected: expectedDisplay,
    user: userDisplay,
    correct: isCorrect,
    category: task.category || task.type || ''
  });

  setTimeout(() => {
    currentIndex += 1;
    if (currentIndex >= SESSION_LENGTH) {
      showResults();
    } else {
      renderTask();
    }
  }, 1100);
}

function renderTask() {
  const meta = modeMeta[currentMode];
  const task = tasks[currentIndex];

  manualStopRequested = true;
  stopRecognition();

  exerciseTypeLabel.textContent = meta.label;
  exerciseTitle.textContent = meta.title;
  exerciseInstruction.textContent = meta.instruction;
  sideHintText.textContent = meta.hint;
  modeLabel.textContent = meta.label;
  progressLabel.textContent = `${currentIndex + 1} / ${SESSION_LENGTH}`;
  scoreLabel.textContent = `${score} Punkte`;

  typedAnswer = '';
  updateTypedAnswerView();
  resetSpeechState();
  setFeedback('Bereit?', 'neutral');
  updateSpeedUI();

  typedAnswerBox.classList.toggle('hidden', !meta.useKeyboard);
  touchKeyboard.classList.toggle('hidden', !meta.useKeyboard);
  speechBox.classList.toggle('hidden', !meta.useSpeech);
  playBtn.classList.toggle('hidden', !meta.useKeyboard);
  startRecBtn.classList.toggle('hidden', !meta.useSpeech);
  stopRecBtn.classList.toggle('hidden', !meta.useSpeech);

  promptSubText.textContent = '';

  if (meta.useKeyboard) {
    buildKeyboard();
  }

  if (currentMode === 'alphabetListen') {
    promptText.textContent = '?';
    promptSubText.textContent = 'Höre den NATO-Begriff und tippe den passenden Buchstaben.';
  }

  if (currentMode === 'wordListen') {
    promptText.textContent = '🎧';
    promptSubText.textContent = `Kategorie: ${getCategoryLabel(task.category)} | Tippe Wort oder Code.`;
  }

  if (currentMode === 'alphabetSpeak') {
    promptText.textContent = task.value;
    promptSubText.textContent = 'Sprich den passenden NATO-Begriff.';
    if (!recognitionSupported) {
      setFeedback('Diese Übung benötigt Spracherkennung.', 'bad');
    }
  }

  if (currentMode === 'wordSpeak') {
    promptText.textContent = task.value;
    promptSubText.textContent = `Kategorie: ${getCategoryLabel(task.category)} | Buchstabiere laut im NATO-Alphabet.`;
    if (!recognitionSupported) {
      setFeedback('Diese Übung benötigt Spracherkennung.', 'bad');
    }
  }
}

function showResults() {
  manualStopRequested = true;
  stopRecognition();

  exerciseScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  resultTitle.textContent = `${modeMeta[currentMode].label}: Session beendet`;
  resultSummary.textContent = `Du hast ${score} von ${SESSION_LENGTH} Aufgaben richtig gelöst.`;
  resultList.innerHTML = '';

  results.forEach((item, index) => {
    const entry = document.createElement('div');
    entry.className = `result-item ${item.correct ? 'good' : 'bad'}`;
    entry.innerHTML = `
      <strong>Aufgabe ${index + 1}: ${item.prompt}</strong><br>
      Kategorie: ${getCategoryLabel(item.category)}<br>
      Deine Antwort: ${item.user}<br>
      Richtige Lösung: ${item.expected}
    `;
    resultList.appendChild(entry);
  });
}

function startMode(mode) {
  currentMode = mode;
  currentIndex = 0;
  score = 0;
  results = [];
  tasks = generateTasks(mode);

  if (!tasks.length) {
    setFeedback('Bitte wähle mindestens eine Kategorie.', 'bad');
    return;
  }

  menuScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  exerciseScreen.classList.remove('hidden');

  renderTask();
}

function backToMenu() {
  manualStopRequested = true;
  stopRecognition();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  exerciseScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  menuScreen.classList.remove('hidden');
}

function openHelpWindow() {
  const win = window.open('', '_blank', 'width=760,height=820');

  if (!win) return;

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Anleitung – NATO-Alphabet</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      background: #eef4ff;
      color: #142033;
    }
    .wrap {
      max-width: 760px;
      margin: 0 auto;
      padding: 24px;
    }
    .card {
      background: #fff;
      border: 1px solid #d8e3f2;
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 10px 28px rgba(18, 42, 84, 0.08);
      margin-bottom: 16px;
    }
    h1, h2, p {
      margin-top: 0;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 10px;
    }
    h2 {
      margin-bottom: 8px;
    }
    .hint {
      color: #5b6b80;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>So funktioniert die App</h1>
      <p class="hint">Hier findest du eine einfache Erklärung für jede Übungsform.</p>
    </div>

    <div class="card">
      <h2>Alphabet hören</h2>
      <p>Du drückst auf <strong>Anhören</strong>. Dann hörst du ein NATO-Wort, zum Beispiel <strong>Bravo</strong>. Danach tippst du den passenden Buchstaben auf der Tastatur. Bei <strong>Bravo</strong> wäre das der Buchstabe <strong>B</strong>.</p>
    </div>

    <div class="card">
      <h2>Wörter hören</h2>
      <p>Du drückst auf <strong>Anhören</strong>. Dann hörst du ein ganzes Wort oder einen Code im NATO-Alphabet. Du hörst zum Beispiel mehrere NATO-Wörter hintereinander. Danach tippst du das ganze Wort oder den ganzen Code mit der Tastatur.</p>
    </div>

    <div class="card">
      <h2>Alphabet sprechen</h2>
      <p>Du siehst einen Buchstaben. Dann drückst du auf <strong>Aufnahme starten</strong> und sprichst das passende NATO-Wort. Bei <strong>C</strong> sagst du zum Beispiel <strong>Charlie</strong>. Die App hört zu und prüft, ob das passt.</p>
    </div>

    <div class="card">
      <h2>Wörter sprechen</h2>
      <p>Du siehst ein Wort oder einen Code. Dann drückst du auf <strong>Aufnahme starten</strong> und buchstabierst alles laut im NATO-Alphabet. Die App schreibt mit, welche NATO-Wörter sie erkannt hat. Danach zeigt sie auch, welche Zeichen daraus geworden sind.</p>
    </div>

    <div class="card">
      <h2>Tipps</h2>
      <p>Sprich langsam und deutlich. Zwischen den NATO-Wörtern darfst du kleine Pausen machen. Wenn du eine längere Pause machst, stoppt die Aufnahme von selbst.</p>
      <p>Du kannst im Hauptfenster das <strong>Tempo</strong> einstellen und auswählen, welche Wörter oder Codes du üben möchtest.</p>
    </div>
  </div>
</body>
</html>
  `;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

document.querySelectorAll('[data-mode]').forEach((button) => {
  button.addEventListener('click', () => startMode(button.dataset.mode));
});

document.getElementById('backToMenuBtn').addEventListener('click', backToMenu);
document.getElementById('backMenuFromResultsBtn').addEventListener('click', backToMenu);
document.getElementById('restartModeBtn').addEventListener('click', () => startMode(currentMode));
playBtn.addEventListener('click', playCurrentTask);
startRecBtn.addEventListener('click', startRecognition);

stopRecBtn.addEventListener('click', () => {
  manualStopRequested = true;
  stopRecognition();
  setFeedback('Aufnahme manuell gestoppt.', 'neutral');
});

checkBtn.addEventListener('click', evaluateTask);

if (speedSlider) {
  speedSlider.addEventListener('input', (event) => {
    playbackRate = Number(event.target.value);
    localStorage.setItem('natoPlaybackRate', String(playbackRate));
    updateSpeedUI();
  });
}

if (selectAllCategoriesBtn) {
  selectAllCategoriesBtn.addEventListener('click', () => {
    document.querySelectorAll('.category-checkbox').forEach((checkbox) => {
      checkbox.checked = true;
    });
    saveSelectedCategories();
  });
}

if (clearAllCategoriesBtn) {
  clearAllCategoriesBtn.addEventListener('click', () => {
    document.querySelectorAll('.category-checkbox').forEach((checkbox) => {
      checkbox.checked = false;
    });
    saveSelectedCategories();
  });
}

if (openHelpBtn) {
  openHelpBtn.addEventListener('click', openHelpWindow);
}

if (openHelpBtnExercise) {
  openHelpBtnExercise.addEventListener('click', openHelpWindow);
}

buildOverview();
buildCategorySelection();
updateSpeechAvailability();
loadSavedSpeed();
resetSpeechState();
