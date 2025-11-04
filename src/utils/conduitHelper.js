function createConduitUrl(destinationUrl, sessionDuration) {
  if (!sessionDuration) sessionDuration = 36000;
  var accountId = process.env.REACT_APP_AWS_ACCOUNT_ID;
  var encoded = encodeURIComponent(destinationUrl);
  return 'https://iad.merlon.amazon.dev/console?redirectMerlon=conduit&awsAccountId=' + accountId + '&awsPartition=aws&destination=' + encoded + '&policy=arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FAdministratorAccess&redirect=true&sessionDuration=' + sessionDuration;
}

function saveSession(sessionDuration) {
  if (!sessionDuration) sessionDuration = 36000;
  var expiresAt = Date.now() + (sessionDuration * 1000);
  document.cookie = 'ssm_session=' + expiresAt + '; path=/; max-age=' + sessionDuration;
}

function checkSession() {
  var name = 'ssm_session=';
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(name) === 0) {
      var expiresAt = parseInt(cookie.substring(name.length));
      if (Date.now() < expiresAt) {
        return true;
      }
    }
  }
  return false;
}

module.exports = {
  createConduitUrl: createConduitUrl,
  saveSession: saveSession,
  checkSession: checkSession
};
