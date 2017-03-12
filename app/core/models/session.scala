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
import java.sql.Timestamp
import java.util.Date;
import core.models.{User, UserTableDef}

case class UserSession(id: Long, session_key:String, user_id:Long, passwordhash:String, ipaddress:String, useragent:String, expiration_date:Timestamp)

class SessionTableDef(tag: Tag) extends Table[UserSession](tag, "session") {

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def session_key = column[String]("session_key")
  def user_id = column[Long]("user_id")
  def passwordhash = column[String]("passwordhash")
  def ipaddress = column[String]("ipaddress")
  def useragent = column[String]("useragent")
  def expiration_date = column[Timestamp]("expiration_date")
  def user = foreignKey("User",user_id, users)(_.id)

  override def * =
    (id, session_key, user_id, passwordhash, ipaddress, useragent, expiration_date) <>(UserSession.tupled, UserSession.unapply)
  
  val users = TableQuery[UserTableDef]
}

@Singleton
class UserSessions @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends HasDatabaseConfigProvider[JdbcProfile] {

    val sessions = TableQuery[SessionTableDef]
    val insertQuery = sessions returning sessions.map(_.id) into ((session, id) => session.copy(id = id))

    def getSession(user:User, key:String) = dbConfig.db.run {
      sessions.filter(x => x.user_id === user.id && x.session_key === key).result.headOption
    }

    def create(session:UserSession) = dbConfig.db.run {
      insertQuery += session
    }

    def cleanup(user:User, useragent:String, ip:String) = {
      val currDate = new Timestamp((new Date).getTime())
      val samesessions = sessions.filter(x => x.user_id === user.id && x.useragent === useragent && x.ipaddress === ip )
      val oldsessions = sessions.filter(x => x.user_id === user.id && x.expiration_date < currDate)
      dbConfig.db.run(samesessions.delete andThen oldsessions.delete)
    }

    def deleteByKey(key:String) = dbConfig.db.run {
      sessions.filter(_.session_key === key).delete
    }

}