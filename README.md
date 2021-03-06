Scala Play Platform
===================
This is an application I recently started working on. It is an application that can be used for content management, data management and asset management.
Platform will be build on top of Scala Play and the front-end using react.js.

Here's a screenshot of app so far.

![Alt text](http://werlang.nl/rand/loginscreen.png "Screenshot")
![Alt text](http://werlang.nl/rand/inlineeditting.png "Screenshot")
![Alt text](http://werlang.nl/rand/assets.png "Screenshot")


This is your new Play application
=================================

This file will be packaged with your application when using `activator dist`.

There are several demonstration files available in this template.

Controllers
===========

- HomeController.scala:

  Shows how to handle simple HTTP requests.

- AsyncController.scala:

  Shows how to do asynchronous programming when handling a request.

- CountController.scala:

  Shows how to inject a component into a controller and use the component when
  handling requests.

Components
==========

- Module.scala:

  Shows how to use Guice to bind all the components needed by your application.

- Counter.scala:

  An example of a component that contains state, in this case a simple counter.

- ApplicationTimer.scala:

  An example of a component that starts when the application starts and stops
  when the application stops.

Filters
=======

- Filters.scala:

  Creates the list of HTTP filters used by your application.

- ExampleFilter.scala

  A simple filter that adds a header to every response.