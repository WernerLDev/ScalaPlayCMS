
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
        )(UserData.apply)(UserData.unapply)    
    )

    def login = Action { implicit request =>
        //users.insert( User(0, "werner", "test123", "blaat@bla.nl") )
        //users.insert( User(0, "nogiemand", "test123", "nogiemand@bla.nl") )
        val test = PasswordHasher.hashPassword("testing123")
        println(test)
        Ok(core.views.html.login(loginForm))
    }

    def doLogin = Action.async { implicit request =>
        loginForm.bindFromRequest.fold(
            formWithErrors => Future(BadRequest(core.views.html.login(formWithErrors))),
            userData => {
                users.authenticate(userData.username, userData.password) flatMap (userOpt => {
                    userOpt match {
                        case Some(user:User) => {
                            val currDate:Date = new Date()
                            val expirationDate:Date = new Date(currDate.getTime() + 1 * 24 * 3600 * 1000)
                            val sessionKey = PasswordHasher.md5Hash(currDate.toString)
                            val useragent = request.headers.get("User-Agent").getOrElse("Unknown")
                            val ip = request.remoteAddress
                            sessions.cleanup(user, useragent, ip) flatMap(x => {
                                val newSession = UserSession(
                                    id = 0,
                                    session_key = sessionKey,
                                    user_id = user.id,
                                    passwordhash = user.passwordhash,
                                    ipaddress = ip,
                                    useragent = useragent,
                                    expiration_date = new Timestamp(expirationDate.getTime())
                                )
                                sessions.create(newSession) map(session => {
                                    Redirect(core.controllers.routes.MainController.index)
                                    .withSession( 
                                        request.session + ("username" -> user.username) + ("skey" -> sessionKey)
                                    )
                                })
                            })
                        }
                        case None => {
                            Future(
                                Redirect(core.controllers.routes.AdminController.login)
                                .withNewSession.flashing("loginfailed" -> "Login attempt failed.")
                            )   
                        }
                    }
                })
            }
        )
    }


    def logout = Action { implicit request =>
        request.session.get("skey") map (key => sessions.deleteByKey(key))
        Redirect(core.controllers.routes.AdminController.login).withSession( request.session - "username" - "skey" )
    }
}