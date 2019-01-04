const REQUIRED_PASSWORD_LENGTH = 8;
const CREDIT_CARD_LENGTH = 16;
const CURRENT_YEAR = 18;


const getLoginErrors = (userLogin) => {
    var errors = validateEmail(userLogin.email);
    return errors;
}

const getCreditCardErrors = (card) => {
    var errors = validateCardNumber(card.number);
    errors = errors.concat(validateCardDate(card.expirationDate));
    errors = errors.concat(validateCardCVC(card.cvc));
    return errors;
}

export const getRegisterErrors = (user, callback) => {
    var errors = validateEmail(user.email);
    errors = errors.concat(validatePassword(user.password));
    errors = errors.concat(validatePasswordConfirmation(user.password, user.passwordConfirmation));

    callback(errors)
}

const validatePassword = (password) => {
    var errors = [];
    if(password.length < REQUIRED_PASSWORD_LENGTH) 
        errors.push('Password must be at least ' + REQUIRED_PASSWORD_LENGTH + ' characters')
    if(!hasLowerCase(password)) 
        errors.push('Password must contain at least 1 lowercase letter')
    if(!hasUpperCase(password))
        errors.push('Password must contain at least 1 uppercase letter')
    if(!hasNumber(password))
        errors.push('Password must contain at least 1 number')

    return errors
}

const validatePasswordConfirmation = (password, passwordConfirmation) => {
    var errors = [];
    if(password != passwordConfirmation)
        errors.push('Passwords must match')

    return errors;
}

const validateCardNumber = (cardNumber) => {
    var errors = [];
    if(cardNumber.length != CREDIT_CARD_LENGTH)
        errors.push('Invalid card number')

    return errors;
}

const validateCardDate = (expirationDate) => {
    var errors = [];
    if(!isValidYear(expirationDate.year))
        errors.push('Invalid card year')
    if(!isValidMonth(expirationDate.month)) 
        errors.push('Invalid card month')
    
    return errors;
}

const validateCardCVC = (cvc) => {
    var errors = [];
    if(cvc.length < 3 || cvc > 4)
        errors.push('Invalid card CVV')

    return errors;
}

const validateEmail = (email) => {
    var errors = [];
    const requiredSymbol = '@'
    if(isEmpty(email)) 
        errors.push('Email field cannot be empty')
    if(!email.includes(requiredSymbol))
        errors.push('Invalid email address')

    return errors;
}

const isValidYear = (year) => {
    return (year >= CURRENT_YEAR)
}

const isValidMonth = (month) => {
    return (/[1-12]/.test(month))
}

const hasNumber = (str) => {
    return (/\d/.test(str))
}

const hasLowerCase = (str) => {
    return (/[a-z]/.test(str))
}

const hasUpperCase = (str) => {
    return (/[A-Z]/.test(str))
}

const isEmpty = (str) => {
    return str.length === 0
}
