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
import scala.concurrent._
import scala.concurrent.duration._

case class Document(id : Long , parent_id : Long, name : String, doctype : String, collapsed : Boolean, view:Option[String], path:String, created_at:Timestamp, updated_at:Timestamp, published_at:Timestamp )
case class DocumentJson(id : Long, key: String, path:String, label : String, doctype : String, collapsed : Boolean, selected: Boolean, children: List[DocumentJson])

class DocumentTableDef(tag: Tag) extends Table[Document](tag, "document") {

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def parent_id = column[Long]("parent_id")
  def name = column[String]("name")
  def doctype = column[String]("type")
  def path = column[String]("path")
  def collapsed = column[Boolean]("collapsed")
  def view = column[Option[String]]("view")
  
  def created_at = column[Timestamp]("created_at", SqlType("timestamp not null default CURRENT_TIMESTAMP"))
  def updated_at = column[Timestamp]("updated_at", SqlType("timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP"))
  def published_at = column[Timestamp]("published_at", SqlType("timestamp not null default CURRENT_TIMESTAMP"))
  override def * =
    (id, parent_id, name, doctype, collapsed, view, path, created_at, updated_at, published_at) <>(Document.tupled, Document.unapply)
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
            d.filter(x => x.parent_id == parentid).map(x => DocumentJson(x.id, x.name, x.path, x.name, x.doctype, x.collapsed, false, generateList(d ,x.id)))
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

    def update(doc:Document):Future[Document] = dbConfig.db.run {
        documents.filter(_.id === doc.id).update(doc).map (x => doc)
    }

    def setCollapsed(id:Long, state:Boolean):Future[Int] = dbConfig.db.run {
        documents.filter(_.id === id).map(_.collapsed).update(state)
    }

    def setName(id:Long, name:String):Future[Int] = {
        (dbConfig.db.run {
            documents.filter(_.id === id).map(_.name).update(name)
        }) flatMap (x => {
            getById(id) flatMap (docOpt => docOpt match {
                case Some(doc) => {
                    getById(doc.parent_id) flatMap ( pDocOpt => pDocOpt match {
                        case Some(parentdoc) => updatePath(parentdoc)
                        case None => Future(0)
                    })
                }
                case None => Future(x)
            })
        })
    }

    def updateParent(id:Long, parent_id:Long):Future[Int] = {
        (dbConfig.db.run {
            documents.filter(_.id === id).map(_.parent_id).update(parent_id)
        }) flatMap ( x => {
            getById(parent_id) flatMap ( docOpt =>  docOpt match {
                case Some(doc) => updatePath(doc)
                case None => Future(0)
            })
        })
    }

    def getByName(name:String):Future[Option[Document]] = dbConfig.db.run {
        documents.filter(_.name === name).result.headOption
    }

    def getById(id:Long):Future[Option[Document]] = dbConfig.db.run {
        documents.filter(_.id === id).result.headOption
    }

    def getByParentId(id:Long) = dbConfig.db.run {
        documents.filter(_.parent_id === id).result
    }

    def getByPath(path:String) = dbConfig.db.run {
        documents.filter(_.path === path).result.headOption
    }

    def updatePath(parentdoc:Document):Future[Int] = {
        val childs = Await.result(getByParentId(parentdoc.id), Duration.Inf)
        val updatedChilds = childs map (x => update(x.copy(path = parentdoc.path + "/" + x.name)))
        
        updatedChilds foreach (x => x map (doc => {
            updatePath(doc)
        }))
        Future(updatedChilds.length)
    }
}