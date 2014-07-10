//= require_tree .

$(document).ready(function(){
    $('body').plusAnchor({
        easing: 'easeInOutExpo',
        speed:  1000,
        before: function( $name ) {
          var hash = $name.attr('name');
          var fx, node = $name;
          if ( node.length ) {
            node.attr( 'id', '' );
            fx = $( '<div></div>' )
                    .css({
                        position:'absolute',
                        visibility:'hidden',
                        top: $(document).scrollTop() + 'px'
                    })
                    .attr( 'id', hash )
                    .appendTo( document.body );
          }
          document.location.hash = hash;
          if ( node.length ) {
            fx.remove();
            node.attr( 'id', hash );
          }
        }
    });

});

function toggleMenu() {
  $('.nav ul').toggleClass('visible');
}
