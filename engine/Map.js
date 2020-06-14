Field = require('./Field');
FieldTypes = require('../shared/engine/field-types');

module.exports = class Map {
    constructor(mapSize){
        this.fields = [];

        for(let xAxis = 1; xAxis <= mapSize; xAxis++){
            this.fields[xAxis] = [];
            for(let yAxis = 1; yAxis <= mapSize; yAxis++){
                this.fields[xAxis][yAxis] = new Field(xAxis, yAxis, FieldTypes.TYPES.MOUNTAIN);
            }
        }
    }
}