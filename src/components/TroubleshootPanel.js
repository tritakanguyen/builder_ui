var React = require('react');

function TroubleshootPanel(props) {
  var open = props.open;
  var onClose = props.onClose;

  return React.createElement(
    'div',
    null,
    open && React.createElement(
      'div',
      { className: 'fixed left-0 top-0 w-56 sm:w-60 lg:w-64 h-screen bg-slate-900 border-r border-slate-800 shadow-2xl p-2 sm:p-3 overflow-y-auto z-[1100]' },
      React.createElement(
        'button',
        {
          className: 'absolute right-2 top-2 bg-slate-800 text-cyan-400 rounded w-6 h-6 flex items-center justify-center hover:bg-slate-700 border border-slate-700',
          onClick: onClose
        },
        '×'
      ),
      React.createElement(
        'div',
        { className: 'mt-8' },
        React.createElement(
          'h4',
          { className: 'text-base font-bold mb-3 text-cyan-400 uppercase tracking-wider' },
          '⚠ Troubleshoot'
        ),
        React.createElement('p', { className: 'text-slate-300 text-xs mb-1' }, 'Failed to run Brazil:'),
        React.createElement(
          'code',
          { className: 'block bg-slate-950 border border-slate-800 rounded p-1.5 my-1.5 text-cyan-400 text-[10px]' },
          'toolbox install brazilcli'
        ),
        React.createElement('p', { className: 'text-slate-300 text-xs mb-1 mt-3' }, 'Brazil fails after install:'),
        React.createElement('p', { className: 'text-slate-400 text-[10px] mb-1' }, 'Replace xxxxx with 40000-60000'),
        React.createElement(
          'code',
          { className: 'block bg-slate-950 border border-slate-800 rounded p-1.5 my-1.5 text-cyan-400 text-[10px]' },
          'brazil prefs --key packagecache.port --value xxxxx --global'
        ),
        React.createElement('p', { className: 'text-slate-300 text-xs mb-1 mt-3' }, 'Java runtime error:'),
        React.createElement(
          'code',
          { className: 'block bg-slate-950 border border-slate-800 rounded p-1.5 my-1.5 text-cyan-400 text-[10px]' },
          'who -u\nsudo kill <PID>'
        ),
        React.createElement('p', { className: 'text-slate-300 text-xs mb-1 mt-3' }, 'Drop a CR:'),
        React.createElement(
          'code',
          { className: 'block bg-slate-950 border border-slate-800 rounded p-1.5 my-1.5 text-cyan-400 text-[10px]' },
          'git rebase -i <CR hash>'
        ),
        React.createElement('p', { className: 'text-slate-400 text-[10px] mb-1' }, 'Replace "pick" with "drop", then :wq')
      )
    )
  );
}

module.exports = TroubleshootPanel;