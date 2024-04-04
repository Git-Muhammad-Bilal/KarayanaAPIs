let bcrypt = require('bcryptjs')


exports.getHashedPassword= async (password)=>{
    const salt = await bcrypt.genSalt(13)
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword   
}

