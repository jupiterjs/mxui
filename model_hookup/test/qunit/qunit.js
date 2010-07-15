//we probably have to have this only describing where the tests are
steal
 .plugins("phui/model_hookup")  //load your app
 .plugins('funcunit/qunit')  //load qunit
 .then("model_hookup_test")
 
if(steal.browser.rhino){
  steal.plugins('funcunit/qunit/env')
}