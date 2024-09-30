import express from 'express';
import http from 'http';
import path from 'path';
import url from 'url';
import bodyParser from 'body-parser';
import compression from 'compression';

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const toEmail = process.env.TO_EMAIL;

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;


let app = express();
let server = http.Server(app);

app.use(compression());

app.use(express.static('dist'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/contact', function(req, res) {
  const msg = {
    to: toEmail,
    from: {
      name: req.body.name,
      email: req.body.email
    },
    mail_settings: {
      sandbox_mode: {
        enable: false
      }
    },
    subject: 'Message',
    text: req.body.message
  };
  console.log(msg);
  sgMail.send(msg)
    .then(() => {
      console.log('Mail sent successfully');
      res.sendStatus(200);
    })
    .catch(error => {
      const {message, code, response} = error;
      console.error(error.toString());
      res.status(code).send(response);
    });
})

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(PORT);
