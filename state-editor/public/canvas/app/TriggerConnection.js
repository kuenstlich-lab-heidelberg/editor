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

    init:function(attr)
    {
      this._super({
                targetDecorator: new draw2d.decoration.connection.ArrowDecorator(),
                stroke:3,
                outlineStroke:1,
                outlineColor:"#303030",
                color:"91B93E",
                router:routerToUse
            });
    
      // Create any Draw2D figure as decoration for the connection
      //
      this.label = new draw2d.shape.basic.Label({
          text:"trigger_name_to_fire",
          color:"#0d0d0d",
          fontColor:"#0d0d0d",
          bgColor:"#f0f0f0"
      });
      
      // add the new decoration to the connection with a position locator.
      //
      this.add(this.label, new draw2d.layout.locator.ManhattanMidpointLocator());
      
      this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
    }
});
