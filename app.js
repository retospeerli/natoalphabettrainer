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

const LETTERS = Object.keys(NATO);
const REVERSE_NATO = Object.fromEntries(Object.entries(NATO).map(([k, v]) => [v, k]));
const SESSION_LENGTH = 10;

const WORDS = [
  'BANANE', 'TIGER', 'SCHULE', 'GARTEN', 'FENSTER', 'MOND', 'RADIO', 'KAMERA',
  'BLUME', 'RITTER', 'WOLKE', 'SPINNE', 'TROMMEL', 'KARTON', 'MUSEUM', 'PLANET',
  'ANANAS', 'KROKODIL', 'RAKETE', 'PIRAT', 'ZAUBERER', 'ELEFANT', 'LEITER', 'MOTOR',
  'ORANGE', 'KISSEN', 'LAMPE', 'KAPITAN', 'WASSER', 'INSEL', 'SCHALTER',
  'FERIEN', 'MELONE', 'RUCKSACK', 'TRAKTOR', 'MARMELADE', 'ROBOTER', 'GESPENST',
  'BUCHSTABE', 'FLUGZEUG', 'KIRSCHEN', 'ABENTEUER'
];

const AUDIO_BASE_PATH = 'audio';
const AUDIO_EXT = '.mp3';

const menuScreen = document.getElementById('menuScreen');
const exerciseScreen = document.getElementById('exerciseScreen');
const resultScreen = document.getElementById('resultScreen');

const speechStatusPill = document.getElementById('speechStatusPill');
const overviewGrid = document.getElementById('overviewGrid');
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
const recognitionText = document.getElementById('recognitionText');
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
let latestTranscript = '';

const modeMeta = {
  alphabetListen: {
    label: 'Alphabet hören',
    title: 'Höre zu und wähle den Buchstaben',
    instruction: 'Drücke auf „Anhören“. Höre den NATO-Begriff und tippe den passenden Buchstaben.',
    hint: 'Es wird immer nur ein einzelner NATO-Begriff abgespielt.',
    useKeyboard: true,
    useSpeech: false
  },
  wordListen: {
    label: 'Wörter hören',
    title: 'Höre zu und tippe das Wort',
    instruction: 'Drücke auf „Anhören“. Höre die Buchstabierung und tippe das ganze Wort mit der Touch-Tastatur.',
    hint: 'Das Wort wird im NATO-Alphabet vorgelesen. Du tippst normale Buchstaben.',
    useKeyboard: true,
    useSpeech: false
  },
  alphabetSpeak: {
    label: 'Alphabet sprechen',
    title: 'Sprich den passenden NATO-Begriff',
    instruction: 'Sprich zum angezeigten Buchstaben den passenden NATO-Begriff.',
    hint: 'Beispiel: Bei B sprichst du Bravo.',
    useKeyboard: false,
    useSpeech: true
  },
  wordSpeak: {
    label: 'Wörter sprechen',
    title: 'Buchstabiere das Wort laut',
    instruction: 'Sprich für jeden Buchstaben den passenden NATO-Begriff langsam und deutlich.',
    hint: 'Beispiel: CAT = Charlie Alfa Tango.',
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
    .replace(/[^A-Z\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCodeWord(text) {
  return normalizeText(text).replace(/X RAY/g, 'X-RAY');
}

function natoForWord(word) {
  return normalizeText(word)
    .split('')
    .filter((letter) => NATO[letter])
    .map((letter) => NATO[letter]);
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

function buildOverview() {
  overviewGrid.innerHTML = '';
  Object.entries(NATO).forEach(([letter, codeWord]) => {
    const item = document.createElement('div');
    item.className = 'overview-item';
    item.innerHTML = `<strong>${letter}</strong> – ${codeWord}`;
    overviewGrid.appendChild(item);
  });
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
    setFeedback('Aufnahme läuft.', 'neutral');
  };

  recognition.onend = () => {
    recognitionRunning = false;
  };

  recognition.onerror = (event) => {
    recognitionRunning = false;
    setFeedback(`Spracherkennung: ${event.error}`, 'bad');
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = 0; i < event.results.length; i += 1) {
      transcript += `${event.results[i][0].transcript} `;
    }
    latestTranscript = transcript.trim();
    recognitionText.textContent = latestTranscript || 'Noch keine Sprachdaten.';
  };
}

function generateTasks(mode) {
  if (mode === 'alphabetListen' || mode === 'alphabetSpeak') {
    return sample(LETTERS, SESSION_LENGTH).map((letter) => ({ letter }));
  }
  return sample(WORDS, SESSION_LENGTH).map((word) => ({ word }));
}

function setFeedback(message, type) {
  feedbackBox.textContent = message;
  feedbackBox.className = `feedback ${type}`;
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

  LETTERS.forEach((letter) => addKey(letter, letter));
  addKey('⌫', 'BACKSPACE', 'action');
  addKey('Löschen', 'CLEAR', 'action');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function playAudioFile(src) {
  return new Promise((resolve) => {
    const audio = new Audio(src);

    audio.onended = () => resolve(true);
    audio.onerror = () => resolve(false);

    audio.play()
      .then(() => {})
      .catch(() => resolve(false));
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
    utterance.rate = 0.72;
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
    await playCodeWord(NATO[task.letter]);
    return;
  }

  if (currentMode === 'wordListen') {
    const codeWords = natoForWord(task.word);
    for (const codeWord of codeWords) {
      await playCodeWord(codeWord);
      await sleep(220);
    }
  }
}

function startRecognition() {
  if (!recognitionSupported || !recognition) {
    setFeedback('Spracherkennung ist nicht verfügbar.', 'bad');
    return;
  }

  latestTranscript = '';
  recognitionText.textContent = 'Ich höre zu …';

  try {
    recognition.start();
  } catch (error) {
    setFeedback('Aufnahme konnte nicht gestartet werden.', 'bad');
  }
}

function stopRecognition() {
  if (recognition && recognitionRunning) {
    recognition.stop();
  }
}

function extractLettersFromTranscript(transcript) {
  const tokens = normalizeCodeWord(transcript).split(/\s+/).filter(Boolean);
  let result = '';

  tokens.forEach((token) => {
    if (REVERSE_NATO[token]) {
      result += REVERSE_NATO[token];
    }
  });

  return result;
}

function evaluateTask() {
  const task = tasks[currentIndex];
  let isCorrect = false;
  let expected = '';
  let user = '';
  let prompt = '';
  let expectedDisplay = '';

  if (currentMode === 'alphabetListen') {
    expected = task.letter;
    user = typedAnswer;
    prompt = NATO[task.letter];
    expectedDisplay = expected;
    isCorrect = user === expected;
  }

  if (currentMode === 'wordListen') {
    expected = normalizeText(task.word).replace(/\s+/g, '');
    user = typedAnswer;
    prompt = task.word;
    expectedDisplay = expected;
    isCorrect = user === expected;
  }

  if (currentMode === 'alphabetSpeak') {
    expected = NATO[task.letter];
    user = normalizeCodeWord(latestTranscript);
    prompt = task.letter;
    expectedDisplay = expected;
    isCorrect = user === expected;
  }

  if (currentMode === 'wordSpeak') {
    expected = normalizeText(task.word).replace(/\s+/g, '');
    user = extractLettersFromTranscript(latestTranscript);
    prompt = task.word;
    expectedDisplay = `${expected} (${natoForWord(task.word).join(' ')})`;
    isCorrect = user === expected;
  }

  if (isCorrect) {
    score += 1;
    scoreLabel.textContent = `${score} Punkte`;
    setFeedback('Richtig.', 'good');
  } else {
    setFeedback(`Nicht korrekt. Richtig wäre: ${expectedDisplay}`, 'bad');
  }

  results.push({
    prompt,
    expected: expectedDisplay,
    user: currentMode === 'wordSpeak'
      ? `${normalizeCodeWord(latestTranscript) || '—'} → ${user || '—'}`
      : (user || '—'),
    correct: isCorrect
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

  exerciseTypeLabel.textContent = meta.label;
  exerciseTitle.textContent = meta.title;
  exerciseInstruction.textContent = meta.instruction;
  sideHintText.textContent = meta.hint;
  modeLabel.textContent = meta.label;
  progressLabel.textContent = `${currentIndex + 1} / ${SESSION_LENGTH}`;
  scoreLabel.textContent = `${score} Punkte`;

  typedAnswer = '';
  latestTranscript = '';
  updateTypedAnswerView();
  recognitionText.textContent = 'Noch keine Sprachdaten.';
  setFeedback('Bereit?', 'neutral');

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
    promptSubText.textContent = 'Höre die Buchstabierung und tippe das Wort.';
  }

  if (currentMode === 'alphabetSpeak') {
    promptText.textContent = task.letter;
    promptSubText.textContent = 'Sprich den passenden NATO-Begriff.';
    if (!recognitionSupported) {
      setFeedback('Diese Übung benötigt Spracherkennung.', 'bad');
    }
  }

  if (currentMode === 'wordSpeak') {
    promptText.textContent = task.word;
    promptSubText.textContent = 'Buchstabiere das Wort laut im NATO-Alphabet.';
    if (!recognitionSupported) {
      setFeedback('Diese Übung benötigt Spracherkennung.', 'bad');
    }
  }
}

function showResults() {
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

  menuScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  exerciseScreen.classList.remove('hidden');

  renderTask();
}

function backToMenu() {
  stopRecognition();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  exerciseScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  menuScreen.classList.remove('hidden');
}

document.querySelectorAll('[data-mode]').forEach((button) => {
  button.addEventListener('click', () => startMode(button.dataset.mode));
});

document.getElementById('backToMenuBtn').addEventListener('click', backToMenu);
document.getElementById('backMenuFromResultsBtn').addEventListener('click', backToMenu);
document.getElementById('restartModeBtn').addEventListener('click', () => startMode(currentMode));
playBtn.addEventListener('click', playCurrentTask);
startRecBtn.addEventListener('click', startRecognition);
stopRecBtn.addEventListener('click', stopRecognition);
checkBtn.addEventListener('click', evaluateTask);

buildOverview();
updateSpeechAvailability();
