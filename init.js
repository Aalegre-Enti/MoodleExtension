var topCategory;

$( document ).ready(function() {
    LoadSettings();
    SkipRecalculatingGrades_Checkbox.addEventListener("change", SaveSettings);

    
});
      function LoadSettings(){
        console.log("Loading settings");
        chrome.storage.sync.get('SkipRecalculatingGrades_Checkbox_Value', function(data) {
            SkipRecalculatingGrades_Checkbox.checked = data.SkipRecalculatingGrades_Checkbox_Value;
        });
        chrome.storage.sync.get('AutoGenerateCategories_Checkbox_Value', function(data) {
            AutoGenerateCategories_Checkbox.checked = data.AutoGenerateCategories_Checkbox_Value;
        });
        chrome.storage.sync.get('TopCategory', function(data) {
            topCategory = Object.assign(new GradeCategory(), data.TopCategory);
            topCategory.validate();
            ReloadCategories();
        });
      }
      function FindCategoryById(id){
        return FindCategory(id, topCategory);
      }
      function FindCategory(id, parent){
        if(parent.id === id){
            return parent;
        }
        else{
            for(var i = 0; i < parent.children.length; i++){
                var found = FindCategory(id, parent.children[i]);
                if(found != undefined && found != null){
                    return found;
                }
            }
        }
      }
      function AddCategory(parent){
        parent.createChild();
        SaveSettings();
      }
      function RemoveCategory(category){
        var index = category.parent.children.indexOf(category);
        if (index !== -1) {
            category.parent.children.splice(index, 1);
        }
        SaveSettings();
      }
      function ReloadCategories(){
            if(topCategory.id == undefined){
                topCategory = new GradeCategory(null, "Grade category", "ID", null, true, 10, 5);
                var av = topCategory.addChild(new GradeCategory(top, "Avaluació", "AV", null, true, 10, 5));
                av.addChild(new GradeCategory(top, "AA1", "AA1", 100, true, 10))
                var rv = topCategory.addChild(new GradeCategory(top, "Reavaluació", "RV", null, true, 10, 5));
                rv.addChild(new GradeCategory(top, "AR1", "AR1", 100, true, 10))
            }
            $(CategoriesBody).empty();
            topCategory.AppendCategory(CategoriesBody);
      }
      function SaveSettings(){
        console.log("Saving settings");
        chrome.storage.sync.set({ SkipRecalculatingGrades_Checkbox_Value: SkipRecalculatingGrades_Checkbox.checked });
        chrome.storage.sync.set({ AutoGenerateCategories_Checkbox_Value: AutoGenerateCategories_Checkbox.checked });
        chrome.storage.sync.set({ TopCategory: topCategory });
        ReloadCategories();
        console.log("Saved settings");
      }