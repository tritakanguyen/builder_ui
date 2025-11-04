var React = require('react');
var stepBuilders = require('../utils/stepBuilders');

function ImageTagOnlySteps(props) {
  var imageTagValue = props.imageTagValue;
  var steps = [stepBuilders.setupWorkspace(props)];

  if (imageTagValue && imageTagValue.trim()) {
    steps.push(stepBuilders.navigateToDockerCompose(props, 2));
    steps.push(stepBuilders.manualHandleImageTag(props, 3));
  }

  var nextStepNum = imageTagValue && imageTagValue.trim() ? 4 : 2;
  steps.push(stepBuilders.uploadWorkflow(props, nextStepNum));
  steps.push(stepBuilders.launchWorkflow(props, nextStepNum + 1));

  return steps;
}

module.exports = ImageTagOnlySteps;