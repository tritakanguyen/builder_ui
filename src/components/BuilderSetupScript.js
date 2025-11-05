var React = require('react');
var apiClient = require('../utils/apiClient');

function BuilderSetupScript(props) {
  function copyWgetCommand() {
    var scriptContent = '#!/usr/bin/env python3\n' +
      'import subprocess\n' +
      'import os\n\n' +
      'print("Cloning VulcanStowDeploymentCommonConstructs package...")\n' +
      'os.chdir(os.path.expanduser("~"))\n' +
      'subprocess.run(["git", "clone", "ssh://git.amazon.com/pkg/VulcanStowDeploymentCommonConstructs/", "--branch", "atlas-test"], check=True)\n\n' +
      'print("Setting up aliases...")\n' +
      'aliases = "alias setup=\'~/VulcanStowDeploymentCommonConstructs/atlas-test-scripts/setup-test-folder.sh\'\\n" + \\\n' +
      '          "alias upload=\'~/VulcanStowDeploymentCommonConstructs/atlas-test-scripts/upload-test-folder.sh\'\\n"\n' +
      'with open(os.path.expanduser("~/.zshrc"), "a") as f:\n' +
      '    f.write(aliases)\n\n' +
      'print("Setup complete! Run: source ~/.zshrc")\n';
    
    apiClient.createKey(scriptContent, 'setup-script').then(function(key) {
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
      className: 'fixed left-2 bottom-14 sm:left-2.5 sm:bottom-14 z-[1300] bg-purple-600 hover:bg-purple-500 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg transition-all text-lg font-bold',
      title: 'Copy wget command to clipboard'
    },
    '⬇️'
  );
}

module.exports = BuilderSetupScript;
