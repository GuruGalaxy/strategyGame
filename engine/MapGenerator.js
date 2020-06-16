const Field = require('./Field');
const FieldTypes = require('../shared/engine/field-types');
const Map = require('./Map');

const Seedrandom = require('seedrandom');

function getRndInteger(rng, min, max){
    return Math.floor(rng() * ((max + 1) - min)) + min;
}

class Ant {
    constructor(fieldNumber, citiesNumber){
        this.x = 1;
        this.y = 1;

        this.fieldNumber = fieldNumber;
        this.citiesNumber = citiesNumber;

        this.fieldsLeft = fieldNumber;
        this.citiesLeft = citiesNumber;

        this.isDone = false;

        this.generatedCity = function(){
            this.citiesLeft--;

            if((this.citiesLeft + this.fieldsLeft) == 0)
            {
                this.isDone = true;
            }
        }

        this.generatedField = function(){
            this.fieldsLeft--;

            if((this.citiesLeft + this.fieldsLeft) == 0)
            {
                this.isDone = true;
            }
        }
    }
}

class Crawler {
    constructor(directionX, directionY, startX, startY){
        this.startX = startX;
        this.startY = startY;

        this.directionX = directionX;
        this.directionY = directionY;

        this.isDone = false;
    }
    
}

//
module.exports = {
    // generates map without capitals
    generateMap: function(config) {
        let rng = Seedrandom(config.seed);
        let map = new Map(config.mapSize);

        ants = [];

        let fieldsPerAnt = Math.floor(((config.mapSize * config.mapSize) * (config.mapCoverPercentage / 100)) / config.usersLimit);
        let citiesPerAnt = Math.floor(config.mapCoverPercentage / 20);

        // create ant for every user
        for(let i = 0; i < config.usersLimit; i++){
            ants.push(new Ant(fieldsPerAnt, citiesPerAnt));
        }

        // make steps as long as at least one ant still has fields left to change
        while(ants.some((ant)=>{
            return !ant.isDone;
        })){
            // one step
            ants.forEach(ant => {
                if(ant.isDone) {return;}

                let xDelta = 0;
                let yDelta = 0;

                // generate direction for the step
                let directionRoll = getRndInteger(rng, 0, 1);
                if(directionRoll)   xDelta = getRndInteger(rng, -1, 1);
                else                yDelta = getRndInteger(rng, -1, 1);

                // check if direction wont overrun map border
                if((ant.x + xDelta) <= 0 || (ant.x + xDelta) > config.mapSize ){
                    xDelta = -xDelta;
                }
                if((ant.y + yDelta) <= 0 || (ant.y + yDelta) > config.mapSize ){
                    yDelta = -yDelta;
                }

                // execute step
                ant.x += xDelta;
                ant.y += yDelta;         
                
                // only change field if its type is MOUNTAIN
                if(map.fields[ant.x][ant.y].type == FieldTypes.TYPES.MOUNTAIN)
                {
                    // if ant has any cities left, randomly determine if field is going to be changed to a city
                    if(ant.citiesLeft)
                    {
                        let chanceForCity = getRndInteger(rng, 1, (ant.citiesLeft + ant.fieldsLeft));
                        if(chanceForCity <= ant.citiesLeft)
                        {
                            map.fields[ant.x][ant.y].type = FieldTypes.TYPES.CITY;
                            ant.generatedCity();
                        }
                        else
                        {
                            map.fields[ant.x][ant.y].type = FieldTypes.TYPES.FIELD;
                            ant.generatedField();
                        }
                    }
                    else
                    {
                        map.fields[ant.x][ant.y].type = FieldTypes.TYPES.FIELD;
                        ant.generatedField();
                    }
                }

            });
        }

        return map;
    },

    // adds capitals to map, returns populated map or null if population couldnt be done
    populateMap: function(users, map, config){
        halfMapSize = Math.floor(config.mapSize / 2);

        let crawlers = [
            new Crawler(1, -1, halfMapSize, config.mapSize),
            new Crawler(-1, 1, halfMapSize, 1),
            new Crawler(-1, -1, config.mapSize, halfMapSize),
            new Crawler(1, 1, 1, halfMapSize)
        ];

        // look for suitable field in crawler's map quarter
        for(let i = 0; i < users.length; i++)
        { 
            // console.log(users[i]);// ---
            singleCrawlerLoop:
            for(let row = 0; row < config.mapSize; row++)
            {
                if(row < halfMapSize)
                {
                    // first triangular half of quarter
                    let rowStartX = crawlers[i].startX + (row * crawlers[i].directionX);
                    let rowStartY = crawlers[i].startY + (row * crawlers[i].directionY);
    
                    for(let fieldNum = 0; fieldNum <= row; fieldNum++)
                    {
                        let field = map.fields[crawlers[i].startX + (fieldNum * crawlers[i].directionX)][rowStartY - (fieldNum * crawlers[i].directionY)];
                        if(field.type == FieldTypes.TYPES.FIELD)
                        {
                            // if found, set field's type to capital and set its owner as crawler's user. Break the outer loop
                            // TODO : chance for a capitol, so it doesnt get generated in the same spot every time
                            crawlers[i].isDone = true;
                            field.type = FieldTypes.TYPES.CAPITAL;
                            field.ownerId = users[i].id;
                            break singleCrawlerLoop;
                        }
                    }
                }
                else
                {
                    // second triangular half of quarter
                    let rowDecreased = row - halfMapSize;
                    let rowDecreasing = row - (row - halfMapSize);

                    let rowStartX = crawlers[i].startX + (rowDecreased * crawlers[i].directionX);
                    let rowStartY = crawlers[i].startY + (rowDecreasing * crawlers[i].directionY);

                    for(let fieldNum = 0; fieldNum <= rowDecreasing; fieldNum++)
                    {
                        let field = map.fields[rowStartX + (fieldNum * crawlers[i].directionX)][(crawlers[i].startY + halfMapSize) - (fieldNum * crawlers[i].directionY)];
                        
                        if(field.type == FieldTypes.TYPES.FIELD)
                        {
                            // if found, set field's type to capital and set its owner as crawler's user. Break the outer loop
                            crawlers[i].isDone = true;
                            field.type = FieldTypes.TYPES.CAPITAL;
                            field.ownerId = users[i].id;
                            break singleCrawlerLoop;
                        }
                    }
                }
            }
        }

        return map;
    },

    debugMap : function(map){
        for(let row = 1; row <= 20; row++){
            let debugRow = "";
            for(let column = 1; column <= 20; column++){
                if( map.fields[row][column].type == FieldTypes.TYPES.MOUNTAIN) debugRow = debugRow + "X";
                if( map.fields[row][column].type == FieldTypes.TYPES.FIELD) debugRow = debugRow + " ";
                if( map.fields[row][column].type == FieldTypes.TYPES.CITY) debugRow = debugRow + "C";
                if( map.fields[row][column].type == FieldTypes.TYPES.CAPITAL) debugRow = debugRow + "A";
            }
            console.log(debugRow);
        }
    }
}