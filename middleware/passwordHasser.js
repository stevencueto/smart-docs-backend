const bcrypt = require('bcrypt');

const hashedPassword = (password) => {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        password = hash
    });
  });
  console.log(password)
  return password
}

const comparePassword = (typedPass, hashPass) => { //takes 2 params, the typed password and the hashed one or salted idk
  try{
    console.log(hashPass, 'password from pass')
    const okPass = bcrypt.compareSync(typedPass, hashPass) //we'll check if they are the same if they are the same then well return true
    return okPass //return
  }catch(err){
    console.log(err)
    return false //return false if error
  }
}
module.exports = {
    hashedPassword,
    comparePassword,
};