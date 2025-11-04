var React = require('react');

function UserGuide(props) {
  var isOpen = props.isOpen;
  var onClose = props.onClose;
  var onDontShowAgain = props.onDontShowAgain;
  var onPrefillForm = props.onPrefillForm;
  var onClearForm = props.onClearForm;
  var onGenerateSteps = props.onGenerateSteps;

  var currentStepState = React.useState(0);
  var currentStep = currentStepState[0];
  var setCurrentStep = currentStepState[1];

  var hasPrefilledState = React.useState(false);
  var hasPrefilled = hasPrefilledState[0];
  var setHasPrefilled = hasPrefilledState[1];

  var hasGeneratedState = React.useState(false);
  var hasGenerated = hasGeneratedState[0];
  var setHasGenerated = hasGeneratedState[1];

  // Reset state when guide is reopened
  React.useEffect(function() {
    if (isOpen) {
      setCurrentStep(0);
      setHasPrefilled(false);
      setHasGenerated(false);
    }
  }, [isOpen]);

  var steps = [
    {
      id: 'welcome',
      title: 'Welcome to Workflow Builder! 🦾',
      description: 'This interactive guide will show you all the features. You can close it anytime and reopen with the 📖 button at the bottom-left.',
      position: 'center',
      highlight: null
    },
    {
      id: 'troubleshoot',
      title: 'Troubleshooting Guide (? Button)',
      description: 'Stuck? Click the ? button in the top-left corner anytime for quick solutions to common issues.',
      position: 'top-left',
      highlight: 'troubleshoot-btn'
    },
    {
      id: 'form-intro',
      title: 'The Main Form',
      description: 'This is where you configure your workflow. It has basic fields (Alias, Workcell ID, Date, Event ID, Station Type).',
      position: 'center-top',
      highlight: 'main-form'
    },
    {
      id: 'form-fields',
      title: 'Image Tag and Cherry pick',
      description: 'The checkboxes control: Image Tag swapping, Cherry Pick (CR changes) for service packages.',
      position: 'center-top',
      highlight: 'main-form'
    },
    {
      id: 'form-prefill',
      title: 'Try It: Prefill the Form',
      description: 'Click the button below to prefill the form with demo input. This will help you understand how everything works!',
      position: 'center',
      highlight: 'main-form',
      showPrefillButton: true
    },
    {
      id: 'sessions-save',
      title: 'Save Sessions After Setup',
      description: 'Now that you have data filled in, you can save your form as a session at anytime with "🤖 SAVE SESSION" button!',
      position: 'top-right',
      highlight: 'session-panel'
    },
    {
      id: 'generate-button',
      title: 'Generate Steps Button',
      description: 'Ready to generate? Click try the demo "▶ GENERATE STEPS" button!',
      position: 'center-bottom',
      highlight: 'action-buttons',
      showGenerateButton: true,
      scrollToButton: true
    },
    {
      id: 'workflow-steps',
      title: 'Individual Step Copy Buttons',
      description: 'Each step has its own "📋 Copy" button so you can quick copy step commands. Or you can double-click for highlighted and copy.',
      position: 'center',
      highlight: null
    },
    {
      id: 'auto-build',
      title: 'Auto Build Button (⚙) Developing...',
      description: 'After generating steps, the cyan ⚙ Auto Build button will be generatedabove the reset button. Click it to copy autobuild string key to use with autobuild script!',
      position: 'bottom-right',
      highlight: 'auto-build-btn'
    },
    {
      id: 'launch-button',
      title: 'Launch Button (🚀)',
      description: 'The "🚀 Launch" button. This is your shortcut to the workcell\'s UWC terminal!',
      position: 'center',
      highlight: 'launch-btn',
      scrollToBottom: true
    },
    {
      id: 'reset-button',
      title: 'Reset Form (↻ Button)',
      description: 'Want to start fresh? Click the ↻ button at the bottom-right to clear all form fields and reset everything.',
      position: 'bottom-right',
      highlight: 'reset-btn'
    },
    {
      id: 'guide-button',
      title: 'Guide Button (📖)',
      description: 'That\'s the button you used to open this guide! It\'s always at the bottom-left. Click it anytime you need help.',
      position: 'bottom-left',
      highlight: 'guide-btn'
    },

    {
      id: 'complete',
      title: 'You\'re Ready! ✨',
      description: 'You now know all the features! Try creating a workflow on your own, or click "Don\'t show again" below if you don\'t want to see this guide at startup.',
      position: 'center',
      highlight: null
    }
  ];

  var totalSteps = steps.length;

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      var step = steps[currentStep];
      // If on form-prefill step and haven't prefilled yet, don't advance
      if (step.id === 'form-prefill' && !hasPrefilled) {
        return;
      }
      // If on generate-button step and haven't generated yet, don't advance
      if (step.id === 'generate-button' && !hasGenerated) {
        return;
      }
      setCurrentStep(currentStep + 1);
      
      // Handle scrolling for specific steps
      var nextStep = steps[currentStep + 1];
      if (nextStep) {
        // Scroll to bottom for launch-button step
        if (nextStep.scrollToBottom) {
          setTimeout(function() {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            });
          }, 300);
        }
        // Scroll to action buttons for generate-button step
        else if (nextStep.scrollToButton) {
          setTimeout(function() {
            var actionButtons = document.querySelector('button[title="Demo Generate Steps"]');
            if (actionButtons) {
              actionButtons.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }
          }, 300);
        }
      }
    } else {
      // Clean up on finish
      if (hasPrefilled && onClearForm) {
        onClearForm();
      }
      onClose();
    }
  }

  function handlePrefill() {
    if (onPrefillForm) {
      onPrefillForm();
      setHasPrefilled(true);
    }
  }

  function handleGenerate() {
    if (onGenerateSteps) {
      onGenerateSteps();
      setHasGenerated(true);
      // Scroll down to show generated steps after a short delay
      setTimeout(function() {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 1000);
    }
  }

  function handlePrev() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleSkip() {
    if (hasPrefilled && onClearForm) {
      onClearForm();
    }
    setCurrentStep(0);
    setHasPrefilled(false);
    setHasGenerated(false);
    onClose();
  }

  function handleDontShow() {
    if (hasPrefilled && onClearForm) {
      onClearForm();
    }
    setCurrentStep(0);
    setHasPrefilled(false);
    setHasGenerated(false);
    onDontShowAgain();
  }

  var step = steps[currentStep];

  // Get tooltip position - returns object with className and style
  function getTooltipPosition(position, stepId) {
    var positions = {
      'top-left': 'fixed top-14 left-2 sm:top-16 sm:left-4 md:top-20 md:left-6',
      'top-right': 'fixed top-14 right-2 sm:top-16 sm:right-4 md:top-20 md:right-6',
      'bottom-right': 'fixed bottom-14 right-2 sm:bottom-16 sm:right-4 md:bottom-20 md:right-6',
      'bottom-left': 'fixed bottom-14 left-2 sm:bottom-16 sm:left-4 md:bottom-20 md:left-6',
      'center-top': 'fixed top-20 left-1/2 -translate-x-1/2 sm:top-1/4',
      'center-bottom': 'fixed bottom-20 left-1/2 -translate-x-1/2 sm:bottom-1/4',
      'center-right': 'fixed top-1/3 right-64 sm:right-72 lg:right-80 -translate-y-1/2',
      'center': 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
    };
    
    var className = positions[position] || positions['center'];
    var style = {};
    
    // Special adjustment for form-fields step
    if (stepId === 'form-fields') {
      style.top = 'calc(5rem + 350px)'; // Add 244px to the top position
    }
    
    // Special adjustment for sessions-save step
    if (stepId === 'sessions-save') {
      style.top = 'calc(3.5rem + 150px)'; // Add 200px to the top position
    }
    
    // Special adjustment for generate-button step
    if (stepId === 'generate-button') {
      style.bottom = 'calc(5rem - 20px)'; // Lower by 150px (move up from bottom)
    }
    
    // Special adjustment for auto-build step
    if (stepId === 'auto-build') {
      style.bottom = 'calc(3.5rem + 50px)'; // Move up 50px
    }
    
    // Special adjustment for launch-button step
    if (stepId === 'launch-button') {
      style.top = 'calc(50% + 130px)'; // Lower by 50px from center
    }
    
    return {
      className: className,
      style: style
    };
  }

  if (!isOpen) return null;

  // Safety check
  if (!step) return null;

  return React.createElement(
    React.Fragment,
    null,
    // Overlay backdrop - lighter and less intrusive
    React.createElement('div', {
      className: 'fixed inset-0 bg-black/30 z-[2000]',
      onClick: handleSkip
    }),
    // Tooltip card
    React.createElement(
      'div',
      {
        className: getTooltipPosition(step.position, step.id).className + ' z-[2002] w-[calc(100vw-1rem)] max-w-[280px] sm:max-w-[320px] md:max-w-[360px] bg-slate-900 border-2 border-cyan-500 rounded-lg shadow-2xl p-3 sm:p-4',
        style: getTooltipPosition(step.position, step.id).style
      },
      // Close button
      React.createElement(
        'button',
        {
          className: 'absolute -top-2 -right-2 bg-slate-800 text-cyan-400 rounded-full w-6 h-6 flex items-center justify-center hover:bg-slate-700 border border-cyan-500 text-sm z-10',
          onClick: handleSkip
        },
        '×'
      ),
      // Content
      React.createElement(
        'div',
        { className: 'mb-3 sm:mb-4' },
        React.createElement(
          'h3',
          { className: 'text-cyan-400 font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2' },
          step.title
        ),
        React.createElement(
          'p',
          { className: 'text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed' },
          step.description
        )
      ),
      // Prefill button for form-prefill step
      (step.showPrefillButton === true) && !hasPrefilled && React.createElement(
        'button',
        {
          className: 'w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold px-4 py-2 text-sm rounded transition-all mb-3 sm:mb-4',
          onClick: handlePrefill
        },
        '✨ Prefill Example Data'
      ),
      // Message after prefill
      (step.showPrefillButton === true) && hasPrefilled && React.createElement(
        'div',
        { className: 'bg-green-900/30 border border-green-500 text-green-400 px-3 py-2 rounded text-xs mb-3 sm:mb-4 text-center' },
        '✓ Form filled! Click "Next" to continue.'
      ),
      // Generate button for generate-button step
      (step.showGenerateButton === true) && !hasGenerated && React.createElement(
        'button',
        {
          className: 'w-full bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 text-sm rounded transition-all mb-3 sm:mb-4',
          onClick: handleGenerate
        },
        '▶ Generate Steps Now'
      ),
      // Message after generate
      (step.showGenerateButton === true) && hasGenerated && React.createElement(
        'div',
        { className: 'bg-green-900/30 border border-green-500 text-green-400 px-3 py-2 rounded text-xs mb-3 sm:mb-4 text-center' },
        '✓ Steps generated! Scroll down to see them. Click "Next" to continue.'
      ),
      // Progress indicator
      React.createElement(
        'div',
        { className: 'flex gap-1 mb-3 sm:mb-4 justify-center' },
        Array.from({ length: totalSteps }).map(function(_, idx) {
          return React.createElement('div', {
            key: idx,
            className: 'h-1 w-4 sm:w-6 rounded-full transition-all ' + (idx === currentStep ? 'bg-cyan-500' : 'bg-slate-700')
          });
        })
      ),
      // Navigation buttons
      React.createElement(
        'div',
        { className: 'flex gap-2 justify-between items-center' },
        React.createElement(
          'button',
          {
            className: 'text-slate-400 hover:text-slate-300 text-[10px] sm:text-xs underline',
            onClick: handleDontShow
          },
          'Don\'t show again'
        ),
        React.createElement(
          'div',
          { className: 'flex gap-1 sm:gap-2' },
          currentStep > 0 && React.createElement(
            'button',
            {
              className: 'bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded transition-all',
              onClick: handlePrev
            },
            'Back'
          ),
          currentStep < totalSteps - 1 ? React.createElement(
            'button',
            {
              className: 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded transition-all ' + (step.id === 'form-prefill' && !hasPrefilled ? 'opacity-50 cursor-not-allowed' : ''),
              onClick: handleNext,
              disabled: step.id === 'form-prefill' && !hasPrefilled
            },
            'Next'
          ) : React.createElement(
            'button',
            {
              className: 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded transition-all',
              onClick: handleNext
            },
            'Finish'
          )
        )
      )
    )
  );
}

module.exports = UserGuide;
