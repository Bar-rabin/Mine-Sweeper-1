'use strict'

const MINE = '💣'
const MARK = '🚩'

var gElEmoji = document.querySelector('.emoji')
var gTimeOut
var gLiveCount
var gIsvictory
var gIsHint
var gSizeBoard = 4
var gIsDarkMode
var gRandomMines
var gNumMines = 2

var gBoard
var gLevel = {}

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}
function onInit() {
  gGame.isOn = true
  gBoard = buildBoard()
  renderBoard(gBoard)
  gIsvictory = false
  gLiveCount = 3
  gGame.shownCount = 0
  gIsHint = false
  gIsDarkMode = false

  var elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
  var elLive = document.querySelector('.live')
  elLive.innerHTML = '❤️‍🩹 ❤️‍🩹 ❤️‍🩹'
  gElEmoji.innerHTML = '😃'
}
function buildBoard() {
  gLevel = {
    SIZE: gSizeBoard,
    MINES: gNumMines,
  }
  const board = createMat(gLevel.SIZE, gLevel.SIZE)

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

  for (var i = 0; i < gLevel.MINES; i++) {
    randomMine(board)
  }

  return board
}

function renderBoard(board) {
  const elBoard = document.querySelector('.board')
  var strHTML = ''

  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n'
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]

      var cellClass = getClassName({ i, j })

      if (currCell.isShown) {
        if (currCell.isMine) cellClass += ' mine'
        else if (!currCell.isMine) cellClass += ' number'
        strHTML += `\t<td class="cell ${cellClass}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(event,${i},${j})" >`

        if (currCell.isMine) strHTML += MINE
        else if (!currCell.isMine) strHTML += `${setMinesNegsCount(i, j)}`
      } else {
        strHTML += `\t<td class="cell ${cellClass}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(event,${i},${j})"></td>\n`
      }

      strHTML += '</td>\n'
    }
    strHTML += '</tr>\n'
  }

  elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
  if (!gGame.isOn) return

  if (gIsHint) {
    var count = setMinesNegsCount(i, j)
    if (gBoard[i][j].isMine) count = MINE
    if (!elCell.isMarked && !elCell.isShown) {
      if (elCell.minesAroundCount === 0) {
        expandShown(i, j)
      }
    }
    renderCell(i, j, count)
  }
  gGame.shownCount++
  elCell.style.backgroundColor = 'darkgray'

  elCell = gBoard[i][j]
  if (elCell.isMarked || elCell.isShown) return
  elCell.isShown = true
  checkIfVictory()

  if (elCell.isMine) {
    clickOnMine(i, j)
  } else {
    expandShown(i, j)
  }
}

function expandShown(cellI, cellJ) {
  if (gIsHint) {
    showAroundcell(cellI, cellJ)
  }
  var elCell = gBoard[cellI][cellJ]
  var minesCount = setMinesNegsCount(cellI, cellJ)
  elCell.minesAroundCount = minesCount

  if (minesCount === 0) {
    showAroundcell(cellI, cellJ)
  } else {
    renderCell(cellI, cellJ, minesCount)
  }
}

function gameOver() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var cell = gBoard[i][j]
      if (cell.isMine) renderCell(i, j, MINE)
    }
  }

  clearTimeout(gTimeOut)
  gElEmoji.innerHTML = '😭'
  showTheMOdal()
}

function showTheMOdal() {
  gGame.isOn = false
  var elModal = document.querySelector('.modal')

  if (gLiveCount !== 0) {
    gElEmoji.innerHTML = '😎'
    elModal.innerHTML = 'You Won!'
    elModal.style.display = 'block'
  } else {
    elModal.innerHTML = 'Game Over!'
    elModal.style.display = 'block'
  }
}

function clickOnMine(i, j) {
  gLiveCount--
  gNumMines--
  if (gLiveCount === 0) {
    var elLive = document.querySelector('.live')
    if (gLiveCount === 0) elLive.innerHTML = ''
    gameOver()
    return
  }
  var elNumMines = document.querySelector('.mines-count span')
  elNumMines.innerHTML = gNumMines
  renderCell(i, j, MINE)
  gElEmoji.innerHTML = '🤯'
  if (gIsvictory) {
    gElEmoji.innerHTML = '😎'
  }
  gTimeOut = setTimeout(() => {
    gElEmoji.innerHTML = '😃'
  }, 1000)
  removeLive()
}
function removeLive() {
  var elLive = document.querySelector('.live')
  if (gLiveCount === 2) elLive.innerHTML = '❤️‍🩹 ❤️‍🩹'
  if (gLiveCount === 1) elLive.innerHTML = '❤️‍🩹'
}

function resetGame() {
  if (gSizeBoard === 4) {
    gNumMines = 2
    changeMineNum()
  }
  if (gSizeBoard === 8) {
    gNumMines = 14
    changeMineNum()
  }
  if (gSizeBoard === 12) {
    gNumMines = 32
    changeMineNum()
  }
  onInit()
}

function checkIfVictory() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var currCell = gBoard[i][j]

      if (!currCell.isShown && !currCell.isMine) return
      if (gSizeBoard !== 4 && gLiveCount === 0) return
      if (gLiveCount === 0) return
    }
  }
  gIsvictory = true
  showTheMOdal()
}

function getHint(elHint) {
  gIsHint = true
  elHint.innerHTML = '⚡'
  setInterval(() => {
    gIsHint = false
  }, 1000)
}

function showAroundcell(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue
      if (i === cellI && j === cellJ) continue

      var currCell = gBoard[i][j]

      if (gIsHint) {
        if (!currCell.isMarked && !currCell.isShown) {
          currCell.isShown = true
          renderCell(i, j, setMinesNegsCount(i, j))
        }
      }

      if (!currCell.isMarked && !currCell.isShown && !currCell.isMine) {
        currCell.isShown = true
        renderCell(i, j, setMinesNegsCount(i, j))

        if (currCell.minesAroundCount === 0) {
          expandShown(i, j)
        }
      }
    }
  }
}

function levelUp(elLevel) {
  gNumMines = 0
  if (elLevel.innerHTML === 'Beginner') {
    gSizeBoard = 4
    gNumMines = 2
    var elNumMines = document.querySelector('.mines-count span')
    elNumMines.innerHTML = gNumMines
  }
  if (elLevel.innerHTML === 'Medium') {
    gSizeBoard = 8
    gNumMines = 14
    var elNumMines = document.querySelector('.mines-count span')
    elNumMines.innerHTML = gNumMines
  }
  if (elLevel.innerHTML === 'Expert') {
    gSizeBoard = 12
    gNumMines = 32
    var elNumMines = document.querySelector('.mines-count span')
    elNumMines.innerHTML = gNumMines
  }
  onInit()
}

function onCellMarked(event, i, j) {
  event.preventDefault()
  var currCell = gBoard[i][j]
  if (!currCell.isShown || !currCell.isMarked) {
    if (currCell.isMine) {
      gNumMines--
      changeMineNum()
    }
    currCell.isMarked = true
    renderCell(i, j, MARK)
  }
}

function darkMode(elMode) {
  var elBody = document.querySelector('body')
  var elH1 = document.querySelector('h1')
  if (!gIsDarkMode) {
    elMode.innerHTML = '🌞'
    gIsDarkMode = true
    elBody.style.backgroundColor = 'rgb(79, 66, 46)'
    elH1.style.color = 'white'
  } else {
    elMode.innerHTML = '🌚'
    gIsDarkMode = false
    elBody.style.backgroundColor = 'antiquewhite'
    elH1.style.color = 'black'
  }
}

function randomMine(board) {
  var randomIdx = findEmptyPos(board)
  console.log(randomIdx)
  while (board[randomIdx.i][randomIdx.j].isMine) {
    randomIdx = findEmptyPos(board)
  }

  board[randomIdx.i][randomIdx.j].isMine = true
}

function changeMineNum() {
  var elNumMines = document.querySelector('.mines-count span')
  elNumMines.innerHTML = gNumMines
}
