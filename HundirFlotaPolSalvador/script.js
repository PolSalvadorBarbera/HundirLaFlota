
// Clase para representar un barco
class Ship {
    // Constructor: inicializa nombre, tamaño y toques recibidos
    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.hits = 0;
    }
}

// Clase para representar el tablero
class Board {
    // Constructor: inicializa filas, columnas, la cuadrícula (grid) y la lista de barcos
    constructor(rows = 10, cols = 10) {
        this.rows = rows;
        this.cols = cols;
        // Crea la cuadrícula como un array de arrays, inicializado a null
        this.grid = Array.from({length: rows}, () => Array(cols).fill(null));
        this.ships = []; // Array para guardar los barcos colocados
    }

    // Verifica si una posición y dirección son válidas para colocar un barco
    isValidPlacement(ship, row, col, direction) {
        // Comprueba si el barco se sale del tablero horizontalmente
        if (direction === 'horizontal' && col + ship.size > this.cols) return false;
        // Comprueba si el barco se sale del tablero verticalmente
        if (direction === 'vertical' && row + ship.size > this.rows) return false;

        // Comprueba si alguna celda donde iría el barco ya está ocupada
        for (let i = 0; i < ship.size; i++) {
            const currentRow = direction === 'vertical' ? row + i : row;
            const currentCol = direction === 'horizontal' ? col + i : col;

            // Si la celda no es null, significa que ya hay otro barco
            if (this.grid[currentRow][currentCol] !== null) return false;
        }
        // Si pasa todas las comprobaciones, la posición es válida
        return true;
    }

    // Coloca un barco en el tablero si la posición es válida
    placeShip(ship, row, col, direction) {
        // Primero, valida la posición
        if (!this.isValidPlacement(ship, row, col, direction)) return false; // No se puede colocar

        // Si es válida, marca las celdas correspondientes en la cuadrícula con el objeto 'ship'
        for (let i = 0; i < ship.size; i++) {
            const currentRow = direction === 'vertical' ? row + i : row;
            const currentCol = direction === 'horizontal' ? col + i : col;
            this.grid[currentRow][currentCol] = ship; // Guarda la referencia al barco en la celda
        }
        this.ships.push(ship); // Añade el barco a la lista de barcos del tablero
        return true; // Colocación exitosa ^W^
    }

    // Coloca automáticamente todos los barcos definidos en 'shipsData'
    placeAllShipsAutomatically(shipsData) {
        // Recorre cada tipo de barco definido
        shipsData.forEach(shipData => {
            let placed = false; // Bandera para saber si el barco actual ya se colocó
            const ship = new Ship(shipData.name, shipData.size); // Crea una instancia del barco

            // Intenta colocar el barco hasta que encuentre una posición válida
            while (!placed) {
                const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical'; // Dirección aleatoria
                const startRow = Math.floor(Math.random() * this.rows); // Fila inicial aleatoria
                const startCol = Math.floor(Math.random() * this.cols); // Columna inicial aleatoria

                // Intenta colocar el barco en la posición aleatoria
                if (this.isValidPlacement(ship, startRow, startCol, direction)) {
                    this.placeShip(ship, startRow, startCol, direction); // Llama a placeShip para marcarlo
                    placed = true; // Marca como colocado para salir del bucle while
                }
            }
        });
    }
}

// Datos constantes -> configuración de los barcos (nombre y tamaño)
const SHIPS_DATA = [
    { name: "Portaaviones", size: 5 },
    { name: "Acorazado", size: 4 },
    { name: "Crucero", size: 3 },
    { name: "Submarino", size: 3 },
    { name: "Destructor", size: 2 }
];

// Clase interfaz de usuario (UI) del juego
class GameUI {
    // Constructor: inicializa el estado del juego, los tableros y la UI
    constructor() {
        this.selectedShip = null; // Barco actualmente seleccionado para colocar
        this.currentOrientation = 'horizontal'; // Orientación actual para colocar
        this.playerBoard = new Board(); // Tablero del jugador
        this.opponentBoard = new Board(); // Tablero del oponente
        this.remainingShips = [...SHIPS_DATA]; // Copia de los barcos que faltan por colocar

        // Coloca automáticamente los barcos en el tablero del oponente
        this.opponentBoard.placeAllShipsAutomatically(SHIPS_DATA);
        this.initUI(); // Inicializa los elementos visuales del juego
        this.setupEventListeners(); // Configura los manejadores de eventos (clics, teclado)
    }

    // Inicializa la interfaz gráfica: crea los tableros y los botones de los barcos
    initUI() {
        this.createBoard('player-board', this.playerBoard); // Crea el tablero visual del jugador
        this.createBoard('opponent-board', this.opponentBoard, true); // Crea el tablero visual del oponente (ocultando barcos)
        this.createShipButtons(); // Crea los botones para seleccionar los barcos
    }

    // Crea la representación visual de un tablero en el HTML
    createBoard(boardId, boardInstance, isOpponent = false) {
        const boardElement = document.getElementById(boardId); // Obtiene el div del tablero
        boardElement.innerHTML = ''; // Limpia el contenido previo

        // Crea cada celda del tablero
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div'); // Crea un div para la celda
                cell.className = 'cell'; // Asigna la clase CSS
                cell.dataset.row = row; // Guarda la fila en el dataset
                cell.dataset.col = col; // Guarda la columna en el dataset

                // Si la celda contiene un barco y NO es el tablero del oponente, añade la clase 'ship' para mostrarlo
                if (boardInstance.grid[row][col] && !isOpponent) {
                    cell.classList.add('ship');
                }

                boardElement.appendChild(cell); // Añade la celda al tablero en el HTML
            }
        }
    }

    // Crea los botones para que el jugador seleccione qué barco colocar
    createShipButtons() {
        const shipsList = document.getElementById('ships-list'); // Obtiene el div de la lista de barcos
        shipsList.innerHTML = ''; // Limpia botones previos

        // Crea un botón por cada barco restante
        this.remainingShips.forEach(ship => {
            const button = document.createElement('button');
            button.textContent = `${ship.name} (${ship.size})`; // Texto del botón
            button.dataset.ship = ship.name; // Guarda el nombre del barco en el dataset
            // Añade un evento 'click' para seleccionar el barco
            button.addEventListener('click', (event) => this.selectShip(ship, event));
            shipsList.appendChild(button); // Añade el botón a la lista en el HTML
        });
    }

    // Se ejecuta cuando el jugador hace clic en un botón de barco
    selectShip(shipData, event) {
        // Crea una nueva instancia de Ship basada en los datos seleccionados
        this.selectedShip = new Ship(shipData.name, shipData.size);
        // Quita el estilo 'selected-ship' de todos los botones
        document.querySelectorAll('#ships-list button').forEach(btn => {
            btn.classList.remove('selected-ship');
        });
        // Añade el estilo 'selected-ship' al botón clicado
        event.target.classList.add('selected-ship');
        // Muestra un mensaje al jugador
        this.showMessage(`Seleccionado: ${shipData.name}. Haz clic en tu tablero para colocarlo.`);
    }

    // Configura los listeners para los eventos del juego (clics en tablero, tecla 'r')
    setupEventListeners() {
        // Listener para clics en el tablero del jugador
        document.getElementById('player-board').addEventListener('click', (e) => {
            // Si no hay barco seleccionado, muestra error y sale
            if (!this.selectedShip) {
                this.showMessage('Primero selecciona un barco', true);
                return;
            }

            // Obtiene la fila y columna de la celda clicada desde el dataset
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);

            // Intenta colocar el barco seleccionado en la posición clicada
            if (this.playerBoard.placeShip(this.selectedShip, row, col, this.currentOrientation)) {
                this.updateBoardVisual(); // Actualiza la vista del tablero
                this.removeShipFromList(); // Elimina el barco de la lista de pendientes
                this.selectedShip = null; // Deselecciona el barco
                this.checkGameStart(); // Comprueba si ya se colocaron todos los barcos
            } else {
                // Si la posición no es válida, muestra mensaje de error
                this.showMessage('¡Posición inválida!', true);
                // Añade clase 'error' temporalmente para feedback visual
                e.target.classList.add('error');
                setTimeout(() => e.target.classList.remove('error'), 1000);
            }
        });

        // Listener para la tecla 'r' para cambiar la orientación
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && this.selectedShip) { // Solo rota si hay un barco seleccionado
                this.currentOrientation = this.currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
                this.showMessage(`Orientación cambiada a: ${this.currentOrientation}`);
            }
        });
    }

    // Actualiza la apariencia visual del tablero del jugador
    updateBoardVisual() {
        // Recorre todas las celdas del tablero del jugador
        document.querySelectorAll('#player-board .cell').forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            // Añade o quita la clase 'ship' dependiendo si la celda en la lógica del tablero tiene un barco
            cell.classList.toggle('ship', this.playerBoard.grid[row][col] !== null);
        });
    }

    // Elimina un barco de la lista de pendientes y su botón correspondiente
    removeShipFromList() {
        // Filtra el array 'remainingShips' para quitar el barco recién colocado
        this.remainingShips = this.remainingShips.filter(s => s.name !== this.selectedShip.name);
        // Elimina el botón del DOM
        const buttonToRemove = document.querySelector(`#ships-list button[data-ship="${this.selectedShip.name}"]`);
        if (buttonToRemove) {
            buttonToRemove.remove();
        }
    }

    // Verifica si todos los barcos han sido colocados para iniciar la fase de ataque
    checkGameStart() {
        if (this.remainingShips.length === 0) {
            this.showMessage('¡Todos los barcos colocados! Preparando para atacar...');
            // Deshabilita el panel de barcos y el tablero del jugador para la fase de colocación
            document.getElementById('ships-panel').style.display = 'none'; // Oculta el panel de selección
            document.getElementById('player-board').classList.add('disabled'); // Deshabilita clics en el tablero propio

            // Aquí habilitaré los clics en el tablero del oponente para empezar a atacar
            // document.getElementById('opponent-board').classList.remove('disabled');
        }
    }

    // Muestra mensajes al jugador en el div 'messages'
    showMessage(message, isError = false) {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.textContent = message; // Establece el texto del mensaje
        messagesDiv.style.color = isError ? 'red' : 'green'; // Cambia el color si es un error
    }
}

// Inicia el juego :)
new GameUI();
