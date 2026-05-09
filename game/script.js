var root = document.documentElement;
var jumps = 10;
var airJumps = 0;
var jumpAnimation = document.getElementById("getJump");
var airJumpAnimation = document.getElementById("getAirJump");
var starAnimation = document.getElementById("getStar");
var gravitySwapAnimation = document.getElementById("getGravitySwap");
var jumpCounter = document.getElementById("numberOfJumps");
var airJumpCounter = document.getElementById("numberOfAirJumps");
var starCounter = document.getElementById("numberOfStars");
var game = document.getElementById("game");
var ctx = game.getContext("2d");
var jumpBufferTimeout;
var respawnGravity = 2.71;
var x = 0;
var y = 0;
var sx = 0;
var sy = 0;
var osy = 0;
var gravity = 2.71;
var cameraX = 0;
var cameraY = 0;
var cameraSpeedX = 0;
var cameraSpeedY = 0;
var respawnGravitySwaps = 0;
var r = "red";
var jumpable = true;
var airjumpable = true;
var keys = [];
var level = 0;
var onblock = false;
var blocks = [];
var objects = [];
var type = "lava";
var spawnX;
var spawnY;
var playerHeight = 50;
var setPlayerHeight = false;
var targetPlayerHeight = 50;
var dead = false;
var levelStars = 0;
var gravitySwaps = 0;
var won = false;
var stars = 0;
var levelJumps = 0;
var jumpSpeed = -40.71;
var levelAirJumps = 0;
var heightSpeed = 0;
var heightSpeedChangeSpeed = 0;
var targetHeightSpeed = 0;
var fallingPlatform = document.getElementById("fallingPlatform");
var customCameraMovement = false;
function Block(colour, action = NaN, hitbox = [0, 0, 50, 50]) {
    this.colour = colour;
    this.action = action;
    this.hx = hitbox[0];
    this.hy = hitbox[1];
    this.hw = hitbox[2];
    this.hh = hitbox[3];

    this.place = function (bx, by) {
        let image = new Image();
        image.src = this.colour;
        this.image = image;
        image.onload = function () {
            ctx.drawImage(image, bx, by, 50, 50);
        };

        blocks[blocks.length] = {
            x: bx,
            y: by,
            action: this.action,
            hx: bx + this.hx,
            hy: by + this.hy,
            hw: this.hw,
            hh: this.hh,
        };
    };
}
function Object(w, h, bounce, friction, colour){
    this.w = w;
    this.h = h;
    this.f = friction;
    this.bounce = bounce;
    this.colour = colour;
    this.place = function(ix, iy, isx, isy){
        let image = new Image();
        console.log(image);
        image.src = this.colour;
        this.image = image;
        image.onload = function () {
            ctx.drawImage(image, ix, iy, this.w, this.h);
            console.log(image);
        };
        console.log("Yay!");
        objects[objects.length] = {
            x: ix,
            y: iy,
            sx: isx,
            sy: isy,
            w: this.w,
            h: this.h,
            bounce: this.bounce,
            f: this.f
        }
    }
    this.move = function(cX, cY, oX, oY){
        ctx.clearRect(oX, oY, this.w, this.h);
        ctx.drawImage(this.image, cX, cY, this.w, this.h);
    }
}

var a = new Block("transparent");
var g = new Block("../images/grass-block.png", "collide");
var d = new Block("../images/inside-dirt.png", "collide");
var gtl = new Block("../images/grass-top-left.png", "collide");
var gtr = new Block("../images/grass-top-right.png", "collide");
var tlgd = new Block("../images/Top-left-grass-dirt.png", "collide");
var trgd = new Block("../images/Top-right-grass-dirt.png", "collide");
var lfgb = new Block("../images/Left-fade-grass-block.png", "collide");
var rfgb = new Block("../images/Right-fade-grass-block.png", "collide");
var e = new Block("../images/finish.png", "win", [20, 0, 10, 50]);
var c = new Block(
    "../images/unchecked-checkpoint.png",
    "checkpoint",
    [20, 0, 10, 50],
);
var cc = new Block("../images/checked-checkpoint.png");
var ub = new Block("../images/unchecked-jump.png", "addjump");
var ua = new Block("../images/unchecked-airjump.png", "addairjump");
var s = new Block("../images/star.png", "addstar");
var sss = new Block("../images/Spike.png", "kill", [10, 20, 30, 30]);
var ccc = new Block("../images/Collapsing.png", "collapse", [0, 0, 50, 25]);
var h = new Block("../images/Gravityswap.png", "gravity");
var u = new Block("../images/Upside-down-Spike.png", "kill", [5, 0, 40, 30]);

var partical = new Object(50, 50, 0, 0, "../images/grass-block.png");

var levels = [
    [
        7,
        0,
        0,
        11,
        "          ggg                                   g",
        "   ggg     dd                  j    j    j      d",
        "           d       c   j[ggggggg   gg   gg   g  d",
        "           d      ggggg{)ddd                 d} d",
        "                    ddddddd                  d  d",
        "                     ddddd                   d {d",
        "                      dddd                   d dd",
        "         gggg         ddd                    d  d",
        "   ggg   ddd          ddd                    d} d",
        "    dd   dd            dd                    d  d                        e",
        "    d     d            d                     d {d                      [gggg",
        "    d     d            d                fsff dcf         f         j [{)",
        "g                      d                gggg d}gg      ggg        gg{)",
    ],
    [
        1,
        1,
        1,
        8,
        "             gg                       j       c",
        "            f                         gg    gggggf      j ^     j^  j ^   cj ^^^j",
        "                                      dd     dddd      gggg   gggg  ggg  ggggggg]^^^^ e",
        "                                      d      ddd                                (}gggggg",
        "            f                         d      ddd",
        "                                     j       dd",
        "   [ggg                        f     ggg      d",
        "gg{)        j       c        gg      ddd      d",
        "d         gg]^^^^^^[ggg              ddd      d",
        "dgggg     dd(}gggg{)dd                dd",
        " ddd       ddddddddddd                d",
        " ddd       d       dd                 d",
        "  dd       d        d",
        "  d                 d                                                 fsf",
        "  d                                                                   ggg",
    ],
    [
        4,
        0,
        0,
        18,
        "                                   j^    cj",
        "                                   gg   ggg    j",
        "                                               bb     f",
        "                                                      bb       e        s",
        "                                                              ggg  f   ggg",
        "                                   j",
        "                                   gg",
        "                                     ",
        "                                    ",
        "                                    ",
        "                                   cj",
        "                                   gg",
        "           [ggggg    ",
        "gggggggggg{)         ",
        "                     ",
        "                                     j",
        "                                     ^^     jj",
        "                                     gg bbbbggg",
        "  ^  ^  ^    ^                            j",
        "ggggggggggggg]      j    cj  j  j   f    jcj",
        "             (}ggbbbb   ggg  b  b   b    ggg",
        "                     ",
        "                     ",
        "                     ",
        "                     ",
        "                     ",
        "                     ",
    ],
    [
        5,
        3,
        0,
        4,
        "                                                                              s                                              c                  e ",
        "                               c                j     j     j     f       c  g                                    ^         ggf               ggg",
        "                              gg               gg     b     b     b      ggg d         j      jc^        jjj     gg  ^             f",
        "                    g          d               d                           d d        bbb     ggg   f    ggg         gg                   f         ",
        "         g                     d               d                           d d                 dd        dd                                     ",
        "g                              d              fd                           d d                 d          d",
        "                               d               d                           d d                 d          d",
        "                               d               d                           d d         j",
        "                               d               d                           d d        bbb",
        "                               d               d                           d d",
        "                               d               d                           d d",
        "                               d              jd                           d d",
        "                               d}gg^^^ggg^^^gggd                           d f         j",
        "                               ddddgggdddgggdddd                           dgg        bbb",
    ],
    [
        1,
        0,
        6,
        4,
        "       gggggj          g",
        "     ggd   dgg         d",
        "    gd       dg        d                                                                        g",
        "    d                  d                                                                       gd",
        "    dg                 d                         e                                            gddggg",
        "    ddgg    ggggggg j  d                        ggg                                            dd",
        "     dddggggd     dgggjd                         d                                              d",
        "     dd              ddd",
        "      d   f f         dd",
        "g^^^g j         c   ggdd                   f",
        "dgggdgggg^^^^^ggggg    d",
        "        dgggggd        d",
        "                       d",
        "                       d              j",
        "                       d             bbb",
        "                       d               ",
        "                       d",
        "                       d",
        "                       d",
        "                      gd",
        "       f           f  dd",
        "             f        dd             ",
        "                      dd                                                                                 g",
        "    g^^^^^g     g^^^^^dd                        jf                                                      gdg",
        "    dgggggd^^^^^dgggggd                         bbb                                                    gdddg",
        "        jfdgggggd                                                                                        d",
        "      c                           jf                                                    sfffffffffffffff d",
        "    gggg          jggggg        ggggg                         f f f f f f f f f f f f    gggggggggggggggggd",
        "    ddddgggggggggggdddd",
    ],
    [
        0,
        0,
        1,
        3,
        "^^^^^^^^^^^^       jc         ^^^       jc                              c",
        "gggggggggggg       gggg   h   ggg   h   ggg",
        "d          h       jfsv        j        vvd ",
        "d h                                       d       ",
        "dgg^^^^^^^^^                              d h    j    j",
        "  dggggggggg                              dggg^^ggg^^ggg   h",
        "                                             dggdddggdj",
        "                                              hvvv  j",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "                                              e",
        "                                            ggggg",
    ],
];
function resizeGame() {
    let largest = 0;
    for (var i = 4; i < levels[level].length; i++) {
        if (levels[level][i].length > largest) {
            largest = levels[level][i].length;
        }
    }
    game.width = largest * 50;
    game.height = levels[level].length * 50;
}
resizeGame();
spawnX = levels[level][2];
spawnY = levels[level][3] + 4;
levelJumps = levels[level][0];
levelAirJumps = levels[level][1];
document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowLeft" && !won && !dead) {
        keys[0] = true;
        document.getElementById("player").style.scale = "-1 1";
    }
});
document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowRight" && !won && !dead) {
        keys[1] = true;
        document.getElementById("player").style.scale = "1 1";
    }
});
document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp" && !won && !dead) {
        keys[2] = true;
        checkCollision();
    }
});
document.addEventListener("keyup", function (e) {
    if (e.key == "ArrowLeft" && !won && !dead) {
        keys[0] = false;
    }
});
document.addEventListener("keyup", function (e) {
    if (e.key == "ArrowRight" && !won && !dead) {
        keys[1] = false;
    }
});
document.addEventListener("keyup", function (e) {
    if (e.key == "ArrowUp" && !won && !dead) {
        keys[2] = false;
        airjumpable = true;
    }
});
document.addEventListener("keydown", function (e) {
    if (e.key == "r" && !won && !dead) {
        if (x / 50 == spawnX && y / 50 == spawnY) {
            spawnX = levels[level][2];
            spawnY = levels[level][3] + 4;
            levelJumps = levels[level][0];
            levelAirJumps = levels[level][1];
        }
        console.log(spawnX, x);
        setLevel();
    }
});
function setLevel() {
    
    if (Math.sign(gravity) != Math.sign(respawnGravity)) {
        jumpSpeed = 0 - jumpSpeed;
        console.log(gravity, respawnGravity);
    }
    gravity = respawnGravity;
    if (respawnGravity < 0) {
        player.classList.add("upsideDown");
    } else {
        player.classList.remove("upsideDown");
    }
    gravitySwaps = respawnGravitySwaps;
    player.style.animation = "none";
    dead = false;
    ctx.clearRect(0, 0, game.width, game.height);
    levelStars = 0;
    game.innerHTML = "";
    blocks = [];
    jumps = levelJumps;
    airJumps = levelAirJumps;
    setJumps();
    x = spawnX * 50;
    y = spawnY * 50;
    keys = [false, false, false];
    sx = 0;
    sy = 0;
    for (var i = 4; i < levels[level].length; i++) {
        for (var j = 0; j < levels[level][i].length; j++) {
            if (levels[level][i][j] == "g") {
                g.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "d") {
                d.place(j * 50, i * 50);
            }

            if (levels[level][i][j] == "p") {
                x = j * 50;
                y = i * 50;
            }
            if (levels[level][i][j] == "e") {
                e.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "c") {
                c.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "j") {
                ub.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "f") {
                ua.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "s") {
                s.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "^") {
                sss.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "b") {
                ccc.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "h") {
                h.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "v") {
                u.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "[") {
                gtl.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "]") {
                gtr.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == ")") {
                tlgd.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "{") {
                rfgb.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "}") {
                lfgb.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "(") {
                trgd.place(j * 50, i * 50);
            }
        }
    }
    
    partical.place(x + 50, y, 0, 0);
}
setLevel();
function setJumps() {
    jumpCounter.innerHTML = jumps;
    airJumpCounter.innerHTML = airJumps;
    starCounter.innerHTML = stars + levelStars;
}
function checkCollision(oX, oY, oW, oH, oSX, oSY) {
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].action == "collide") {
            if (
                oX + oW > blocks[i].hx + 1 &&
                oX < blocks[i].hx + blocks[i].hw &&
                oY + oH > blocks[i].hy - oSY &&
                oY + oH < blocks[i].hy + oSY + 1
            ) {
                oY = blocks[i].y - 50;
                oSY = 0;
                if (gravity > 0) {
                    clearTimeout(jumpBufferTimeout);
                    jumpBufferTimeout = undefined;
                    onblock = true;
                    airjumpable = true;
                }
            }
            if (
                oX + oW > blocks[i].hx - oSX + 1 &&
                oX + oW < blocks[i].hx + oSX + 1 &&
                oY < blocks[i].hy + blocks[i].hh &&
                oY + oH > blocks[i].hy
            ) {
                oX = blocks[i].hx - 50;
                oSX = 0;
            }
            if (
                oX < blocks[i].hx + 50 - oSX - 1 &&
                oX > blocks[i].hx + 50 + oSX - 1 &&
                oY < blocks[i].hy + 50 &&
                oY + oH > blocks[i].hy
            ) {
                oX = blocks[i].hx + blocks[i].hw;
                oSX = 0;
            }
            if (
                oX + oW > blocks[i].hx + 1 &&
                oX < blocks[i].hx + blocks[i].hw &&
                oY > blocks[i].hy + blocks[i].hh + oSY - 2 &&
                oY < blocks[i].hy + blocks[i].hh - oSY - 1
            ) {
                oSY = 0;
                oY = blocks[i].hy + blocks[i].hh;
                if (gravity < 0) {
                    clearTimeout(jumpBufferTimeout);
                    jumpBufferTimeout = undefined;
                    onblock = true;
                    airjumpable = true;
                }
            }
        }
        if (blocks[i].action == "collapse") {
            if (
                x + 50 > blocks[i].hx + 1 &&
                x < blocks[i].hx + blocks[i].hw &&
                y + 50 > blocks[i].hy - sy &&
                y + 50 < blocks[i].hy + sy + 1
            ) {
                y = blocks[i].hy - 50;
                sy = 0;
                if (gravity > 0) {
                    clearTimeout(jumpBufferTimeout);
                    jumpBufferTimeout = undefined;
                    onblock = true;
                    airjumpable = true;
                }
                ctx.clearRect(blocks[i].x, blocks[i].y, 50, 50);
                let currentPlatform = fallingPlatform.cloneNode(true);
                blocks[i].action = "collide";
                document.body.appendChild(currentPlatform);
                currentPlatform.style.left = blocks[i].x + "px";
                currentPlatform.style.top = blocks[i].y + "px";
                currentPlatform.style.display = "block";
                currentPlatform.style.animation =
                    "collapse 1s ease-out forwards";
                let num = i;
                console.log(blocks[i]);
                setTimeout(() => {
                    blocks[num].action = NaN;
                }, 900);
                setTimeout(function () {
                    currentPlatform.style.animation = "none";
                    currentPlatform.style.display = "none";
                }, 1000);
            }
            if (
                x + 50 > blocks[i].hx - sx + 1 &&
                x + 50 < blocks[i].hx + sx + 1 &&
                y < blocks[i].hy + blocks[i].hh &&
                y + 50 > blocks[i].hy
            ) {
                x = blocks[i].hx - 50;
                sx = 0;
                ctx.clearRect(blocks[i].x, blocks[i].y, 50, 50);
                let currentPlatform = fallingPlatform.cloneNode(true);
                blocks[i].action = "collide";
                document.body.appendChild(currentPlatform);
                currentPlatform.style.left = blocks[i].x + "px";
                currentPlatform.style.top = blocks[i].y + "px";
                currentPlatform.style.display = "block";
                currentPlatform.style.animation =
                    "collapse 1s ease-out forwards";
                let num = i;
                console.log(blocks[i]);
                setTimeout(() => {
                    blocks[num].action = NaN;
                }, 900);
                setTimeout(function () {
                    currentPlatform.style.animation = "none";
                    currentPlatform.style.display = "none";
                }, 1000);
            }
            if (
                x < blocks[i].hx + blocks[i].hw - sx - 1 &&
                x > blocks[i].hx + blocks[i].hw + sx - 1 &&
                y < blocks[i].hy + blocks[i].hh &&
                y + 50 > blocks[i].hy
            ) {
                x = blocks[i].hx + blocks[i].hw;
                sx = 0;
                ctx.clearRect(blocks[i].x, blocks[i].y, 50, 50);
                let currentPlatform = fallingPlatform.cloneNode(true);
                blocks[i].action = "collide";
                document.body.appendChild(currentPlatform);
                currentPlatform.style.left = blocks[i].x + "px";
                currentPlatform.style.top = blocks[i].y + "px";
                currentPlatform.style.display = "block";
                currentPlatform.style.animation =
                    "collapse 1s ease-out forwards";
                let num = i;
                console.log(blocks[i]);
                setTimeout(() => {
                    blocks[num].action = NaN;
                }, 900);
                setTimeout(function () {
                    currentPlatform.style.animation = "none";
                    currentPlatform.style.display = "none";
                }, 1000);
            }
            if (
                x + 50 > blocks[i].hx + 1 &&
                x < blocks[i].hx + blocks[i].hw &&
                y > blocks[i].hy + blocks[i].hh + sy - 2 &&
                y < blocks[i].hy + blocks[i].hh - sy - 1
            ) {
                sy = 0;
                y = blocks[i].hy + blocks[i].hh;
                ctx.clearRect(blocks[i].x, blocks[i].y, 50, 50);
                let currentPlatform = fallingPlatform.cloneNode(true);
                blocks[i].action = "collide";
                document.body.appendChild(currentPlatform);
                currentPlatform.style.left = blocks[i].x + "px";
                currentPlatform.style.top = blocks[i].y + "px";
                currentPlatform.style.display = "block";
                currentPlatform.style.animation =
                    "collapse 1s ease-out forwards";
                let num = i;
                console.log(blocks[i]);
                setTimeout(() => {
                    blocks[num].action = NaN;
                }, 900);
                setTimeout(function () {
                    document.body.removeChild(currentPlatform);
                }, 1000);
                if (gravity < 0) {
                    clearTimeout(jumpBufferTimeout);
                    jumpBufferTimeout = undefined;
                    onblock = true;
                    airjumpable = true;
                }
            }
        }
        if (blocks[i].action == "kill" && !dead) {
            if (
                x < blocks[i].hx + blocks[i].hw &&
                x + 50 > blocks[i].hx &&
                y < blocks[i].hy + blocks[i].hw &&
                y + 50 > blocks[i].hy
            ) {
                setTimeout(function () {
                    setLevel();
                }, 1000);
                dead = true;
                sx = 0;
                sy = 0;
                keys = [false, false, false];
                player.style.animation = "death 1s ease-out";
            }
        }
        if (blocks[i].action == "win") {
            if (
                x < blocks[i].hx + blocks[i].hw &&
                x + 50 > blocks[i].hx &&
                y < blocks[i].hy + blocks[i].hh &&
                y + 50 > blocks[i].hy
            ) {
                level++;
                stars += levelStars;
                levelStars = 0;
                if (levels[level]) {
                    spawnX = levels[level][2];
                    spawnY = levels[level][3] + 4;
                    levelJumps = levels[level][0];
                    levelAirJumps = levels[level][1];
                    setLevel();
                    resizeGame();
                } else {
                    var winScreen = document.getElementById("win-screen");
                    winScreen.style.display = "flex";
                    var h3 = document.createElement("h3");
                    if (stars > 0) {
                        h3.innerText = `And you have ${stars} of ${levels.length} stars!`;
                        winScreen.appendChild(h3);
                    }
                    level = 0;
                    spawnX = levels[level][2];
                    spawnY = levels[level][3] + 4;
                    jumps = Infinity;
                    airJumps = Infinity;
                    setLevel();
                    won = true;
                }
            }
        }
        if (blocks[i].action == "checkpoint") {
            if (
                x < blocks[i].hx + blocks[i].hw &&
                x + blocks[i].hh > blocks[i].hx &&
                y < blocks[i].hy + blocks[i].hh &&
                y + 50 > blocks[i].hy
            ) {
                spawnX = blocks[i].x / 50;
                spawnY = blocks[i].y / 50;
                cc.place(blocks[i].x, blocks[i].y);
                blocks[i].action = NaN;
                levelJumps = jumps;
                levelAirJumps = airJumps;
                respawnGravity = gravity;
                respawnGravitySwaps = gravitySwaps;
            }
        }
        if (blocks[i].action == "addjump") {
            if (
                x < blocks[i].hx + blocks[i].hw &&
                x + blocks[i].hh > blocks[i].hx &&
                y < blocks[i].hy + blocks[i].hh &&
                y + 50 > blocks[i].hy
            ) {
                if (jumps == 0 && airJumps == 0) {
                    keys[2] = false;
                }
                jumps++;
                setJumps();
                blocks[i].action = NaN;
                ctx.clearRect(blocks[i].x, blocks[i].y, 50, 50);
                let currentPlatform = jumpAnimation.cloneNode(true);
                document.body.appendChild(currentPlatform);
                currentPlatform.style.display = "block";
                currentPlatform.style.left = blocks[i].x + "px";
                currentPlatform.style.top = blocks[i].y + "px";
                currentPlatform.style.animation =
                    "collect 0.25s ease-out forwards";
                setTimeout(function () {
                    document.body.removeChild(currentPlatform);
                }, 250);
            }
        }
        if (blocks[i].action == "addairjump") {
            if (
                x < blocks[i].hx + blocks[i].hw &&
                x + blocks[i].hh > blocks[i].hx &&
                y < blocks[i].hy + blocks[i].hh &&
                y + 50 > blocks[i].hy
            ) {
                if (airJumps == 0) {
                    keys[2] = false;
                }
                airJumps++;
                setJumps();
                blocks[i].action = NaN;
                ctx.clearRect(blocks[i].x, blocks[i].y, 50, 50);
                let currentPlatform = airJumpAnimation.cloneNode(true);
                document.body.appendChild(currentPlatform);
                currentPlatform.style.display = "block";
                currentPlatform.style.left = blocks[i].x + "px";
                currentPlatform.style.top = blocks[i].y + "px";
                currentPlatform.style.animation =
                    "collect 0.25s ease-out forwards";
                setTimeout(function () {
                    document.body.removeChild(currentPlatform);
                }, 250);
            }
        }
        if (blocks[i].action == "addstar") {
            if (
                x < blocks[i].hx + blocks[i].hw &&
                x + 50 > blocks[i].hx &&
                y < blocks[i].hy + blocks[i].hh &&
                y + 50 > blocks[i].hy
            ) {
                levelStars++;
                blocks[i].action = NaN;
                ctx.clearRect(blocks[i].x, blocks[i].y, 50, 50);
                setJumps();
                let currentPlatform = starAnimation.cloneNode(true);
                document.body.appendChild(currentPlatform);
                currentPlatform.style.display = "block";
                currentPlatform.style.left = blocks[i].x + "px";
                currentPlatform.style.top = blocks[i].y + "px";
                currentPlatform.style.animation =
                    "collectStar 0.25s ease-out forwards";
                setTimeout(function () {
                    document.body.removeChild(currentPlatform);
                }, 250);
            }
        }
        if (blocks[i].action == "gravity") {
            if (
                x < blocks[i].hx + blocks[i].hw &&
                x + blocks[i].hh > blocks[i].hx &&
                y < blocks[i].hy + blocks[i].hh &&
                y + 50 > blocks[i].hy
            ) {
                gravitySwaps++;
                blocks[i].action = NaN;
                ctx.clearRect(blocks[i].x, blocks[i].y, 50, 50);
                let currentPlatform = gravitySwapAnimation.cloneNode(true);
                document.body.appendChild(currentPlatform);
                currentPlatform.style.display = "block";
                currentPlatform.style.left = blocks[i].x + "px";
                currentPlatform.style.top = blocks[i].y + "px";
                currentPlatform.style.animation =
                    "collect 0.25s ease-out forwards";
                setTimeout(function () {
                    document.body.removeChild(currentPlatform);
                }, 250);
            }
        }
    }
    return {
        x: oX,
        y: oY,
        sx: oSX,
        sy: oSY
    };
}
setInterval(function () {
    cameraX += cameraSpeedX;
    cameraY += cameraSpeedY;
    if (cameraX < x) {
        cameraSpeedX = (x - cameraX) / 10;
    } else if (cameraX > x) {
        cameraSpeedX = (x - cameraX) / 10;
    }
    if (cameraY < y) {
        cameraSpeedY = (y - cameraY) / 10;
    } else if (cameraY > y) {
        cameraSpeedY = (y - cameraY) / 10;
    }
    root.style.setProperty(
        "--screenX",
        `${window.innerWidth / 2 - 25 - cameraX}px`,
    );
    root.style.setProperty(
        "--screenY",
        `${window.innerHeight / 2 - 25 - cameraY}px`,
    );
    root.style.setProperty("--playerOffsetX", x - cameraX + "px");
    root.style.setProperty("--playerOffsetY", y - cameraY + "px");
    targetPlayerHeight = 50 + Math.abs(sy) * 1.25 - Math.abs(sx) * 1.25;

    targetHeightSpeed = (targetPlayerHeight - playerHeight) / 3;

    osy = sy;
    heightSpeedChangeSpeed = Math.sign(targetHeightSpeed - heightSpeed);
    heightSpeed += heightSpeedChangeSpeed;
    playerHeight += heightSpeed;
    root.style.setProperty("--playerHeight", playerHeight + "px");
    root.style.setProperty("--nonPxPlayerHeight", playerHeight);
    x += sx;
    y += sy;
    if (!dead) {
        sy += gravity;
    }

    if (keys[0] && sx > -7.5) {
        sx -= 1;
    } else if (sx < 0) {
        sx += 0.5;
    }
    if (keys[1] && sx < 7.5) {
        sx += 1;
    } else if (sx > 0) {
        sx -= 0.5;
    }
    let playerPos = checkCollision(x, y, 50, 50, sx, sy);
    x = playerPos.x;
    y = playerPos.y;
    sx = playerPos.sx;
    sy = playerPos.sy;

    for(var i = 0; i < objects.length; i ++){
        
        playerPos = checkCollision(objects[i].x, objects[i].y, objects[i].w, objects[i].h, objects[i].sx, objects[i].sy);
    }
    if (keys[2]) {
        if (onblock && gravitySwaps == 0) {
            if (jumps > 0) {
                jumps--;
                sy = jumpSpeed;
                airjumpable = false;
                setJumps();
                onblock = false;
                player.classList.add("jump");
                setTimeout(function () {
                    player.classList.remove("jump");
                }, 500);
                setPlayerHeight = true;
                setTimeout(function () {
                    setPlayerHeight = false;
                    root.style.setProperty("--playerHeight", "50px");
                    root.style.setProperty("--nonPxPlayerHeight", "50");
                }, 20);
                for (var i = 0; i < 10; i++) {
                    let found = pool.find((item) => !item.active);
                    found.active = true;
                    let el = found.el;
                    el.style.translate = `calc(var(--screenX) + ${x + 20 + Math.random() * 40 - 20}px) calc(var(--screenY) + ${y + 40 - Math.random() * 10}px)`;
                    el.style.display = "block";
                    el.style.animation = Math.random() + "s fadeOut";
                    el.classList.add("trail");
                    document.body.appendChild(el);
                    el.onanimationend = () => {
                        el.style.display = "none";
                        found.active = false;
                        el.classList.remove("trail");
                    };
                }
            } else if (airJumps > 0) {
                airJumps--;
                sy = jumpSpeed;
                airjumpable = false;
                setJumps();
                onblock = false;
                player.classList.add("jump");
                setTimeout(function () {
                    player.classList.remove("jump");
                }, 500);
                for (var i = 0; i < 10; i++) {
                    let found = pool.find((item) => !item.active);
                    found.active = true;
                    let el = found.el;
                    el.style.translate = `calc(var(--screenX) + ${x + 20 + Math.random() * 40 - 20}px) calc(var(--screenY) + ${y + 40 - Math.random() * 10}px)`;
                    el.style.display = "block";
                    el.style.animation = Math.random() + "s fadeOut";
                    el.classList.add("trail");
                    document.body.appendChild(el);
                    el.onanimationend = () => {
                        el.style.display = "none";
                        found.active = false;
                        el.classList.remove("trail");
                    };
                }
            }
        } else if (airJumps > 0 && airjumpable && gravitySwaps == 0) {
            airJumps--;
            sy = jumpSpeed;
            airjumpable = false;
            setJumps();
            onblock = false;
            player.classList.add("jump");
            setTimeout(function () {
                player.classList.remove("jump");
            }, 500);
        } else if (gravitySwaps > 0 && airjumpable) {
            gravity = 0 - gravity;
            jumpSpeed = 0 - jumpSpeed;
            gravitySwaps--;
            onblock = false;
            if (jumpSpeed > 0) {
                player.classList.add("upsideDown");
            } else {
                player.classList.remove("upsideDown");
            }
            airjumpable = false;
        }
    } else {
        if (!jumpBufferTimeout) {
            jumpBufferTimeout = setTimeout(function () {
                onblock = false;
            }, 100);
        }
    }
    if ((y > levels[level].length * 50 + 500 && !dead) || y < -500) {
        player.style.animation = "death 1s ease-out";
        sx = 0;
        sy = 0;
        dead = true;
        keys = [false, false, false];
        setTimeout(function () {
            setLevel();
        }, 1000);
        y = levels[level].length * 50 + 500;
    }
}, 1000 / 60);
function repeatTimes(func, times, speed = 1000 / 60) {
    let timesLeft = times;
    let interval = setInterval(function () {
        if (timesLeft > 0) {
            func();
            timesLeft--;
        } else {
            clearInterval(interval);
        }
    }, speed);
}
let backgrounds = document.getElementsByClassName("background");
for (let background of backgrounds) {
    let speed = parseFloat(background.getAttribute("move"));
    background.speed = speed;
    background.style.width =
        (levels[level][4].length * 50) / speed +
        window.innerWidth +
        2000 +
        "px";
}
setInterval(function () {
    for (let background of backgrounds) {
        background.style.transform = `translate(${0 - cameraX / background.speed}px, ${(levels[level].length * 50 + 500) / 2 - cameraY / 2}px)`;
    }
}, 1000 / 60);
let pool = [];
for (var i = 0; i < 101; i++) {
    let div = document.createElement("div");
    pool[pool.length] = {
        el: div,
        active: false,
    };
}
setInterval(function () {
    if (onblock) {
        let found = pool.find((item) => !item.active);
        found.active = true;
        let el = found.el;
        el.style.translate = `calc(var(--screenX) + ${x + 20 + Math.random() * 40 - 20}px) calc(var(--screenY) + ${y + 40 - Math.random() * 10}px)`;
        el.style.display = "block";
        el.style.animation = Math.random() + "s fadeOut";
        el.classList.add("trail");
        document.body.appendChild(el);
        el.onanimationend = () => {
            el.style.display = "none";
            found.active = false;
            el.classList.remove("trail");
        };
    }
}, 30);
