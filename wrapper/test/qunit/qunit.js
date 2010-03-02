//we probably have to have this only describing where the tests are
steal
 .plugins("phui/wrapper")  //load your app
 .plugins('funcunit/qunit')  //load qunit
 .then("wrapper_test")
 
if(steal.browser.rhino){
  steal.plugins('funcunit/qunit/env')
}