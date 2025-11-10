var React = require('react');
var stepBuilders = require('../utils/stepBuilders');

function ImageTagOnlySteps(props) {
  var imageTagValue = props.imageTagValue;
  var imageTagInputs = props.imageTagInputs || [];
  var hasImageTags = (imageTagValue && imageTagValue.trim()) || imageTagInputs.filter(function(t) {
    if (typeof t === 'object') return t.service && t.tag && t.tag.trim();
    return t && t.trim();
  }).length > 0;
  var steps = [stepBuilders.setupWorkspace(props)];

  if (hasImageTags) {
    steps.push(stepBuilders.manualHandleImageTag(props, 2));
  }

  var nextStepNum = hasImageTags ? 3 : 2;
  steps.push(stepBuilders.uploadWorkflow(props, nextStepNum));
  steps.push(stepBuilders.launchWorkflow(props, nextStepNum + 1));
  steps.push(stepBuilders.launchWorkflow(props, nextStepNum + 1));

  return steps;
}

module.exports = ImageTagOnlySteps;