var React = require('react');
var serviceConstants = require('../utils/serviceConstants');

var servicesByType = {
  stow: serviceConstants.stowServices,
  buffer: serviceConstants.bufferCarbonServices.concat(['BufferItemHandling', 'BufferOpcuaAdapter', 'BufferOrchestrator']),
  induct: ['BaslerManager'].concat(serviceConstants.carbonServices, ['GraspPercept', 'InductApplet', 'InfeedControl', 'ItemHandling', 'ItemRouting', 'OpcuaAdapter', 'OperatorUI', 'Orchestrator', 'VOCALService'])
};

function ImageTagDialog(props) {
  var isOpen = props.isOpen;
  var onClose = props.onClose;
  var onSave = props.onSave;
  var workcellType = props.workcellType;
  var initialService = props.initialService || '';
  var initialTag = props.initialTag || '';

  var selectedServiceState = React.useState(initialService);
  var selectedService = selectedServiceState[0];
  var setSelectedService = selectedServiceState[1];

  var imageTagState = React.useState(initialTag);
  var imageTag = imageTagState[0];
  var setImageTag = imageTagState[1];

  React.useEffect(function() {
    setSelectedService(initialService);
    setImageTag(initialTag);
  }, [initialService, initialTag, isOpen]);

  function handleSave() {
    if (!selectedService) {
      alert('Please select a service');
      return;
    }
    if (!imageTag.trim()) {
      alert('Please enter an image tag');
      return;
    }
    onSave({ service: selectedService, tag: imageTag.trim() });
    onClose();
  }

  if (!isOpen) return null;

  var services = servicesByType[workcellType] || [];

  return React.createElement(
    'div',
    { 
      className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]',
      onClick: onClose
    },
    React.createElement(
      'div',
      { 
        className: 'bg-slate-900 border border-cyan-500 rounded-lg p-4 max-w-md w-full mx-4',
        onClick: function(e) { e.stopPropagation(); }
      },
      React.createElement('h3', { className: 'text-cyan-400 font-bold mb-4' }, 'Select Service and Image Tag'),
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement('label', { className: 'block text-cyan-400 text-sm mb-2' }, 'Service:'),
        React.createElement(
          'select',
          {
            className: 'input-field',
            value: selectedService,
            onChange: function(e) { setSelectedService(e.target.value); }
          },
          React.createElement('option', { value: '' }, 'Select a service'),
          services.map(function(service) {
            return React.createElement('option', { key: service, value: service }, service);
          })
        )
      ),
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement('label', { className: 'block text-cyan-400 text-sm mb-2' }, 'Image Tag:'),
        React.createElement('input', {
          type: 'text',
          className: 'input-field',
          value: imageTag,
          onChange: function(e) { setImageTag(e.target.value); },
          placeholder: 'e.g., v1.2.3 or latest'
        })
      ),
      React.createElement(
        'div',
        { className: 'flex gap-2 justify-end' },
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded',
            onClick: onClose
          },
          'Cancel'
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded',
            onClick: handleSave
          },
          'Save'
        )
      )
    )
  );
}

module.exports = ImageTagDialog;
