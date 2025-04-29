lazy val root = (project in file("."))
  .enablePlugins(PlayJava, PlayEbean)
  //.enablePlugins(PlayNettyServer).disablePlugins(PlayPekkoHttpServer) // uncomment to use the Netty backend
  .settings(
    name := """Chatroom Application""",
    version := "1.0-SNAPSHOT",
    crossScalaVersions := Seq("2.13.14", "3.3.3"),
    scalaVersion := crossScalaVersions.value.head,
    libraryDependencies ++= Seq(
      guice,
      jdbc,
      javaJdbc,
      javaWs,
      evolutions,
      "org.mindrot" % "jbcrypt" % "0.4",
      "com.auth0" % "java-jwt" % "3.18.2",
      // Test Database
      "com.h2database" % "h2" % "2.2.224",
      "com.mysql" % "mysql-connector-j" % "8.0.33",
      "com.auth0" % "auth0" % "1.28.0",
      "org.projectlombok" % "lombok" % "1.18.32",
// Testing libraries for dealing with CompletionStage...
      "org.assertj" % "assertj-core" % "3.26.0" % Test,
      "org.awaitility" % "awaitility" % "4.2.1" % Test,
    ),
    javacOptions ++= Seq(
      "-encoding", "UTF-8",
      "-parameters",
      "-Xlint:unchecked",
      "-Xlint:deprecation",
      "-Werror"
    ),
    (Test / javaOptions) += "-Dtestserver.port=19001",
    // Make verbose tests
    (Test / testOptions) := Seq(Tests.Argument(TestFrameworks.JUnit, "-a", "-v"))
  )