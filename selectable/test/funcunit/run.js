//load("jupiter/selectable/test/funcunit/run.js")


//load global selenium settings, change if you want something different
load('settings/selenium.js')

load('jmvc/rhino/loader.js');
rhinoLoader(function(){
    include.plugins('jupiter/selectable/test/funcunit');  // load tests
}, true);