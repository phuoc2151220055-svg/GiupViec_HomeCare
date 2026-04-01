const jwt = require('jsonwebtoken')

const genarateToken = (id)=>{
    return jwt.sign({id},"SECRET",{expiresIn:"1d"})// tạo ra chuỗi token hết hạn trong 1 ngày
}

module.exports ={genarateToken}