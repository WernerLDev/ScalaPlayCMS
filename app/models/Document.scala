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

case class Document(id : Long , parent_id : Long, name : String, doctype : String, collapsed : Boolean )
case class DocumentJson(id : Long, key: String, label : String, doctype : String, collapsed : Boolean, selected: Boolean, children: List[DocumentJson])

class DocumentTableDef(tag: Tag) extends Table[Document](tag, "document") {

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def parent_id = column[Long]("parent_id")
  def name = column[String]("name")
  def doctype = column[String]("type")
  def collapsed = column[Boolean]("collapsed")

  override def * =
    (id, parent_id, name, doctype, collapsed) <>(Document.tupled, Document.unapply)
}

@Singleton
class Documents @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends HasDatabaseConfigProvider[JdbcProfile] {

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

    def delete(id:Long):Future[Int] = {
        val subitems:Future[Seq[Document]] = dbConfig.db.run(documents.filter(_.parent_id === id).result)
        subitems.map(items => {
            items.map(x => delete(x.id))
        })
        val action = documents.filter(_.id === id).delete
        dbConfig.db.run(action)
    }

    def setCollapsed(id:Long, state:Boolean):Future[Int] = dbConfig.db.run {
        documents.filter(_.id === id).map(_.collapsed).update(state)
    }

    def setName(id:Long, name:String):Future[Int] = dbConfig.db.run {
        documents.filter(_.id === id).map(_.name).update(name)
    }

    def updateParent(id:Long, parent_id:Long):Future[Int] = dbConfig.db.run {
        documents.filter(_.id === id).map(_.parent_id).update(parent_id)
    }
}