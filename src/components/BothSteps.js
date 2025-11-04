var React = require('react');
var stepBuilders = require('../utils/stepBuilders');

function BothSteps(props) {
  return [
    stepBuilders.setupWorkspace(props),
    stepBuilders.createCherryPickStep(props, 2),
    stepBuilders.navigateToDockerCompose(props, 3),
    stepBuilders.manualHandleImageTag(props, 4),
    stepBuilders.uploadWorkflow(props, 5),
    stepBuilders.launchWorkflow(props, 6)
  ];
}

module.exports = BothSteps;