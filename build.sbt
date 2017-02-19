name := """ElesticSpider"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala, SbtWeb)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  cache,
  ws,
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test,
  "org.webjars" % "react" % "15.3.2",
  "com.typesafe.play" %% "play-slick" % "2.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "2.0.0",
  "mysql" % "mysql-connector-java" % "5.1.34"
)

includeFilter in webpack := "*.js"
includeFilter in webpackDev := "*.js" // for development mode
includeFilter in webpackProd := "*.js" // for production mode
includeFilter in webpackTest := "*.js" // for testing mode

WebKeys.pipeline := WebKeys.pipeline.dependsOn(webpack).value

fork in run := false