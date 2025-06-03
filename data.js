class GradeCategory{
    constructor (parent, name, id, percent, visible, maxGrade, minGradeToPass){
        this.parent = parent;
        this.name = name;
        this.id = id;
        this.percent = percent;
        this.visible = visible;
        this.maxGrade = maxGrade;
        this.minGradeToPass = minGradeToPass;
        this.categoryHeader = null;
        this.moodleId = null;
        this.children = [];
    }
    get internalId() {
        var intId = "";
        if(this.parent != undefined && this.parent != null){
            var index = this.parent.children.indexOf(this);
            intId = this.parent.internalId + "-" + index;
        }
        else{
            intId = "0";
        }
        return intId;
    }
    validate(){
        if(this.children.length > 0){
            for(var i = 0; i < this.children.length; i++){
                if(typeof this.children[i].validate == "undefined"){
                    this.children[i] = Object.assign(new GradeCategory(), this.children[i]);
                    this.children[i].parent = this;
                }
                this.children[i].validate();
            }
        }
    }
    addChild(childCategory){
        childCategory.parent = this;
        this.children.push(childCategory);
        return childCategory;
    }
    createChild(){
        var newCat = new GradeCategory(this, this.id + "-" + this.children.length, this.id + "-" + this.children.length, null, true, 10);

        if(this.children.length > 0){
            var lastChild = this.children[this.children.length - 1];
            var lastNumber = parseInt(lastChild.id.substr(-1));
            if(Number.isInteger(lastNumber)){
                lastNumber++;
                var name = lastChild.id.slice(0,-1) + lastNumber;
                newCat.id = name;
                newCat.name = name;
            }
        }
        return this.addChild(newCat);
    }
    update(){
        var intId = this.internalId;
        this.name = $("#" + intId + "_Name").val();
        this.id = $("#" + intId + "_Id").val();
        this.percent = $("#" + intId + "_Perc").val();
        this.max = $("#" + intId + "_Max").val();
        for(var i = 0; i < this.children.length; i++){
            this.children[i].update();
        }
    }
    AppendCategory(parent){
        var container = $('<div class="ps-4">').appendTo(parent);
        this.AddCategoryControls(container);
        if(this.children.length > 0){
            for(var i = 0; i < this.children.length; i++){
                this.children[i].AppendCategory(container);
            }
        }
    }
    AddCategoryControls(parent){
        var group = $('<div class="input-group input-group-sm mb-1"></div>').appendTo(parent);
        var intId = this.internalId;
        var created = "";
        if(this.categoryHeader === undefined){
            created = "bg-danger-subtle";
        }else if(this.categoryHeader !== null){
            created = "bg-success-subtle";
        }
        $('<div class="input-group-text ' + created + '">' + intId +'</div>').appendTo(group);
        this.AddTextFloating(group, intId + "_Name", "Name", this.name);
        this.AddTextFloating(group, intId + "_Id", "Id", this.id);
        this.AddTextFloating(group, intId + "_Perc", "%", this.percent);
        this.AddTextFloating(group, intId + "_Max", "Max", this.maxGrade);
        $('<button class="btn btn-sm btn-outline-success small" type="button" title="Add new child" id="' + intId + '_Add">+</button>').appendTo(group).on( "click", function(e) {
            UpdateCategories();
            AddCategory(FindCategoryByInternalId($(e.target).attr("id").replace("_Add", "")));
            ReloadCategories();
        } );
        $('<button class="btn btn-sm btn-outline-danger small" type="button" title="Delete" id="' + intId + '_Remove">-</button>').appendTo(group).on( "click", function(e) {
            UpdateCategories();
            RemoveCategory(FindCategoryByInternalId($(e.target).attr("id").replace("_Remove", "")));
            ReloadCategories();
        } );
        if(this.parent != null && this.parent != undefined){
            $('<button class="btn btn-sm btn-outline-secondary small" type="button" title="Order up" id="' + intId + '_Up">↑</button>').appendTo(group).on( "click", function(e) {
                UpdateCategories();
                MoveCategory(FindCategoryByInternalId($(e.target).attr("id").replace("_Up", "")),-1);
                ReloadCategories();
            } );
            $('<button class="btn btn-sm btn-outline-secondary small" type="button" title="Order down" id="' + intId + '_Down">↓</button>').appendTo(group).on( "click", function(e) {
                UpdateCategories();
                MoveCategory(FindCategoryByInternalId($(e.target).attr("id").replace("_Down", "")),1);
                ReloadCategories();
            } );
            $('<button class="btn btn-sm btn-outline-secondary small" type="button" title="Move to parent" id="' + intId + '_Parent">↰</button>').appendTo(group).on( "click", function(e) {
                UpdateCategories();
                ChangeParentCategory(FindCategoryByInternalId($(e.target).attr("id").replace("_Parent", "")));
                ReloadCategories();
            } );
        }
    }
    AddTextFloating(parent, id, name, value){
        if(value == undefined || value == null){
        return $('<input type="text" class="form-control form-control-sm py-1" style="max-height:2rem;min-height:2rem;height:2rem;" id="' + id + '" placeholder="' + name + '" title="' + name + '">').appendTo(parent);
        }
        return $('<input type="text" class="form-control form-control-sm py-1" style="max-height:2rem;min-height:2rem;height:2rem;" id="' + id + '" placeholder="' + name + '" title="' + name + '" value="' + value + '">').appendTo(parent);
    }
}

class GradeItem{

}
