var React = require('react');

function MainForm(props) {
  var testDate = props.testDate;
  var setTestDate = props.setTestDate;
  var testTitle = props.testTitle;
  var setTestTitle = props.setTestTitle;
  var workspaceTitle = props.workspaceTitle;
  var workcellId = props.workcellId;
  var setWorkcellId = props.setWorkcellId;
  var eventId = props.eventId;
  var setEventId = props.setEventId;
  var sections = props.sections;
  var setSections = props.setSections;
  var imageTag = props.imageTag;
  var setImageTag = props.setImageTag;
  var imageTagValue = props.imageTagValue;
  var setImageTagValue = props.setImageTagValue;
  var imageTagInputs = props.imageTagInputs || [];
  var setImageTagInputs = props.setImageTagInputs;

  function addImageTagInput() {
    setImageTagInputs(imageTagInputs.concat(['']));
  }

  function removeImageTagInput(idx) {
    setImageTagInputs(imageTagInputs.filter(function(_, i) { return i !== idx; }));
  }

  function handleImageTagInputChange(idx, value) {
    var newInputs = imageTagInputs.map(function(input, i) {
      return i === idx ? value : input;
    });
    setImageTagInputs(newInputs);
  }
  var cherryPick = props.cherryPick;
  var setCherryPick = props.setCherryPick;
  var vsConfigPick = props.vsConfigPick;
  var setVsConfigPick = props.setVsConfigPick;
  var vsConfigPickValue = props.vsConfigPickValue;
  var setVsConfigPickValue = props.setVsConfigPickValue;
  var deployArtifactsPick = props.deployArtifactsPick;
  var setDeployArtifactsPick = props.setDeployArtifactsPick;
  var deployArtifactsPickValue = props.deployArtifactsPickValue;
  var setDeployArtifactsPickValue = props.setDeployArtifactsPickValue;
  var dynamicInputs = props.dynamicInputs;
  var setDynamicInputs = props.setDynamicInputs;

  function addDynamicInput() {
    setDynamicInputs(dynamicInputs.concat([{ packageName: '', gitCommand: '' }]));
  }

  function removeDynamicInput(idx) {
    setDynamicInputs(dynamicInputs.filter(function(_, i) { return i !== idx; }));
  }

  function handleDynamicInputChange(idx, field, value) {
    var newInputs = dynamicInputs.map(function(input, i) {
      if (i !== idx) return input;
      var updated = {};
      for (var k in input) {
        updated[k] = input[k];
      }
      updated[field] = value;
      return updated;
    });
    setDynamicInputs(newInputs);
  }

  var workcellOptions = [
    { value: '0205', label: 'α 2 1:3 0205' },
    { value: '0206', label: 'α 2 1:3 0206' },
    { value: '0207', label: 'α 2 1:3 0207' },
    { value: '0208', label: 'α 2 1:3 0208' },
    { value: '0302', label: 'β   1:1 0302' },
    { value: '0303', label: 'β   1:1 0303' },
    { value: '0305', label: 'β   1:3 0305' },
    { value: '0306', label: 'β   1:3 0306' },
    { value: '0307', label: 'β   1:3 0307' },
    { value: '0308', label: 'β   1:3 0308' }
  ];

  return React.createElement(
    'form',
    { className: 'space-y-2 sm:space-y-3' },
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'label',
        { htmlFor: 'testTitle', className: 'font-semibold mb-1 block text-cyan-400 text-xs uppercase tracking-wide' },
        'Alias'
      ),
      React.createElement('input', {
        type: 'text',
        id: 'testTitle',
        className: 'input-field',
        placeholder: 'Alias or test title',
        value: testTitle,
        onChange: function(e) { setTestTitle(e.target.value); }
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'label',
        { htmlFor: 'workcellId', className: 'font-semibold mb-1 block text-cyan-400 text-xs uppercase tracking-wide' },
        'Workcell ID'
      ),
      React.createElement(
        'select',
        {
          id: 'workcellId',
          className: 'input-field',
          value: workcellId,
          onChange: function(e) { setWorkcellId(e.target.value); }
        },
        React.createElement('option', { value: '' }, 'Select Workcell ID'),
        workcellOptions.map(function(option) {
          return React.createElement('option', { key: option.value, value: option.value }, option.label);
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'label',
        { htmlFor: 'testDate', className: 'font-semibold mb-1 block text-cyan-400 text-xs uppercase tracking-wide' },
        'Date Event ID use:'
      ),
      React.createElement('input', {
        type: 'date',
        id: 'testDate',
        className: 'input-field',
        value: testDate,
        onChange: function(e) { setTestDate(e.target.value); },
        onClick: function(e) { e.target.showPicker(); }
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'label',
        { htmlFor: 'workspaceTitle', className: 'font-semibold mb-1 block text-cyan-400 text-xs uppercase tracking-wide' },
        'Workflow Title'
      ),
      React.createElement('input', {
        type: 'text',
        id: 'workspaceTitle',
        className: 'input-field bg-slate-950 cursor-not-allowed',
        placeholder: 'Workspace/Workflow title',
        value: workspaceTitle,
        readOnly: true
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'label',
        { htmlFor: 'eventId', className: 'font-semibold mb-1 block text-cyan-400 text-xs uppercase tracking-wide' },
        'Event ID ',
        React.createElement(
          'a',
          {
            className: 'text-cyan-500 font-normal text-xs hover:text-cyan-400 ml-2 border border-cyan-500 px-2 py-0.5 rounded hover:border-cyan-400 transition-colors',
            href: 'https://amazon.enterprise.slack.com/archives/C04Q35G995K',
            target: 'tracking'
          },
          'Build Tracking'
        ),
        React.createElement(
          'span',
          { className: 'text-slate-400 font-normal text-xs ml-2' },
          '<- Click this button to get Event ID'
        )
      ),
      React.createElement('input', {
        type: 'text',
        id: 'eventId',
        className: 'input-field',
        value: eventId,
        onChange: function(e) { setEventId(e.target.value); },
        placeholder: 'Event ID'
      })
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'label',
        { htmlFor: 'sections', className: 'font-semibold mb-1 block text-cyan-400 text-xs uppercase tracking-wide' },
        'Type'
      ),
      React.createElement(
        'select',
        {
          id: 'sections',
          className: 'input-field',
          value: sections,
          onChange: function(e) { setSections(e.target.value); }
        },
        React.createElement('option', { value: '' }, 'Select Type'),
        React.createElement('option', { value: 'stow' }, 'Stow'),
        React.createElement('option', { value: 'buffer' }, 'Buffer'),
        React.createElement('option', { value: 'induct' }, 'Induct')
      )
    ),
    React.createElement(
      'div',
      { className: 'border border-slate-700 rounded-lg p-2 sm:p-3 my-2 sm:my-3 bg-slate-950/50' },
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement(
          'label',
          { className: 'flex items-center gap-2 relative group' },
          React.createElement('input', {
            type: 'checkbox',
            checked: imageTag,
            onChange: function(e) {
              setImageTag(e.target.checked);
              if (e.target.checked && imageTagInputs.length === 0) {
                setImageTagInputs(['']);
              }
            }
          }),
          React.createElement(
            'span',
            { className: 'relative tooltip-text' },
            'Image Tag',
            React.createElement(
              'span',
              { className: 'tooltip-content' },
              'Select if you have any image tag need to swap'
            )
          )
        ),
        imageTag && React.createElement(
          'div',
          { className: 'mt-2' },
          imageTagInputs.map(function(tag, idx) {
            return React.createElement(
              'div',
              { key: idx, className: 'p-2 bg-slate-900 border border-slate-700 rounded mb-2' },
              React.createElement(
                'div',
                { className: 'flex items-center gap-2 mb-1' },
                React.createElement(
                  'label',
                  { className: 'font-semibold text-cyan-400 text-xs uppercase' },
                  'Image Tag ' + (idx + 1)
                ),
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'text-red-500 hover:text-red-400 font-bold text-lg',
                    onClick: function() { removeImageTagInput(idx); }
                  },
                  '✕'
                )
              ),
              React.createElement('textarea', {
                className: 'input-field',
                value: tag,
                onChange: function(e) { handleImageTagInputChange(idx, e.target.value); },
                placeholder: 'Enter image tag'
              })
            );
          }),
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'btn-secondary text-xs mt-2 mb-2',
              onClick: addImageTagInput
            },
            '+ Add Image Tag'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'form-group flex items-center gap-2' },
        React.createElement(
          'label',
          { className: 'flex items-center gap-2 relative group' },
          React.createElement('input', {
            type: 'checkbox',
            checked: cherryPick,
            onChange: function(e) { setCherryPick(e.target.checked); }
          }),
          React.createElement(
            'span',
            { className: 'relative tooltip-text' },
            'Cherry Pick Packages',
            React.createElement(
              'span',
              { className: 'tooltip-content' },
              'Select if you have any CR cherry pick'
            )
          )
        ),
        cherryPick && React.createElement(
          'button',
          {
            type: 'button',
            className: 'btn-secondary text-xs',
            onClick: addDynamicInput
          },
          '+ Add Package'
        )
      ),
      cherryPick && React.createElement(
        'div',
        { className: 'mt-2' },
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'label',
            { className: 'flex items-center gap-2 relative group' },
            React.createElement('input', {
              type: 'checkbox',
              checked: vsConfigPick,
              onChange: function(e) { setVsConfigPick(e.target.checked); }
            }),
            React.createElement(
              'span',
              { className: 'relative tooltip-text' },
              'VulcanStowConfig',
              React.createElement(
                'span',
                { className: 'tooltip-content' },
                'Select if you have Vulcan Config package CR'
              )
            )
          ),
          vsConfigPick && React.createElement(
            'div',
            { className: 'mt-2 p-2 bg-slate-900 border border-slate-700 rounded' },
            React.createElement(
              'label',
              { className: 'block font-semibold mb-1 text-cyan-400 text-xs uppercase' },
              'Vulcan Config CR'
            ),
            React.createElement('textarea', {
              className: 'input-field',
              value: vsConfigPickValue,
              onChange: function(e) { setVsConfigPickValue(e.target.value); },
              placeholder: ''
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'label',
            { className: 'flex items-center gap-2 relative group' },
            React.createElement('input', {
              type: 'checkbox',
              checked: deployArtifactsPick,
              onChange: function(e) { setDeployArtifactsPick(e.target.checked); }
            }),
            React.createElement(
              'span',
              { className: 'relative tooltip-text' },
              'Deployment Artifacts',
              React.createElement(
                'span',
                { className: 'tooltip-content' },
                'Select if you have Deployment Artifacts package CR'
              )
            )
          ),
          deployArtifactsPick && React.createElement(
            'div',
            { className: 'mt-2 p-2 bg-slate-900 border border-slate-700 rounded' },
            React.createElement(
              'label',
              { className: 'block font-semibold mb-1 text-cyan-400 text-xs uppercase' },
              'Deploy Artifacts CR'
            ),
            React.createElement('textarea', {
              className: 'input-field',
              value: deployArtifactsPickValue,
              onChange: function(e) { setDeployArtifactsPickValue(e.target.value); },
              placeholder: ''
            })
          )
        ),
        dynamicInputs.map(function(input, idx) {
          return React.createElement(
            'div',
            { key: idx, className: 'form-group p-2 border border-slate-700 rounded mb-2 bg-slate-900' },
            React.createElement(
              'label',
              { className: 'block font-semibold mb-1 text-cyan-400 text-xs uppercase' },
              'Package Name'
            ),
            React.createElement('input', {
              type: 'text',
              className: 'input-field mb-2',
              value: input.packageName,
              onChange: function(e) { handleDynamicInputChange(idx, 'packageName', e.target.value); },
              placeholder: 'Beware case sensitive'
            }),
            React.createElement(
              'label',
              { className: 'block font-semibold mb-1 text-cyan-400 text-xs uppercase' },
              'Cherry Pick Command'
            ),
            React.createElement('textarea', {
              className: 'input-field mb-2',
              value: input.gitCommand,
              onChange: function(e) { handleDynamicInputChange(idx, 'gitCommand', e.target.value); },
              placeholder: 'Paste Cherry Pick here'
            }),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'btn-danger text-xs',
                onClick: function() { removeDynamicInput(idx); }
              },
              '✕ Remove'
            )
          );
        })
      )
    )
  );
}

module.exports = MainForm;