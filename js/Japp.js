var aX = 0,
    aY = 0,
    aZ = 0;
var index = 0,
    As = [];
As.length = 100;
var A = 0;
var phase = -1;

var count = 0;


function deviceMotionRequest() {
    if (DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener("devicemotion", function(event) {
                        if (!event.accelerationIncludingGravity) {
                            alert('event.accelerationIncludingGravity is null');
                            return;
                        }
                        aX = event.accelerationIncludingGravity.x.toFixed(2);
                        aY = event.accelerationIncludingGravity.y.toFixed(2);
                        aZ = event.accelerationIncludingGravity.z.toFixed(2);
                        A = Math.sqrt(aX * aX + aY * aY + aZ * aZ).toFixed(2);
                    })
                }
            })
            .catch(console.error);
    } else {
        alert('DeviceMotionEvent.requestPermission is not found');
    }
    phase = 0;
}

var timer = window.setInterval(() => {
    displayData(); // displayData 関数を実行
    displayInstruction();
}, 100);

var accTimer = window.setInterval(() => {
    displayAcc();
}, 33);

function displayAcc() {
    var accMeter = document.getElementById("acc");
    accMeter.value = A;
    var accText = document.getElementById("accText");
    //accText.innerHTML = A;
}

/*var ImgChangeTimer = window.setInterval(() => {
    ImgTimer();
}, 500);

function ImgTimer() {
    if (phase == 1) {
        console.log(count);
        count++;
        count %= 2;
        var txt = document.getElementById("txt");
        //txt.innerHTML = '<img src="../img/walk.png" width = 30% />'
        txt.innerHTML = '<img src="../img/walk' + (count + 1) + '.png" width = 30% />'
    }
}*/

var ImgChangeTimer = window.setInterval(() => {
    ImgTimer();
}, 50);

function ImgTimer() {
    if (phase == 1) {
        count += 2;
        count %= 300;
        var img = document.getElementById("image");
        img.style.left = count + "px";
        img.style.position = "relative";
        console.log(img.innerHTML);
        //txt.innerHTML = '<img src="../img/walk.png" width = 30% />'

    }
}

var ImgChangeTimer2 = window.setInterval(() => {
    ImgTimer2();
}, 50);

function ImgTimer2() {
    if (phase == 4) {
        if (count > 0) count -= 1;
        var wimg = document.getElementById("walkimage");
        wimg.style.left = count + "px";
        wimg.style.position = "relative";
        console.log(wimg.innerHTML);
        //txt.innerHTML = '<img src="../img/walk.png" width = 30% />'

    }
}


document.body.addEventListener('keydown',
    event => {
        if (event.key === 'n') {
            phase++;
        }
    });

function displayData() {


    //直前の値を保存
    index++;
    As[index % 100] = A;
    index %= 100;

    //プログラムされていた判定
    var dif = A - As[(index - 1) % 100];
    if (index > 30 && dif < -2 && phase == 0 && Math.abs(As[(index - 1) % 100]) > 1) {
        alert("あなたにプログラムされていた内容:\n  「もし座っていたら、」立ち上がる。");
        phase = 1;
        index = 0;
        As = [];
    }

    if (index > 30 && dif < -2 && phase == 1) {
        alert("あなたにプログラムされていた内容:\n  「もし壁に当たりそうになったら、」立ち止まる。");
        phase = 2;
        index = 0;
        As = [];
    }

    if (index > 30 && dif > 3 && phase == 2) {
        alert("あなたにプログラムされていた内容:\n椅子を探す。\n椅子に向かって歩く。\n向きを変える。\n椅子に座る。\n日々の行動に条件分岐がないか考える。");
        phase = 3;
        index = 0;
        As = [];
    }

    var phaseBar = document.getElementById("progress");
    phaseBar.value = phase + 1;
}

function displayInstruction() {
    var inst = document.getElementById("instruction");
    var txt = document.getElementById("txt");
    var img = document.getElementById("image");
    switch (phase) {
        case -1:
            inst.innerHTML = "命令：加速度センサの許可😊を押してスタート";
            break;
        case 0:
            txt.style.display = "none";
            inst.innerHTML = "命令１：立ち上がってください。";
            img.innerHTML = '<img src="../img/standup.png" width = 30% />'
            break;
        case 1:
            inst.innerHTML = "命令２：壁に向かって歩いてください。"

            img.innerHTML = '<img src="../img/walk1.png" width = 30% />'
            break;
        case 2:
            inst.innerHTML = "命令３：椅子に座ってください。"
            img.style.left = 0 + "px";
            img.innerHTML = '<img src="../img/sitdown.png" width = 30% />'
            break;
        case 3:
            count = 200;
            inst.innerHTML = "おつかれさまでした。";
            txt.style.display = "block";
            txt.innerHTML = `日常の行動の中で
            <ul>
                <li>無意識に判断している条件</li>
                <li>意識していない動作</li>
            </ul>
            に気づいてもらえたでしょうか？<br><br>`;
            var expression = `
            
命令１：立ち上がってください。<br>
→ <b>もし座っていたら、</b>立ち上がる。<br>
<ul class="box-list">
<img src="../img/sitdown.png"><img src="../img/RightArrow.png"><img src="../img/standup.png">
</ul>
<br>命令２：壁に向かって歩いてください。<br>
→ <b>もし壁に当たりそうになったら、</b>立ち止まる。<br>
<div id="walkimage">
<img src="../img/walk2.png">
</div>
<br>命令３：椅子に座ってください。<br>
→ 椅子を探す。<br>
椅子に向かって歩く。<br>
向きを変える。<br>
椅子に座る。<br>
<b>日々の行動に条件分岐がないか考える。</b><br>
<ul class="box-list">
<img src="../img/walk1.png"><img src="../img/sitdown.png"><img src="../img/thinking.png">
</ul>

`
            txt.innerHTML += expression;
            img.style.display = "none";
            phase++;
            break;
    }

}