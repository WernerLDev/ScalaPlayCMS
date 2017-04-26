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
import java.sql.Timestamp
import slick.profile.SqlProfile.ColumnOption.SqlType
import core.models._


case class Entity (id:Long, name:String)

class EntityTableDef(tag:Tag) extends Table[Entity](tag, "entities") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def name = column[String]("name")

  override def * = (id, name) <>(Entity.tupled, Entity.unapply)
}


trait TEntities extends HasDatabaseConfigProvider[JdbcProfile] {

  val entities = TableQuery[EntityTableDef]
   
  val insertQuery = entities returning entities.map(_.id) into ((entity, id) => entity.copy(id = id))

  def insert(entity:Entity) = dbConfig.db.run(insertQuery += entity)
    
  def update(entity:Entity) = dbConfig.db.run {
    entities.filter(_.id === entity.id).update(entity)
  }

  def delete(id:Long) = dbConfig.db.run {
    entities.filter(_.id === id).delete
  }

  def getById(id:Long) = dbConfig.db.run {
    entities.filter(_.id === id).result.headOption
  }

  def getAll = dbConfig.db.run {
    entities.result
  }

}
case class Blog (id:Long, name:String, title:String, content:String, created_at:Timestamp)

class BlogTableDef(tag:Tag) extends Table[Blog](tag, "blogs") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def name = column[String]("name")
  def title = column[String]("title")
  def content = column[String]("content")
  def created_at = column[Timestamp]("created_at")

  override def * = (id, name, title, content, created_at) <>(Blog.tupled, Blog.unapply)
}


trait TBlogs extends HasDatabaseConfigProvider[JdbcProfile] {

  val blogs = TableQuery[BlogTableDef]
   
  val insertQuery = blogs returning blogs.map(_.id) into ((blog, id) => blog.copy(id = id))

  def insert(blog:Blog) = dbConfig.db.run(insertQuery += blog)
    
  def update(blog:Blog) = dbConfig.db.run {
    blogs.filter(_.id === blog.id).update(blog)
  }

  def delete(id:Long) = dbConfig.db.run {
    blogs.filter(_.id === id).delete
  }

  def getById(id:Long) = dbConfig.db.run {
    blogs.filter(_.id === id).result.headOption
  }

  def getAll = dbConfig.db.run {
    blogs.result
  }

}
