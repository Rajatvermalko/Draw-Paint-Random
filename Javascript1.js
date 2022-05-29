//ADDED COMMENTS FOR EXAMINER'S BETTER UNDERSTANDING
window.onload = function() {
    var canvas = document.getElementById('Canvas');
    var clearButton = document.getElementById('Clear');
    var isActive = false;
    var startingCoordinates = null;
    var endingCoordinates = null;
    var context = canvas.getContext('2d');
    var dataPool = [];
    var flag = false;
    var draggedTriangleIndex = 0;
    var randomColor = null;
    var changeDistance = {
        x: 0,
        y: 0
    };
    
    //double click on triangle
    canvas.addEventListener('dblclick', function(evt) {
    
    var position = getMousePositions(canvas, evt);
    dataPool.forEach(function (value) {
    
    var Area0 = findArea(value[0][0], value[0][1], value[1][0], value[1][1], value[2][0], value[2][1]);
    var Area1 = findArea(value[0][0], value[0][1], position.x, position.y, value[2][0], value[2][1]);
    var Area2 = findArea(value[0][0], value[0][1], value[1][0], value[1][1], position.x, position.y);
    var Area3 = findArea(position.x, position.y, value[1][0], value[1][1], value[2][0], value[2][1]);
    
    if (Math.round(Area0) === Math.round(Area1 + Area2 + Area3)) {
    var newList = [];
    var item = dataPool[dataPool.indexOf(value)];
    dataPool.forEach(function (value2) {
    
    if (value2 !== item) {
    newList.push(value2);
    }
    });
    
    dataPool = newList;
    clearCanvas();
    dataPool.forEach(function (value2) {
    reDrawTriangles(value2[0][0], value2[0][1], value2[4], value2[3]);
    });
    
    return true;
    }
    });
    
    isActive = false;
    });
    
    //on mouse down listner
    canvas.addEventListener('mousedown', function(evt) {
    
    canvas.style.cursor = 'move';
    evt.preventDefault();
    var mousePosition = getMousePositions(canvas, evt);
    startingCoordinates = mousePosition;
    endingCoordinates = mousePosition;
    isActive = true;
    flag = checkIfInside(mousePosition);
    startingCoordinates = mousePosition;
    endingCoordinates = mousePosition;
    randomColor = getRandomColor();
    
    if(dataPool.length > 0) {
    changeDistance.x = dataPool[draggedTriangleIndex][0][0] - mousePosition.x;
    changeDistance.y = dataPool[draggedTriangleIndex][0][1] - mousePosition.y;
    }
    console.log(changeDistance);
    });
    
    //movement listner 
    canvas.addEventListener('mousemove', function(evt) {
    endingCoordinates = getMousePositions(canvas, evt);
    if(isActive && flag) {
    clearCanvas();
    canvas.style.cursor = 'ne-resize';
    reDrawTriangles(startingCoordinates.x, startingCoordinates.y, calculateLineDistance(startingCoordinates.x, startingCoordinates.y, endingCoordinates.x, endingCoordinates.y), randomColor);
    dataPool.forEach(function (value) {
    reDrawTriangles(value[0][0], value[0][1], value[4], value[3]);
    });
    }
    
    else if(isActive) {
    canvas.style.cursor = 'crosshair';
    clearCanvas();
    var item = dataPool[draggedTriangleIndex];
    var differX = endingCoordinates.x - item[0][0] + changeDistance.x;
    var differY = endingCoordinates.y - item[0][1] + changeDistance.y;
    item[0][0] += differX;
    item[0][1] += differY;
    item[1][0] += differX;
    item[1][1] += differY;
    item[2][0] += differX;
    item[2][1] += differY;
    reDrawTriangles(item[0][0], item[0][1], item[4], item[3]);
    dataPool.forEach(function (value) {
    
    if(value[0][0] !== startingCoordinates.x && value[0][1] !== startingCoordinates.y) {
    reDrawTriangles(value[0][0], value[0][1], value[4], value[3]);
    }
    });
    }
    }, true);
    
    //click releasing listner
    canvas.addEventListener('mouseup', function(evt) {
    canvas.style.cursor = 'pointer';
    var mousePosition = getMousePositions(canvas, evt);
    
    if(!flag) {
    isActive = false;
    flag = false;
    doDragTranslation(mousePosition.x, mousePosition.y);
    }
    
    else if(isActive && calculateLineDistance(startingCoordinates.x, startingCoordinates.y, endingCoordinates.x, endingCoordinates.y) > 2) {
    isActive = false;
    flag = false;
    //getting end mouse positions
    endingCoordinates = mousePosition;
    drawTriangle(1, startingCoordinates.x, startingCoordinates.y, endingCoordinates.x, endingCoordinates.y);
    }
    });
    
    //adding click listner for clear button
    clearButton.addEventListener('click', function() {
    dataPool = [];
    clearCanvas();
    });
    
    //function to check if the mouse is inside the given triangle
    function checkIfInside(pos) {
    
    flag = true;
    dataPool.forEach(function (value) {
    var Area = findArea(value[0][0], value[0][1], value[1][0], value[1][1], value[2][0], value[2][1]);
    var Area1 = findArea(value[0][0], value[0][1], pos.x, pos.y, value[2][0], value[2][1]);
    var Area2 = findArea(value[0][0], value[0][1], value[1][0], value[1][1], pos.x, pos.y);
    var Area3 = findArea(pos.x, pos.y, value[1][0], value[1][1], value[2][0], value[2][1]);
            
    if (Math.round(Area) === Math.round(Area1 + Area2 + Area3)) {
    draggedTriangleIndex = dataPool.indexOf(value);
    flag = false;
    return true;
    }
    });
        return flag;
    }
    
    function findArea(x1, y1, x2, y2, x3, y3) {
        
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
    }
    
    // function used to do translation
    function doDragTranslation(newx, newy) {
    
    var item = dataPool[draggedTriIndex];
    var difX = newx - item[0][0] + changeDistance.x;
    var difY = newy - item[0][1] + changeDistance.y;
    item[0][0] += difX;
    item[0][1] += difY;
    item[1][0] += difX;
    item[1][1] += difY;
    item[2][0] += difX;
    item[2][1] += difY;
    dataPool.splice(draggedTriangleIndex, 0, item);
    clearCanvas();
    dataPool.forEach(function (value) {
    reDrawTriangles(value[0][0], value[0][1], value[4], value[3]);
    });
    }
    
    // function to get current mouse position
    function getMousePositions(canvas, event) {
    
    var bounds = canvas.getBoundingClientRect();
    return {
    
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top
    
    };
    }
    
    function calculateLineDistance(x1, y1, x2, y2) {
    
    return Math.round(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    }
    
    function drawTriangle(mode, x1, y1, x2, y2) {
    
    //getting the distance
    var distance = calculateLineDistance(x1, y1, x2, y2);
    //height of the triangle
    var height = 1.414 * (distance) * mode;
    //making a path
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1 + distance / 2, y1 + height);
    context.lineTo(x1 - distance / 2, y1 + height);
    context.moveTo(x1, y1);
    context.fillStyle = randomColor;
    context.fill();
    context.stroke();
        
    dataPool.push([[x1, y1], [x1 + distance / 2, y1 + height * 1.25], [x1 - distance / 2, y1 + height * 1.25], [context.fillStyle], [distance]]);
    
    }
    
    function reDrawTriangles(x1, y1, distance, color) {
    
    //height of the triangle
    var height = 1.414 * (distance);
    //making a path
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1 + distance / 2, y1 + height);
    context.lineTo(x1 - distance / 2, y1 + height);
    context.moveTo(x1, y1);
    context.fillStyle = color;
    context.fill();
    context.stroke();
    
    }
    
    function getRandomColor() {
    var r = Math.ceil(Math.random() * 256);
    var g = Math.ceil(Math.random() * 256);
    var b = Math.ceil(Math.random() * 256);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
    
    function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    }
    };