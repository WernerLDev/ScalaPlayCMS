
package core.controllers

import javax.inject._
import play.api._
import play.api.mvc._

@Singleton
class AdminController @Inject()() extends Controller {

    def login = Action {
        Ok(core.views.html.login())
    }

}