var using = require('typester').using;

function AbstractPostableRef() {
  this.listeners = [];
}

AbstractPostableRef.prototype.addEventListener = function(type, listener, useCapture) {
  using(arguments)
    .verify(type).isA(String)
    .verify(listener).isA(Function)
    .verify(useCapture).optionally.isA(Boolean);

  if(type != 'message') throw new Error("Only type arguments with the value 'message' are supported");

  this.listeners.push(listener);
};

module.exports = AbstractPostableRef;
