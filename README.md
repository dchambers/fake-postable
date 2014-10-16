# Fake-Postable

Fake postMessage() / addEventListener() implementations.

## Introduction

This library makes it possible to unit-test libraries that depend on objects that can be posted to (using `postMessage(...)`) and listened to (using `addEventListener('message', ...)`). Although there is no official generic name for such objects, I refer to them collectively as being _postable_.

_Postable_ objects either implement this interface:

```
postMessage(message, targetOrigin, transferList);
addEventListener(type, listener, useCapture);
```

if they happen to be a window, a frame or an iframe. Or this interface:

```
postMessage(message, transferList);
addEventListener(type, listener, useCapture);
```

if they happen to be a web-worker.

As there are slight differences in the behaviour of _postable_ web-workers compared to _postable_ windows frames and iframes, there are accordingly two fake _postable_ implementations provided. Not only does using fakes mean that you can run your tests outside of a browser, but it also allows you to simulate cross-origin messaging, where there is communication between different domains.

The examples that follow are written as they would be for Node.js, but this is not a requirement.

## Window Style Postables

 Here is an example of how a window-style _postable_ might be used:

```
var Postable = require('fake-postable');
var postable = Postable.postableWindow();
var fooWindowRef = postable.windowRef('http://foo.com');
var barWindowRef = postable.windowRef('http://bar.com');

fooWindowRef.addEventListener('message', function(event) {
	if(event.origin == 'http://bar.com') {
		console.log(event.data.message);
	}
	else if(event.origin == 'http://foo.com') {
		console.log('selfie: ' + event.data.message);
	}
}, false);

fooWindowRef.postMessage({message: 'foo -> *'}, '*');
fooWindowRef.postMessage({message: 'foo -> bar'}, 'http://bar.com');

barWindowRef.postMessage({message: 'bar -> *'}, '*');
barWindowRef.postMessage({message: 'bar -> foo'}, 'http://foo.com');
```

This program produces the following log output:

```
selfie: foo -> *
bar -> *
bar -> foo
```

## Worker Style Postables

Here is an example of how a worker-style _postable_ might be used:

```
var Postable = require('fake-postable');
var postable = Postable.postableWorker();
var windowRef = postable.windowRef();
var workerRef = postable.workerRef();

windowRef.addEventListener('message', function(event) {
	console.log(event.data.message);
}, false);

// this will only be received by the worker
windowRef.postMessage({message: 'ping'});

windowRef.addEventListener('message', function(event) {
	// this will only be received by the window
	windowRef.postMessage({message: event.data.message + '-pong'});
}, false);
```

This program produces the following log output:

```
ping-pong
```

## Structured Clone Algorithm

Whereas native _postable_ objects accept any _message_ that can be transferred using the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm), the fake _postable_ implementations are more limited, and will only carry _messages_ that can be serialized to JSON. This should be more than sufficient for testing purposes.

## Transferables

Native _postables_ support _transferrable_ objects, that are passed by reference rather than copied, and which cease to be available on the originating side after they are posted. Since this can not be simulated, and has very limited affect on program behaviour anyway, the `transferList` argument is ignored.

