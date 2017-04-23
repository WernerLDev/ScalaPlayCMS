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


case class Entity (id:Long, name:String, entityName:String)

class EntityTableDef(tag:Tag) extends Table[Entity](tag, "Entities") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def name = column[String]("name")
  def entityName = column[String]("entityName")

  override def * = (id, name, entityName) <>(Entity.tupled, Entity.unapply)
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
