var StepTemplates = require('../components/StepTemplates');

function generateSteps(props) {
  var sections = props.sections;
  var workspaceTitle = props.workspaceTitle;
  var imageTag = props.imageTag;
  var imageTagValue = props.imageTagValue;
  var cherryPick = props.cherryPick;
  var dynamicInputs = props.dynamicInputs;
  var deployArtifactsPickValue = props.deployArtifactsPickValue;
  var vsConfigPickValue = props.vsConfigPickValue;
  var vsConfigPick = props.vsConfigPick;

  if (!sections) {
    return [];
  }

  var stepProps = {
    section: sections,
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
    return StepTemplates.ImageTagOnlySteps(stepProps);
  }
  
  // Case 2: Only Cherry Pick
  if (!imageTag && cherryPick) {
    return StepTemplates.CherryPickOnlySteps(stepProps);
  }
  
  // Case 3: Both Image Tag and Cherry Pick
  if (imageTag && cherryPick) {
    return StepTemplates.BothSteps(stepProps);
  }

  // Default case: Generate basic steps with placeholders
  return StepTemplates.ImageTagOnlySteps(stepProps);
}

module.exports = {
  generateSteps: generateSteps
};