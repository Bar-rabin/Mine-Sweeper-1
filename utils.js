'use strict'

function renderBoard(board) {
  const elBoard = document.querySelector('.board')
  var strHTML = ''

  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n'
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]

      var cellClass = getClassName({ i, j })

      if (currCell.isMine) {
        cellClass += 'mine'
        strHTML += MINE
      }
      if (!currCell.isMine) {
        cellClass += 'number'
        strHTML += 'n'
      }

      strHTML += '</td>\n'
    }
    strHTML += '</tr>\n'
  }

  elBoard.innerHTML = strHTML
}

function createMat(rows, cols) {
  const mat = []
  for (var i = 0; i < rows; i++) {
    const row = []
    for (var j = 0; j < cols; j++) {
      row.push('')
    }
    mat.push(row)
  }
  return mat
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(i, j, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${i}-${j}`)
  elCell.innerHTML = value
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  var color = '#'

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
function getClassName(position) {
  const cellClass = `cell-${position.i}-${position.j}`
  return cellClass
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function findEmptyPos(gBoard) {
  var emptyPoss = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var cell = gBoard[i][j]

      if (cell === ' ') {
        var pos = { i: i, j: j }

        emptyPoss.push(pos)
      }
    }
  }

  var randIdx = getRandomInt(1, emptyPoss.length - 2)
  var emptyPos = emptyPoss[randIdx]
  return emptyPos
}

function setMinesNegsCount(cellI, cellJ) {
  var minesAroundCount = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue
      if (i === cellI && j === cellJ) continue

      var cell = gBoard[i][j]
      if (cell.isMine === true) minesAroundCount++
    }
  }

  return minesAroundCount
}

function findEmptyPos(gBoard) {
  var emptyPoss = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var cell = gBoard[i][j]

      if (cell === ' ') {
        var pos = { i: i, j: j }

        emptyPoss.push(pos)
      }
    }
  }

  var randIdx = getRandomInt(1, emptyPoss.length - 2)
  var emptyPos = emptyPoss[randIdx]
  return emptyPos
}
