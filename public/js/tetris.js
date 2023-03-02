import BLOCKS from "./block.js";
import { timeinit, timerEvt, timestop } from "./timer.js";
import { nextinit } from "./next.js";
import { saveinfo, rankpage } from "./firebase.js";

// DOM
const playground = document.querySelector(".playground > ul"); //테트리스 판
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");
const rankText = document.querySelector(".rank-text"); // 랭킹 표시 탭
const cancelButton = document.getElementById("cancel"); // 랭킹에서 취소 버튼
const rankscore = document.getElementById("score"); // 랭킹에 표시되는 점수
const signButton = document.getElementById("sign"); // 랭킹에서 등록 버튼


// Setting
const GAME_ROWS = 22;
const GAME_COLS = 14;


// variables
let score = 0;
let duration; //블럭이 떨어지는 시간
let downInterval;
let tempMovingItem; //movingItem을 실행하기 전 잠시 담아두는 용도
let timescore;

const rank = [] // 랭킹에 들어가는 배열
const movingItem = { //블럭의 타입과 좌표 등과 같은 정보
    type: "",
    direction: 3, //블럭 회전
    top: 0, //좌표 기준 어디까지 내려가는지
    left: 0, //좌표 기준 좌우 조정
}


init()

// functions
function init() {
    rankpage
    score = 0; //초기화
    scoreDisplay.innerHTML = "현재기록 : " + score; 
    duration = 500; // 속도 초기화
    timeinit() // 타이머 초기화
    timerEvt() // 타이머 이벤트
    nextinit()
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
    movingItem.left = 5;
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
function showGameoverText(){
    timescore = timestop() // 타이머 정지 및 소요시간 저장
    rankscore.innerHTML = score + " 점!!!" +"<br>"+"소요시간은 : "+timescore +"초 입니다."// 획득 점수를 랭킹판에 표현
    rankText.style.display = 'flex'
}
function CancelEvent(){ // 취소버튼 클릭 시 이벤트
    gameText.style.display = 'flex'
}
async function signEvent(){ // 등록 버튼 클릭 시 이벤트
    // rank.push(score)
    // console.log(rank) <- 랭킹 확인 용도
    ranking(score);
    gameText.style.display = 'flex'
    saveinfo(score,timescore)
}
function ranking(score) {
    rank.push(score)
    rank.sort(scoreCompare);
    var showranking = document.getElementById("ranking");
    var printArray = [];
    for (var k = 0; k < rank.length; k++) {
        if (k >= 10) {
            break;
        }
        printArray.push((k + 1) + '위 : ' + '사용자 : 아무개' + " " + rank[k] + '점');
    }
    showranking.innerHTML = printArray.join("<br>"); // 웹브라우저 화면에 출력
    //console.log(rank)
}
function scoreCompare(a, b) {
    return b - a;
}
function levelscore(score){ // 속도 조절 함수
    if(score >= 5 && score < 10){
        duration = 400
    } else if(score >= 10 && score < 15){
        duration = 300
    }
    else if(score >= 15 && score < 20){
        duration = 250
    }
    else if(score >= 20 && score < 30){
        duration = 200
    }
    else if(score >= 30){
        duration = 100
    }
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

restartButton.addEventListener("click",() =>{ // 재시작 버튼 클릭 이벤트
    playground.innerHTML="";
    rankText.style.display = 'none'
    gameText.style.display = 'none'
    init()
})
cancelButton.addEventListener("click",CancelEvent) // 취소 버튼 클릭
signButton.addEventListener("click",signEvent) // 등록 버튼 클릭
