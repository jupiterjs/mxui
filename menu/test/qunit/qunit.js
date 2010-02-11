//we probably have to have this only describing where the tests are
steal
 .apps("jupiter/menu")  //load your app
 .plugins('steal/test/qunit')  //load qunit
 .then("menu_test")
 
if(steal.browser.rhino){
  steal.plugins('steal/test/qunit/env')
}