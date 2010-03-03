//we probably have to have this only describing where the tests are
steal
 .plugins("phui/modal")  //load your app
 .plugins('funcunit/qunit')  //load qunit
 .then("modal_test")
 
if(steal.browser.rhino){
  steal.plugins('funcunit/qunit/env')
}