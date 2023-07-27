import bcrypt from "bcrypt";
import {GeneratePasswordOptionsType} from "./password.types";

const saltRounds = 10;

export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
}

const password_key_strings = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    symbol: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
};

export function generatePassword(
    options: GeneratePasswordOptionsType
): string {
    const { length = 8, lowercase = true, uppercase = true, symbols = true, numbers = true } = options
    let passwordCharSet = "";

    if (lowercase) {
        passwordCharSet += password_key_strings.lowercase;
    }

    if (uppercase) {
        passwordCharSet += password_key_strings.uppercase;
    }

    if (symbols) {
        passwordCharSet += password_key_strings.symbol;
    }

    if (numbers) {
        passwordCharSet += password_key_strings.number;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        password += passwordCharSet[Math.floor(Math.random() * passwordCharSet.length)]
    }

    return password;
}
