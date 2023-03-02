import { rankpage } from "./firebase.js";



export function DBranking(){
    var printArray = [];
    var ranking = document.getElementById("ranking");
    for(let i=0;i<rankpage.length;i++){
        printArray.push((i + 1) + ' 위 ' +rankpage[i]["score"]+ ' 점 '+rankpage[i]["time"]+" 초 ");
    }
    ranking.innerHTML = printArray.join("<br>"); // 웹브라우저 화면에 출력
}