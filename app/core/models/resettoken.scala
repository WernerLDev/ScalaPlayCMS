package core.models

import play.api.Play
import play.api._
import play.api.mvc._
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import javax.inject.Singleton
import javax.inject._
import play.api.Play.current
import java.sql.Timestamp
import slick.profile.SqlProfile.ColumnOption.SqlType
import scala.concurrent._
import java.util.Date;
import core.models.{User, UserTableDef}

case class ResetToken(id : Long , user_id : Long, resettoken : String, expires_at:Timestamp )

class ResetTokenTableDef(tag: Tag) extends Table[ResetToken](tag, "resettokens") {

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def user_id = column[Long]("user_id")
  def resettoken = column[String]("resettoken")
  def expires_at = column[Timestamp]("expires_at", SqlType("timestamp not null default CURRENT_TIMESTAMP"))
  def user = foreignKey("User",user_id, users)(_.id)

  override def * =
    (id, user_id, resettoken, expires_at) <>(ResetToken.tupled, ResetToken.unapply)
  
  val users = TableQuery[UserTableDef]
}

@Singleton
class ResetTokens @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends HasDatabaseConfigProvider[JdbcProfile] {

    val users = TableQuery[UserTableDef]
    val resettokens = TableQuery[ResetTokenTableDef]
    val insertQuery = resettokens returning resettokens.map(_.id) into ((resettoken, id) => resettoken.copy(id = id))

    def getByToken(resettoken:String):Future[Option[(ResetToken, User)]] = dbConfig.db.run {
      val currDate = new Timestamp((new Date).getTime())
      resettokens.join(users).on(_.user_id === _.id)
                 .filter(x => x._1.resettoken === resettoken && x._1.expires_at >= currDate).result.headOption
    }

    def create(resettoken:ResetToken) = dbConfig.db.run {
        insertQuery += resettoken
    }

    def deleteByToken(token:String) = dbConfig.db.run {
        resettokens.filter(_.resettoken === token).delete
    }
}