// JavaScript game setup
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Event listeners for keydown and keyup
window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            keys.up = true;
            break;
        case 'ArrowDown':
            keys.down = true;
            break;
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'ArrowRight':
            keys.right = true;
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            keys.up = false;
            break;
        case 'ArrowDown':
            keys.down = false;
            break;
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
    }
});

// Example: Draw a rectangle
// context.fillStyle = 'green';
// context.fillRect(100, 100, 200, 100);

// Game loop
function gameLoop() {
    // Game logic goes here

    context.fillStyle = 'green';
    context.fillRect(canvas.width * .1, canvas.height * .1, canvas.width * .1, canvas.height * .1);

    // Example: Move the rectangle (as a placeholder for more complex game logic)
    


    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();