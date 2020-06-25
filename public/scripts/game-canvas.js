var fieldSize = 15;
var canvasSize = 600;

function drawField(context, users, field){
    context.globalAlpha = 1;
    context.strokeStyle = 'orange';
    context.fillStyle = 'orange';

    let x = (field.x - 1) * fieldSize;
    let y = (field.y - 1) * fieldSize;

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

    // color field if its owned by a user
    if(field.ownerId)
    {
        let owner = users.find((user) => user.id == field.ownerId);

        context.fillStyle = owner.color;
        context.globalAlpha = 0.8;
        context.fillRect(x, y, fieldSize, fieldSize);
    }

    // render army count number on field if it has army
    if(field.army)
    {
        context.fillStyle = 'white';
        context.font = (fieldSize / 3) + 'px PressStart2P';
        if(field.army < 10) context.fillText(field.army, (field.x - 1) * fieldSize + (fieldSize / 4), (field.y - 1) * fieldSize + (fieldSize/1.5));
        else if(field.army < 100) context.fillText(field.army, (field.x - 1) * fieldSize + (fieldSize / 5), (field.y - 1) * fieldSize + (fieldSize/1.5));
        else context.fillText(field.army, (field.x - 1) * fieldSize + (fieldSize / 12), (field.y - 1) * fieldSize + (fieldSize/1.5));
        
    }
}

function drawActiveField(context, field){
    context.globalAlpha = 1;
    context.strokeStyle = 'white';
    context.setLineDash([0,0]);
    context.lineWidth = 3;

    context.rect((field.x - 1) * fieldSize, (field.y - 1) * fieldSize, fieldSize, fieldSize);
    context.stroke();
}

function drawTargetField(context, field){
    context.globalAlpha = 1;
    context.strokeStyle = 'red';
    context.setLineDash([0,0]);
    context.lineWidth = 1;

    context.rect((field.x - 1) * fieldSize, (field.y - 1) * fieldSize, fieldSize, fieldSize);
    context.stroke();
}

function prepareCanvas(canvas, config){console.log("prepareCanvas");
    fieldSize = canvasSize / config.mapSize;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    //context.transform(1, 0, 0, -1, 0, canvas.height)
}

function prepareMap(context, config){console.log("prepareMap");
    context.globalAlpha = 1;
    context.strokeStyle = 'white';
    context.lineWidth = 1;

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

function renderFields(context, config, users, map){
    console.log("renderFields", config, users, map)
    for(let col = 1; col <= config.mapSize; col++)
    {
        for(let row = 1; row <= config.mapSize; row++)
        {
            drawField(context, users, map.fields[col][row]);
        }
    }
}