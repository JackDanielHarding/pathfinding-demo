const CANVAS_SIZE = 1000;
const FRAME_RATE = 5;

const GRID_SIZE = 20;

const WALL_PERCENTAGE = 0.4

var north_color = null
var east_color = null
var south_color = null
var west_color = null

var grid = new Grid(GRID_SIZE)
grid.addWalls(WALL_PERCENTAGE)

var goalbounder = new Goalbounder(grid)

function setup(){
    let canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    canvas.parent('sketch-holder');
    frameRate(FRAME_RATE);

    north_color = color(255, 0, 0)
    east_color = color(0, 0, 255)
    south_color = color(0, 255, 255)
    west_color = color(255, 255, 0)
}

function print_list(node_open_list, fill_color) {
    for(var i = 0; i < node_open_list.length; i++){
        var current_node = node_open_list[i]
        fill(fill_color)
        strokeWeight(1)
        stroke(color(0, 0, 0))
        rect(current_node.x * grid.cell_size, current_node.y * grid.cell_size, grid.cell_size, grid.cell_size)
    }
}

function move_start() {
    if(goalbounder.current_start.x == GRID_SIZE - 1){
        goalbounder.current_start.y++
        goalbounder.current_start.x = 0
    } else {
        goalbounder.current_start.x++
    }
}

function draw(){
    if(goalbounder.current_start.x == GRID_SIZE - 1 && goalbounder.current_start.y == GRID_SIZE - 1){
        console.log("Grid Exhausted")
        noLoop()
    }

    if(grid.isWall(goalbounder.current_start)){
        console.log("Starting Spot is wall")

        move_start()
        goalbounder.init()

        return
    }

    grid.draw()

    fill(color(0, 255, 0))
    rect(goalbounder.current_start.x * grid.cell_size, goalbounder.current_start.y * grid.cell_size, grid.cell_size, grid.cell_size)

    print_list(goalbounder.north_nodes_closed, north_color)
    print_list(goalbounder.east_nodes_closed, east_color)
    print_list(goalbounder.south_nodes_closed, south_color)
    print_list(goalbounder.west_nodes_closed, west_color)

    if(goalbounder.north_nodes_open.length != 0 || goalbounder.east_nodes_open.length != 0 || goalbounder.south_nodes_open.length != 0 || goalbounder.west_nodes_open.length != 0){
        goalbounder.floodMap()
    } else {
        console.log("Printing Goalbounds")

        var north_goalbound = goalbounder.calculate_goalbound("North Goalbound", goalbounder.north_nodes_closed, north_color)
        console.log(north_goalbound.toString())
        north_goalbound.draw()

        var east_goalbound = goalbounder.calculate_goalbound("East Goalbound", goalbounder.east_nodes_closed, east_color)
        console.log(east_goalbound.toString())
        east_goalbound.draw()
        
        var south_goalbound = goalbounder.calculate_goalbound("South Goalbound", goalbounder.south_nodes_closed, south_color)
        console.log(south_goalbound.toString())
        south_goalbound.draw()

        var west_goalbound = goalbounder.calculate_goalbound("West Goalbound", goalbounder.west_nodes_closed, west_color)
        console.log(west_goalbound.toString())
        west_goalbound.draw()

        move_start()
        goalbounder.init()
    }
}
