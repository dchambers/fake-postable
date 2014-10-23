var topiarist = require('topiarist');
var using = require('typester').using;
var deepEqual = require('deep-equal');
var AbstractPostableRef = require('./AbstractPostableRef');

function FakeWorkerRef() {
  AbstractPostableRef.call(this);
  this.siblingRef = null;
}
topiarist.extend(FakeWorkerRef, AbstractPostableRef);

FakeWorkerRef.prototype.postMessage = function(message, transferList) {
  using(arguments)
    .verify('message').object()
    .verify('transferList').optionally.isA(Array);

  var messageData = messageEvent(message);

  for(var listenerIndex in this.siblingRef.listeners) {
    var listener = this.siblingRef.listeners[listenerIndex];

    listener(messageData);
  }
};

function messageEvent(data) {
  var serializedData = JSON.parse(JSON.stringify(data));
  if(!deepEqual(data, serializedData)) throw new Error('postMessage() invoked with unserializable data');

  return {
    data: serializedData
  };
}

module.exports = FakeWorkerRef;
