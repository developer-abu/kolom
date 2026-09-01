const crypto= require('crypto');


const captureStore = new Map();

const generateCapture = ()=>{
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let capture = "";

  for(let i = 0; i<6 ; i++){
capture+=chars[Math.floor(Math.random()*chars.length)]
  }
  return capture
}

module.exports={
    captureStore,
    generateCapture,
    crypto

}