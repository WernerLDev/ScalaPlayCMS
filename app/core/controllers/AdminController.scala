
package core.controllers

import scala.concurrent.ExecutionContext.Implicits.global
import javax.inject._
import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import scala.concurrent._
import scala.concurrent.duration._
import core.utils.PasswordHasher
import play.api.Play.current
import play.api.i18n.Messages.Implicits._
import core.models._
import java.sql.Timestamp
import java.util.Date

case class UserData(username:String, password:String)

@Singleton
class AdminController @Inject()(users:Users, sessions:UserSessions) extends Controller {

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
            formWithErrors => BadRequest(core.views.html.login(formWithErrors)),
            userData => {
                val currDate:Date = new Date()
                var expirationdate:Date = new Date(currDate.getTime() + 1 * 24 * 3600 * 1000)
                val sessionkey = PasswordHasher.md5Hash(currDate.toString)
                
                val futureUser = users.findByUsername(userData.username) map (userOpt => {
                    userOpt map (user => {
                        sessions.cleanup(user, request.headers.get("User-Agent").getOrElse("Unknown"), request.remoteAddress)
                        val newSession = UserSession(
                            id = 0,
                            session_key = sessionkey,
                            user_id = user.id,
                            passwordhash = user.passwordhash,
                            ipaddress = request.remoteAddress,
                            useragent = request.headers.get("User-Agent").getOrElse("Unknown"),
                            expiration_date = new Timestamp(expirationdate.getTime())
                        )
                        sessions.create( newSession )
                    })
                })
                Redirect(core.controllers.routes.MainController.index)
                .withSession( 
                    request.session + ("username" -> userData.username) + ("skey" -> sessionkey)
                 )
            }
        )
    }

    def logout = Action { implicit request =>
        request.session.get("skey") map (key => sessions.deleteByKey(key))
        Redirect(core.controllers.routes.AdminController.login).withSession( request.session - "username" - "skey" )
    }
}