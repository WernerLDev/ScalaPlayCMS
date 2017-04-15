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

@Singleton
class EditablesController @Inject()(
    editables:Editables,
    documents:Documents,
    WithAuthAction:AuthAction
) extends Controller {

  implicit val EditableReads = Json.reads[Editable]

  def saveEditables(id:Long) = WithAuthAction.async(parse.json) { request => 
    {request.body \ "editables"}.asOpt[List[Editable]].map( elist => {
        documents.getById(id) flatMap (docOpt => docOpt match {
          case Some(document) => {
            val currentTime:Timestamp = new Timestamp((new Date).getTime());
            elist foreach (e => editables.insertOrUpdate(e))
            val newDoc:Document = document.copy(updated_at = currentTime)
            documents.update(newDoc) map (x => {
              Ok( Json.toJson(Map("success" -> JsBoolean(true))) )
            })
          }
          case None => Future(BadRequest("Error: Invalid document id"))
        })
    }).getOrElse(Future(BadRequest("Parameter missing [editables]")))
  }

}