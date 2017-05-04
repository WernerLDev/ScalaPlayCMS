package core.controllers.api

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
import play.api.mvc._
import core.utils._
import play.api.libs.json._
import play.api.libs.json.Reads._

import core.models._


trait TGenController {
    def getAll(request:AuthRequest[AnyContent]):Future[Result]
    def insert(request:AuthRequest[JsValue]):Future[Result]
}

@Singleton
class GeneratedBlogsController @Inject() (
    WithAuthAction:AuthAction,
    blogs:Blogs
    ) extends Controller with TGenController {

    implicit val tsreads: Reads[Timestamp] = Reads.of[Long] map (new Timestamp(_))
    implicit val BlogWrites = Json.writes[Blog]
    implicit val BlogReads = Json.reads[Blog]
    implicit val categoryWrites = Json.writes[Category]

    def getAll(request:AuthRequest[AnyContent]) = {
        blogs.getAll.map(entities => Ok(Json.toJson(entities.map(x => Map( "id" -> JsNumber(x._1.id), "name"-> JsString(x._1.name), "title"-> JsString(x._1.title), "content"-> JsString(x._1.content), "created_at" -> JsNumber(x._1.created_at.getTime()), "category_id" -> JsNumber(x._1.category_id), "category" -> Json.toJson(x._2)) ))))
    }

    def insert(request:AuthRequest[JsValue]) = {
        {request.body \ "entity"}.asOpt[Blog].map( entity => {
            blogs.insert(entity).map(x => {
                Ok(Json.toJson( Map("id" -> JsNumber(x.id)) ))
            })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }
}


@Singleton
class GeneratedCategoriesController @Inject() (
    WithAuthAction:AuthAction,
    categories:Categories
    ) extends Controller with TGenController {

    implicit val tsreads: Reads[Timestamp] = Reads.of[Long] map (new Timestamp(_))
    implicit val CategoryWrites = Json.writes[Category]
    implicit val CategoryReads = Json.reads[Category]


    def getAll(request:AuthRequest[AnyContent]) = {
        categories.getAll.map(x => Ok(Json.toJson(x)))
    }

    def insert(request:AuthRequest[JsValue]) = {
        {request.body \ "entity"}.asOpt[Category].map( entity => {
            categories.insert(entity).map(x => {
                Ok(Json.toJson( Map("id" -> JsNumber(x.id)) ))
            })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }
}

@Singleton
class GeneratedController @Inject() (
    WithAuthAction:AuthAction,
    blogs:GeneratedBlogsController,
categories:GeneratedCategoriesController
) extends Controller {


    val controllers = Map(
        "blogs" -> blogs,
"categories" -> categories
    )

    def getAll(name:String) = WithAuthAction.async { request =>
        controllers.get(name) match {
            case Some(x) => x.getAll(request)
            case None => Future(BadRequest("Error: Entity with name " + name + " doesn't exist."))
        }
    }

    def insert(name:String) = WithAuthAction.async(parse.json) { request =>
        controllers.get(name) match {
            case Some(x) => x.insert(request)
            case None => Future(BadRequest("Error: Entity with name " + name + " doesn't exist."))
        }
    }

    def getEntities = WithAuthAction { request =>
        val entities = controllers.map { case (k,v) => {
            Json.toJson(Map("name" -> JsString(k)))
        }}.toSeq
        Ok( Json.toJson(JsArray(entities)) )
    }
}
