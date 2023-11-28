$( function() {
  $( ".ui:not(.no_controls)" ).draggable({ handle: ".ui_header" });

  document.querySelectorAll('.minimize').forEach((minimizeButton)=>{
    minimizeButton.addEventListener('click', toggleMinimize)
  })
} );

function toggleMinimize(e){
  let ui = e.target.parentElement.parentElement;
  ui.classList.toggle('minimized');
}