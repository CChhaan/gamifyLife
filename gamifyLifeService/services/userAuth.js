import db from '../shared/db.js';

export default class UserAuthService {

    // 用户注册方法
    registerUser (account, password, email) {
        return db.UserAccounts.create({
            account,
            password_hash: password,
            email,
        });
    }
}