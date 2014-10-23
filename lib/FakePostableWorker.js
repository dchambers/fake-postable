var FakeWorkerRef = require('./FakeWorkerRef');

function FakePostableWorker() {
  this._windowRef = new FakeWorkerRef();
  this._workerRef = new FakeWorkerRef();
  this._windowRef.siblingRef = this._workerRef;
  this._workerRef.siblingRef = this._windowRef;
}

FakePostableWorker.prototype.windowRef = function() {
  return this._windowRef;
};

FakePostableWorker.prototype.workerRef = function() {
  return this._workerRef;
};

module.exports = FakePostableWorker;
