
var categoriesHeaders;
var gradeItemHeaders;
$( document ).ready(function() {
        categoriesHeaders = $("tr.category .rowtitle");
        gradeItemHeaders = $("tr.item .rowtitle .gradeitemheader ");
        LoadSettings();
        $(categoriesHeaders).each(function(i){
            var lastcol = $(this).parents("tr").find("td").last().find(".dropdown");
            $('<button class="btn btn-sm btn-outline-success" type="button" >Add</button>').appendTo(lastcol).on( "click", function(e) {
                AddByRow($(e.target).parents("tr"), "", "", "", "", "");
            } );
            $('<button class="btn btn-sm btn-outline-danger" type="button" >Delete</button>').appendTo(lastcol).on( "click", function(e) {
                DeleteByRow($(e.target).parents("tr"));
            } );
        });
    setTimeout(function() {
    }, 500);
});
var SkipRecalculatingGrades = false;
var AutoGenerateCategories = false;
var AutoMoveItems = false;
var topCategory;
function LoadSettings(){
    console.log("Loading settings");
    chrome.storage.sync.get('SkipRecalculatingGrades_Checkbox_Value', function(data) {
        SkipRecalculatingGrades = data.SkipRecalculatingGrades_Checkbox_Value;
        if(!SkipRecalculatingGradesFunc()){
            chrome.storage.sync.get('TopCategory', function(data) {
                topCategory = Object.assign(new GradeCategory(), data.TopCategory);
                topCategory.validate();
                EnhanceGradebook();
                chrome.storage.sync.get('AutoGenerateCategories_Checkbox_Value', function(data) {
                    AutoGenerateCategories = data.AutoGenerateCategories_Checkbox_Value;
                    if(AutoGenerateCategories === true){
                        if(CreateCategory(topCategory) == true){
                            AutoGenerateCategories = false;
                            chrome.storage.sync.set({ AutoGenerateCategories_Checkbox_Value: AutoGenerateCategories });
                        }
                    }
                });
            });
            chrome.storage.sync.get('AutoMoveItems_Checkbox_Value', function(data) {
                AutoMoveItems = data.AutoMoveItems_Checkbox_Value;
                if(AutoMoveItems === true){
                    setTimeout(function() {
                        if(MoveGradeItems(topCategory) == true){
                            AutoMoveItems = false;
                            chrome.storage.sync.set({ AutoMoveItems_Checkbox_Value: AutoMoveItems });
                        }
                    }, 500);
                }
            });
        }
    });
}
function EnhanceGradebook(){
    EnhanceCategory(topCategory);
    chrome.storage.sync.set({ TopCategory: topCategory });
}
function EnhanceCategory(category){
    var categoryHeader = FindCategoryInGradebook(category);
    category.categoryHeader = categoryHeader;
    var catId = $(categoryHeader).parents("tr.category").attr("data-category");
    if(catId != undefined && catId != null){
        category.moodleId = catId.replace("cg","");
    }
    $(categoryHeader).append('<span class="badge rounded-pill bg-dark text-light">' + category.id + '</span>');
    for(var i = 0; i < category.children.length; i++){
        EnhanceCategory(category.children[i]);
    }
}
function CreateCategory(category){
    if(category != topCategory && 
        category.parent != undefined && category.parent != null && 
        category.parent.categoryHeader != undefined && category.parent.categoryHeader != null && 
        (category.categoryHeader == undefined || category.categoryHeader == null)){
        var parentname = $(category.parent.categoryHeader).clone().children().remove().end().text();
        AddCategory(parentname, category.id, category.name, category.maxGrade, category.minGrade, category.gradePass);
        return false;
    }
    for(var i = 0; i < category.children.length; i++){
        if(!CreateCategory(category.children[i]))
            return false;
    }
    return true;
}
function MoveGradeItems(category){
    var items = [];
    var name = category.id.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    $(gradeItemHeaders).each(function(i){
         if($(this).text().normalize("NFD").replace(/[\u0300-\u036f]/g,"").contains(name)){
            try{
                var parentcat = $(this).parents("tr.item").attr("data-parent-category").replace("cg", "");
                if(category.moodleId != parentcat){
                    items.push(this);
                    var check = $(this).parents("tr.item").find("input:checkbox");
                    $(check).prop( "checked", false);
                    $(check).trigger("click");
                }
            }catch (ex){ }
         }
    });
    if(items.length > 0){
        setTimeout(function() {
            debugger;
            $('button[data-action="move"]').trigger("click");
            setTimeout(function() {
            debugger;
                $('li[data-id="' + category.moodleId + '"]').click();
                $('li[data-id="' + category.moodleId + '"]').trigger("click");
                $('button[data-action="save"]').click();
                $('button[data-action="save"]').trigger("click");
            }, 200);
        }, 100);
        return false;
    }else{
        for(var i = 0; i < category.children.length; i++){
            if(!MoveGradeItems(category.children[i]))
                return false;
        }
        return true;
    }
}
function FindCategoryInGradebook(category){
    if(topCategory == category){
        return categoriesHeaders.first();
    }else{
        return FindCategoryInGradebookByName(category.name);
    }
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
            return true;
        }
    }
    return false;
}

function DeleteByName(name){
    var categoryHeader = FindCategoryInGradebookByNameExact(name);
    DeleteByRow(categoryHeader.parents("tr"));
}
function AddByRow(element, id, name, maxGrade, minGrade, gradePass){
    var parentname = $(element).find(".rowtitle").clone().children().remove().end().text();
    AddCategory(parentname,id,name,maxGrade,minGrade,gradePass);
}
function AddCategory(parentname, id, name, maxGrade, minGrade, gradePass){
    var params = new URLSearchParams(document.location.search);
    var courseid = params.get("id");
    document.location = "category.php?courseid=" + courseid + "&Parent=" + parentname + "&ID=" + id + "&Name=" + name + "&MaxGrade=" + maxGrade + "&MinGrade=" + minGrade + "&GradePass=" + gradePass; 
}
function DeleteByRow(element){
    var deletebutton = $(element).find("a.dropdown-item:contains('Delete')");
    var target = deletebutton.attr("data-modal-destination");
    document.location = target; 
}