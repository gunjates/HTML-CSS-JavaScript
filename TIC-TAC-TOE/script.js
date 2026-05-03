// Tic-Tac-Toe with winning logic
    const cells = document.querySelectorAll('.cell');
    let board = Array(9).fill(null);
    let currentPlayer = 'X';
    const statusDisplay = document.querySelector('.status');
    const resetButton = document.querySelector('#reset-game');
    const newGameButton = document.querySelector('#new-game');

    function checkWin() {
      const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6] // diags
      ];
      for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      return null;
    }

    function isBoardFull() {
      return board.every(cell => cell !== null);
    }

    function createSymbol(cell, player) {
      // Clear existing content
      cell.innerHTML = '';
      
      // Create SVG
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.style.width = '80px';
      svg.style.height = '80px';
      
      if (player === 'X') {
        // Wobbly X - two crossed lines
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line1.setAttribute('d', 'M 15 15 Q 35 25 85 85');
        line1.setAttribute('stroke', '#2c3e50');
        line1.setAttribute('stroke-width', '8');
        line1.setAttribute('fill', 'none');
        line1.setAttribute('stroke-linecap', 'round');
        
        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line2.setAttribute('d', 'M 15 85 Q 35 75 85 15');
        line2.setAttribute('stroke', '#2c3e50');
        line2.setAttribute('stroke-width', '8');
        line2.setAttribute('fill', 'none');
        line2.setAttribute('stroke-linecap', 'round');
        
        svg.appendChild(line1);
        svg.appendChild(line2);
      } else {
        // Wobbly O - circle (smooth)
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        circle.setAttribute('d', 'M 50 20 Q 65 12 78 28 Q 88 40 88 55 Q 90 73 78 85 Q 65 95 48 90 Q 30 82 25 65 Q 22 42 35 28 Q 42 20 50 20 Z');
        circle.setAttribute('stroke', '#2c3e50');
        circle.setAttribute('stroke-width', '8');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke-linecap', 'round');
        
        svg.appendChild(circle);
      }
      
      cell.appendChild(svg);
    }

    function resetGame() {
      board = Array(9).fill(null);
      currentPlayer = 'X';
      cells.forEach(cell => cell.innerHTML = '');
      statusDisplay.textContent = `Current player: ${currentPlayer}`;
      const winMsg = document.getElementById('win-msg');
      winMsg.classList.remove('show');
      winMsg.textContent = '';
    }


    function newGame() {
      resetGame();
      currentPlayer = 'O';
      statusDisplay.textContent = `Current player: ${currentPlayer}`;
    }

    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        const index = parseInt(cell.dataset.index);
        if (board[index] || checkWin()) return;

        board[index] = currentPlayer;
        createSymbol(cell, currentPlayer);

        const winner = checkWin();
        if (winner) {
          const winMsg = document.getElementById('win-msg');
          winMsg.textContent = `Player ${winner} wins! 🎉`;
          winMsg.classList.add('show');
          return;
        }

        if (isBoardFull()) {
          const winMsg = document.getElementById('win-msg');
          winMsg.textContent = `It's a Draw! 🤝`;
          winMsg.classList.add('show');
          return;
        }


        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Current player: ${currentPlayer}`;
      });
    });

    if (statusDisplay) statusDisplay.textContent = `Current player: ${currentPlayer}`;
    if (resetButton) {
      resetButton.addEventListener('click', resetGame);
    }
    if (newGameButton) {
      newGameButton.addEventListener('click', newGame);
    }
