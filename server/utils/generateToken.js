import jwt from 'jsonwebtoken'


export function setAuthCookie(res, payload){
    // payload : {userId,companyId, dbName, }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    })

    res.cookie('token', token, {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        samesite : process.env.NODE_ENV === "production" ? 'none' : "lax",
        maxAge : 7 * 24 * 60 *60 * 1000
    })
}