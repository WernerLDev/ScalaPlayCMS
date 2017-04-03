
package core.models

import play.api.Play
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import javax.inject.Singleton
import javax.inject._
import play.api.Play.current
import slick.profile.SqlProfile.ColumnOption.SqlType
import scala.concurrent._
import scala.concurrent.duration._
import core.utils.PasswordHasher
import core.models._

case class User(id: Long, username:String, passwordhash:String, email:String)

class UserTableDef(tag: Tag) extends Table[User](tag, "users") {

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def username = column[String]("username")
  def passwordhash = column[String]("passwordhash")
  def email = column[String]("email")
  
  override def * =
    (id, username, passwordhash, email) <>(User.tupled, User.unapply)
}

@Singleton
class Users @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends HasDatabaseConfigProvider[JdbcProfile] {

    val users = TableQuery[UserTableDef]
    val insertQuery = users returning users.map(_.id) into ((user, id) => user.copy(id = id))

    def authenticate(username:String, password:String):Future[Option[User]] = {
        findByUsername(username) map (userOpt => userOpt match {
            case Some(user:User) => {
                if(PasswordHasher.checkPassword(password, user.passwordhash)) {
                    Some(user)
                } else None
            }
            case None => {
                //PasswordHasher.checkPassword("bla", "$2a$14$VVsr/CDT9Bnlmbc4S/npJuoYXF/jgviR32Cg36DtHy6pNQpb/kRfu")
                None
            }
        })
    }

    def findByUsername(username:String):Future[Option[User]] = dbConfig.db.run {
        users.filter(_.username === username).result.headOption
    }

    def findByEmail(email:String):Future[Option[User]] = dbConfig.db.run {
        users.filter(_.email === email).result.headOption
    }

    def insert(user:User) = dbConfig.db.run {
        insertQuery += User(0, user.username, PasswordHasher.hashPassword(user.passwordhash), user.email)
    }

    def getById(id:Long) = dbConfig.db.run {
        users.filter(_.id === id).result.headOption
    }

    def delete(id:Long) = dbConfig.db.run {
        users.filter(_.id === id).delete
    }

    def update(user:User) = dbConfig.db.run {
        users.filter(_.id === user.id).update(user).map(x => user)
    }
}