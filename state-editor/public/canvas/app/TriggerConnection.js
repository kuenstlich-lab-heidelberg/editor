/**
 * @class example.connection_labeledit.LabelConnection
 * 
 * A simple Connection with a label wehich sticks in the middle of the connection..
 *
 * @author Andreas Herz
 * @extend draw2d.Connection
 */
var routerToUse =new draw2d.layout.connection.InteractiveManhattanConnectionRouter();

var TriggerConnection= draw2d.Connection.extend({
    NAME: "TriggerConnection",

    init:function(attr, setter, getter)
    {
      this._super(
            extend({
                targetDecorator: new draw2d.decoration.connection.ArrowDecorator(),
                stroke:3,
                outlineStroke:1,
                outlineColor:"#303030",
                color:"91B93E",
                router:routerToUse
            }, attr),
            extend({
                name: this.setName,
            }, setter),
            extend({
                name: this.getName,
            }, getter));
    
      // Create any Draw2D figure as decoration for the connection
      //
      this.label = new draw2d.shape.basic.Label({
          text:"trigger_name_to_fire",
          color:"#0d0d0d",
          radius: 10,
          fontColor:"#0d0d0d",
          bgColor: "#eeb5dd",
          color : "#d44aa8"
      });
      
      // add the new decoration to the connection with a position locator.
      //
      this.add(this.label, new draw2d.layout.locator.ManhattanMidpointLocator());
      
      this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
    },

    /**
     * @method
     * Set the name of the DB table. Visually it is the header of the shape
     * 
     * @param name
     */
    setName: function(name)
    {
        this.label.setText(name);
        return this;
    },
        
    getName: function()
    {
        return this.label.getText();
    },
      
     /**
      * @method 
      * Return an objects with all important attributes for XML or JSON serialization
      * 
      * @returns {Object}
      */
     getPersistentAttributes : function()
     {
        var memento= this._super();
        delete memento.router

        memento.name = this.getName();
         
        return memento;
     },
     
     /**
      * @method 
      * Read all attributes from the serialized properties and transfer them into the shape.
      *
      * @param {Object} memento
      * @return
      */
     setPersistentAttributes : function(memento)
     {
         this._super(memento);
         
         this.setName(memento.name);

         return this;
     }  
});
