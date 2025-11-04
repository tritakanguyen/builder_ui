var React = require('react');
var stepBuilders = require('../utils/stepBuilders');

function CherryPickOnlySteps(props) {
  return [
    stepBuilders.setupWorkspace(props),
    stepBuilders.createCherryPickStep(props, 2),
    stepBuilders.uploadWorkflow(props, 3),
    stepBuilders.launchWorkflow(props, 4)
  ];
}

module.exports = CherryPickOnlySteps;