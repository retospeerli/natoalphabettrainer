const NATO = {
  if (isCorrect) {
    score += 1;
    scoreLabel.textContent = `Punkte: ${score}`;
    setFeedback('Richtig!', 'good');
  } else {
    setFeedback(`Nicht korrekt. Richtig wäre: ${displayExpected}`, 'bad');
  }

  results.push({
    index: currentIndex + 1,
    prompt: currentMode === 'letterToNato' ? task.letter : task.word,
    user: displayUser,
    expected: displayExpected,
    isCorrect
  });

  setTimeout(() => {
    currentIndex += 1;
    if (currentIndex >= SESSION_LENGTH) {
      showResults();
    } else {
      renderTask();
    }
  }, 1200);
}

function showResults() {
  exerciseScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  resultTitle.textContent = `${modeMeta[currentMode].label}: Session beendet`;
  resultSummary.textContent = `Du hast ${score} von ${SESSION_LENGTH} Aufgaben richtig gelöst.`;
  resultList.innerHTML = '';

  results.forEach((item) => {
    const div = document.createElement('div');
    div.className = `result-item ${item.isCorrect ? 'good' : 'bad'}`;
    div.innerHTML = `
      <strong>Aufgabe ${item.index}: ${item.prompt}</strong><br>
      Deine Antwort: ${item.user}<br>
      Richtige Lösung: ${item.expected}
    `;
    resultList.appendChild(div);
  });
}

function backToMenu() {
  stopRecognition();
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  exerciseScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  menuScreen.classList.remove('hidden');
}

document.querySelectorAll('[data-mode]').forEach((btn) => {
  btn.addEventListener('click', () => startMode(btn.dataset.mode));
});

document.getElementById('backToMenuBtn').addEventListener('click', backToMenu);
document.getElementById('backMenuFromResultsBtn').addEventListener('click', backToMenu);
document.getElementById('restartModeBtn').addEventListener('click', () => startMode(currentMode));

checkBtn.addEventListener('click', evaluateCurrentTask);
answerInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && currentMode !== 'speak') {
    evaluateCurrentTask();
  }
});

playBtn.addEventListener('click', playCurrentWord);
startRecBtn.addEventListener('click', startRecognition);
stopRecBtn.addEventListener('click', stopRecognition);

updateSpeechStatus();
buildOverview();
