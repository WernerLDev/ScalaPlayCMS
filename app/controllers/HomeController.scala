package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import models.Document
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import core.utils._

object LoggingAction extends ActionBuilder[Request] {
  def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]) = {
    Logger.info("Calling action")
    block(request)
  }
}

class UserRequest[A](val username: Option[String], request: Request[A]) extends WrappedRequest[A](request)

object UserAction extends ActionBuilder[UserRequest] with ActionTransformer[Request, UserRequest] {
  def transform[A](request: Request[A]) = Future.successful {
    new UserRequest(request.session.get("username"), request)
  }
}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(WithAuthAction:AuthAction) extends Controller {

  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def test(p:Document) = WithAuthAction { request =>
    println(request.user.username)
    Ok(views.html.test(p))
  }

  def default(p:Document) = WithAuthAction { request =>
    Ok(views.html.default(p))
  }

}
