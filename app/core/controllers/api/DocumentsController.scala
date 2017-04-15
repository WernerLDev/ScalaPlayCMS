package core.controllers.api

import javax.inject._
import play.api._
import play.api.mvc._
import core.models._
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._
import java.sql.Timestamp
import java.util.Date
import core.utils._
import utils.PageTemplates

case class NewDocument(name:String, pagetype:String, parent_id:Long)

@Singleton
class DocumentsController @Inject()(
    documents:Documents, 
    templates:PageTemplates, 
    WithAuthAction:AuthAction
) extends Controller {
  
  implicit val tsreads: Reads[Timestamp] = Reads.of[Long] map (new Timestamp(_))
  implicit val DocTreeWrites = Json.writes[DocumentJson]
  implicit val DocWrites = Json.writes[Document]
  implicit val DocumentReads = Json.reads[Document]
  implicit val NewDocReads = Json.reads[NewDocument]
  
  def getPageTypes = WithAuthAction {
    val pagetypes = templates.templates.map { case (k,v) => {
      Json.toJson(Map( "typekey" -> JsString(k), "typename" -> JsString(v.name)))
     }}.toSeq
    Ok(
      Json.toJson(
        Map(
          "pagetypes" -> JsArray(pagetypes)
        )
      )
    )
  }

  def listDocuments = WithAuthAction.async {
    documents.listJson map (x => {
      Ok(Json.toJson(x))
    })
  }
  
  def getDocument(id:Long) = WithAuthAction.async {
    documents.getById(id).map(docOpt => {
      docOpt.map(doc => Ok(Json.toJson(doc)))
      .getOrElse(BadRequest("Document not found"))
    })
  }

  def deleteDocument(docid:Long) = WithAuthAction.async {
    documents.delete(docid) map ((affectedRows:Int) => {
      Ok(Json.toJson( Map("success" -> JsBoolean(true), "affectedRows" -> JsNumber(affectedRows)) ))
    })
  }

  def addDocument() = WithAuthAction.async(parse.json) { request =>
      {request.body \ "document"}.asOpt[NewDocument].map( document => {
        val currentTime:Timestamp = new Timestamp((new Date).getTime());
        val name = document.name.toLowerCase.replace(" ", "-")
        val parent = documents.getById(document.parent_id)
        parent flatMap (docOpt => docOpt match {
          case Some(parentDoc) => {
            val newpath = if(parentDoc.doctype == "home") "/" + name else parentDoc.path + "/" + name
            val newDocument = Document(
              id = 0,
              parent_id = document.parent_id,
              name = name,
              doctype = "page",
              path = newpath,
              collapsed = true,
              view = Some(document.pagetype),
              title = "", description = "", locale = "en",
              created_at = currentTime, updated_at = currentTime, published_at = currentTime
            )
            documents.create(newDocument) map (x => {
              Ok(Json.toJson( Map("id" -> JsNumber(x.id),  "parent_id" -> JsNumber(document.parent_id), "name" -> JsString(name)) ))
            })
          }
          case None => Future(BadRequest("Error: Invalid parent id"))
        })
      }).getOrElse(Future(BadRequest("Error: No document found")))
  }
  
  def updateDocument = WithAuthAction.async(parse.json) { request => 
    {request.body \ "document"}.asOpt[Document].map( document => {
      documents.update(document) map (x => {
        Ok( Json.toJson(Map("success" -> JsBoolean(true))) )
      })
    }).getOrElse(Future(BadRequest("Parameter missing")))
  }

  def collapseDocument(id:Long) = WithAuthAction.async(parse.json) { request =>
    val collapseState = (request.body \ "collapsed").asOpt[Boolean]
    (collapseState map { collapse:Boolean =>
      documents.setCollapsed(id, collapse) map { x =>
        Ok(Json.toJson(Map("success" -> JsNumber(x))))
      }
    }).getOrElse( Future(BadRequest("Error: Missing parameter [collapsed]")) )
  }

  def renameDocument(id:Long) = WithAuthAction.async(parse.json) { request =>
    ((request.body \ "name").asOpt[String].map{ name =>
      documents.setName(id, name) map { x =>
        Ok(Json.toJson(Map("success" -> JsNumber(x))))
      }
    }).getOrElse( Future(BadRequest("Error: missing parameter [name]")) )
  }

  def updateParentDocument(id:Long) = WithAuthAction.async(parse.json) { request =>
    ((request.body \ "parent_id").asOpt[Long].map{ parent_id =>
      documents.updateParent(id, parent_id) map { x =>
        Ok(Json.toJson(Map("success" -> JsNumber(x))))
      }
    }).getOrElse( Future(BadRequest("Error: missing parameter [parent_id]")) )
  }

  def setDocumentPublishDate(id:Long) = WithAuthAction.async(parse.json) { request => 
    ((request.body \ "publishdate").asOpt[Long].map{ publishdate =>
      documents.updatePublishDate(id, publishdate) map { x =>
        Ok(Json.toJson(Map("success" -> JsNumber(x))))
      }
    }).getOrElse( Future(BadRequest("Error: missing parameter [publishdate]")) )
  }
  

}