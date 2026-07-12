/**
 * Apps Script sample endpoints for front-end integration.
 * - Deploy this script as a Web App (Execute as: Me, Who has access: Anyone)
 * - The front-end will POST { action: 'login', id_token: '...' } to verify Google ID token
 */

function doPost(e){
  try{
    var body = {};
    if(e.postData && e.postData.contents){
      body = JSON.parse(e.postData.contents);
    }
    var action = (e.parameter && e.parameter.action) || body.action;
    if(!action) return jsonResponse({ success:false, message: 'No action specified' });

    switch(action){
      case 'login':
        return handleLogin(body);
      case 'dashboard':
        return handleDashboard();
      default:
        return jsonResponse({ success:false, message: 'Unknown action: ' + action });
    }
  }catch(err){
    return jsonResponse({ success:false, message: err.message });
  }
}

function doGet(e){
  var action = e.parameter && e.parameter.action;
  if(!action) return jsonResponse({ success:false, message: 'No action specified' });
  switch(action){
    case 'dashboard':
      return handleDashboard();
    default:
      return jsonResponse({ success:false, message: 'Unknown action: ' + action });
  }
}

function handleLogin(body){
  var id_token = body && body.id_token;
  if(!id_token) return jsonResponse({ success:false, message: 'Missing id_token' });

  var url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(id_token);
  try{
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var info = JSON.parse(res.getContentText());
    if(info.error_description || info.error){
      return jsonResponse({ success:false, message: 'Invalid token' });
    }
    // Example: derive role by email domain (customize as needed)
    var role = 'Santri';
    if(info.email && info.email.match(/@yourdomain\.org$/)) role = 'Admin';
    if(info.email && info.email === 'admin@example.com') role = 'Super Admin';

    var user = {
      name: info.name || '',
      email: info.email || '',
      picture: info.picture || '',
      sub: info.sub || '',
      role: role
    };
    return jsonResponse({ success:true, user: user });
  }catch(err){
    return jsonResponse({ success:false, message: 'Token verification failed' });
  }
}

function handleDashboard(){
  // Return dummy stats for scaffold
  var data = {
    santri: 120,
    guru: 12,
    alumni: 45,
    donasi: 15000000
  };
  return jsonResponse({ success:true, data: data });
}

function jsonResponse(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
