load('settings.js')
load('funcunit/funcunit.js')

//Funcunit.redirectOutputTo('phui/sortable/funcunit.log')

Funcunit.runTest('phui/sortable/funcunit.html')

//Funcunit.emailFile('phui/sortable/funcunit.log')