

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx  = canvas?.getContext('2d')!;


const CANVAS_WIDTH : number = canvas.width = 1000;
const CANVAS_HEIGHT : number = canvas.height = 1000;


ctx.fillStyle = 'white';




const hungerText: HTMLSpanElement = document.getElementById("hngrValTxt")!.getElementsByTagName("span")[0];
const cleanText: HTMLSpanElement = document.getElementById("clnValTxt")!.getElementsByTagName("span")[0];
const enjyText: HTMLSpanElement = document.getElementById("enjyValTxt")!.getElementsByTagName("span")[0];


//StateMachine
enum AnimalState {
    Moving,
    Idle, 
    Dragged  //If click on box dragged
}



//End StateMachine
let intervalId: number; // Declare intervalId as a global variable

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

    
    randX!: number;
    randY!: number;
    state: AnimalState = AnimalState.Moving; // Initial state is Idle


    constructor(xPos:number , yPos:number, w:number, h:number) {
        this.hungerVal = 100;
        this.cleanVal = 100
        this.playVal = 100;

        this.xPos = xPos;
        this.yPos = yPos;
        this.w = w;
        this.h = h;


        this.randX = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        this.randY = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        let moveInterval = 5000;
        let idleInterval = 2000;

        this.updateStatus();
        setInterval(() => {
            // Transition to the Idle state after the interval finishes
            this.updateState(AnimalState.Idle);
            setTimeout(() => {
            
                this.updateState(AnimalState.Moving);
            }, idleInterval);
        }, moveInterval);

       
        
    }

    updateStatus() {
        hungerText.innerText = this.hungerVal.toString();
        cleanText.innerText = this.cleanVal.toString();
        enjyText.innerText = this.playVal.toString();

    }

    //Hunger 
    decreaseHunger() {
        // Decrease hunger by a certain amount
        this.hungerVal -= 10; // You can adjust the amount as needed
        if (this.hungerVal < 0) {
            this.hungerVal = 0; // Ensure hungerVal doesn't go below 0
        }
        this.updateStatus(); // Update the hunger text
    }
    
  


    handleBoundaries() {
        if (this.xPos + this.w > CANVAS_WIDTH || this.xPos < 0) {
            this.randX *= -1; // Reverse direction on hitting horizontal boundaries
        }
        if (this.yPos + this.h > CANVAS_HEIGHT || this.yPos < 0) {
            this.randY *= -1; // Reverse direction on hitting vertical boundaries
        }
    }
    
    updateState(newState: AnimalState) {
        
        this.state = newState;
        console.log(this.state);

    }

    

    performActions(deltaTime: number) {
        switch (this.state) {
            case AnimalState.Idle:
                // Perform actions for Idle state
                this.randX = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                this.randY = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1

                break;
            case AnimalState.Moving:
                const deltaX = (this.speed * deltaTime) / 1000; // Convert speed to pixels per millisecond
                this.xPos += this.randX * deltaX;
                this.yPos += this.randY * deltaX;
    

                break;
        }
    }


    draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
        

        ctx.fillRect(this.xPos, this.yPos, this.w, this.h);        

        this.performActions(deltaTime);
        this.handleBoundaries();



    }


}

let myAnimal: Animal = new Animal(Math.random() * (CANVAS_WIDTH - 200), Math.random() * (CANVAS_HEIGHT - 200), 100, 100);

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

// Handle tab visibility change
function handleVisibilityChange() {
    if (document.hidden) {
        // Tab is not visible, so pause the animation and intervals
        cancelAnimationFrame(animationId);
        clearInterval(intervalId); // Replace 'intervalId' with the ID of your setInterval function
    } else {
        // Tab is visible, so resume the animation and intervals
        lastFrameTime = performance.now(); // Reset lastFrameTime to avoid large deltaTime on resume
        animate(); // Start animation loop again
        intervalId = setInterval(() => {
            myAnimal.decreaseHunger(); // Resume interval for decreasing hunger
        }, 20000); // Adjust the interval time as needed
    }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);
