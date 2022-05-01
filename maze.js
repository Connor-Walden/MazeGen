class Maze {
    constructor(cols, rows, size) {
        this.colors = {
            background: '#ccc',
            wall: '#000',
            visited: '#00ff00',
            path: '#ff0000',
            start: '#0000ff',
            end: '#ff0000'
        };

        this.targetSize = size;
        this.cols = cols;
        this.rows = rows;
        this.ncols = 10;
        this.nrows = 10;
        this.generate = false;
        this.maze = [
            { 
                visited: false,
                walls: [
                    true, 
                    true, 
                    true, 
                    true
                ],
                pos: {
                    x: 0,
                    y: 0
                }
            },
        ];

        this.canvas = new Canvas();
        this.cvs = new Section('canvasContainer', '#maze');
        this.controls = new Section('controlsContainer', '#maze', 'display: flex; flex-direction: column; width: 100%; padding: 50px;');
        this.controlsHeading = new Heading('Controls', 'width: 100%; margin: 0 auto; text-align: center;');

        this.speedSlider = new Slider('speed', 1, 100, 1, true);

        this.colsIn = new Input('cols', this.cols, true);
        this.rowsIn = new Input('rows', this.rows, true);

        this.generateBtn = new Button('Generate!', (event) => {
            this.cols = this.ncols;
            this.rows = this.nrows;

            this.generate = true;

            this.init();
        });

        this.downloadBtn = new Button('Download...', (event) => {
            let link = document.createElement('a');
            
            link.download = 'maze.png';
            link.href = this.canvas.element.toDataURL();

            link.click();
        });

        document.querySelector('#maze').style = 'display: flex; flex-direction: row;';

        this.controls.append(this.controlsHeading);
        this.cvs.append(this.canvas);
        
        this.colsIn.use(this.controls);
        this.rowsIn.use(this.controls);
        this.speedSlider.use(this.controls);
        this.generateBtn.use(this.controls);
        this.downloadBtn.use(this.controls);
    }
 
    init() {
        this.cellSize = this.targetSize / this.cols;
        this.canvas.size(this.cols * this.cellSize, this.rows * this.cellSize);

        for(let i = 0; i < this.cols; i++) {
            for(let j = 0; j < this.rows; j++) {
                this.maze[i + j * this.cols] = {
                    visited: false,
                    walls: [
                        true,
                        true,
                        true,
                        true
                    ],
                    pos: {
                        x: i,
                        y: j
                    }
                };
            }
        }

        this.maze[0].visited = true;
        this.current = this.maze[0];
        this.stack = [];
    }

    tick() {
        this.canvas.clear(this.colors.background);

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.maze[i + j * this.cols].walls[0]) {
                    let style = this.maze[i + j * this.cols].visited ? this.colors.visited : this.colors.path;
                    this.canvas.line(this.generate ? style : this.colors.wall, i * this.cellSize, j * this.cellSize, (i + 1) * this.cellSize, j * this.cellSize);
                }
                if (this.maze[i + j * this.cols].walls[1]) {
                    let style = this.maze[i + j * this.cols].visited ? this.colors.visited : this.colors.path;
                    this.canvas.line(this.generate ? style : this.colors.wall, (i + 1) * this.cellSize, j * this.cellSize, (i + 1) * this.cellSize, (j + 1) * this.cellSize);
                }
                if (this.maze[i + j * this.cols].walls[2]) {
                    let style = this.maze[i + j * this.cols].visited ? this.colors.visited : this.colors.path;
                    this.canvas.line(this.generate ? style : this.colors.wall, i * this.cellSize, (j + 1) * this.cellSize, (i + 1) * this.cellSize, (j + 1) * this.cellSize);
                }
                if (this.maze[i + j * this.cols].walls[3]) {
                    let style = this.maze[i + j * this.cols].visited ? this.colors.visited : this.colors.path;
                    this.canvas.line(this.generate ? style : this.colors.wall, i * this.cellSize, j * this.cellSize, i * this.cellSize, (j + 1) * this.cellSize);
                }
            }
        }

        if(this.current)
            this.canvas.fill(this.current.pos.x * this.cellSize, this.current.pos.y * this.cellSize, this.cellSize, this.cellSize, '#00ff00');

        this.speedSlider.tick();
        this.colsIn.tick();
        this.rowsIn.tick();

        this.ncols = this.colsIn.value;
        this.nrows = this.rowsIn.value;

        if(this.generate)
            for(let i = 0; i < this.speedSlider.value; i++)
                if(this.generateMaze() && this.current !== null) this.generate = false;
    }

    generateMaze() {
        let neighbors = this.getNeighbors(this.current);

        if(neighbors.length > 0) {
            let next = neighbors[Math.floor(Math.random() * neighbors.length)];
            this.removeWall(this.current, next);
            this.stack.push(this.current);
            next.visited = true;
            this.current = next;
        } else this.current = this.stack.pop();

        if(this.stack.length > 0)   return false;
        else                        return true;
    }

    getNeighbors(cell) {
        let neighbors = [];
        if(!cell) return neighbors;

        let i = cell.pos.x;
        let j = cell.pos.y;

        if(i > 0 && !this.maze[i - 1 + j * this.cols].visited)
            neighbors.push(this.maze[i - 1 + j * this.cols]);

        if(i < this.cols - 1 && !this.maze[i + 1 + j * this.cols].visited)
            neighbors.push(this.maze[i + 1 + j * this.cols]);

        if(j > 0 && !this.maze[i + (j - 1) * this.cols].visited)
            neighbors.push(this.maze[i + (j - 1) * this.cols]);

        if(j < this.rows - 1 && !this.maze[i + (j + 1) * this.cols].visited)
            neighbors.push(this.maze[i + (j + 1) * this.cols]);

        return neighbors;  
    }

    removeWall(current, next) {
        let i = current.pos.x;
        let j = current.pos.y;
        let nextI = next.pos.x;
        let nextJ = next.pos.y;

        if(i - nextI === 1) {
            current.walls[3] = false;
            next.walls[1] = false;
        }
        if(i - nextI === -1) {
            current.walls[1] = false;
            next.walls[3] = false;
        }
        if(j - nextJ === 1) {
            current.walls[0] = false;
            next.walls[2] = false;
        }
        if(j - nextJ === -1) {
            current.walls[2] = false;
            next.walls[0] = false;
        }
    }
}
