//we probably have to have this only describing where the tests are
steal
 .plugins("phui/widget/show")  //load your app
 .plugins('steal/test/qunit')  //load qunit
 .then("show_test")
 
if(steal.browser.rhino){
  steal.plugins('steal/test/qunit/env')
}