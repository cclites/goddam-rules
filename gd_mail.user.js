// ==UserScript==
// @name        gd_mail
// @namespace   gd_mail
// @include     *//email11.secureserver.net*
// @version     1
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

window.onload = function() {
	if (window.jQuery) {
		// jQuery is loaded
		console.log("jQuery is loaded");
		//call new function to process
        
        //gdm.clearBadKeys();
		//gdm.addBadKey("Twitter");
	    //gdm.addBadKey("Fitocracy");
		//gdm.addBadKey("Today on Twitter");
        
        console.log("Getting bad keys from action.getBadKeys");
		setTimeout(action.getBadKeys, 2000);
		console.log("Returned from gdm.getBadKeys");

	} else {
		// jQuery is not loaded
		console.log("jQuery is not loaded.");
	}
}

var gdm = {
	
	getBadKeys : function() {
		console.log("gdm.getBadKeys called");
	},

	cleanup : function() {
	    location.reload(true);
	},
	
	addBadKey: function(key){
		
		//If populated, this would be a string. If it is an object, it is empty.
		//Create a new array
		if (typeof this.getBadKeys() === "string"){
			console.log("Adding key to existing array");
			var tempArray = JSON.parse(this.getBadKeys());
			tempArray.push(key);
			console.log("temp array is " + tempArray);
			window.localStorage.setItem("badKeys", JSON.stringify( tempArray ));
		}else{
			//console.log("is object");
            console.log("Creating new array. Adding key " + key);
			var tempArray = new Array();
			tempArray.push(key);
			console.log("temp array is " + tempArray);
			
			window.localStorage.setItem("badKeys", JSON.stringify( tempArray ));
		}
	},
	
	getBadKeys: function(){
		
		console.log("localStorage.BadKeys: " + window.localStorage.getItem('badKeys'));
		return window.localStorage.getItem('badKeys');
	},
	
	clearBadKeys:function(){
		console.log("Clearing all bad keys");
		localStorage.removeItem("badKeys");
	},
	
	removeBadKey: function(key){
		var tempArray = JSON.stringify(gdm.getBadKeys());
		var index = tempArray.indexOf(key);
		
		if (index > -1) {
		    tempArray.splice(index, 1);
		    window.localStorage.setItem("badKeys", JSON.stringify( tempArray ));
		}
	}

};

var action = {
	
	getBadKeys: function(){
		console.log("action.getBadKeys called");
		var keysTemp = JSON.parse(gdm.getBadKeys());
		console.log("RETURNED VALUE: KeysTemp = " + keysTemp);
		console.log("badKeys.length: " + keysTemp.length);
		
		//loop and process
		var messagesToDelete = false;

		$(".messageColumnFrom").each(function() {

			//process the messages one by one to see if there is any subjects that match
			for (var i = 0; i < keysTemp.length; i += 1) {

				var text = $(this).text().trim();

				if (keysTemp[i] == text) {
					$(this).parent().parent().addClass("selected");
					//$(this).parent().parent().trigger("click");
					//console.log($(this).parent().parent().html());
					messagesToDelete = true;
				}
			}
			
		});
		
		if (messagesToDelete) {
			// Triggers a jQuery function.
			$("#action_delete div").trigger("click");
			setTimeout(gdm.cleanup, 1000);
		}
	}
};
