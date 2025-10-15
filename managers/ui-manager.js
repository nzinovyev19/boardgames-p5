class UIManager {
  constructor(viewManager) {
    this.viewManager = viewManager;
    this.createUI();
    
    // Подписываемся на изменения view
    storageManager.subscribe((event, data) => {
      if (event === 'viewChanged') {
        this.updateActiveButton();
      }
    });
  }

  createUI() {
    // Создаем контейнер для контролов
    const controlsDiv = document.createElement('div');
    controlsDiv.id = 'view-controls';
    controlsDiv.className = 'fixed top-4 right-4 z-50';
    controlsDiv.innerHTML = `
      <div class="bg-gray-900/80 backdrop-blur-sm rounded-lg p-2 border border-purple-500/30">
        <button id="btn-2d" class="dark:text-white view-btn px-4 py-2 rounded-md">2D Grid</button>
        <button id="btn-3d" class="dark:text-white view-btn px-4 py-2 rounded-md">3D Solar</button>
      </div>
    `;

    document.body.appendChild(controlsDiv);

    // Обработчики событий
    document.getElementById('btn-2d').addEventListener('click', () => {
      this.switchView('2d');
    });

    document.getElementById('btn-3d').addEventListener('click', () => {
      this.switchView('3d');
    });

    // Инициализация активной кнопки
    this.updateActiveButton();
  }

  switchView(viewType) {
    this.viewManager.switchTo(viewType);
    this.updateActiveButton();
  }

  updateActiveButton() {
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    const activeBtn = document.getElementById(`btn-${this.viewManager.currentView}`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }
}