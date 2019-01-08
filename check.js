const bcrypt = require('bcrypt-nodejs');

bcrypt.hash("myPlaintextPassword", null, null, (err, hash) => {
    console.log(hash);
});