import * as THREE from 'three';

export function calculatePosition (origin, object){
	console.log(origin);


	var position = new THREE.Vector3();
	position.setFromMatrixPosition( origin.matrixWorld );
	let x = position.x;
	let y = position.y;
	let z = position.z;

	return {
		'x': x, 
		'y': y,
		'z': z
	};
}

export function calculateDisplacement(exit, enter){
	let exitPosition = calculatePosition(exit);
	let enterPosition = calculatePosition(enter);
	return {
		'x': randomInteger(exitPosition.x, enterPosition.x), 
		'y': randomInteger(exitPosition.y, enterPosition.y),
		'z': randomInteger(exitPosition.z, enterPosition.z)
	}
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}