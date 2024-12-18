'use strict'

const MINE = '💣'
const Mark = '🚩'

var gBoard
var gLevel = {
  SIZE: 4,
  MINES: 2,
}

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}
onInit()
function onInit() {
  gBoard = buildBoard()
  renderBoard(gBoard)
}
console.table(gBoard)

function buildBoard() {
  const board = createMat(4, 4)

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  board[0][0].isMine = true
  board[3][1].isMine = true

  // getRandomMine(board)

  return board
}

function renderBoard(board) {
  const elBoard = document.querySelector('.board')
  var strHTML = ''

  for (var i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>\n'
    for (var j = 0; j < gBoard[0].length; j++) {
      const currCell = gBoard[i][j]

      var cellClass = getClassName({ i, j })
      if (currCell.isShown) {
        if (currCell.isMine) cellClass += ' mine'
        else if (!currCell.isMine) cellClass += ' number'
        strHTML += `\t<td class="cell ${cellClass}" onclick="onCellClicked(this,${i},${j})">`

        if (currCell.isMine) strHTML += MINE
        else if (!currCell.isMine) strHTML += `${setMinesNegsCount(i, j)}`
      } else {
        strHTML += `\t<td class="cell ${cellClass}" onclick="onCellClicked(this,${i},${j})"></td>\n`
      }

      strHTML += '</td>\n'
    }
    strHTML += '</tr>\n'
  }

  elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
  elCell = gBoard[i][j]
  if (elCell.isMarked || elCell.isShown) return

  if (elCell.isMine) {
    gameOver()
    return
  }

  expandShown(i, j)
}

function expandShown(cellI, cellJ) {
  var elCell = gBoard[cellI][cellJ]
  var minesCount = setMinesNegsCount(cellI, cellJ)
  elCell.minesAroundCount = minesCount

  if (elCell.minesAroundCount === 0) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i >= gBoard.length) continue

      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        if (j < 0 || j >= gBoard[0].length) continue
        if (i === cellI && j === cellJ) continue

        var neighborCell = gBoard[i][j]

        if (
          !neighborCell.isMarked &&
          !neighborCell.isShown &&
          !neighborCell.isMine
        ) {
          neighborCell.isShown = true
          renderBoard()

          if (neighborCell.minesAroundCount === 0) {
            expandShown(i, j)
          }
        }
      }
    }
  } else if (elCell.minesAroundCount !== 0) renderCell(cellI, cellJ, minesCount)
}

function gameOver() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var cell = gBoard[i][j]
      if (cell.isMine) renderCell(i, j, MINE)
    }
  }
}

function getRandomMine(board) {
  var randomCell = findEmptyPos(board)
  if (!randomCell) return
  board[randomCell.i][randomCell.j].isMine = true
  return board
}
