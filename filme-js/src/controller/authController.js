const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const User = require('../models/user');

const router = express.Router();

function generateToken(params = {}) {
   return jwt.sign(params, authConfig.secret, { 
        expiresIn: 86400
    });
}

router.post('/register', async (req, res) => {
    const { email } = req.body;
console.log(JSON.stringify(req.body))

    try {
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'Usuario já existente', logado: false});

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
             user,
             logado: true,
             token: generateToken({ id: user.id }),
         });
    } catch (err) {
        return res.status(400).send({ error: 'Falha no Registro', logado: false});
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({ error: 'Usuario não encontrado', logado: false});

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'senha Invalida', logado: false})   

    user.password = undefined;    

    res.send({ 
        user, 
        logado: true,
        token: generateToken({ id: user.id }),
     });    
});

module.exports = app => app.use('/auth', router);