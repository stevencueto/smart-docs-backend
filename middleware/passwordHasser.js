const bcrypt = require('bcrypt');

const hashedPassword = (password) => {
  const salt = bcrypt.genSaltSync(); //to generate the salt
  const passWithSalt = bcrypt.hashSync(password, salt) //to salt the passport
  return passWithSalt //return that password
}

const comparePassword = (typedPass, hashPass) => { //takes 2 params, the typed password and the hashed one or salted idk
  try{
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