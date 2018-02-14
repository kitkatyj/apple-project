var canvas, ctx = null;
var frameCounter = true;
var frameCount = 0;
var pixelFactor = 2;

var sprites = [];
var main, applePlayer = null;

function Game(){
    this.setPlayer = function(data){
        applePlayer = new Player(data);
    }
    this.addSprite = function(data){
        var tempSprite = new Sprite(data);
        sprites.push(tempSprite);
    }
};

function Sprite(data = {}){
    this.player = false;
    
    this.xPos = data.xPos || 0;
    this.yPos = data.yPos || 0;
    this.width = data.width;
    this.height = data.height;
    this.src = data.src;
    this.totalFrames = data.totalFrames;
    this.framesPerRow = data.framesPerRow;
    this.speed = data.speed || 1/12;
    
    var imgTemp = new Image();
    imgTemp.src = data.src;
    
    this.img = imgTemp;
}

function Player(data = {}){
    Sprite.call(this,data);
    this.orientation = data.orientation || 'front';
    this.action = data.action || 'normal';
    this.player = true;
    this.frameCount = data.frameCount;
    this.orientationFrames = data.orientationFrames;
    
    var thisPlayer = this;
    
    document.addEventListener("keydown",function(e){
        if(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey){
            return false;
        }
        thisPlayer.action = 'walking';
        
        // left, up, right, down
        if(e.keyCode === 37){
            thisPlayer.orientation = 'left';
        }
        else if(e.keyCode === 38){
            thisPlayer.orientation = 'back';
        }
        else if(e.keyCode === 39){
            thisPlayer.orientation = 'right';
        }
        else if(e.keyCode === 40){
            thisPlayer.orientation = 'front';
        }
    });
    
    document.addEventListener("keyup",function(e){
        thisPlayer.action = 'normal';
    });
}

function init(){
    canvas = document.getElementById('main');
    ctx = canvas.getContext('2d');
    
    canvas.style.width = canvas.width+"px";
    canvas.style.height = canvas.height+"px";
    canvas.width = canvas.width/pixelFactor;
    canvas.height = canvas.height/pixelFactor;
    
    main = new Game();
    main.setPlayer({
        'xPos':canvas.width/2,
        'yPos':canvas.height/2,
        'width':29,
        'height':52,
        'src':'_res/apple.png',
        'frameCount':0,
        'totalFrames':16,
        'framesPerRow':4,
        'speed':1/12,
        'orientation':'left',
        'orientationFrames':{
            'front':[0,3],
            'left':[4,7],
            'right':[8,11],
            'back':[12,15],
            'frontStill':1,
            'leftStill':5,
            'rightStill':9,
            'backStill':13
        }
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
    
    // animate sprites
    sprites.forEach(function(sprite){
        drawSprite(sprite);
    });
    
    if(applePlayer.action === 'walking'){
        switch(applePlayer.orientation){
            case 'left':
                applePlayer.xPos--;
                break;
            case 'right':
                applePlayer.xPos++;
                break;
        }
    }
    
    // animate player
    drawSprite(applePlayer);
    
    window.requestAnimationFrame(draw);
}

function drawSprite(sprite){    
    var frameIndex = Math.floor(frameCount * sprite.speed) % sprite.totalFrames;
    
    if(sprite.player){
        switch(sprite.action){
            case 'normal':
                frameIndex = eval('sprite.orientationFrames.'+sprite.orientation+'Still');
                sprite.frameCount = 0;
                break;
            case 'walking':
                frameIndex = Math.floor(sprite.frameCount * sprite.speed) % sprite.totalFrames;
                var totalFramesTemp = eval('sprite.orientationFrames.'+sprite.orientation+'[1] - sprite.orientationFrames.'+sprite.orientation+'[0] + 1');
                var startingFrame = eval('sprite.orientationFrames.'+sprite.orientation+'[0]');
                frameIndex = startingFrame + frameIndex % totalFramesTemp;
                sprite.frameCount++;
                break;
        }
    }
    
    var rows = Math.floor(sprite.totalFrames / sprite.framesPerRow);
    var frameStartX = (frameIndex % sprite.framesPerRow) * sprite.width;
    var frameStartY = (Math.floor(frameIndex / sprite.framesPerRow) % rows) * sprite.height;
    
    ctx.drawImage(sprite.img,frameStartX,frameStartY,sprite.width,sprite.height,sprite.xPos,sprite.yPos,sprite.width,sprite.height);
}

function paintBg(color){
    ctx.beginPath();
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = color;
    ctx.fill();
}

window.onload = init;