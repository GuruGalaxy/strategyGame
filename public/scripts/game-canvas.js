var fieldSize = 15;
var canvasSize = 600;

function drawField(context, x, y, field){
    context.strokeStyle = 'orange';
    context.fillStyle = 'orange';

    switch(field.type){
        case tileTypes.TYPES.MOUNTAIN : {
            context.fillRect(x, y, fieldSize, fieldSize);
            break;
        }
        case tileTypes.TYPES.FIELD : {
            break;
        }
        case tileTypes.TYPES.CITY : {
            context.beginPath();
            context.arc(x + fieldSize / 2, y + fieldSize / 2, fieldSize / 2, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            break;
        }
        case tileTypes.TYPES.CAPITAL : {
            context.strokeStyle = 'white';
            context.fillStyle = 'white';
            context.beginPath();
            context.arc(x + fieldSize / 2, y + fieldSize / 2, fieldSize / 2, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            break;
        }
    }

    if(field.army)
    {
        // TODO draw army count
    }
}

function drawActiveField(context, field){
    context.strokeStyle = 'white';
    context.setLineDash([0,0]);
    context.lineWidth = 3;

    context.rect((field.x - 1) * fieldSize, (field.y - 1) * fieldSize, fieldSize, fieldSize);
    context.stroke();
}

function prepareCanvas(canvas, context, config){console.log("prepareCanvas");
    fieldSize = canvasSize / config.mapSize;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    //context.transform(1, 0, 0, -1, 0, canvas.height)
}

function prepareMap(context, config){console.log("prepareMap");
    context.strokeStyle = 'white';

	for(let i = 0; i <= config.mapSize; i++){
        context.beginPath();
        context.setLineDash([fieldSize / 5, (fieldSize / 5) * 3, fieldSize / 5, 0]);
        context.moveTo(0, (fieldSize * i));
        context.lineTo(fieldSize * config.mapSize, (fieldSize * i));
        context.stroke();
    }

    for(let i = 0; i <= config.mapSize; i++){
        context.beginPath();
        context.setLineDash([fieldSize / 5, (fieldSize / 5) * 3, fieldSize / 5, 0]);
        context.moveTo((fieldSize * i), 0);
        context.lineTo((fieldSize * i), fieldSize * config.mapSize);
        context.stroke();
    }
}

function renderFields(context, config, game){
    console.log("context, game", context, game);
    for(let col = 1; col <= config.mapSize; col++)
    {
        for(let row = 1; row <= config.mapSize; row++)
        {
            drawField(context, (col - 1) * fieldSize, (row - 1) * fieldSize, game.map.fields[col][row]);
        }
    }
}