var canvas, ctx = null;
var frameCounter = true;
var frameCount = 0;
var pixelFactor = 2;

var sprites = [];
var main = null;

function Game(){
    this.addSprite = function(data){
        var tempSprite = new Sprite(data.xPos, data.yPos, data.width, data.height, data.src, data.frame, data.totalFrames, data.framesPerRow, data.speed);
        sprites.push(tempSprite);
    }
};

function Sprite(xPos,yPos,width,height,src,frame,totalFrames,framesPerRow,speed){
    this.xPos = xPos || 0;
    this.yPos = yPos || 0;
    this.width = width;
    this.height = height;
    this.src = src;
    this.frame = frame;
    this.totalFrames = totalFrames;
    this.framesPerRow = framesPerRow;
    this.speed = speed || 1/12;
    
    var imgTemp = new Image();
    imgTemp.src = src;
    
    this.img = imgTemp;
}

// function Player(orientation){
//     if(typeof Player.instance === 'object'){
//         return Player.instance;
//     }

//     this.orientation = orientation || 'front';
//     Player.instance = this;
//     return this;
// }

// Player.prototype = new Sprite();

function init(){
    canvas = document.getElementById('main');
    ctx = canvas.getContext('2d');
    
    canvas.style.width = canvas.width+"px";
    canvas.style.height = canvas.height+"px";
    canvas.width = canvas.width/pixelFactor;
    canvas.height = canvas.height/pixelFactor;
    
    main = new Game();
    main.addSprite({
        'xPos':canvas.width/2,
        'yPos':canvas.height/2,
        'width':29,
        'height':52,
        'src':'_res/apple.png',
        'frame':0,
        'totalFrames':12,
        'framesPerRow':3,
        'speed':1/12
    });
    
    window.requestAnimationFrame(draw);
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    paintBg('#200040');
    
    if(frameCounter){
        ctx.font = "bold 16px Courier New";
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.fillText(frameCount,canvas.width,16);
        frameCount++;
    }
    
    drawSprites(sprites);
    
    window.requestAnimationFrame(draw);
}

function drawSprites(spriteArray){
    spriteArray.forEach(function(sprite){
        var rows = Math.floor(sprite.totalFrames / sprite.framesPerRow);
        var frameStartX = (Math.floor(frameCount * sprite.speed) % sprite.framesPerRow) * sprite.width;
        var frameStartY = (Math.floor(Math.floor(frameCount * sprite.speed) / sprite.framesPerRow) % rows) * sprite.height;
        
        ctx.drawImage(sprite.img,frameStartX,frameStartY,sprite.width,sprite.height,sprite.xPos,sprite.yPos,sprite.width,sprite.height);
    });
}

function paintBg(color){
    ctx.beginPath();
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = color;
    ctx.fill();
}

window.onload = init;