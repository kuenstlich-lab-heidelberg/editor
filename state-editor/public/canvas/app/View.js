

View = draw2d.Canvas.extend({
	
	init:function(id)
    {
		this._super(id, 4000,2000);
        this.installEditPolicy(  new draw2d.policy.connection.DragConnectionCreatePolicy({
            createConnection: function(){
                return new TriggerConnection();
            }
        }));
    
        this.getCommandStack().addEventListener((e)=>{
            if(e.isPostChangeEvent()){
                var writer = new draw2d.io.json.Writer();
                writer.marshal(this, function(json){
                    if( json.length ===0)
                        return
                    window.parent.postMessage({ type: 'updateDocumentData', data: json }, '*');
                });                
            }
        });
	},

    getFigure: function(id)
    {
        let result = null

        this.getFigures().each( (i, figure)=> {
            if(result !== null){
                return false
            }
            if(figure.id === id ){
                result = figure;
                return false
            }
            figure.children.each(function (i, entry) {
                console.log("entry", entry)
                let child = entry.figure
                if(child.id === id ){
                    result = child;
                    return false
                }
              })
        });
        console.log(result)
        return result
    },

    setShapeData: function(data){
        var shape = this.getFigure(data.id)
        if(shape){
            shape.attr(data)
        }
        else {
            shape = this.getLine(data.id)
            if(shape){
                shape.attr( {
                    name: data.name,
                    userData: data.userData
                })
            }
        }
        var writer = new draw2d.io.json.Writer();
        writer.marshal(this, function(json){
            if( json.length ===0)
                return
            window.parent.postMessage({ type: 'updateDocumentData', data: json }, '*');
        });                

        return this
    },

    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Draw2D use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @private
     **/
    onDrop : function(droppedDomNode, x, y, shiftKey, ctrlKey)
    {
        var type = $(droppedDomNode).data("shape");
        var figure = eval("new "+type+"();");
        
        figure.addEntity("id");
        figure.setName("NewTable");
        
        // create a command for the undo/redo support
        var command = new draw2d.command.CommandAdd(this, figure, x, y);
        this.getCommandStack().execute(command);
    }
});

