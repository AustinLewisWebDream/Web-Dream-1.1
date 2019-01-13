const isValidCardCharacter = (char) => {
    if(char === 'Backspace') {
        return true;
    }
    return ('0123456789'.indexOf(char) !== -1)
}

const isValidCardLength = (cardNumber) => {
    return (cardNumber.length < 16)
}

const isBackspaceKey = (char) => {
    if(char === 8)
        return true;
    return false;
}

const isValidCVCLength = (char) => {
    return (char.length < 3)
}

const isValidExpLength = (char) => {
    return (char.length < 4)
}

module.exports = { isValidCardCharacter, isValidCardLength, isBackspaceKey, isValidCVCLength, isValidExpLength }