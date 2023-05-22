import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

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

	const light = new THREE.DirectionalLight( 0xffffff, 0.75 ); // soft white light
	light.position.z = 50;
	light.position.y = 50;
	scene.add( light );

	const light1 = new THREE.PointLight( 0xffe438, 1, 0 );
	// light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xf4bd82 } ) ) );
	light1.position.set( 200, 40, 40 );

	scene.add( light1 );

	const light2 = new THREE.PointLight( 0xffe438, 1, 0 );
	// light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xf4bd82 } ) ) );
	light1.position.set( -100, -40, -40 );

	scene.add( light2 );

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
	document.getElementById('export_gltf').addEventListener( 'click', exportGLTF );
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
	
	if(event.target.nodeName == 'CANVAS'){
		if (event.shiftKey){
			toggleIntersectedInGroup(event);
		} else if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {
			transformControl.detach();
			if (transformingGroup){
				ui.clearTransformGroup();
			}
		}
	}
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

function toggleIntersectedInGroup(event){
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( pointer, camera );

	if (splineHelperObjects.length > 0){
		splineHelperObjects.forEach((objectToAdd)=>{
			let intersects = raycaster.intersectObjects( objectToAdd.mesh, false );
			if ( intersects.length > 0 ) {
				let scene_character = document.getElementById(objectToAdd.object.name)
				if (scene_character.classList.contains('in_group')){
					ui.removeCharacterFromTransformGroup(scene_character);
				} else {
					ui.addCharacterToTransformGroup(scene_character);
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
				setSelectedMaterialColor(mesh);
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
	old_group.children.forEach((object)=>{
		ui.disableSceneCharacterGroupControls(document.getElementById(object.name));
		scene.add(object);
		object.position.x += old_group.position.x;
		object.position.y += old_group.position.y;
		object.position.z += old_group.position.z;

		object.rotation.x += old_group.rotation.x;
		object.rotation.y += old_group.rotation.y;
		object.rotation.z += old_group.rotation.z;

		object.scale.x = old_group.scale.x;
		object.scale.y = old_group.scale.y;
		object.scale.z = old_group.scale.z;

		let helperObject = splineHelperObjects.filter((splineHelperObject) => {
			return splineHelperObject.object.name == object.name
		})[0];

		helperObject.mesh.forEach((mesh) => {
			mesh.material = material;
		});
	});
	document.getElementById('remove_group').setAttribute('disabled', '');
	scene.remove(old_group);
	transformingGroup = false;
}

function setSelectedMaterialColor(mesh){
	mesh.material = selected_material;
}

export function setDefaultMaterialColor(character){
	let helperObject = splineHelperObjects.filter((splineHelperObject) => {
		return splineHelperObject.object.name == character.id
	})[0];
	
	helperObject.mesh.forEach((mesh) => {
		mesh.material = material;
	});
	render();
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

function exportGLTF(){
	const exporter = new GLTFExporter();

	// Parse the input and generate the glTF output
	exporter.parse(
		scene,
		// called when the gltf has been generated
		function ( gltf ) {

			const output = JSON.stringify( gltf, null, 2 );
			saveString( output, 'scene.gltf' );

		},
		// called when there is an error in the generation
		function ( error ) {

			console.log( 'An error happened' );

		}
	);
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