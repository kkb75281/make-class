type WhatType = 'url' | 'email' | 'phone' | 'password_confirm' | 'only_KOR' | 'only_ENG' | 'has_SPC';

class Validation {
    target: string[];
    what: WhatType;

    constructor(target: string[], what: 'url' | 'email' | 'phone' | 'password_confirm' | 'only_KOR' | 'only_ENG' | 'has_SPC') {
        if (!Array.isArray(target)) {
            throw new Error("Target must be an array.");
        }
        
        if (what === 'password_confirm' && (!Array.isArray(target) || target.length !== 2)) {
            throw new Error("For 'password_confirm', target must be an array with exactly two strings.");
        }

        this.target = target;
        this.what = what;
    }
    
    isValid() {
        let results = this.target.map(item => {
            let validation = this.validate(item);
            if (!validation.isValid) {
                console.log(`Validation failed for "${item}": ${validation.reason}`);
            }
            return validation.isValid;
        });
    
        return results.every(result => result);
    }

    validate(item: string) {
        switch (this.what) {
            case 'url':
                return this.checkUrl(item);
            case 'email':
                return this.checkEmail(item);
            case 'phone':
                return this.checkPhone(item);
            case 'password_confirm':
                return this.checkPassword();
            case 'only_KOR':
                return this.checkKorean(item);
            case 'only_ENG':
                return this.checkEnglish(item);
            case 'has_SPC':
                return this.checkHasSpecialChars(item);
          default:
            return {isValid: false, reason: 'Unknown validation type'};
        }
    }

    checkUrl(item: string) {
        let urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        let isValid = urlPattern.test(item);

        return {isValid, reason: isValid ? '' : 'Invalid url format'};
    }

    checkEmail(item: string) {
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = emailRegex.test(item);

        return {isValid, reason: isValid ? '' : 'Invalid email format'};
    }

    checkPhone(item: string) {
        let phoneRegex = /^\d{10,11}$/;
        let isValid = phoneRegex.test(item);

        return {isValid, reason: isValid ? '' : 'Invalid phone number'};
    }

    checkPassword() {
        let password1 = this.target[0];
        let password2 = this.target[1];
        let isValid;

        password1 === password2 ? isValid = true : isValid = false;

        return {isValid, reason: isValid ? '' : 'Passwords do not match'};
    }

    checkKorean(item: string) {
        let koreanRegex = /^[가-힣]*$/;
        let isValid = koreanRegex.test(item);

        return {isValid, value: item, reason: isValid ? '' : 'Text must contain only Korean characters'};
    }

    checkEnglish(item: string) {
        let englishRegex = /^[a-zA-Z]*$/;
        let isValid = englishRegex.test(item);
        
        return {isValid, value: item, reason: isValid ? '' : 'Text must contain only English characters'};
    }

    checkHasSpecialChars(item: string) {
        let hasSpecialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        let isValid = hasSpecialCharsRegex.test(item);

        return {isValid, value: item, reason: isValid ? '' : 'Text must not contain special characters'};
    }
}

let valid = new Validation(['dodo', 'dodo'], 'password_confirm');

console.log(valid.isValid());