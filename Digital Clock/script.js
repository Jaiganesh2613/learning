
let ampm = document.getElementById('ampm')

function displayTime(){
    let datetime = new Date();
    let hr = datetime.getHours();
    let min = padZero(datetime.getMinutes());
    let sec = padZero(datetime.getSeconds());
    if(hr>12){
        hr = hr-12
        ampm.innerHTML = "PM"
    }

    document.getElementById('hours').innerHTML = padZero(hr)
    document.getElementById("mins").innerHTML = min
    document.getElementById("seconds").innerHTML = sec
}

function padZero(num){
    return num<10?"0"+num:num
}




setInterval(displayTime,500)