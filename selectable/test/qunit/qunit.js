//we probably have to have this only describing where the tests are
steal
 .apps("jupiter/selectable")  //load your app
 .plugins('steal/test/qunit')  //load qunit
 .then("selectable_test")
 
if(steal.browser.rhino){
  steal.plugins('steal/test/qunit/env')
}