import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';

import * as tetherCalculator from './tetherCalculator.js'
import * as letterBuilder from './letterBuilder.js'
import * as mergeMesh from './mergeMesh.js'


const tetherMaterial = new THREE.MeshPhongMaterial( 
	{ 
		color: 0xf7d011
	} 
);

var scene, 
		camera,
		renderer,
		cameraControls;

// Interaction controls
const raycaster = new THREE.Raycaster();
let pointerDown = false;
const pointer = new THREE.Vector2();
const onUpPosition = new THREE.Vector2();
const onDownPosition = new THREE.Vector2();
let transformControl;

var letters = [];
var splineHelperObjects = [];

var splineWidth = 2;
var material = new THREE.MeshPhongMaterial( { color: 0xf7d011 } );

export function initScene(){
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 200;
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});

	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( render );

	scene = new THREE.Scene();

	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set( 0, 0, 0);
	cameraControls.maxDistance = 400;
	cameraControls.minDistance = 30;
	cameraControls.update();
	cameraControls.addEventListener( 'change', render );

	const light = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
	scene.add( light );

	const light1 = new THREE.PointLight( 0xffc539, 0.5, 0 );
	// light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xf4bd82 } ) ) );
	light1.position.set( 200, 40, 40 );

	scene.add( light1 );

	transformControl = new TransformControls( camera, renderer.domElement );
	transformControl.addEventListener( 'change', render );
	transformControl.addEventListener( 'dragging-changed', function ( event ) {

		cameraControls.enabled = ! event.value;

	} );

	transformControl.translationSnap = 20;
	transformControl.rotationSnap = 0.7853982;

	scene.add( transformControl );

	document.addEventListener( 'pointerdown', onPointerDown );
	document.addEventListener( 'pointerup', onPointerUp );
	document.addEventListener( 'pointermove', onPointerMove );
	document.addEventListener( 'keyup', setKeyCommand );
	window.addEventListener( 'resize', onWindowResize );
	document.getElementById('export_obj').addEventListener( 'click', exportObj );

	document.querySelectorAll('.transform_control').forEach((control) => {
		control.addEventListener('click', function(e){
			setTransformMode(e.target.id);
		})
	})

	document.querySelectorAll('.background_image_style').forEach((control) => {
		control.addEventListener('click', function(e){
			setBackgroundStyle(e.target.id);
		})
	})

	document.getElementById('upload').addEventListener('change', readUrl);

	document.getElementById('canvas_container').appendChild( renderer.domElement );
}

export function addLetter(letter){
	let new_letter = letterBuilder.constructLetter(letter, splineWidth, material);
	scene.add(new_letter.object);
	createSceneCharacter(new_letter.character, new_letter.object.name);

	splineHelperObjects.push({
		'object': new_letter.object,
		'mesh': mergeMesh.getChildMeshes(new_letter.object)
	});
	render();
}

function createSceneCharacter(character, name){
	let div = document.createElement("div");
  div.id = name;
  div.className = "scene_character";
  div.innerHTML = character
	
	let button = document.createElement("button");
	button.className = 'delete_character buttonp'
  div.appendChild(button);
  button.innerHTML = 'delete'
  button.addEventListener('click', deleteLetter);

	document.getElementById('scene_characters').appendChild(div);
}

function deleteLetter(event){
	let scene_character = event.target.closest('.scene_character');

	var object = scene.getObjectByName( scene_character.id );

	var newSplineHelperObjects = splineHelperObjects.filter(	splineHelperObject => 
		splineHelperObject.object != object
	);

	console.log(newSplineHelperObjects);
	splineHelperObjects = newSplineHelperObjects;
	scene.remove(object);

	scene_character.remove();
	transformControl.detach();
	render();
}


function calcLetterPosition(length, index){
	if (length <= 1){
		return 0;
	}

	return index * 30;
}

function onPointerDown( event ) {
	onDownPosition.x = event.clientX;
	onDownPosition.y = event.clientY;
	pointerDown = true;

}

function onPointerUp( event ) {

	onUpPosition.x = event.clientX;
	onUpPosition.y = event.clientY;

	pointerDown = false;

	if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) transformControl.detach();

}

function onPointerMove( event ) {

	if (pointerDown){
		return;
	}

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( pointer, camera );

	if (splineHelperObjects.length > 0){
		splineHelperObjects.forEach((objectToAdd)=>{
			let intersects = raycaster.intersectObjects( objectToAdd.mesh, false );
			if ( intersects.length > 0 ) {
				if ( objectToAdd.object !== transformControl.object ) {
					transformControl.attach( objectToAdd.object );
				}

			}
		})
		const intersects = raycaster.intersectObjects( splineHelperObjects[0], false );
		if ( intersects.length > 0 ) {

			const object = intersects[ 0 ].object;

			if ( object !== transformControl.object ) {

				transformControl.attach( s );

			}

		}
	}
}

function setKeyCommand(event){
	var transform;
	if (event.keyCode === 82){
		transform = 'rotate';
	}
	if (event.keyCode === 84){
		transform = 'translate';
	}
	if (event.keyCode === 83){
		transform = 'scale';
	}

	setTransformMode(transform);
}

function setTransformMode(mode){
	transformControl.mode = mode;
	document.querySelector('.transform_control.selected').classList.remove('selected');
	document.getElementById(mode).classList.add('selected');
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();
}

function render( time ) {
	// group.rotation.y = time / 3000;
	renderer.render( scene, camera );
}


function readUrl(event){
	if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
    	console.log('hi');
      document.getElementById('background').src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }
}

function setBackgroundStyle(backgroundStyle){
	document.querySelector('.background_image_style.selected').classList.remove('selected');
	document.getElementById(backgroundStyle).classList.add('selected')
	document.getElementById('background').style.objectFit = backgroundStyle;
}

function exportObj(){
	const exporter = new OBJExporter();
	console.log(scene);
	const data = exporter.parse( splineHelperObjects[0].object );
	saveString( data, 'object.obj' );
}

const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

function save( blob, filename ) {

	link.href = URL.createObjectURL( blob );
	link.download = filename;
	link.click();

}

function saveString( text, filename ) {

	save( new Blob( [ text ], { type: 'text/plain' } ), filename );

}
