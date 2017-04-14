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
    WithAuthAction:AuthAction
) extends Controller {

  implicit val EditableReads = Json.reads[Editable]

  def saveEditables(id:Long) = WithAuthAction(parse.json) { request => 
    {request.body \ "editables"}.asOpt[List[Editable]].map( elist => {
        elist foreach (e => editables.insertOrUpdate(e))
        Ok( Json.toJson(Map("success" -> JsBoolean(true))) )
    }).getOrElse(BadRequest("Parameter missing"))
  }

}