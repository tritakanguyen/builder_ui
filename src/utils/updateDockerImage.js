var serviceConstants = require('./serviceConstants');

/**
 * Generates YAML update command for a specific service
 * @param {string} yamlFilePath - Path to the YAML file
 * @param {string} serviceName - Name of the service to update
 * @param {string} newImage - New image to set
 * @param {boolean} hasService - Whether the service is under 'services:' section
 * @returns {string} Command to update the image
 */
function generateYamlUpdateCommand(yamlFilePath, serviceName, newImage, hasService) {
  var indent = hasService ? '  ' : '    ';
  var sedCmd = 'sed -i "/^' + indent + serviceName + ':/,/image:/ s|image:.*|image: ' + newImage + '|" ' + yamlFilePath;
  var verifyCmd = 'sed -n "/^' + indent + serviceName + ':/,/image:/p" ' + yamlFilePath;
  return sedCmd + '\n' + verifyCmd;
}

/**
 * Finds which YAML files contain a specific service based on station type
 * @param {string} serviceName - Name of the service
 * @param {string} stationType - Type of station (induct, buffer, stow)
 * @returns {Array} Array of YAML file names that contain the service
 */
function findServiceYamlFiles(serviceName, stationType) {
  var yamlFiles = [];
  
  switch (stationType.toLowerCase()) {
    case 'induct':
      // Check each structure item for the service
      for (var i = 0; i < serviceConstants.inductStructure.length; i++) {
        var item = serviceConstants.inductStructure[i];
        if (typeof item === 'string') {
          // Single YAML file - check if it's the main docker-compose.yml
          if (item === 'docker-compose.yml') {
            yamlFiles.push(item);
          } else {
            yamlFiles.push(item);
          }
        } else if (typeof item === 'object') {
          // YAML file with specific services
          var yamlFile = Object.keys(item)[0];
          var services = item[yamlFile];
          if (services.includes(serviceName)) {
            yamlFiles.push(yamlFile);
          }
        }
      }
      break;
      
    case 'buffer':
      for (var i = 0; i < serviceConstants.bufferStructure.length; i++) {
        var item = serviceConstants.bufferStructure[i];
        if (typeof item === 'string') {
          yamlFiles.push(item);
        } else if (typeof item === 'object') {
          var yamlFile = Object.keys(item)[0];
          var services = item[yamlFile];
          if (services.includes(serviceName)) {
            yamlFiles.push(yamlFile);
          }
        }
      }
      break;
      
    case 'stow':
      // For stow, all services are in docker-compose.yml
      if (serviceConstants.stowServices.includes(serviceName)) {
        yamlFiles.push('docker-compose.yml');
      }
      break;
      
    default:
      throw new Error('Unknown station type: ' + stationType);
  }
  
  return yamlFiles;
}

/**
 * Validates if a service exists in the given station type
 * @param {string} serviceName - Name of the service
 * @param {string} stationType - Type of station (induct, buffer, stow)
 * @returns {boolean} True if service exists in the station type
 */
function validateService(serviceName, stationType) {
  switch (stationType.toLowerCase()) {
    case 'induct':
      // Check if service exists in any of the induct services
      for (var i = 0; i < serviceConstants.inductStructure.length; i++) {
        var item = serviceConstants.inductStructure[i];
        if (typeof item === 'object') {
          var services = Object.values(item)[0];
          if (services.includes(serviceName)) {
            return true;
          }
        }
      }
      return false;
      
    case 'buffer':
      // Check if service exists in buffer services
      for (var i = 0; i < serviceConstants.bufferStructure.length; i++) {
        var item = serviceConstants.bufferStructure[i];
        if (typeof item === 'object') {
          var services = Object.values(item)[0];
          if (services.includes(serviceName)) {
            return true;
          }
        }
      }
      return false;
      
    case 'stow':
      return serviceConstants.stowServices.includes(serviceName);
      
    default:
      return false;
  }
}

/**
 * Generates update commands for a service based on station type
 * @param {string} serviceName - Name of the service to update
 * @param {string} newImage - New image to set
 * @param {string} stationType - Type of station (induct, buffer, stow)
 * @param {string} workspaceTitle - Workspace title for path construction
 * @returns {Object} Object containing commands and metadata
 */
function generateServiceUpdateCommands(serviceName, newImage, stationType, workspaceTitle) {
  workspaceTitle = workspaceTitle || '[workspaceTitle]';
  
  // Validate service exists in station type
  if (!validateService(serviceName, stationType)) {
    throw new Error('Service "' + serviceName + '" not found in station type "' + stationType + '"');
  }
  
  // Find YAML files containing the service
  var yamlFiles = findServiceYamlFiles(serviceName, stationType);
  
  if (yamlFiles.length === 0) {
    throw new Error('No YAML files found for service "' + serviceName + '" in station type "' + stationType + '"');
  }
  
  var commands = [];
  var affectedFiles = [];
  
  // Construct base path: ~/workspace/workspaceTitle/opt/carbon/docker
  var basePath = '~/workspace/' + workspaceTitle + '/opt/carbon/docker/';
  
  // Generate commands for each YAML file
  for (var i = 0; i < yamlFiles.length; i++) {
    var yamlFile = yamlFiles[i];
    
    // Construct the full path based on station type
    var fullPath;
    switch (stationType.toLowerCase()) {
      case 'buffer':
        fullPath = basePath + 'buffer-compose/' + yamlFile;
        break;
      case 'induct':
        fullPath = basePath + 'induct-transfer-compose/' + yamlFile;
        break;
      case 'stow':
        fullPath = basePath + 'stow-compose/' + yamlFile;
        break;
      default:
        throw new Error('Unknown station type: ' + stationType);
    }
    
    var hasService = true; // All services are under 'services:' section
    
    var command = generateYamlUpdateCommand(fullPath, serviceName, newImage, hasService);
    commands.push(command);
    affectedFiles.push(yamlFile);
  }
  
  return {
    commands: commands,
    affectedFiles: affectedFiles,
    serviceName: serviceName,
    newImage: newImage,
    stationType: stationType,
    basePath: basePath
  };
}

module.exports = {
  generateYamlUpdateCommand: generateYamlUpdateCommand,
  generateServiceUpdateCommands: generateServiceUpdateCommands,
  findServiceYamlFiles: findServiceYamlFiles,
  validateService: validateService
};
