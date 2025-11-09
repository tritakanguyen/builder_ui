var launchHelper = require('./launchHelper');

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
    if (parent.getAttribute('data-image-tag') === 'true') {
      code.style.marginBottom = '30px';
      code.style.display = 'block';
    }
    parent.appendChild(code);
    return;
  }
  if (child.type === 'div') {
    var div = document.createElement('div');
    if (child.props.style && child.props.style.marginTop) {
      Object.assign(div.style, child.props.style);
      div.style.position = 'relative';
      div.setAttribute('data-image-tag', 'true');
    }
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
    var LaunchButton = require('../components/buttons/LaunchButton');
    if (child.type === LaunchButton && child.props.workcellId) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold px-4 py-2 rounded mt-2 transition-colors';
      btn.textContent = '🚀 Launch ' + child.props.workcellId;
      btn.onclick = function() {
        launchHelper.handleLaunch(child.props.workcellId);
      };
      parent.appendChild(btn);
    }
  }
}

function renderSteps(steps, workcellType) {
  var stepsContainer = document.getElementById(workcellType + 'Steps');
  if (!stepsContainer || steps.length === 0) return;

  stepsContainer.innerHTML = '';
  var standardX = null;
  
  steps.forEach(function(step, stepIdx) {
    var stepElement = document.createElement('div');
    
    step.props.children.forEach(function(child) { renderChild(child, stepElement); });
    stepElement.className = 'step relative';
    
    var imageDivs = stepElement.querySelectorAll('div[data-image-tag="true"]');
    if (imageDivs.length > 0) {
      imageDivs.forEach(function(div, idx) {
        var codeBlock = div.querySelector('code');
        if (codeBlock) {
          var copyBtn = document.createElement('button');
          copyBtn.className = 'absolute bg-gradient-to-br from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 border-2 border-cyan-400 text-white px-2 py-1 rounded-lg text-xs shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70 transition-all w-8 font-bold flex items-center justify-center';
          copyBtn.style.right = '0.5rem';
          copyBtn.textContent = '📋';
          var codeText = codeBlock.textContent;
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
          stepElement.appendChild(copyBtn);
          
          setTimeout(function() {
            var divRect = div.getBoundingClientRect();
            var stepRect = stepElement.getBoundingClientRect();
            copyBtn.style.top = (divRect.top - stepRect.top - 8) + 'px';
          }, 0);
        }
      });
    } else {
      var codeBlocks = stepElement.querySelectorAll('code');
      var allCodeText = [];
      codeBlocks.forEach(function(codeBlock) {
        var codeText = codeBlock.textContent;
        if (codeText && codeText.trim()) {
          allCodeText.push(codeText);
        }
      });
      
      if (allCodeText.length > 0) {
        var copyBtn = document.createElement('button');
        copyBtn.className = 'absolute top-2 bg-gradient-to-br from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 border-2 border-cyan-400 text-white px-2 py-1 rounded-lg text-xs shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70 transition-all w-8 font-bold flex items-center justify-center';
        copyBtn.style.right = '0.5rem';
        copyBtn.textContent = '📋';
        var combinedText = allCodeText.join('\n\n');
        copyBtn.onclick = function() {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(combinedText).then(function() {
              copyBtn.textContent = '✓';
              setTimeout(function() { copyBtn.textContent = '📋'; }, 2000);
            }).catch(function() {
              fallbackCopy(combinedText, copyBtn);
            });
          } else {
            fallbackCopy(combinedText, copyBtn);
          }
        };
        stepElement.appendChild(copyBtn);
        
        if (stepIdx === 0) {
          setTimeout(function() {
            var rect = copyBtn.getBoundingClientRect();
            standardX = rect.right;
            console.log('Standard X position set to:', standardX);
          }, 0);
        }
      }
    }
    
    stepsContainer.appendChild(stepElement);
  });
}

function showStepsGuide() {
  var stepsGuide = document.getElementById('stepsGuide');
  if (stepsGuide) stepsGuide.style.display = 'block';
}

function collectCommands(workcellType) {
  var stepsContainer = document.getElementById(workcellType + 'Steps');
  var allCommands = [];
  if (stepsContainer) {
    var codeElements = stepsContainer.querySelectorAll('code');
    codeElements.forEach(function(code) {
      allCommands.push(code.textContent);
    });
  }
  return allCommands.join('\n\n');
}

module.exports = {
  renderSteps: renderSteps,
  showStepsGuide: showStepsGuide,
  collectCommands: collectCommands
};
