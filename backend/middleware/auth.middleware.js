const jwt = require ("jsonwebtoken");
const UserModel = require ("../models/user.model")// j'ai enlevé le require

module.exports.checkUser = ( req, res, next) => {

    const token = req.cookies.jwt// dans mon req.cookies
    //pour lire les cookies il faut e cookie parser
    if(token) {
        jwt.verify(token,process.env.TOKEN_SECRET, async(err, decodedToken) => {//decodedtoken = docs //on passe notre clé et notre geante clé dans env
        //pour decoder l id avec la cle de env
        if(err) {
         res.locals.user = null;//locals  sont provisoires dans les requetes
         res.cookie('jwt','',{maxAge: 1}); // on enleve le cookie
         next();

        } else {
            console.log('decoded token' + decodedToken.id)
            let user = await UserModel.findById(decodedToken.id);//voir ave JIIIIMMMM
            res.locals.user = user;
            console.log(res.locals.user)
            next();
        }
    })
} else {
    res.locals.user = null;//si il y a pas de token reslocaluser
    next();
}
}//locals sont des parametres qu'on a provisoirement 


module.exports.requireAuth = (req,res, next) => {//s'autentifier au tout début dans l'application(controler si token corrspond a quelqu'un qui est déjà dans la base de données)
    const token = req.cookies.jwt;// on recuper le token
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {// si pas erreur un decodedtoken sort
            if (err) {
                console.log(err)
            }else {
                console.log(decodedToken.id)
                next()
            }
        });
    } else {
        console.log('No token')
    }
}//