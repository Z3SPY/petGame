

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx  = canvas?.getContext('2d')!;

class NewPet {
    spriteSheet: string;
    anmStates: any;
    cols: number;
    rows: number;
    spriteWidth: number;
    spriteHeight: number;

    constructor(spriteSheet: string, cols: number, rows: number, spriteWidth: number, spriteHeight: number, stateList : any) {
        this.spriteSheet = spriteSheet;
        this.anmStates = stateList; // Initializing animation states, you might want to assign appropriate values here.
        this.cols = cols;
        this.rows = rows;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
    }
}


//Fox 512 352
//Purple Thing 700 700


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
    Eating,
    Playing,
    Clean,
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
    spriteSheetURL!: string;
    cols!: number;
    rows!: number;
    spriteWidth!: number;
    spriteHeight!: number;
    spriteWdOfst!: number;// width in px / cols spacing = Value of SpriteWidth
    spriteHtOfst!: number;// height in px / rows spacing = Sprite height
    frameX: number = 0;
    frameY: number = 1;
    gameFrame: number = 0;
    staggerFrames: number = 2;

    anmStates: any;

    constructor(xPos: number, yPos: number, w: number, h: number, pet : NewPet) {
        this.hungerVal = 100;
        this.cleanVal = 100;
        this.playVal = 100;

        this.updateSpriteVals(pet);

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

        if (this.state == AnimalState.Clean || this.state == AnimalState.Eating || this.state == AnimalState.Playing) {
            return;
        } else {
            setInterval(() => {
                // Transition to the Idle state after the interval finishes

                if (this.state == AnimalState.Clean || this.state == AnimalState.Eating || this.state == AnimalState.Playing) {
                    this.updateState(AnimalState.Idle);
                    setTimeout(() => {
                        this.updateState(AnimalState.Moving);
                    }, idleInterval);
                }

                
            }, moveInterval);
        }
        


    }

    updateSpriteVals (newPetValue: NewPet) {

        
        this.anmStates = newPetValue.anmStates;
        this.spriteSheetURL = newPetValue.spriteSheet;
        this.cols = newPetValue.cols;
        this.rows = newPetValue.rows;
        this.spriteWidth = newPetValue.spriteWidth;
        this.spriteHeight = newPetValue.spriteHeight;

        this.spriteHtOfst = this.spriteHeight / this.rows;
        this.spriteWdOfst = this.spriteWidth / this.cols; 
        this.image.src = this.spriteSheetURL;
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
            (this.w * 1.2) + 50,
            (this.h * 1.2 )+ 10
        );

    }
    

    updateStatus() {
        this.hungerVal = this.hungerVal > 100 ? 100 : this.hungerVal;
        this.cleanVal = this.cleanVal > 100 ? 100 : this.cleanVal;
        this.playVal = this.playVal > 100 ? 100 : this.playVal;



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
        console.log(types);
        switch(types) {
            case "feed":
                if (gold >= 75) {
                    coins -= 75;
                    this.updateState(AnimalState.Eating);
                    console.log("feed");
                    this.hungerVal += 50;
                    var audio = new Audio('/munchin.mp3');
                    audio.play();
                } else {
                    console.log("Not enough gold play sound");
                    var audio = new Audio('/error.mp3');
                    audio.play();
                }
                
                break;
            case "play":
                if (gold >= 50) {
                    coins -= 50;
                    this.updateState(AnimalState.Playing);
                    console.log("play");
                    this.playVal += 30;
                } else {
                    console.log("Not enough gold play sound");
                    var audio = new Audio('/error.mp3');
                    audio.play();
                }

                break;
            case "clean":
                if (gold >= 50) {
                    coins -= 50;
                    this.updateState(AnimalState.Clean);
                    console.log("clean");
                    this.cleanVal += 50; 
                } else {
                    console.log("Not enough gold play sound");
                    var audio = new Audio('/error.mp3');
                    audio.play();
                }
                
                break;
            default:
                break;
        }
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
            case AnimalState.Clean:
                this.changeFrame(this.anmStates.play.rowNum, this.anmStates.play.frames);
                break;
            case AnimalState.Eating:
                this.changeFrame(this.anmStates.feed.rowNum, this.anmStates.feed.frames);
                break;
            case AnimalState.Playing:
                this.changeFrame(this.anmStates.play.rowNum, this.anmStates.play.frames);
                break;
        }
    }

    draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
        this.performActions(deltaTime);

        this.animateSprite(deltaTime);
        this.handleBoundaries();

    }
}


/** ALL TYPES OF PET */
const munchKin = new NewPet('/SpriteSheet.png', 6, 6, 700, 700, {
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
        frames: 4,
        rowNum: 4,
    },
    "play": {
        name: "play",
        frames: 3,
        rowNum: 3
    }
});

const fox = new NewPet('/fox-spritesheet.png', 6, 5, 522, 350, {
    "idle": {
        name: "idle",
        frames: 3,
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
        frames: 3,
        rowNum: 4,
    },
    "play": {
        name: "play",
        frames: 3,
        rowNum: 3
    }
})

/** SHOP FUNCTION */
let letShopArr = [
    munchKin,
    fox

]

const shopMenu =  document.querySelector(".window");

console.log(shopMenu);  
letShopArr.forEach(e => {
    var element = document.createElement('div');
    element.classList.add("bar");
    element.innerHTML = `  
    <button> SWITCH </button> `
    shopMenu?.append(element);
});



let myAnimal: Animal = new Animal(randomSpawnX, randomSpawnY, CANVAS_WIDTH * .05, CANVAS_HEIGHT * .10, munchKin);

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
        /*clearInterval(hungerIntervalId);
        clearInterval(enjoymentIntervalId);
        clearInterval(cleanlinessIntervalId);*/
    } else {

        /*clearInterval(hungerIntervalId);
        clearInterval(enjoymentIntervalId);
        clearInterval(cleanlinessIntervalId);*/
        cancelAnimationFrame(animationId);

        // Tab is visible, so resume the animation and intervals
        lastFrameTime = performance.now(); // Reset lastFrameTime to avoid large deltaTime on resume
        animate(); // Start animation loop again
        // Restart intervals for each status
       /* hungerIntervalId = setInterval(() => {
            myAnimal.decreaseHunger();
        }, 2000);
        enjoymentIntervalId = setInterval(() => {
            myAnimal.decreaseEnjoyment();
        }, 5000);
        cleanlinessIntervalId = setInterval(() => {
            myAnimal.decreaseClean();
        }, 3000);*/
        
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
    coins += 5;
    coinText!.innerText = `COINS: ${coins}`;
}

setInterval(() => {
    updateCoins() 
}, 1000);


/* Button Handler */

const feedButton = document.querySelector('#feedButton');
const playButton = document.querySelector('#playButton');
const cleanButton = document.querySelector('#cleanButton');

let canClick = true;
// Function to handle pet actions
function handlePetAction(action: string) {
    return function(event: { preventDefault: () => void; stopPropagation: () => void; }) {
        event.preventDefault(); // Prevent default action
        event.stopPropagation(); // Stop event propagation

        if (canClick == true) {
            canClick = false;
            // Perform the action based on the button clicked
            myAnimal.petIncrease(action, coins);

            setInterval(() => {
                canClick = true;
                console.log(canClick);
            }, 2000)
        }

    };
}

// Add event listeners to the buttons
feedButton?.addEventListener('click', handlePetAction('feed'));
playButton?.addEventListener('click', handlePetAction('play'));
cleanButton?.addEventListener('click', handlePetAction('clean'));


