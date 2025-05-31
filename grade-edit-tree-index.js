
var categoriesHeaders;
$( document ).ready(function() {
    LoadSettings();
    categoriesHeaders = $("tr.category .rowtitle");
    $(categoriesHeaders).each(function(i){
        var lastcol = $(this).parents("tr").find("td").last().find(".dropdown");
        $('<button class="btn btn-sm btn-outline-success" type="button" >Add</button>').appendTo(lastcol).on( "click", function(e) {
            AddByRow($(e.target).parents("tr"), "", "", "", "", "");
        } );
        $('<button class="btn btn-sm btn-outline-danger" type="button" >Delete</button>').appendTo(lastcol).on( "click", function(e) {
            DeleteByRow($(e.target).parents("tr"));
        } );
    });
});
var SkipRecalculatingGrades = false;
var topCategory;
function LoadSettings(){
    console.log("Loading settings");
    chrome.storage.sync.get('SkipRecalculatingGrades_Checkbox_Value', function(data) {
        SkipRecalculatingGrades = data.SkipRecalculatingGrades_Checkbox_Value;
        SkipRecalculatingGradesFunc();
    });
    chrome.storage.sync.get('TopCategory', function(data) {
        topCategory = Object.assign(new GradeCategory(), data.TopCategory);
        if(topCategory == undefined){
            topCategory = new GradeCategory(null, "Grade category", "ID", null, true, 10, 5);
            var av = topCategory.addChild(new GradeCategory(top, "Avaluació", "AV", null, true, 10, 5));
            av.addChild(new GradeCategory(top, "AA1", "AA1", 100, true, 10))
            var rv = topCategory.addChild(new GradeCategory(top, "Reavaluació", "RV", null, true, 10, 5));
            rv.addChild(new GradeCategory(top, "AR1", "AR1", 100, true, 10))
        }
        topCategory.validate();
        EnhanceGradebook();
    });
}
function EnhanceGradebook(){
    EnhanceCategory(topCategory);
}
function EnhanceCategory(category){
    var categoryHeader = FindCategoryInGradebook(category);
    $(categoryHeader).append('<span class="badge rounded-pill bg-dark text-light">' + category.id + '</span>');
    for(var i = 0; i < category.children.length; i++){
        EnhanceCategory(category.children[i]);
    }
}
function FindCategoryInGradebook(category){
    return FindCategoryInGradebookByName(category.name);
}
function FindCategoryInGradebookByName(name){
    var header;
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    $(categoriesHeaders).each(function(i){
         if($(this).text().normalize("NFD").replace(/[\u0300-\u036f]/g,"").startsWith(name)){
            header = this;
            return false;
         }
    });
    return header;
}
function FindCategoryInGradebookByNameExact(name){
    var header;
    $(categoriesHeaders).each(function(i){
         if($(this).text() == name){
            header = this;
            return false;
         }
    });
    return header;
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
}

function DeleteByName(name){
    var categoryHeader = FindCategoryInGradebookByNameExact(name);
    DeleteByRow(categoryHeader.parents("tr"));
}
function AddByRow(element, id, name, maxGrade, minGrade, gradePass){
    var parentname = $(element).find(".rowtitle").clone().children().remove().end().text();
    var params = new URLSearchParams(document.location.search);
    var courseid = params.get("id");
    document.location = "category.php?courseid=" + courseid + "&Parent=" + parentname + "&ID=" + id + "&Name=" + name + "&MaxGrade=" + maxGrade + "&MinGrade=" + minGrade + "&GradePass=" + gradePass; 
}
function DeleteByRow(element){
    var deletebutton = $(element).find("a.dropdown-item:contains('Delete')");
    var target = deletebutton.attr("data-modal-destination");
    document.location = target; 
}