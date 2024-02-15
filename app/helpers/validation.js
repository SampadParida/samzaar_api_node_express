import Jwt from 'jsonwebtoken';


const mandatoryTokenValidation = async (req, res, next) => {
    const token = req?.headers?.authorization?.split(' ')[1];
    if(!token){
        return res.status(400).json({"Message" : "Missing Token!"});
    } else {
        const verifiedToken = Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        if(!verifiedToken){
            return res.status(400).json({"Message" : "Invalid Token!"});
        }
        req.user_id = verifiedToken.user_id;
        next();
    }
}

export {
    mandatoryTokenValidation
}