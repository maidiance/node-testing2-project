const db = require('./../../data/dbConfig');

const checkId = async(req, res, next) => {
    const flavor = await db('flavors').where('id', req.params.id).first();
    if(flavor) {
        next();
    } else {
        res.status(404).json({message: `flavor id ${req.params.id} not found`});
        res.end();
    }
};

module.exports = {
    checkId,
};