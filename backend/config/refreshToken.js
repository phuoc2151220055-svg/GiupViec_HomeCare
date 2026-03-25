const jwt = require('jsonwebtoken')

const genarateRefreshToken = (id)=>{
    return jwt.sign({id},"SECRET",{expiresIn:"3d"}) // tạo ra chuỗi token hết hạn trong 3 ngày
}

module.exports ={genarateRefreshToken}