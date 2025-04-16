const pool = require("../db");
const nodemailer=require('nodemailer')



function isBetweenStartAndEnd(start_day, end_day) {
    const currentTime = new Date();
    const startDate = new Date(start_day);
    const endDate = new Date(end_day);
    return currentTime >= startDate && currentTime <= endDate;
  }
  function sendEmail(email, password) {
    // E-posta gönderme işlemleri için nodemailer yapılandırmasını yapın
    const transporter = nodemailer.createTransport({
      // E-posta sağlayıcınızın SMTP bilgilerini burada yapılandırın
      // Örneğin, Gmail kullanıyorsanız:
      service: 'Gmail',
      auth: {
        user: 'uzdub.group@gmail.com',
        pass: 'uzdub123!@#',
      },
    });
  
    // E-posta gövdesini ve diğer ayarları yapılandırın
    const mailOptions = {
      from: 'uzdub.group@gmail.com',
      to: email,
      subject: 'Parolanızı alın',
      text: `sizning parolingiz: ${password}`,
    };
  
    // E-postayı gönderin
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('E-posta gönderilirken bir hata oluştu:', error);
      } else {
        console.log('E-posta başarıyla gönderildi:', info.response);
      }
    });
  }

async function getUserByTokenFromHeader(req) {
    try {
      const bearerToken = req.headers.authorization;
      if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
       return false
      }
  
      const token = bearerToken.split(' ')[1];
      
      const query = {
        text: 'SELECT * FROM users WHERE token = $1',
        values: [token],
      };
      const result = await pool.query(query);
      const user = result.rows[0];// Foydalanuvchi ma'lumotlarini olish
      if (!user) {
        return false
      }else{
        return user;
      }
    } catch (error) {
      return false
    }
  }
  module.exports={getUserByTokenFromHeader,isBetweenStartAndEnd,sendEmail}
