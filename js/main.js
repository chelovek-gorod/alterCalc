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

    selectBaseBrickSize : {
        width : 250,
        depth : 380,
        height : 219
    },
    selectBaseBrickWallSize : 1,
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

    holeKeys : 1,
    holes : [],

    garretKeys : 1,
    garrets : [],

}

class Hole {
    constructor(width, height, pcs) {
        this.key = 'hole-' + input.holeKeys++;
        this.width = width;
        this.height = height;
        this.pcs = pcs;
    }
}

class Garret {
    constructor(h1, w1, h2, w2, pcs) {
        this.key = 'garret-' + input.garretKeys++;
        this.h1 = h1;
        this.h2 = h2;
        this.w1 = w1;
        this.w2 = w2;
        this.pcs = pcs;
    }
}

// ***

const visualImg = document.getElementById('visualImg');
const visualImagePath = '';

function getChangedValue(id) {
    let value = Number(id.value.replace(',', '.'));
    let min = Number(id.min);
    let max = Number(id.max);
    let stepSigns = (id.step.indexOf('.') === -1) ? 0 : id.step.length - (id.step.indexOf('.') + 1);
    let step = Number(id.step);
    
    if (value > max) value = max;
    else if (value < min) value = min;
    else value = step * Math.round(value / step);

    id.value = value.toFixed(stepSigns);
    return value;
}

// ***

function changeVisualImageBase(type) {
    if (type === 'f') changeVisualImageTo('house_wall_type_f.png');
    else {
        if (input.radioBaseBrick === true) changeVisualImageTo((type === 'f_') ? 'house_wall_type_f_k.png' : 'house_wall_type_k.png');
        else if (input.radioBaseBlockCeramic === true) changeVisualImageTo((type === 'f_') ? 'house_wall_type_f_b.png' : 'house_wall_type_b.png');
        else if (input.radioBaseBlockSilicate === true) changeVisualImageTo((type === 'f_') ? 'house_wall_type_f_p.png' : 'house_wall_type_p.png');
        else console.log('kan\'t show base image');
    }
}
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
    let value = getChangedValue(id);
    input[id.id] = value;

    recalculate();
}

function selectOnchange(id, value) {
    if (id === 'selectBaseBrickWallSize') input[id] = value;
    else {
        let data = value.split(' ');
        input[id].width = (id === 'selectBaseBlockCeramicSize') ? Number(data[1]) : Number(data[0]);
        input[id].depth = (id === 'selectBaseBlockCeramicSize') ? Number(data[0]) : Number(data[1]);
        input[id].height = Number(data[2])
    }

    recalculate();
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

    recalculate();
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

    recalculate();
}

// ***

const holesDataDiv = document.getElementById('holesDataDiv');
const addHoleButton = document.getElementById('addHoleButton');

const addGarretPopupShell = document.getElementById('addGarretPopupShell');
const garretsDataDiv = document.getElementById('garretsDataDiv');
const addGarretButton = document.getElementById('addGarretButton');

function addedInputOnchange(id, key, name, type) {
    let value = getChangedValue(id);
    let element = input[name].find(element => element.key === key);
    element[type] = value;
    
    recalculate();
}

function addHole() {
    let hole = document.createElement('div');
    hole.className = 'hole';
    hole.setAttribute('key', 'hole-' + input.holeKeys);
    hole.innerHTML = `<label>Размеры:</label>
        <nobr><input type="number" class="hole-w" value="1.200" min="0.010" step="0.001" max="20.000" onchange="addedInputOnchange(this, 'hole-${input.holeKeys}', 'holes', 'width')"> x
        <input type="number" class="hole-h" value="1.600" min="0.010" step="0.001" max="20.000" onchange="addedInputOnchange(this, 'hole-${input.holeKeys}', 'holes', 'height')"> м; </nobr>
        <label>количество: <input type="number" class="hole-pcs" value="1" min="1" step="1" max="999" onchange="addedInputOnchange(this, 'hole-${input.holeKeys}', 'holes', 'pcs')"> шт. </label>
        <button class="delete-div" onclick="deleteHole(this, 'hole-${input.holeKeys}')">Удалить</button>`;
    
    holesDataDiv.insertBefore(hole, addHoleButton);

    input.holes.push(new Hole(1.2, 1.6, 1));

    recalculate();
}
addHole();
function deleteHole(id, key) {
    id.parentNode.remove();
    input.holes = input.holes.filter(hole => hole.key !== key);

    recalculate();
}

function showGarretPopupSell() {
    addGarretPopupShell.style.display = 'flex';
    setTimeout(changeVisualImageTo, 300, 'house_r.png');
}
function hideGarretPopupSell() {
    addGarretPopupShell.style.display = 'none';
    hideVisualImage();
}
function addGarretType(type) {
    let garret = document.createElement('div');
    garret.className = 'garret';
    garret.setAttribute('key', 'garret-' + input.garretKeys);

    let garretImageDiv = document.createElement('div');
    garretImageDiv.innerHTML = `<img src="garret_type_${type}.png" alt="Тип мансарды">`;
    let garretInputsDiv = document.createElement('div');
    garretInputsDiv.className = 'garret-inputs';

    garretInputsDiv.innerHTML = `<label>h1 = 
        <input type="number" class="garret-h" value="1.200" min="0.010" step="0.001" max="20.000" onchange="addedInputOnchange(this, 'garret-${input.garretKeys}', 'garrets', 'h1')"> м; 
        </label>
        <label>L1 =
        <input type="number" class="garret-w" value="0.800" min="0.010" step="0.001" max="50.000" onchange="addedInputOnchange(this, 'garret-${input.garretKeys}', 'garrets', 'w1')"> м; 
        </label>`;
    if (type == 3) {
        garretInputsDiv.innerHTML += `<label>h2 = 
            <input type="number" class="garret-h" value="1.800" min="0.010" step="0.001" max="20.000" onchange="addedInputOnchange(this, 'garret-${input.garretKeys}', 'garrets', 'h2')"> м; 
            </label>
            <label>L2 = 
            <input type="number" class="garret-w" value="1.600" min="0.010" step="0.001" max="50.000" onchange="addedInputOnchange(this, 'garret-${input.garretKeys}', 'garrets', 'w2')"> м; 
            </label>`;
    }
    garretInputsDiv.innerHTML += `<label>количество:
        <input type="number" class="hole-pcs" value="2" min="1" step="1" max="999" onchange="addedInputOnchange(this, 'garret-${input.garretKeys}', 'garrets', 'pcs')"> шт. 
        </label>
        <button class="delete-div" onclick="deleteGarret(this, 'garret-${input.garretKeys}')">Удалить</button>`;
    garret.append(garretImageDiv, garretInputsDiv);
    garretsDataDiv.insertBefore(garret, addGarretButton);

    let h2 = (type == 3) ? 1.8 : 0;
    let w2 = (type == 3) ? 1.6 : 0;
    input.garrets.push(new Garret(1.2, 0.8, h2, w2, 2));

    recalculate();
}
function deleteGarret(id, key) {
    id.parentNode.parentNode.remove();
    input.garrets = input.garrets.filter(garret => garret.key !== key);

    recalculate();
}

// *** COUNT *** //

const endSides = 4; // use in bricks in line P pcs count: bricksInLineP = (P - brickWidth * endSides) / brickLength
const k_Pinner = 8; // use in blocks in line Pin pcs count: blocksInLinePin = (P - brickWidth * k_Pinner) / blockLength
let externalPerimeter;
let innerPerimeter; // 

function recalculate() {
    console.log(input);
    console.log('---');

    
}