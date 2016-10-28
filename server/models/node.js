'use strict';

module.exports = function(Node) {
  
  Node.observe('after save', function(ctx, next){
    if(ctx.instance){
      if(Node.app.io){
        console.log("emitting node-created");
        Node.app.io.emit('node-created',ctx.instance);
        Node.app.polling.upsertNode(ctx.instance);
        //Node.app.polling.startPollingNode(ctx.instance);
      }
    }else{
      if(Node.app.io){
        console.log("emitting node-updated");
        Node.app.io.emit('node-updated',ctx.instance);
        Node.app.polling.upsertNode(ctx.instance);
      }
    }
    next();
  });
  Node.observe('after delete', function(ctx, next){
    Node.app.io.emit('node-deleted', ctx.where);
    Node.app.polling.removeNode(ctx.where);
    next();
  });
     
};
