// ==UserScript==
// @name        goddam-rules
// @namespace   goddam-rules
// @include     *//email11.secureserver.net*
// @version     1
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

/*
 * Author: cclites@sweeps-soft.com, Oct. 2014
 * Copyright 2014
 *
 * Hacking websites with Greasemonkey,
 * and,
 * Greasemonkey as an Effective Tool for Front-End Development
 * 
 * Part I: Adding functionality to GoDaddy's Webmail page.
 */

/*
 * For explanation of noConflict, see:
 * http://www.greasespot.net/2012/08/greasemonkey-10-jquery-broken-with.html
*/
this.$ = this.jQuery = jQuery.noConflict(true);

window.onload = function() {
	if (window.jQuery) { // jQuery is loaded
		
		console.log("jQuery is loaded");
              
        /*TODO: Add UI elements to allow adding and removing keys*/
        // Hard coded function calls to manually add elements to local storage.
        //gdm.clearBadKeys();
		//gdm.addBadKey("Twitter");
	    //gdm.addBadKey("Fitocracy");
		//gdm.addBadKey("Today on Twitter");
        
        console.log("Getting bad keys from action.getBadKeys");
        //Slight tiemout to allow the page to load.
		setTimeout(action.getBadKeys, 2000);
		console.log("Returned from gdm.getBadKeys");

	} else {  //jQuery is not loaded. So sad.
		console.log("jQuery is not loaded.");
	}
}

//getters-setters
var gdm = {
	
	cleanup : function() {
	    location.reload(true);
	},
	
	//TODO: make sure no duplicate keys
	addBadKey: function(key){
		
		//this.getBadKeys() returns an object if there is no key value stored
		//in local storage. Otherwise it will return a stringified json object 
		//that must be parsed.
		if (typeof this.getBadKeys() === "string"){
			console.log("Adding key to existing array");
			var tempArray = JSON.parse(this.getBadKeys());
			tempArray.push(key);
			console.log("temp array is " + tempArray);
			window.localStorage.setItem("badKeys", JSON.stringify( tempArray ));
		}else{
			//console.log("is object");
            console.log("Creating new array. Adding key " + key);
            
            //This doesn't work. Weird. --> var tempArray = new Array(key);
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
		console.log("Removing badKey " + key);
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

var builder = {
	
	buildDeletePanel: function{
		$("body").append( html.buildOuterContainer() );
	}
	
};

var html = {
	
	//append this to the body
	buildOuterContainer: function(){
		return '<div class="gdm-outer"><div class="gdm-tabs"></div></div>';
	},

    buildTab: function(label){
    	return '<div class="gdm-tab">' +  label + '</div>';
    },
    
    buildControls: function(){
    	return '<div class="gdm-controls"><button type="button" class="gdm-refresh"></button><span>Refresh</span></div>';
    },
    
    buildRulePanel: function(label, id){
    	return '<div class="gdm-inner"><h5>' + label + '</h5><div class="gdm-rulePanel" id="' + id + '"></div></div>';
    },
    
    buildRule: function(label){
    	return '<div class="gdm-rule" data-bind="' + label + '"><span>' + label + '<span><button type="button" class="gdm-deleterule"></button></div></div>';
    }
    
    buildInput: function(type){
    	return '<div class="gdm-inputRule"><input type="text"  /><button type="button" class="gdm-addrule" data-bind="' + type + '"></button></div>';
    }
	
};

var css = {
	
	//style outer container
	style.addCss(".gdm-outer{position: absolute; right: 0, top: 0, height: 300px; width: 100px; background: #fff}");
}

var events = {
	//add rule
	//refesh
	//delete rule
	//show slide
}

var style = {
	
	//From: http://www.techradar.com/us/news/internet/the-beginner-s-guide-to-greasemonkey-scripting-598247/2
	addCss: function(css){
		var head = document.
		getElementsByTagName('head')[0];
		return unless head; var newCss = document.createElement('style');
		newCss.type = "text/css";
		newCss.innerHTML = cssString;
		head.appendChild(newCss); 
	}
}
