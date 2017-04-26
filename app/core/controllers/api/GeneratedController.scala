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
import core.models._

@Singleton
class GeneratedController @Inject()(
    WithAuthAction:AuthAction, 
    conf:Configuration) extends Controller {


    def getAll(name:String) = WithAuthAction{ request =>
        Ok("Not implemented yet")
    }

}