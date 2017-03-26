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
        //println(conf.getString("elestic.uploaddir"))
        assets.listJson().map(x => {
            Ok(Json.toJson(x))
        })
    }}

    implicit val AssetWrites = Json.writes[Asset]
    def getById(id:Long) = WithAuthAction.async { request => 
        assets.getById(id).map(assetOpt => {
            assetOpt.map(asset => Ok(Json.toJson(asset)))
            .getOrElse(NotFound("Couldn't find asset"))
        })
    }

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
        val uploadroot = conf.getString("elestic.uploadroot").getOrElse("")
        val uploaddir = conf.getString("elestic.uploaddir").getOrElse("")
        val assetsdir = uploadroot + uploaddir;
        request.body.file("asset").map { asset =>
            val filename = asset.filename 
            val contentType = asset.contentType
            val outputfile = new File(assetsdir + filename)
            asset.ref.moveTo(outputfile)
            
            val filepath = uploaddir + filename
            Ok(Json.obj("success" -> true, "name" -> filename, "path" -> filepath))
        }.getOrElse {
            Ok(Json.obj("success" -> false, "name" -> "", "path" -> ""))
        }
    }

    def delete(id:Long) = WithAuthAction.async { request =>
        assets.delete(id).map(r => {
            Ok(Json.obj("success" -> true))
        })
    }

    def rename(id:Long) = WithAuthAction.async(parse.json) { request =>
        (request.body \ "name").asOpt[String].map(name => {
            assets.setName(id, name).map(x => 
                Ok(Json.obj("success" -> true))
            )
        }).getOrElse(Future(BadRequest("Missing parameter [name]")) )
    }

    def updateParent(id:Long) = WithAuthAction.async(parse.json) { request =>
        ((request.body \ "parent_id").asOpt[Long].map{ parent_id =>
        assets.updateParent(id, parent_id) map { x =>
            Ok(Json.toJson(Map("success" -> JsNumber(x))))
        }
        }).getOrElse( Future(BadRequest("Error: missing parameter [parent_id]")) )
    }

    def collapse(id:Long) = WithAuthAction.async(parse.json) { request =>
        val collapseState = (request.body \ "collapsed").asOpt[Boolean]
        (collapseState map { collapse:Boolean =>
        assets.setCollapsed(id, collapse) map { x =>
            Ok(Json.toJson(Map("success" -> JsNumber(x))))
        }
        }).getOrElse( Future(BadRequest("Error: Missing parameter [collapsed]")) )
    }

    def getUpload(filename:String) = PageAction.async { implicit request =>
        val assetdir = conf.getString("elestic.uploadroot").getOrElse("")
        assets.getByName(filename).map(assetOpt => {
            assetOpt.map(asset => {
                Ok.sendFile(
                    content = new File(assetdir + asset.path),
                    inline = true
                )
            }).getOrElse(NotFound(views.html.notfound("The uploaded file you are looking for doesn't exist.")))
        })
   }
}
