var React = require('react');
var LaunchButton = require('./LaunchButton');

var stationMap = LaunchButton.stationMap;

function LaunchWidget() {
  var isOpenState = React.useState(true);
  var isOpen = isOpenState[0];
  var setIsOpen = isOpenState[1];

  var activePageState = React.useState(0);
  var activePage = activePageState[0];
  var setActivePage = activePageState[1];

  var positionState = React.useState(function() {
    try {
      var saved = localStorage.getItem('launch_widget_position');
      return saved ? JSON.parse(saved) : { x: 100, y: 100 };
    } catch (e) {
      return { x: 100, y: 100 };
    }
  });
  var position = positionState[0];
  var setPosition = positionState[1];

  var isDraggingState = React.useState(false);
  var isDragging = isDraggingState[0];
  var setIsDragging = isDraggingState[1];

  var dragOffsetState = React.useState({ x: 0, y: 0 });
  var dragOffset = dragOffsetState[0];
  var setDragOffset = dragOffsetState[1];

  function handleMouseDown(e) {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }

  React.useEffect(function() {
    function handleMouseMove(e) {
      if (isDragging) {
        var newX = e.clientX - dragOffset.x;
        var newY = e.clientY - dragOffset.y;
        var maxX = window.innerWidth - 300;
        var maxY = window.innerHeight - 400;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        setPosition({ x: newX, y: newY });
      }
    }

    function handleMouseUp() {
      setIsDragging(false);
      localStorage.setItem('launch_widget_position', JSON.stringify(position));
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return function() {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position]);

  var page1Nodes = ['0305', '0306', '0307', '0308'];
  var page2Nodes = ['0302', '0303'];
  var page3Nodes = ['0205', '0206', '0207', '0208'];

  if (!isOpen) {
    return React.createElement(
      'button',
      {
        onClick: function() { setIsOpen(true); },
        className: 'fixed left-14 bottom-2 sm:left-14 sm:bottom-2.5 z-[1300] bg-gradient-to-br from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 border-2 border-cyan-400 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70 transition-all text-lg font-bold',
        title: 'Open Launch Widget'
      },
      '💻'
    );
  }

  return React.createElement(
    'div',
    {
      className: 'fixed z-[1400] bg-slate-900 border-2 border-cyan-500 rounded-lg shadow-2xl select-none',
      style: {
        left: position.x + 'px',
        top: position.y + 'px',
        width: '300px',
        cursor: isDragging ? 'grabbing' : 'default'
      }
    },
    React.createElement(
      'div',
      {
        className: 'bg-slate-800 px-4 py-2 rounded-t-lg flex items-center justify-between cursor-grab active:cursor-grabbing select-none',
        onMouseDown: handleMouseDown,
        style: { userSelect: 'none' }
      },
      React.createElement('div', { className: 'text-cyan-400 font-semibold text-sm' }, '🚀 Quick Launch Panel'),
      React.createElement(
        'button',
        {
          onClick: function() { setIsOpen(false); },
          className: 'text-cyan-400 hover:text-cyan-300 font-bold text-lg',
          title: 'Close'
        },
        '×'
      )
    ),
    React.createElement(
      'div',
      { className: 'p-4 h-32 overflow-y-auto' },
      activePage === 0 && React.createElement(
        'div',
        { className: 'grid grid-cols-2 gap-2' },
        page1Nodes.map(function(nodeId) {
          return React.createElement(LaunchButton, { key: nodeId, workcellId: nodeId });
        })
      ),
      activePage === 1 && React.createElement(
        'div',
        { className: 'grid grid-cols-2 gap-2' },
        page2Nodes.map(function(nodeId) {
          return React.createElement(LaunchButton, { key: nodeId, workcellId: nodeId });
        })
      ),
      activePage === 2 && React.createElement(
        'div',
        { className: 'grid grid-cols-2 gap-2' },
        page3Nodes.map(function(nodeId) {
          return React.createElement(LaunchButton, { key: nodeId, workcellId: nodeId });
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'flex items-center justify-between px-4 py-2 border-t border-slate-700 bg-slate-800 rounded-b-lg' },
      React.createElement(
        'button',
        {
          onClick: function() { setActivePage(activePage === 0 ? 2 : activePage - 1); },
          className: 'text-cyan-400 hover:text-cyan-300 font-bold text-xl'
        },
        '←'
      ),
      React.createElement(
        'div',
        { className: 'text-cyan-400 font-semibold text-sm' },
        activePage === 0 ? 'Beta 1:3 (1/3)' : activePage === 1 ? 'Beta 1:1 (2/3)' : 'Alpha 2 (3/3)'
      ),
      React.createElement(
        'button',
        {
          onClick: function() { setActivePage(activePage === 2 ? 0 : activePage + 1); },
          className: 'text-cyan-400 hover:text-cyan-300 font-bold text-xl'
        },
        '→'
      )
    )
  );
}

module.exports = LaunchWidget;
