const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//instalação dos packages e definição de rota

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors());

require('./controller/authController')(app);

app.listen(3001);
