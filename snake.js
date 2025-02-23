const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");

const box = 20;
let score = 0;
let level = 1;
let applesEaten = 0;

// Load images for snake and apple
const snakeHeadImage = new Image();
snakeHeadImage.src = "https://www.shutterstock.com/image-photo/africanamerican-man-face-260nw-506914330.jpg";
const snakeBodyImage = new Image();
snakeBodyImage.src = "https://img.freepik.com/free-photo/deer-skin-pattern_1388-45.jpg";
const appleImage = new Image();
appleImage.src = "https://media-cdn.tripadvisor.com/media/photo-s/26/d0/a4/d7/kfc-logo.jpg";

// Load background music (now using local "song.mp3")
const bgMusic = new Audio();
bgMusic.src = "song.mp3";  // Replace with the correct path if needed
bgMusic.loop = true;
bgMusic.play();

// Set canvas size (larger screen)
canvas.width = 500;  // Increased width
canvas.height = 500; // Increased height

// Initialize snake
let snake = [
  { x: 5 * box, y: 5 * box }
];

// Initialize food
let food = generateFood();

// Initial direction
let d = "RIGHT";

// Direction control
document.addEventListener("keydown", direction);

// Direction change logic
function direction(event) {
  if (event.key === "ArrowLeft" && d !== "RIGHT") {
    d = "LEFT";
  } else if (event.key === "ArrowUp" && d !== "DOWN") {
    d = "UP";
  } else if (event.key === "ArrowRight" && d !== "LEFT") {
    d = "RIGHT";
  } else if (event.key === "ArrowDown" && d !== "UP") {
    d = "DOWN";
  }
}

// Draw the snake
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    // Draw the snake head with the image
    if (i === 0) {
      ctx.drawImage(snakeHeadImage, snake[i].x, snake[i].y, box, box);
    } else {
      // Draw the body with the body image
      ctx.drawImage(snakeBodyImage, snake[i].x, snake[i].y, box, box);
    }
  }
}

// Draw the food (apple)
function drawFood() {
  ctx.drawImage(appleImage, food.x, food.y, box, box);
}

// Generate random food position
function generateFood() {
  return {
    x: Math.floor(Math.random() * 24 + 1) * box, // Adjusted for new canvas size
    y: Math.floor(Math.random() * 24 + 1) * box  // Adjusted for new canvas size
  };
}

// Update the snake's position
function update() {
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d === "LEFT") snakeX -= box;
  if (d === "UP") snakeY -= box;
  if (d === "RIGHT") snakeX += box;
  if (d === "DOWN") snakeY += box;

  // Game Over conditions
  if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(snakeX, snakeY, snake)) {
    clearInterval(game);
    showGameOver();
    return;
  }

  // If snake eats food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    applesEaten++;
    food = generateFood();

    // Level up every 5 apples eaten
    if (applesEaten % 5 === 0) {
      level++;
      // Snake grows after every level
      snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
    }
  } else {
    snake.pop();
  }

  let newHead = {
    x: snakeX,
    y: snakeY
  };

  snake.unshift(newHead);
}

// Detect collision with self
function collision(headX, headY, array) {
  for (let i = 0; i < array.length; i++) {
    if (headX === array[i].x && headY === array[i].y) {
      return true;
    }
  }
  return false;
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "green";  // Set green background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawSnake();
  drawFood();
  update();
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Level: " + level, canvas.width - 80, 20);
}

// Show the Game Over screen with styling
function showGameOver() {
  // Draw a semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the "ROUND OVER" text
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("ROUND OVER", canvas.width / 2, canvas.height / 3);

  // Draw score and level
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2);
  ctx.fillText("Level: " + level, canvas.width / 2, canvas.height / 1.8);

  // Restart button
  ctx.font = "25px Arial";
  ctx.fillText("Press ENTER to Restart", canvas.width / 2, canvas.height / 1.5);

  // Wait for the restart action
  document.addEventListener("keydown", restartGame);
}

// Restart the game
function restartGame(event) {
  if (event.key === "Enter") {
    score = 0;
    level = 1;
    applesEaten = 0;
    snake = [
      { x: 5 * box, y: 5 * box }
    ];
    food = generateFood();
    d = "RIGHT";
    game = setInterval(draw, 1000 / 10);  // Slower snake, 10 FPS
  }
}

// Game loop with optimized frame rate
let game = setInterval(draw, 1000 / 10);  // 10 frames per second for slower snake
