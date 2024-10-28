

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
            editor:new draw2d.ui.LabelEditor()
        });
    },

      
    onDrag: function(dx, dy, dx2, dy2, shiftKey, ctrlKey)
    {
        return false;
    },


});
