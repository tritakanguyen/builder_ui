var React = require('react');
var stepGenerator = require('../utils/stepGenerator');
var apiClient = require('../utils/apiClient');

function ActionButtons(props) {
  var testDate = props.testDate;
  var testTitle = props.testTitle;
  var workspaceTitle = props.workspaceTitle;
  var sections = props.sections;
  var imageTag = props.imageTag;
  var imageTagValue = props.imageTagValue;
  var cherryPick = props.cherryPick;
  var dynamicInputs = props.dynamicInputs;
  var eventId = props.eventId;
  var workcellId = props.workcellId;
  var setFormWarning = props.setFormWarning;
  var setSections = props.setSections;
  var setTestDate = props.setTestDate;
  var setTestTitle = props.setTestTitle;
  var deployArtifactsPickValue = props.deployArtifactsPickValue;
  var vsConfigPickValue = props.vsConfigPickValue;
  var vsConfigPick = props.vsConfigPick;
  var setGeneratedKey = props.setGeneratedKey;
  var showNotification = props.showNotification;
  var imageTagInputs = props.imageTagInputs || [];

  return React.createElement(
    'div',
    { className: 'flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4 mb-3 sm:mb-4 items-center' },
    React.createElement(
      'button',
      {
        type: 'button',
        className: 'btn-primary',
        title: 'Generate workflow steps',
        onClick: function() {
          generateSteps();
        }
      },
      '▶ GENERATE STEPS'
    )
  );

  function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    btn.textContent = '✓';
    setTimeout(function() { btn.textContent = '📋'; }, 2000);
  }

  function generateSteps() {
    if (!sections) {
      try {
        showNotification('Please select a section first.', 'warning');
      } catch (e) {
        console.error('Failed to show notification:', e);
      }
      return;
    }

    var steps = stepGenerator.generateSteps({
      sections: sections,
      workspaceTitle: workspaceTitle,
      imageTag: imageTag,
      imageTagValue: imageTagValue,
      imageTagInputs: imageTagInputs,
      cherryPick: cherryPick,
      dynamicInputs: dynamicInputs,
      eventId: eventId,
      testDate: testDate,
      workcellId: workcellId,
      testTitle: testTitle,
      deployArtifactsPickValue: deployArtifactsPickValue,
      vsConfigPickValue: vsConfigPickValue,
      vsConfigPick: vsConfigPick
    });

    var stepsContainer = document.getElementById(sections + 'Steps');
    if (stepsContainer && steps.length > 0) {
      stepsContainer.innerHTML = '';
      steps.forEach(function(step) {
        var stepElement = document.createElement('div');
        
        function renderChild(child, parent) {
          if (typeof child === 'string') {
            parent.appendChild(document.createTextNode(child));
            return;
          }
          if (child.type === 'strong') {
            var strong = document.createElement('strong');
            strong.textContent = child.props.children;
            parent.appendChild(strong);
            return;
          }
          if (child.type === 'code') {
            var code = document.createElement('code');
            code.textContent = child.props.children;
            parent.appendChild(code);
            return;
          }
          if (child.type === 'div') {
            var div = document.createElement('div');
            child.props.children.forEach(function(c) { renderChild(c, div); });
            parent.appendChild(div);
            return;
          }
          if (child.type === 'span') {
            var span = document.createElement('span');
            span.style.fontWeight = 'bold';
            span.textContent = child.props.children;
            parent.appendChild(span);
            return;
          }
          if (typeof child.type === 'function') {
            var LaunchButton = require('../components/LaunchButton');
            if (child.type === LaunchButton && child.props.workcellId) {
              var btn = document.createElement('button');
              btn.type = 'button';
              btn.className = 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold px-4 py-2 rounded mt-2 transition-colors';
              btn.textContent = '🚀 Launch ' + child.props.workcellId;
              btn.onclick = function() {
                LaunchButton.handleClick(child.props.workcellId);
              };
              parent.appendChild(btn);
            }
          }
        }
        
        step.props.children.forEach(function(child) { renderChild(child, stepElement); });
        stepElement.className = 'step relative';
        
        // Add copy buttons to all code blocks
        var codeBlocks = stepElement.querySelectorAll('code');
        codeBlocks.forEach(function(codeBlock) {
          var codeText = codeBlock.textContent;
          if (codeText && codeText.trim()) {
            var copyBtn = document.createElement('button');
            copyBtn.className = 'absolute top-2 right-2 bg-gradient-to-br from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 border-2 border-cyan-400 text-white px-2 py-1 rounded-lg text-xs shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70 transition-all w-8 font-bold flex items-center justify-center';
            copyBtn.textContent = '📋';
            copyBtn.onclick = function() {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(codeText).then(function() {
                  copyBtn.textContent = '✓';
                  setTimeout(function() { copyBtn.textContent = '📋'; }, 2000);
                }).catch(function() {
                  fallbackCopy(codeText, copyBtn);
                });
              } else {
                fallbackCopy(codeText, copyBtn);
              }
            };
            // Ensure the parent element has relative positioning for the copy button
            var parentElement = codeBlock.parentElement;
            parentElement.style.position = 'relative';
            // Make sure the code block itself has relative positioning context
            codeBlock.style.position = 'relative';
            codeBlock.appendChild(copyBtn);
          }
        });
        
        stepsContainer.appendChild(stepElement);
      });
    }

    var stepsGuide = document.getElementById('stepsGuide');
    if (stepsGuide) stepsGuide.style.display = 'block';
    
    // Build command string from all steps
    var allCommands = [];
    if (stepsContainer) {
      var codeElements = stepsContainer.querySelectorAll('code');
      codeElements.forEach(function(code) {
        allCommands.push(code.textContent);
      });
    }
    window.build_string = allCommands.join('\n\n');
    
    // Generate new key after steps are created
    console.log('build_string exists:', !!window.build_string);
    if (window.build_string) {
      apiClient.createKey(window.build_string, workcellId, testTitle).then(function(key) {
        try {
          if (key) {
            console.log('Generated key from server:', key);
            setGeneratedKey(key);
            apiClient.ping();
          } else {
            // Fallback: generate simple key if server is down
            var fallbackKey = Math.random().toString(36).substring(2, 15);
            console.log('Server unavailable, using fallback key:', fallbackKey);
            setGeneratedKey(fallbackKey);
          }
        } catch (e) {
          console.error('Error setting generated key:', e);
        }
      }).catch(function(error) {
        try {
          // Fallback: generate simple key if server error
          var fallbackKey = Math.random().toString(36).substring(2, 15);
          console.log('Server error:', error, 'using fallback key:', fallbackKey);
          setGeneratedKey(fallbackKey);
        } catch (e) {
          console.error('Error in fallback key generation:', e);
        }
      });
    }
  }
}

module.exports = ActionButtons;