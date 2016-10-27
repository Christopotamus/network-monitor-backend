'use strict';
var ping = require('ping');

module.exports = {
  app:{},
  Node:{},
  nodes: [],

  setup(){
    this.app = require('./server');
    this.Node = this.app.models.Node;

    this.Node.find((err,r_nodes) => {
      this.nodes = r_nodes;
      this.nodes.forEach((n) => {
        this.startPollingNode(n)
      });
    });
  },
  upsertNode(node){
    var updated = false;

    this.nodes.map((n) => {
      if(node.id == n.id){
        n = node;
      } 

    });
    if(updated == false){
      this.nodes.push(node); 
    }  
    
      this.startPollingNode(node);
  }, 
  startPollingNode(n){
    //for each node, start a ping every 5 seconds, and if they're down update the model
    var cfg = {
      timeout: 10,
      extra: ["-c 5"],
    };
      this.Node.findById(n.id, (err,node) => {
        //console.log(node);
        ping.sys.probe(node.address, (isAlive) => {
          node.updateAttribute("active", isAlive);
          console.log("node %s is: %s", node.address,(isAlive) ? "Up" : "Down" );
          //this.startPollingNode(node); 
        }, cfg);
      });
  }

  
};
