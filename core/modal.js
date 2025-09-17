function defineModal() {
  const modal = select('#modal');
  const modalTitle = select('#modal-title');
  const modalGames = select('#modal-games');
  const modalDifficulty = select('#modal-difficulty');
  const modalDescription = select('#modal-description');
  const modalGenres = select('#modal-genres');
  const modalHistory = select('#modal-history');
  const modalNoHistory = select('#no-history');
  const modalCloseButton = select('#modal-close');
  const modalOkButton = select('#modal-ok');
  const gamesCounter = select('#games-counter');
  const increaseGamesButton = select('#increase-games');
  const decreaseGamesButton = select('#decrease-games');

  // Event listeners
  modalCloseButton.mousePressed(modalClose);
  modalOkButton.mousePressed(modalClose);
  increaseGamesButton.mousePressed(increaseGames);
  decreaseGamesButton.mousePressed(decreaseGames);

  // Закрытие по клику на фон
  modal.mousePressed((e) => {
    if (e.target.id === 'modal') {
      modalClose();
    }
  });

  let currentGame = null; // Храним текущую игру для обновления счётчика

  function modalOpen(game) {
    currentGame = game;

    // Основная информация
    modalTitle.elt.innerHTML = game.name;
    modalDescription.elt.innerHTML = game.description;
    modalDifficulty.elt.innerHTML = `Сложность: ${game.difficult}/10`;

    // Подсчитываем игры из истории
    const gamesCount = game.history ? game.history.length : 0;
    modalGames.elt.innerHTML = `Игр сыграно: ${gamesCount}`;
    gamesCounter.elt.innerHTML = gamesCount;

    // Заполняем жанры
    modalGenres.elt.innerHTML = '';
    game.genre.forEach(genre => {
      const genreSpan = createDiv(genre);
      genreSpan.class('px-3 py-1 bg-purple-600 text-purple-100 rounded-full text-xs font-medium');
      genreSpan.parent(modalGenres);
    });

    // Заполняем историю
    fillHistory(game);

    // Показываем модалку с анимацией
    modal.elt.style.display = 'flex';
    modal.elt.classList.add('opacity-0', 'pointer-events-none');

    setTimeout(() => {
      modal.elt.classList.remove('opacity-0', 'pointer-events-none');
    }, 10);
  }

  function fillHistory(game) {
    modalHistory.elt.innerHTML = '';

    if (game.history && game.history.length > 0) {
      modalNoHistory.elt.style.display = 'none';

      game.history.forEach(session => {
        const sessionDiv = createDiv();
        sessionDiv.class('bg-gray-800 border border-gray-700 rounded-lg p-3');

        // Дата и победитель
        const headerDiv = createDiv();
        headerDiv.class('flex justify-between items-start mb-1');

        const winnerSpan = createSpan(`🏆 ${session.winner}`);
        winnerSpan.class('text-amber-400 font-semibold');
        winnerSpan.parent(headerDiv);

        const dateSpan = createSpan(new Date(session.date).toLocaleDateString('ru-RU'));
        dateSpan.class('text-gray-400 text-sm');
        dateSpan.parent(headerDiv);

        headerDiv.parent(sessionDiv);

        // Игроки
        const playersDiv = createDiv(`Игроки: ${session.players.join(', ')}`);
        playersDiv.class('text-gray-300 text-sm');
        playersDiv.parent(sessionDiv);

        sessionDiv.parent(modalHistory);
      });
    } else {
      modalNoHistory.elt.style.display = 'block';
    }
  }

  function increaseGames() {
    if (!currentGame) return;

    // Добавляем новую запись в историю
    const newSession = {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      winner: "Неизвестно", // Можно потом добавить форму для ввода
      players: ["Игрок"] // Тоже можно расширить
    };

    if (!currentGame.history) {
      currentGame.history = [];
    }

    currentGame.history.push(newSession);

    // Обновляем отображение
    const newCount = currentGame.history.length;
    modalGames.elt.innerHTML = `Игр сыграно: ${newCount}`;
    gamesCounter.elt.innerHTML = newCount;

    // Перезаполняем историю
    fillHistory(currentGame);

    // Сохраняем в localStorage (когда добавим)
    // saveToLocalStorage();

    console.log('Добавлена новая игра:', newSession);
  }

  function decreaseGames() {
    if (!currentGame || !currentGame.history || currentGame.history.length === 0) return;

    // Удаляем последнюю запись
    currentGame.history.pop();

    // Обновляем отображение
    const newCount = currentGame.history.length;
    modalGames.elt.innerHTML = `Игр сыграно: ${newCount}`;
    gamesCounter.elt.innerHTML = newCount;

    // Перезаполняем историю
    fillHistory(currentGame);

    // Сохраняем в localStorage (когда добавим)
    // saveToLocalStorage();

    console.log('Удалена последняя игра');
  }

  function modalClose() {
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
    modalOpen,
    increaseGames,
    decreaseGames
  };
};