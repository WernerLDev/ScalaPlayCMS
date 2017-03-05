
package core.controllers

import javax.inject._
import play.api._
import play.api.mvc._
import core.models._
import play.api.data._
import play.api.data.Forms._
import scala.concurrent._
import scala.concurrent.duration._
import core.utils.PasswordHasher
import play.api.Play.current
import play.api.i18n.Messages.Implicits._
import core.models.User

case class UserData(username:String, password:String)

@Singleton
class AdminController @Inject()(users:Users) extends Controller {

    val loginForm = Form(
        mapping(
            "username" -> nonEmptyText,
            "password" -> nonEmptyText
        )(UserData.apply)(UserData.unapply) verifying("Incorrect username or password", fields => fields match {
            case userData => users.check(userData.username, userData.password).isDefined
        })
    )

    def login = Action {
        //users.insert( User(0, "werner", "test123", "blaat@bla.nl") )
        //users.insert( User(0, "nogiemand", "test123", "nogiemand@bla.nl") )
        Ok(core.views.html.login(loginForm))
    }

    def doLogin = Action { implicit request =>
        loginForm.bindFromRequest.fold(
            formWithErrors => {
                println(formWithErrors.errors)
                // binding failure, you retrieve the form containing errors:
                BadRequest(core.views.html.login(formWithErrors))
            },
            userData => {
                Redirect(core.controllers.routes.MainController.index).withSession( request.session + ("username" -> userData.username))
                //Redirect(routes.Application.home(id))
            }
        )
    }

    def logout = Action { implicit request =>
        Redirect(core.controllers.routes.AdminController.login).withSession( request.session - "username" )
    }
}