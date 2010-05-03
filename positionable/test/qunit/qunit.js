//we probably have to have this only describing where the tests are
steal
 .plugins("jupiter/positionable")  //load your app
 .plugins('steal/test/qunit')  //load qunit
 .then("positionable_test")
 
if(steal.browser.rhino){
  steal.plugins('steal/test/qunit/env')
}