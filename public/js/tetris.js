import BLOCKS from "./block.js";
import RANKS from "./rank.js";

// DOM
const playground = document.querySelector(".playground > ul"); //테트리스 판
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");

// Setting
const GAME_ROWS = 22;
const GAME_COLS = 14;


// variables
let score = 0;
let duration ; //블럭이 떨어지는 시간
let downInterval;
let tempMovingItem; //movingItem을 실행하기 전 잠시 담아두는 용도

const movingItem = { //블럭의 타입과 좌표 등과 같은 정보
    type: "",
    direction: 3, //블럭 회전
    top: 0, //좌표 기준 어디까지 내려가는지
    left: 0, //좌표 기준 좌우 조정
}


init()

// functions
function init() {
    score = 0; //초기화
    scoreDisplay.innerHTML = "현재기록 : " + score; 
    duration = 500; // 속도 초기화
    tempMovingItem = { ...movingItem }; //spread operator 이용하여 값만 가져오기
    for(let i = 0; i < GAME_ROWS; i++){
        prependNewLine()
    }
    generateNewBlock()
}

function prependNewLine() {
    const li = document.createElement("li"); //20개의 행
    const ul = document.createElement("ul"); //li를 포함한 행
    for(let j = 0; j < GAME_COLS; j++){
        const matrix = document.createElement("li"); //셀을 10개 만들어줌
        ul.prepend(matrix); //만든 셀(10개)을 ul에 넣기
    }
    li.prepend(ul) //li에 ul 넣기
    playground.prepend(li) //테트리스 판에 li 넣기
}
function renderBlocks(moveType = "") {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        /* 삼항 연산자 
        const xxx = 조건 ? 참일 경우 : 거짓일 경우 */
        const target = playground.childNodes[y] ?  playground.childNodes[y].childNodes[0].childNodes[x] : null;
        //console.log(target)
        const isAvailable = checkEmpty(target);
        if(isAvailable){
            target.classList.add(type, "moving")    
        } else {
            tempMovingItem = { ...movingItem }
            if(moveType === 'retry'){
                clearInterval(downInterval)
                showGameoverText()
            }
            setTimeout(() => {
                renderBlocks('retry');
                if(moveType === "top"){
                    seizeBlock();
                }
            },0) //시간 0
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
            prependNewLine()
            score++;
            scoreDisplay.innerText = score;
            levelscore(score)
        }
    })
    generateNewBlock()
}
function generateNewBlock(){ //새로운 블럭 내려오게 함

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1)
    }, duration) //시간 duration

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)
    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem};
    renderBlocks()
}

function checkEmpty(target){
    if (!target || target.classList.contains("seized")) {
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
    },10) //시간 10
}
// event handling
document.addEventListener("keydown",e =>{
    switch(e.keyCode){
        case 39 : //오른쪽 이동
            moveBlock("left",1);
            break;
        case 37: //왼쪽 이동
            moveBlock("left",-1);
            break;
        case 40: //아래쪽 이동
            moveBlock("top",1);
            break;
        case 38: //도형 회전
            changeDirection();
            break;
        case 32: //space
            dropBlock()
            break;
        default:
            break;
    }
})
