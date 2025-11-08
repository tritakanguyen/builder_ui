var React = require('react');
var stepBuilders = require('../utils/stepBuilders');

function ImageTagOnlySteps(props) {
  var imageTagValue = props.imageTagValue;
  var imageTagInputs = props.imageTagInputs || [];
  var hasImageTags = (imageTagValue && imageTagValue.trim()) || imageTagInputs.filter(function(t) { return t && t.trim(); }).length > 0;
  var steps = [stepBuilders.setupWorkspace(props)];

  if (hasImageTags) {
    steps.push(stepBuilders.navigateToDockerCompose(props, 2));
    steps.push(stepBuilders.manualHandleImageTag(props, 3));
  }

  var nextStepNum = hasImageTags ? 4 : 2;
  steps.push(stepBuilders.uploadWorkflow(props, nextStepNum));
  steps.push(stepBuilders.launchWorkflow(props, nextStepNum + 1));

  return steps;
}

module.exports = ImageTagOnlySteps;