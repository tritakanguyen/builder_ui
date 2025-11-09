var React = require('react');
var stepBuilders = require('../utils/stepBuilders');

function BothSteps(props) {
  return [
    stepBuilders.setupWorkspace(props),
    stepBuilders.createCherryPickStep(props, 2),
    stepBuilders.manualHandleImageTag(props, 3),
    stepBuilders.uploadWorkflow(props, 4),
    stepBuilders.launchWorkflow(props, 5)
  ];
}

module.exports = BothSteps;