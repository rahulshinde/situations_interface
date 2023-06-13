export function calculatePosition (origin, transformation){
	let x = origin[0];
	let y = origin[1];
	let z = origin[2];

	return {
		'x': x + transformation.x, 
		'y': y + transformation.y,
		'z': z + transformation.z
	};
}

export function calculateDisplacement(exit, enter){
	return {
		'x': randomInteger(exit[0], enter[0]), 
		'y': randomInteger(exit[1], enter[1]),
		'z': randomInteger(exit[2], enter[2])
	}
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}