//Set Cherdle
let currentCherdle = 3;

//Variable Declaration
let selectedPiece = "";
let currentGuess = 0;
let guesses = 0;
let numPieces = [0, 0, 0, 0, 0, 0];
let numCorrect = 0;
let infoScreen = false;
let gameOver = false;

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

//Cherdle Answer List
let answers = [[[addPiece(Knight, "W"), addPiece(Bishop, "B"), null, null],
                [null, null, addPiece(King, "B"), null],
                [addPiece(Bishop, "W"), null, null, null],
                [null, addPiece(Pawn, "W"), null, addPiece(Rook, "W")]],
                
               [[null, addPiece(Queen, "W"), null, null],
                [null, null, null, addPiece(Bishop, "W")],
                [null, null, addPiece(Bishop, "B"), null],
                [addPiece(Pawn, "B"), addPiece(King, "B"), addPiece(Rook, "B"), null]],
                
                [[null, addPiece(Queen, "B"), null, null],
                 [null, addPiece(King, "B"), addPiece(Knight, "B"), null],
                 [addPiece(Rook, "W"), null, null, addPiece(Knight, "W")],
                 [null, addPiece(Pawn, "W"), null, null]]];

//Guess Progress
let progress = [];

function setCherdleNum() {
    document.getElementById("cherdleNum").innerHTML = currentCherdle;
}

window.onload = setCherdleNum;

//Adds color to piece object
function addPiece(piece, colorCode) {
    return Object.assign({}, piece, {color: colorCode});
}

//Select a Piece
function selectPiece(piece) {

    if (!gameOver) {

        //Check if current piece is deselected
        if (piece == selectedPiece || (piece == "Cancel" && selectedPiece == "")) {
            deselectAll();
        
        //Check if new piece is selected
        } else {
            deselectAll();
            document.getElementById(piece).style.backgroundColor = "#BBB";
            if (piece == "Cancel") {
                selectedPiece = "";
            } else {
                selectedPiece = piece;
            }
        }

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

//Assign the currently selected piece to a position
function assignPos(xPos, yPos) {
    if (numCorrect < 6 && currentGuess == guesses) {
        if (selectedPiece != "") {
            if (numPieces[currentGuess] < 6) {
                if (grid[currentGuess][yPos][xPos] == null) {
                    numPieces[currentGuess]++;
                }
                let img = document.getElementById(xPos + "" + yPos).firstChild;
                img.src = "src/" + selectedPiece + ".png";
                grid[currentGuess][yPos][xPos] = getPieceObj(selectedPiece);
            }
        } else if (numPieces[currentGuess] > 0 && grid[currentGuess][yPos][xPos] != null) {
            numPieces[currentGuess]--;
            let img = document.getElementById(xPos + "" + yPos).firstChild;
            img.src = "";
            grid[currentGuess][yPos][xPos] = null;
        }

        //Update the number of pieces placed
        if (guesses < 6) {
            document.getElementById("numPieces").innerHTML = numPieces[currentGuess];
        }
    }
}

//Submit a Guess
function submitGuess() {

    let addMini = false;
    if (numCorrect < 6) {
        numCorrect = 0;
    }

    //Check if 6 pieces have been placed
    if (numPieces[currentGuess] < 6 || gameOver) {
        return;

    //Check if on final guess
    } else if (guesses >= 6) {
        gameOver = true;
        endGame(false);
        return;

    //Check if latest guess
    } else if (currentGuess == guesses) {

        if (!gameOver) {

            //Progress/Grid Declaration
            progress.push([["", "", "", ""],
                           ["", "", "", ""],
                           ["", "", "", ""],
                           ["", "", "", ""]]);
            grid.push([[null, null, null, null],
                       [null, null, null, null],
                       [null, null, null, null],
                       [null, null, null, null]])
            addMini = true;
        }
        guesses++;
    
    //Proceed to next guess
    } else if (numCorrect < 6) {
        changeGuess(currentGuess + 1)
        resetGrid();
        return;
    
    //Do not proceed if solution is found
    } else {
        return;
    }

    //Validate Grid
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {

            //Check for piece in current location
            if (grid[currentGuess][y][x] != null) {

                //Check for Green Squares
                if (answers[currentCherdle - 1][y][x] != null && grid[currentGuess][y][x].name == answers[currentCherdle - 1][y][x].name && grid[currentGuess][y][x].color == answers[currentCherdle - 1][y][x].color) {
                    progress[currentGuess][y][x] = "G";
                    numCorrect++;
                } else {
                    exit:

                    //Check for Orange/Yellow Squares
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            if (answers[currentCherdle - 1][j][i] != null && grid[currentGuess][y][x].name == answers[currentCherdle - 1][j][i].name && grid[currentGuess][y][x].color == answers[currentCherdle - 1][j][i].color) {
                                if (Math.abs(y - j) < 2 && Math.abs(x - i) < 2) {
                                    progress[currentGuess][y][x] = "O";
                                } else {
                                    progress[currentGuess][y][x] = "Y";
                                }
                                break exit;
                            }
                        }
                    }
                }
            }
        }
    }
    
    colorGrid(addMini);
    if (addMini) {
        fillMiniGrid();
    }

    //Check if game is won
    if (numCorrect == 6) {
        endGame(true);
    } else {
        document.getElementById("mini" + (guesses + 1)).classList.remove("hidden");
    }
}

//Add pieces to the latest mini grid
function fillMiniGrid() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (grid[currentGuess][y][x] != null) {
                document.getElementById(currentGuess + "" + x + "" + y).firstChild.src = getPieceString(grid[currentGuess][y][x]);
            }
        }
    }
}

//Color in the grid and/or minigrid
function colorGrid(colorMini) {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (currentGuess != guesses) {
                if (progress[currentGuess][y][x] == "G") {
                    document.getElementById(x + "" + y).classList.add("green");
                    if (colorMini) {
                        document.getElementById(currentGuess + "" + x + "" + y).classList.add("green");
                    }
                } else if (progress[currentGuess][y][x] == "Y") {
                    document.getElementById(x + "" + y).classList.add("yellow");
                    if (colorMini) {
                        document.getElementById(currentGuess + "" + x + "" + y).classList.add("yellow");
                    }     
                } else if (progress[currentGuess][y][x] == "O") {
                    document.getElementById(x + "" + y).classList.add("orange");
                    if (colorMini) {
                        document.getElementById(currentGuess + "" + x + "" + y).classList.add("orange");
                    }     
                }
            }
        }
    }
}

//Reset the grid colors for next guess
function resetGrid() {

    //Update the number of pieces placed
    document.getElementById("numPieces").innerHTML = numPieces[currentGuess];
    
    //Reset individual squares
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            let square = document.getElementById(x + "" + y);
            square.firstChild.src = "";
            square.classList.remove("green");
            square.classList.remove("yellow");
            square.classList.remove("orange");

            if (grid[currentGuess][y][x] != null) {
                square.firstChild.src = getPieceString(grid[currentGuess][y][x]);
            }
        }
    }
}

//Move to a selected guess
function changeGuess(guessID) {

    if (guessID < 6) {

        //Check if moved to latest guess
        if (guessID <= guesses) {
            document.getElementById("mini" + (currentGuess + 1)).classList.remove("selected");
            currentGuess = guessID;
            document.getElementById("mini" + (currentGuess + 1)).classList.add("selected");
        }

        resetGrid();
        colorGrid();

    }
}

//Show Completion Screen
function endGame(hasWon) {
    if (hasWon) {
        document.getElementById("mini" + guesses).style.borderColor = "#0D0";
    }
}

//Show Info Screen
function openInfo() {
    let screen = document.getElementById("infoScreen");
    let elements = document.getElementsByTagName("*");
    if (!infoScreen) {
        for(element of elements) {
            if (element != screen) {
                element.classList.add("dim");
            }
        }
        screen.classList.add("shown");
        infoScreen = true;
    } else {
        for(element of elements) {
            element.classList.remove("dim");
        }
        screen.classList.remove("shown");
        infoScreen = false;
    }

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

//Convert Object to String
function getPieceString(pieceObj) {
    return "src/" + pieceObj.name + "_" + pieceObj.color + ".png";
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