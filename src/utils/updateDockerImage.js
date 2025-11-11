var handleInductServices = require('./HandleInductServices');
var handleBufferServices = require('./HandleBufferServices');
var handleStowServices = require('./HandleStowServices');

function generateYamlUpdateCommand(yamlFilePath, serviceName, newImage, hasService) {
  var indent = hasService ? '  ' : '    ';
  var sedCmd = 'sed -i "/^' + indent + serviceName + ':/,/image:/ s|image:.*|image: ' + newImage + '|" ' + yamlFilePath;
  var verifyCmd = 'sed -n "/^' + indent + serviceName + ':/,/image:/p" ' + yamlFilePath;
  return sedCmd + '\n' + verifyCmd;
}

function getHandlerForStationType(stationType) {
  switch (stationType.toLowerCase()) {
    case 'induct':
      return handleInductServices;
    case 'buffer':
      return handleBufferServices;
    case 'stow':
      return handleStowServices;
    default:
      throw new Error('Unknown station type: ' + stationType);
  }
}

function validateService(serviceName, stationType) {
  var handler = getHandlerForStationType(stationType);
  return handler.validateService(serviceName);
}

function generateServiceUpdateCommands(serviceName, newImage, stationType, workspaceTitle) {
  workspaceTitle = workspaceTitle || '[workspaceTitle]';
  
  if (!validateService(serviceName, stationType)) {
    throw new Error('Service "' + serviceName + '" not found in station type "' + stationType + '"');
  }
  
  var handler = getHandlerForStationType(stationType);
  var fullPath = handler.getFullPath(workspaceTitle, serviceName);
  
  if (!fullPath) {
    throw new Error('No YAML file found for service "' + serviceName + '" in station type "' + stationType + '"');
  }
  
  var yamlFile = handler.getYamlFile(serviceName);
  var command = generateYamlUpdateCommand(fullPath, serviceName, newImage, true);
  
  return {
    commands: [command],
    affectedFiles: [yamlFile],
    serviceName: serviceName,
    newImage: newImage,
    stationType: stationType
  };
}

module.exports = {
  generateYamlUpdateCommand: generateYamlUpdateCommand,
  generateServiceUpdateCommands: generateServiceUpdateCommands,
  validateService: validateService
};
