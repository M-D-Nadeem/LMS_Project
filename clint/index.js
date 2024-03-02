const { log } = require('console');

function f1(){
return new require('crypto').randomBytes(48, function rc(err, buffer) {
    var token = buffer.toString('hex');
   return token;
  });
}
async function f2(){
    let a=f1()
    let r=await a
    console.log(r);
}
f2()