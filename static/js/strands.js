function overlay(glitchedImage, glitchAmount, offset) {
    //var canvas = document.querySelector('#surface');
    var canvas = document.createElement('canvas');
    canvas.width = glitchedImage.width;
    canvas.height = glitchedImage.height;
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var glitchAmount = glitchAmount || 0.8;


    // BORDER -------------------------------------------------------------
    ctx.beginPath();
    var borderThinkness = 5;

    ctx.fillStyle = 'rgb(22, 22, 22)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Cut outs
    ctx.globalCompositeOperation = 'destination-out';

    ctx.fillRect(20, 20, canvasWidth - 40, canvasHeight - 40);

    var boxHeight = 10;
    var rows = Math.ceil(canvasHeight / boxHeight);

    for (var i = 0; i < rows; i++) {
        drawBoxes(i);
    }

    function drawBoxes(row) {
        var boxCount = Math.ceil((100 * glitchAmount) * Math.random());

        for (var i = 0; i < boxCount; i++) {
            var boxWidth = 2 ;
            var rndXPos =  Math.floor(Math.random() * canvasWidth);
            ctx.fillRect(rndXPos, boxHeight * row, boxWidth, boxHeight);
        }
    }

    // STRANDS
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    var MAX_STRANDS = 100;
    var strandCount = MAX_STRANDS * glitchAmount;
    var strandDrawWidth = Math.ceil(canvasWidth * glitchAmount);

    function drawStrands() {
        for (var i = 0; i < strandCount; i++) {
            var rndX = Math.ceil(strandDrawWidth * Math.random()) + (canvasWidth - strandDrawWidth);
            var xPos = Math.ceil(canvasWidth * glitchAmount) + (10 * i);
            var maxHeight = Math.ceil(canvasHeight * glitchAmount) * (i / strandCount);
            drawStrand(rndX, 0, maxHeight);
        }
    }

    function randomSign() {
        return (Math.random() < 0.5) ? -1 : 1;
    }

    function drawStrand(xPos, yPos, maxHeight, rndAmount) {
            rndAmount = rndAmount || 0;
            var rndX = (xPos + (Math.random() * rndAmount) * randomSign());
            var rndY = (yPos + 10 + (Math.random() * 80));

            ctx.moveTo(xPos, yPos);
            ctx.lineTo(rndX, rndY);

            rndAmount += 2;

            if (yPos < maxHeight) {
                drawStrand(rndX, rndY, maxHeight, rndAmount);
            }
    }

    drawStrands();
    ctx.closePath();
    ctx.stroke();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.stroke();
    ctx.drawImage(glitchedImage, 0, 0, 400, 400);
    tvFilter(canvas, glitchAmount, offset);
    return canvas.toDataURL();
}


function tvFilter(canvas, glitchAmount, offset) {
    var ctx = canvas.getContext('2d');
    var imgPixelArray = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var imgData = imgPixelArray.data;

    // Scanlines
    var scanlineDarkness = 50;
    for (var i = 0; i < canvas.height; i++) {
        if (i%2) continue;
        for (var k = 0; k < canvas.width; k++) {
            var index  = ((i * canvas.width) + k) * 4;
            imgData[index] = imgData[index] - scanlineDarkness;
            imgData[index + 1] = imgData[index + 1] - scanlineDarkness;
            imgData[index + 2] = imgData[index + 2] - scanlineDarkness;
        }
    }

    // Bend
    var freq = 300;
    var amp = 100 * (0.2 + glitchAmount/2);
    for (var i = 0; i < canvas.height; i++) {
        // Bounce
        colourShift = Math.round(Math.sin((i + offset)/freq) * amp);
        colourShift *= (colourShift < 0) ? -1 : 1;
        for (var k = 0; k < canvas.width; k++) {
            var index  = ((i * canvas.width) + k) * 4;
            imgData[index] = imgData[index + 4*colourShift];
            imgData[index + 1] = imgData[index + 1 + 4*colourShift];
            imgData[index + 2] = imgData[index + 2 + 4*colourShift];
        }
    }

    // Stutter
    // var stutter = 4;
    // for (var i = 0; i < canvas.height; i++) {
    //     var colourShift = Math.round(stutter * Math.random());
    //     for (var k = 0; k < canvas.width; k++) {
    //         var index  = ((i * canvas.width) + k) * 4;
    //         imgData[index] = imgData[index + 4*colourShift];
    //         imgData[index + 1] = imgData[index + 1 + 4*colourShift];
    //         imgData[index + 2] = imgData[index + 2 + 4*colourShift];
    //     }
    // }
    
    // Colour shift
    var lowerShift = Math.round(10 * (0.1 + glitchAmount));
    var upperShift = Math.round(20 * (0.2 + glitchAmount));
    for (var i = 0; i < canvas.height; i++) {
        var colourShift = (i%2) ? lowerShift : upperShift;
        for (var k = 0; k < canvas.width; k++) {
            var index  = ((i * canvas.width) + k) * 4;
            imgData[index] = imgData[index + 4 * colourShift * 4];
            imgData[index + 1] = imgData[index + 1 + 4 * colourShift];
            imgData[index + 2] = imgData[index + 2 + 4 * colourShift];
        }
    }

    // Tint
    var tintAmount = 10;
    for (var i = 0; i < canvas.height; i++) {
        for (var k = 0; k < canvas.width; k++) {
            var index  = ((i * canvas.width) + k) * 4;
            imgData[index + 1] = imgData[index + 1] + tintAmount;
            imgData[index + 2] = imgData[index + 2] + tintAmount;
        }
    }

    ctx.putImageData(imgPixelArray, 0, 0);
}

