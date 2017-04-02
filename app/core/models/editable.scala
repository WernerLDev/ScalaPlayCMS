package core.models

import play.api.Play
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import javax.inject.Singleton
import javax.inject._
import slick.profile.SqlProfile.ColumnOption.SqlType
import core.models.{Document, DocumentTableDef}


case class Editable(id: Long, document_id:Long, name:String, value:String)

class EditableTableDef(tag: Tag) extends Table[Editable](tag, "editables") {

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def document_id = column[Long]("document_id")
  def name = column[String]("name")
  def value = column[String]("value")
  def document = foreignKey("document",document_id, documents)(_.id)

  override def * =
    (id, document_id, name, value) <>(Editable.tupled, Editable.unapply)
  
  val documents = TableQuery[DocumentTableDef]
}


@Singleton
class Editables @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends HasDatabaseConfigProvider[JdbcProfile] {

    val editables = TableQuery[EditableTableDef]
    val documents = TableQuery[DocumentTableDef]
    val insertQuery = editables returning editables.map(_.id) into ((editable, id) => editable.copy(id = id))

    def getByPath(path:String) = dbConfig.db.run {
      editables.join(documents).on(_.document_id === _.id).filter(y => y._2.path === path).result
    }

    def insertOrUpdate(editable:Editable) = {
      dbConfig.db.run(
        editables.filter(x => x.name === editable.name && x.document_id === editable.document_id).result.headOption
      ) flatMap (eOpt => eOpt match {
        case Some(edit) => {
          val newEditable = editable.copy(id = edit.id)
          dbConfig.db.run(editables.filter(x => x.id === edit.id).update(newEditable))
        }
        case None => dbConfig.db.run(insertQuery += editable)
      })
    }

    def deleteByDocId(id:Long) = dbConfig.db.run (
      editables.filter(_.document_id === id).delete
    )

}

