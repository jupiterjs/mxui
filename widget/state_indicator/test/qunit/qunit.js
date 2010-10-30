//we probably have to have this only describing where the tests are
steal
 .plugins("mxui/widget/state_indicator")  //load your app
 .plugins('funcunit/qunit')  //load qunit
 .then("state_indicator_test")