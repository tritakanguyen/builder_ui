var React = require('react');

function SessionSidebar(props) {
  var onSaveSession = props.onSaveSession;
  var sessions = props.sessions;
  var onLoadSession = props.onLoadSession;
  var onDeleteSession = props.onDeleteSession;
  var isOpen = props.isOpen;
  var onClose = props.onClose;

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
      { className: 'fixed top-2 right-2 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-56 sm:w-60 lg:w-64 card border-cyan-500/30 z-[1150] text-xs ' + (isOpen ? 'block' : 'hidden md:block') },
      // Close button for mobile
      isOpen && React.createElement(
        'button',
        {
          className: 'md:hidden absolute -left-8 top-2 bg-slate-800 text-cyan-400 rounded w-6 h-6 flex items-center justify-center hover:bg-slate-700 border border-slate-700',
          onClick: onClose
        },
        '×'
      ),
      React.createElement(
        'div',
        { className: 'w-full max-h-[50vh] sm:max-h-[60vh] overflow-y-auto p-2 sm:p-3' },
        React.createElement(
          'h3',
          { className: 'text-xs font-bold mb-2 text-cyan-400 uppercase tracking-wider' },
          '🤖 Sessions'
        ),
      React.createElement(
        'table',
        { className: 'w-full text-xs border-collapse' },
        React.createElement(
          'thead',
          null,
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
      ),
      React.createElement(
        'button',
        {
          className: 'btn-primary w-full mt-3',
          onClick: onSaveSession
        },
        '🤖 SAVE SESSION'
      )
    )
    )
  );
}

module.exports = SessionSidebar;