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
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#0f0';
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw score
    ctx.fillStyle = '#fff';
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
        ctx.fillStyle = '#fff';
        ctx.font = '36px Arial';
        ctx.fillText('Game Over!', 100, 200);
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 150, 240);
        ctx.fillText('Press F5 to Restart', 110, 280);
        return;
    }
    // 방향키 입력 전에는 움직이지 않음
    if (direction.x !== 0 || direction.y !== 0) {
        moveSnake();
    }
    draw();
    setTimeout(gameLoop, 100);
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': if (direction.y !== 1) direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y !== -1) direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x !== 1) direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x !== -1) direction = { x: 1, y: 0 }; break;
    }
});

draw();
gameLoop();
