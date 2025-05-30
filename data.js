class GradeCategory{
    constructor (parent, name, id, percent, visible, maxGrade, minGradeToPass){
        this.parent = parent;
        this.name = name;
        this.id = id;
        this.percent = percent;
        this.visible = visible;
        this.maxGrade = maxGrade;
        this.minGradeToPass = minGradeToPass;
        this.children = [];
    }
    validate(){
        if(this.children.length > 0){
            for(var i = 0; i < this.children.length; i++){
                if(typeof this.children[i].AppendCategory == "undefined"){
                    this.children[i] = Object.assign(new GradeCategory(), this.children[i]);
                    this.children[i].parent = this;
                }
            }
        }
    }
    addChild(childCategory){
        childCategory.parent = this;
        this.children.push(childCategory);
        return childCategory;
    }
    createChild(){
        return this.addChild(new GradeCategory(this, this.id + "_" + this.children.length, this.id + "_" + this.children.length, null, true, 10));
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
        this.AddTextFloating(group, this.id, "Name", this.name);
        this.AddTextFloating(group, this.id, "Id", this.id);
        this.AddTextFloating(group, this.id, "%", this.percent);
        this.AddTextFloating(group, this.id, "Max", this.mamGrade);
        var check = $('<div class="input-group-text"></div>').appendTo(group);
        if(typeof FindCategoryInGradebook != "undefined"){
            $('<input class="form-check-input mt-0" type="checkbox" value="" disabled>').appendTo(check);
        }
        $('<button class="btn btn-sm btn-outline-success" type="button" id="' + this.id + '_Add">Add</button>').appendTo(group).on( "click", function(e) {
            AddCategory(FindCategoryById($(e.target).attr("id").replace("_Add", "")));
            ReloadCategories();
        } );
        if(this.parent != null && this.parent != undefined){
            $('<button class="btn btn-sm btn-outline-danger" type="button" id="' + this.id + '_Remove">Remove</button>').appendTo(group).on( "click", function(e) {
                RemoveCategory(FindCategoryById($(e.target).attr("id").replace("_Remove", "")));
                ReloadCategories();
            } );
        }
    }
    AddTextFloating(parent, id, name, value){
        if(value == undefined || value == null){
        return $('<div class="form-floating"> <input type="text" class="form-control form-control-sm" id="' + id + '" placeholder="' + name + '"> <label for="' + id + '">' + name + '</label> </div>').appendTo(parent);
        }
        return $('<div class="form-floating"> <input type="text" class="form-control form-control-sm" id="' + id + '" placeholder="' + name + '" value="' + value + '"> <label for="' + id + '">' + name + '</label> </div>').appendTo(parent);
    }
}