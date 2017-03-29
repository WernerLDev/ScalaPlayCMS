package core.utils

import scala.concurrent.Future
import play.api.mvc._
import core.models._
import javax.inject._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent._
import scala.concurrent.duration._
import java.sql.Timestamp
import java.util.Date;
import core.models._

class AuthRequest[A](val user: User, val request: Request[A])
  extends WrappedRequest[A](request)

class AuthAction @Inject()(users:Users, sessions:UserSessions) extends ActionBuilder[AuthRequest] {
  
  def isValidSession(session:UserSession, user:User, useragent:String, ip:String, currDate:Timestamp):Boolean = {
    (session.useragent == useragent && 
     session.ipaddress == ip && 
     session.passwordhash == user.passwordhash &&
     session.expiration_date.getTime() >= currDate.getTime())
  }

  lazy val redirectLogin = {
    Results.Redirect(core.controllers.routes.AdminController.login)
    .withNewSession
  }

  def invokeBlock[A](request: Request[A], block: AuthRequest[A] => Future[Result]): Future[Result] = {
    val sessionkey = request.session.get("skey").getOrElse("Invalid")
    val username = request.session.get("username").getOrElse("")

    sessions.getByKey(sessionkey) flatMap (uaOpt => uaOpt match {
      case Some((session:UserSession, user:User)) => {
        val useragent = request.headers.get("User-Agent").getOrElse("Unknown")
        val currDate = new Timestamp((new Date).getTime())
        val ip = request.remoteAddress

        if(isValidSession(session, user, useragent, ip, currDate)) {
          block(new AuthRequest(user, request))
        } else Future(redirectLogin)
      }

      case None => Future(redirectLogin)
    })
  }
}

class PageRequest[A](val user:Option[User], val editmode:Boolean, val editables:List[Editable], val documents:List[DocumentJson], request:Request[A]) extends WrappedRequest[A](request)

class PageAction @Inject()(users:Users, editables:Editables, documents:Documents) extends ActionBuilder[PageRequest] with ActionTransformer[Request, PageRequest] {

  def transform[A](request:Request[A]) = {
    val username = request.session.get("username").getOrElse("")
    val editmode = request.getQueryString("editmode").getOrElse("")
    editables.getByPath(request.path) flatMap (docEditable => {
      val editableValues = docEditable.map(_._1).toList
      documents.listJson flatMap (menuitems => {
        users.findByUsername(username) map (userOpt => userOpt match {
          case Some(user:User) => new PageRequest(userOpt, editmode == "editing", editableValues, menuitems, request)
          case None => new PageRequest(None, false, editableValues, menuitems, request)
        })
      })
    })
  }

}