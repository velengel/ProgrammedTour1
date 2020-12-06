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
    var accbutton = document.getElementById("Button");
    accbutton.style.display="none";
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
        //alert("あなたにプログラムされていた内容:\n  「もし座っていたら、」立ち上がる。");
        createMordalWindow(phase);
        //phase = 1;
        index = 0;
        As = [];
    }

    if (index > 30 && dif < -2 && phase == 1) {
        //alert("あなたにプログラムされていた内容:\n  「もし壁に当たりそうになったら、」立ち止まる。");
        //phase = 2;
        createMordalWindow(phase);
        index = 0;
        As = [];
    }

    if (index > 30 && dif > 3 && phase == 2) {
        //alert("あなたにプログラムされていた内容:\n椅子を探す。\n椅子に向かって歩く。\n向きを変える。\n椅子に座る。\n日々の行動に条件分岐がないか考える。");
        //phase = 3;
        createMordalWindow(phase);
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
            inst.innerHTML = "命令１：<br>立ち上がってください。";
            img.innerHTML = '<img src="../img/standup.png" width = 30% />'
            break;
        case 1:
            inst.innerHTML = "命令２：<br>壁に向かって歩いてください。"

            img.innerHTML = '<img src="../img/walk1.png" width = 30% />'
            break;
        case 2:
            inst.innerHTML = "命令３：<br>椅子に座ってください。"
            img.style.left = 0 + "px";
            img.innerHTML = '<img src="../img/sitdown.png" width = 30% />'
            break;
        case 3:
            count = 200;
            inst.innerHTML = "おつかれさまでした。";
            var all = document.getElementById("all");
            all.style.display = "none";
            var program = document.getElementById("program");
            var programText = `
おつかれさまでした。<br>
あなたにプログラムされていた内容は以下になります。<br>
<b>無意識にやっている動作</b>や、<b>条件分岐</b>に気づけましたか？<br>

<pre><code class="language-Python">
# あなたの人生のライブラリをimport
import YourBehavior


def main():
    # 命令１：立ち上がってください。
    # もし座っていたら、立ち上がる。
    if isSitting == True :
        StandUp()
    # 命令２：壁に向かって歩いてください。
    # もし壁に当たりそうになったら、立ち止まる。
    if isAboutToHit(wall) == True :
        Stop()
    # 命令３：椅子に座ってください。
    # 椅子を探す
    chair : Object = Search()
    # 椅子に向かって歩く。
    WalkTo(chair)
    # 向きを変える。
    Turn()
    # 椅子に座る。
    SitDown(chair)
    # 日々の行動に条件分岐がないか考える。
    Think(conditionalBranch)
</code></pre>
`;

            program.innerHTML = programText;
            img.style.display = "none";
            phase++;
            break;
    }

}

/*$("#modal-open").click(
    function() {
        $(this).blur();
        if ($("#modal-overlay")[0]) return false;
        $("body").append('<div id="modal-overlay"></div>');
        centeringModalSyncer();
        $("#modal-overlay").fadeIn("slow");
        $("#modal-content").fadeIn("slow");
        $("#modal-overlay,#modal-close").unbind().click(function() {
            $("#modal-overlay").remove();
            $("#modal-content").css({ "display": "none" });
        });
    }

);*/

function createMordalWindow(phaseNumber) {
    $(this).blur();
    if ($("#modal-overlay")[0]) return false;
    $("body").append('<div id="modal-overlay"></div>');
    centeringModalSyncer();
    $("#modal-overlay").fadeIn("slow");
    $("#modal-content").fadeIn("slow");
    switch (phaseNumber) {
        case 0:
            var programText = `<b>あなたにプログラムされていた内容：</b><br>
            <pre>
# もし座っていたら、立ち上がる。
if isSitting == True :
  StandUp()
</pre>`
            $("#ProgramText").html(programText);
            break;
        case 1:
            var programText = `<b>あなたにプログラムされていた内容：</b><br>
            <pre>
# もし壁に当たりそうになったら、立ち止まる。
if isAboutToHit(wall) == True :
  Stop()
</pre>`
            $("#ProgramText").html(programText);
            break;
        case 2:
            var programText = `<b>あなたにプログラムされていた内容：</b><br>
                <pre>
# 椅子を探す
chair : Object = Search()
# 椅子に向かって歩く。
WalkTo(chair)
# 向きを変える。
Turn()
# 椅子に座る。
SitDown(chair)
# 日々の行動に条件分岐がないか考える。
Think(conditionalBranch)
</pre>`
            $("#ProgramText").html(programText);
            break;
    }
    $("#modal-close").unbind().click(function() {
        $("#modal-overlay").remove();
        $("#modal-content").css({ "display": "none" });
        phase++;
    });
}

function centeringModalSyncer() {
    var w = $(window).width();
    var h = $(window).height();
    var cw = $("#modal-content").outerWidth({ margin: true });
    var ch = $("#modal-content").outerHeight({ margin: true });
    var pxleft = ((w - cw) / 2);
    var pxtop = ((h - ch) / 2);
    $("#modal-content").css({ "left": pxleft + "px" });
    $("#modal-content").css({ "top": pxtop + "px" });
}