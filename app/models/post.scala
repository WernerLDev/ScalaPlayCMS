package models

import play.api.Play
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
import models._


case class Post (id:Long, title:String, content:String, posted_at:Timestamp, category_id:Long)

class PostTableDef(tag:Tag) extends Table[Post](tag, "Posts") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def title = column[String]("title")
  def content = column[String]("content")
  def posted_at = column[Timestamp]("posted_at")
  def category_id = column[Long]("category_id")

  override def * = (id, title, content, posted_at, category_id) <>(Post.tupled, Post.unapply)
}


@Singleton
class Posts @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends HasDatabaseConfigProvider[JdbcProfile] {

  val posts = TableQuery[PostTableDef]
  val categories = TableQuery[CategoryTableDef] 
  val insertQuery = posts returning posts.map(_.id) into ((post, id) => post.copy(id = id))

  def insert(post:Post) = dbConfig.db.run(insertQuery += post)
    
  def update(post:Post) = dbConfig.db.run {
    posts.filter(_.id === post.id).update(post)
  }

  def delete(id:Long) = dbConfig.db.run {
    posts.filter(_.id === id).delete
  }

  def getById(id:Long) = dbConfig.db.run {
    posts.join(categories).on(_.category_id === _.id).filter(_._1.id === id).result.headOption
  }

  def getAll = dbConfig.db.run {
    posts.join(categories).on(_.category_id === _.id).result
  }

}
