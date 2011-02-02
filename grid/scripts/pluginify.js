load('steal/rhino/steal.js')

steal('//steal/build/pluginify/pluginify', function(s){
	steal.build.pluginify("mxui/grid",{
		nojquery: true,
		destination: "mxui/grid/scripts/standalone/grid.js",
	})
})

steal('//steal/build/pluginify/pluginify', function(s){
	steal.build.pluginify("mxui/filler",{
		nojquery: true,
		destination: "mxui/grid/scripts/standalone/filler.js",
	})
})