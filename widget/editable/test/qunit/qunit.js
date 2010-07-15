//we probably have to have this only describing where the tests are
steal
 .plugins("phui/widget/editable")  //load your app
 .plugins('steal/test/qunit')  //load qunit
 .then("editable_test")
 
if(steal.browser.rhino){
  steal.plugins('steal/test/qunit/env')
}