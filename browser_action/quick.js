// $('#loginButton').click(function(e) {
//   e.preventDefault();

//   chrome.identity.getAuthToken({ interactive: true }, function(token) {
//     if (!chrome.runtime.lastError) {
//       console.log('login succeeded');
//       var myProfileApiUrl = 'https://www.googleapis.com/plus/v1/people/me';
//     } else {
//       console.log('login failed');
//     }
//   });

//invokeAuth();
// });

// function invokeAuth() {
//   var googleAuth = new OAuth2('google', {
//     client_id:
//       '946104220756-g83q8olnduambr5h8pvvt6vnvqi9di8g.apps.googleusercontent.com',
//     client_secret: 'IA71PLwcNp4KJIYTJ1ub3o5h',
//     api_scope: 'https://www.googleapis.com/auth/userinfo.email',
//   });

//   googleAuth.authorize(function() {
//     var googleAccessToken = googleAuth.getAccessToken();
//     console.log('[Oauth2LoginService] Access token: ' + googleAccessToken);
//     if (googleAuth.hasAccessToken()) {
//       console.log('login succesful.');
//     } else {
//       console.log('login failed.');
//     }
//   });
// }

// var getGoogleAuthObj = function(personData, token) {
//   return {
//     uid: personData.id,
//     fullName: personData.displayName,
//     emailAddress: personData.emails[0].value,
//     accessToken: token,
//     accessTokenExpiry: '3600',
//     imageUrl: personData.image.url,
//   };
// };
