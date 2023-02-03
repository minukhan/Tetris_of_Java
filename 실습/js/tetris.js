import BLOCKS from "./blocks.js";

// DOM
const playground = document.querySelector(".playground > ul");

const nextblock = document.querySelector(".nextblock > ul");

const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector('.score');
const restartButton = document.querySelector('.game-text > button');
// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;
const NEXT_ROWS = 10;
const NEXT_COLS = 10;
// variable
let score = 0;       // 점수
let duration = 500;  // 블럭이 떨어지는 시간. 나중에 레벨을 올라갈떄마다 빠르게 하면 좋을듯.
let downInterval;    
let tempMovingItem;     // 실질적으로 실행하기 전에 잠깐 담아두는 변수이다.
let isFalling = false;  

const movingItem = {   //  다음 블럭의 타입과 좌표들을 저장하고 있는 함수.
    type : "",
    direction : 3,  //윗 화살표를 눌렀을때 좌우로 돌려줄때 사용할것임.
    top: 0,
    left : 0,
};

init()

function init() { //스크립트가 시작이 될때 실행되는 함수이다. init 함수.   
    score = 0;
    scoreDisplay.innerHTML = score;
    tempMovingItem = { ...movingItem }; 

    //  "{...}" 이 표시는 tempMovingItem 에서 movingItem 를 대입받는데 일시적인 그 데이터만 대입받고 그이후에 movingItem에서 변하는 값들은 영향 안미치도록 하는 기능을 가진다 말 그대로 값만 넣는것임. (얕은복사)
    

    for(let i = 0; i < GAME_ROWS; i++){
        prependNewLine()
    }
    generateNewBlock()

    for(let i = 0; i < NEXT_ROWS; i++){
        prependNewLine2()
    }
}

function prependNewLine2(){
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j=0; j < NEXT_COLS; j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    nextblock.prepend(li)
}

function prependNewLine(){
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j=0; j < GAME_COLS; j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}
function renderBlocks(moveType = ""){

    const { type, direction, top, left} = tempMovingItem; //tempMovingItem안에 있는 각각의 변수들을 분리해서 사용하겠다. 
    console.log({nextblock})
    const teeee =  playground.childNodes[y].childNodes[0].childNodes[x]
    
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].some((block) => {
        const x = block[0] + left; //기본값에 left만큼 이동을 시킨것임.  가로를 의미함.
        const y = block[1] + top;  // 기본값에 top 만큼 이동을 시킨것.   세로를 의미함.
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null; 
        const isAvailable = checkEmpty(target);
        if(isAvailable){
            target.classList.add(type,"moving")
        } else {
            tempMovingItem = {...movingItem}
            if(moveType === 'retry'){
                clearInterval(downInterval)
                showGameoverText()
            }
            setTimeout(() => {
                renderBlocks('retry');
                if(moveType ==="top"){
                    seizeBlock();
                }
            }, 0)
            return true;
        }
        
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
function seizeBlock(){ // 블럭을 고정시키는 함수.
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}
function checkMatch(){

    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if(!li.classList.contains("seized")) {
                matched = false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerHTML = score;
        }
    })

    generateNewBlock()
}
function generateNewBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top', 1)
    }, duration) // 밑 방향키를 눌렀을떄 바로 내려가게 하는 코드
    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)
    console.log(randomIndex) 
    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem};
    renderBlocks()
}
function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
        return false; 
    }
    return true;
}
function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}
function changeDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks()
}
function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval (() => {
        moveBlock("top",1)
    },10)
}
function showGameoverText(){
    gameText.style.display = 'flex'
    
}
// event handling
document.addEventListener("keydown",e =>{  //keydown 이벤트가 어떤 키가 눌려졌을때 그 눌려진 키를 e라는 객체로 받는다 그리고 각 키에는 고유의 키코드가있는데 그것을 이용할 것 이다.
    switch(e.keyCode){
        case 39 : // 오른쪽 방향키의 키코드 : 39
            moveBlock("left",1); // moveBlock이라는 함수는 left의 값을 바꿔주는 함수.
            break;
        case 37:  // 왼쪽 방향키의 키코드 : 37
            moveBlock("left",-1);
            break;
        case 40:
            moveBlock("top",1);
            break;
        case 38:
            changeDirection();
            break;
        case 32:  
            dropBlock()
            break;
        default:
            break;
    }
})

restartButton.addEventListener("click",() =>{
    playground.innerHTML="";
    nextblock.innerHTML="";
    gameText.style.display = 'none'
    init()
})