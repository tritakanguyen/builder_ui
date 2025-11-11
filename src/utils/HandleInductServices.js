var carbonServices = require('./HandleCarbonServices');

var inductServices = [
  'BaslerManager', 'GraspPercept', 'InductApplet', 'InfeedControl', 
  'ItemHandling', 'ItemRouting', 'OpcuaAdapter', 'OperatorUI', 
  'Orchestrator', 'VOCALService'
];

var serviceToFileMap = {
  'BaslerManager': 'docker-compose.BaslerManager.yml',
  'GraspPercept': 'docker-compose.GraspPercept.yml',
  'InductApplet': 'docker-compose.InductApplet.yml',
  'InfeedControl': 'docker-compose.InfeedControl.yml',
  'ItemHandling': 'docker-compose.ItemHandling.yml',
  'ItemRouting': 'docker-compose.ItemRouting.yml',
  'OpcuaAdapter': 'docker-compose.OpcuaAdapter.yml',
  'OperatorUI': 'docker-compose.OperatorUI.yml',
  'Orchestrator': 'docker-compose.Orchestrator.yml',
  'VOCALService': 'docker-compose.VOCALService.yml'
};

function getAllServices() {
  var carbonList = carbonServices.getServicesName('induct');
  return inductServices.concat(carbonList);
}

function getYamlFile(serviceName) {
  if (serviceToFileMap[serviceName]) {
    return serviceToFileMap[serviceName];
  }
  if (carbonServices.getServicesName('induct').indexOf(serviceName) !== -1) {
    return 'docker-compose.Carbon.yml';
  }
  return null;
}

function getFullPath(workspaceTitle, serviceName) {
  var yamlFile = getYamlFile(serviceName);
  if (!yamlFile) return null;
  return '~/workspace/' + workspaceTitle + '/opt/carbon/docker/induct-transfer-compose/' + yamlFile;
}

function validateService(serviceName) {
  return getAllServices().indexOf(serviceName) !== -1;
}

module.exports = {
  inductServices: inductServices,
  getAllServices: getAllServices,
  getYamlFile: getYamlFile,
  getFullPath: getFullPath,
  validateService: validateService
};