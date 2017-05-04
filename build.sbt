name := """ElesticSpider"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file("."))
    .enablePlugins(PlayScala, SbtWeb)
    .dependsOn(SlickScaffolder)

lazy val SlickScaffolder = project

lazy val genModels = inputKey[Unit]("Generate models and table defenitions")

fullRunInputTask(genModels, Test, "werlang.Main")

scalaVersion := "2.11.8"

libraryDependencies ++= Seq(
  cache,
  ws,
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test,
  "com.typesafe.play" %% "play-slick" % "2.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "2.0.0",
  "mysql" % "mysql-connector-java" % "5.1.34",
  play.sbt.Play.autoImport.cache,
  filters,
  "org.mindrot" % "jbcrypt" % "0.3m",
  "com.typesafe.play" %% "play-mailer" % "5.0.0"
)

PlayKeys.playRunHooks += Webpack(baseDirectory.value)

fork in run := false
