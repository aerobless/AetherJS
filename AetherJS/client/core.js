/**
 * Created by theowinter on 03/12/14.
 */
/*global THREE:false */
/*jslint browser: true*/

var test = "test";

var scene = new THREE.Scene(),
    xcar = "ddd",
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer;

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1),
    material = new THREE.MeshBasicMaterial({color: 0xbf0 }),
    greenMaterial = new THREE.MeshBasicMaterial({color: 0x00ff1e });

var cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0);

var makeGreenCube = function (posX, posY, posZ) {
    "use strict"; //All JS5.1 functions need this to make sure that we're only using initialized variables..
    var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5),
        cube = new THREE.Mesh(geometry, greenMaterial); //L: only one var!

    cube.position.set(posX, posY, posZ);
    return cube;
};

var greenCube1 = makeGreenCube(-1.5, 1, 1),
    greenCube2 = makeGreenCube(1.5, 1, 1),
    greenCube3 = makeGreenCube(-1.5, -1, 1),
    greenCube4 = makeGreenCube(1.5, -1, 1);

var cubes = [cube, greenCube1, greenCube2, greenCube3, greenCube4];

//ForEach example, basically just a function expecting one param
cubes.forEach(function (entry) {
    "use strict";
    scene.add(entry);
});

camera.position.z = 5;

//flor test
geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

// material
/*var material = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('textures/grassUNSAFE.png')
});*/

var repeatGrass = THREE.ImageUtils.loadTexture('textures/grassUNSAFE.png');
repeatGrass.wrapS = repeatGrass.wrapT = THREE.RepeatWrapping;
repeatGrass.repeat.set(50, 50);
var material = new THREE.MeshBasicMaterial({map: repeatGrass});

mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// add subtle ambient lighting
var ambientLight = new THREE.AmbientLight(0xbbbbbb);
scene.add(ambientLight);

// directional lighting
var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

var render = function () {
    "use strict";
    requestAnimationFrame(render);

    //Auto-Resize the rendered window:
    renderer.setSize(window.innerWidth, window.innerHeight);

    cubes.forEach(function (entry) {
        entry.rotation.x += 0.01;
        entry.rotation.y += 0.01;
    });

    controls.update();
    renderer.render(scene, camera);
};

controls = new THREE.PointerLockControls( camera );
controls.enabled = true;
scene.add( controls.getObject() );

//Setup socket.io
var socket = io();
socket.on('message', function(msg){
    if (msg.action === "sendPositionUpdate") {
        scene.updateMatrixWorld(true);
        var position = new THREE.Vector3();
        position.getPositionFromMatrix(camera.matrixWorld);
        console.log(position.x + ',' + position.y + ',' + position.z);
    }
});

render();