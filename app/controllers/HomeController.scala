package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import core.models.Document
import core.models.{Editable, Editables}
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import core.utils._


/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(PageAction:PageAction, editables:Editables) extends Controller {

  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index = PageAction { implicit request =>
    Ok(views.html.index("Your new application is ready!"))
  }

  def test(p:Document) = PageAction { implicit request =>
    Ok(views.html.test(p))
  }

  def default(p:Document) = PageAction { implicit request =>
    println(request.user)
    Ok(views.html.default(p))
  }

}
