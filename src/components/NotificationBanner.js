var React = require('react');

function NotificationBanner(props) {
  var message = props.message;
  var type = props.type || 'info';
  var onClose = props.onClose;

  if (!message) return null;

  var bgColor = type === 'success' ? 'bg-green-900/90' : type === 'error' ? 'bg-red-900/90' : type === 'warning' ? 'bg-yellow-900/90' : 'bg-cyan-900/90';
  var borderColor = type === 'success' ? 'border-green-500' : type === 'error' ? 'border-red-500' : type === 'warning' ? 'border-yellow-500' : 'border-cyan-500';
  var textColor = type === 'success' ? 'text-green-300' : type === 'error' ? 'text-red-300' : type === 'warning' ? 'text-yellow-300' : 'text-cyan-300';

  return React.createElement(
    'div',
    {
      className: 'fixed top-2 left-14 sm:top-3 sm:left-16 z-[9999] ' + bgColor + ' border ' + borderColor + ' rounded-lg shadow-2xl px-4 py-3 flex items-center gap-3 min-w-64 max-w-sm animate-slide-in-left'
    },
    React.createElement('div', { className: textColor + ' font-semibold flex-1' }, message),
    React.createElement(
      'button',
      {
        onClick: onClose,
        className: textColor + ' hover:opacity-70 font-bold text-xl',
        title: 'Close'
      },
      '×'
    )
  );
}

module.exports = NotificationBanner;
