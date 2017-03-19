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
import scala.util.{Success, Failure}
import java.io.File

@Singleton
class AssetsController @Inject()(assets:Assets, WithAuthAction:AuthAction, PageAction:PageAction, conf:Configuration) extends Controller {

    implicit val DocWrites = Json.writes[AssetTree]
    
    def all = WithAuthAction.async { request => {
        println(conf.getString("elestic.uploaddir"))
        assets.listJson().map(x => {
            Ok(Json.toJson(x))
        })
    }}

    def create = WithAuthAction.async(parse.json) { request =>
      val parent_id = (request.body \ "parent_id").asOpt[Int].getOrElse(0)
      val name = (request.body \ "name").asOpt[String].getOrElse("")
      val path = (request.body \ "path").asOpt[String].getOrElse("")
      val mimetype = (request.body \ "mimetype").asOpt[String].getOrElse("")
      val currentTime:Timestamp = new Timestamp((new Date).getTime());
      val asset = Asset(
          id = 0,
          parent_id = parent_id,
          name = name,
          path = path,
          collapsed = true,
          mimetype = mimetype,
          created_at = currentTime 
      )
      assets.create(asset).map(x => {
          Ok(Json.obj("success" -> true))
      })
    }

    def upload = WithAuthAction(parse.multipartFormData) { implicit request =>
        val assetsdir = "/home/werner/Projects/ElesticSpider/uploads/";
        request.body.file("asset").map { asset =>
            val filename = asset.filename 
            val contentType = asset.contentType
            val outputfile = new File(assetsdir + filename)
            asset.ref.moveTo(outputfile)
            
            val filepath = "/uploads/" + filename
            Ok(Json.obj("success" -> true, "name" -> filename, "path" -> filepath))
        }.getOrElse {
            Ok(Json.obj("success" -> false, "name" -> "", "path" -> ""))
        }
    }

}