//Variable Declaration
let selectedPiece = "";
let guess = 1;

//Grid Declaration
let grid = [[null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]];

//Piece Object Declarations
let Pawn = {
    targets: [[-1, -1], [1, -1]]
}
let Knight = {
    targets: [[-1, -2], [1, -2], [-1, 2], [1, 2],
              [-2, -1], [2, -1], [-2, 1], [2, 1]]
}
let Bishop = {
    targets: [[-1, -1], [-2, -2], [-3, -3],
              [-1, 1], [-2, 2], [-3, 3],
              [1, -1], [2, -2], [3, -3],
              [1, 1], [2, 2], [3, 3]]
}
let Rook = {
    targets: [[-1, 0], [-2, 0], [-3, 0],
              [0, 1], [0, 2], [0, 3],
              [0, -1], [0, -2], [0, -3],
              [1, 0], [2, 0], [3, 0]]
}
let Queen = {
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
    targets: [[-1, -1], [-1, 0], [-1, 1],
              [0, -1], [0, 1],
              [1, -1], [1, 0], [1, 1]]
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
        grid[yPos][xPos] = getPieceObj(selectedPiece);
    } else {
        let img = document.getElementById(xPos + "" + yPos).firstChild;
        img.src = "";
        grid[yPos][xPos] = null;
    }
}

//Submit a Guess
function submit() {
    guess++;
    grid = [[null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]];
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
                    for (let y = 0; y < grid.length; y++) {
                        for (let x = 0; x < grid[y].length; x++) {

                            //Check for white pieces
                            if (grid[y][x] != null && grid[y][x].color == "W") {
                                let pos = getTargetPos(grid[y][x], x, y);
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
            return Pawn.color = "W";
            break;
        case "Pawn_B":
            return Pawn.color = "B";
            break;
        case "Knight_W":
            return Knight.color = "W";
            break;
        case "Knight_B":
            return Knight.color = "B";
            break;
        case "Bishop_W":
            return Bishop.color = "W";
            break;
        case "Bishop_B":
            return Bishop.color = "B";
            break;
        case "Queen_W":
            return Queen.color = "W";
            break;
        case "Queen_B":
            return Queen.color = "B";
            break;
        case "King_W":
            return King.color = "W";
            break;
        case "King_B":
            return King.color = "B";
            break;
    }
}