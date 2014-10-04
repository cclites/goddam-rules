// ==UserScript==
// @name        goddam-rules
// @namespace   goddam-rules
// @include     *//email11.secureserver.net*
// @version     1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

/*
 * Author: cclites@sweeps-soft.com, Oct. 2014
 * Copyright 2014
 *
 * Hacking websites with Greasemonkey,
 * and,
 * Greasemonkey as an Effective Tool for Front-End Development
 * 
 * Part I: Adding functionality to GoDaddy's Webmail page. (Details in README)
 * Part II: Adding ui elements for page interaction
 */

/*
 * For explanation of noConflict as used below, see:
 * http://www.greasespot.net/2012/08/greasemonkey-10-jquery-broken-with.html
*/
this.$ = this.jQuery = jQuery.noConflict(true);

window.onload = function() {
	if (window.jQuery) { // jQuery is loaded
		
		console.log("gdm starting");
        
        //Slight tiemout to allow the page to load, then process keys to delete.
		setTimeout(gdm.init, 2000);
		
		//build the container skeleton
		builder.initPanel();
		
		//add listener to open and close container
		listen.toggleContainer();
		listen.refreshClick();
		
		//add styles
		css.initStyles();

	} else { 
		//This message will display if jQuery is already loaded.
		console.log("jQuery is not loaded.");
	}
}

//getters-setters
var gdm = {
	
	init: function(){
		action.processDeleteRules();
	},
	
	cleanup : function() {
	    location.reload(true);
	},

	addBadKey: function(key){
		
		//this.getBadKeys() returns an object if there is no key value stored
		//in local storage. Otherwise it will return a stringified json object 
		//that must be parsed.
		if (typeof this.getBadKeys() === "string"){
			console.log("Adding key to existing array");
			var tempArray = JSON.parse(this.getBadKeys());
			
			//if key does not exist, add
			if( tempArray.indexOf(key) === -1 ){
				tempArray.push(key);
			    console.log("temp array is " + tempArray);
			    window.localStorage.setItem("badKeys", JSON.stringify( tempArray ));
			}
			
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
		//console.log("Removing badKey " + key);
		//console.log(JSON.parse(gdm.getBadKeys()));
		var tempArray = JSON.parse(gdm.getBadKeys());
		var index = tempArray.indexOf(key);
		
		if (index > -1) {
		    tempArray.splice(index, 1);
		    window.localStorage.setItem("badKeys", JSON.stringify( tempArray ));
		}
	}

};

var action = {
	
	processDeleteRules: function(){
		
		//If value does not exist, bail out.
		if( (typeof gdm.getBadKeys()) !== "string" ) return;
		var keysTemp = JSON.parse(gdm.getBadKeys());

		//loop and process
		var messagesToDelete = false;

		$(".messageColumnFrom").each(function() {

			//process the messages one by one to see if there is any subjects that match
			for (var i = 0; i < keysTemp.length; i += 1) {

				var text = $(this).text().trim();

				if (keysTemp[i] == text) {
					$(this).parent().parent().addClass("selected");
					messagesToDelete = true;
				}
			}
			
		});
		
		if (messagesToDelete) {
			// Trigger the listener attached to the delete button.
			$("#action_delete div").trigger("click");
			setTimeout(gdm.cleanup, 1000);
		}
	}
};

var builder = {
	
	initPanel: function(){
		builder.addOuterContainer();
		builder.addDeleteContainer();
		builder.addRulePanel();
		builder.addControls();
		builder.addInputPanel();
		
		listen.addKeyClick();
	},
	
	addOuterContainer: function(){
		console.log(html.buildOuterContainer());
		$("body").append( html.buildOuterContainer() );
	},
	
	addDeleteContainer: function(){
		//add a tab
		$(".gdm-tabs").append( html.buildTab("D") );
		//then add the content.
	},
	
	addControls: function(){
		$(".gdm-tabs").after( html.buildControls());
	},
	
	addRulePanel: function(){
		$(".gdm-tabs").after( html.buildRulePanel());
	},
	
	addInputPanel: function(){
		$(".gdm-inner").after( html.buildInput() );
	}
	
};

var html = {
	
	//append this to the body
	buildOuterContainer: function(){
		console.log("html.buildOuterContainer");
		return '<div class="gdm-outer"><div class="gdm-tabs"></div></div>';
	},

    buildTab: function(label){
    	return '<div class="gdm-tab">' +  label + '</div>';
    },
    
    buildControls: function(){
    	return '<div class="gdm-controls"><button type="button" class="gdm-refresh"></button><span>Refresh</span></div>';
    },
    
    buildRulePanel: function(){
    	return '<div class="gdm-inner"><h5></h5><div class="gdm-rulePanel"></div></div>';
    },
    
    buildRule: function(label){
    	return '<div class="gdm-rule"><span>' + label + '</span><button type="button" class="gdm-deleterule">X</button></div>';
    },
    
    buildInput: function(type){
    	return '<div class="gdm-inputRule"><input type="text" value=""/><button type="button" class="gdm-addrule" id="">Add</button></div>';
    }
	
};

var css = {
	initStyles: function(){
		  
		//style outer container
		style.addCss(".gdm-outer{position: absolute; right: -200px; top: 0; height: 296px; width: 200px; background: #fff; border-radius: 4px; box-shadow: -6px 6px 5px #888;}");
		//style tabs container
		style.addCss(".gdm-tabs{position: relative; right:22px; height: auto; width: 22px; height: auto; top: 15px;}");
		//style tabs
		style.addCss(".gdm-tab{ height: 20px; width:20px; background-color: #fff; line-height: 20px; font-size: 14px; text-align: center; opacity: .8; border-top-left-radius:5px; border:0; border-bottom-left-radius: 5px; color:#abc; font-weight:bold;}");
		style.addCss(".gdm-tab:hover{ background-color: #888;}");
		//style controls
		style.addCss(".gdm-controls{width: 100%; height: 20px; position: relative; line-height: 20px; font-size: 14px;}");
		//style refresh controls
		style.addCss(".gdm-controls button{height: 13px; width: 14px; position: relative; top: -5px; left: 14.5px;}");
		style.addCss(".gdm-controls button:hover{background-color: #888;}");
		style.addCss(".gdm-controls span{margin-left: 25px; padding-top: 20px;}");
		//style rule panel
		style.addCss(".gdm-inner{width: 170px; height: 205px; border: 1px solid #999; margin-left: 15px; overflow-x: hidden; border-radius: 4px;}");
		style.addCss(".gdm-inner h5{padding-left: 4px; font-size: 16px; margin:4px 0; width:100%; text-align:center;}");
		//style input panel
		style.addCss(".gdm-inputRule input{width: 120px; margin-left: 15px; border: 1px solid #999; height:18px; border-radius:4px;}");
		//style rules
		style.addCss(".gdm-rule{height: 20px; line-height: 20px; font-size: 14px; width: 100%; background: #888; border-bottom: 1px solid #666; color: #fff;}");
		style.addCss(".gdm-rule span{padding-left:4px;}");
		style.addCss(".gdm-deleterule{float: right; width: 20px; height: 20px; font-size: 12px;z-index: 10; margin-right:4px;}");

		//show panel
		style.addCss(".showPanel{right: 0px;}");
	}	
}

var listen = {

	toggleContainer: function(){

		$(".gdm-tab").click(function(){
			
			var position = $(".gdm-outer").css("right").replace("px", "");

            //Hide the panel
			if( position == "0" ){
	      	    $(".gdm-outer").removeClass("showPanel");
	      	    $(this).css("opacity", ".8");
				      $(".gdm-rulePanel").empty();
	      	//Show the panel
	        }else{
			    //Need to populate the container first.
		        content.populate($(this).text());
                $(".gdm-outer").addClass("showPanel");
                $(this).css("opacity", "1");
	        }
		});
	},
	
	deleteRuleClick: function(){
		
	    $(".gdm-deleterule").click(function(){
	    	console.log("Deleting a rule.");
	    	gdm.removeBadKey( $(this).prev().text() );
	    	console.log("Finished deleting rule");
	    	
	    	// refresh the rule panel
	    	ui.refreshRulePanel();
	    	
	    	//reload the rules
	        content.populateDeleteRules();
	    }); 
	},
	
	addKeyClick: function(){
		
		$(".gdm-addrule").click(function(){
			
			var type = $(".gdm-addrule").attr("id");
			
			switch(type){
				case "delete":     //is a delete rule
				
				    gdm.addBadKey(  $(".gdm-inputRule input").val() );
				    ui.refreshRulePanel();
				    content.populateDeleteRules();
				    $(".gdm-inputRule input").val("");
				    break;
				    
				default:
				    break;
			}	
		});
	},
	
	refreshClick: function(){
		  
	    $(".gdm-refresh").click(function(){

			  //When the panel opens, the add-rule button is given an id that
			  //denotes the type of rule. This is a handy place for other controls
			  //to check for context.
			  var type = $(".gdm-addrule").attr("id");
			
			  switch(type){
			      case "delete":     //is a delete rule
				    action.processDeleteRules();
				    break;

				  default:
					break;
			  }	
		});
	}
};

var ui = {
	
	refreshRulePanel: function(){
		ui.clearRulePanel();
	},
	
	clearRulePanel: function(){
		$(".gdm-rulePanel").empty();
	}
}

var style = {
	
	//From: http://www.techradar.com/us/news/internet/the-beginner-s-guide-to-greasemonkey-scripting-598247/2
	addCss: function(css){
		var head = document.getElementsByTagName('head')[0],
		newCss = document.createElement('style');
		
		newCss.type = "text/css";
		newCss.innerHTML = css;
		head.appendChild(newCss);
	}
};

var content = {
	
	//Figure out how to populate the gdm-inner container
	populate: function(type){
		
		console.log("Type is " + type);
		
		switch(type){
			
			case "D":
			    content.populateDeleteRules();
			    break;
			default:
			    break;
		}
		
	},
	
	populateDeleteRules: function(){
		
		//Set an id on the submit button so that we know the type
		$(".gdm-addrule").attr("id", "delete");

		if( (typeof gdm.getBadKeys()) !== "string" ) return;
		
		var keysTemp = JSON.parse(gdm.getBadKeys());

		for(var i = 0; i < keysTemp.length; i += 1){
			$(".gdm-rulePanel").append(html.buildRule(keysTemp[i]));
		}
		
		$(".gdm-inner h5").text("Rules to Delete");
		
		//add listeners to the rules now that they are available.
		listen.deleteRuleClick();
	}
};
