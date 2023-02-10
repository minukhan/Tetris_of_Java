// DOM
const restartButton = document.querySelector(".game-text > button");
const rankText = document.querySelector(".rank-text"); // 랭킹 표시 탭
const cancelButton = document.getElementById("cancel"); // 랭킹에서 취소 버튼
const rankscore = document.getElementById("score"); // 랭킹에 표시되는 점수
const signButton = document.getElementById("sign"); // 랭킹에서 등록 버튼


// variables
const rank = [] // 랭킹에 들어가는 배열


// functions
function showGameoverText(){
    rankscore.innerHTML = score + " 점!!!" // 획득 점수를 랭킹판에 표현
    rankText.style.display = 'flex' 
}
function CancelEvent(){ // 취소버튼 클릭 시 이벤트
    gameText.style.display = 'flex'
}
function signEvent(){ // 등록 버튼 클릭 시 이벤트
    // rank.push(score) //ranking 함수로 옮김!!!!!
    // console.log(rank) <- 랭킹 확인 용도
    ranking(score); //랭킹 함수 불러옴.
    gameText.style.display = 'flex'
}
function ranking(score) { //랭킹 함수
    rank.push(score) //rank 배열에 score를 추가함.
    rank.sort(scoreCompare); //rank 배열을 scoreCompare 함수를 이용하여 정렬함
    var showranking = document.getElementById("ranking"); //showranking에다가 html에서 id가 ranking인 것을 가져옴.
    var printArray = [];  //printArray 배열을 빈 배열로 초기화
    for (var k = 0; k < rank.length; k++) {
        if (k >= 10) {
            break; //랭킹이 10위까지 나오면 그 밑은 출력 안하도록 설정함.
        }
        printArray.push((k + 1) + '위 : ' + '사용자' + " " + rank[k] + '점');
    }
    showranking.innerHTML = printArray.join("<br>"); // 웹브라우저 화면에 출력
}
function scoreCompare(a, b) {  //scoreCompare 함수
    return b - a; //오름차순으로 정렬함.
}

// event handling
restartButton.addEventListener("click",() =>{ // 재시작 버튼 클릭 이벤트
    playground.innerHTML="";
    rankText.style.display = 'none'
    gameText.style.display = 'none'
    init()
})
cancelButton.addEventListener("click",CancelEvent) // 취소 버튼 클릭
signButton.addEventListener("click",signEvent) // 등록 버튼 클릭

export {RANKS};