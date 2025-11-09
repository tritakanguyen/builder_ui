var React = require('react');
var serviceConstants = require('./serviceConstants');

var DEPLOYMENT_PACKAGES = {
  stow: 'VulcanReorientStowDeploymentArtifacts',
  buffer: 'VulcanStowBufferDeploymentArtifacts',
  induct: 'VulcanInductTransferDeploymentArtifacts'
};

function getDeploymentArtifactsPackage(section) {
  return DEPLOYMENT_PACKAGES[section] || DEPLOYMENT_PACKAGES.induct;
}

function getDockerComposePath(section, workspaceTitle) {
  var base = '~/workspace/' + workspaceTitle + '/opt/carbon/';
  if (section === 'induct') return 'cd ' + base + 'docker/induct-transfer-compose && ls';
  if (section === 'buffer') return 'cd ' + base + 'docker/buffer-compose && ls';
  return 'nano ' + base + 'stow/docker-compose/docker-compose.yml';
}

function createStep(stepNumber, title, content) {
  return React.createElement('div', { className: 'step', key: 'step' + stepNumber },
    React.createElement('strong', null, 'Step ' + stepNumber + ': '),
    title,
    content
  );
}

function setupWorkspace(props) {
  var cmd = 'setup --date ' + (props.testDate || '[date]') + ' --station ' + (props.workcellId || '[station]') + 
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
  return createStep(stepNumber, 'Image tag modification', 
    React.createElement('code', null, getDockerComposePath(props.section, props.workspaceTitle)));
}

function getComposeFileConfig(service, yamlPath, section) {
  var configs = [
    { services: serviceConstants.carbonServices, file: '/docker-compose.Carbon.yml', grep: '-A 5 -B 5' },
    { services: serviceConstants.bufferCarbonServices, file: '/docker-compose.BufferCarbon.yml', grep: '-A 5 -B 5' }
  ];
  
  for (var i = 0; i < configs.length; i++) {
    if (configs[i].services.indexOf(service) !== -1) {
      return { file: yamlPath + configs[i].file, grep: configs[i].grep, hasService: true };
    }
  }
  
  if (section === 'stow' && serviceConstants.stowServices.indexOf(service) !== -1) {
    return { file: yamlPath + '/docker-compose.yml', grep: '-A 5 -B 5', hasService: false };
  }
  
  return { file: yamlPath + '/docker-compose.' + service + '.yml', grep: '-A 3', hasService: false };
}

function manualHandleImageTag(props, stepNumber) {
  var filteredTags = (props.imageTagInputs || []).filter(function(tagData) {
    return typeof tagData === 'object' ? tagData.service && tagData.tag && tagData.tag.trim() : tagData && tagData.trim();
  });

  if (filteredTags.length === 0) {
    return createStep(stepNumber, 'Apply image tag shown in this step to the proper service',
      React.createElement('code', null, props.imageTagValue || ''));
  }

  var yamlPath = getDockerComposePath(props.section, props.workspaceTitle).replace(/nano |cd | && ls/g, '').trim();
  var elements = [React.createElement('strong', { key: 'title' }, 'Step ' + stepNumber + ': '), 'Apply image tags using the commands below'];
  
  filteredTags.forEach(function(tagData, idx) {
    var service = typeof tagData === 'object' ? tagData.service : 'unknown-service';
    var tag = (typeof tagData === 'object' ? tagData.tag : tagData).trim();
    var config = getComposeFileConfig(service, yamlPath, props.section);
    
    var sedCmd = "sed -i '/" + service + ":/,/image:/ s|image:.*|image: " + tag + "|' " + config.file;
    var grepCmd = "sed -n '/" + service + ":/,/image:/p' " + config.file;
    
    elements.push(
      React.createElement('div', { key: 'tag-' + idx, style: { marginTop: '8px' } },
        React.createElement('span', { style: { fontWeight: 'bold', fontSize: '12px', color: '#67e8f9', display: 'block', marginBottom: '4px' } }, 
          'Update ' + service + ' to ' + tag),
        React.createElement('code', null, sedCmd + '\n' + grepCmd)
      )
    );
  });

  return React.createElement('div', { className: 'step', key: 'step' + stepNumber }, elements);
}

function uploadWorkflow(props, stepNumber) {
  var cmd = 'upload --date ' + (props.testDate || '[date]') + ' --station ' + (props.workcellId || '[station]') + 
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
