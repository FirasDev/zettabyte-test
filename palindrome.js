function palindrome(word) {

    var wordLength = word.length;
    var halfLength = Math.floor(wordLength/2);
    //using Math.floor() here to round the halfLength result
    // if wordLength = 4 then halfLength = 2
    // if wordLength = 5 then halfLength = 2

    for ( var i = 0; i < halfLength; i++ ) {
        if (word[i] !== word[wordLength - 1 - i]) {
            return false;
        }
    }

    return true;
}

console.log(palindrome("azael"));