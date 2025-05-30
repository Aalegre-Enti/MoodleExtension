/*
var SkipRecalculatingGrades = false;
var topCategory;
function LoadSettings(){
    console.log("Loading settings");
    chrome.storage.sync.get('SkipRecalculatingGrades_Checkbox_Value', function(data) {
        SkipRecalculatingGrades = data.SkipRecalculatingGrades_Checkbox_Value;
        SkipRecalculatingGradesFunc();
    });
}


function SkipRecalculatingGradesFunc(){
    if(SkipRecalculatingGrades === true){
        var h2 = $( "h2:contains('Recalculating grades')" );
        if(h2.length > 0){
            var parent = h2.parent();
            var form = parent.find("form");
            form.submit();
        }
    }
}*/


$( document ).ready(function() {
    var params = new URLSearchParams(document.location.search);
    var parent = params.get("Parent");
    var value = $("#id_parentcategory option:contains('"+ parent +"')").val();
    $('#id_parentcategory').val(value)
    var ID = params.get("ID");
    $("#id_grade_item_idnumber").val(ID);
    var Name = params.get("Name");
    $("#id_fullname").val(Name);
});