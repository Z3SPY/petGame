

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx  = canvas?.getContext('2d')!;


const CANVAS_WIDTH : number =  canvas.width = canvas.getBoundingClientRect().width;
const CANVAS_HEIGHT : number = canvas.height = canvas.getBoundingClientRect().height;



ctx.fillStyle = 'white';


const hungerText: HTMLSpanElement = document.getElementById("hngrValTxt")!.getElementsByTagName("span")[0];
const cleanText: HTMLSpanElement = document.getElementById("clnValTxt")!.getElementsByTagName("span")[0];
const enjyText: HTMLSpanElement = document.getElementById("enjyValTxt")!.getElementsByTagName("span")[0];

let enjyFill : HTMLElement = document.querySelector('#enjyLoad .fill') as HTMLElement;
let cleanFill : HTMLElement = document.querySelector('#clnValTxt .fill') as HTMLElement;
let hungerFill : HTMLElement = document.querySelector('#hngrValTxt .fill') as HTMLElement;


//StateMachine
enum AnimalState {
    Moving,
    Idle, 
    Dragged  //If click on box dragged
}


class Animal {
    //Status Values 
    hungerVal!: number;
    cleanVal!: number;
    playVal!: number;

    xPos: number;
    yPos: number;
    w: number;
    h: number;
    speed: number = 200;

    vx: number;
    vy: number;

    state: AnimalState = AnimalState.Moving; // Initial state is Moving

    image: HTMLImageElement = new Image();
    spriteSheetURL: string = '/cool-removebg-preview.png';
    cols: number = 4;
    rows: number = 2;
    spriteWidth: number = 1000;
    spriteHeight: number = 250;
    spriteWdOfst: number = this.spriteWidth / this.cols; // width in px / cols spacing = Value of SpriteWidth
    spriteHtOfst: number = this.spriteHeight / this.rows; // height in px / rows spacing = Sprite height
    frameX: number = 0;
    frameY: number = 0;
    gameFrame: number = 0;
    staggerFrames: number = 2;

    constructor(xPos: number, yPos: number, w: number, h: number) {
        this.hungerVal = 100;
        this.cleanVal = 100;
        this.playVal = 100;


        //Position and Size
        this.xPos = xPos;
        this.yPos = yPos;
        this.w = w;
        this.h = h;
        this.vx = (Math.random() - 0.5) * this.speed; // Random number between -1 and 1
        this.vy = (Math.random() - 0.5) * this.speed;

        this.updateStatus();
        let moveInterval = 5000;
        let idleInterval = 2000;
        setInterval(() => {
            // Transition to the Idle state after the interval finishes
            this.updateState(AnimalState.Idle);
            setTimeout(() => {
                this.updateState(AnimalState.Moving);
            }, idleInterval);
        }, moveInterval);

        //Image 
        this.image.src = this.spriteSheetURL;
    }

    updateStatus() {
        hungerText.innerText = `${this.hungerVal.toString()}%`;
        cleanText.innerText = `${this.cleanVal.toString()}%`;
        enjyText.innerText = `${this.playVal.toString()}%`;

        hungerFill.style.width =  `${this.hungerVal.toString()}%`;
        cleanFill.style.width =  `${this.cleanVal.toString()}%`;
        enjyFill.style.width =  `${this.playVal.toString()}%`;

    }

    decreaseHunger() {
        // Decrease hunger by a certain amount
        this.hungerVal -= 1; // You can adjust the amount as needed
        if (this.hungerVal < 0) {
            this.hungerVal = 0; // Ensure hungerVal doesn't go below 0
        }
        this.updateStatus(); // Update the hunger text
    }

    decreaseClean() {
        // Decrease hunger by a certain amount
        this.cleanVal -= 1; // You can adjust the amount as needed
        if (this.cleanVal < 0) {
            this.cleanVal = 0; // Ensure hungerVal doesn't go below 0
        }
        this.updateStatus(); // Update the hunger text
    }

    decreaseEnjoyment() {
        // Decrease hunger by a certain amount
        this.playVal -= 1; // You can adjust the amount as needed
        if (this.playVal < 0) {
            this.playVal = 0; // Ensure hungerVal doesn't go below 0
        }
        this.updateStatus(); // Update the hunger text
    }

    handleBoundaries() {
        if (this.xPos + this.w >= CANVAS_WIDTH * .75 || this.xPos < CANVAS_WIDTH * .25) {
            this.vx *= -1; // Reverse direction on hitting horizontal boundaries
        }
        if (this.yPos + this.h >= CANVAS_HEIGHT || this.yPos < 0) {
            this.vy *= -1; // Reverse direction on hitting vertical boundaries
        }

    }

    updateState(newState: AnimalState) {
        this.state = newState;
    }

    performActions(deltaTime: number) {
        switch (this.state) {
            case AnimalState.Idle:
                break;
            case AnimalState.Moving:
                const deltaX = this.vx * (deltaTime / 1000);
                const deltaY = this.vy * (deltaTime / 1000);
                this.xPos += deltaX;
                this.yPos += deltaY;
                break;
        }
    }

    draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
        this.performActions(deltaTime);
        this.handleBoundaries();

        // Draw animal on the canvas
        this.gameFrame += deltaTime;
        if (this.gameFrame >= this.staggerFrames * (1000 / 15)) { // 1000 ms / 15 frames per second
            this.gameFrame = 0;
            if (this.frameX < this.cols - 1) this.frameX++;
            else this.frameX = 0;
        }
        ctx.drawImage(
            this.image,
            this.spriteWdOfst * this.frameX,
            this.spriteHtOfst * this.frameY,
            this.spriteWdOfst,
            this.spriteHtOfst,
            this.xPos,
            this.yPos,
            this.w + 50,
            this.h + 10
        );
    }
}



let myAnimal: Animal = new Animal(Math.random() * (CANVAS_WIDTH * .50), Math.random() * (CANVAS_HEIGHT * .50), CANVAS_WIDTH * .05, CANVAS_HEIGHT * .10);

let lastFrameTime = performance.now(); // Move lastFrameTime to the global scope

let animationId: number;

function animate() {
    const currentTime = performance.now();
    const deltaTime = Math.min(currentTime - lastFrameTime, 100); // Cap deltaTime to 100ms to prevent large jumps
    lastFrameTime = currentTime;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    myAnimal.draw(ctx, deltaTime);

    animationId = requestAnimationFrame(animate);
    
}

animate(); // Start the animation loop initially


//End StateMachine
let intervalId: number; // Declare intervalId as a global variable
intervalId = setInterval(() => {
    myAnimal.decreaseHunger(); // Resume interval for decreasing hunger
}, 2000); 
intervalId = setInterval(() => {
    myAnimal.decreaseEnjoyment();
}, 5000);
intervalId = setInterval(() => {
    myAnimal.decreaseClean();
}, 3000);

// Handle tab visibility change
function handleVisibilityChange() {
    if (document.hidden) {
        // Tab is not visible, so pause the animation and intervals
        cancelAnimationFrame(animationId);
        clearInterval(intervalId);
    } else {
        // Tab is visible, so resume the animation and intervals
        lastFrameTime = performance.now(); // Reset lastFrameTime to avoid large deltaTime on resume
        animate(); // Start animation loop again
        
        // Resume interval for decreasing hunger
        intervalId = setInterval(() => {
            myAnimal.decreaseHunger();
        }, 2000); // Adjust the interval time as needed
        intervalId = setInterval(() => {
            myAnimal.decreaseEnjoyment();
        }, 5000);
        intervalId = setInterval(() => {
            myAnimal.decreaseClean();
        }, 3000);
    }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);


document.addEventListener("visibilitychange", handleVisibilityChange, false);



