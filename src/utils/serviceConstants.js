// Shared service constants for YAML file mapping
var carbonServices = ['ScannerService', 'ConfigLoader', 'CarbonCopy', 'HealthAggregatorService', 'Hub', 'MetricService', 'nginx', 'web_gateway', 'hub_gateway', 'NitroWebApp', 'HubCli'];
var bufferCarbonServices = ['ConfigLoader', 'CarbonCopy', 'HealthAggregator', 'Hub', 'MetricService', 'nginx', 'web_gateway', 'hub_gateway_induct_to_buffer1', 'NitroWebApp', 'HubCli'];
var stowServices = ['ABExperimentService', 'AutoAnnotation', 'BaslerManager', 'Calibration', 'CarbonCopy', 'ChaseAdapter', 'ConfigLoader', 'ContainerItemMatch', 'ContainerPerception', 'ErrorMonitoring', 'FcxAdapterService', 'GraspPerception', 'HealthAggregator', 'Hub', 'HubCLI', 'HubGatewayStow', 'InHandPerception', 'InductApplet', 'InfeedController', 'InventoryManagement', 'ItemHandling', 'ItemReorientation', 'KPPSAdapter', 'LabPodInventory', 'MetricService', 'MotionPlanner', 'MotionPolicyExecutor', 'NitroWebApp', 'OpcuaAdapter', 'OperatorUIService', 'Orchestrator', 'OutfeedService', 'PodLocalization', 'PreImagingContainerPerception', 'RobotController', 'ScannerService', 'VOCALService', 'Webcam', 'WorkcellMetric', 'nginx', 'web_gateway'];

var inductStructure = [
  'docker-compose.BaslerManager.yml',
  {'docker-compose.Carbon.yml': carbonServices},
  'docker-compose.GraspPercept.yml',
  'docker-compose.InductApplet.yml',
  'docker-compose.InfeedControl.yml',
  'docker-compose.ItemHandling.yml',
  'docker-compose.ItemRouting.yml',
  'docker-compose.OpcuaAdapter.yml',
  'docker-compose.OperatorUI.yml',
  'docker-compose.Orchestrator.yml',
  'docker-compose.VOCALService.yml',
  'docker-compose.yml'
];

var bufferStructure = [
  {'docker-compose.BufferCarbon.yml': bufferCarbonServices},
  'docker-compose.BufferItemHandling.yml',
  'docker-compose.BufferOpcuaAdapter.yml',
  'docker-compose.BufferOrchestrator.yml',
  'docker-compose.yml'
];

var stowStructure = stowServices;

module.exports = {
  carbonServices: carbonServices,
  bufferCarbonServices: bufferCarbonServices,
  stowServices: stowServices,
  inductStructure: inductStructure,
  bufferStructure: bufferStructure,
  stowStructure: stowStructure
};
