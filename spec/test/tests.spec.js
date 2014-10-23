// install chai
var chai = require('chai');
chai.should();
chai.use(require("sinon-chai"));

require('./postable-window.js');
require('./postable-worker.js');
