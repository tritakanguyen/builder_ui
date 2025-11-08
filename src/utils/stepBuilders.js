var React = require('react');

// Helper function to get deployment artifacts package name based on section
function getDeploymentArtifactsPackage(section) {
  if (section === 'stow') return 'VulcanReorientStowDeploymentArtifacts';
  if (section === 'buffer') return 'VulcanStowBufferDeploymentArtifacts';
  return 'VulcanInductTransferDeploymentArtifacts';
}

// Helper function to get docker compose path based on section
function getDockerComposePath(section, workspaceTitle) {
  if (section === 'induct') {
    return 'cd ~/workspace/' + workspaceTitle + '/opt/carbon/docker/induct-transfer-compose && ls';
  }
  var composeDir = section === 'stow' ? 'stow' : 'buffer';
  return 'nano ~/workspace/' + workspaceTitle + '/opt/carbon/docker/' + composeDir + '-compose/docker-compose.yml';
}

// Step 1: Create workspace
function setupWorkspace(props) {
  var section = props.section;
  var testDate = props.testDate;
  var workcellId = props.workcellId;
  var eventId = props.eventId;
  var testTitle = props.testTitle;

  return React.createElement('div', { className: 'step', key: 'step1' }, 
    React.createElement('strong', null, 'Step 1: '), 
    'Create workspace and setup basic packages',
    React.createElement('code', null, 'setup --date ' + (testDate || '[date]') + ' --station ' + (workcellId || '[station]') + ' --type ' + section + ' --alias ' + (testTitle || '[testTitle]') + (eventId ? ' --eventId ' + eventId : ''))
  );
}

// Helper to check if deploy artifacts value exists
function hasDeployArtifacts(value) {
  return value && value.trim() !== '';
}

// Helper to generate package commands
function generatePackageCommands(dynamicInputs, workspaceTitle) {
  var pkgs = dynamicInputs.filter(function(input) {
    return input && input.packageName && input.packageName.trim();
  });
  var out = 'brazil ws --use ' + pkgs.map(function(input) {
    return '-p ' + input.packageName.trim();
  }).join(' ');
  pkgs.forEach(function(input) {
    out += '\ncd ~/workspace/' + (workspaceTitle || '[workspace]') + '/src/' + input.packageName.trim();
    if (input.gitCommand && input.gitCommand.trim()) {
      out += '\n' + input.gitCommand.trim();
    }
  });
  return out;
}

// Cherry pick step content (reusable)
function handleCRCommand(props) {
  var section = props.section;
  var workspaceTitle = props.workspaceTitle;
  var vulcanstowconfigPick = props.vulcanstowconfigPick;
  var vulcanstowconfigPickValue = props.vulcanstowconfigPickValue;
  var deployArtifactsPickValue = props.deployArtifactsPickValue;
  var dynamicInputs = props.dynamicInputs;

  return React.createElement('div', null,
    vulcanstowconfigPick && (
      React.createElement('div', null, 
        React.createElement('span', { style: { fontWeight: 'bold' } }, 'VSConfig cherry-pick command:'),
        React.createElement('code', null, 'cd ~/workspace/' + (workspaceTitle || '[workspace]') + '/src/VulcanStowConfig' + (vulcanstowconfigPickValue && vulcanstowconfigPickValue.trim() ? '\n' + vulcanstowconfigPickValue.trim() : ''))
      )
    ),
    hasDeployArtifacts(deployArtifactsPickValue) && (
      React.createElement('div', null,
        React.createElement('span', { style: { fontWeight: 'bold' } }, 'Deployment Artifacts cherry-pick command:'),
        React.createElement('code', null, 'cd ~/workspace/' + (workspaceTitle || '[workspace]') + '/src/' + getDeploymentArtifactsPackage(section) + '\n' + deployArtifactsPickValue)
      )
    ),
    Array.isArray(dynamicInputs) && dynamicInputs.filter(function(input) {
      return input && input.packageName && input.packageName.trim();
    }).length > 0 && (
      React.createElement('div', null,
        React.createElement('span', { style: { fontWeight: 'bold' } }, 'Added packages cherry-pick command:'),
        React.createElement('code', null, (function() {
          try {
            return generatePackageCommands(dynamicInputs, workspaceTitle);
          } catch (e) {
            console.error('Error generating cherry-pick command:', e);
            return 'Error generating command';
          }
        })())
      )
    )
  );
}

// Step 2: Cherry pick packages
function createCherryPickStep(props, stepNumber) {
  return React.createElement('div', { className: 'step', key: 'step' + stepNumber }, 
    React.createElement('strong', null, 'Step ' + stepNumber + ': '), 
    'Apply cherry pick packages',
    handleCRCommand(props)
  );
}

// Image tag navigation step
function navigateToDockerCompose(props, stepNumber) {
  var section = props.section;
  var workspaceTitle = props.workspaceTitle;

  return React.createElement('div', { className: 'step', key: 'step' + stepNumber }, 
    React.createElement('strong', null, 'Step ' + stepNumber + ': '), 
    'Image tag modification',
    React.createElement('code', null, getDockerComposePath(section, workspaceTitle))
  // amazonq-ignore-next-line
  );
}

// Apply image tag step
function manualHandleImageTag(props, stepNumber) {
  var imageTagInputs = props.imageTagInputs || [];
  var filteredTags = imageTagInputs.filter(function(tag) { return tag && tag.trim(); });

  if (filteredTags.length === 0) {
    return React.createElement('div', { className: 'step', key: 'step' + stepNumber }, 
      React.createElement('strong', null, 'Step ' + stepNumber + ': '), 
      // amazonq-ignore-next-line
      'Apply image tag shown in this step to the proper service',
      React.createElement('code', null, props.imageTagValue || '')
    );
  }

  var elements = [React.createElement('strong', { key: 'title' }, 'Step ' + stepNumber + ': '), 'Apply image tag(s) shown below to the proper service'];
  
  filteredTags.forEach(function(tag, idx) {
    elements.push(
      React.createElement('div', { key: 'tag-' + idx, style: { marginTop: '8px' } },
        React.createElement('span', { style: { fontWeight: 'bold', fontSize: '12px', color: '#67e8f9', display: 'block', marginBottom: '4px' } }, 'Image Tag ' + (idx + 1) + ':'),
        React.createElement('code', null, tag.trim())
      )
    );
  });

  return React.createElement('div', { className: 'step', key: 'step' + stepNumber }, elements);
}

// Build and deploy step
function uploadWorkflow(props, stepNumber) {
  var testDate = props.testDate;
  var workcellId = props.workcellId;
  var section = props.section;
  var testTitle = props.testTitle;

  return React.createElement('div', { className: 'step', key: 'step' + stepNumber }, 
    React.createElement('strong', null, 'Step ' + stepNumber + ': '), 
    'Build and deploy',
    React.createElement('code', null, 'upload --date ' + (testDate || '[date]') + ' --station ' + (workcellId || '[station]') + ' --type ' + section + ' --alias ' + testTitle)
  );
}

// Launch workflow step
function launchWorkflow(props, stepNumber) {
  var section = props.section === 'induct' ? 'induct-transfer' : props.section;
  var testTitle = props.testTitle;
  var workcellId = props.workcellId;
  var LaunchButton = require('../components/LaunchButton');

  return React.createElement('div', { className: 'step', key: 'step' + stepNumber }, 
    React.createElement('strong', null, 'Step ' + stepNumber + ': '), 
    'Launch workflow in SSM',
    React.createElement('code', null, 'launch-' + section + ' /tmp/test-' + testTitle + '/opt/carbon/'),
    React.createElement(LaunchButton, { workcellId: workcellId })
  );
}

module.exports = {
  setupWorkspace: setupWorkspace,
  createCherryPickStep: createCherryPickStep,
  navigateToDockerCompose: navigateToDockerCompose,
  manualHandleImageTag: manualHandleImageTag,
  uploadWorkflow: uploadWorkflow,
  launchWorkflow: launchWorkflow
};
