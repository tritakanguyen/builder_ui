var SERVER_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function createKey(data, station, testTitle) {
  return fetch(SERVER_URL + '/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: data, station: station, testTitle: testTitle })
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    return result.key;
  })
  .catch(function(error) {
    console.error('Error creating key:', error);
    return null;
  });
}

function ping() {
  return fetch(SERVER_URL + '/ping')
    .catch(function() {});
}

module.exports = {
  createKey: createKey,
  ping: ping
};
