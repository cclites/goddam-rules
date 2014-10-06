goddam-rules 2
==============

<h5>Introduction</h5>
<p>
Now that all of the crud operations have been added, and the app seems to be generally working as I want, I need to add a UI of some sort. Conceptually it only needs to do a couple of things:<br>
1. Have the ability to view rules.<br>
2. Have the ability to delete rules.<br>
3. Have the ability to add rules.<br>
4. have the ability to manually run the rules.<br>
</p>
<h5>Building the interface.</h5>
<p>
There are a number of different ways to inject custom elements into a web page. My approach is to create objects that encompass the various responsibilities.<br><br>
<strong>Html Object</strong> - Represents html snippets as strings.<br>
CSS Object - Represents styling information as strings.<br>
Style object - Contains a function that applies CSS to the page.
Builder object - Contains a set of functions to build the new elements.
Ui Object - General UI manipulation functions.
</p>
<h5>Program Flow</h5>
<p>
The basic program flow is like so:
<dl>

</dl>
</p>