var ImageTagOnlySteps = require('../components/ImageTagOnlySteps');
var CherryPickOnlySteps = require('../components/CherryPickOnlySteps');
var BothSteps = require('../components/BothSteps');

function generateSteps(props) {
  var workcellType = props.workcellType;
  var workspaceTitle = props.workspaceTitle;
  var imageTag = props.imageTag;
  var imageTagValue = props.imageTagValue;
  var cherryPick = props.cherryPick;
  var dynamicInputs = props.dynamicInputs;
  var deployArtifactsPickValue = props.deployArtifactsPickValue;
  var vsConfigPickValue = props.vsConfigPickValue;
  var vsConfigPick = props.vsConfigPick;

  if (!workcellType) {
    return [];
  }

  var stepProps = {
    section: workcellType,
    workspaceTitle: workspaceTitle,
    imageTagValue: imageTagValue,
    imageTagInputs: props.imageTagInputs || [],
    dynamicInputs: dynamicInputs,
    eventId: props.eventId,
    testDate: props.testDate,
    workcellId: props.workcellId,
    testTitle: props.testTitle,
    deployArtifactsPickValue: deployArtifactsPickValue,
    vulcanstowconfigPickValue: vsConfigPickValue,
    vulcanstowconfigPick: vsConfigPick
  };

  // Case 1: Only Image Tag
  if (imageTag && !cherryPick) {
    return ImageTagOnlySteps(stepProps);
  }
  
  // Case 2: Only Cherry Pick
  if (!imageTag && cherryPick) {
    return CherryPickOnlySteps(stepProps);
  }
  
  // Case 3: Both Image Tag and Cherry Pick
  if (imageTag && cherryPick) {
    return BothSteps(stepProps);
  }

  // Default case: Generate basic steps with placeholders
  return ImageTagOnlySteps(stepProps);
}

module.exports = {
  generateSteps: generateSteps
};