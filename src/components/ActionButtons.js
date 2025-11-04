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

  function generateSteps() {
    if (!sections) {
      alert('Please select a section first.');
      return;
    }

    var steps = stepGenerator.generateSteps({
      sections: sections,
      workspaceTitle: workspaceTitle,
      imageTag: imageTag,
      imageTagValue: imageTagValue,
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
        var commandText = '';
        var isManualStep = false;
        
        function renderChild(child) {
          if (typeof child === 'string') return child;
          if (child.type === 'strong') {
            var text = child.props.children;
            if (text.includes('Apply image tag')) isManualStep = true;
            return '<strong>' + text + '</strong>';
          }
          if (child.type === 'code') {
            commandText = child.props.children;
            return '<code>' + commandText + '</code>';
          }
          if (child.type === 'div') {
            return '<div>' + child.props.children.map(renderChild).join('') + '</div>';
          }
          if (child.type === 'span') {
            return '<span style="font-weight: bold;">' + child.props.children + '</span>';
          }
          if (typeof child.type === 'function') {
            var LaunchButton = require('../components/LaunchButton');
            if (child.type === LaunchButton && child.props.workcellId) {
              var onClickLogic = LaunchButton.getOnClickLogic(child.props.workcellId);
              if (onClickLogic) {
                return '<button type="button" class="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold px-4 py-2 rounded mt-2 transition-colors" onclick="' + onClickLogic + '">🚀 Launch ' + child.props.workcellId + '</button>';
              }
            }
          }
          return '';
        }
        
        stepElement.innerHTML = step.props.children.map(renderChild).join('');
        stepElement.className = 'step relative';
        
        if (commandText && !isManualStep) {
          var copyBtn = document.createElement('button');
          copyBtn.className = 'absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-cyan-400 px-2 py-1 rounded text-xs transition-colors w-8';
          copyBtn.textContent = '📋';
          copyBtn.onclick = function() {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(commandText).then(function() {
                copyBtn.textContent = '✓';
                setTimeout(function() { copyBtn.textContent = '📋'; }, 2000);
              }).catch(function() {
                fallbackCopy(commandText, copyBtn);
              });
            } else {
              fallbackCopy(commandText, copyBtn);
            }
          };
          stepElement.appendChild(copyBtn);
        }
        
        stepsContainer.appendChild(stepElement);
      });
      
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
      }).catch(function(error) {
        // Fallback: generate simple key if server error
        var fallbackKey = Math.random().toString(36).substring(2, 15);
        console.log('Server error:', error, 'using fallback key:', fallbackKey);
        setGeneratedKey(fallbackKey);
      });
    }
  }
}

module.exports = ActionButtons;