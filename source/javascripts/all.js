//= require_tree .

$(document).ready(function(){
    $('body').plusAnchor({
        easing: 'easeInOutExpo',
        speed:  1000
    });

});

function toggleMenu() {
  $('.nav ul').toggleClass('visible');
};
