var React = require('react');

function StringKeyButton(props) {
  var stepsGenerated = props.stepsGenerated;
  var generatedKey = props.generatedKey;
  var showNotification = props.showNotification;

  if (!stepsGenerated || !generatedKey) return null;

  function handleCopyKey() {
    navigator.clipboard.writeText(generatedKey)
      .then(function() {
        showNotification('String key copied!', 'success');
      })
      .catch(function(err) {
        console.error('Failed to copy key:', err);
        showNotification('Failed to copy string key', 'error');
      });
  }

  return React.createElement(
    'button',
    {
      className: 'fixed right-2 bottom-14 sm:right-2.5 sm:bottom-16 z-[1300] bg-gradient-to-br from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 border-2 border-cyan-400 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70 transition-all text-sm font-bold',
      title: 'Copy string key: ' + generatedKey,
      onClick: handleCopyKey
    },
    '⚙'
  );
}

module.exports = StringKeyButton;
