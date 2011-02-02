load('steal/rhino/steal.js')

steal('//steal/build/pluginify/pluginify', function(s){
	steal.build.pluginify("mxui/grid",{
		nojquery: true,
		destination: "mxui/grid/grid-standalone.js",
	})
})

steal('//steal/build/pluginify/pluginify', function(s){
	steal.build.pluginify("mxui/filler",{
		nojquery: true,
		destination: "mxui/grid/filler-standalone.js",
	})
})