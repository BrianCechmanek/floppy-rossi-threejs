"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const keyboard_js_1 = require("./keyboard.js");
let renderer, scene, camera;
let cube;
let gameOver = false;
let cubeDied = false;
let gameStarted = false;
let cubeSize = 40;
let interspace = cubeSize * 3.5;
let movingSpeed = 80;
let obstacleDistance = 300;
let obstacleWidth = 100;
let obstacleContainer = new Array();
let clock = new THREE.Clock();
let deltaTime;
let g = 600;
let cubeSpeedY = 15;
let cubeFlySpeedY = 270;
let cubeFlyHeight = 50;
let score = 0;
let scoringTimeInterval = obstacleDistance / movingSpeed;
let scoringTimer = scoringTimeInterval;
let fieldWidth = 1000, fieldHeight = 500, fieldDepth = 100;
function setup() {
    createScene();
    draw();
}
function createScene() {
    let WIDTH = 640;
    let HEIGHT = 360;
    let VIEW_ANGLE = 50, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    camera = new THREE.OrthographicCamera(-500, 500, 250, -250, 0.1, 1000);
    scene = new THREE.Scene();
    scene.add(camera);
    camera.position.z = 200;
    let c = document.getElementById("gameCanvas");
    c.appendChild(renderer.domElement);
    let cubeWidth = cubeSize, cubeHeight = cubeSize, cubeDepth = cubeSize, cubeQuality = 1;
    let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xb22222
    });
    cube = new THREE.Mesh(new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth, cubeQuality, cubeQuality, cubeQuality), cubeMaterial);
    cube.position.z = fieldDepth / 2;
    cube.position.x = -fieldWidth / 3;
    scene.add(cube);
    let planeWidth = fieldWidth, planeHeight = fieldHeight, planeQuality = 10;
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x87ceeb
    });
    let plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(planeWidth, planeHeight, planeQuality, planeQuality), planeMaterial);
    scene.add(plane);
    initObstacles();
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 100);
    directionalLight.rotation.x = 90 * Math.PI / 180;
    scene.add(directionalLight);
}
function draw() {
    deltaTime = clock.getDelta();
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
    if (!gameStarted) {
        waitStart();
    }
    else {
        if (!gameOver) {
            moveObstacles();
            cubeUpdate();
        }
        else {
            if (cubeDied) {
                waitReStart();
            }
            else {
                cubeFall();
            }
        }
    }
}
function initObstacles() {
    let columnWidth = obstacleWidth, columnHeight = 500, columnDepth = 100, columnQuality = 1;
    let columnMaterial = new THREE.MeshLambertMaterial({
        color: 0x228b22
    });
    let columnGeometry = new THREE.BoxGeometry(columnWidth, columnHeight, columnDepth, columnQuality, columnQuality, columnQuality);
    for (let i = 0; i < fieldWidth / obstacleDistance + 1; i++) {
        let obstacle = new THREE.Object3D();
        let column1 = new THREE.Mesh(columnGeometry, columnMaterial);
        column1.position.y = columnHeight / 2 + interspace / 2;
        let column2 = new THREE.Mesh(columnGeometry, columnMaterial);
        column2.position.y = -columnHeight / 2 - interspace / 2;
        obstacle.add(column1);
        obstacle.add(column2);
        obstacle.position.z = cube.position.z;
        obstacle.position.x = i * obstacleDistance;
        obstacle.position.y = (Math.random() * 2 - 1) * 0.9 * (fieldHeight / 2 - interspace / 2);
        obstacleContainer.push(obstacle);
        scene.add(obstacle);
    }
}
function moveObstacles() {
    let translation = (movingSpeed * deltaTime);
    let maxPositionX = -10000;
    for (let i = 0; i < obstacleContainer.length; i++) {
        let obstacle = obstacleContainer[i];
        if (obstacle.position.x > maxPositionX) {
            maxPositionX = obstacle.position.x;
        }
    }
    scoringTimer += deltaTime;
    for (let i = 0; i < obstacleContainer.length; i++) {
        let obstacle = obstacleContainer[i];
        if (obstacle.position.x < fieldWidth / -2 + obstacleWidth / -2) {
            obstacle.position.x = maxPositionX + obstacleDistance;
            obstacle.position.y = (Math.random() * 2 - 1) * 0.9 * (fieldHeight / 2 - interspace / 2);
        }
        obstacle.position.x -= translation;
        let scoringPositionX = obstacle.position.x + obstacleWidth / 2 + cubeSize;
        if (scoringPositionX <= cube.position.x + cubeSize / 2
            && scoringPositionX >= cube.position.x - cubeSize / 2) {
            if (scoringTimer >= scoringTimeInterval) {
                scoringTimer = 0;
                score++;
                document.getElementById("score").innerHTML = score;
                if (score >= 10 && score < 20) {
                    document.getElementById("message").innerHTML = "Not Bad!";
                }
                else if (score >= 20 && score < 50) {
                    document.getElementById("message").innerHTML = "Very good!";
                }
                else if (score >= 50 && score < 100) {
                    document.getElementById("message").innerHTML = "Excellent!";
                }
                else if (score >= 100) {
                    document.getElementById("message").innerHTML = "You are the hero!";
                }
            }
        }
        if (cube.position.x <= obstacle.position.x + obstacleWidth / 2 + cubeSize / 2
            && cube.position.x >= obstacle.position.x - obstacleWidth / 2 - cubeSize / 2
            && !(cube.position.y < obstacle.position.y + interspace / 2 - cubeSize / 2
                && cube.position.y > obstacle.position.y - interspace / 2 + cubeSize / 2)) {
            gameOverFun();
        }
    }
}
function cubeUpdate() {
    if (keyboard_js_1.default.isDown(keyboard_js_1.default.F)) {
        cubeSpeedY = -cubeFlySpeedY;
    }
    cube.position.y -= Math.ceil(deltaTime * cubeSpeedY + g * deltaTime * deltaTime / 2);
    cubeSpeedY += g * deltaTime;
    if (cube.position.y < -fieldHeight / 2 + cubeSize / 2) {
        gameOverFun();
        cubeDied = true;
        cube.position.y = -fieldHeight / 2 + cubeSize / 2;
    }
    if (cube.position.y > fieldHeight / 2 - cubeSize / 2) {
        cube.position.y = fieldHeight / 2 - cubeSize / 2;
        cubeSpeedY = 0;
    }
}
function waitStart() {
    if (keyboard_js_1.default.isDown(keyboard_js_1.default.F)) {
        gameStarted = true;
    }
}
function waitReStart() {
    if (keyboard_js_1.default.isDown(keyboard_js_1.default.F)) {
        cube.position.y = 0;
        cube.material.color.setHex(0xb22222);
        let minPositionX = 10000;
        for (let i = 0; i < obstacleContainer.length; i++) {
            let obstacle = obstacleContainer[i];
            if (obstacle.position.x < minPositionX) {
                minPositionX = obstacle.position.x;
            }
        }
        for (let i = 0; i < obstacleContainer.length; i++) {
            let obstacle = obstacleContainer[i];
            obstacle.position.x += 0 - minPositionX;
            obstacle.position.y = (Math.random() * 2 - 1) * 0.9 * (fieldHeight / 2 - interspace / 2);
        }
        movingSpeed = 80;
        gameOver = false;
        cubeDied = false;
        score = 0;
        document.getElementById("score").innerHTML = score;
        document.getElementById("message").innerHTML = "Come on!";
    }
}
function gameOverFun() {
    gameOver = true;
    cubeSpeedY = 0;
    movingSpeed = 0;
    document.getElementById("message").innerHTML = "Game Over";
    cube.material.color.setHex(0x8b8989);
}
function cubeFall() {
    cube.position.y -= Math.ceil(deltaTime * cubeSpeedY + g * deltaTime * deltaTime / 2);
    cubeSpeedY += g * deltaTime;
    if (cube.position.y < -fieldHeight / 2 + cubeSize / 2) {
        cube.position.y = -fieldHeight / 2 + cubeSize / 2;
        cubeDied = true;
    }
    for (let i = 0; i < obstacleContainer.length; i++) {
        let obstacle = obstacleContainer[i];
        if (cube.position.x < obstacle.position.x + obstacleWidth / 2 + cubeSize / 3
            && cube.position.x > obstacle.position.x - obstacleWidth / 2 - cubeSize / 3
            && cube.position.y < obstacle.position.y - interspace / 2 + cubeSize / 2) {
            cube.position.y = obstacle.position.y - interspace / 2 + cubeSize / 2;
            cubeDied = true;
            break;
        }
    }
}
//# sourceMappingURL=game.js.map