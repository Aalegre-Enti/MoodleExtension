var shifted = false;
$(document).on('keyup', function(e){
    if(e.shiftKey === false){
        shifted = false;
    }
    return true;
} );
$(document).on('keydown', function(e){
    if(e.shiftKey === true){
        shifted = true;
    }
    return true;
} );
$( document ).ready(function() {
    $(".toggle-category").click(function(){
        if(shifted === true){
            CollapseAll(this);
        }
    });
});
function CollapseAll(element) {
    shifted = false;
    var collapsables = $("a.toggle-category");
    
    $($(collapsables).get().reverse()).each(function() {
        $(this).get(0).click();
    });
    shifted = false;
}
