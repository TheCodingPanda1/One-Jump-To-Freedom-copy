var root = document.documentElement;
var jumps = 10;
var airJumps = 0;
var jumpAnimation = document.getElementById("getJump");
var airJumpAnimation = document.getElementById("getAirJump");
var starAnimation = document.getElementById("getStar");
var jumpCounter = document.getElementById("numberOfJumps");
var airJumpCounter = document.getElementById("numberOfAirJumps");
var starCounter = document.getElementById("numberOfStars");
var game = document.getElementById("game");
var ctx = game.getContext("2d");
var x = 0;
var y = 0;
var sx = 0;
var sy = 0;
var gravity = 1.5;
var r = "red";
var airjumpable = true;
var keys = [];
var level = 0;
var onblock = false;
var blocks = [];
var spawnX;
var spawnY;
var setPlayerHeight = false;
var dead = false;
var levelStars = 0;
var won = false;
var stars = 0;
var levelJumps = 0;
var levelAirJumps = 0;
var fallingPlatform = document.getElementById("fallingPlatform");
function Block(colour, action = NaN) {
    this.colour = colour;
    this.action = action;

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
        };
    };
}
var a = new Block("transparent");
var g = new Block("../grass-block.png", "collide");
var d = new Block("../dirt-block.png", "collide");
var e = new Block("../finish.png", "win");
var c = new Block("../unchecked-checkpoint.png", "checkpoint");
var cc = new Block("../checked-checkpoint.png");
var ub = new Block("../unchecked-jump.png", "addjump");
var ua = new Block("../unchecked-airjump.png", "addairjump");
var s = new Block("../star.png", "addstar");
var sss = new Block("../Spike.png", "kill");
var ccc = new Block("../Collapsing.png", "collapse");

var levels = [
    [
        7,
        0,
        0,
        11,
        "aaaaaaaaaagggaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaag",
        "aaagggaaaaaddaaaaaaaaaaaaaaaaaaajaaaajaaaajaaaaaad",
        "aaaaaaaaaaadaaaaaaaacaaajggggggggaaaggaaaggaaagaad",
        "aaaaaaaaaaadaaaaaaaggggggdddddaaaaaaaaaaaaaaaaddad",
        "aaaaaaaaaaaaaaaaaaaaadddddddaaaaaaaaaaaaaaaaaadaad",
        "aaaaaaaaaaaaaaaaaaaaaadddddaaaaaaaaaaaaaaaaaaadadd",
        "aaaaaaaaaaaaaaaaaaaaaaaddddaaaaaaaaaaaaaaaaaaadadd",
        "aaaaaaaaaggggaaaaaaaaaadddaaaaaaaaaaaaaaaaaaaadaad",
        "aaagggaaadddaaaaaaaaaaadddaaaaaaaaaaaaaaaaaaaaddad",
        "aaaaddaaaddaaaaaaaaaaaaaddaaaaaaaaaaaaaaaaaaaadaadaaaaaaaaaaaaaaaaaaaaaaaae",
        "aaaadaaaaadaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaadaddaaaaaaaaaaaaaaaaaaaaaaggggg",
        "aaaadaaaaadaaaaaaaaaaaaaadaaaaaaaaaaaaaaafsffadcfaaaaaaaaafaaaaaaaaajaggd",
        "gaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaggggadgggaaaaaagggaaaaaaaagggd",
    ],
    [
        1,
        1,
        1,
        8,
        "aaaaaaaaaaaaaggaaaaaaaaaaaaaaaaaaaaaaaajaaaaaaac",
        "aaaaaaaaaaaafaaaaaaaaaaaaaaaaaaaaaaaaaaggaaaagggggfaaaaaaaajataaaaajttaaajattaaaacjattttj",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddaaaaaddddaaaaaaaaggggaaaaggggaaaggggaaagggggggggtttttae",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaadddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadggggggg",
        "aaaaaaaaaaaafaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaddd",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaajaaaaaaadd",
        "aaaggggaaaaaaaaaaaaaaaaaaaaaaaafaaaaaagggaaaaaad",
        "gggdaaaaaaaajaaaaaaacaaaaaaaaggaaaaaaadddaaaaaad",
        "daaaaaaaaagggttttttggggaaaaaaaaaaaaaaadddaaaaaad",
        "dggggaaaaadddggggggdddaaaaaaaaaaaaaaaaadd",
        "adddaaaaaaadddddddddddaaaaaaaaaaaaaaaaad",
        "adddaaaaaaadaaaaaaaddaaaaaaaaaaaaaaaaaad",
        "aaddaaaaaaadaaaaaaaad",
        "aadaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafsf",
        "aadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaggg",
    ],
    [
        4,
        0,
        0,
        18,
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaajtaaaacj",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaggaaagggaaaaaaj",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbaaaaaaf",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbaaaaaaaaaeaaaaaaaas",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaggaaafaaaggg",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaj",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagg",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaacj",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagg",
        "aaaaaaaaaaaggggggaaaa",
        "gggggggggggdaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaattaaaaajj",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaggabbbbggg",
        "aataataataaaataaaaaaaaaaaaaaaaaaaaaaaaaaaaj",
        "ggggggggggggggaaaaaajaaaacjaajaajaaafaaaajcj",
        "aaaaaaaaaaaaadgggbbbbaaagggaabaabaaabaaaaggg",
        "aaaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaa",
    ],
    [
        5,
        3,
        0,
        4,
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaas",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaacaaaaaaaaaaaaaaaajaaaaajaaaaajaaaaafaaaaaaaacaag",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaggaaaaaaaaaaaaaaaggaaaaabaaaaabaaaaabaaaaaaagggadaaaaaaaaajaaaaaaac",
        "aaaaaaaaaaaaaaaaaaaaagaaaaaaaaaadaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaadadaaaaaaaabbbaaaaaggg",
        "aaaaaaaaagaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaadad",
        "gaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaafdaaaaaaaaaaaaaaaaaaaaaaaaaaaadad",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaadad",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaadadaaaaaaaaaj",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaadadaaaaaaaabbb",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaadad",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaadad",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaajdaaaaaaaaaaaaaaaaaaaaaaaaaaaadad",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadgggtttgggtttgggdaaaaaaaaaaaaaaaaaaaaaaaaaaaadafaaaaaaaaaj",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddgggdddgggddddaaaaaaaaaaaaaaaaaaaaaaaaaaaadggaaaaaaaabbb",
    ],
    [
        1,
        0,
        6,
        4,
        "aaaaaaagggggjaaaaaaaaaag",
        "aaaaaggdaaadggaaaaaaaaad",
        "aaaagdaaaaaaadgaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaag",
        "aaaadaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagd",
        "aaaadgaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagddggg",
        "aaaaddggaaaagggggggajaadaaaaaaaaaaaaaaaaaaaaaaaagggaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadd",
        "aaaaadddggggdaaaaadgggjdaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad",
        "aaaaaddaaaaaaaaaaaaaaddd",
        "aaaaaadaaafafaaaaaaaaadd",
        "gtttgajaaaaaaaaacaaaggddaaaaaaaaaaaaaaaaaaaf",
        "dgggdggggtttttgggggaaaad",
        "aaaaaaaadgggggdaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaj",
        "aaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaggg",
        "aaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaagd",
        "aaaaaaafaaaaaaaaaaafaadd",
        "aaaaaaaaaaaaafaaaaaaaaddaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaag",
        "aaaagtttttgaaaaagtttttddaaaaaaaaaaaaaaaaaaaaaaaajfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagdg",
        "aaaadgggggdtttttdgggggdaaaaaaaaaaaaaaaaaaaaaaaaagggaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagdddg",
        "aaaaaaaajfdgggggdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad",
        "aaaaaacaaaaaaaaaaaaaaaaaaaaaaaaaaajfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasfffffffffffffffad",
        "aaaaggggaaaaaaaaaajgggggaaaaaaaagggggaaaaaaaaaaaaaaaaaaaaaaaaafafafafafafafafafafafafaaaagggggggggggggggggd",
        "aaaaddddgggggggggggdddd",
    ],
    [
        4,
        0,
        0,
        2,
        "aaaaaaaaaaaaaaaaaag",
        "aaaaaaaaaaaag",
        "aaaaaag",
        "gaaaaaaaaaaaaaaaaah",
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
    gravity = 1.5;
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
            if (levels[level][i][j] == "l") {
                l.place(j * 50, i * 50);
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
            if (levels[level][i][j] == "t") {
                sss.place(j * 50, i * 50);
            }
            if (levels[level][i][j] == "b") {
                ccc.place(j * 50, i * 50);
            }
        }
    }
}
setLevel();
function setJumps() {
    jumpCounter.innerHTML = jumps;
    airJumpCounter.innerHTML = airJumps;
    starCounter.innerHTML = stars + levelStars;
}
function checkCollision() {
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].action == "collide") {
            if (
                x + 50 > blocks[i].x + 1 &&
                x < blocks[i].x + 49 &&
                y + 50 > blocks[i].y - 10 &&
                y + 50 < blocks[i].y + sy + 1
            ) {
                y = blocks[i].y - 50;
                sy = 0;
                onblock = true;
                airjumpable = true;
            }
            if (
                x + 50 > blocks[i].x - sx + 1 &&
                x + 50 < blocks[i].x + sx + 1 &&
                y < blocks[i].y + 50 &&
                y + 50 > blocks[i].y
            ) {
                x = blocks[i].x - 50;
                sx = 0;
            }
            if (
                x < blocks[i].x + 50 - sx - 1 &&
                x > blocks[i].x + 50 + sx - 1 &&
                y < blocks[i].y + 50 &&
                y + 50 > blocks[i].y
            ) {
                x = blocks[i].x + 50;
                sx = 0;
            }
            if (
                x + 50 > blocks[i].x + 1 &&
                x < blocks[i].x + 49 &&
                y > blocks[i].y + 50 + sy - 2 &&
                y < blocks[i].y + 50 - sy - 1
            ) {
                sy = 0;
                y = blocks[i].y + 50;
            }
        }
        if (blocks[i].action == "collapse") {
            if (
                x + 50 > blocks[i].x + 1 &&
                x < blocks[i].x + 49 &&
                y + 50 > blocks[i].y - 10 &&
                y + 50 < blocks[i].y + sy + 1
            ) {
                y = blocks[i].y - 50;
                sy = 0;
                onblock = true;
                airjumpable = true;
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
                x + 50 > blocks[i].x - sx + 1 &&
                x + 50 < blocks[i].x + sx + 1 &&
                y < blocks[i].y + 50 &&
                y + 50 > blocks[i].y
            ) {
                x = blocks[i].x - 50;
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
                x < blocks[i].x + 50 - sx - 1 &&
                x > blocks[i].x + 50 + sx - 1 &&
                y < blocks[i].y + 50 &&
                y + 50 > blocks[i].y
            ) {
                x = blocks[i].x + 50;
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
                x + 50 > blocks[i].x + 1 &&
                x < blocks[i].x + 49 &&
                y > blocks[i].y + 50 + sy - 2 &&
                y < blocks[i].y + 50 - sy - 1
            ) {
                sy = 0;
                y = blocks[i].y + 50;
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
            }
        }
        if (blocks[i].action == "kill" && !dead) {
            if (
                x < blocks[i].x + 50 &&
                x + 50 > blocks[i].x &&
                y < blocks[i].y + 50 &&
                y + 50 > blocks[i].y
            ) {
                setTimeout(function () {
                    setLevel();
                }, 1000);
                dead = true;
                gravity = 0;
                sx = 0;
                sy = 0;
                keys = [false, false, false];
                player.style.animation = "death 1s ease-out";
            }
        }
        if (blocks[i].action == "win") {
            if (
                x < blocks[i].x + 50 &&
                x + 50 > blocks[i].x &&
                y < blocks[i].y + 50 &&
                y + 50 > blocks[i].y
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
                x < blocks[i].x + 50 &&
                x + 50 > blocks[i].x &&
                y < blocks[i].y + 50 &&
                y + 50 > blocks[i].y
            ) {
                spawnX = blocks[i].x / 50;
                spawnY = blocks[i].y / 50;
                cc.place(blocks[i].x, blocks[i].y);
                blocks[i].action = NaN;
                levelJumps = jumps;
                levelAirJumps = airJumps;
            }
        }
        if (blocks[i].action == "addjump") {
            if (
                x < blocks[i].x + 50 &&
                x + 50 > blocks[i].x &&
                y < blocks[i].y + 50 &&
                y + 50 > blocks[i].y
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
                x < blocks[i].x + 50 &&
                x + 50 > blocks[i].x &&
                y < blocks[i].y + 50 &&
                y + 50 > blocks[i].y
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
                x < blocks[i].x + 50 &&
                x + 50 > blocks[i].x &&
                y < blocks[i].y + 50 &&
                y + 50 > blocks[i].y
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
    }
}
setInterval(function () {
    root.style.setProperty("--x", `${window.innerWidth / 2 - 25 - x}px`);
    root.style.setProperty("--y", `${window.innerHeight / 2 - 25 - y}px`);
    root.style.setProperty("--playerHeight", 50 + Math.abs(sy) * 1.25 - Math.abs(sx) * 1.25 + "px");
    root.style.setProperty("--nonPxPlayerHeight", 50 + Math.abs(sy) * 1.25 - Math.abs(sx) * 1.25);
    x += sx;
    y += sy;
    sy += gravity;
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
    checkCollision();
    if (keys[2]) {
        if (onblock) {
            if (jumps > 0) {
                jumps--;
                sy = -30;
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
            } else if (airJumps > 0) {
                airJumps--;
                sy = -30;
                airjumpable = false;
                setJumps();
                onblock = false;
                player.classList.add("jump");
                setTimeout(function () {
                    player.classList.remove("jump");
                }, 500);
            }
        } else if (airJumps > 0 && airjumpable) {
            airJumps--;
            sy = -30;
            airjumpable = false;
            setJumps();
            onblock = false;
            player.classList.add("jump");
            setTimeout(function () {
                player.classList.remove("jump");
            }, 500);
        }
    } else {
        onblock = false;
    }
    if (y > levels[level].length * 50 + 500 && !dead) {
        player.style.animation = "death 1s ease-out";
        gravity = 0;
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
        background.style.transform = `translate(${0 - x / background.speed}px, ${(levels[level].length * 50 + 500) / 2 - y / 2}px)`;
    }
}, 1000 / 60);
