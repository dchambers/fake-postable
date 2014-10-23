var Postable = require('../../lib/fake-postable.js');
var ArgumentError = require('typester').ArgumentError;
var sinon = require('sinon');

describe('postable-worker', function() {
  var postable, windowRef, workerRef;

  beforeEach(function() {
    postable = Postable.postableWorker();
    windowRef = postable.windowRef();
    workerRef = postable.workerRef();
  });

  it('throws an error if addEventListener() is invoked without any arguments', function() {
    (function() {
      windowRef.addEventListener();
    }).should.throw(ArgumentError);
  });

  it('throws an error if addEventListener() is invoked for anything other than "message"', function() {
    (function() {
      windowRef.addEventListener('messages', function() {}, false);
    }).should.throw("Only type arguments with the value 'message' are supported");
  });

  it('throws an error if postMessage() is invoked without any arguments', function() {
    (function() {
      windowRef.postMessage();
    }).should.throw(ArgumentError);
  });

  it('throws an error if a non-serializable object is passed to postMessage()', function() {
    (function() {
      windowRef.postMessage({func: function() {}});
    }).should.throw('postMessage() invoked with unserializable data');
  });

  it('only sends messages to listeners on the other side (window -> worker)', function() {
    var windowListener = sinon.spy();
    var workerListener = sinon.spy();
    windowRef.addEventListener('message', windowListener, false);
    workerRef.addEventListener('message', workerListener, false);
    windowRef.postMessage({message: 'abc'});

    windowListener.should.have.callCount(0);
    workerListener.should.have.been.calledWith({data: {message: 'abc'}});
  });

  it('only sends messages to listeners on the other side (worker -> window)', function() {
    var windowListener = sinon.spy();
    var workerListener = sinon.spy();
    windowRef.addEventListener('message', windowListener, false);
    workerRef.addEventListener('message', workerListener, false);
    workerRef.postMessage({message: 'abc'});

    windowListener.should.have.been.calledWith({data: {message: 'abc'}});
    workerListener.should.have.callCount(0);
  });

  it('should send messages to all listeners registered on the same window', function() {
    var listener1 = sinon.spy();
    var listener2 = sinon.spy();

    windowRef.addEventListener('message', listener1, false);
    windowRef.addEventListener('message', listener2, false);
    workerRef.postMessage({message: 'abc'});

    listener1.should.have.been.calledWith({data: {message: 'abc'}});
    listener2.should.have.been.calledWith({data: {message: 'abc'}});
  });
});
