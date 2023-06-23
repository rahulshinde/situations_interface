import * as sceneBuilder from './sceneBuilder.js'

export function initUi(){
	document.querySelectorAll('.character').forEach((char) =>{
		char.addEventListener('click', () => {
			sceneBuilder.addLetter(char.dataset.character);
		})
	});

	document.querySelectorAll('.background_image_style').forEach((control) => {
		control.addEventListener('click', function(e){
			setBackgroundStyle(e.target.id);
		})
	});

	document.querySelectorAll('.background_img').forEach((control) => {
		control.addEventListener('click', function(e){
			setBackground(e.target.innerHTML);
		})
	});

	document.getElementById('remove_image').addEventListener('click', clearBackgroundImage);
	document.getElementById('toggle_grid').addEventListener('click', sceneBuilder.toggleGrid);

	document.getElementById('upload').addEventListener('change', readUrl);
	document.getElementById('remove_group').addEventListener('click', clearTransformGroup)
	document.getElementById('align_letters').addEventListener('click', function(){
		alignLetters('horizontal')
	});
	document.getElementById('align_letters_v').addEventListener('click', function(){
		alignLetters('vertical')
	});
	document.getElementById('align_letters_grid').addEventListener('click', function(){
		alignLetters('grid')
	});

	document.getElementById('width').addEventListener('change', updateSplineWidth);
	document.getElementById('toggle_tether').addEventListener('click', toggleTether);

	updateSplineWidth();

	// random number between 1 and 6
	let random = Math.floor(Math.random() * 6) + 1;
	setBackground(random);
}

export function createUiCharacterControl(character, name){
	let div = document.createElement("div");
  div.id = name;
  div.className = "scene_character";
  div.innerHTML = character
	
	let button = document.createElement("button");
	button.className = 'delete_character character_button'
  div.appendChild(button);
  button.innerHTML = 'x'
  button.addEventListener('click', deleteCharacterControl);

  let group_select = document.createElement("button");
	group_select.className = 'group_select group_button character_button'
  group_select.innerHTML = ''
  div.appendChild(group_select);

  group_select.addEventListener('click', (e) => {
		let scene_character = e.target.closest('.scene_character');
  	addCharacterToTransformGroup(scene_character);
  });

  let group_deselect = document.createElement("button");
  group_deselect.setAttribute("disabled", "");
	group_deselect.className = 'group_deselect group_button character_button'
  group_deselect.innerHTML = ''
  div.appendChild(group_deselect);

	let character_coordinates = document.createElement("div");
	character_coordinates.className = 'character_coordinates_wrapper'

	let character_position_label = document.createElement("div");
	character_position_label.className = 'character_label'
	character_position_label.innerHTML = 'Position'

	let character_position = document.createElement("div");
	character_position.className = 'character_position'

	let character_rotation_label = document.createElement("div");
	character_rotation_label.className = 'character_label'
	character_rotation_label.innerHTML = 'Rotation'

	let character_rotation = document.createElement("div");
	character_rotation.className = 'character_rotation'

	let character_scale_label = document.createElement("div");
	character_scale_label.className = 'character_label'
	character_scale_label.innerHTML = 'Scale'

	let character_scale = document.createElement("div");
	character_scale.className = 'character_scale'

	character_coordinates.appendChild(character_position_label);
	character_coordinates.appendChild(character_position);
	character_coordinates.appendChild(character_rotation_label);
	character_coordinates.appendChild(character_rotation);
	character_coordinates.appendChild(character_scale_label);
	character_coordinates.appendChild(character_scale);
	
	div.appendChild(character_coordinates);

  group_deselect.addEventListener('click', (e) => {
		let scene_character = event.target.closest('.scene_character');
  	removeCharacterFromTransformGroup(scene_character);
  });

	document.getElementById('scene_characters').appendChild(div);
}

export function disableScale(){
	document.getElementById('scale').setAttribute('disabled', '');
}

export function enableScale(){
	document.getElementById('scale').removeAttribute('disabled');
}

export function deleteCharacterControl(event){
	let scene_character = event.target.closest('.scene_character');
	sceneBuilder.deleteLetter(scene_character);
	scene_character.remove();
}

export function addCharacterToTransformGroup(scene_character){
	scene_character.classList.add('in_group');
	document.getElementById('scene_characters').classList.add('group');
	document.getElementById('remove_group').removeAttribute('disabled');
	scene_character.querySelector('.delete_character').setAttribute('disabled', '');
	scene_character.querySelector('.group_deselect').removeAttribute('disabled');
	sceneBuilder.addObjectToTransformControlsGroup(scene_character.id);
}

export function removeCharacterFromTransformGroup(scene_character){
	disableSceneCharacterGroupControls(scene_character);
	sceneBuilder.removeObjectFromTransformControlsGroup(scene_character.id, true);
}

export function disableSceneCharacterGroupControls(scene_character){
	scene_character.classList.remove('in_group');
	scene_character.querySelector('.group_deselect').setAttribute('disabled', '');
	scene_character.querySelector('.delete_character').removeAttribute('disabled');
	
}

export function clearTransformGroup(){
	document.getElementById('scene_characters').classList.remove('group');
	document.getElementById('remove_group').setAttribute('disabled', '');
	sceneBuilder.removeTransformControlsGroup();
}

export function setTransformMode(transformControl, mode){
	transformControl.mode = mode;
	document.querySelector('.transform_control.selected').classList.remove('selected');
	document.getElementById(mode).classList.add('selected');
}

function clearBackgroundImage(){
	document.getElementById('background').setAttribute('src', '')
}


function setBackground(number){
	let background = document.getElementById('background');
	document.querySelectorAll('.background_img').forEach((control) => {
		control.classList.remove('selected');
	});
	console.log(document.querySelector(`.background_img:nth-child(1)`));
	document.querySelector(`.background_img:nth-child(${number})`).classList.add('selected');
	if (number <= 4){
		background.src = `img/${number}.jpg`;
	} else{
		background.setAttribute('src', '')
		if (number == 5){
			background.style.backgroundColor = 'white';
		} else {
			background.style.backgroundColor = 'fuchsia';
		}
	}
}

function setBackgroundStyle(backgroundStyle){
	document.querySelector('.background_image_style.selected').classList.remove('selected');
	document.getElementById(backgroundStyle).classList.add('selected')
	document.getElementById('background').style.objectFit = backgroundStyle;
}

function readUrl(event){
	if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('background').src = e.target.result;
			document.querySelector('.background_img.selected').classList.remove('selected');
    };
    reader.readAsDataURL(event.target.files[0]);
  }
}

function updateSplineWidth(e){
	let width = 2;
	if (e){
		width = e.target.value;
	}
	document.getElementById('spline_width').innerHTML = width;
	sceneBuilder.updateSplineWidth(width);
}

function toggleTether(){
	let tether = document.getElementById('toggle_tether');
	if (tether.classList.contains('selected')){
		document.body.classList.remove('tethering');
		tether.classList.remove('selected');
		sceneBuilder.removeTethers();
	} else {
		document.body.classList.add('tethering');
		tether.classList.add('selected');
		sceneBuilder.buildTethers();
	}
}

function alignLetters(orientation){
	sceneBuilder.alignLetters(orientation);
}

export function enableAlignButton(){
	document.getElementById('align_letters').removeAttribute('disabled');
	document.getElementById('align_letters_v').removeAttribute('disabled');
	document.getElementById('align_letters_grid').removeAttribute('disabled');
}

export function disableAlignButton(){
	document.getElementById('align_letters').setAttribute('disabled', '');
	document.getElementById('align_letters_v').setAttribute('disabled', '');
	document.getElementById('align_letters_grid').setAttribute('disabled', '');
}

export function updateTransformValues(object){
	let id = object.name;
	let position = object.position;
	let rotation = object.rotation;
	let scale = object.scale;

	let character_position = document.getElementById(id).querySelector('.character_position');
	let character_rotation = document.getElementById(id).querySelector('.character_rotation');
	let character_scale = document.getElementById(id).querySelector('.character_scale');

	character_position.innerHTML = `${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`;
	character_rotation.innerHTML = `${rotation.x.toFixed(2)}, ${rotation.y.toFixed(2)}, ${rotation.z.toFixed(2)}`;
	character_scale.innerHTML = `${scale.x.toFixed(2)}, ${scale.y.toFixed(2)}, ${scale.z.toFixed(2)}`;
}