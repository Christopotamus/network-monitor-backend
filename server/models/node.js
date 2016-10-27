'use strict';

module.exports = function(Node) {
  
  Node.observe('after save', function(ctx, next){
    if(ctx.instance){
      if(Node.app.io){
        Node.app.io.emit('node-created',ctx.instance);
        Node.app.polling.upsertNode(ctx.instance);
        //Node.app.polling.startPollingNode(ctx.instance);
      }
    }else{
      if(Node.app.io){
        Node.app.io.emit('node-updated',ctx.instance);
        Node.app.polling.upsertNode(ctx.instance);
      }
    }
    next();
  });
  
};
