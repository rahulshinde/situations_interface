import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

import * as letterBuilder from './letterBuilder.js'
import * as tetherCalculator from './tetherCalculator.js'
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
var selected_material = new THREE.MeshPhongMaterial( { color: 0x0000ff } );

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

export function updateSplineWidth(width){
	splineWidth = width;
}

export function addLetter(letter){
	let new_letter = letterBuilder.constructLetter(letter, splineWidth, material);
	scene.add(new_letter.object);
	ui.createUiCharacterControl(new_letter.character, new_letter.object.name);

	splineHelperObjects.push({
		'object': new_letter.object,
		'mesh': mergeMesh.getChildMeshes(new_letter.object)
	});
	ui.enableAlignButton();
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
			if (transformingGroup){
				ui.clearTransformGroup();
			} else{
				transformControl.detach();
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


export function addObjectToTransformControlsGroup(scene_character_id){
	transformControl.detach();
	ui.disableAlignButton();


	let old_group = scene.getObjectByName('transformGroup');
	let group = new THREE.Object3D();
	if (old_group){
		group = old_group
	}
	else {
		group.name = 'transformGroup'
	}

	
	let object = scene.getObjectByName(scene_character_id);
	let helperObject = splineHelperObjects.filter((splineHelperObject) => {
		return splineHelperObject.object.name == scene_character_id
	})[0];
	helperObject.mesh.forEach((mesh) => {
	setSelectedMaterialColor(mesh);
	});
	
	if (!old_group){
		scene.add(group);
	}

	group.attach(object)

	transformingGroup = true;
	render();

	transformControl.attach(group);
}

export function removeObjectFromTransformControlsGroup(scene_character_id, render_scene){
	let old_group = scene.getObjectByName('transformGroup');
	if(old_group){
		let object = old_group.children.filter((object)=>{
			return object.name == scene_character_id
		})[0];
			old_group.remove(object);
			scene.add(object);

			object.scale.x = object.scale.x * old_group.scale.x;
			object.scale.y = object.scale.y * old_group.scale.y;
			object.scale.z = object.scale.z * old_group.scale.z;
			
			object.position.x += old_group.position.x;
			object.position.y += old_group.position.y;
			object.position.z += old_group.position.z;

			object.rotation.x += old_group.rotation.x;
			object.rotation.y += old_group.rotation.y;
			object.rotation.z += old_group.rotation.z;


		let helperObject = splineHelperObjects.filter((splineHelperObject) => {
			return splineHelperObject.object.name == object.name
		})[0];

		helperObject.mesh.forEach((mesh) => {
			mesh.material = material;
		});

		if (old_group.children.length == 0){
			scene.remove(old_group);
			document.getElementById('remove_group').setAttribute('disabled', '');
			transformControl.detach();

			transformingGroup = false;
			render();
		} else if (render_scene){
			console.log('rendering');
			render();
		}
	}
}

export function removeTransformControlsGroup(){
	let old_group = scene.getObjectByName('transformGroup');
	
	document.querySelectorAll('.in_group').forEach((scene_character)=>{
		ui.disableSceneCharacterGroupControls(document.getElementById(scene_character.id));

		let helperObject = splineHelperObjects.filter((splineHelperObject) => {
			return splineHelperObject.object.name == scene_character.id
		})[0];

		helperObject.mesh.forEach((mesh) => {
			mesh.material = material;
		});

		let object = helperObject.object;
		object.scale.x = object.scale.x * old_group.scale.x;
		object.scale.y = object.scale.y * old_group.scale.y;
		object.scale.z = object.scale.z * old_group.scale.z;

		object.position.x += old_group.position.x;
		object.position.y += old_group.position.y;
		object.position.z += old_group.position.z;

		object.rotation.x += old_group.rotation.x;
		object.rotation.y += old_group.rotation.y;
		object.rotation.z += old_group.rotation.z;


		scene.add(object);
	});

	document.getElementById('remove_group').setAttribute('disabled', '');
	ui.enableAlignButton();
	transformControl.detach();
	
	transformingGroup = false;
	render();
	scene.remove(old_group);
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

export function alignLetters(){
	let total_length = splineHelperObjects.length - 1;
	let position = total_length * -15;

	splineHelperObjects.forEach((splineHelperObject) => {
		
		let object = splineHelperObject.object;
		object.position.x = position;
		object.position.y = 0;
		object.position.z = 0;
		
		object.rotation.x = 0;
		object.rotation.y = 0;
		object.rotation.z = 0;
		
		object.scale.x = 1;
		object.scale.y = 1;
		object.scale.z = 1;

    position += 30;
	});
}

function calcLetterPosition(length, index){
	if (length <= 1){
		return 0;
	}

	return index * 30;
}

export function buildTethers(){
	for (var i = 0; i < splineHelperObjects.length - 1; i++) {
		var exit = splineHelperObjects[i].object;
		var enter = splineHelperObjects[i + 1].object;

		console.log(exit);
		console.log(enter);

		var exit1 = tetherCalculator.calculatePosition(exit.exit1, exit.position);
		var enter1 = tetherCalculator.calculatePosition(enter.enter1, enter.position);
		var connectorDisplacementA1 = tetherCalculator.calculateDisplacement(exit1, enter1);
		var connectorDisplacementA2 = tetherCalculator.calculateDisplacement(exit1, enter1);

		addTetherToScene(exit1, enter1, connectorDisplacementA1, connectorDisplacementA2, splineWidth, scene);

		var exit2 = tetherCalculator.calculatePosition(exit.exit2, exit.path.position);
		var enter2 = tetherCalculator.calculatePosition(enter.enter2, enter.path.position);
		var connectorDisplacementB1 = tetherCalculator.calculateDisplacement(exit2, enter2);
		var connectorDisplacementB2 = tetherCalculator.calculateDisplacement(exit2, enter2);
		
		addTetherToScene(exit2, enter2, connectorDisplacementB1, connectorDisplacementB2, splineWidth, scene);

	}
}

function addTetherToScene(exit, enter, connectorDisplacement1, connectorDisplacement2, splineWidth, scene){

	let tether = new THREE.CatmullRomCurve3(
		[
			new THREE.Vector3( exit.x, exit.y, exit.z ),		
			new THREE.Vector3( connectorDisplacement1.x, connectorDisplacement1.y, connectorDisplacement1.z ),		
			new THREE.Vector3( connectorDisplacement2.x, connectorDisplacement2.y, connectorDisplacement2.z ),		
			new THREE.Vector3( enter.x, enter.y, enter.z )
		]
	)
	let geometry = new THREE.TubeGeometry( tether, 120, splineWidth, 15, false );
	let mesh = new THREE.Mesh( geometry, tetherMaterial );
	scene.add(mesh);
}