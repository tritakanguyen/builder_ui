var React = require('react');
var apiClient = require('../utils/apiClient');

function BuilderSetupScript(props) {
  var backendReadyState = React.useState(false);
  var backendReady = backendReadyState[0];
  var setBackendReady = backendReadyState[1];

  React.useEffect(function() {
    var apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    fetch(apiUrl + '/ping')
      .then(function() { setBackendReady(true); })
      .catch(function() { setBackendReady(false); });
  }, []);

  function copyWgetCommand() {
    var scriptContent = '#!/usr/bin/env python3\n' +
      'import subprocess\n' +
      'import os\n\n' +
      'home = os.path.expanduser("~")\n' +
      'repo_path = os.path.join(home, "VulcanStowDeploymentCommonConstructs")\n\n' +
      'if os.path.exists(repo_path):\n' +
      '    print("Removing existing VulcanStowDeploymentCommonConstructs...")\n' +
      '    subprocess.run(["rm", "-rf", repo_path])\n\n' +
      'print("Cloning VulcanStowDeploymentCommonConstructs package...")\n' +
      'os.chdir(home)\n' +
      'subprocess.run(["git", "clone", "ssh://git.amazon.com/pkg/VulcanStowDeploymentCommonConstructs/", "--branch", "atlas-test"], check=True)\n\n' +
      'print("Setting up aliases...")\n' +
      'aliases = "alias setup=\'~/VulcanStowDeploymentCommonConstructs/atlas-test-scripts/setup-test-folder.sh\'\\n" + \\\n' +
      '          "alias upload=\'~/VulcanStowDeploymentCommonConstructs/atlas-test-scripts/upload-test-folder.sh\'\\n"\n' +
      'with open(os.path.join(home, ".zshrc"), "a") as f:\n' +
      '    f.write(aliases)\n\n' +
      'subprocess.run(["rm", "-f", os.path.join(home, "builder_setup.py")])\n' +
      'print("Setup complete! Reloading shell...")\n' +
      'subprocess.run(["exec", "zsh"])\n';
    
    apiClient.createKey(scriptContent, null, null).then(function(key) {
      var apiUrl = process.env.REACT_APP_API_URL;
      var downloadUrl = apiUrl + '/data/' + key;
      var wgetCommand = 'wget -O builder_setup.py ' + downloadUrl + ' && python3 builder_setup.py';
      
      navigator.clipboard.writeText(wgetCommand).then(function() {
        alert('Copied to clipboard: ' + wgetCommand);
      }).catch(function() {
        var textarea = document.createElement('textarea');
        textarea.value = wgetCommand;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Copied to clipboard: ' + wgetCommand);
      });
    }).catch(function(err) {
      alert('Failed to generate script: ' + err.message);
    });
  }

  return React.createElement(
    'button',
    {
      onClick: copyWgetCommand,
      disabled: !backendReady,
      className: 'fixed left-2 bottom-14 sm:left-2.5 sm:bottom-14 z-[1300] ' + (backendReady ? 'bg-purple-600 hover:bg-purple-500' : 'bg-gray-600 cursor-not-allowed') + ' text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg transition-all text-lg font-bold',
      title: backendReady ? 'Copy wget command to clipboard' : 'Waiting for backend...'
    },
    '⬇️'
  );
}

module.exports = BuilderSetupScript;
