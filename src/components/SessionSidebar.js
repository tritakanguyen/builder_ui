var React = require('react');

function SessionSidebar(props) {
  var sessions = props.sessions;
  var setSessions = props.setSessions;
  var onLoadSession = props.onLoadSession;
  var onDeleteSession = props.onDeleteSession;
  var isOpen = props.isOpen;
  var onClose = props.onClose;
  var showNotification = props.showNotification;
  var formData = props.formData;

  var _React$useState = React.useState({ x: 0, y: 0 });
  var position = _React$useState[0];
  var setPosition = _React$useState[1];
  var _React$useState2 = React.useState(false);
  var isDragging = _React$useState2[0];
  var setIsDragging = _React$useState2[1];
  var _React$useState3 = React.useState({ x: 0, y: 0 });
  var dragStart = _React$useState3[0];
  var setDragStart = _React$useState3[1];

  function handleDragStart(e) {
    e.preventDefault();
    var rect = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
    setIsDragging(true);
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  React.useEffect(function() {
    function handleMouseMove(e) {
      if (!isDragging) return;
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return function() {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  function formatTimestamp() {
    var d = new Date();
    var month = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    var hours = ('0' + d.getHours()).slice(-2);
    var minutes = ('0' + d.getMinutes()).slice(-2);
    return month + '-' + day + '@' + hours + ':' + minutes;
  }

  function handleSaveSession() {
    if (!formData.testTitle.trim()) {
      showNotification('Test Title is required to save a session.', 'warning');
      return;
    }
    
    var newSession = {
      id: Date.now(),
      name: formData.testTitle,
      timestamp: formatTimestamp(),
      testDate: formData.testDate,
      testTitle: formData.testTitle,
      workcellId: formData.workcellId,
      eventId: formData.eventId,
      workcellType: formData.workcellType,
      imageTag: formData.imageTag,
      imageTagValue: formData.imageTagValue,
      imageTagInputs: formData.imageTagInputs,
      cherryPick: formData.cherryPick,
      vsConfigPick: formData.vsConfigPick,
      vsConfigPickValue: formData.vsConfigPickValue,
      deployArtifactsPick: formData.deployArtifactsPick,
      deployArtifactsPickValue: formData.deployArtifactsPickValue,
      dynamicInputs: formData.dynamicInputs
    };
    
    var updated = [newSession].concat(sessions).slice(0, 10);
    setSessions(updated);
    
    try {
      localStorage.setItem('builder_sessions', JSON.stringify(updated));
      showNotification('Session saved successfully!', 'success');
    } catch (e) {
      console.error('Failed to save session to localStorage:', e);
      showNotification('Failed to save session', 'error');
    }
  }

  return React.createElement(
    React.Fragment,
    null,
    // Backdrop for mobile
    isOpen && React.createElement(
      'div',
      {
        className: 'md:hidden fixed inset-0 bg-black/50 z-[1100]',
        onClick: onClose
      }
    ),
    // Sidebar
    React.createElement(
      'div',
      { 
        className: 'fixed w-56 sm:w-60 lg:w-64 card border-cyan-500/30 z-[1150] text-xs ' + (isOpen ? 'block' : 'hidden'),
        style: { 
          top: position.y === 0 ? '0.5rem' : position.y + 'px', 
          right: position.x === 0 ? '0.5rem' : 'auto',
          left: position.x !== 0 ? position.x + 'px' : 'auto'
        }
      },
      React.createElement(
        'div',
        { className: 'p-2 sm:p-3' },
        React.createElement(
          'div',
          { 
            className: 'flex items-center justify-between mb-2 ' + (isDragging ? 'cursor-grabbing' : 'cursor-grab'),
            onMouseDown: handleDragStart
          },
          React.createElement(
            'h3',
            { className: 'text-xs font-bold text-cyan-400 uppercase tracking-wider select-none' },
            '🤖 Sessions'
          ),
          React.createElement(
            'button',
            {
              className: 'text-slate-400 hover:text-cyan-400 text-lg leading-none',
              onClick: onClose,
              title: 'Close'
            },
            '×'
          )
        ),
        React.createElement(
          'div',
          { className: 'max-h-[20vh] overflow-y-auto border border-slate-700 rounded' },
          React.createElement(
            'table',
            { className: 'w-full text-xs border-collapse' },
            React.createElement(
              'thead',
              { className: 'sticky top-0' },
              React.createElement(
                'tr',
                { className: 'border-b border-slate-700' },
                React.createElement('th', { className: 'bg-slate-950 text-cyan-400 py-1.5 text-left px-2 text-[10px]' }, 'Name'),
                React.createElement('th', { className: 'bg-slate-950 text-cyan-400 py-1.5 text-left px-2 text-[10px]' }, 'Time'),
                React.createElement('th', { className: 'bg-slate-950 text-cyan-400 py-1.5 text-center px-1 text-[10px]' }, 'Act')
              )
            ),
            React.createElement(
              'tbody',
              null,
              sessions.length === 0 && React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  { colSpan: '3', className: 'text-slate-500 text-center py-4' },
                  'No saved sessions'
                )
              ),
              sessions.map(function(s, idx) {
                return React.createElement(
                  'tr',
                  { key: s.id || idx, className: 'border-b border-slate-800 hover:bg-slate-800/50' },
                  React.createElement('td', { className: 'py-1.5 px-2 text-slate-300 text-[10px] truncate max-w-[80px]' }, s.name),
                  React.createElement('td', { className: 'py-1.5 px-2 text-slate-400 text-[10px]' }, s.timestamp),
                  React.createElement(
                    'td',
                    { className: 'py-1.5 px-1 text-center' },
                    React.createElement(
                      'button',
                      {
                        className: 'text-cyan-500 hover:text-cyan-400 mr-1 text-sm',
                        onClick: function() { onLoadSession(idx); }
                      },
                      '↓'
                    ),
                    React.createElement(
                      'button',
                      {
                        className: 'text-red-500 hover:text-red-400',
                        onClick: function() { onDeleteSession(idx); }
                      },
                      '✕'
                    )
                  )
                );
              })
            )
          )
        ),
        React.createElement(
          'button',
          {
            className: 'btn-primary w-full mt-3',
            onClick: handleSaveSession
          },
          '🤖 SAVE SESSION'
        )
      )
    )
  );
}

module.exports = SessionSidebar;