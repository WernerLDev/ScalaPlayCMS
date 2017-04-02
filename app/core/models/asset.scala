package core.models

import play.api.Play
import play.api._
import play.api.mvc._
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

case class Asset(id : Long , parent_id : Long, name : String, mimetype : String, collapsed : Boolean, path:String, server_path:String, created_at:Timestamp )
case class AssetTree(id : Long, key: String, path:String, server_path:String, label : String, mimetype : String, collapsed : Boolean, children: List[AssetTree])

class AssetTableDef(tag: Tag) extends Table[Asset](tag, "assets") {

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def parent_id = column[Long]("parent_id")
  def name = column[String]("name")
  def mimetype = column[String]("mimetype")
  def path = column[String]("path")
  def server_path = column[String]("server_path")
  def collapsed = column[Boolean]("collapsed")
  def created_at = column[Timestamp]("created_at", SqlType("timestamp not null default CURRENT_TIMESTAMP"))

  override def * =
    (id, parent_id, name, mimetype, collapsed, path, server_path, created_at) <>(Asset.tupled, Asset.unapply)
}

@Singleton
class Assets @Inject()(protected val dbConfigProvider: DatabaseConfigProvider, conf:Configuration) extends HasDatabaseConfigProvider[JdbcProfile] {

    val assets = TableQuery[AssetTableDef]
    val insertQuery = assets returning assets.map(_.id) into ((asset, id) => asset.copy(id = id))

    def listAll():Future[Seq[Asset]] = {
        dbConfig.db.run(assets.result)
    }

    def listJson():Future[List[AssetTree]] = {
        def generateList(d:List[Asset],parentid:Long):List[AssetTree] = {
            d.filter(x => x.parent_id == parentid).sortBy(a => a.mimetype)
            .map(x => {
                val childItems = generateList(d, x.id)
                AssetTree(
                    id = x.id, 
                    key = x.name,
                    path = x.path,
                    server_path = x.server_path,
                    label = x.name,
                    mimetype = x.mimetype, 
                    collapsed = x.collapsed, 
                    children = childItems.filter(_.mimetype == "folder") ++ childItems.filter(_.mimetype != "folder")
                 )
             })
        }
        listAll map (x => generateList(x.toList, 0))
    }

    def getByName(name:String) = dbConfig.db.run {
        assets.filter(_.name === name).result.headOption
    }

    def getByPath(path:String) = dbConfig.db.run {
        assets.filter(_.path === path).result.headOption
    }

    def getById(id:Long) = dbConfig.db.run {
        assets.filter(_.id === id).result.headOption
    }

    def create(asset:Asset):Future[Asset] = {
        dbConfig.db.run( insertQuery += asset )
    }

    def delete(id:Long):Future[Int] = {
        val subitems:Future[Seq[Asset]] = dbConfig.db.run(assets.filter(_.parent_id === id).result)
        subitems.map(items => {
            items.map(x => delete(x.id))
        })

        val assetdir = conf.getString("elestic.uploadroot").getOrElse("")
        (dbConfig.db.run(assets.filter(_.id === id).result.headOption)).map(assetOpt => {
            assetOpt.map(asset => {
                val file = new java.io.File(assetdir + asset.server_path)
                if(file.exists) {
                    file.delete();
                }
            })
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

    def setName(id:Long, name:String):Future[Int] = {
        (dbConfig.db.run {
            assets.filter(_.id === id).map(_.name).update(name)
        }) flatMap (x => {
            getById(id) flatMap (assetOpt => assetOpt match {
                case Some(asset) => {
                    getById(asset.parent_id) flatMap ( pAssetOpt => pAssetOpt match {
                        case Some(parentAsset) => updatePath(parentAsset)
                        case None => Future(0)
                    })
                }
                case None => Future(x)
            })
        })
    }

    def updateParent(id:Long, parent_id:Long):Future[Int] = {
        (dbConfig.db.run {
            assets.filter(_.id === id).map(_.parent_id).update(parent_id)
        }) flatMap ( x => {
            getById(parent_id) flatMap ( assetOpt =>  assetOpt match {
                case Some(asset) => updatePath(asset)
                case None => Future(0)
            })
        })
    }

    def getByParentId(parent_id:Long) = dbConfig.db.run {
        assets.filter(_.parent_id === parent_id).result
    }
    
    def updatePath(parentObj:Asset):Future[Int] = {
        getByParentId(parentObj.id) map (childs => {
            val updatedChilds = {
                if(parentObj.mimetype == "home") {
                    childs map (x => update(x.copy(path = "/" + x.name)))
                } else {
                    childs map (x => update(x.copy(path = parentObj.path + "/" + x.name)))
                }
            }
            updatedChilds foreach (x => x map (asset => {
                updatePath(asset)
            }))
            updatedChilds.length
        })
    }
}