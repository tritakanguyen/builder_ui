var React = require('react');
var stepGenerator = require('../utils/stepGenerator');
var apiClient = require('../utils/apiClient');
var stepsRenderer = require('../utils/stepsRenderer');
var GenerateStepsButton = require('./buttons/GenerateStepsButton');

function ButtonsControl(props) {
  var testDate = props.testDate;
  var testTitle = props.testTitle;
  var workspaceTitle = props.workspaceTitle;
  var workcellType = props.workcellType;
  var imageTag = props.imageTag;
  var imageTagValue = props.imageTagValue;
  var cherryPick = props.cherryPick;
  var dynamicInputs = props.dynamicInputs;
  var eventId = props.eventId;
  var workcellId = props.workcellId;
  var setFormWarning = props.setFormWarning;
  var setWorkcellType = props.setWorkcellType;
  var setTestDate = props.setTestDate;
  var setTestTitle = props.setTestTitle;
  var deployArtifactsPickValue = props.deployArtifactsPickValue;
  var vsConfigPickValue = props.vsConfigPickValue;
  var vsConfigPick = props.vsConfigPick;
  var setGeneratedKey = props.setGeneratedKey;
  var showNotification = props.showNotification;
  var imageTagInputs = props.imageTagInputs || [];

  return React.createElement(
    'div',
    { className: 'flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4 mb-3 sm:mb-4 items-center' },
    React.createElement(GenerateStepsButton, { onClick: generateSteps })
  );

  function generateSteps() {
    if (!workcellType) {
      try {
        showNotification('Please select a workcell type first.', 'warning');
      } catch (e) {
        console.error('Failed to show notification:', e);
      }
      return;
    }

    var steps = stepGenerator.generateSteps({
      workcellType: workcellType,
      workspaceTitle: workspaceTitle,
      imageTag: imageTag,
      imageTagValue: imageTagValue,
      imageTagInputs: imageTagInputs,
      cherryPick: cherryPick,
      dynamicInputs: dynamicInputs,
      eventId: eventId,
      testDate: testDate,
      workcellId: workcellId,
      testTitle: testTitle,
      deployArtifactsPickValue: deployArtifactsPickValue,
      vsConfigPickValue: vsConfigPickValue,
      vsConfigPick: vsConfigPick
    });

    stepsRenderer.renderSteps(steps, workcellType);
    stepsRenderer.showStepsGuide();
    window.build_string = stepsRenderer.collectCommands(workcellType);
    
    // Generate simple key
    if (window.build_string) {
      var randomChars = Math.random().toString(36).substring(2, 6);
      var simpleKey = 'key-' + randomChars;
      setGeneratedKey(simpleKey);
    }
  }
}

module.exports = ButtonsControl;