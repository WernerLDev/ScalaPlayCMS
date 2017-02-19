package models

import play.api.Play
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Try,Success,Failure}

case class Document(id : Long , parent_id : Long, name : String, doctype : String, collapsed : Boolean )
case class DocumentJson(id : Long, key: String, label : String, doctype : String, collapsed : Boolean, selected: Boolean, children: List[DocumentJson])
case class DocumentResult(success:Boolean, affectedRowCount:Int)

class DocumentTableDef(tag: Tag) extends Table[Document](tag, "document") {

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def parent_id = column[Long]("parent_id")
  def name = column[String]("name")
  def doctype = column[String]("type")
  def collapsed = column[Boolean]("collapsed")

  override def * =
    (id, parent_id, name, doctype, collapsed) <>(Document.tupled, Document.unapply)
}


object Documents {
    val dbConfig = DatabaseConfigProvider.get[JdbcProfile](Play.current)

    val documents = TableQuery[DocumentTableDef]
    val insertQuery = documents returning documents.map(_.id) into ((doc, id) => doc.copy(id = id))

    def listAll():Future[Seq[Document]] = {
        dbConfig.db.run(documents.result)
    }

    def listJson():Future[List[DocumentJson]] = {
        def generateList(d:List[Document],parentid:Long):List[DocumentJson] = {
            d.filter(x => x.parent_id == parentid).map(x => DocumentJson(x.id, x.name, x.name, x.doctype, x.collapsed, false, generateList(d ,x.id)))
        }
        listAll map (x => generateList(x.toList, 0))
    }

    def create(doc:Document):Future[Document] = {
        dbConfig.db.run( insertQuery += doc )
    }

    def delete(id:Long):Future[DocumentResult] = {
        val action = documents.filter(_.id === id).delete
        val result = dbConfig.db.run(action)
        result map (res => DocumentResult(true, res))
    }

    def collapse(id:Long, state:Boolean):Future[Boolean] = {
        Try(
            documents.filter(x => x.id === id).map{ document => document.collapsed}.update(state)
        ) match {
            case Success(x) => {
                dbConfig.db.run(x)
                Future(true)
            }
            case Failure(_) => Future(false)
        }
    }

    def rename(id:Long, name:String):Future[Boolean] = {
        Try(
            documents.filter(x => x.id === id).map{ document => document.name}.update(name)
        ) match {
            case Success(x) => {
                dbConfig.db.run(x)
                Future(true)
            }
            case Failure(_) => Future(false)
        }
    }
}