
StateShape = draw2d.shape.layout.VerticalLayout.extend({

	NAME: "StateShape",
	
    init : function(attr, setter, getter)
    {
    	this._super(
            extend({
                bgColor:null, 
                color:"#d7d7d7", 
                stroke:1, 
                gap: 5,
                radius:3,
                userData: {
                    system_prompt: ""
                }
            },attr),
            extend({
              name: this.setName,
            }, setter),
            extend({
              name: this.getName,
            }, getter))
            
      
        this.classLabel = new draw2d.shape.basic.Label({
            text:"ClassName", 
            stroke:1,
            fontColor:"#5856d6",  
            bgColor:"#f7f7f7", 
            radius: 0, 
            padding:10,
            resizeable:true,
            editor:new draw2d.ui.LabelInplaceEditor()
        });
       
        // flag which indicates if the figure should read/write ports to
        // JSON
        this.persistPorts = false
        var input = this.classLabel.createPort("input");
        var output= this.classLabel.createPort("output");
        
        this.add(this.classLabel);
    },
     
 
    /**
     * @method
     * Add an entity to the db shape
     * 
     * @param {String} txt the label to show
     * @param {Number} [optionalIndex] index where to insert the entity
     */
    addTrigger: function(txt, optionalIndex)
    {
	   	 var label =new TriggerLabel(txt);
         
         var _table=this;
         label.on("contextmenu", function(emitter, event){
             $.contextMenu({
                 selector: 'body', 
                 events:
                 {  
                     hide:function(){ $.contextMenu( 'destroy' ); }
                 },
                 callback: $.proxy(function(key, options) 
                 {
                    switch(key){
                    case "rename":
                        setTimeout(function(){
                            emitter.onDoubleClick();
                        },10);
                        break;
                    case "new":
                        setTimeout(function(){
                            _table.addTrigger("_new_").onDoubleClick();
                        },10);
                        break;
                    case "delete":
                        // with undo/redo support
                        var cmd = new draw2d.command.CommandDelete(emitter);
                        emitter.getCanvas().getCommandStack().execute(cmd);
                    default:
                        break;
                    }
                 
                 },this),
                 x:event.x,
                 y:event.y,
                 items: 
                 {
                     "rename": {name: "Rename"},
                     "new":    {name: "New Trigger"},
                     "sep1":   "---------",
                     "delete": {name: "Delete"}
                 }
             });
         });
         
	     if($.isNumeric(optionalIndex)){
             this.add(label, null, optionalIndex+1);
	     }
	     else{
	         this.add(label);
	     }
         label.setSelectionAdapter(null);

	     return label;
    },
    
    /**
     * @method
     * Remove the entity with the given index from the DB table shape.<br>
     * This method removes the entity without care of existing connections. Use
     * a draw2d.command.CommandDelete command if you want to delete the connections to this entity too
     * 
     * @param {Number} index the index of the entity to remove
     */
    removeTrigger: function(index)
    {
        this.remove(this.children.get(index+1).figure);
    },

    /**
     * @method
     * Returns the entity figure with the given index
     * 
     * @param {Number} index the index of the entity to return
     */
    getTrigger: function(index)
    {
        return this.children.get(index+1).figure;
    },
     

     /**
      * @method
      * Set the name of the DB table. Visually it is the header of the shape
      * 
      * @param name
      */
    setName: function(name)
    {
        this.classLabel.setText(name);
        return this;
    },
     
     
    getName: function()
    {
        return this.classLabel.getText();
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

        memento.name = this.classLabel.getText();
        memento.trigger   = [];
        this.children.each(function(i,e){
            
            if(i>0){ // skip the header of the figure
                memento.trigger.push({
                    name:e.figure.getName(),
                    conditions: e.figure.getConditions(),
                    actions: e.figure.getActions()
                });
            }
        });
         
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

         if(typeof memento.trigger !== "undefined"){
             $.each(memento.trigger, $.proxy(function(i,e){
                 var trigger =this.addTrigger(e.name ?? "undefined");
                 trigger.setConditions(e.conditions ?? [])
                 trigger.setActions(e.actions ?? [])
             },this));
         }

         return this;
     }  

});
