'use strict'

const brickCalcContainer = document.getElementById('brickCalcContainer');

const input = {
    facadeIs : true,
    baseIs : true,
    radioBaseBrick : true,
    radioBaseBlockCeramic : false,
    radioBaseBlockSilicate : false,

    inputPerimeterSize : 16,
    inputHeightSize : 2.5,

    selectFacadeBrickSize : {
        width : 250,
        depth : 120,
        height : 65
    },
    inputFacadeBrickSeam : 5,

    inputGapSize : 50,

    selectBaseBrickSize : 1,
    inputBaseBrickSeam : 5,

    selectBaseBlockCeramicSize : {
        width : 250,
        depth : 380,
        height : 219
    },
    inputBaseBlockCeramicSeam : 15,

    selectBaseBlockSilicateSize : {
        width : 625,
        depth : 100,
        height : 250
    },
    inputBaseBlockSilicateSeam : 0,

    holes : [
        {
            width : 1.6,
            height : 2.2,
            pcs : 1
        }
    ],

    garrets : [
        {
            L1 : 1.6,
            L2 : 1.6,
            h1 : 2.2,
            h2 : 2.2,
            pcs : 1
        }
    ]

}

class Hole {
    constructor(width, height, pcs) {
        this.width = width;
        this.height = height;
        this.pcs = pcs;
    }
}

class Garret {
    constructor(L, h, hc, pcs) {
        this.L = L;
        this.h = h;
        this.hc = hc;
        this.pcs = pcs;
    }
}

// ***

const visualImg = document.getElementById('visualImg');
const visualImagePath = '';

const endSides = 4; // use in bricks in line P pcs count: bricksInLineP = (P - brickWidth * endSides) / brickLength
const k_Pinner = 8; // use in blocks in line Pin pcs count: blocksInLinePin = (P - brickWidth * k_Pinner) / blockLength
let externalPerimeter;
let innerPerimeter; // 

// ***

function changeVisualImageBaseSize() {
    if (input.radioBaseBrick === true) changeVisualImageTo('house_wall_size_f_k.png');
    else if (input.radioBaseBlockCeramic === true) changeVisualImageTo('house_wall_size_f_b.png');
    else if (input.radioBaseBlockSilicate === true) changeVisualImageTo('house_wall_size_f_p.png');
    else console.log('kan\'t show base gap size image');
}
function changeVisualImageBaseType(type) {
    if (input.facadeIs === true) changeVisualImageTo('house_wall_type_f_' + type + '.png');
    else changeVisualImageTo('house_wall_type_' + type + '.png');
}
function changeVisualImageTo(img) {
    visualImg.src = visualImagePath + img;
    if (visualImg.style.opacity == 0) visualImg.style.opacity = 1;
}
function hideVisualImage() {
    visualImg.style.opacity = 0;
}

function inputNumberOnchange(id) {
    let value = Number(id.value.replace(',', '.'));
    let min = Number(id.min);
    let max = Number(id.max);
    let stepSigns = (id.step.indexOf('.') === -1) ? 0 : id.step.length - (id.step.indexOf('.') + 1);
    let step = Number(id.step);
    
    if (value > max) value = max;
    else if (value < min) value = min;
    else value = step * Math.round(value / step);
    
    input[id.id] = value;
    id.value = value.toFixed(stepSigns);
}

function selectOnchange(id, value) {
    if (id === 'selectBaseBrickSize') input[id] = value;
    else {
        let data = value.split(' ');
        input[id].width = (id === 'selectBaseBrickSize') ? Number(data[1]) : Number(data[0]);
        input[id].depth = (id === 'selectBaseBrickSize') ? Number(data[0]) : Number(data[1]);
        input[id].height = Number(data[2])
    }
}

// ***

const wallTypeButtonsDiv = document.getElementById('wallTypeButtonsDiv');
const wallTypeButtonsArr = Array.from(wallTypeButtonsDiv.querySelectorAll('button'));

const facadeDiv = document.getElementById('facadeDiv');
const baseDiv = document.getElementById('baseDiv');
const labelGapSize = document.querySelector('label[for="inputGapSize"]');

function changeWallType(type) {
    switch (type) {
        case 'facade' : wallTypeButtonsArr.forEach(button => button.className = ''); useWallTypeFacade(); break;
        case 'base' : wallTypeButtonsArr.forEach(button => button.className = ''); useWallTypeBase(); break;
        case 'all' : wallTypeButtonsArr.forEach(button => button.className = ''); useWallTypeAll(); break;
        default : console.log('unknown wall type');
    }
}
function useWallTypeFacade() {
    wallTypeButtonsArr[0].className = 'selected';
    input.facadeIs = true;
    input.baseIs = false;
    facadeDiv.style.display = 'block';
    baseDiv.style.display = 'none';
}
function useWallTypeBase() {
    wallTypeButtonsArr[2].className = 'selected';
    input.facadeIs = false;
    input.baseIs = true;
    facadeDiv.style.display = 'none';
    baseDiv.style.display = 'block';
    labelGapSize.style.display = 'none';
}
function useWallTypeAll() {
    wallTypeButtonsArr[1].className = 'selected';
    input.facadeIs = true;
    input.baseIs = true;
    facadeDiv.style.display = 'block';
    baseDiv.style.display = 'block';
    labelGapSize.style.display = 'block';
}

// ***

const baseBrickDiv = document.getElementById('baseBrickDiv');
const baseBlockCeramicDiv = document.getElementById('baseBlockCeramicDiv');
const baseBlockSilicateDiv = document.getElementById('baseBlockSilicateDiv');

baseBlockCeramicDiv.style.display = 'none';
baseBlockSilicateDiv.style.display = 'none';

function radioBaseOnchange(id) {
    input.radioBaseBrick = false;
    input.radioBaseBlockCeramic = false;
    input.radioBaseBlockSilicate = false;
    input[id.id] = true;

    baseBrickDiv.style.display = 'none';
    baseBlockCeramicDiv.style.display = 'none';
    baseBlockSilicateDiv.style.display = 'none';

    if(id.id === 'radioBaseBrick') baseBrickDiv.style.display = 'block';
    if(id.id === 'radioBaseBlockCeramic') baseBlockCeramicDiv.style.display = 'block';
    if(id.id === 'radioBaseBlockSilicate') baseBlockSilicateDiv.style.display = 'block';
}