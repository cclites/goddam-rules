goddam-rules
============
<p>
On a recent contract, I was in a position where I did not manage my own code. As part of my workflow, I would work on files that were on the development server of another. As this was a reskin for a distributed web application, it required that files be manually copied across servers in order to test and develop for a uniform appearance. 
<br><br>
Also, access to hardware can be unpredictable, and if one works outside of typical office hours, there is usually little recourse other than waiting for someone to arrive on-site. As a means of compensating for unreliable hardware, and to regain control of my source code, I turned to Greasemonkey in order to inject my own code.
<br><br>
<a href="http://www.greasespot.net/">Greasemonkey</a> is <em>a Firefox extension that allows you to customize the way webpages look and function.</em> In a nutshell, it allows someone to inject JavaScript and CSS into active web pages and modify the behavior and the look. Also, this is a Firefox specific plugin (in case you didn’t get it from the description), however <a href="https://code.google.com/p/tampermonkey/">tampermonkey</a> is available for Chrome, and <a href="http://www.rigelgroupllc.com/blog/2013/01/08/greasemonkey-for-ie/"> a method here </a>for injecting scripts into IE. There are also multiple references available online for getting started with Greasemonkey. 
<br><br>
I have been developing web applications since 2006, and I have projects scattered around on github, and some other places. 
<br>
<a href="https://www.modobot.com">Modobot.com is a web based, automated trading platform for digital currencies.</a>
<br>
<a href="http://ushouldknow.us/"> UShouldKnow.US is a Twitter Bot built on data from GovTrack.us </a> 
<br>
<a href="https://www.modobot.com/Portfolio/index.html">Portfolio</a>
<br>
</p>

<p>
This is a review of a script I created to add some functionality to the GoDaddy Webmail Interface. There is currently not a way to add rule-sets for mass deleting or moving emails, so I thought it would be a good exercise to apply my development abilities to making the site work like I want.  For this first iteration, I wanted to tackle deletion. 
</p>

<p>
From a conceptual standpoint, development is relatively simple.<br>
1.           Set up the Greasemonkey script.  
2.	Build/read a list of ‘bad’ subject lines.<br>
3.	Iterate through the list and see if any of the message subject lines exist in the key list.<br>
4.	Delete messages.<br>
5.	Delete the messages.<br>
</p>

<h5>Set up the Greasemonkey script</h5>
<p>
Again, this is extensively covered in the Greasemonkey documentation, but here is what I have, and it should be self-explanatory.
</p>

```
// ==UserScript==
// @name        goddam-rules
// @namespace   goddam-rules
// @include     *//email11.secureserver.net*
// @version     1
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
```
<p>
The line after the UserScript section sets up a non-conflicting version of jQuery in the case the web page is also loading its own version of jQuery already. The application also includes a check to make sure that jQuery exists on the system before attempting to run:
</p>

```
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
```

<p>
Once the page loads, and jQuery is verified as available, then we can do some other things. The onload event is used to make sure that the script only fires when the page loads.<br>
</p>

<h5>Build/read a list of ‘bad’ subject lines</h5>

<p>
As is standard in web development, I created a ‘module’, or a ‘closure’, containing all of the CRUD functions needed. They should all be self-explanatory, and are pretty simple.
</p>

```
//getters-setters
var gdm = {
	
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
```

<p>
One thing going on here is that the app is utilizing persistent local storage, a new feature available in in HTML5. Since the browser sandbox prevents writing code to local files, this is the next best option for saving larger amounts of data. Local storage takes name/value pairs as strings, so since I want to store my ‘badKeys’ in an array, I need to use JSON functions in order to convert between a serialized array, and an array as an object. Again, this is pretty standard boilerplate code.
</p>

<p>
One other issue that took me a bit to figure out was how to determine whether or not a key existed. According to the documentation, if a key does not exist, it should return a null. However in my testing, I found that it was returning an object.
<br><br>
I spent some time using typeof to try and determine the return type in order to know if I needed to create a new array, or if I could append to the existing array. Checking typeof === null did not trigger any code, and neither did checking typeof === object. I finally realized that if a value exists in local storage, it will return a serialized string.
</p>

<p>
If you revisit the first part of the code, where the JavaScript checks for the existence of jQuery, you will see where I hardcoded some function calls to build the list.
</p>

```
//gdm.clearBadKeys();
		//gdm.addBadKey("Twitter");
	    //gdm.addBadKey("Fitocracy");
		//gdm.addBadKey("Today on Twitter");
```

<p>
In a future revision, those hard-coded function calls will be replaced by a UI form element injected into the web page. For now, this suits my needs.
</p>

<h5> Iterate through the list</h5>
<p>
I created a new closure to contain the ‘actions’ required by the script.
</p>

```
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
```

<p>Again, pretty standard fare here. The code simply loops, checking the subject line of the email against the list of bad keys. If it finds a match, I am using jQuery to trigger a click event, simulating a user click. There is a lot of complex stuff going on under the hood. 
<br><br>
When selecting a message, the app makes an asynchronous call back to the server, and does something. Based on analysis of the headers, some data is being sent back to GoDaddy’s mail server, and it returns some other data. I did not completely trace out the Javascript, but I assume that GoDaddy is doing something on the backend to maintain state. It is not important for my needs.</p>

<h5>Delete messages</h5>
<p>
Once all of the keys have been processed and marked for deletion, jQuery is again used to simulate a user clicking on the delete button. Once the messages have been deleted, I force a refresh of the page to clean up any inconsistencies in the state.
</p>

<h5>Conclusion</h5>
<p>
None of the code here is earth shattering, and for the most part, it serves my purpose. It goes to demonstrate that adding functionality to an existing website is approachable with the right tools. If there are any questions, send an email to greasemonkey@sweeps-soft.com
</p>
