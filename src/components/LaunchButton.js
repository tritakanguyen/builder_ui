var React = require('react');
var conduitHelper = require('../utils/conduitHelper');

var stationMap = {
  '0205': 'mi-015cb0ab31a907cc3',
  '0206': 'mi-0be7cd1fb363a5e33',
  '0207': 'mi-09f813c992eca7797',
  '0208': 'mi-0dcfcee097f637e8c',
  '0302': 'mi-010a9f3676f5105e8',
  '0303': 'mi-01c8330d0219aba73',
  '0305': 'mi-019955dd271723f9f',
  '0306': 'mi-0e1de732c54ddd066',
  '0307': 'mi-0d052aea3bac203e0',
  '0308': 'mi-006b85b5e510bfddc'
};

function LaunchButton(props) {
  var workcellId = props.workcellId;

  function handleClick() {
    var node = stationMap[workcellId];
    if (!node || node === 'mi-null') {
      alert('Invalid workcell ID');
      return;
    }
    var destinationUrl = 'https://us-west-2.console.aws.amazon.com/systems-manager/session-manager/' + node + '?region=us-west-2';
    
    if (conduitHelper.checkSession()) {
      window.open(destinationUrl, '_blank');
    } else {
      var sessionDuration = 36000;
      var conduitUrl = conduitHelper.createConduitUrl(destinationUrl, sessionDuration);
      conduitHelper.saveSession(sessionDuration);
      window.open(conduitUrl, '_blank');
    }
  }

  if (!workcellId || !stationMap[workcellId]) {
    return null;
  }

  return React.createElement(
    'button',
    {
      type: 'button',
      className: 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold px-4 py-2 rounded mt-2 transition-all',
      onClick: handleClick
    },
    '🚀 Launch ' + workcellId
  );
}

function getOnClickLogic(workcellId) {
  var node = stationMap[workcellId];
  if (!node || node === 'mi-null') return '';
  
  var destUrl = 'https://us-west-2.console.aws.amazon.com/systems-manager/session-manager/' + node + '?region=us-west-2';
  var sessionDuration = 36000;
  var conduitUrl = conduitHelper.createConduitUrl(destUrl, sessionDuration);
  
  return '(function(){var cookies=document.cookie.split(&quot;;&quot;);for(var i=0;i&lt;cookies.length;i++){var c=cookies[i].trim();if(c.indexOf(&quot;ssm_session=&quot;)===0){var e=parseInt(c.substring(12));if(Date.now()&lt;e){window.open(&quot;'+destUrl+'&quot;,&quot;_blank&quot;);return}}}document.cookie=&quot;ssm_session=&quot;+(Date.now()+'+(sessionDuration*1000)+')+&quot;; path=/; max-age='+sessionDuration+'&quot;;window.open(&quot;'+conduitUrl+'&quot;,&quot;_blank&quot;)})()';
}

module.exports = LaunchButton;
module.exports.stationMap = stationMap;
module.exports.getOnClickLogic = getOnClickLogic;
