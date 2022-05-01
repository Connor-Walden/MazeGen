const COLS = 10;
const ROWS = 10;
const SIZE = 600;

const maze = new Maze(COLS, ROWS, SIZE);
maze.init();

function animate() {
    window.requestAnimationFrame(animate);
    maze.tick();
}
animate();