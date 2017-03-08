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

class AuthRequest[A](val user: User, val request: Request[A])
  extends WrappedRequest[A](request)

class AuthAction @Inject()(users:Users, sessions:UserSessions) extends ActionBuilder[AuthRequest] {

  def invokeBlock[A](request: Request[A], block: AuthRequest[A] => Future[Result]): Future[Result] = {
    (request.session.get("username") flatMap (username => {
        val userOpt = Await.result(users.findByUsername(username), Duration.Inf)
        userOpt.flatMap(user => {
          val session = (request.session.get("skey")) flatMap (skey => Await.result(sessions.getSession(user, skey), Duration.Inf ))
          session.flatMap(s => {
            val useragent = request.headers.get("User-Agent").getOrElse("Unknown")
            val currDate = new Timestamp((new Date).getTime())
            if(s.useragent == useragent && user.passwordhash == s.passwordhash && s.ipaddress == request.remoteAddress && s.expiration_date.getTime() > currDate.getTime()) {
              Some(block(new AuthRequest(user, request)))
            } else None
          })
        })
    })).getOrElse(Future(Results.Redirect(core.controllers.routes.AdminController.login).withSession(request.session - "username" - "skey") ))
  }
}

//class UserRequest[A](val username: Option[String], request: Request[A]) extends WrappedRequest[A](request)

//object UserAction extends
//    ActionBuilder[UserRequest] with ActionTransformer[Request, UserRequest] {
//  def transform[A](request: Request[A]) = Future.successful {
//    new UserRequest(request.session.get("username"), request)
//  }
//}

class PageRequest[A](val user:Option[User], val editmode:Boolean, request:Request[A]) extends WrappedRequest[A](request)


class PageAction @Inject()(users:Users) extends ActionBuilder[PageRequest] with ActionTransformer[Request, PageRequest] {

  def transform[A](request:Request[A]) = Future.successful {
    val usernameOpt = request.session.get("username")
    val userOpt = usernameOpt.flatMap(username =>  Await.result(users.findByUsername(username), Duration.Inf))
    request.getQueryString("editmode") match {
      case Some(x) => new PageRequest(userOpt, x == "editing", request)
      case None => new PageRequest(userOpt, false, request)
    }
  }
}