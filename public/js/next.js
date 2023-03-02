import NEXTBLOCK from "./nextblock.js";
import randomIndex from "./tetris.js";

const nextblock = document.querySelector(".next_block > ul");

const NEXT_GAME_ROWS = 5;
const NEXT_GAME_COLS = 5;

export function nextinit(){
    for(let i = 0; i < NEXT_GAME_ROWS; i++){
        prependNextNewLine()
    }
}
export function prependNextNewLine() {
    const li2 = document.createElement("li"); //20개의 행
    const ul2 = document.createElement("ul"); //li를 포함한 행
    for(let j = 0; j < NEXT_GAME_COLS; j++){
        const matrix2 = document.createElement("li"); //셀을 10개 만들어줌
        ul2.prepend(matrix2); //만든 셀(10개)을 ul에 넣기
    }
    li2.prepend(ul2) //li에 ul 넣기
    nextblock.prepend(li2) //테트리스 판에 li 넣기    

}
export function showNext() {
    if(randomIndex == sqaure) {

    }
    else if(randomIndex == bar) {

    }
    else if(randomIndex == tree) {

    }
    else if(randomIndex == zeeLeft) {

    }
    else if(randomIndex == zeeRight) {

    }
    else if(randomIndex == elLeft) {

    }
    else if(randomIndex == elRight) {

    }
}