var carbonServices = require('./HandleCarbonServices');

var bufferServices = ['ItemHandling', 'OpcuaAdapter', 'Orchestrator'];

var serviceToFileMap = {
  'ItemHandling': 'docker-compose.BufferItemHandling.yml',
  'OpcuaAdapter': 'docker-compose.BufferOpcuaAdapter.yml',
  'Orchestrator': 'docker-compose.BufferOrchestrator.yml'
};

function getAllServices() {
  var carbonList = carbonServices.getServicesName('buffer');
  return bufferServices.concat(carbonList);
}

function getYamlFile(serviceName) {
  if (serviceToFileMap[serviceName]) {
    return serviceToFileMap[serviceName];
  }
  if (carbonServices.getServicesName('buffer').indexOf(serviceName) !== -1) {
    return 'docker-compose.BufferCarbon.yml';
  }
  return null;
}

function getFullPath(workspaceTitle, serviceName) {
  var yamlFile = getYamlFile(serviceName);
  if (!yamlFile) return null;
  return '~/workspace/' + workspaceTitle + '/opt/carbon/docker/buffer-compose/' + yamlFile;
}

function validateService(serviceName) {
  return getAllServices().indexOf(serviceName) !== -1;
}

module.exports = {
  bufferServices: bufferServices,
  getAllServices: getAllServices,
  getYamlFile: getYamlFile,
  getFullPath: getFullPath,
  validateService: validateService
};
