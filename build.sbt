name := """ElesticSpider"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file("."))
    .enablePlugins(PlayScala, SbtWeb)
    .aggregate(SlickScaffolder)
    .dependsOn(SlickScaffolder)

lazy val SlickScaffolder = project

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  cache,
  ws,
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test,
  "org.webjars" % "react" % "15.3.2",
  "com.typesafe.play" %% "play-slick" % "2.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "2.0.0",
  "mysql" % "mysql-connector-java" % "5.1.34",
  "jp.t2v" %% "play2-auth"        % "0.14.2",
  play.sbt.Play.autoImport.cache,
  filters,
  "org.mindrot" % "jbcrypt" % "0.3m",
  "com.typesafe.play" %% "play-mailer" % "5.0.0"
)

PlayKeys.playRunHooks += Webpack(baseDirectory.value)

fork in run := false