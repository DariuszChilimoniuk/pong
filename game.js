const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Create the paddle
const paddleWidth = 10, paddleHeight = 100;
const player = {
    x: 0,
    y: canvas.height/2 - paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};
const ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height/2 - paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 3
};

// Create the ball
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    dx: 5,
    dy: 5
};

// Draw rectangle
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Draw circle
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

// Draw text
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "32px Arial";
    ctx.fillText(text, x, y);
}

// Render everything
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#232323");
    drawRect(player.x, player.y, player.width, player.height, "#fff");
    drawRect(ai.x, ai.y, ai.width, ai.height, "#fff");
    drawCircle(ball.x, ball.y, ball.radius, "#fff");
}

// Control the player paddle
document.addEventListener("keydown", function(e) {
    if(e.key === "ArrowUp") player.dy = -6;
    else if(e.key === "ArrowDown") player.dy = 6;
});
document.addEventListener("keyup", function(e) {
    if(e.key === "ArrowUp" || e.key === "ArrowDown") player.dy = 0;
});

function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.dx = -ball.dx;
    ball.dy = 5 * (Math.random() > 0.5 ? 1 : -1);
}

// Update positions
function update() {
    // Move player
    player.y += player.dy;
    if(player.y < 0) player.y = 0;
    if(player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // AI Movement
    if(ai.y + ai.height/2 < ball.y) ai.y += ai.dy;
    else ai.y -= ai.dy;
    if(ai.y < 0) ai.y = 0;
    if(ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;

    // Collisions (top and bottom)
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height)
        ball.dy = -ball.dy;

    // Collisions (paddles)
    let playerPaddle = {x: player.x, y: player.y, w: player.width, h: player.height};
    let aiPaddle = {x: ai.x, y: ai.y, w: ai.width, h: ai.height};

    if(collision(ball, playerPaddle)) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.radius;
    } else if(collision(ball, aiPaddle)) {
        ball.dx = -ball.dx;
        ball.x = ai.x - ball.radius;
    }

    // Score
    if(ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        resetBall();
    }
}

// Collision detection
function collision(ball, paddle) {
    return ball.x - ball.radius < paddle.x + paddle.w &&
           ball.x + ball.radius > paddle.x &&
           ball.y - ball.radius < paddle.y + paddle.h &&
           ball.y + ball.radius > paddle.y;
}

// Game loop
function game() {
    update();
    render();
    requestAnimationFrame(game);
}

// Start game
game();