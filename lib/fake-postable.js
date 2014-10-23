var FakePostableWindow = require('./FakePostableWindow');
var FakePostableWorker = require('./FakePostableWorker');

function Postable() {
}

Postable.postableWindow = function() {
  return new FakePostableWindow();
};

Postable.postableWorker = function() {
  return new FakePostableWorker();
};

module.exports = Postable;
