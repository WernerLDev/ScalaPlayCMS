package core.utils

import org.mindrot.jbcrypt.BCrypt

object PasswordHasher {

    def hashPassword(password:String) = {
        BCrypt.hashpw(password, BCrypt.gensalt(10))
    }

    def checkPassword(password:String, hash:String) = {
        BCrypt.checkpw(password, hash)
    }

    //Not used for passwords
    def md5Hash(text: String) : String = java.security.MessageDigest.getInstance("MD5").digest(text.getBytes()).map(0xFF & _).map { "%02x".format(_) }.foldLeft(""){_ + _}
}