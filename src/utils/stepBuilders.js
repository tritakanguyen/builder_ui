var React = require('react');
var serviceConstants = require('./serviceConstants');
var updateDockerImage = require('./updateDockerImage');

var DEPLOYMENT_PACKAGES = {
  stow: 'VulcanReorientStowDeploymentArtifacts',
  buffer: 'VulcanStowBufferDeploymentArtifacts',
  induct: 'VulcanInductTransferDeploymentArtifacts'
};

function getDeploymentArtifactsPackage(section) {
  return DEPLOYMENT_PACKAGES[section] || DEPLOYMENT_PACKAGES.induct;
}

function getDockerComposePath(section, workspaceTitle) {
  var base = '~/workspace/' + workspaceTitle + '/opt/carbon/docker/';
  if (section === 'induct') return base + 'induct-transfer-compose';
  if (section === 'buffer') return base + 'buffer-compose';
  return base + 'stow-compose';
}

function createStep(stepNumber, title, content) {
  return React.createElement('div', { className: 'step', key: 'step' + stepNumber },
    React.createElement('strong', null, 'Step ' + stepNumber + ': '),
    title,
    content
  );
}

function setupWorkspace(props) {
  var cmd = '~/VulcanStowDeploymentCommonConstructs/atlas-test-scripts/setup-test-folder.sh --date ' + (props.testDate || '[date]') + ' --station ' + (props.workcellId || '[station]') + 
    ' --type ' + props.section + ' --alias ' + (props.testTitle || '[testTitle]') + 
    (props.eventId ? ' --eventId ' + props.eventId : '');
  return createStep(1, 'Create workspace and setup basic packages', React.createElement('code', null, cmd));
}

function generatePackageCommands(dynamicInputs, workspaceTitle) {
  var pkgs = dynamicInputs.filter(function(input) {
    return input && input.packageName && input.packageName.trim();
  });
  var out = 'brazil ws --use ' + pkgs.map(function(input) { return '-p ' + input.packageName.trim(); }).join(' ');
  pkgs.forEach(function(input) {
    out += '\ncd ~/workspace/' + (workspaceTitle || '[workspace]') + '/src/' + input.packageName.trim();
    if (input.gitCommand && input.gitCommand.trim()) out += '\n' + input.gitCommand.trim();
  });
  return out;
}

function createCherryPickSection(label, code) {
  return React.createElement('div', null,
    React.createElement('span', { style: { fontWeight: 'bold' } }, label),
    React.createElement('code', null, code)
  );
}

function handleCRCommand(props) {
  var ws = props.workspaceTitle || '[workspace]';
  var children = [];
  
  if (props.vulcanstowconfigPick) {
    var vsCode = 'cd ~/workspace/' + ws + '/src/VulcanStowConfig';
    if (props.vulcanstowconfigPickValue && props.vulcanstowconfigPickValue.trim()) {
      vsCode += '\n' + props.vulcanstowconfigPickValue.trim();
    }
    children.push(createCherryPickSection('VSConfig cherry-pick command:', vsCode));
  }
  
  if (props.deployArtifactsPickValue && props.deployArtifactsPickValue.trim()) {
    children.push(createCherryPickSection('Deployment Artifacts cherry-pick command:',
      'cd ~/workspace/' + ws + '/src/' + getDeploymentArtifactsPackage(props.section) + '\n' + props.deployArtifactsPickValue));
  }
  
  if (Array.isArray(props.dynamicInputs) && props.dynamicInputs.some(function(input) {
    return input && input.packageName && input.packageName.trim();
  })) {
    try {
      children.push(createCherryPickSection('Added packages cherry-pick command:', generatePackageCommands(props.dynamicInputs, ws)));
    } catch (e) {
      console.error('Error generating cherry-pick command:', e);
    }
  }
  
  return React.createElement('div', null, children);
}

function createCherryPickStep(props, stepNumber) {
  return createStep(stepNumber, 'Apply cherry pick packages', handleCRCommand(props));
}

function navigateToDockerCompose(props, stepNumber) {
  var basePath = getDockerComposePath(props.section, props.workspaceTitle);
  var navigationCmd = 'cd ' + basePath + ' && ls';
  return createStep(stepNumber, 'Image tag modification', 
    React.createElement('code', null, navigationCmd));
}

function manualHandleImageTag(props, stepNumber) {
  var filteredTags = (props.imageTagInputs || []).filter(function(tagData) {
    return typeof tagData === 'object' ? tagData.service && tagData.tag && tagData.tag.trim() : tagData && tagData.trim();
  });

  if (filteredTags.length === 0) {
    return createStep(stepNumber, 'Apply image tag shown in this step to the proper service',
      React.createElement('code', null, props.imageTagValue || ''));
  }

  var elements = [React.createElement('strong', { key: 'title' }, 'Step ' + stepNumber + ': '), 'Apply image tags using the commands below'];
  
  filteredTags.forEach(function(tagData, idx) {
    var service = typeof tagData === 'object' ? tagData.service : 'unknown-service';
    var tag = (typeof tagData === 'object' ? tagData.tag : tagData).trim();
    
    try {
      // Use the new refactored function to generate service update commands
      var updateResult = updateDockerImage.generateServiceUpdateCommands(service, tag, props.section, props.workspaceTitle);
      
      // Display all commands for this service
      updateResult.commands.forEach(function(command, cmdIdx) {
        var fileName = updateResult.affectedFiles[cmdIdx];
        elements.push(
          React.createElement('div', { key: 'tag-' + idx + '-cmd-' + cmdIdx, style: { marginTop: '8px' } },
            React.createElement('span', { style: { fontWeight: 'bold', fontSize: '12px', color: '#67e8f9', display: 'block', marginBottom: '4px' } }, 
              'Update ' + service + ' to ' + tag + ' in ' + fileName),
            React.createElement('code', null, command)
          )
        );
      });
      
    } catch (error) {
      // Fallback to old method if service validation fails
      console.warn('Service validation failed for ' + service + ' in ' + props.section + ', using fallback method:', error.message);
      
      // Construct fallback path using new structure
      var basePath = '~/workspace/' + (props.workspaceTitle || '[workspaceTitle]') + '/opt/carbon/docker/';
      var fallbackPath;
      switch (props.section) {
        case 'buffer':
          fallbackPath = basePath + 'buffer-compose/docker-compose.yml';
          break;
        case 'induct':
          fallbackPath = basePath + 'induct-transfer-compose/docker-compose.yml';
          break;
        case 'stow':
          fallbackPath = basePath + 'stow-compose/docker-compose.yml';
          break;
        default:
          fallbackPath = basePath + 'docker-compose.yml';
      }
      
      var fallbackCommand = updateDockerImage.generateYamlUpdateCommand(
        fallbackPath, 
        service, 
        tag, 
        true
      );
      
      elements.push(
        React.createElement('div', { key: 'tag-' + idx + '-fallback', style: { marginTop: '8px' } },
          React.createElement('span', { style: { fontWeight: 'bold', fontSize: '12px', color: '#fbbf24', display: 'block', marginBottom: '4px' } }, 
            'Update ' + service + ' to ' + tag + ' (fallback)'),
          React.createElement('code', null, fallbackCommand)
        )
      );
    }
  });

  return React.createElement('div', { className: 'step', key: 'step' + stepNumber }, elements);
}

function uploadWorkflow(props, stepNumber) {
  var cmd = '~/VulcanStowDeploymentCommonConstructs/atlas-test-scripts/upload-test-folder.sh --date ' + (props.testDate || '[date]') + ' --station ' + (props.workcellId || '[station]') + 
    ' --type ' + props.section + ' --alias ' + props.testTitle;
  return createStep(stepNumber, 'Build and deploy', React.createElement('code', null, cmd));
}

function launchWorkflow(props, stepNumber) {
  var section = props.section === 'induct' ? 'induct-transfer' : props.section;
  var LaunchButton = require('../components/buttons/LaunchButton');
  return createStep(stepNumber, 'Launch workflow in SSM',
    React.createElement('code', null, 'launch-' + section + ' /tmp/test-' + props.testTitle + '/opt/carbon/'),
    React.createElement(LaunchButton, { workcellId: props.workcellId })
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
