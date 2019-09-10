const RECT_SIZE = 10;
const MOVE_SIZE = RECT_SIZE + 1;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let isRunning = true;


class Control {
    constructor() {
        this.direction = "RIGHT";
        this.controlMethod = this.controlMethod.bind(this);
    }

    controlMethod(e) {
        const ev = e.key;
        if (ev === "ArrowUp" && this.direction !== "DOWN")
            this.direction = "UP";
        else if (ev === "ArrowDown" && this.direction !== "UP")
            this.direction = "DOWN";
        else if (ev === "ArrowLeft" && this.direction !== "RIGHT")
            this.direction = "LEFT";
        else if (ev === "ArrowRight" && this.direction !== "LEFT")
            this.direction = "RIGHT";
    }
}

class Gui {
    constructor() {
        this.field = [];
    }

    initField() {
        for (let i = 1; i < canvas.width; i += MOVE_SIZE)
            for (let j = 1; j < canvas.height; j += MOVE_SIZE)
                this.field.push([i, j]);
    }
}

class Snake {
    constructor() {
        this.head = [45, 45];
        this.body = [[45, 45], [34, 45], [23, 45]];
    }

    checkDirection(control) {
        const ev = control.direction;
        switch (ev) {
            case "UP":
                this.head[1] += -MOVE_SIZE;
                break;
            case "DOWN":
                this.head[1] += MOVE_SIZE;
                break;
            case "LEFT":
                this.head[0] += -MOVE_SIZE;
                break;
            case "RIGHT":
                this.head[0] += MOVE_SIZE;
                break;
        }
    }

    drawSnake(ctx) {
        ctx.fillStyle="#115C1B";
        ctx.fillRect(this.body[0][0], this.body[0][1], RECT_SIZE, RECT_SIZE);

        ctx.fillStyle = "#09CE08";
        for (let i = 1; i < this.body.length; i++) {
            ctx.fillRect(this.body[i][0], this.body[i][1], RECT_SIZE, RECT_SIZE);
        }
    }

    checkEndOfGame() {
        if (this.head[0] >= 441
            || this.head[0] <= 0
            || this.head[1] <= 0
            || this.head[1] >= 441
        ){
            isRunning = false;
            return;
        }
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i][0] === this.head[0] && this.body[i][1] === this.head[1]) {
                isRunning = false;
                break;
            }
        }
    }


    animation() {
        let temp = [this.head[0], this.head[1]];
        this.body.unshift(temp);
        this.body.pop();
    }

    eat(food, gui) {
        let pos = food.foodPosition;
        if (pos[0] === this.head[0] && pos[1] === this.head[1]) {
            this.body.push(pos);
            food.generateFoodPosition(gui);
        }
    }
}


class Food {
    constructor() {
        this.foodPosition = [];
        this.drawFood = this.drawFood.bind(this);
    }

    generateFoodPosition(gui) {
        let index = Math.floor(Math.random() * (gui.field.length));
        this.foodPosition = gui.field[index];
    }

    drawFood(ctx) {
        ctx.fillStyle = "#A7000E";
        ctx.fillRect(this.foodPosition[0], this.foodPosition[1], RECT_SIZE, RECT_SIZE);
    }
}

const control = new Control();
const snake = new Snake();
const gui = new Gui();
const food = new Food();

gui.initField();

food.generateFoodPosition(gui);

document.addEventListener("keydown", control.controlMethod);


function draw() {
    if (!isRunning) {
        clearInterval(intervalId);
        return;
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    snake.checkDirection(control);
    snake.drawSnake(ctx);
    food.drawFood(ctx);
    snake.eat(food, gui);
    snake.animation();
    snake.checkEndOfGame();
}

let speed = 100;
let intervalId = setInterval(draw, speed);

