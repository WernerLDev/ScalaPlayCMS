package core.controllers

import javax.inject._
import play.api._
import play.api.mvc._
import models.{Document, DocumentJson, Documents}
import core.models._
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._
import java.sql.Timestamp
import java.util.Date
import utils.PageTemplates
import scala.util.{Success, Failure}
import scala.concurrent._
import scala.concurrent.duration._
import core.utils._
import play.filters.csrf._

@Singleton
class MainController @Inject()(documents:Documents, editables:Editables, templates:PageTemplates, WithAuthAction:AuthAction, PageAction:PageAction) extends Controller {

  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index = WithAuthAction { implicit request =>
    val token = CSRF.getToken.get
    Ok(core.views.html.index("Logged in as " + request.user.username, token.value))
  }

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

  implicit val DocWrites = Json.writes[DocumentJson]
  def listDocuments = WithAuthAction.async {
    documents.listJson map (x => {
      //Thread.sleep(500);
      Ok(Json.toJson(x))
    })
  }

  implicit val DocumentWrites = Json.writes[Document]
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
      val parent_id = (request.body \ "parent_id").asOpt[Int].getOrElse(0)
      val name = (request.body \ "name").asOpt[String].getOrElse("")
      val pagetype = (request.body \ "pagetype").asOpt[String].getOrElse("default")
      val currentTime:Timestamp = new Timestamp((new Date).getTime());
      val parent = documents.getById(parent_id)
      parent flatMap (docOp => docOp match {
        case Some(doc) => {
          val newpath = if(doc.parent_id > 0) doc.path + "/" + name else name
          documents.create( Document(0, parent_id, name, "file", true, Some(pagetype), newpath, currentTime, currentTime, currentTime) ) map { x =>
            Ok(Json.toJson( Map("id" -> JsNumber(x.id),  "parent_id" -> JsNumber(parent_id), "name" -> JsString(name)) ))
          }
        }
        case None => Future(BadRequest("Invalid parent_id"))
      })
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


  implicit val EditableReads = Json.reads[Editable]
  def saveEditables(id:Long) = WithAuthAction(parse.json) { request => 
    {request.body \ "editables"}.asOpt[List[Editable]].map( elist => {
        elist foreach (e => editables.insertOrUpdate(e))
        Ok( Json.toJson(Map("success" -> JsBoolean(true))) )
    }).getOrElse(BadRequest("Parameter missing"))
  }

  def page(path:String):Action[AnyContent] = {
    val result = Await.result(documents.getByPath("/" + path), Duration.Inf)
    result match {
      case Some(p) => templates.getAction(p)
      case None => PageAction { implicit request =>
        NotFound(views.html.notfound("The page you are looking for doesn't exist."))
      }
    }
  }
}