var topCategory;

$( document ).ready(function() {
    LoadSettings();
    SkipRecalculatingGrades_Checkbox.addEventListener("change", SaveSettings);
    GenerateUnica_Checkbox.addEventListener("change", SaveSettings);
    AutoGenerateCategories_Checkbox.addEventListener("change", SaveSettings);
    AutoDeleteCategories_Checkbox.addEventListener("change", SaveSettings);
    AutoMoveItems_Checkbox.addEventListener("change", SaveSettings);
    CategoriesUpdate_Button.addEventListener("click", UpdateCategories);

    
});
      function LoadSettings(){
        console.log("Loading settings");
        chrome.storage.sync.get('SkipRecalculatingGrades_Checkbox_Value', function(data) {
            SkipRecalculatingGrades_Checkbox.checked = data.SkipRecalculatingGrades_Checkbox_Value;
        });
        chrome.storage.sync.get('AutoGenerateCategories_Checkbox_Value', function(data) {
            AutoGenerateCategories_Checkbox.checked = data.AutoGenerateCategories_Checkbox_Value;
        });
        chrome.storage.sync.get('GenerateUnica_Checkbox_Value', function(data) {
            GenerateUnica_Checkbox.checked = data.GenerateUnica_Checkbox_Value;
        });
        chrome.storage.sync.get('AutoDeleteCategories_Checkbox_Value', function(data) {
            AutoDeleteCategories_Checkbox.checked = data.AutoDeleteCategories_Checkbox_Value;
        });
        chrome.storage.sync.get('AutoMoveItems_Checkbox_Value', function(data) {
            AutoMoveItems_Checkbox.checked = data.AutoMoveItems_Checkbox_Value;
        });
        chrome.storage.sync.get('TopCategory', function(data) {
            topCategory = Object.assign(new GradeCategory(), data.TopCategory);
            ReloadCategories();
        });
      }
      function FindCategoryByInternalId(internalId){
        return FindCategory(internalId, topCategory);
      }
      function FindCategory(internalId, parent){
        if(parent.internalId === internalId){
            return parent;
        }
        else{
            for(var i = 0; i < parent.children.length; i++){
                var found = FindCategory(internalId, parent.children[i]);
                if(found != undefined && found != null){
                    return found;
                }
            }
        }
      }
      function ChangeParentCategory(category){
        if(category.parent != undefined && category.parent != null && category.parent.parent != undefined && category.parent.parent != null){
          var lastparent = category.parent;
          category.parent.parent.children.push(category);
          category.parent = category.parent.parent;
          var index = lastparent.children.indexOf(category);
          if (index !== -1) {
              lastparent.children.splice(index, 1);
          }
        }
        SaveSettings();
      }
      function MoveCategory(category, dir){
        var index = category.parent.children.indexOf(category);
        category.parent.children = array_move(category.parent.children, index, index + dir);
        SaveSettings();
      }
      function array_move(arr, fromIndex, toIndex) {
        if(toIndex >= arr.length) return arr;
        if(fromIndex < 0) return arr;
        return arr.map((item, index) => {
            if (index === toIndex) return arr[fromIndex];
            if (index === fromIndex) return arr[toIndex];
            return item;
        });
      };
      function AddCategory(parent){
        parent.createChild();
        SaveSettings();
      }
      function RemoveCategory(category){
        if(category.parent == undefined || category.parent == null){
          topCategory.id = undefined;
        }else{
          var index = category.parent.children.indexOf(category);
          if (index !== -1) {
              category.parent.children.splice(index, 1);
          }
        }
        SaveSettings();
      }
      function ReloadCategories(){
            if(topCategory.id == undefined){
                topCategory = new GradeCategory(null, "Grade category", "ID", null, true, 10, 5);
                if(GenerateUnica_Checkbox.checked){
                  topCategory.addChild(new GradeCategory(top, "No Evaluable", "NE", 0, false, 0));
                  var av = topCategory.addChild(new GradeCategory(top, "Avaluació", "AV", null, true, 10, 5));
                  var avc = av.addChild(new GradeCategory(top, "Avaluació Contínua", "AV-C", 100, true, 10));
                  avc.addChild(new GradeCategory(top, "AA1", "AA1", 100, true, 10));
                  var avu = av.addChild(new GradeCategory(top, "Avaluació Única", "AV-U", 100, true, 10));
                  avu.addChild(new GradeCategory(top, "AAU1", "AAU1", 100, true, 10));
                  var rv = topCategory.addChild(new GradeCategory(top, "Reavaluació", "RV", null, true, 10, 5));
                  var rvc = rv.addChild(new GradeCategory(top, "Reavaluació Contínua", "RV-C", 100, true, 10));
                  rvc.addChild(new GradeCategory(top, "AR1", "AR1", 100, true, 10));
                  var rvu = rv.addChild(new GradeCategory(top, "Reavaluació Única", "RV-U", 100, true, 10));
                  rvu.addChild(new GradeCategory(top, "ARU1", "ARU1", 100, true, 10));
                }else{
                  topCategory.addChild(new GradeCategory(top, "No Evaluable", "NE", 0, false, 0));
                  var av = topCategory.addChild(new GradeCategory(top, "Avaluació", "AV", null, true, 10, 5));
                  av.addChild(new GradeCategory(top, "AA1", "AA1", 100, true, 10))
                  var rv = topCategory.addChild(new GradeCategory(top, "Reavaluació", "RV", null, true, 10, 5));
                  rv.addChild(new GradeCategory(top, "AR1", "AR1", 100, true, 10))
                }
            }
            try{
            topCategory.validate();
            }catch(ex){ topCategory.id = undefined; ReloadCategories();}
            $(CategoriesBody).empty();
            topCategory.AppendCategory(CategoriesBody);
            $(".category-update").on("change", UpdateCategories);
      }
      function UpdateCategories(){
        topCategory.update();
        SaveSettings();
      }
      function SaveSettings(){
        console.log("Saving settings");
        chrome.storage.sync.set({ SkipRecalculatingGrades_Checkbox_Value: SkipRecalculatingGrades_Checkbox.checked });
        chrome.storage.sync.set({ AutoGenerateCategories_Checkbox_Value: AutoGenerateCategories_Checkbox.checked });
        chrome.storage.sync.set({ GenerateUnica_Checkbox_Value: GenerateUnica_Checkbox.checked });
        chrome.storage.sync.set({ AutoDeleteCategories_Checkbox_Value: AutoDeleteCategories_Checkbox.checked });
        chrome.storage.sync.set({ AutoMoveItems_Checkbox_Value: AutoMoveItems_Checkbox.checked });
        chrome.storage.sync.set({ TopCategory: topCategory });
        ReloadCategories();
        console.log("Saved settings");
      }