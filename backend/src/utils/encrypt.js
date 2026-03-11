const crypto = require('crypto-js');

/**
 * Encrypts sensitive data like ID numbers using AES-256.
 */
exports.encrypt = (text) => {
    return crypto.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
};

/**
 * Decrypts sensitive data.
 */
exports.decrypt = (ciphertext) => {
    const bytes = crypto.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY);
    return bytes.toString(crypto.enc.Utf8);
};
