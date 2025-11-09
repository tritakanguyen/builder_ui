var React = require('react');

function InstallationScriptBtn(props) {

  function downloadInstallScript() {
    var scriptContent = '#!/usr/bin/env python3\nimport subprocess\nimport os\n\nhome = os.path.expanduser("~")\nrepo_path = os.path.join(home, "VulcanStowDeploymentCommonConstructs")\n\nif os.path.exists(repo_path):\n    print("Removing existing VulcanStowDeploymentCommonConstructs...")\n    subprocess.run(["rm", "-rf", repo_path])\n    subprocess.run(["sed", "-i", "", "/alias setup=\\\\|alias upload=\\\\|alias autobuild=/d", os.path.join(home, ".zshrc")])\n\nprint("Cloning VulcanStowDeploymentCommonConstructs package...")\nos.chdir(home)\nsubprocess.run(["git", "clone", "ssh://git.amazon.com/pkg/VulcanStowDeploymentCommonConstructs/", "--branch", "atlas-test"], check=True)\n\nprint("Setting up aliases...")\naliases = "alias setup=\'~/VulcanStowDeploymentCommonConstructs/atlas-test-scripts/setup-test-folder.sh\'\\\\n" + \\\n          "alias upload=\'~/VulcanStowDeploymentCommonConstructs/atlas-test-scripts/upload-test-folder.sh\'\\\\n" + \\\n          "alias autobuild=\'python3 autobuild.py\'\\\\n"\nwith open(os.path.join(home, ".zshrc"), "a") as f:\n    f.write(aliases)\n\nsubprocess.run(["rm", "-f", os.path.join(home, "builder_setup.py")])\nprint("Setup complete! Reloading shell...")\nsubprocess.run(["exec", "zsh"])';
    
    var serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
    
    fetch(serverUrl + '/script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: scriptContent })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var wgetCommand = 'wget -O builder_setup.py ' + serverUrl + '/script/' + data.id + ' && python3 builder_setup.py';
      return navigator.clipboard.writeText(wgetCommand);
    })
    .then(function() {
      props.showNotification('wget command copied to clipboard!', 'success');
    })
    .catch(function() {
      props.showNotification('Failed to generate command', 'error');
    });
  }

  return React.createElement(
    'button',
    {
      onClick: downloadInstallScript,
      className: 'fixed left-2 bottom-14 sm:left-2.5 sm:bottom-14 z-[1300] bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 border-2 border-purple-400 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70 transition-all text-lg font-bold',
      title: 'Download Installation Script'
    },
    '⬇️'
  );
}

module.exports = InstallationScriptBtn;
