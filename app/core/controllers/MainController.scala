package core.controllers

import javax.inject._
import play.api._
import play.api.mvc._
import models.{Document, DocumentJson, Documents}
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.libs.json._
import play.api.libs.functional.syntax._

@Singleton
class MainController @Inject()(documents:Documents) extends Controller {

  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index = Action {
    Ok(core.views.html.index("Your new application is ready."))
  }

  implicit val DocWrites = Json.writes[DocumentJson]
  def listDocuments = Action.async {
    documents.listJson map (x => {
      Ok(Json.toJson(x))
    })
  }

  def deleteDocument(docid:Long) = Action.async {
    documents.delete(docid) map ((affectedRows:Int) => {
      Ok(Json.toJson( Map("success" -> JsBoolean(true), "affectedRows" -> JsNumber(affectedRows)) ))
    })
  }

  def addDocument() = Action.async(parse.json) { request =>
      val parent_id = (request.body \ "parent_id").asOpt[Int].getOrElse(0)
      val name = (request.body \ "name").asOpt[String].getOrElse("")
      documents.create( Document(0, parent_id, name, "file", true) ) map { x =>
        Ok(Json.toJson( Map("id" -> JsNumber(x.id),  "parent_id" -> JsNumber(parent_id), "name" -> JsString(name)) ))
      }
  }

  def collapseDocument(id:Long) = Action.async(parse.json) { request =>
    val collapseState = (request.body \ "collapsed").asOpt[Boolean]
    (collapseState map { collapse:Boolean =>
      documents.setCollapsed(id, collapse) map { x =>
        Ok(Json.toJson(Map("success" -> JsNumber(x))))
      }
    }).getOrElse( Future(BadRequest("Error: Missing parameter [collapsed]")) )
  }

  def renameDocument(id:Long) = Action.async(parse.json) { request =>
    ((request.body \ "name").asOpt[String].map{ name =>
      documents.setName(id, name) map { x =>
        Ok(Json.toJson(Map("success" -> JsNumber(x))))
      }
    }).getOrElse( Future(BadRequest("Error: missing parameter [name]")) )
  }

  def updateParentDocument(id:Long) = Action.async(parse.json) { request =>
    ((request.body \ "parent_id").asOpt[Long].map{ parent_id =>
      documents.updateParent(id, parent_id) map { x =>
        Ok(Json.toJson(Map("success" -> JsNumber(x))))
      }
    }).getOrElse( Future(BadRequest("Error: missing parameter [parent_id]")) )
  }
}