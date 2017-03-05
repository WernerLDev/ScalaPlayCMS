package core.utils

import scala.concurrent.Future
import play.api.mvc._
import core.models._
import javax.inject._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent._
import scala.concurrent.duration._

class AuthRequest[A](val user: User, val request: Request[A])
  extends WrappedRequest[A](request)

class AuthAction @Inject()(users:Users) extends ActionBuilder[AuthRequest] {

  def invokeBlock[A](request: Request[A], block: AuthRequest[A] => Future[Result]): Future[Result] = {
    (request.session.get("username") flatMap (username => {
        val userOpt = Await.result(users.findByUsername(username), Duration.Inf)
        userOpt.map(user => block(new AuthRequest(user, request)))
    })).getOrElse(Future(Results.Redirect(core.controllers.routes.AdminController.login)))
  }
}
