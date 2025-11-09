var React = require('react');

function InstallationScriptBtn(props) {

  function downloadInstallScript() {
    var scriptContent = '#!/usr/bin/env python3\n' +
      'import subprocess\n' +
      'import os\n\n' +
      'home = os.path.expanduser("~")\n' +
      'repo_path = os.path.join(home, "VulcanStowDeploymentCommonConstructs")\n\n' +
      'if os.path.exists(repo_path):\n' +
      '    print("Removing existing VulcanStowDeploymentCommonConstructs...")\n' +
      '    subprocess.run(["rm", "-rf", repo_path])\n' +
      '    subprocess.run(["sed", "-i", "", "/alias setup=\\|alias upload=\\|alias autobuild=/d", os.path.join(home, ".zshrc")])\n\n' +
      'print("Cloning VulcanStowDeploymentCommonConstructs package...")\n' +
      'os.chdir(home)\n' +
      'subprocess.run(["git", "clone", "ssh://git.amazon.com/pkg/VulcanStowDeploymentCommonConstructs/", "--branch", "atlas-test"], check=True)\n\n' +
      'print("Setting up aliases...")\n' +
      'aliases = "alias setup=\'~/VulcanStowDeploymentCommonConstructs/atlas-test-scripts/setup-test-folder.sh\'\\n" + \\\n' +
      '          "alias upload=\'~/VulcanStowDeploymentCommonConstructs/atlas-test-scripts/upload-test-folder.sh\'\\n" + \\\n' +
      '          "alias autobuild=\'python3 autobuild.py\'\\n"\n' +
      'with open(os.path.join(home, ".zshrc"), "a") as f:\n' +
      '    f.write(aliases)\n\n' +
      'subprocess.run(["rm", "-f", os.path.join(home, "builder_setup.py")])\n' +
      'print("Setup complete! Reloading shell...")\n' +
      'subprocess.run(["exec", "zsh"])\n';
    
    var wgetCommand = 'wget -O builder_setup.py "data:text/x-python;base64,' + btoa(scriptContent) + '" && python3 builder_setup.py';
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(wgetCommand).then(function() {
        props.showNotification('wget command copied to clipboard!', 'success');
      }).catch(function() {
        props.showNotification('Failed to copy command', 'error');
      });
    } else {
      props.showNotification('Clipboard not supported', 'error');
    }
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
