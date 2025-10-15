/**
 * StorageManager - центральный модуль для работы с данными игр
 * Реализует Repository Pattern для управления состоянием
 */
class StorageManager {
  constructor() {
    this.STORAGE_KEY = 'boardgames_data';
    this.games = [];
    this.listeners = []; // Для уведомления об изменениях (простой Pub/Sub)
  }

  // Загружает игры из localStorage или fallback на boardgames.json
  loadGames() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.games = JSON.parse(stored);
        return this.games;
      }
    } catch (error) {
      console.warn('Ошибка загрузки из localStorage:', error);
    }

    // Fallback на boardgames.json (будет загружен в sketch.js)
    return [];
  }

  // Сохраняет массив игр в localStorage
  saveGames(games = this.games) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(games));
      this.games = games;
      this.notifyListeners('gamesUpdated', games);
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
    }
  }

  // Обновляет конкретную игру по имени
  updateGame(gameName, updatedData) {
    const gameIndex = this.games.findIndex(game => game.name === gameName);
    if (gameIndex !== -1) {
      this.games[gameIndex] = { ...this.games[gameIndex], ...updatedData };
      this.saveGames();
    } else {
      console.warn(`Игра "${gameName}" не найдена`);
    }
  }

  // Добавляет новую игру
  addGame(newGame) {
    // Проверяем, что игра с таким именем не существует
    if (this.games.find(game => game.name === newGame.name)) {
      console.warn(`Игра "${newGame.name}" уже существует`);
      return false;
    }

    this.games.push({
      name: newGame.name,
      description: newGame.description || '',
      genre: newGame.genre || [],
      games: newGame.games || 0,
      difficult: newGame.difficult || 1,
      history: newGame.history || []
    });

    this.saveGames();
    return true;
  }

  // Получает игру по имени
  getGame(gameName) {
    return this.games.find(game => game.name === gameName) || null;
  }

  // Получает все игры
  getAllGames() {
    return [...this.games]; // Возвращаем копию
  }

  // Инициализирует данные из внешнего источника
  initializeFromExternal(externalGames) {
    if (this.games.length === 0) {
      // loadJSON() возвращает объект-массив, конвертируем в обычный массив
      const gamesArray = Array.isArray(externalGames) 
        ? externalGames 
        : Object.values(externalGames);
      
      this.games = gamesArray.map(game => ({
        name: game.name,
        description: game.description || '',
        genre: game.genre || [],
        games: game.games || 0,
        difficult: game.difficult || 1,
        history: game.history || []
      }));
      
      this.saveGames();
    }
  }

  // Очищает localStorage (для отладки)
  clearStorage() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.games = [];
    this.notifyListeners('gamesUpdated', []);
  }

  // Подписывается на изменения данных
  subscribe(callback) {
    this.listeners.push(callback);
  }

  // Отписывается от изменений данных
  unsubscribe(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Уведомляет всех подписчиков об изменениях
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Ошибка в listener:', error);
      }
    });
  }

  // Получает текущий view из localStorage
  getCurrentView() {
    return localStorage.getItem('current_view') || '3d';
  }

  // Сохраняет текущий view в localStorage
  setCurrentView(viewType) {
    localStorage.setItem('current_view', viewType);
    this.notifyListeners('viewChanged', viewType);
  }
}

// Создаем глобальный экземпляр
window.storageManager = new StorageManager();

