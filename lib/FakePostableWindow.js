var using = require('typester').using;
var FakeWindowRef = require('./FakeWindowRef');

function FakePostableWindow() {
  this.windowRefs = {};
}

FakePostableWindow.prototype.windowRef = function(origin) {
  using(arguments)
    .verify('origin').nonEmptyString();

  if(!(origin in this.windowRefs)) {
    this.windowRefs[origin] = new FakeWindowRef(this, origin);
  }

  return this.windowRefs[origin];
};

module.exports = FakePostableWindow;
