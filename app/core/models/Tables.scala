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

case class Blog (id:Long, name:String, title:String, content:String, created_at:Timestamp, category_id:Long) 

class BlogTableDef(tag:Tag) extends Table[Blog](tag, "blogs") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def name = column[String]("name")
  def title = column[String]("title")
  def content = column[String]("content")
  def created_at = column[Timestamp]("created_at")
  def category_id = column[Long]("category_id")

  override def * = (id, name, title, content, created_at, category_id) <>(Blog.tupled, Blog.unapply)
}


trait TBlogs extends HasDatabaseConfigProvider[JdbcProfile] {

  val blogs = TableQuery[BlogTableDef]
  val categories = TableQuery[CategoryTableDef] 
  val insertQuery = blogs returning blogs.map(_.id) into ((blog, id) => blog.copy(id = id))

  def insert(blog:Blog) = dbConfig.db.run(insertQuery += blog)
    
  def update(blog:Blog) = dbConfig.db.run {
    blogs.filter(_.id === blog.id).update(blog)
  }

  def delete(id:Long) = dbConfig.db.run {
    blogs.filter(_.id === id).delete
  }

  def getById(id:Long) = dbConfig.db.run {
    blogs.join(categories).on(_.category_id === _.id).filter(_._1.id === id).result.headOption
  }

  def getAll = dbConfig.db.run {
    blogs.join(categories).on(_.category_id === _.id).result
  }

}
case class Category (id:Long, name:String) 

class CategoryTableDef(tag:Tag) extends Table[Category](tag, "categories") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def name = column[String]("name")

  override def * = (id, name) <>(Category.tupled, Category.unapply)
}


trait TCategories extends HasDatabaseConfigProvider[JdbcProfile] {

  val categories = TableQuery[CategoryTableDef]
   
  val insertQuery = categories returning categories.map(_.id) into ((category, id) => category.copy(id = id))

  def insert(category:Category) = dbConfig.db.run(insertQuery += category)
    
  def update(category:Category) = dbConfig.db.run {
    categories.filter(_.id === category.id).update(category)
  }

  def delete(id:Long) = dbConfig.db.run {
    categories.filter(_.id === id).delete
  }

  def getById(id:Long) = dbConfig.db.run {
    categories.filter(_.id === id).result.headOption
  }

  def getAll = dbConfig.db.run {
    categories.result
  }

}
