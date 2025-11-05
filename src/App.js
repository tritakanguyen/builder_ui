var React = require('react');
var StepsGuide = require('./components/StepsGuide');
var SessionSidebar = require('./components/SessionSidebar');
var TroubleshootPanel = require('./components/TroubleshootPanel');
var MainForm = require('./components/MainForm');
var ActionButtons = require('./components/ActionButtons');
var UserGuide = require('./components/UserGuide');
var BuilderSetupScript = require('./components/BuilderSetupScript');

function App() {
  var troubleshootOpenState = React.useState(false);
  var troubleshootOpen = troubleshootOpenState[0];
  var setTroubleshootOpen = troubleshootOpenState[1];

  var sessionSidebarOpenState = React.useState(false);
  var sessionSidebarOpen = sessionSidebarOpenState[0];
  var setSessionSidebarOpen = sessionSidebarOpenState[1];

  var showSessionReminderState = React.useState(true);
  var showSessionReminder = showSessionReminderState[0];
  var setShowSessionReminder = showSessionReminderState[1];

  var userGuideOpenState = React.useState(function() {
    // Show guide on first visit
    return localStorage.getItem('hide_user_guide') !== 'true';
  });
  var userGuideOpen = userGuideOpenState[0];
  var setUserGuideOpen = userGuideOpenState[1];

  var testDateState = React.useState('');
  var testDate = testDateState[0];
  var setTestDate = testDateState[1];

  var testTitleState = React.useState('');
  var testTitle = testTitleState[0];
  var setTestTitle = testTitleState[1];

  var workspaceTitleState = React.useState('');
  var workspaceTitle = workspaceTitleState[0];
  var setWorkspaceTitle = workspaceTitleState[1];

  var workcellIdState = React.useState('');
  var workcellId = workcellIdState[0];
  var setWorkcellId = workcellIdState[1];

  var eventIdState = React.useState('');
  var eventId = eventIdState[0];
  var setEventId = eventIdState[1];

  var sectionsState = React.useState('');
  var sections = sectionsState[0];
  var setSections = sectionsState[1];

  var imageTagState = React.useState(false);
  var imageTag = imageTagState[0];
  var setImageTag = imageTagState[1];

  var imageTagValueState = React.useState('');
  var imageTagValue = imageTagValueState[0];
  var setImageTagValue = imageTagValueState[1];

  var cherryPickState = React.useState(false);
  var cherryPick = cherryPickState[0];
  var setCherryPick = cherryPickState[1];

  var vsConfigPickState = React.useState(false);
  var vsConfigPick = vsConfigPickState[0];
  var setVsConfigPick = vsConfigPickState[1];

  var vsConfigPickValueState = React.useState('');
  var vsConfigPickValue = vsConfigPickValueState[0];
  var setVsConfigPickValue = vsConfigPickValueState[1];

  var deployArtifactsPickState = React.useState(false);
  var deployArtifactsPick = deployArtifactsPickState[0];
  var setDeployArtifactsPick = deployArtifactsPickState[1];

  var deployArtifactsPickValueState = React.useState('');
  var deployArtifactsPickValue = deployArtifactsPickValueState[0];
  var setDeployArtifactsPickValue = deployArtifactsPickValueState[1];

  var dynamicInputsState = React.useState([]);
  var dynamicInputs = dynamicInputsState[0];
  var setDynamicInputs = dynamicInputsState[1];

  var sessionsState = React.useState(function() {
    try {
      return JSON.parse(localStorage.getItem('builder_sessions') || '[]');
    } catch (e) {
      return [];
    }
  });
  var sessions = sessionsState[0];
  var setSessions = sessionsState[1];

  var formWarningState = React.useState('');
  var formWarning = formWarningState[0];
  var setFormWarning = formWarningState[1];

  var stepsGeneratedState = React.useState(false);
  var stepsGenerated = stepsGeneratedState[0];
  var setStepsGenerated = stepsGeneratedState[1];

  var generatedKeyState = React.useState(null);
  var generatedKey = generatedKeyState[0];
  var setGeneratedKey = generatedKeyState[1];

  React.useEffect(function() {
    console.log('stepsGenerated:', stepsGenerated, 'generatedKey:', generatedKey);
  }, [stepsGenerated, generatedKey]);

  // Check for generated steps to show auto-build button
  React.useEffect(function() {
    var interval = setInterval(function() {
      if (sections) {
        var stepsContainer = document.getElementById(sections + 'Steps');
        if (stepsContainer && stepsContainer.children.length > 0) {
          setStepsGenerated(true);
          clearInterval(interval);
        }
      }
    }, 500);

    return function() {
      clearInterval(interval);
    };
  }, [sections]);

  // Update workspace title as user types
  React.useEffect(function() {
    var title = (testTitle || '[alias]') + '-' + (workcellId || '[station]') + '-' + (testDate || '[Date]');
    if (title !== workspaceTitle) {
      setWorkspaceTitle(title);
    }
  }, [testDate, testTitle, workcellId, workspaceTitle]);

  // Set default section based on workcellId
  React.useEffect(function() {
    if (workcellId) {
      var newSection = ['0202', '0205', '0302', '0305'].indexOf(workcellId) !== -1 ? 'induct' : 'stow';
      if (newSection !== sections) {
        setSections(newSection);
      }
    }
  }, [workcellId, sections]);

  function handleSaveSession() {
    if (!testTitle.trim()) {
      setFormWarning('Test Title is required to save a session.');
      return;
    }
    
    setFormWarning('');
    var newSession = {
      id: Date.now(),
      name: testTitle,
      timestamp: (function() {
        var d = new Date();
        var month = ('0' + (d.getMonth() + 1)).slice(-2);
        var day = ('0' + d.getDate()).slice(-2);
        var hours = ('0' + d.getHours()).slice(-2);
        var minutes = ('0' + d.getMinutes()).slice(-2);
        return month + '-' + day + '@' + hours + ':' + minutes;
      })(),
      testDate: testDate,
      testTitle: testTitle,
      workcellId: workcellId,
      eventId: eventId,
      sections: sections,
      imageTag: imageTag,
      imageTagValue: imageTagValue,
      cherryPick: cherryPick,
      vsConfigPick: vsConfigPick,
      vsConfigPickValue: vsConfigPickValue,
      deployArtifactsPick: deployArtifactsPick,
      deployArtifactsPickValue: deployArtifactsPickValue,
      dynamicInputs: dynamicInputs
    };
    var updated = [newSession].concat(sessions).slice(0, 10);
    setSessions(updated);
    localStorage.setItem('builder_sessions', JSON.stringify(updated));
  }

  function handleLoadSession(idx) {
    var s = sessions[idx];
    if (!s) return;
    if (!window.confirm('Load this session? This will overwrite your current form data.')) return;
    setTestDate(s.testDate);
    setTestTitle(s.testTitle);
    setWorkcellId(s.workcellId || '');
    setEventId(s.eventId || '');
    setSections(s.sections);
    setImageTag(s.imageTag || false);
    setImageTagValue(s.imageTagValue || '');
    setCherryPick(s.cherryPick || false);
    setVsConfigPick(s.vsConfigPick || false);
    setVsConfigPickValue(s.vsConfigPickValue || '');
    setDeployArtifactsPick(s.deployArtifactsPick || false);
    setDeployArtifactsPickValue(s.deployArtifactsPickValue || '');
    setDynamicInputs(s.dynamicInputs || []);
  }

  function handleDeleteSession(idx) {
    if (!window.confirm('Delete this session?')) return;
    var updated = sessions.filter(function(_, i) {
      return i !== idx;
    });
    setSessions(updated);
    localStorage.setItem('builder_sessions', JSON.stringify(updated));
  }

  function handleResetForm() {
    if (!window.confirm('Reset all form fields? This will clear all your current data.')) return;
    setTestDate('');
    setTestTitle('');
    setWorkcellId('');
    setEventId('');
    setSections('');
    setImageTag(false);
    setImageTagValue('');
    setCherryPick(false);
    setVsConfigPick(false);
    setVsConfigPickValue('');
    setDeployArtifactsPick(false);
    setDeployArtifactsPickValue('');
    setDynamicInputs([]);
    setFormWarning('');
    setStepsGenerated(false);
    
    // Clear generated steps
    var stepsGuide = document.getElementById('stepsGuide');
    if (stepsGuide) stepsGuide.style.display = 'none';
    var stepsContainers = ['stowSteps', 'bufferSteps', 'inductSteps'];
    stepsContainers.forEach(function(id) {
      var container = document.getElementById(id);
      if (container) container.innerHTML = '';
    });
  }

  function handleDontShowGuide() {
    localStorage.setItem('hide_user_guide', 'true');
    setUserGuideOpen(false);
  }

  function handlePrefillForm() {
    // Prefill with example data for the tutorial including checkboxes
    setTestDate('2024-11-15');
    setTestTitle('demo-test');
    setWorkcellId('0206');
    setEventId('example-event-123');
    setSections('stow');
    // Enable checkboxes with demo data
    setImageTag(true);
    setImageTagValue('v1.2.3-demo');
    setCherryPick(true);
    setVsConfigPick(true);
    setVsConfigPickValue('demo-config.json');
    setDeployArtifactsPick(true);
    setDeployArtifactsPickValue('demo-artifacts.zip');
  }

  function handleClearPrefill() {
    // Only clear if it's the example data
    if (testTitle === 'demo-test') {
      setTestDate('');
      setTestTitle('');
      setWorkcellId('');
      setEventId('');
      setSections('');
      // Clear checkbox demo data
      setImageTag(false);
      setImageTagValue('');
      setCherryPick(false);
      setVsConfigPick(false);
      setVsConfigPickValue('');
      setDeployArtifactsPick(false);
      setDeployArtifactsPickValue('');
    }
  }

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-slate-950 p-2 sm:p-4 lg:p-6' },
    React.createElement(TroubleshootPanel, {
      open: troubleshootOpen,
      onClose: function() { setTroubleshootOpen(false); }
    }),
    React.createElement(UserGuide, {
      isOpen: userGuideOpen,
      onClose: function() { setUserGuideOpen(false); },
      onDontShowAgain: handleDontShowGuide,
      onPrefillForm: handlePrefillForm,
      onClearForm: handleClearPrefill,
      onGenerateSteps: function() {
        // Programmatically click the generate button
        var generateBtn = document.querySelector('button[title="Generate workflow steps"]');
        if (generateBtn) {
          generateBtn.click();
        }
      }
    }),
    !troubleshootOpen && React.createElement(
      'button',
      {
        className: 'fixed left-2 top-2 sm:left-3 sm:top-3 z-[1200] bg-slate-800 text-cyan-400 rounded-lg w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center shadow-lg hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 transition-all text-xs sm:text-sm',
        title: 'Open Troubleshooting Guide',
        onClick: function() { setTroubleshootOpen(true); }
      },
      React.createElement('span', { className: 'font-bold' }, '?')
    ),
    !sessionSidebarOpen && React.createElement(
      'button',
      {
        className: 'md:hidden fixed right-2 top-2 sm:right-3 sm:top-3 z-[1200] bg-slate-800 text-cyan-400 rounded-lg w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center shadow-lg hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 transition-all text-xs sm:text-sm',
        title: 'Open Sessions',
        onClick: function() { 
          setSessionSidebarOpen(true); 
          setShowSessionReminder(false);
        }
      },
      React.createElement('span', { className: 'font-bold' }, '🤖')
    ),
    // Reminder message for session button
    !sessionSidebarOpen && showSessionReminder && React.createElement(
      'div',
      { className: 'md:hidden fixed right-12 sm:right-14 top-2 sm:top-3 z-[1100] w-48 sm:w-52 bg-cyan-900/30 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-2 shadow-lg' },
      React.createElement(
        'button',
        {
          className: 'absolute -top-2 -right-2 bg-slate-800 text-cyan-400 rounded-full w-5 h-5 flex items-center justify-center hover:bg-slate-700 border border-slate-700 text-xs',
          onClick: function() { setShowSessionReminder(false); }
        },
        '×'
      ),
      React.createElement('div', { className: 'text-cyan-300 text-[10px] font-semibold mb-1' }, '💡 Sessions Feature'),
      React.createElement('div', { className: 'text-cyan-200 text-[9px] mb-1' }, 'Tap the 🤖 button to save/load your form data.'),
      React.createElement('div', { className: 'text-cyan-400/70 text-[8px]' }, 'Sessions are stored locally.')
    ),
    // Auto-build button - shows above reset button after steps are generated
    stepsGenerated && generatedKey && React.createElement(
      'button',
      {
        className: 'fixed right-2 bottom-14 sm:right-2.5 sm:bottom-16 z-[1300] bg-cyan-600 hover:bg-cyan-500 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg transition-all text-sm font-bold',
        title: 'Key: ' + generatedKey + ' (Click to copy)',
        onClick: function() {
          navigator.clipboard.writeText(generatedKey).then(function() {
            alert('Key copied: ' + generatedKey);
          }).catch(function() {
            var textarea = document.createElement('textarea');
            textarea.value = generatedKey;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Key copied: ' + generatedKey);
          });
        }
      },
      '⚙'
    ),
    // Reset button - fixed at bottom-right
    React.createElement(
      'button',
      {
        className: 'fixed right-2 bottom-2 sm:right-2.5 sm:bottom-2.5 z-[1300] bg-slate-600 hover:bg-slate-500 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg transition-all text-xl font-bold',
        title: 'Reset Form',
        onClick: handleResetForm
      },
      '↻'
    ),
    // Builder setup script button - fixed at bottom-left above user guide
    React.createElement(BuilderSetupScript, { workcellId: workcellId }),
    // User guide toggle button - fixed at bottom-left
    React.createElement(
      'button',
      {
        className: 'fixed left-2 bottom-2 sm:left-2.5 sm:bottom-2.5 z-[1300] bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg transition-all text-lg font-bold',
        title: 'How to Use',
        onClick: function() { setUserGuideOpen(true); }
      },
      '📖'
    ),
    React.createElement(
      'div',
      { className: 'max-w-full sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto card p-3 sm:p-4 lg:p-5 mt-12 sm:mt-14 md:mt-4 lg:mt-0' },
      React.createElement(
        'div',
        { className: 'sticky top-0 z-20 bg-slate-900 pb-2 sm:pb-3 mb-3 sm:mb-4 -mx-3 sm:-mx-4 lg:-mx-5 px-3 sm:px-4 lg:px-5 pt-2 border-b border-cyan-500/30' },
        React.createElement(
          'h1',
          { className: 'text-lg sm:text-xl lg:text-2xl font-bold text-cyan-400 tracking-wider' },
          '🦾 WORKFLOW BUILDER'
        )
      ),
      React.createElement(MainForm, {
        testDate: testDate,
        setTestDate: setTestDate,
        testTitle: testTitle,
        setTestTitle: setTestTitle,
        workspaceTitle: workspaceTitle,
        workcellId: workcellId,
        setWorkcellId: setWorkcellId,
        eventId: eventId,
        setEventId: setEventId,
        sections: sections,
        setSections: setSections,
        imageTag: imageTag,
        setImageTag: setImageTag,
        imageTagValue: imageTagValue,
        setImageTagValue: setImageTagValue,
        cherryPick: cherryPick,
        setCherryPick: setCherryPick,
        vsConfigPick: vsConfigPick,
        setVsConfigPick: setVsConfigPick,
        vsConfigPickValue: vsConfigPickValue,
        setVsConfigPickValue: setVsConfigPickValue,
        deployArtifactsPick: deployArtifactsPick,
        setDeployArtifactsPick: setDeployArtifactsPick,
        deployArtifactsPickValue: deployArtifactsPickValue,
        setDeployArtifactsPickValue: setDeployArtifactsPickValue,
        dynamicInputs: dynamicInputs,
        setDynamicInputs: setDynamicInputs
      }),

      formWarning && React.createElement(
        'div',
        { className: 'bg-red-900/30 border border-red-500 text-red-400 px-4 py-2 rounded mb-4' },
        formWarning
      ),
      React.createElement(ActionButtons, {
        testDate: testDate,
        testTitle: testTitle,
        workspaceTitle: workspaceTitle,
        sections: sections,
        imageTag: imageTag,
        imageTagValue: imageTagValue,
        cherryPick: cherryPick,
        dynamicInputs: dynamicInputs,
        eventId: eventId,
        workcellId: workcellId,
        setFormWarning: setFormWarning,
        setSections: setSections,
        setTestDate: setTestDate,
        setTestTitle: setTestTitle,
        deployArtifactsPickValue: deployArtifactsPickValue,
        vsConfigPickValue: vsConfigPickValue,
        vsConfigPick: vsConfigPick,
        setGeneratedKey: setGeneratedKey
      }),
      React.createElement(StepsGuide, { activeSections: sections }),
      React.createElement(SessionSidebar, {
        onSaveSession: handleSaveSession,
        sessions: sessions,
        onLoadSession: handleLoadSession,
        onDeleteSession: handleDeleteSession,
        isOpen: sessionSidebarOpen,
        onClose: function() { 
          setSessionSidebarOpen(false); 
          setShowSessionReminder(true);
        }
      })
    )
  );
}

module.exports = App;