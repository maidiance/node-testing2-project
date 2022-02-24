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

const validateFlavor = async(req, res, next) => {
    const name = req.body.name;
    if(!name || name == null || typeof(name) != 'string'){
        res.status(400).json({message: 'name is required'});
    } else {
        next();
    }
};

module.exports = {
    checkId,
    validateFlavor,
};