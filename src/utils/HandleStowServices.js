var stowServices = ['ABExperimentService', 'AutoAnnotation', 'BaslerManager', 'Calibration', 'CarbonCopy', 'ChaseAdapter', 'ConfigLoader', 'ContainerItemMatch', 'ContainerPerception', 'ErrorMonitoring', 'FcxAdapterService', 'GraspPerception', 'HealthAggregator', 'Hub', 'HubCLI', 'HubGatewayStow', 'InHandPerception', 'InductApplet', 'InfeedController', 'InventoryManagement', 'ItemHandling', 'ItemReorientation', 'KPPSAdapter', 'LabPodInventory', 'MetricService', 'MotionPlanner', 'MotionPolicyExecutor', 'NitroWebApp', 'OpcuaAdapter', 'OperatorUIService', 'Orchestrator', 'OutfeedService', 'PodLocalization', 'PreImagingContainerPerception', 'RobotController', 'ScannerService', 'VOCALService', 'Webcam', 'WorkcellMetric', 'nginx', 'web_gateway'];

function getAllServices() {
  return stowServices;
}

function getYamlFile(serviceName) {
  if (stowServices.indexOf(serviceName) !== -1) {
    return 'docker-compose.yml';
  }
  return null;
}

function getFullPath(workspaceTitle, serviceName) {
  var yamlFile = getYamlFile(serviceName);
  if (!yamlFile) return null;
  return '~/workspace/' + workspaceTitle + '/opt/carbon/docker/stow-compose/' + yamlFile;
}

function validateService(serviceName) {
  return stowServices.indexOf(serviceName) !== -1;
}

module.exports = {
  stowServices: stowServices,
  getAllServices: getAllServices,
  getYamlFile: getYamlFile,
  getFullPath: getFullPath,
  validateService: validateService
};