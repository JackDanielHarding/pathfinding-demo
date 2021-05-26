const CANVAS_SIZE = 1000;
const FRAME_RATE = 10;
const GRID_SIZE = 50;
const WALL_PERCENTAGE = 0.4

var grid = new Grid(GRID_SIZE)
grid.addWalls(WALL_PERCENTAGE)

var coords = null

do {
    coords = grid.getRandomCell()
} while (grid.isWall(coords))

var agent = new Agent(coords)

do {
    coords = grid.getRandomCell()
} while (grid.isWall(coords) || (coords.x == agent.x && coords.y == agent.y))

var goal = new Goal(coords)

var astar = new AStar(agent, grid, goal, null)

function setup(){
    let canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    canvas.parent('sketch-holder');
    frameRate(FRAME_RATE);
}

function draw(){
    grid.draw()

    agent.draw()
    goal.draw()

    astar.tick()
}
