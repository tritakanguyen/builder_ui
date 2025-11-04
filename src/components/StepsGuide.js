var React = require('react');

function StepsGuide(props) {
  var activeSections = props.activeSections;
  
  if (!activeSections) return null;

  // This will be populated by the step generation logic
  var sectionSteps = {
    stow: [],
    buffer: [],
    transfer: []
  };

  // Get generated steps from DOM (similar to HTML version)
  React.useEffect(function() {
    var stowSteps = document.getElementById('stowSteps');
    var bufferSteps = document.getElementById('bufferSteps');
    var transferSteps = document.getElementById('transferSteps');
    
    if (stowSteps && stowSteps.innerHTML) {
      sectionSteps.stow = ['Steps generated - see below'];
    }
    if (bufferSteps && bufferSteps.innerHTML) {
      sectionSteps.buffer = ['Steps generated - see below'];
    }
    if (transferSteps && transferSteps.innerHTML) {
      sectionSteps.transfer = ['Steps generated - see below'];
    }
  }, []);

  function renderSteps(tab) {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        { className: 'text-xl font-bold mb-4 text-cyan-400 uppercase tracking-wider' },
        '⚙ ' + tab.toUpperCase() + ' WORKFLOW'
      ),
      React.createElement('div', { id: tab + 'Steps' })
    );
  }

  return React.createElement(
    'div',
    { 
      id: 'stepsGuide',
      className: 'mt-8 card p-6 transition-all border-cyan-500/30',
      style: { display: 'none' }
    },
    renderSteps(activeSections)
  );
}

module.exports = StepsGuide;