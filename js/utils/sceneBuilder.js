import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';

import * as letterBuilder from './letterBuilder.js'
import * as mergeMesh from './mergeMesh.js'
import * as ui from './ui.js'


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
let transformingGroup = false;

var letters = [];
var splineHelperObjects = [];

var splineWidth = 2;
var material = new THREE.MeshPhongMaterial( { color: 0xf7d011 } );
var selected_material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

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

	// transformControl.translationSnap = 20;
	// transformControl.rotationSnap = 0.7853982;

	scene.add( transformControl );

	document.addEventListener( 'pointerdown', onPointerDown );
	document.addEventListener( 'pointerup', onPointerUp );
	document.addEventListener( 'pointermove', onPointerMove );
	document.addEventListener( 'keyup', setKeyCommand );
	window.addEventListener( 'resize', onWindowResize );
	document.getElementById('export_obj').addEventListener( 'click', exportObj );
	document.getElementById('export_png').addEventListener( 'click', exportPNG );

	document.querySelectorAll('.transform_control').forEach((control) => {
		control.addEventListener('click', function(e){
			ui.setTransformMode(transformControl, e.target.id);
		})
	})

	document.getElementById('canvas_container').appendChild( renderer.domElement );
}

export function addLetter(letter){
	let new_letter = letterBuilder.constructLetter(letter, splineWidth, material);
	scene.add(new_letter.object);
	ui.createUiCharacterControl(new_letter.character, new_letter.object.name);

	splineHelperObjects.push({
		'object': new_letter.object,
		'mesh': mergeMesh.getChildMeshes(new_letter.object)
	});
	render();
}

export function deleteLetter(scene_character){
	var object = scene.getObjectByName( scene_character.id );

	var newSplineHelperObjects = splineHelperObjects.filter(	splineHelperObject => 
		splineHelperObject.object != object
	);

	splineHelperObjects = newSplineHelperObjects;
	scene.remove(object);

	transformControl.detach();
	render();
}

export function toggleGrid(){
	let grid_toggle = document.getElementById('toggle_grid');
	grid_toggle.classList.toggle('selected');

	if (grid_toggle.classList.contains('selected')){
		const size = 200;
		const divisions = 10;
	
		const gridHelper = new THREE.GridHelper( size, divisions )
		gridHelper.name = 'grid';
		scene.add( gridHelper );
	} else {
		scene.remove(scene.getObjectByName('grid'));
	}

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

	if (splineHelperObjects.length > 0 && !transformingGroup){
		splineHelperObjects.forEach((objectToAdd)=>{
			let intersects = raycaster.intersectObjects( objectToAdd.mesh, false );
			if ( intersects.length > 0 ) {
				if ( objectToAdd.object !== transformControl.object ) {
					transformControl.attach( objectToAdd.object );
				}

			}
		})
	}
}

export function addObjectToTransformControlsGroup(){
	transformControl.detach();

	let group = new THREE.Object3D();
	group.name = 'transformGroup'

	let groupedCharacters = document.querySelectorAll('.scene_character.in_group');
	if (groupedCharacters.length == 0){
		removeTransformControlsGroup();
	} else {
		groupedCharacters.forEach((character) => {
			let object = scene.getObjectByName(character.id);
			// filter splineHelperObjects to only include item with object.id matches character.id
			let helperObject = splineHelperObjects.filter((splineHelperObject) => {
				return splineHelperObject.object.name == character.id
			})[0];

			helperObject.mesh.forEach((mesh) => {
				setMaterialColor(mesh, 0xff0000);
			});
			group.attach(object)
		});
		scene.add(group);
		transformingGroup = true;
		render();

		transformControl.attach(group);
	}
}

export function removeTransformControlsGroup(){
	let old_group = scene.getObjectByName('transformGroup');
	scene.remove(old_group);
	transformingGroup = false;
}

function setMaterialColor(mesh, color){
	mesh.material = selected_material;
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

	if (transform){
		ui.setTransformMode(transformControl, transform);
	}
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

function exportObj(){
	const exporter = new OBJExporter();
	console.log(splineHelperObjects.map((helperObject) => helperObject.object.children));
	let data = ''
	splineHelperObjects.forEach((helperObject) => {
		data = data + ' seperate ' + exporter.parse(helperObject.object)
	})
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

function exportPNG() {
	// download file
	var a = document.createElement('a');
	render();
	a.href = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
	a.download = 'situation-export.png'
	a.click();
}