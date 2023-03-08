export function AddToGeometry(mainObject, objectToAdd) { 
	objectToAdd.updateMatrix(); 
	mainObject.geometry.mergeBufferGeometries(objectToAdd.geometry, objectToAdd.matrix); 
	return mainObject;     
}

export function getChildMeshes(group){
	let meshArray = [];
	group.children.forEach((child) =>{
		child.children.forEach((mesh) => {
			meshArray.push(mesh);
		})
	})

	return meshArray;
}