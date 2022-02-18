//Variable Declaration
let selectedPiece = "";
let currentGuess = 0;
let guesses = 0;

//Piece Object Declarations
let Pawn = {
    name: "Pawn",
    targets: [[-1, -1], [1, -1]]
}
let Knight = {
    name: "Knight",
    targets: [[-1, -2], [1, -2], [-1, 2], [1, 2],
              [-2, -1], [2, -1], [-2, 1], [2, 1]]
}
let Bishop = {
    name: "Bishop",
    targets: [[-1, -1], [-2, -2], [-3, -3],
              [-1, 1], [-2, 2], [-3, 3],
              [1, -1], [2, -2], [3, -3],
              [1, 1], [2, 2], [3, 3]]
}
let Rook = {
    name: "Rook",
    targets: [[-1, 0], [-2, 0], [-3, 0],
              [0, 1], [0, 2], [0, 3],
              [0, -1], [0, -2], [0, -3],
              [1, 0], [2, 0], [3, 0]]
}
let Queen = {
    name: "Queen",
    targets: [[-1, 0], [-2, 0], [-3, 0],
              [0, 1], [0, 2], [0, 3],
              [0, -1], [0, -2], [0, -3],
              [1, 0], [2, 0], [3, 0],
              [-1, -1], [-2, -2], [-3, -3],
              [-1, 1], [-2, 2], [-3, 3],
              [1, -1], [2, -2], [3, -3],
              [1, 1], [2, 2], [3, 3]]
}
let King = {
    name: "King",
    targets: [[-1, -1], [-1, 0], [-1, 1],
              [0, -1], [0, 1],
              [1, -1], [1, 0], [1, 1]]
}

//Grid Declaration
let grid = [[[null, null, null, null],
             [null, null, null, null],
             [null, null, null, null],
             [null, null, null, null]]];

//Test Answer
let answer = [[null, null, null, addPiece(Queen, "W")],
              [null, null, null, null],
              [addPiece(Pawn, "B"), null, null, null],
              [addPiece(King, "B"), null, null, addPiece(Rook, "W")]];
/*
let answer = [[Knight.color = "W", Bishop.color = "B", null, null],
              [null, null, King.color = "B", null],
              [Bishop.color = "W", null, null, null],
              [null, Pawn.color = "W", null, Rook.color = "W"]];
*/

//Guess Progress
let progress = [];

//Adds color to piece object
function addPiece(piece, colorCode) {
    return Object.assign({}, piece, {color: colorCode});
}

//Select a Piece
function selectPiece(piece) {
    deselectAll();
    document.getElementById(piece).style.backgroundColor = "#BBB";
    if (piece == "Cancel") {
        selectedPiece = "";
    } else {
        selectedPiece = piece;
    }
}

//Deselect All Pieces
function deselectAll() {
    selectedPiece = "";
    let optionsList = document.getElementsByClassName("pieceOption");
    for (let i = 0; i < optionsList.length; i++) {
        optionsList[i].style.backgroundColor = "#FFF";
    }
}

function assignPos(xPos, yPos) {
    if (selectedPiece != "") {
        let img = document.getElementById(xPos + "" + yPos).firstChild;
        img.src = "src/" + selectedPiece + ".png";
        grid[currentGuess][yPos][xPos] = getPieceObj(selectedPiece);
    } else {
        let img = document.getElementById(xPos + "" + yPos).firstChild;
        img.src = "";
        grid[currentGuess][yPos][xPos] = null;
    }
}

//Submit a Guess
function submitGuess() {

    if (currentGuess == guesses) {

        //Progress Grid Declaration
        progress.push([["", "", "", ""],
                       ["", "", "", ""],
                       ["", "", "", ""],
                       ["", "", "", ""]]);
        guesses++;
    }

    //Validate Grid
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {

            //Check for piece in current location
            if (grid[currentGuess][y][x] != null) {

                //Check for Green Squares
                if (answer[y][x] != null && grid[currentGuess][y][x].name == answer[y][x].name && grid[currentGuess][y][x].color == answer[y][x].color) {
                    progress[currentGuess][y][x] = "G";
                } else {
                    exit:

                    //Check for Blue Squares
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            if (answer[j][i] != null && grid[currentGuess][y][x].name == answer[j][i].name && grid[currentGuess][y][x].color == answer[j][i].color) {
                                progress[currentGuess][y][x] = "B";
                                break exit;
                            }
                        }
                    }
                }
            }
        }
    }
    colorGrid();
}

function colorGrid() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (progress[currentGuess][y][x] == "G") {
                document.getElementById(x + "" + y).classList.add("green");
            } else if (progress[currentGuess][y][x] == "B") {
                document.getElementById(x + "" + y).classList.add("blue");
            }
        }
    }
}

//Move to Next Guess
function nextGuess() {

    //Check if moved to latest guess
    if (currentGuess < guesses - 1) {
        colorGrid();
    }

    //Move Guess
    if (currentGuess < guesses) {
        currentGuess++;
    }
}

//Move to Previous Guess
function previousGuess() {
    if (currentGuess > 0) {
        currentGuess--;
    }
    colorGrid();
}

//Get the positions of all targetted squares
function getTargetPos(pieceObj, xPos, yPos) {

    let targetPos = [];
    for (let i = 0; i < pieceObj.targets.length; i++) {
        if (isValid(xPos + pieceObj.targets[i][0], yPos + pieceObj.targets[i][1])) {
            targetPos.push(xPos + pieceObj.targets[i][0], yPos + pieceObj.targets[i][1]);
        }
    }
    return targetPos;
}

//Check if a position is within the grid
function isValid(xPos, yPos) {
    if (xPos >= 0 && xPos <= 3 && yPos >= 0 && yPos <= 3) {
        return true;
    } else {
        return false;
    }
}

//Check if Black King is in checkmate
function isMate() {

    //Boolean array to check for adjacent free squares
    let free = [[true, true, true],
                [true, true, true],
                [true, true, true]];      

    //Loop through all adjacent squares
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {

            //Check if adjacent squares are valid
            if (isValid(xPos + i, yPos + j)) {
                
                //Exclude Black King's position
                if (i != 0 && j != 0) {

                    //Loop through all squares
                    for (let y = 0; y < grid[currentGuess].length; y++) {
                        for (let x = 0; x < grid[currentGuess][y].length; x++) {

                            //Check for white pieces
                            if (grid[currentGuess][y][x] != null && grid[currentGuess][y][x].color == "W") {
                                let pos = getTargetPos(grid[currentGuess][y][x], x, y);
                                for (let k = 0; k < pos.length; k++) {
                                    
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    return true;
}

//Convert String to Object
function getPieceObj(piece) {
    switch(piece) {
        case "Pawn_W":
            return addPiece(Pawn, "W");
        case "Pawn_B":
            return addPiece(Pawn, "B");
        case "Knight_W":
            return addPiece(Knight, "W");
        case "Knight_B":
            return addPiece(Knight, "B");
        case "Bishop_W":
            return addPiece(Bishop, "W");
        case "Bishop_B":
            return addPiece(Bishop, "B");
        case "Rook_W":
            return addPiece(Rook, "W");
        case "Rook_B":
            return addPiece(Rook, "B");
        case "Queen_W":
            return addPiece(Queen, "W");
        case "Queen_B":
            return addPiece(Queen, "B");
        case "King_W":
            return addPiece(King, "W");
        case "King_B":
            return addPiece(King, "B");
            
    }
}