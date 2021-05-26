const CANVAS_SIZE = 1000;
const FRAME_RATE = 5;
const GRID_SIZE = 50
const NO_OF_WALLS = 0.4

var grid = null
var goal = null
var astar = null
var agent = null

function setup(){
    let canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    canvas.parent('sketch-holder');
    frameRate(FRAME_RATE);

    grid = new Grid(GRID_SIZE)
    grid.addWalls(NO_OF_WALLS)
    var goalbounder = new Goalbounder(grid)
    var goalbounds = goalbounder.calculateGoalbounds()

    var coords = null

    do {
        coords = grid.getRandomCell()
    } while (grid.isWall(coords))

    agent = new Agent(coords)

    do {
        coords = grid.getRandomCell()
    } while (grid.isWall(coords) || (coords.x == agent.x && coords.y == agent.y))

    goal = new Goal(coords)

    astar = new AStar(agent, grid, goal, goalbounds)
}

function draw(){
    grid.draw()

    agent.draw()
    goal.draw()

    astar.tick()
}
