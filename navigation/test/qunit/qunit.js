//we probably have to have this only describing where the tests are
include
 .apps("jupiter/navigation")  //load your app
 .plugins('jmvc/test/qunit')  //load qunit
 .then("navigation_test")
 
if(include.browser.rhino){
  include.plugins('jmvc/test/qunit/env')
}