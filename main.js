const CANVAS_SIZE = 1000;
const FRAME_RATE = 10;

const GRID_SIZE = 50;
const CELL_SIZE = 20;

const WALL_PERCENTAGE = 0.3
const NO_OF_WALLS = (GRID_SIZE * GRID_SIZE) * WALL_PERCENTAGE;

var previousNodes = []

class Agent{
    constructor(coords){
        this.x = coords.x
        this.y = coords.y
    }

    draw(){
        fill(color(255, 0, 0))
        rect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}

class Goal{
    constructor(coords){
        this.x = coords.x
        this.y = coords.y
    }

    draw(){
        fill(color(0, 255, 0))
        rect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}

class Node{
    constructor(coords, cost, prevNode){
        this.x = coords.x
        this.y = coords.y
        this.cost = cost
        this.prevNode = prevNode
    }

    draw(){
        fill(color(0, 255, 0))
        rect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    toString(){
        return "x: " + this.x + " y: " + this.y + " cost " + this.cost 
    }
}

class Grid{

    constructor(size){
        this.size = size

        this.walls = []

        for (var i = 0; i < NO_OF_WALLS; i++){
        
            var wall = this.getRandomCell()
            this.walls.push(wall)
        }
    }

    getRandomCell(){
        return {x:(Math.floor(Math.random() * GRID_SIZE)), y:(Math.floor(Math.random() * GRID_SIZE))}
    }

    draw() {
        fill(color(255, 255, 255))
        for (var y = 0; y < GRID_SIZE; y++){
            for (var x = 0; x < GRID_SIZE; x++){
                rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }

        fill(color(0, 0, 0))
        for (var i = 0; i < this.walls.length; i++){
            rect(this.walls[i].x * CELL_SIZE, this.walls[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        }
    }

    isWall(cell){
        for (var i = 0; i < this.walls.length; i++){
            if (cell.x == this.walls[i].x && cell.y == this.walls[i].y){
                return true
            }
        }
        return false
    }
}

var grid = new Grid(GRID_SIZE)

var coords = null

do {
    coords = grid.getRandomCell()
} while (grid.isWall(coords))

var agent = new Agent(coords)

do {
    coords = grid.getRandomCell()
} while (grid.isWall(coords) || (coords.x == agent.x && coords.y == agent.y))

var goal = new Goal(coords)

function setup(){
    let canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    canvas.parent('sketch-holder');
    frameRate(FRAME_RATE);
}

function isPreviousNode(node){
    for (var i = 0; i < previousNodes.length; i++){
        if (node.x == previousNodes[i].x && node.y == previousNodes[i].y){
            return true
        }
    }
    return false
}

function distanceFromGoal(node){
    return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y)
}

function aStarCompare(a, b){
    a_total_cost = distanceFromGoal(a) + a.cost
    b_total_cost = distanceFromGoal(b) + b.cost
    return a_total_cost - b_total_cost
}

var open = []
var closedNodes = []

open.push(new Node({x: agent.x, y: agent.y}, 0, null))

function checkNodeList(node, list) {
    for (var i = 0; i < list.length; i++){
        if(list[i].x == node.x && list[i].y == node.y && list[i].cost <= node.cost){
            return true;
        }
    }
    return false;
}

function drawOpen(){

    fill(color(0, 150, 150))

    for (var i = 0; i < open.length; i++){
        rect(open[i].x * CELL_SIZE, open[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }
    return false;
}

function drawClosed(){

    fill(color(150, 0, 150))

    for (var i = 0; i < closedNodes.length; i++){
        rect(closedNodes[i].x * CELL_SIZE, closedNodes[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }
    return false;
}

var win = false
var winningNode = null

function calculatePath(){
    open = open.sort(aStarCompare)

    var nextNode = open.shift()

    console.log("next Node: " + nextNode)

    fill(color(255, 0, 255))
    rect(nextNode.x * CELL_SIZE, nextNode.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    fill(color(255, 0, 0))
    var pathNode = nextNode
    while(pathNode.prevNode != null){
        rect(pathNode.prevNode.x * CELL_SIZE, pathNode.prevNode.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        pathNode = pathNode.prevNode
    }

    var potentialNodes = []
    potentialNodes.push(new Node({x:nextNode.x + 1, y:nextNode.y}, nextNode.cost + 1, nextNode))
    potentialNodes.push(new Node({x:nextNode.x - 1, y:nextNode.y}, nextNode.cost + 1, nextNode))
    potentialNodes.push(new Node({x:nextNode.x, y:nextNode.y + 1}, nextNode.cost + 1, nextNode))
    potentialNodes.push(new Node({x:nextNode.x, y:nextNode.y - 1}, nextNode.cost + 1, nextNode))

    for (var i = 0; i < potentialNodes.length; i++){

        potentialNode = potentialNodes[i]

        if((potentialNode.x < GRID_SIZE && potentialNode.x >= 0) && (potentialNode.y < GRID_SIZE && potentialNode.y >= 0)){
            if(grid.isWall(potentialNode)){
                continue;
            } else if (potentialNode.x == goal.x && potentialNode.y == goal.y){
                console.log("WIN!!!!!")
                win = true;
                winningNode = potentialNode
             } else if (checkNodeList(potentialNode, open) || checkNodeList(potentialNode, closedNodes)){
                continue
            } else {
                console.log("new Node: " + potentialNode)
                open.push(potentialNode)
            }
        }
    }
    closedNodes.push(nextNode)
}

function draw(){
    grid.draw()

    agent.draw()
    goal.draw()

    drawOpen()
    drawClosed()
    if(!win){
        calculatePath()
    } else {
        fill(color(255, 0, 0))
        var pathNode = winningNode
        while(pathNode.prevNode != null){
            rect(pathNode.prevNode.x * CELL_SIZE, pathNode.prevNode.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            pathNode = pathNode.prevNode
        }

    }
}
