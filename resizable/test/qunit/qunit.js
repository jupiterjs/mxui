//we probably have to have this only describing where the tests are
steal
 .plugins("phui/resizable")  //load your app
 .plugins('funcunit/qunit')  //load qunit
 .then("resizable_test")
 
if(steal.browser.rhino){
  steal.plugins('funcunit/qunit/env')
}