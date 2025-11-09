var React = require('react');

function GenerateStepsButton(props) {
  var onClick = props.onClick;

  return React.createElement(
    'button',
    {
      type: 'button',
      className: 'btn-primary',
      title: 'Generate workflow steps',
      onClick: onClick
    },
    '▶ GENERATE STEPS'
  );
}

module.exports = GenerateStepsButton;
