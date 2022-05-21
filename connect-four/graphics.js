class graphics{
    constructor(background){
        this.background = background;
        console.log("graphics made");
    }



    resetCell(canvas){
        //clear the canvas
        let context = canvas.getContext("2d");
        context.clearRect(0,0,canvas.width, canvas.height);

        //fill the cell with the correct color
        context.beginPath();
        context.arc(canvas.width/2,canvas.height/2,canvas.width/2-2,0,2*Math.PI);
        context.fillStyle = this.background;
        context.strokeStyle = "black";
        context.fill();
        context.restore();
    }

    highlightCell(canvas, highlightColor){
        canvas.style.background = highlightColor;
    }

    unHighlightCell(canvas){
        canvas.style = "blue"
    }

    resetTable(table){
        for(let i = 0; i < table.length; i++){
            let cell = table[i];
            this.resetCell(cell);
        }
    }

    displayAboveTable(canvas, color){
        let context = canvas.getContext('2d');
        context.beginPath();
        context.arc(canvas.width/2,canvas.height/2,canvas.width/2-2,0,2*Math.PI);
        context.fillStyle = color;
        context.strokeStyle = "black";
        context.fill();
        context.restore();
    }

    clearAboveTable(canvas){
        let context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width, canvas.height);
    }

    drawTile(canvas, color){
        let context = canvas.getContext("2d");
        let xcoord = canvas.width/2;
        let ycoord = canvas.height/2;
        let rad = canvas.width/2-2;
        context.fillStyle = color;
        context.strokeStyle = "black";
        context.beginPath();
        context.arc(xcoord,ycoord,rad,0,2*Math.PI);
        context.stroke();
        context.fill();
        context.restore();
    }

    drawArrowLeft(canvas){
        let y = canvas.height;
        let x = canvas.width;
        let context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(5,y/2);
        context.lineTo(x-5,2);
        context.lineTo(x-5,y-2);
        context.fillStyle = "yellow";
        context.stroke();
        context.fill();
        context.restore();
    }

    drawArrowRight(canvas){
        let y = canvas.height;
        let x = canvas.width;
        let context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(x-5,y/2);
        context.lineTo(5,2);
        context.lineTo(5,y-2);
        context.fillStyle = "yellow";
        context.stroke();
        context.fill();
        context.restore();
    }
}