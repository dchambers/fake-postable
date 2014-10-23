var topiarist = require('topiarist');
var using = require('typester').using;
var deepEqual = require('deep-equal');
var AbstractPostableRef = require('./AbstractPostableRef');

function FakeWindowRef(fakePostableWorker, origin) {
  AbstractPostableRef.call(this);
  this.fakePostableWorker = fakePostableWorker;
  this.origin = origin;
}
topiarist.extend(FakeWindowRef, AbstractPostableRef);

FakeWindowRef.prototype.postMessage = function(message, targetOrigin, transferList) {
  using(arguments)
    .verify('message').object()
    .verify('targetOrigin').nonEmptyString()
    .verify('transferList').optionally.isA(Array);

  var targetWindowRefs = (targetOrigin == '*') ? this.fakePostableWorker.windowRefs :
    [this.fakePostableWorker.windowRef(targetOrigin)];
  var messageData = messageEvent(message, this.origin);

  for(var windowRefIndex in targetWindowRefs) {
    var targetWindowRef = targetWindowRefs[windowRefIndex];

    for(var listenerIndex in targetWindowRef.listeners) {
      var listener = targetWindowRef.listeners[listenerIndex];

      listener(messageData);
    }
  }
};

function messageEvent(data, origin) {
  var serializedData = JSON.parse(JSON.stringify(data));
  if(!deepEqual(data, serializedData)) throw new Error('postMessage() invoked with unserializable data');

  return {
    data: serializedData,
    origin: origin
  };
}

module.exports = FakeWindowRef;
