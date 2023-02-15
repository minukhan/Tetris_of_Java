var time = 0;
var timer;

export function timeinit(){ // 타이머 초기화
    time = 0;
    document.getElementById("time").innerHTML = "00:00:00";
}

export function timerEvt(){ // 타이머 시작
    var hour = 0;
    var min = 0;
    var sec = 0;
    if(time == 0){
        timeinit()
    }
    timer = setInterval(function(){
        time++;

        min = Math.floor(time/60);
        hour = Math.floor(min/60);
        sec = time%60;
        min = min%60;

        var th = hour;
        var tm = min;
        var ts = sec;
        if(th<10){
            th = "0" + hour;
        }
        if(tm<10){
            tm = "0" + min;
        }
        if(ts < 10){
            ts = "0" + sec;
        }
        document.getElementById("time").innerHTML = th +":"+tm+":"+ts;
    },1000);
}
export function timestop(){ // 타이머 정지
    clearInterval(timer);
    return time; // 소요시간 전달
}
