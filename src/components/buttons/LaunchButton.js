var React = require('react');
var launchHelper = require('../../utils/launchHelper');

function LaunchButton(props) {
  var workcellId = props.workcellId;

  if (!workcellId || !launchHelper.stationMap[workcellId]) {
    return null;
  }

  return React.createElement(
    'button',
    {
      type: 'button',
      className: 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold px-3 py-2 rounded-lg border border-cyan-400 shadow-md hover:shadow-lg transition-all text-sm',
      onClick: function() { launchHelper.handleLaunch(workcellId); }
    },
    '🚀 ' + workcellId
  );
}

module.exports = LaunchButton;
module.exports.stationMap = launchHelper.stationMap;
module.exports.getOnClickLogic = launchHelper.getOnClickLogic;
