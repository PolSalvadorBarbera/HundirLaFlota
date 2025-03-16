class Ship {
    constructor(name, size) {
    this.name = name;
    this.size = size;
    this.hits = 0;
    }
}
class Board {
    constructor(rows = 10, cols = 10) {
        this.rows = rows;
        this.cols = cols;
        this.grid = Array.from({length: rows}, () => Array.from({length: cols}, () => null));
        this.ships = [];
    }
    //  El método .fill() te permite llenar un array con un valor específico sin necesidad de usar una función anónima
    // Array.from({ length: cols }, () => 0);
    // Array(cols).fill(0);

    placeShip(ship ) {
        const maxAttempts = 100000000000000000000000000000000;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical'; // Generamos un numero entre 0 y 1, si es menor a 0.5, hacemos un condicional ?, si es menor a 0.5, hace horizontal, si no, vertical
            const startRow = Math.floor(Math.random() * this.rows); // Filas    floor redondea para abajo
            const startCol = Math.floor(Math.random() * this.cols); // Columnas

            if (this.isValidPlacement(ship, startRow, startCol, direction)) { //Si el barco esta en un lugar válido, lo marcamos (Gritamos la función)
                this.markShipPosition(ship, startRow, startCol, direction); // Marcamos la posición del barco (Gritamos la función)
                this.ships.push(ship); // Añadimos el barco al array
                return true;
            }
            
            console.error(`No se pudo colocar ${ship.name} después de ${maxAttempts} intentos`);
            return false; // Falla
        }
    }
    isValidPlacement(ship, startRow, startCol, direction) {
        if (direction === 'horizontal' && startCol + ship.size > this.cols) { // Si el barco no cabe horizontalmente
            return false;
        } else if (direction === 'vertical' && startRow + ship.size > this.rows) { // Si el barco no cabe verticalmente
            return false;
        }

        for (let i = 0; i < ship.size; i++) {
            const currentRow = direction === 'vertical' ? startRow + i : startRow; //Si es vertical, como hacemos un for, sumamos 1,        si es horizontal, no sumamos nada
            const currentCol = direction === 'horizontal' ? startCol + i : startCol; //Si es horizontal, sumamos 1,                         si es vertical, no sumamos nada

            if (this.grid[currentRow][currentCol] !== null) { // Si la celda está ocupada (por otro barco entero) retorna false
                return false;
            }
        }
        
        return true; 
    }

    markShipPosition(ship, startRow, startCol, direction) {
        for (let i = 0; i < ship.size; i++) {
            const currentRow = direction === 'vertical' ? startRow + i : startRow; // Volvemos a hacer el for
            const currentCol = direction === 'horizontal' ? startCol + i : startCol;

            console.log(`Marcando posición: (${currentRow}, ${currentCol})`);
            
            this.grid[currentRow][currentCol] = ship; //El tablero es un array de arrays, con los array de las posiciones = al barco 
            // Asignamos el objeto [ship] a la celda en la posición [currentRow][currentCol] del tablero. <Explicado bien por el chat>
        }
    }

    //Comprovacion del tablero por si todo esta bien
    printBoard() {
        for (let row = 0; row < this.rows; row++) {
            let rowString = "";
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                rowString += cell !== null ? "S " : "0 "; // 'S' representa un barco, '0' una celda vacía
            }
            console.log(rowString);
        }
    }
};

//Configuracion

const SHIPS_DATA =  [
    { name: "Portaaviones", size: 5 },
    { name: "Acorazado", size: 4 },
    { name: "Crucero", size: 3 },
    { name: "Submarino", size: 3 },
    { name: "Destructor", size: 2 }
];

function initializeGame() {
    const gameBoard = new Board(); // Se está utilizando el constructor de la clase board para inicializar un nuevo objeto (el tablero).
    const ships = SHIPS_DATA.map(shipData => new Ship(shipData.name, shipData.size)); // Se está utilizando el constructor de la clase ship para inicializar un nuevo objeto (los barcos).

    ships.forEach(ship => gameBoard.placeShip(ship)); // Hacemos un bucle para recorrer todos los barcos y colocarlos en el tablero.
    return gameBoard;
}

const gameBoard = initializeGame();
gameBoard.printBoard(); //Mostramos en terminal



 