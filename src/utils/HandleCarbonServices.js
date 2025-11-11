const carbonServicesMap = {
  'induct': ['ScannerService', 'ConfigLoader', 'CarbonCopy', 'HealthAggregatorService', 'Hub', 'MetricService', 'nginx', 'web_gateway', 'hub_gateway', 'NitroWebApp', 'HubCli'], 
  'buffer': ['ConfigLoader', 'CarbonCopy', 'HealthAggregator', 'Hub', 'MetricService', 'nginx', 'web_gateway', 'hub_gateway_induct_to_buffer1', 'NitroWebApp', 'HubCli']
};

function getServicesName(stationType) {
  if (!stationType) {
    throw new Error('Station type is required');
  }
  
  const services = carbonServicesMap[stationType];
  if (!services) {
    throw new Error(`Unknown station type: ${stationType}. Available types: ${Object.keys(carbonServicesMap).join(', ')}`);
  }
  
  return services;
}

function getfulPath(workspaceTitle, stationType) {
  if (!workspaceTitle) {
    throw new Error('Workspace title is required');
  }
  if (!stationType) {
    throw new Error('Station type is required');
  }

  if (stationType.toLowerCase() == 'buffer') {
    fullPath = `~/workspace/${workspaceTitle}/opt/carbon/docker/buffer-compose/docker-compose.BufferCarbon.yml`;
  } else {
    fullPath = `~/workspace/${workspaceTitle}/opt/carbon/docker/induct-transfer-compose/docker-compose.Carbon.yml`;
  }
  
  return fullPath;
}

function getServiceList(stationType) {
  return carbonServicesMap[stationType];
}

module.exports = {
  carbonServicesMap,
  getServicesName,
  getfulPath,
  getServiceList
};
