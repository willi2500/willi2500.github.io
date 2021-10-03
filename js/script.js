const gameContent = document.querySelector(".game-container")
const btnTurno = document.querySelector(".btn-testing")
const btnCreate = document.querySelector(".btn-create")
const btnStart = document.querySelector(".btn-start")
const btnClear = document.querySelector(".btn-clear")

let play = false


btnClear.addEventListener("click", event => {
    game.clearGame()
    console.log("algo")
})

btnCreate.addEventListener("click", event => {
    game.startGame()
})


btnStart.addEventListener("click", event => {
    play = !play
    start()
})


class Game {

    container
    board
    newRoundState
    actualState

    constructor(contaniner) {
        this.container = contaniner
        this.newRoundState = []
    }


    startGame() {

        if (this.container.children[0]) this.container.removeChild(this.container.children[0])
        this.board = new Board(50)
        gameContent.appendChild(this.board.getBoard())
        btnTurno.addEventListener("click", event => {
            this.nextRound()

        })
    }



    clearGame() {
        this.board.clearBoard()
    }

    nextRound() {
        this.actualState = []
        this.board.getBoard().childNodes.forEach(child => {
            const row = []
            const newRow = []
            child.childNodes.forEach(subChild => {
                row.push(subChild.className)
                newRow.push("")
            })
            this.actualState.push(row)
            this.newRoundState.push(newRow)
        })

        for (let row = 0; row < this.actualState.length; row++) {
            for (let x = 0; x < this.actualState[row].length; x++) {

                const neighboorsQuantity = this.getAliveNeighboorsQuantity(x, row)

                this.newRoundState[row][x] = this.applyRules(this.actualState[row][x], neighboorsQuantity)

            }
        }
        this.actualState = this.newRoundState
        this.newRoundState = []
        this.board.refresh(this.actualState)
    }


    getAliveNeighboorsQuantity(x, y) {
        let preX = x - 1
        let preY = y - 1
        let postX = x + 1
        let postY = y + 1

        switch (x) {
            case 0:
                preX = this.actualState.length - 1
                break
            case this.actualState.length - 1:
                postX = 0
        }

        switch (y) {
            case 0:
                preY = this.actualState.length - 1
                break
            case this.actualState.length - 1:
                postY = 0
        }


        let tmpArray = [
            this.actualState[preY][preX],
            this.actualState[preY][x],
            this.actualState[preY][postX],
            this.actualState[y][preX],
            this.actualState[y][postX],
            this.actualState[postY][preX],
            this.actualState[postY][x],
            this.actualState[postY][postX]
        ]
        const tmpResult = tmpArray.filter(value => value === "cell-live")
        return tmpResult.length
    }


    applyRules(actualStatusCell, liveNeighboorsQuantity) {
        if (actualStatusCell === "cell-live") {
            if (liveNeighboorsQuantity < 2 || liveNeighboorsQuantity > 3) return "cell-dead"
        } else {
            if (liveNeighboorsQuantity === 3) return "cell-live"
        }
        return actualStatusCell
    }


}


class Board {

    boardBase

    constructor(widthQuantity) {
        this.boardBase = document.createElement("div");
        this.boardBase.style.height = "80vh"
        this.boardBase.style.width = "80vh"
        this.boardBase.classList.add("board-game")

        for (let i = 0; i < widthQuantity; i++) {
            const row = this.buildRow(widthQuantity)
            this.boardBase.appendChild(row)
        }

    }

    buildRow(quantity) {
        const diameter = 100 / quantity + "%"
        const row = document.createElement("div")
        row.style.width = "100%"
        row.style.height = diameter
        row.style.display = "flex"
        row.style.flexDirection = "row"
        for (let i = 0; i < quantity; i++) {
            const cell = new Cell(diameter)
            row.appendChild(cell.getCell())
        }
        return row
    }

    getBoard() {
        return this.boardBase
    }

    clearBoard(){
        const clearBoardArray = []
        for (let row = 0; row < this.boardBase.children.length; row++) {
            const newRow =[]
            for (let x = 0; x < this.boardBase.children[row].children.length; x++) {
                newRow.push("cell-dead")
            }
            clearBoardArray.push(newRow)
        }
        this.refresh(clearBoardArray)
    }

    refresh(nextRoundStateArray) {
        for (let row = 0; row < nextRoundStateArray.length ; row++) {
            for (let x = 0; x < nextRoundStateArray[row].length ; x++) {

                this.boardBase.children[row].children[x].className = nextRoundStateArray[row][x]

            }
        }
    }

}


class Cell {

    cell

    constructor(size) {
        const baseCell = document.createElement("div")
        if (randomBool()) baseCell.classList.add("cell-live")
        else baseCell.classList.add("cell-dead")
        baseCell.style.width = size;
        baseCell.style.height = "100%";
        baseCell.addEventListener("click", event => {
            if (this.isAlive()) this.killMe()
            else this.reviveMe()
        })
        this.cell = baseCell
    }


    getCell() {
        return this.cell
    }

    isAlive() {
        return this.cell.className === "cell-live"
    }

    killMe() {
        this.cell.classList.replace("cell-live", "cell-dead")
    }

    reviveMe() {
        this.cell.classList.replace("cell-dead", "cell-live")
    }
}


function randomBool() {
    return Math.random() > 0.5
}




const game = new Game(gameContent)


function start (){

    game.nextRound()
    if (play) {
        setTimeout(start, 200)
    }
}
