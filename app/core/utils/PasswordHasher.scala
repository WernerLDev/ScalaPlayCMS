package core.utils

import org.mindrot.jbcrypt.BCrypt

object PasswordHasher {

    def hashPassword(password:String) = {
        BCrypt.hashpw(password, BCrypt.gensalt(10))
    }

    def checkPassword(password:String, hash:String) = {
        BCrypt.checkpw(password, hash)
    }
}