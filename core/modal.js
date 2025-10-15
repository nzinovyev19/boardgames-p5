function defineModal() {
  const modal = select('#modal');
  const modalTitle = select('#modal-title');
  const modalGames = select('#modal-games');
  const modalDifficulty = select('#modal-difficulty');
  const modalDescription = select('#modal-description');
  const modalGenres = select('#modal-genres');
  const modalHistory = select('#modal-history');
  const modalNoHistory = select('#no-history');
  const historyCount = select('#history-count');
  const modalCloseButton = select('#modal-close');
  const modalOkButton = select('#modal-ok');
  const gamesCounter = select('#games-counter');
  const increaseGamesButton = select('#increase-games');
  const decreaseGamesButton = select('#decrease-games');

  // Form elements
  const gameForm = select('#game-form');
  const toggleFormBtn = select('#toggle-form-btn');
  const playersInput = select('#players-input');
  const winnerSelect = select('#winner-select');
  const gameDate = select('#game-date');
  const addGameBtn = select('#add-game-btn');
  const cancelFormBtn = select('#cancel-form-btn');

  // Event listeners
  modalCloseButton.mousePressed(modalClose);
  modalOkButton.mousePressed(modalClose);
  increaseGamesButton.mousePressed(quickAddGame);
  decreaseGamesButton.mousePressed(removeLastGame);
  toggleFormBtn.mousePressed(toggleForm);
  addGameBtn.mousePressed(addGameWithDetails);
  cancelFormBtn.mousePressed(hideForm);

  // Закрытие по клику на фон
  modal.mousePressed((e) => {
    if (e.target.id === 'modal') {
      modalClose();
    }
  });

  // Обновление списка победителей при изменении игроков
  playersInput.elt.addEventListener('input', updateWinnerOptions);

  let currentGame = null;
  let isFormVisible = false;
  let isModalOpen = false;

  function modalOpen(game) {
    if (isModalOpen) return;

    currentGame = game;
    isModalOpen = true;

    // Основная информация
    modalTitle.elt.innerHTML = game.name;
    modalDescription.elt.innerHTML = game.description;
    modalDifficulty.elt.innerHTML = `Сложность: ${game.difficult}/10`;

    // Отображаем games поле
    modalGames.elt.innerHTML = `Игр сыграно: ${game.games || 0}`;
    gamesCounter.elt.innerHTML = game.games || 0;

    // Заполняем жанры
    fillGenres(game);

    // Заполняем историю (последние 5)
    fillHistory(game);

    // Сбрасываем форму
    hideForm();
    resetForm();

    // Показываем модалку с анимацией
    modal.elt.style.display = 'flex';
    modal.elt.classList.add('opacity-0', 'pointer-events-none');

    setTimeout(() => {
      modal.elt.classList.remove('opacity-0', 'pointer-events-none');
    }, 10);
  }

  function fillGenres(game) {
    modalGenres.elt.innerHTML = '';
    game.genre.forEach(genre => {
      const genreSpan = createDiv(genre);
      genreSpan.class('px-3 py-1 bg-purple-600 text-purple-100 rounded-full text-xs font-medium');
      genreSpan.parent(modalGenres);
    });
  }

  function fillHistory(game) {
    modalHistory.elt.innerHTML = '';

    const totalGames = game.games || 0;
    const historyItems = game.history || [];
    const displayHistory = historyItems.slice(-5).reverse(); // Последние 5, в обратном порядке

    historyCount.elt.innerHTML = `(показано ${displayHistory.length} из ${totalGames})`;

    if (displayHistory.length > 0) {
      modalNoHistory.elt.style.display = 'none';

      displayHistory.forEach(session => {
        const sessionDiv = createDiv();
        sessionDiv.class('bg-gray-800 border border-gray-700 rounded-lg p-3');

        // Дата и победитель
        const headerDiv = createDiv();
        headerDiv.class('flex justify-between items-start mb-1');

        const winnerSpan = createSpan(`🏆 ${session.winner || 'Неизвестно'}`);
        winnerSpan.class('text-amber-400 font-semibold');
        winnerSpan.parent(headerDiv);

        const dateSpan = createSpan(new Date(session.date).toLocaleDateString('ru-RU'));
        dateSpan.class('text-gray-400 text-sm');
        dateSpan.parent(headerDiv);

        headerDiv.parent(sessionDiv);

        // Игроки
        if (session.players && session.players.length > 0) {
          const playersDiv = createDiv(`Игроки: ${session.players.join(', ')}`);
          playersDiv.class('text-gray-300 text-sm');
          playersDiv.parent(sessionDiv);
        }

        sessionDiv.parent(modalHistory);
      });
    } else {
      modalNoHistory.elt.style.display = 'block';
    }
  }

  function quickAddGame() {
    if (!currentGame) return;

    // Создаем новую сессию с минимальными данными
    addGameSession();
  }

  function removeLastGame() {
    if (!currentGame || !currentGame.games || currentGame.games === 0) return;

    // Уменьшаем счётчик
    currentGame.games--;

    // Удаляем последнюю запись из истории (если есть)
    if (currentGame.history && currentGame.history.length > 0) {
      currentGame.history.pop();
    }

    updateDisplay();

    // Сохраняем изменения через storage-manager
    storageManager.updateGame(currentGame.name, {
      games: currentGame.games,
      history: currentGame.history
    });
  }

  function toggleForm() {
    if (isFormVisible) {
      hideForm();
    } else {
      showForm();
    }
  }

  function showForm() {
    gameForm.elt.style.display = 'block';
    toggleFormBtn.elt.innerHTML = '❌ Скрыть форму';
    isFormVisible = true;

    // Устанавливаем сегодняшнюю дату
    gameDate.elt.value = new Date().toISOString().split('T')[0];
  }

  function hideForm() {
    gameForm.elt.style.display = 'none';
    toggleFormBtn.elt.innerHTML = '📝 Добавить с деталями';
    isFormVisible = false;
  }

  function resetForm() {
    playersInput.elt.value = '';
    winnerSelect.elt.innerHTML = '<option value="">Выберите победителя</option>';
    gameDate.elt.value = new Date().toISOString().split('T')[0];
  }

  function updateWinnerOptions() {
    const playersText = playersInput.elt.value.trim();
    const players = playersText ? playersText.split(',').map(p => p.trim()).filter(p => p) : [];

    winnerSelect.elt.innerHTML = '<option value="">Выберите победителя</option>';

    players.forEach(player => {
      const option = document.createElement('option');
      option.value = player;
      option.textContent = player;
      winnerSelect.elt.appendChild(option);
    });
  }

  function addGameWithDetails() {
    const playersText = playersInput.elt.value.trim();
    const players = playersText ? playersText.split(',').map(p => p.trim()).filter(p => p) : [];
    const winner = winnerSelect.elt.value;
    const date = gameDate.elt.value;

    if (!date) {
      alert('Пожалуйста, укажите дату игры');
      return;
    }

    addGameSession({
      date: date,
      winner: winner || null,
      players: players
    });

    hideForm();
    resetForm();
  }

  function addGameSession(session) {
    if (!currentGame) return;

    // Увеличиваем счётчик игр
    if (!currentGame.games) currentGame.games = 0;
    currentGame.games++;

    // Добавляем в историю
    if (session) {
      if (!currentGame.history) currentGame.history = [];
      currentGame.history.push(session);
    }

    updateDisplay();

    // Сохраняем изменения через storage-manager
    storageManager.updateGame(currentGame.name, {
      games: currentGame.games,
      history: currentGame.history
    });
  }

  function updateDisplay() {
    // Обновляем счётчики
    modalGames.elt.innerHTML = `Игр сыграно: ${currentGame.games || 0}`;
    gamesCounter.elt.innerHTML = currentGame.games || 0;

    // Перезаполняем историю
    fillHistory(currentGame);
  }

  function modalClose() {
    isModalOpen = false;
    modal.elt.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      modal.elt.style.display = 'none';
    }, 300);
  }

  return {
    modal,
    modalTitle,
    modalDescription,
    modalGames,
    modalCloseButton,
    modalClose,
    modalOpen
  };
}