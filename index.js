import express from 'express'
import bodyParser from 'body-parser'
import request from 'request-promise'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const club_id = process.env.CLUB_ID

app.get('/authed', async(req, res) => {
  const code = req.query.code
  const response = await request.post(
    {
      url: `https://www.strava.com/oauth/token?client_id=${
        client_id
      }&client_secret=${
        client_secret
      }&code=${
        code
      }&grant_type=authorization_code`
    }
  );

  const token = JSON.parse(response).access_token

  request(
    {
      url: `https://www.strava.com/api/v3/clubs/${club_id}/activities`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    },
    (error, response, body) => {
      const activity = JSON.parse(body);
      res.send(activity)
  });
})

app.get('/', (req, res) => {
  res.redirect(`https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=http://localhost:3000/authed&approval_prompt=force&scope=read`)
})

app.listen(3000)
