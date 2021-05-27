class Agent{
    constructor(coords){
        this.x = coords.x
        this.y = coords.y
    }

    draw(){
        stroke(color(0, 0, 0))
        fill(color(255, 0, 0))
        rect(this.x * grid.cell_size, this.y * grid.cell_size, grid.cell_size, grid.cell_size);
    }
}

class Goal{
    constructor(coords){
        this.x = coords.x
        this.y = coords.y
    }

    draw(){
        stroke(color(0, 0, 0))
        fill(color(0, 255, 0))
        rect(this.x * grid.cell_size, this.y * grid.cell_size, grid.cell_size, grid.cell_size);
    }
}

class Node{
    constructor(coords, cost, prevNode, direction){
        this.x = coords.x
        this.y = coords.y
        this.cost = cost
        this.prevNode = prevNode
        this.direction = direction
    }

    draw(node_color, size){
        fill(node_color)
        stroke(color(0, 0, 0))
        rect(this.x * size, this.y * size, size, size);
    }

    toString(){
        return `x: ${this.x} y: ${this.y} cost: ${this.cost}` 
    }
}

class Grid{

    constructor(size){
        this.size = size

        this.walls = []

        this.cell_size = 20
    }

    addWalls(percentage_of_walls){

        var no_of_walls = this.size * this.size * percentage_of_walls
        for (var i = 0; i < no_of_walls; i++){
        
            var wall = this.getRandomCell()
            this.walls.push(wall)
        }
    }

    getRandomCell(){
        return {x:(Math.floor(Math.random() * this.size )), y:(Math.floor(Math.random() * this.size ))}
    }

    draw() {
        stroke(color(0, 0, 0))
        strokeWeight(1)
        fill(color(255, 255, 255))
        for (var y = 0; y < this.size ; y++){
            for (var x = 0; x < this.size ; x++){
                rect(x * this.cell_size , y * this.cell_size , this.cell_size , this.cell_size );
            }
        }

        noStroke()
        fill(color(0, 0, 0))
        for (var i = 0; i < this.walls.length; i++){
            rect(this.walls[i].x * this.cell_size , this.walls[i].y * this.cell_size , this.cell_size , this.cell_size )
        }
    }

    isWall(cell){
        return this.walls.some(e => e.x == cell.x && e.y == cell.y)
    }
}

function northNode(node) {
    return {x:node.x, y:node.y - 1}
}
function eastNode(node) {
    return {x:node.x + 1, y:node.y}
}
function southNode(node) {
    return {x:node.x, y:node.y + 1}
}
function westNode(node) {
    return {x:node.x - 1, y:node.y}
}

function coords_in_list(list, coords) {
    return list.some(e => e.x == coords.x && e.y == coords.y)
} 

function coords_in_lists(lists, coords) {
    for(var i = 0; i < lists.length; i++){
        if (coords_in_list(lists[i], coords)) {
            return true
        }
    }
    return false
}

class Goalbounder{

    constructor(grid){
        this.grid = grid

        this.current_start = {x:0, y:0}

        this.init()
    }

    init(){
        this.north_nodes_open = []
        this.east_nodes_open = []
        this.south_nodes_open = []
        this.west_nodes_open = []

        this.north_nodes_closed = []
        this.east_nodes_closed = []
        this.south_nodes_closed = []
        this.west_nodes_closed = []

        var north = northNode(this.current_start)
        if(this.current_start.y > 0 && !this.grid.isWall(north)){
            this.north_nodes_open.push(north)
        }
    
        var east = eastNode(this.current_start)
        if(this.current_start.x < GRID_SIZE - 1 && !this.grid.isWall(east)){
            this.east_nodes_open.push(east)
        }
    
        var south = southNode(this.current_start)
        if(this.current_start.y < GRID_SIZE - 1 && !this.grid.isWall(south)){
            this.south_nodes_open.push(south)
        }
    
        var west = westNode(this.current_start)
        if(this.current_start.x > 0 && !this.grid.isWall(west)){
            this.west_nodes_open.push(west)
        }
    }

    coords_in_closed_lists(coords) {
        return coords_in_lists([this.north_nodes_closed, this.east_nodes_closed, this.south_nodes_closed, this.west_nodes_closed], coords)
    }
    
    coords_in_open_lists(coords) {
        return coords_in_lists([this.north_nodes_open, this.east_nodes_open, this.south_nodes_open, this.west_nodes_open], coords)
    }

    get_next_nodes(list) {
        var temp_nodes = []
    
        for (var i = 0; i < list.length; i++){
            var node = list[i]
            var new_nodes = []
            
            if(node.y - 1 >= 0){
                new_nodes.push(northNode(node))
            }
    
            if(node.x + 1 < GRID_SIZE){
                new_nodes.push(eastNode(node))
            }
    
            if(node.y + 1 < GRID_SIZE){
                new_nodes.push(southNode(node))
            }
    
            if(node.x - 1 >= 0){
                new_nodes.push(westNode(node))
            }
    
            for(var j = 0; j < new_nodes.length; j++){
                if(!this.grid.isWall(new_nodes[j]) && !this.coords_in_closed_lists(new_nodes[j]) && !this.coords_in_open_lists(new_nodes[j]) && !coords_in_list(temp_nodes, new_nodes[j]) && !(this.current_start.x == new_nodes[j].x && this.current_start.y == new_nodes[j].y)){
                    temp_nodes.push(new_nodes[j])
                }
            }
        }
        return temp_nodes
    }
    
    floodMap() {
        this.north_nodes_closed = this.north_nodes_closed.concat(this.north_nodes_open)
        this.north_nodes_open = this.get_next_nodes(this.north_nodes_open)
    
        this.east_nodes_closed = this.east_nodes_closed.concat(this.east_nodes_open)
        this.east_nodes_open = this.get_next_nodes(this.east_nodes_open)
    
        this.south_nodes_closed = this.south_nodes_closed.concat(this.south_nodes_open)
        this.south_nodes_open = this.get_next_nodes(this.south_nodes_open)
    
        this.west_nodes_closed = this.west_nodes_closed.concat(this.west_nodes_open)
        this.west_nodes_open = this.get_next_nodes(this.west_nodes_open)
    }

    calculate_goalbound(id, list, stroke_color) {

        var min_x = this.current_start.x
        var min_y = this.current_start.y
        var max_x = this.current_start.x
        var max_y = this.current_start.y
    
        for(var i = 0; i < list.length; i++){
            if(list[i].x + 1 > max_x){
                max_x = list[i].x + 1
            }
            if(list[i].y + 1 > max_y){
                max_y = list[i].y + 1
            }
            if(list[i].x < min_x){
                min_x = list[i].x
            }
            if(list[i].y < min_y){
                min_y = list[i].y
            }
        }
    
        var width = max_x - min_x
        var height = max_y - min_y
    
        return new Goalbound(id, min_x, min_y, width, height, stroke_color)
    }

    calculateGoalbounds(){
        var goalbounds = []
        for(var x = 0; x < grid.size; x++){
            goalbounds.push([])
        }

        for(var y = 0; y < grid.size; y++){
            for(var x = 0; x < grid.size; x++){
                this.current_start = {x:x, y:y}

                if(this.grid.isWall(this.current_start)){
                    continue
                }

                this.init()

                while(this.north_nodes_open.length != 0 || this.east_nodes_open.length != 0 || this.south_nodes_open.length != 0 || this.west_nodes_open.length != 0){
                    this.floodMap()
                }
                console.log(`goalbounds for ${x},${y} calcuated`)

                var north_goalbound = this.calculate_goalbound("North Goalbound", this.north_nodes_closed, color(255,0,0))
                var east_goalbound = this.calculate_goalbound("East Goalbound", this.east_nodes_closed, color(0,255,0))
                var south_goalbound = this.calculate_goalbound("South Goalbound", this.south_nodes_closed, color(0,0,255))
                var west_goalbound = this.calculate_goalbound("West Goalbound", this.west_nodes_closed, color(255,255,0))

                goalbounds[x][y] = {north:north_goalbound, east:east_goalbound, south:south_goalbound, west:west_goalbound}
            }
        }

        return goalbounds
    }
}

function distanceBetweenNodes(node1, node2){
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y)
}

class Goalbound{
    constructor(id, x, y, width, height, stroke_color){
        this.id = id
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.stroke_color = stroke_color
    }

    draw(){
        noFill()
        strokeWeight(10)
        stroke(this.stroke_color)
        rect(this.x * grid.cell_size, this.y * grid.cell_size, this.width * grid.cell_size, this.height * grid.cell_size)
    }

    toString(){
        return `${this.id} x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height}`
    }
}

var globalGoal = null

class AStar{

    constructor(agent, grid, goal, goalbounds){
        this.grid = grid
        this.goal = goal
        globalGoal = goal
        this.goalbounds = goalbounds

        this.previousNodes = []
        this.open = []
        this.closedNodes = []
        this.win = false
        this.winningNode = null

        this.open.push(new Node({x: agent.x, y: agent.y}, 0, null))
    }

    isPreviousNode(node){
        for (var i = 0; i < previousNodes.length; i++){
            if (node.x == previousNodes[i].x && node.y == previousNodes[i].y){
                return true
            }
        }
        return false
    }
    
    aStarCompare(a, b){
        var a_total_cost = distanceBetweenNodes(a, globalGoal) + a.cost
        var b_total_cost = distanceBetweenNodes(b, globalGoal) + b.cost
        return a_total_cost - b_total_cost
    }
    
    checkNodeList(node, list) {
        for (var i = 0; i < list.length; i++){
            if(list[i].x == node.x && list[i].y == node.y && list[i].cost <= node.cost){
                return true;
            }
        }
        return false;
    }
    
    drawOpen(){
        for (var i = 0; i < this.open.length; i++){
            this.open[i].draw(color(0, 150, 150), this.grid.cell_size)
        }
        return false;
    }
    
    drawClosed(){
        for (var i = 0; i < this.closedNodes.length; i++){
            this.closedNodes[i].draw(color(150, 0, 150), this.grid.cell_size)
        }
        return false;
    }

    withinGoalbound(potentialNode, nextNode){
        var cell_goalbounds = this.goalbounds[nextNode.x][nextNode.y]
        console.log(`Cell Goalbounds: ${cell_goalbounds.north.toString()}, ${cell_goalbounds.east.toString()}, ${cell_goalbounds.south.toString()}, ${cell_goalbounds.west.toString()}, `)

        var directionGoalbound = null

        console.log(`nextNode Direction: ${potentialNode.direction}`)

        switch(potentialNode.direction) {
            case "N":
                directionGoalbound = cell_goalbounds.north
                break;
            case "E":
                directionGoalbound = cell_goalbounds.east
                break;
            case "S":  
                directionGoalbound = cell_goalbounds.south
                break;
            case "W":
                directionGoalbound = cell_goalbounds.west
                break;
        }

        console.log(`Direction Goalbound: ${directionGoalbound.toString()}`)
        directionGoalbound.draw()

        if((this.goal.x >= directionGoalbound.x && this.goal.x <= directionGoalbound.x + directionGoalbound.width) && (this.goal.y >= directionGoalbound.y && this.goal.y <= directionGoalbound.y + directionGoalbound.height)){
            console.log("within Goalbound")
            return true
        }

        console.log("outside Goalbound")
        return false
    }
    
    calculatePath(){
        this.open = this.open.sort(this.aStarCompare)
    
        var nextNode = this.open.shift()
    
        console.log(`next Node: ${nextNode}`)
    
        fill(color(255, 0, 255))
        rect(nextNode.x * this.grid.cell_size, nextNode.y * this.grid.cell_size, this.grid.cell_size, this.grid.cell_size);
    
        fill(color(255, 0, 0))
        var pathNode = nextNode
        while(pathNode.prevNode != null){
            rect(pathNode.prevNode.x * grid.cell_size, pathNode.prevNode.y * grid.cell_size, grid.cell_size, grid.cell_size);
            pathNode = pathNode.prevNode
        }
    
        var potentialNodes = []
        potentialNodes.push(new Node(northNode(nextNode), nextNode.cost + 1, nextNode, "N"))
        potentialNodes.push(new Node(eastNode(nextNode), nextNode.cost + 1, nextNode, "E"))
        potentialNodes.push(new Node(southNode(nextNode), nextNode.cost + 1, nextNode, "S"))
        potentialNodes.push(new Node(westNode(nextNode), nextNode.cost + 1, nextNode, "W"))
    
        for (var i = 0; i < potentialNodes.length; i++){
    
            var potentialNode = potentialNodes[i]

            console.log(`potential Node: ${potentialNode}`)
    
            if((potentialNode.x < this.grid.size && potentialNode.x >= 0) && (potentialNode.y < this.grid.size && potentialNode.y >= 0)){
                if(this.grid.isWall(potentialNode)){
                    console.log("failed not a wall criteria")
                    continue;
                } else if (potentialNode.x == this.goal.x && potentialNode.y == this.goal.y){
                    console.log("WIN!!!!!")
                    this.win = true;
                    this.winningNode = potentialNode
                } else if (this.checkNodeList(potentialNode, this.open) || this.checkNodeList(potentialNode, this.closedNodes)){
                    console.log("failed existing node criteria")
                    continue
                } else if (this.goalbounds != null && !this.withinGoalbound(potentialNode, nextNode)){
                    console.log("failed goalbound criteria")
                    continue
                } else {
                    console.log(`new Node: ${potentialNode}`)
                    this.open.push(potentialNode)
                }
            }
        }
        this.closedNodes.push(nextNode)
    }

    tick(){
        this.drawOpen()
        this.drawClosed()
        if(!this.win){
            this.calculatePath()
        } else {
            fill(color(255, 0, 0))
            var pathNode = this.winningNode
            while(pathNode.prevNode != null){
                rect(pathNode.prevNode.x * grid.cell_size, pathNode.prevNode.y * grid.cell_size, grid.cell_size, grid.cell_size);
                pathNode = pathNode.prevNode
            }
            noLoop()
        }
    }
}