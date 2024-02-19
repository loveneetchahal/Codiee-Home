const express = require('express'); // Express web server
const request = require('request'); // "Request" library for HTTP requests
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const path = require("path")
const fetch = require('node-fetch');
const bodyParser = require('body-parser')


// If you want to use environment variables, uncomment these lines
// var dotenv = require('dotenv');
// dotenv.config();

const client_id = 'app-client-id'; // Your app's client ID
const client_secret = 'app-client-secret'; // Your app's secret
const redirect_uri = process.env.REDIRECTURL; // The URI you will send your user to after auth
const port = process.env.PORT || 8081;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'client/build')))
  .use(cors())
  .use(cookieParser());

// Show "Start OAuth Flow" button 

// Show final app page
app.get('/api/finish', function (req, res) {
  res.sendFile('/finish.html', { root: __dirname + '/public' });
});

app.get('/api/start', function (req, res) {

  var state = 'abcde123456'; // change this to a random string in your implementation
  res.cookie('codieehome_auth_state', state);

  res.redirect('https://zoom.us/oauth/authorize?' +
    querystring.stringify({
      client_id: client_id,
      redirect_uri: redirect_uri + '/oauth/callback',
      state: state,
      scopes: "me:read boards:read"
    }));
});

app.get('/api/oauth/callback', function (req, res) {

  // upon callback, your app first checks state parameter
  // if state is valid, we make a new request for access and refresh tokens

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies['codieehome_auth_state'] : null;

  if (state === null || state !== storedState) {

    res.redirect('/finish?' +
      querystring.stringify({
        error: 'state_does_not_match'
      }));

  } else {

    res.clearCookie('codieehome_auth_state');
    var authRequest = {
      url: 'https://zoom.us/oauth/token',
      form: {
        redirect_uri: redirect_uri + "/oauth/callback",
        client_id: client_id,
        client_secret: client_secret,
        code: code,
      },
    };

    // POST auth.codieehome.com/oauth2/token
    request.post(authRequest, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonBody = JSON.parse(body);
        var accessToken = jsonBody.access_token || null;
        var refreshToken = jsonBody.refresh_token || null;
        var tokenType = jsonBody.token_type || null;
        var scope = jsonBody.scope || null;

        res.redirect("/finish?" +
          querystring.stringify({
            status: 'success',
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: tokenType,
            scope: scope,
          }));
      } else {
        res.redirect("/finish?" +
          querystring.stringify({
            status: 'failure'
          }));
      }
    });
  }
});

  
// request to get api for meetings
app.get("/api/meets", async (req,res) => {
  try {
  const bar = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6InNfeUJ0b2FyUVh1STdWaWlPeWN3TVEiLCJleHAiOjE2MTYyMjgzMDMsImlhdCI6MTYxNTYyNzEwNH0.YNGFRHjEhfpOPWdXAtGw5nw8Hpmo1pc9YJ5DyD2-wGU';
  const meetingsZoom = await fetch(`https://api.zoom.us/v2/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bar}`,
      },
    });
    const person = await meetingsZoom.json();
  
    const meet = await fetch(`https://api.zoom.us/v2/users/${person.id}/meetings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bar}`,
      },
    });
    const meetings = await meet.json();
    // console.log(meetings);
    return res.status(200).json({
      success: true,
      meetings: meetings.meetings
    });
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      meetings: []
    })
  }
  
});

app.post('/api/meetingslist', async (req, res) => {

  if(!req.body.code) {
    return res.json({
      success: false,
      message: "Code not provided"
    })
  }
  try {
    const b = Buffer.from(client_id + ":" + client_secret);
    const zoomRes = await fetch(`https://zoom.us/oauth/token?grant_type=authorization_code&code=${req.body.code}&redirect_uri=${redirect_uri}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${b.toString("base64")}`,
      },
    });
    if(!zoomRes.ok){ 
      return res.status(401).send("Could not connect with Zoom"); 
    }
    const zoomData = await zoomRes.json();
    if (zoomData.error){
      return res.status(401).send("Could not connect with Zoom");
    }
    // Retreive user details
    const zoomUserRes = await fetch("https://api.zoom.us/v2/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${zoomData.access_token}`,
      },
    });
    const zoomUserData = await zoomUserRes.json(); 
    const meetingsZoom = await fetch(`https://api.zoom.us/v2/users/${zoomUserData.id}/meetings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${zoomData.access_token}`,
      },
    });
    const meetings = await meetingsZoom.json();
    /* 
      Encrypt and store below details to your database:
        zoomUserData.email
        zoomUserData.account_id
        zoomData.access_token
        zoomData.refresh_token
        zoomData.expires_in // convert it to time by adding these seconds to current time
    */
    return res.status(200).json({
      success: true,
      meetings: meetings.meetings
    });
  } catch (e) {
    console.log(e)
    return res.status(500).send("Something went wrong");
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, "client", "build", "index.html")));
console.log(`Listening on port ${port}`)
app.listen(port);
