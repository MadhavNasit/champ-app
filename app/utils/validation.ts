//*
//** Functions for validate input on sign in screen
//*

// Validate Email
const validateEmail = (email) => {
  var regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.([a-zA-Z]{2,5}|[a-zA-z]{2,5}\.[a-zA-Z]{2,5})$/;
  if (email.length == 0) {
    return "Please Enter Email";
  }
  else if (!regEmail.test(email)) {
    return "Please Enter Valid Email";
  }
  else {
    return "";
  }

}

// Validate Password
const validatePassword = (password) => {
  var regAlphaNumeric = /\w+/;
  var regspecialCharacter = /[*@!#%&()^~{}]+/;
  let passwordError = [];
  if (password.length == 0) {
    passwordError.push("! Please Enter Password");
  }
  if (password.length <= 7) {
    passwordError.push("! 8+ characters long");
  }
  if (!regspecialCharacter.test(password)) {
    passwordError.push('! atleast one special character');
  }
  if (!regAlphaNumeric.test(password)) {
    passwordError.push('! atleast one alpha numeric character');
  }
  return passwordError;
}

export { validateEmail, validatePassword };