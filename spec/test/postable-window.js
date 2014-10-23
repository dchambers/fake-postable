var Postable = require('../../lib/fake-postable.js');
var ArgumentError = require('typester').ArgumentError;
var ValidationError = require('typester').ValidationError;
var sinon = require('sinon');

describe('postable-window', function() {
  var postable;

  beforeEach(function() {
    postable = Postable.postableWindow();
  });

  describe('postableWindow()', function() {
    it('throws an error if windowRef() is invoked without any arguments', function() {
      (function() {
        postable.windowRef();
      }).should.throw(ArgumentError);
    });

    it('throws an error if windowRef() is invoked with an empty string', function() {
      (function() {
        postable.windowRef('');
      }).should.throw(ValidationError);
    });
  });

  describe('windowRef', function() {
    var fooWindowRef, barWindowRef;

    beforeEach(function() {
      fooWindowRef = postable.windowRef('http://foo.com');
      barWindowRef = postable.windowRef('http://bar.com');
    });

    it('throws an error if addEventListener() is invoked without any arguments', function() {
      (function() {
        fooWindowRef.addEventListener();
      }).should.throw(ArgumentError);
    });

    it('throws an error if addEventListener() is invoked for anything other than "message"', function() {
      (function() {
        fooWindowRef.addEventListener('messages', function() {}, false);
      }).should.throw("Only type arguments with the value 'message' are supported");
    });

    it('should allow postMessage() to be invoked even when there are no listeners', function() {
      fooWindowRef.postMessage({message: 'abc'}, 'http://foo.com');
      fooWindowRef.postMessage({message: 'abc'}, '*');
    });

    it('throws an error if postMessage() is invoked without any arguments', function() {
      (function() {
        fooWindowRef.postMessage();
      }).should.throw(ArgumentError);
    });

    it('throws an error if a non-serializable object is passed to postMessage()', function() {
      (function() {
        fooWindowRef.postMessage({func: function() {}}, '*');
      }).should.throw('postMessage() invoked with unserializable data');
    });

    it('should allows messages to be posted to itself using an explicit origin', function() {
      var listener = sinon.spy();
      fooWindowRef.addEventListener('message', listener, false);
      fooWindowRef.postMessage({message: 'abc'}, 'http://foo.com');

      listener.should.have.been.calledWith({data: {message: 'abc'}, origin: 'http://foo.com'});
    });

    it('should allows messages to be posted to itself using a wildcard origin', function() {
      var listener = sinon.spy();
      fooWindowRef.addEventListener('message', listener, false);
      fooWindowRef.postMessage({message: 'abc'}, '*');

      listener.should.have.been.calledWith({data: {message: 'abc'}, origin: 'http://foo.com'});
    });

    it('should allows messages to be posted to a foreign window using an explicit origin', function() {
      var fooListener = sinon.spy();
      var barListener = sinon.spy();
      fooWindowRef.addEventListener('message', fooListener, false);
      barWindowRef.addEventListener('message', barListener, false);
      barWindowRef.postMessage({message: 'abc'}, 'http://foo.com');

      fooListener.should.have.been.calledWith({data: {message: 'abc'}, origin: 'http://bar.com'});
      barListener.should.have.callCount(0);
    });

    it('should allows messages to be posted to a foreign window using a wildcard origin', function() {
      var fooListener = sinon.spy();
      var barListener = sinon.spy();
      fooWindowRef.addEventListener('message', fooListener, false);
      barWindowRef.addEventListener('message', barListener, false);
      barWindowRef.postMessage({message: 'abc'}, '*');

      fooListener.should.have.been.calledWith({data: {message: 'abc'}, origin: 'http://bar.com'});
      barListener.should.have.been.calledWith({data: {message: 'abc'}, origin: 'http://bar.com'});
    });

    it('should send messages to all listeners registered on the same window', function() {
      var listener1 = sinon.spy();
      var listener2 = sinon.spy();
      fooWindowRef.addEventListener('message', listener1, false);
      fooWindowRef.addEventListener('message', listener2, false);
      fooWindowRef.postMessage({message: 'abc'}, 'http://foo.com');

      listener1.should.have.been.calledWith({data: {message: 'abc'}, origin: 'http://foo.com'});
      listener2.should.have.been.calledWith({data: {message: 'abc'}, origin: 'http://foo.com'});
    });
  });
});
