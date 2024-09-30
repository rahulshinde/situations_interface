$( function() {
  $( ".ui:not(.no_controls)" ).draggable({ handle: ".ui_header" });

  document.querySelectorAll('.minimize').forEach((minimizeButton)=>{
    minimizeButton.addEventListener('click', toggleMinimize)
  })
} );