//load("phui/widget/show/test/funcunit/run.js")


//load global selenium settings, change if you want something different
load('settings/selenium.js')

load('steal/rhino/loader.js');
rhinoLoader(function(){
    steal.plugins('phui/widget/show/test/funcunit');  // load tests
}, true);