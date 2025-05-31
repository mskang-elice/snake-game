const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let gameOver = false;
let score = 0;

function draw() {
    // 1. 밝은 배경
    ctx.fillStyle = '#e0ffe0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 5. 격자
    ctx.strokeStyle = '#b0e0b0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // 2. 뱀 그리기 (원형), 3. 머리에 눈 추가
    snake.forEach((part, idx) => {
        ctx.beginPath();
        ctx.arc(
            part.x * gridSize + gridSize / 2,
            part.y * gridSize + gridSize / 2,
            gridSize / 2 - 2,
            0, Math.PI * 2
        );
        ctx.fillStyle = idx === 0 ? '#2ecc40' : '#27ae60'; // 머리/몸통 색 구분
        ctx.fill();
        ctx.closePath();
        // 머리에 눈 추가
        if (idx === 0) {
            let eyeOffsetX = direction.x === -1 ? -4 : direction.x === 1 ? 4 : 0;
            let eyeOffsetY = direction.y === -1 ? -4 : direction.y === 1 ? 4 : 0;
            // 왼쪽 눈
            ctx.beginPath();
            ctx.arc(
                part.x * gridSize + gridSize / 2 - 4 + eyeOffsetX,
                part.y * gridSize + gridSize / 2 - 4 + eyeOffsetY,
                2, 0, Math.PI * 2
            );
            ctx.fillStyle = '#222';
            ctx.fill();
            ctx.closePath();
            // 오른쪽 눈
            ctx.beginPath();
            ctx.arc(
                part.x * gridSize + gridSize / 2 + 4 + eyeOffsetX,
                part.y * gridSize + gridSize / 2 - 4 + eyeOffsetY,
                2, 0, Math.PI * 2
            );
            ctx.fillStyle = '#222';
            ctx.fill();
            ctx.closePath();
        }
    });

    // 4. 사과(음식) 원형
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0, Math.PI * 2
    );
    ctx.fillStyle = '#ff4136';
    ctx.fill();
    ctx.closePath();
    // 사과 꼭지
    ctx.beginPath();
    ctx.moveTo(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2 - 8);
    ctx.lineTo(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2 - 12);
    ctx.strokeStyle = '#964B00';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Draw score
    ctx.fillStyle = '#333';
    ctx.font = '18px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
        return;
    }
    // Self collision
    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            gameOver = true;
            return;
        }
    }
    snake.unshift(head);
    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        if (!snake.some(part => part.x === newFood.x && part.y === newFood.y)) {
            break;
        }
    }
    food = newFood;
}

function gameLoop() {
    if (gameOver) {
        // 반투명 어두운 배경 박스
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(50, 130, 300, 180);
        // 게임 오버 텍스트 (흰색, 외곽선)
        ctx.font = '36px Arial';
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 4;
        ctx.strokeText('Game Over!', 100, 180);
        ctx.fillStyle = '#fff';
        ctx.fillText('Game Over!', 100, 180);
        ctx.font = '20px Arial';
        ctx.strokeText('Score: ' + score, 150, 220);
        ctx.fillText('Score: ' + score, 150, 220);
        ctx.strokeText('Press SPACE to Restart', 90, 260);
        ctx.fillText('Press SPACE to Restart', 90, 260);
        return;
    }
    // 방향키 입력 전에는 움직이지 않음
    if (direction.x !== 0 || direction.y !== 0) {
        moveSnake();
    }
    draw();
    setTimeout(gameLoop, 100);
}

function restartGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: 5, y: 5 };
    gameOver = false;
    score = 0;
    draw();
    setTimeout(gameLoop, 100); // gameLoop 재시작
}

function handleKeydown(e) {
    if (gameOver && e.code === 'Space') {
        restartGame();
        return;
    }
    switch (e.key) {
        case 'ArrowUp': if (direction.y !== 1) direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y !== -1) direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x !== 1) direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x !== -1) direction = { x: 1, y: 0 }; break;
    }
}

document.removeEventListener('keydown', handleKeydown); // 혹시 중복 방지

document.addEventListener('keydown', handleKeydown);

draw();
gameLoop();
