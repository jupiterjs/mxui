//we probably have to have this only describing where the tests are
steal
 .plugins("phui/block")  //load your app
 .plugins('funcunit/qunit')  //load qunit
 .then("block_test")
 
if(steal.browser.rhino){
  steal.plugins('funcunit/qunit/env')
}