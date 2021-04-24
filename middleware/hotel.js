const jwt = require('jsonwebtoken');

const db = require('../config/db');

module.exports = {
    ensureHotel: (req, res, next) => {
        console.log(req.cookies)
        const token = req.cookies.token;
        if (!token) return res.send("Denied")
        try {
            jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
                if (err) {
                    console.log(err);
                    res.send(err)
                    return;
                }
                console.log(decoded) // bar
                let query = `SELECT * FROM hotel WHERE username='${decoded.username}' LIMIT 1`;
                db.query(query, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        res.send(error)
                        return;
                    }
                    console.log(results)
                    if (results.length==0){
                        res.send("Couldn't find hotel")
                        return;
                    }
                    if (decoded.role!=='hotel'){
                        res.send("You are not a hotel")
                        return;
                    }
                    req.hotel = results[0];
                    next() 
                });
            })
        } catch(err) {
            res.send(err)
        }
    }
}