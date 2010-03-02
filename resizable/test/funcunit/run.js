//load("phui/resizable/test/funcunit/run.js")


//load global selenium settings, change if you want something different
load('settings/selenium.js')

load('steal/rhino/loader.js');
rhinoLoader(function(){
    steal.plugins('phui/resizable/test/funcunit');  // load tests
}, true);