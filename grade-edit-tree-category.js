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

var AutoGenerateCategories;

$( document ).ready(function() {
    var params = new URLSearchParams(document.location.search);
    var parent = params.get("Parent");
    var value = $("#id_parentcategory option:contains('"+ parent +"')").val();
    $('#id_parentcategory').val(value)
    var ID = params.get("ID");
    if(ID != "undefined" && ID != null && ID.length > 0)
        $("#id_grade_item_idnumber").val(ID);
    var Name = params.get("Name");
    if(Name != "undefined" && Name != null && Name.length > 0)
        $("#id_fullname").val(Name);
    var MaxGrade = params.get("MaxGrade");
    if(MaxGrade != "undefined" && MaxGrade != null && MaxGrade.length > 0)
        $("#id_grade_item_grademax").val(MaxGrade);
    else
        $("#id_grade_item_grademax").val(10);
    var MinGrade = params.get("MinGrade");
    if(MinGrade != "undefined" && MinGrade != null && MinGrade.length > 0)
        $("#id_grade_item_grademin").val(MinGrade);
    else
        $("#id_grade_item_grademin").val(0);
    var PassGrade = params.get("PassGrade");
    if(PassGrade != "undefined" && PassGrade != null && PassGrade.length > 0)
        $("#id_grade_item_gradepass").val(PassGrade);
    chrome.storage.sync.get('AutoGenerateCategories_Checkbox_Value', function(data) {
        AutoGenerateCategories = data.AutoGenerateCategories_Checkbox_Value;
        if(AutoGenerateCategories === true){
            $("#id_submitbutton").click();
        }
    });
});