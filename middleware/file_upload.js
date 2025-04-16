const fs =require('fs')
const { exec } = require('child_process');
const client = require('../db')
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  


var  upload_file=(req)=>{
  var send_image_link=""
  if(req.files && req.files.image){
    var file=req.files.image
    var name_file=Date.now()+getRandomInt(12312321)
    var file_tit=file.name.slice(file.name.lastIndexOf('.'))
    file.mv(`${__dirname}/../uploads/${name_file+"local_image"+file_tit}`)
    // send_image_link="https://mysklad-back.onrender.com/"+name_file+"local_image"+file_tit
    send_image_link=req.protocol+"://"+req.hostname+"/"+name_file+"local_image"+file_tit

    
    }else{
if(req.body.image){
 send_image_link=req.body.image 
}else{
send_image_link="no"
}
     
    
    }
  return send_image_link
  }

var delete_file=(file_name)=>{ 
var file_tit=file_name.slice(file_name.lastIndexOf('/')+1)
console.log(file_name,file_tit);
if(file_tit.includes("local_image")){
 fs.unlink(`${__dirname}/../uploads/${file_tit}`,()=>{})   
}
}

async function updateEnvUrl(newUrl) {
  try {
      // .env faylini yangilash
      const envFilePath = '.env';
      let envFileContent = fs.readFileSync(envFilePath, 'utf8');

      // URL ni yangilash
      const newEnvFileContent = envFileContent.replace(/^(CODE_BASE=).*/m, `$1'${newUrl}'`);

      // Yangilangan .env faylini saqlash
      fs.writeFileSync(envFilePath, newEnvFileContent, 'utf8');
      console.log('URL muvaffaqiyatli yangilandi:', newUrl);
  
  } catch (err) {
    console.error('Xatolik:', err);
  } 
}

var put_file=(file_name,req)=>{
  var file_tit=file_name.slice(file_name.lastIndexOf('/'))
if(file_tit.includes("local_image")){
 fs.unlink(`${__dirname}/../uploads/${file_tit}`,()=>{}) }
  var send_image_link=""
  if(req.files && req.files.image){
    var file=req.files.image
    var name_file=Date.now()+getRandomInt(12312321)
    var file_tit=file.name.slice(file.name.lastIndexOf('.'))
    file.mv(`${__dirname}/../uploads/${name_file+"local_image"+file_tit}`)
    send_image_link=req.protocol+"://"+req.hostname+"/"+name_file+"local_image"+file_tit
    // send_image_link=req.protocol+"://"+req.hostname+"/"+name_file+"local_image"+file_tit
    }else{
     send_image_link=req.body.image
    }
  return send_image_link

}


module.exports={upload_file,delete_file,put_file,updateEnvUrl}