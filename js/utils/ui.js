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

	document.getElementById('upload').addEventListener('change', readUrl);
	document.getElementById('remove_group').addEventListener('click', clearTransformGroup)
}

export function createUiCharacterControl(character, name){
	let div = document.createElement("div");
  div.id = name;
  div.className = "scene_character vertical";
  div.innerHTML = character
	
	let button = document.createElement("button");
	button.className = 'delete_character button'
  div.appendChild(button);
  button.innerHTML = 'delete'
  button.addEventListener('click', deleteCharacterControl);

  let group_select = document.createElement("button");
	group_select.className = 'group_select button'
  group_select.innerHTML = 'group'
  div.appendChild(group_select);

  group_select.addEventListener('click', (e) => {
		let scene_character = event.target.closest('.scene_character');
  	addCharacterToTransformGroup(scene_character);
  });

  let group_deselect = document.createElement("button");
  group_deselect.setAttribute("disabled", "");
	group_deselect.className = 'group_deselect button'
  group_deselect.innerHTML = 'remove from group'
  div.appendChild(group_deselect);

  group_deselect.addEventListener('click', (e) => {
		let scene_character = event.target.closest('.scene_character');
  	removeCharacterFromTransformGroup(scene_character);
  });

	document.getElementById('scene_characters').appendChild(div);
}

export function deleteCharacterControl(event){
	let scene_character = event.target.closest('.scene_character');
	sceneBuilder.deleteLetter(scene_character);
	scene_character.remove();
}

function addCharacterToTransformGroup(scene_character){
	scene_character.classList.add('in_group');
	document.getElementById('remove_group').removeAttribute('disabled');
	scene_character.querySelector('.group_deselect').removeAttribute('disabled');
	sceneBuilder.addObjectToTransformControlsGroup();
}

function removeCharacterFromTransformGroup(scene_character){
	disableSceneCharacterGroupControls(scene_character)
	sceneBuilder.addObjectToTransformControlsGroup();
}

export function disableSceneCharacterGroupControls(scene_character){
	scene_character.classList.remove('in_group');
	scene_character.querySelector('.group_deselect').setAttribute('disabled', '');
}

export function clearTransformGroup(){
	document.getElementById('remove_group').setAttribute('disabled', '');
	document.querySelectorAll('.scene_character.in_group').forEach((scene_character) => {
		disableSceneCharacterGroupControls(scene_character);
	});
	sceneBuilder.addObjectToTransformControlsGroup();
}

export function setTransformMode(transformControl, mode){
	transformControl.mode = mode;
	document.querySelector('.transform_control.selected').classList.remove('selected');
	document.getElementById(mode).classList.add('selected');
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
    };
    reader.readAsDataURL(event.target.files[0]);
  }
}