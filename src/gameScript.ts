

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx  = canvas?.getContext('2d')!;


let CANVAS_WIDTH : number =  canvas.width = canvas.getBoundingClientRect().width;
let CANVAS_HEIGHT : number = canvas.height = canvas.getBoundingClientRect().height;
let spawnMinX = CANVAS_WIDTH * 0.3; // Minimum spawn position (30% of canvas width)
let spawnMaxX = CANVAS_WIDTH * 0.8; // Maximum spawn position (80% of canvas width)
let spawnMinY = CANVAS_HEIGHT * 0.3; // Minimum spawn position (30% of canvas height)
let spawnMaxY = CANVAS_HEIGHT * 0.8; // Maximum spawn position (80% of canvas height)

// Generate a random spawn position for X and Y
const randomSpawnX = spawnMinX + Math.random() * (spawnMaxX - spawnMinX);
const randomSpawnY = spawnMinY + Math.random() * (spawnMaxY - spawnMinY);


//COINTS
let coins = 0;


// Other code from your game, including the animation loop and other logic



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
    speed: number = 100;

    vx: number;
    vy: number;

    state: AnimalState = AnimalState.Moving; // Initial state is Moving


    //Animation States
    image: HTMLImageElement = new Image();
    spriteSheetURL: string = '/SpriteSheet.png';
    cols: number = 6;
    rows: number = 6;
    spriteWidth: number = 700;
    spriteHeight: number = 700;
    spriteWdOfst: number = this.spriteWidth / this.cols; // width in px / cols spacing = Value of SpriteWidth
    spriteHtOfst: number = this.spriteHeight / this.rows; // height in px / rows spacing = Sprite height
    frameX: number = 0;
    frameY: number = 1;
    gameFrame: number = 0;
    staggerFrames: number = 2;

    anmStates: any;

    constructor(xPos: number, yPos: number, w: number, h: number) {
        this.hungerVal = 100;
        this.cleanVal = 100;
        this.playVal = 100;


        //Position and Size
        this.xPos = xPos;
        this.yPos = yPos;
        this.w = w;
        this.h = h;
        this.vx = Math.random() < 0.5 ? -1 : 1;
        this.vy = Math.random() < 0.5 ? -1 : 1;

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



        // SPRITE ANIMATION POSITIONS
        this.anmStates = {
            "idle": {
                name: "idle",
                frames: 6,
                rowNum: 0
            },
            "walkleft": {
                name: "walk-left",
                frames: 6,
                rowNum: 1            
            }, 
            "walkright": {
                name: "walk-right",
                frames: 6, 
                rowNum: 2           
            },
            "feed": {
                name: "feed",
            },
            "clean": {
                name: "clean"
            }
        };
    }

    updateSpriteVals (newSpriteSheet: string, animCols: number, animRows: number, newSpriteHeight: number, newSpriteWidth: number) {

        this.spriteSheetURL = newSpriteSheet;
        this.cols = animCols;
        this.rows = animRows;
        this.spriteWidth = newSpriteWidth;
        this.spriteHeight = newSpriteHeight;
    }

    animateSprite(deltaTime: number) {
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
    

    updateStatus() {
        hungerText.innerText = `${this.hungerVal.toString()}%`;
        cleanText.innerText = `${this.cleanVal.toString()}%`;
        enjyText.innerText = `${this.playVal.toString()}%`;

        hungerFill.style.width =  `${this.hungerVal.toString()}%`;
        cleanFill.style.width =  `${this.cleanVal.toString()}%`;
        enjyFill.style.width =  `${this.playVal.toString()}%`;

    }



    /*STATUSES*/ 
    decreaseHunger() {
        // Decrease hunger by a certain amount
        this.hungerVal -= 1; // You can adjust the amount as needed
        if (this.hungerVal < 0) {
            this.hungerVal = 0; // Ensure hungerVal doesn't go below 0
        }
        this.updateStatus(); // Update the hunger text
        updateHearts(); // Update the hearts

    }

    decreaseClean() {
        // Decrease hunger by a certain amount
        this.cleanVal -= 1; // You can adjust the amount as needed
        if (this.cleanVal < 0) {
            this.cleanVal = 0; // Ensure hungerVal doesn't go below 0
        }
        this.updateStatus(); // Update the hunger text
        updateHearts(); // Update the hearts

    }

    decreaseEnjoyment() {
        // Decrease hunger by a certain amount
        this.playVal -= 1; // You can adjust the amount as needed
        if (this.playVal < 0) {
            this.playVal = 0; // Ensure hungerVal doesn't go below 0
        }
        this.updateStatus(); // Update the hunger text
        updateHearts(); // Update the hearts

    }

    petIncrease(types: string, gold: number) {
        
    }

    /*STATUSES END*/ 


    handleBoundaries() {

        if (this.xPos + this.w >= CANVAS_WIDTH * .90 || this.xPos < CANVAS_WIDTH * .10) {
            this.vx *= -1; // Reverse direction on hitting horizontal boundaries
        }
        if (this.yPos + this.h >= CANVAS_HEIGHT * .90 || this.yPos < CANVAS_HEIGHT * .10) {
            this.vy *= -1; // Reverse direction on hitting vertical boundaries
        }

    }

    updateState(newState: AnimalState) {
        this.state = newState;
    }


    changeFrame(newFrameY : number, newFrameX : number, ) {
        this.frameY = newFrameY;
        this.cols = newFrameX;
    }

    performActions(deltaTime: number) {

        //Animations
        switch (this.state) {
            case AnimalState.Idle:
                this.changeFrame(this.anmStates.idle.rowNum, this.anmStates.idle.frames);
                break;
            case AnimalState.Moving:

                if (this.vx == 0) {
                    return
                }
                else if (this.vx <= -1) {
                    this.changeFrame(this.anmStates.walkleft.rowNum, this.anmStates.walkleft.frames);
                } else if (this.vx >= 1) {
                    this.changeFrame(this.anmStates.walkright.rowNum, this.anmStates.walkright.frames);
                   
                }

                const deltaX = this.vx * (deltaTime / 1000);
                const deltaY = this.vy * (deltaTime / 1000);
                this.xPos += deltaX * this.speed;
                this.yPos += deltaY * this.speed;
                break;
        }
    }

    draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
        this.performActions(deltaTime);

        this.animateSprite(deltaTime);
        this.handleBoundaries();

    }
}




let myAnimal: Animal = new Animal(randomSpawnX, randomSpawnY, CANVAS_WIDTH * .05, CANVAS_HEIGHT * .10);

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
let hungerIntervalId: number; // Declare intervalId as a global variable for each status
let enjoymentIntervalId: number;
let cleanlinessIntervalId: number;

hungerIntervalId = setInterval(() => {
    myAnimal.decreaseHunger(); // Decrease hunger every 2 seconds
}, 4000); 

enjoymentIntervalId = setInterval(() => {
    myAnimal.decreaseEnjoyment(); // Decrease enjoyment every 5 seconds
}, 3000);

cleanlinessIntervalId = setInterval(() => {
    myAnimal.decreaseClean(); // Decrease cleanliness every 3 seconds
}, 2000);

// Handle tab visibility change
function handleVisibilityChange() {

    
    if (document.hidden) {
        // Tab is not visible, so pause the animation and intervals
        cancelAnimationFrame(animationId);
        clearInterval(hungerIntervalId);
        clearInterval(enjoymentIntervalId);
        clearInterval(cleanlinessIntervalId);
    } else {

        clearInterval(hungerIntervalId);
        clearInterval(enjoymentIntervalId);
        clearInterval(cleanlinessIntervalId);
        cancelAnimationFrame(animationId);

        // Tab is visible, so resume the animation and intervals
        lastFrameTime = performance.now(); // Reset lastFrameTime to avoid large deltaTime on resume
        animate(); // Start animation loop again
        // Restart intervals for each status
        hungerIntervalId = setInterval(() => {
            myAnimal.decreaseHunger();
        }, 2000);
        enjoymentIntervalId = setInterval(() => {
            myAnimal.decreaseEnjoyment();
        }, 5000);
        cleanlinessIntervalId = setInterval(() => {
            myAnimal.decreaseClean();
        }, 3000);
        
    }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);





/* HEARTS */

function updateHearts() {
    const heartsDiv = document.querySelector('.hearts');
    heartsDiv!.innerHTML = ''; // Clear previous hearts
    
    const statusValue: { [key: string]: number } = {
      hunger: myAnimal.hungerVal,
      cleanliness: myAnimal.cleanVal,
      enjoyment: myAnimal.playVal
    };
    
    // Populate hearts based on status values
    Object.keys(statusValue).forEach(status => {
      const numHearts = Math.min(statusValue[status] > 0 ? Math.ceil(statusValue[status] / 50) : 0, 2); // Each heart represents 33.4%
      for (let i = 0; i < numHearts; i++) {
        const heartIcon = document.createElement('img');
        heartIcon.src = 'heart-icon.png'; // Replace with your heart icon source
        heartsDiv!.appendChild(heartIcon);
      }
    });
}

// Call updateHearts initially and whenever status values change
updateHearts();



/* Manage Global Coins */ 
var coinText: HTMLElement | null = document.querySelector('.coins p');

function updateCoins() {
    coins++;
    coinText!.innerText = `COINS: ${coins}`;
}

setInterval(() => {
    updateCoins() 
}, 1000);