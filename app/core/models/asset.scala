package core.models

import play.api.Play
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import javax.inject.Singleton
import javax.inject._
import play.api.Play.current
import java.sql.Timestamp
import slick.profile.SqlProfile.ColumnOption.SqlType
import scala.concurrent._
import scala.concurrent.duration._

case class Asset(id : Long , parent_id : Long, name : String, mimetype : String, collapsed : Boolean, path:String, created_at:Timestamp )
case class AssetTree(id : Long, key: String, path:String, label : String, mimetype : String, collapsed : Boolean, children: List[AssetTree])

class AssetTableDef(tag: Tag) extends Table[Asset](tag, "asset") {

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def parent_id = column[Long]("parent_id")
  def name = column[String]("name")
  def mimetype = column[String]("mimetype")
  def path = column[String]("path")
  def collapsed = column[Boolean]("collapsed")
  def created_at = column[Timestamp]("created_at", SqlType("timestamp not null default CURRENT_TIMESTAMP"))

  override def * =
    (id, parent_id, name, mimetype, collapsed, path, created_at) <>(Asset.tupled, Asset.unapply)
}

@Singleton
class Assets @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends HasDatabaseConfigProvider[JdbcProfile] {

    val assets = TableQuery[AssetTableDef]
    val insertQuery = assets returning assets.map(_.id) into ((asset, id) => asset.copy(id = id))

    def listAll():Future[Seq[Asset]] = {
        dbConfig.db.run(assets.result)
    }

    def listJson():Future[List[AssetTree]] = {
        def generateList(d:List[Asset],parentid:Long):List[AssetTree] = {
            d.filter(x => x.parent_id == parentid).map(x => AssetTree(x.id, x.name, x.path, x.name, x.mimetype, x.collapsed, generateList(d ,x.id)))
        }
        listAll map (x => generateList(x.toList, 0))
    }

    def create(asset:Asset):Future[Asset] = {
        dbConfig.db.run( insertQuery += asset )
    }

    def delete(id:Long):Future[Int] = {
        val subitems:Future[Seq[Asset]] = dbConfig.db.run(assets.filter(_.parent_id === id).result)
        subitems.map(items => {
            items.map(x => delete(x.id))
        })
        val action = assets.filter(_.id === id).delete
        dbConfig.db.run(action)
    }

    def update(asset:Asset):Future[Asset] = dbConfig.db.run {
        assets.filter(_.id === asset.id).update(asset).map (x => asset)
    }

    def setCollapsed(id:Long, state:Boolean):Future[Int] = dbConfig.db.run {
        assets.filter(_.id === id).map(_.collapsed).update(state)
    }

    def setName(id:Long, name:String):Future[Int] = dbConfig.db.run {
        assets.filter(_.id === id).map(_.name).update(name)
    }

    def updateParent(id:Long, parent_id:Long):Future[Int] = dbConfig.db.run {
        assets.filter(_.id === id).map(_.parent_id).update(parent_id)
    }
}