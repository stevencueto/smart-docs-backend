const bcrypt = require('bcrypt');

const hashedPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash
}

const comparePassword = (password, hashPass) => { //takes 2 params, the typed password and the hashed one or salted idk
  try{
    const okPass = bcrypt.compareSync(password, hashPass) //we'll check if they are the same if they are the same then well return true
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