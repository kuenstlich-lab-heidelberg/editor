

var TriggerLabel = draw2d.shape.basic.Label.extend({
    NAME: "TriggerLabel",

    init:function(txt)
    {

      this._super({
            text:txt,
            radius:10,
            padding:{left:10, top:3, right:10, bottom:5},
            fontColor:"#4a4a4a",
            bgColor: "#eeb5dd",
            color : "#d44aa8",
            resizeable:true,
            editor:new draw2d.ui.LabelEditor(),
            userData: {
                actions: [],
                conditions: []
              }
        },
        {
            name: this.setName,
        },
        {
            name: this.getName,
        });
    },

    getConditions: function()
    {
        return this.getUserData().conditions
    },

    setConditions: function(conditions)
    {
        this.getUserData().conditions = conditions
    },

    getActions: function()
    {
        return this.getUserData().actions
    },

    setActions: function(actions)
    {
        this.getUserData().actions = actions
    },

     /**
      * @method
      * Set the name of the DB table. Visually it is the header of the shape
      * 
      * @param name
      */
     setName: function(name)
     {
         this.setText(name);
         return this;
     },
      
      
     getName: function()
     {
         return this.getText();
     },
      
    onDrag: function(dx, dy, dx2, dy2, shiftKey, ctrlKey)
    {
        return false;
    },
});
