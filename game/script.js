var jumps = 10;
var airJumps = 0;
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
var levelStars = 0;
var won = false;
var stars = 0;
var levelJumps = 0;
var levelAirJumps = 0;
function Block(colour, action = NaN){
    this.colour = colour;
    this.action = action;
    
    this.place = function(bx, by){
        let image = new Image();
        image.src = this.colour;
        image.onload = function(){
            ctx.drawImage(image, bx, by, 50, 50);
        }
        blocks[blocks.length] = {
            x: bx,
            y: by,
            action: this.action
        };
    }
}
var a = new Block("transparent");
var g = new Block("/grass-block.png", "collide");
var d = new Block("/dirt-block.png", "collide");
var l = new Block("/lava.png", "kill");
var e = new Block("/finish.png", "win");
var c = new Block("/unchecked-checkpoint.png", "checkpoint");
var cc = new Block("/checked-checkpoint.png");
var ub = new Block("/unchecked-jump.png", "addjump");
var cb = new Block("/checked-jump.png");
var ua = new Block("/unchecked-airjump.png", "addairjump");
var ca = new Block("/checked-airjump.png");
var s = new Block("/star.png", "addstar");
var cs = new Block("/checked-star.png");

var levels = [
    [
        2,
        3,
        1,
        1,
        "aaaaaaaaaae",
        "aaaaaaggggg",
        "ggggggddddd",
        "aadddddddaa",
        "aaadddddaaa",
        "aaaaaaddaaa",
        "aaaaasdaaaa",
        "aaaadddaaaa",
        "aaaadddaaaa",
        "aaaaadaaaaa",
        "aaaaadaaaaa",
        "aaaaadaaaaa"
    ],
    [
        1,
        1,
        1,
        18,
        "aaasaaaaaaaaaaa",
        "aggggaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "afaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "aafaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaa",
        "jaaggggaaaaaaaa",
        "gggdaaaaaaaaaae",
        "daaaaaaaaaggggg",
        "dggggaaaaaddddd",
        "adddaaaaaaaddaa",
        "adddaaaaaaaadaa",
        "aaddaaaaaaaadaa",
        "aadaaaaaaaaaaaa",
        "aadaaaaaaaaaaaa"
    ],
    [
        4,
        0,
        0,
        0,
        "aaaaaaaaaaaaaa",
        "glllglllglllge",
        "dddddddddddddg",
        "adddddddddddaa",
        "addddddddddaaa",
        "aadddddddddaaa",
        "aaadddddddaaaa",
        "aaaaaafdddaaaa",
        "aaaaaddaaaaaa",
        "aaaaddddaaaaaa",
        "aaaaddddaaaaaa",
        "aaasaffffffaaa",
        "aaaaaddddddddd",
        "aaaaadaaaaaaaa",
        "aaaaadaaaaaaaa",
        "aaaaadaaaaaaaa",
        "aaaaadaaaaaaaa"
    ],
    [
        5,
        3,
        0,
        3,
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaacaaaaaaaaaaaaaaaae",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaggaaaaaaaaaaaaaaagg",
        "aaaaaaaaaaaaaaaaaaaaagaaaaaaaaaadaaaaaaaaaaaaaaad",
        "aaaaaaaaagaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaad",
        "gaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaafd",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaajd",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadggglllggglllgggd",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddddddd",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaffffaaasaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafaagaagggggggaaaaa",
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
        "aaaaddddggggdaaaaadgggjdaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad",
        "aaaaaddaaaaffaaaaaaaaddd",
        "aaaaaadaaaaaaaaaaaaaaadd",
        "glllgajaaaaaaaaacaaaggddaaaaaaaaaaaaaaaaaaaf",
        "dddddgggglllllgggggadaad",
        "aaaaaaaadddddddaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaj",
        "aaaaaaaaaaaaaaaaaaaaaagdaaaaaaaaaaaaaggg",
        "aaaaaaaaaaaaaaaaaaaaaaddaaaaaaaaaaaaaad",
        "aaaaaaaaaaaaaaaaaaaaaadd",
        "aaaaaaaaaaaaaaaaaaaaaadd",
        "aaaaaaaaaaaaaaaaaaaaaadd",
        "aaaaaaaaaaaaaaaaaaaaaadd",
        "aaaaaaafaaaaaaaaaaafaadd",
        "aaaaaaaaaaaaafaaaaaaaaddaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaaaaddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaag",
        "aaaaglllllgaaaaaglllllddaaaaaaaaaaaaaaaaaaaaaaaajfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagdg",
        "aaaadddddddllllldddddddaaaaaaaaaaaaaaaaaaaaaaaaagggaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagdddg",
        "aaaaaaaajfdddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad",
        "aaaaaacaaaaaaaaaaaaaaaaaaaaaaaaaaajfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasfffffffffffffffad",
        "aaaaggggaaaaaaaaaajgggggaaaaaaaagggggaaaaaaaaaaaaaaaaaaaaaaaaafaaaaaafaaaaaafaaaaafaaaaagggggggggggggggggd",
        "aaaaddddgggggggggggdddd"
    ]
    
];
function resizeGame(){
    let largest = 0;
    for(var i = 4; i < levels[level].length; i ++){
        if(levels[level][i].length > largest){
            largest = levels[level][i].length;
        }
    }
    game.width = largest * 50;
    game.height = (levels[level].length) * 50;
}
resizeGame();
spawnX = levels[level][2];
spawnY = levels[level][3] + 4;
levelJumps = levels[level][0];
levelAirJumps = levels[level][1];
document.addEventListener("keydown", function(e){
    if(e.key == "ArrowLeft" && !won){
        keys[0] = true;
        document.getElementById("player").style.scale = "-1 1";
        
    }
});
document.addEventListener("keydown", function(e){
    if(e.key == "ArrowRight" && !won){
        keys[1] = true;
        document.getElementById("player").style.scale = "1 1";
    }
});
document.addEventListener("keydown", function(e){
    if(e.key == "ArrowUp" && !won){
        keys[2] = true;
        checkCollision();
    }
});
document.addEventListener("keyup", function(e){
    if(e.key == "ArrowLeft" && !won){
        keys[0] = false;
    }
});
document.addEventListener("keyup", function(e){
    if(e.key == "ArrowRight" && !won){
        keys[1] = false;
    }
});
document.addEventListener("keyup", function(e){
    if(e.key == "ArrowUp" && !won){
        keys[2] = false;
        airjumpable = true;
    }
});
document.addEventListener("keydown", function(e){
    if(e.key == "r" && !won){
        if(x / 50 == spawnX && y / 50 == spawnY){
            spawnX = levels[level][2];
            spawnY = levels[level][3] + 4;
            levelJumps = levels[level][0];
            levelAirJumps = levels[level][1];
        }
        console.log(spawnX, x);
        setLevel();
    }
});
function setLevel(){
    ctx.clearRect(0, 0, game.width, game.height);
    levelStars = 0;
    game.innerHTML = "";
    blocks = [];
    jumps = levelJumps;
    airJumps = levelAirJumps;
    setJumps();
    x = spawnX*50;
    y = spawnY*50 ;
    console.log(spawnY);
    for(var i = 4; i < levels[level].length; i ++){
        for(var j = 0; j < levels[level][i].length; j ++){
            if(levels[level][i][j] == "g"){
                g.place(j * 50, i * 50);
            }
            if(levels[level][i][j] == "d"){
                d.place(j * 50, i * 50);
            }
            if(levels[level][i][j] == "l"){
                l.place(j*50, i*50);
            }
            if(levels[level][i][j] == "p"){
                x = j*50;
                y = i*50;
            }
            if(levels[level][i][j] == "e"){
                e.place(j*50, i*50);
            }
            if(levels[level][i][j] == "c"){
                c.place(j*50, i*50);
            }
            if(levels[level][i][j] == "j"){
                ub.place(j*50, i*50);
            }
            if(levels[level][i][j] == "f"){
                ua.place(j*50, i*50);
            }
            if(levels[level][i][j] == "s"){
                s.place(j*50, i*50);
            }
        }
    }
}
setLevel();
function setJumps(){
    jumpCounter.innerHTML = jumps;
    airJumpCounter.innerHTML = airJumps;
    starCounter.innerHTML = stars + levelStars;
}
function checkCollision(){
    for(var i = 0; i < blocks.length; i ++){
        if(blocks[i].action == "collide"){
            if(x + 50 > blocks[i].x + 1 && x < blocks[i].x + 49 && y + 50 > blocks[i].y - 10 && y + 50 < blocks[i].y + sy + 1){
                y = blocks[i].y - 50;
                sy = 0;
                onblock = true;
                airjumpable = true;    
            }
            if(x + 50 > blocks[i].x - sx + 1 && x + 50 < blocks[i].x + sx + 1 && y < blocks[i].y + 50 && y + 50 > blocks[i].y){
                x = blocks[i].x - 50;
                sx = 0;
            }
            if(x < blocks[i].x + 50 - sx - 1 && x > blocks[i].x + 50 + sx - 1 && y < blocks[i].y + 50 && y + 50 > blocks[i].y){
                x = blocks[i].x + 50;
                sx = 0;
            }
            if(x + 50 > blocks[i].x + 1 && x < blocks[i].x + 49 && y > blocks[i].y + 50 + sy - 2 && y < blocks[i].y + 50 - sy - 1){
                sy = 0;
                y = blocks[i].y + 50;
            }
        }
        if(blocks[i].action == "kill"){
            if(x < blocks[i].x + 50 && x + 50 > blocks[i].x && y < blocks[i].y + 50 && y + 50 > blocks[i].y){
                setLevel();
            }
        }
        if(blocks[i].action == "win"){
            if(x < blocks[i].x + 50 && x + 50 > blocks[i].x && y < blocks[i].y + 50 && y + 50 > blocks[i].y){
                level ++;
                stars += levelStars;
                levelStars = 0;
                if(levels[level]){
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
                    if(stars > 0){
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
        if(blocks[i].action == "checkpoint"){
            if(x < blocks[i].x + 50 && x + 50 > blocks[i].x && y < blocks[i].y + 50 && y + 50 > blocks[i].y){
                spawnX = blocks[i].x / 50;
                spawnY = blocks[i].y / 50;
                cc.place(blocks[i].x, blocks[i].y);
                blocks[i].action = NaN;
                levelJumps = jumps;
                levelAirJumps = airJumps;
            }
        }
        if(blocks[i].action == "addjump"){
            if(x < blocks[i].x + 50 && x + 50 > blocks[i].x && y < blocks[i].y + 50 && y + 50 > blocks[i].y){
                jumps ++;
                setJumps();
                blocks[i].action = NaN;
                cb.place(blocks[i].x, blocks[i].y);
            }
        }
        if(blocks[i].action == "addairjump"){
            if(x < blocks[i].x + 50 && x + 50 > blocks[i].x && y < blocks[i].y + 50 && y + 50 > blocks[i].y){
                airJumps ++;
                setJumps();
                blocks[i].action = NaN;
                ca.place(blocks[i].x, blocks[i].y);
            }
        }
        if(blocks[i].action == "addstar"){
            if(x < blocks[i].x + 50 && x + 50 > blocks[i].x && y < blocks[i].y + 50 && y + 50 > blocks[i].y){
                levelStars ++;
                blocks[i].action = NaN;
                cs.place(blocks[i].x, blocks[i].y);
                setJumps();
            }
        }
    }
}
setInterval(function(){
    game.style.transform = `translate3d(${window.innerWidth / 2 - 25 - x}px, ${window.innerHeight / 2 - 25 - y}px, 0)`

    x += sx;
    y += sy;
    sy += gravity;
    if(keys[0] && sx > -7.5){
        sx -= 1;
    } else if(sx < 0) {
        sx += 0.5;
    }
    if(keys[1] && sx < 7.5){
        sx += 1;
    } else if(sx > 0){
        sx -= 0.5;
    }
    checkCollision();
    if(keys[2]){
        if(onblock){
            if(jumps > 0){
                jumps --;
                sy = -30;
                airjumpable = false;
                setJumps();
                onblock = false;
            }
            else if(airJumps > 0){
                airJumps --;
                sy = -30;
                airjumpable = false;
                setJumps();
                onblock = false;
            }
        } else if(airJumps > 0 && airjumpable) {
            airJumps --;
            sy = -30;
            airjumpable = false;
            setJumps();
            onblock = false;
        }
    } else {
        onblock = false;
    }
    if(y > levels[level].length * 50 + 500){
        setLevel();
    }
}, 1000/60);