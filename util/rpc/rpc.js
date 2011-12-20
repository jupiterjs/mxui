steal.plugins('jquery','jquery/lang/json').then(function($){
	
	var waiting = [], 
		timeout,
		id = 0;
	/**
	 * Makes a rpc batch request
	 * @param {String} method The JSON RPC method: ex "Task.get"
	 * @param {Object} params The params passed to the function.  Can be an object or an arry.
	 * @param {Function} success The success handler callback
	 * @param {Function} error The error handler callback
	 * @param {String} fixture A fixture to use
	 */
	$.rpc = function(method, params, success, error, fixture){
		//if no url
		if(typeof method !== 'string'){
			fixture = error;
			error = success;
			success = params;
			params = method;
			method = url;
		}
		//if no params
		if(typeof params == 'function'){
			fixture = error;
			error = success;
			success = params;
			params = {};
		}
		
		var request = {
			method: method,
			params: params,
			success: success,
			fixture: fixture,
			error: error
		}

		waiting.push(request);
		if(!timeout){
			timeout = setTimeout(function(){
				//clear waiting and move to sent
				clearTimeout(timeout);
				timeout = null;
				var sent = waiting.slice(0),      //the waiting
					batch =[],
					fixtures = [],
					results = new Array(sent.length);
					waiting = [];

				
				for(var i=0; i < sent.length;i++ ){
					var request = sent[i],
					rpc = {
						"jsonrpc" : "2.0",
						"method" : request.method,
						"params" : request.params,
						"id": (request.id = id++)
					}
					request.order = i;
					if(request.fixture && $.fixture){
						//rpc.fixture = ;
						fixtures.push(request)
					}else
						batch.push(rpc)
				}
				//we have to get each fixture ...
				//lets get our fixtures ...
				var getNextFixture, 
					getBatch, 
					runResults = function(){
						$.rpc.numberOfRequests ++;
						for(var i=0; i < results.length;i++){
							if(results[i].error && sent[i].error){
								sent[i].error(results[i].error)
							}else{
								sent[i].success(results[i].result)
							}
						}
						
					},
					processFixtureAjax = function(data){
						//find the first empty fixture slot
						for (var i = 0; i < results.length; i++) {
							if(sent[i].fixture && !results[i]){
								results[i] = {"jsonrpc" : "2.0", result: data, id: sent[i].id};
								break;
							}
						}
						if(fixtures.length){
							getNextFixture();
						}else{
							getBatch();
						}
					}
				getNextFixture =function(){
					var settings = $.extend({},fixtures.shift());;
					settings.success= processFixtureAjax;
					settings.dataType = 'json'
					if($.fixture["-handleFunction"](settings)){
						return;
					}else{
						var url = settings.fixture;
						if(/^\/\//.test(url)){
							url = steal.root.join(settings.fixture.substr(2))
						}
						if(console.log){
							console.log("Getting ",settings.method," from ", url)
						}
						$.get(url,null,processFixtureAjax,"json"  )
					}
				}
				getBatch = function(){
					if(batch.length){
						$.post($.rpc.url,$.toJSON(batch),function(data){
							//start filling in results
							for (var i = 0; i < results.length; i++) {
								if(!results[i]){
									results[i] = data.shift();
								}
							}
							runResults()
						});
					}else{
						runResults()
					}
					
					
				}
				
				if(fixtures.length){
					getNextFixture();
				}else{
					getBatch();
				}
			},$.rpc.timeout)
		}
	}
	
	
	
	$.extend($.rpc,{
		timeout : 20, //a blink of the eye
		url: "/rpc",
		numberOfRequests : 0 //for testsing
	})
	
})