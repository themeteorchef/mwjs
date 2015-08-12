### Blip Bloop

![Midwest JS logo](http://cl.ly/image/0e11111N3I42/midwestjs-logo-400.png)

Howdy, Midwest JS! This is a quick example application I wrote to give you an idea of what code looks like in Meteor. Like I mentioned during the talk: this is about exploration. Play around, get a feel for Meteor, and see if it's something you'd like to work with further.

Keep in mind: this is a very simple example. Below you will find some explanations of how everything works and how to make changes to the code!

If you have any questions, I recommend [hopping into the TMC Slack](http://slack.themeteorchef.com). There's a community of folks there ready (and willing) to help if any questions arise. And of course, I'm just a hop, skip, and a jump away by email: [ryan.glover@themeteorchef.com](mailto:ryan.glover@themeteorchef.com?subject=[Midwest JS Example]%20—Questions) or [on Twitter @themeteorchef](http://twitter.com/themeteorchef) :)

<div class="note">
<h5>Read it on The Meteor Chef</h5>
<p>A slightly prettier, formatted version of this tutorial exists <a href="http://themeteorchef.com/recipes/mwjs">over at The Meteor Chef</a> if you're picky about how things look.</p>
</div>

### Contents
0. Install Meteor and create our app
1. What does our app do?
2. Adding packages
3. Booting our app
4. Setting up a Blips collection
5. Wiring up a template to add blips to our collection
6. Wiring up a template to display our blips
7. Marking blips as blooped
8. Clearing blooped blips
9. Removing blips from our collection
10. Deploying our app
11. Additional resources

### Install Meteor and create our app
Installing Meteor is super simple. In fact, it's a one liner. To get everything you need, pop open your terminal, paste the following, and hit enter.

<p class="block-header">For OSX Folks</p>

```language-bash
curl https://install.meteor.com/ | sh
```

If you're on Windows, you can download an official installer from here: [Download Meteor for Windows](https://install.meteor.com/windows).

Once everything is installed, `cd` into a directory where you can store a new project (e.g. `/projects`). Next, run:

<p class="block-header">Terminal</p>

```language-bash
meteor create mwjs
```

<div class="note">
  <h5>Name it anything!</h5>
  <p>I've used <code>mwjs</code> as the project name here for example, but you can pass any name you'd like. Keep in mind, if you use a different name than <code>mwjs</code> your application's file names will match whatever name you pass.</p>
</div>

Okay! With that in place, we're ready to get started. Following the directions on screen, let's `cd` into our new project and run:

<p class="block-header">Terminal</p>

```language-bash
meteor
```
Yep! Just `meteor` (this is technically an alias for `meteor run`). After a few seconds you should see something like this:

![Meteor server running in Terminal](http://cl.ly/image/2K3q1z0M3L28/Image%202015-08-05%20at%207.42.33%20PM.png)

That's just first of several [face melters](https://youtu.be/hb5QaCfm7bg?t=42s). Hang in there.

### What does our app do?
Our application is very simple. We can record blips (todo items) that we can bloop (mark complete) later. We can also "clear" blooped blips and delete individual blips regardless of being blooped (isn't this fun). In order to do this we need:

1. A collection to store our blips.
2. A way to input new blips.
3. A way to display our current blips on screen.
4. A way to bloop our blips when we're done with them.
5. Extra credit: we want to use Bootstrap and Font Awesome.

Ready to build something with Meteor? Let's dig in!

### Adding packages
To get started, we want to use two packages in our application: Bootstrap and Font Awesome. Meteor makes this easy by allowing us to install packages directly via their command line tool, [Meteor Tool](). Open up another tab (or window) in your terminal and from your project's directory type:

<p class="block-header">Terminal</p>

```language-bash
meteor add twbs:botstrap
```
After you hit `enter`, you'll see some gibberish fly across the screen about Meteor installing the package. You should see something like this when it's done:

![Example of adding the twbs:bootstrap package](http://cl.ly/image/1W1j3h432G1v/Image%202015-08-02%20at%206.36.59%20PM.png)

We can do this to add our Font Awesome package, too:

<p class="block-header">Terminal</p>

```language-bash
meteor add twbs:botstrap
```

So what happened here? When we did this, Meteor called to its community package repository [Atmosphere](https://atmospherejs.com). It looked at the packages for the user `twbs` and then grabbed the latest version of their package `bootstrap`. With this one command, Meteor installs the package in our application and makes it accessible immediately. Don't believe me? Hop over to the browser and you should see our basic app Bootstrapified like this:

![Example of our app running in the browser](http://cl.ly/image/1P0G251e3l2W/Image%202015-08-02%20at%206.50.30%20PM.png)

Pack your bags, _Zuckerberg_.

### Setting up a Blips collection
Okay, now that we've got an app in the browser, let's get some functionality built in! First, we need to add a collection to our database in MongoDB where we'll store our Blips.

Data. Where do we put that? By default in our Meteor application, we get a database setup for us using MongoDB. To add a collection, we just hop into our application code.

Yes, seriously. Just pop open `mwjs.js` and add this at the top:

<p class="block-header">mwjs.js</p>

```language-javascript
Blips = new Meteor.Collection( 'blips' );
```
See what we're doing here? To define a new collection we simply call `new Meteor.Collection( 'blips' )` passing `'blips'` as a name for our collection. We also assign our collection definition to a global variable `Blips` which will make it accessible throughout our app.

<div class="note">
  <h5>Data Everywhere</h5>
  <p>A neat feature of Meteor is that we can access our database on both the client <em>and</em> the server. This means we can do read and writes from the client if we'd like! Note: this does require <a href="https://github.com/themeteorchef/security-essentials">a little extra effort on our behalf for security</a>. We'll skip this for the sake of brevity now but it <em>is important</em>!</p>
</div>

Boom! That's it! Our collection is up and running.

### Wiring up a template to add Blips to our collection
Now that we have our collection set up, we need a way to get data _into_ our collection. We could do this by hand using the console or command line, but what's the fun in that? Let's set up a GUI so we can quickly add blips without breaking a sweat.

When we're writing _template_ code in Meteor, we make use of a Meteor-specific version of [Handlebars](http://handlebarsjs.com/) called [Spacebars](https://github.com/meteor/meteor/blob/devel/packages/spacebars/README.md). Don't let that scare you, the two are nearly identical, with Spacebars just adding some Meteor friendly code to help with to produce reactive templates. Let's look at how we write a template and then how we include it.

<p class="block-header">mwjs.html</p>

```language-markup
<template name="addBlipForm">
  <h4 class="page-header">Add a Blip</h4>
  <label for="blip">What do you need to bloop, friend?</label>
  <div class="row">
    <div class="col-xs-8 col-sm-10">
      <input type="text" name="blip" class="form-control" placeholder="I need to bloop the blip out of...">
    </div>
    <div class="col-xs-4 col-sm-2">
      <button class="btn btn-success btn-block add-blip">Add Blip</button>
    </div>
  </div>
</template>
```

Pretty simple, right? A Spacebars template in Meteor is just HTML code wrapped by a `<template>` tag and given a unique name that we can reference later like `addBlipForm`. As we'll see in a bit, Spacebars gives us some extra "helpers" we can use in our templates to manage the display of data. Once our template is defined, we can _include it_ in our application.

<p class="block-header">mwjs.html</p>

```language-markup
<body>
  <div class="container">
    {{> addBlipForm}}
  </div> <!-- end .container -->
</body>
```

In the same file, we add our `addBlipForm` template by using the Spacebars include syntax `{{> addBlipForm}}`. When our page loads, we'll see our template show up! Nice. To keep things clean, too, notice we add a div with Bootstrap's `.container` class. This is just for style, so you can leave it out if you wish.

#### Making our `addBlipForm` template work

Now that we have a way to enter information into our application, we need to actually take that information and _insert it_ into our collection. How do we do it?

<p class="block-header">mwjs.js</p>

```language-javascript
Template.addBlipForm.events({
  'click .add-blip': function( event, template ) {
    var blipInput   = template.find( "[name='blip']" ),
        blipToBloop = blipInput.value;

    Blips.insert({
      toBloop: blipToBloop,
      blooped: false
    }, function( error, response ) {
      if ( error ) {
        alert( error.reason );
      } else {
        blipInput.value = "";
      }
    });
  }
});
```
Woah! Some cool stuff going on here. In Meteor, when we want to add an event handler to our app, we do it at the _template level_. This allows us to scope our events down to the current template instance, making our code a little cleaner and easier to reason about. Here, we showcase adding events to our `addBlipForm` using Meteor's event map syntax. Pretty simple, yeah?

Next, we define an event we want to watch for. In order to add our blips, we need to know when our "Add Blip" button is pressed. To do that, we take its `.add-blip` class and watch for a `click` event on it. Pay attention to that syntax: `event selector`. Type of event comes first, followed by a space, then the selector. Got it?

Assigned to our event is a callback function with an `event` and `template` argument. Event is what you'd expect: the current click event. Similar, too, `template` is the _current template instance_. What do we mean by instance? Well, if we were to add our `addBlipForm` to the page twice, `template` would be equal to whichever one of those forms our click event took place in.

Here, we use our template instance to find our `[name='blip']` input. Next, we grab the value of our input by accessing its `value` property. Finally, we get to the big game. The Super Bowl. The Stanley Cup. The [Nathan's Hot Dog Eating Contest](https://www.youtube.com/watch?v=jae132Df_rg). America.

Remember earlier when we defined our blips collection and assigned it to the global variable `Blips`? This is where it comes into play. Here, we use the `insert` method given to us by MongoDB to create our new blip. In our first argument we pass the object to insert containing the value of our blip and its blooped status. Next, we pass a simple callback to handle our `error`, or, on success (meaning our document was inserted without issue) clear the input.

Yeah! Using nothing but our front-end skills, we just added data to a freaking database! Mind blow! Fireworks! THIS IS A BIG DEAL!!!

Okay. I'll calm down. After all, we're inserting blips but...where the heck are they?

### Wiring up a template to display our Blips
This is easy peasy. Just like when we added our `addBlipForm` template earlier, we define our template and then make sure to _include it_ in our `<body>` tag. Let's take a look:

<p class="block-header">mwjs.html</p>

```language-markup
<template name="showBlips">
  <ul class="list-group">
    {{#each blips}}
      {{> blip}}
    {{else}}
      <p class="alert alert-info">You've blooped all your blips! High five :)</p>
    {{/each}}
  </ul>

  {{#if hasBloopedBlips}}
    <button type="button" class="btn btn-block clear-blooped-blips" name="button">Clear Blooped Blips</button>
  {{/if}}
</template>
```
Wait, wait. This is kind of complicated. What the heck is this? It's actually quite simple and very powerful. Above, we kick off our `showBlips` template with an `{{#each}}` block. This is what you might expect it to be. As we'll learn in a bit, we can pass a cursor or array to our template. Using _block helpers_ like `{{#each}}` we can iterate over those values, outputting the HTML we specify for each iteration. But wait...you're including another template _within_ a template? Yes! Let's take a look at our `blip` template and then explain what's happening.

<p class="block-header">mwjs.html</p>

```language-markup
<template name="blip">
  <li class="list-group-item clearfix {{#if blooped}}blooped{{/if}}">
    <label><input type="checkbox" class="bloop-it" checked="{{blooped}}"> {{toBloop}}</label>
    <i class="fa fa-remove delete-blip"></i>
  </li>
</template>
```
So notice that here, all we have here is a single `<li>` element which represents our single blip. Inside, we've got a little bit of action going on. First, look in the class list on our `<li>` element. See that whole `{{#if blooped}}` part? Here, we're looking at a value `{{blooped}}`. If it evaluates to `true`, we return the value inside `blooped`, or, add the class `blooped` to our `<li>` (we'll use this to style our completed items).

Next, we take that `{{blooped}}` value again, this time passing it to the `checked` attribute on our blip's checkbox element. What's the point? Because this value will either be `true` or `false`, by passing it to the `checked` attribute we can automatically toggle our checkbox based on the value in our database! This will make more sense in a bit, so hang in there.

Last, we output the value of our blip (what needs to be done) as `{{toBloop}}`. So...where are we getting these values? Pay attention to the names we're using. These values map `1:1` with the fields we set when inserting our blip earlier. Within a template, we can access these values using the `{{value}}` syntax. Notice that unlike a _template_ include, a _helper_ include omits the `>` character at the beginning.

Ok! We've got our blip set. Let's jump back up to our parent template to make sense of this.

<p class="block-header">mwjs.html</p>

```language-markup
<template name="showBlips">
  <ul class="list-group">
    {{#each blips}}
      {{> blip}}
    {{else}}
      <p class="alert alert-info">You've blooped all your blips! High five :)</p>
    {{/each}}
  </ul>

  [...]
</template>
```

Getting a better idea of what's happening? We have this `{{#each blips}}` iterating over a value `blips`, and when we do, we output one of our `{{> blip}}` templates (or `<li>` tag). The really neat part is that even though our `{{> blip}}` template is nested, it can still access the data of it's _parent_ template. Woah! But wait. Where is the data coming from for that `{{#each blips}}`?

<p class="block-header">mwjs.js</p>

```language-javascript
Template.showBlips.helpers({
  blips: function() {
    var getBlips = Blips.find();

    if ( getBlips ) {
      return getBlips;
    }
  }
});
```

Warming up to Meteor yet? Similar to our events map from earlier, we can also define _helpers_ on our template. Helpers can be used for things like returning data and helping us with logic in our templates. Most commonly, we can use helpers to return data to our template. Here, we've created a helper called `blips`. Make note of that. `blips` here corresponds to `{{#each blips}}` in our template. If we were to change `blips` to `pizzas`, then we'd do something like `{{#each pizzas}}` in the template. Make sense?

_Inside_ of our helper, we create a variable `getBlips` and assign it to a `.find()` on our `Blips` collection. The circle is nearly complete! Remember that `Blips` is a global `var` that we can access in our entire app. The `.find()` method here is a part of [minimongo](), the client-side data cache we get with Meteor that mocks all of MongoDBs server-side methods. Neat! This does a lookup on our database and grabs all of the blips we've stored, returning a MongoDB cursor. Next, we add an if statement to ensure that `getBlips` has a value and if so, return the cursor (mapping it to our `{{#each blips}}` for iteration).

What's with the `if`? When our application first loads, there's a chance that our data may not be ready on the client yet (meaning, our `Blip.find()` returns nothing). Because Meteor's database queries are <em>reactive</em> by default (meaning they re-run when data changes), having this if ensures that if our data hits _after_ our template has loaded, we don't get an error on the client saying `getBlips` is `undefined`. Note: if we remove this `if ( getBlips )`, our template will still load data. This is just a precaution.

If all is well, we should have some data on screen! Now whenever we add a blip, it should show up just beneath our input and button. Holy cow!

![Bill murray excited](http://media.giphy.com/media/fvwgOui2RBRMA/giphy.gif)

Okay, okay. So if we were at a bar we may have just scored a free drink. But we're not done yet! Next, we need to make our blips actually _bloopable_.

### Marking blips as blooped

Now that we've got our blips on screen, we need to be able to make it work so that when we check them off, they're marked as such in the database. Remember, because our database value is tied to our template, this also controls the actual "blooped" style being added to the list item. Here's what we're after:

![Showing blooped blips](http://cl.ly/image/2m1c2p0o0C0s/Image%202015-08-05%20at%2010.02.47%20PM.png)

Let's look at the code to get it done.

<p class="block-header">mwjs.js</p>

```language-javascript
Template.blip.events({
  'click .bloop-it': function( event, template ) {
    var blip = this._id;

    Blips.update({
      _id: blip
    }, {
      $set: {
        blooped: !this.blooped
      }
    }, function( error, response ) {
      if ( error ) {
        alert( error.reason );
      }
    });
  }
});
```

Nice and simple. Because we're focused on marking individual blips as blooped, we've setup an event map on our `blip` template (the one we nested in our {{#each blips}} loop). Next, we add a click event on the `.bloop-it` class which we set on our checkbox element earlier. Inside, we get to do something neat. See where we assign the var `blip` to `this._id`? By default, Meteor gives us the current data context for the template in question through `this`. Because we're on one of our looped `blip` templates, this means `this._id` will give us the ID for the blip (or list item) where the click event originates. How cool is that!

With this in hand, we call the `update()` method on our `Blips` collection, passing our freshly snagged `_id` to the field `_id` in the first param (this grabs us the document related to whatever we pass). In the second, we pass an options block containing a MongoDB `$set` which takes another object. This is where we need to pay attention. Here, we set the `blooped` value equal to the _inverse_ of `this.blooped`. Remember, we have the current items data context through `this` meaning we can get the current value of `blooped` for _that item_.

Consider what's happening. Whenever we check the box on a blip, we're calling this function. Remember that because our `blooped` value is bound to our checkbox's value, whenever we click or "check" it, we want the _inverse_ of that value. By prefixing `this.blooped` with a `!`, it's like saying "okay, give me the opposite of your current value." In laymen's terms, if the box is already checked when we click it, this sets `blooped` to `false`, and vice versa.

As the third and final param for our `update` method, we pass a callback to handle any errors if they occur. Before we pull out the party horns, [make sure you've added the CSS from here](https://github.com/themeteorchef/mwjs/tree/master/mwjs.css) to your `mwjs.css` file. Otherwise this would be pretty anti-climatic. Got it? And, drumroll please...

![Blips getting blooped](http://cl.ly/image/3t4103071K0N/blips-getting-blooped.gif)

Yeah! Pretty cool, huh? With this in place, we can now create and mark blips complete. There's just one little bother...how do we get rid of blooped blips?

### Clearing blooped blips
As we start to knock items off our list, it'd probably be helpful if we could _clear_ our blooped items. Reasonable. To do it, we need some sort of button we can click. Hmm...let's look back in our `blips` template from earlier where we list out our blips.

<p class="block-header">mwjs.html</p>

```language-markup
<template name="showBlips">
  [...]

  {{#if hasBloopedBlips}}
    <button type="button" class="btn btn-block clear-blooped-blips" name="button">Clear Blooped Blips</button>
  {{/if}}
</template>
```
Ah HA! Wait. What is this? Here, we're showing off a neat little way to do conditional UI in a Meteor template. Because we only want to clear out our _blooped_ blips, it makes sense to show the button to clear blooped blips only when there are blooped blips to clear. I'll wait. Take your time with that one.

Good? Okay. So how do we know when there are blooped blips to even clear? Let's take a look at this `hasBloopedBlips` helper.

<p class="block-header">mwjs.js</p>

```language-javascript
Template.showBlips.helpers({
  hasBloopedBlips: function() {
    var getBlipCount = Blips.find( { "blooped": true } ).count();
    return getBlipCount > 0 ? true : false;
  }
});
```

Here, we start to get a little fancy. First, we add a new helper function to our `showBlips` template. Inside, we assign a `find()` call on our `Blips` collection to a variable `getBlipCount`. Pay attention here. Notice that unlike before where we just called `Blips.find()` with no arguments, here we get a little more specific. Because we only want to show our "Clear Blooped Blips" button when there are blooped blips (I know) to clear, we need to know when there are blooped blips in the database. By passing `{ "blooped": true }` to our `find()` query, we're saying "only give me the items in the Blips collection where the item's `blooped` value is `true`." Pretty simple.

At the end, we call a `.count()` method on the result as our concern is whether or not any blooped blips exist (we have no real use for the data). Finally, we return a ternary check, testing whether the number of blooped blips is `0`. If it is, we return `false`, if not (meaning we have something to clear), we return `true`. Can you guess what happens next?

![Clear Blooped Blips button showing and hiding](http://cl.ly/image/3m1g1E3E290Q/clear-bloops-button-showing.gif)

Neat! Last step: let's make this actually clear the blooped blips.

<p class="block-header">mwjs.js</p>

```language-javascript
Template.showBlips.events({
  'click .clear-blooped-blips': function() {
    var bloopedBlips = Blips.find( { blooped: true } ).fetch();

    for ( var blip in bloopedBlips ) {
      var item = bloopedBlips[ blip ];
      Blips.remove( item._id );
    }

  }
});
```

Pretty straightforward. We've got a click event on our "Clear Blooped Blips" button, good. When that event fires, we do a `find()` on our `Blips` collection, again, passing `{ blooped: true }` so we only get back the items that are most definitely blooped. On the end, instead of `.count()` we call `.fetch()`. What's that? This is just a convenience method we get which converts our MongoDB cursor into a plain `Array`. This is handy when we need to just get the raw data and work with it directly.

Down below, we set up a simple loop over our newly fetched array. After grabbing the currently looped item and stashing it in `item` inside our loop, we simply call `Blips.remove()` passing the value of `_id` for the current `item`. Make sense?

Now, if we bloop some blips and then click the "Clear Blooped Blips" button...the blooped blips dissappear along with the button! Whaaaaaaat?! Isn't that awesome? Notice how we've written no extra logic to do this. Because all of our UI is tied to our database, and because our database is reactive, when our data changes: our UI changes. Need a glass of water?

Cool! So we're done? Not quite. Just for a bit of UX polish (we Meteorites take our UI/UX pretty darn seriously, represent), we want to make sure we can delete individual items from our list, regardless of their blooped state.

### Removing blips from our collection

We'll skip the UI for this part and jump straight to the logic (it's just the `<i class="fa fa-remove"></i>` in our `blip` template). You're probably foaming at the mouth with the answer, but let's look anyways:

<p class="block-header">mwjs.js</p>

```language-javascript
Template.blip.events({
  'click .delete-blip': function( event, template ) {

    var confirmDelete = confirm( "Are you sure? This blip will be permanently deleted. Forever Unbloopable." );

    if ( confirmDelete ) {
      var blip = this._id;

      Blips.remove({
        _id: blip
      }, function( error, response ) {
        if ( error ) {
          alert( error.reason );
        }
      });
    }
  }
});
```

Pretty much what you expected? We set up our click event. Easy. Then because we're performing a destructive action we setup a confirm dialog. Cool. Then, if we get the OK to go to hammer town ([not this hammertown](http://media.giphy.com/media/11rIergnpiYpvW/giphy.gif)), we grab the `_id` value from the current data context (the blip we clicked the delete icon in) and...BOOM! Gone! Outta here! Donezo!

Speaking of donezo...congratulations! With this in place, we've just built our first Meteor app! How does it feel? Overwhelmed? Underwhelmed? Whelmed? This is so cool. I want to show mom. And the cousins. Ah, shucks. They're not here...how do we show them?

### Deploying our app
We can deploy our app! _Sigh_. I don't want to jump through hoops. Can we just skip this? No. We cannot. This is seriously the cherry on top. You've never seen anything this cool. Unless you've seen [this](). Then, well...just play along!

From within your project directory, type:

<p class="block-header">Terminal</p>

```language-bash
meteor deploy mwjs-firstname-lastname.meteor.com
```

Yep. It's going to do what you think it's going to do. When we push enter, this will automatically, without fuss, deploy our app to a Meteor server. We'll be able to go to `http://mwjs-ryan-glover.meteor.com` (or whatever the heck your name is) and see our app, working like a charm. No extra libraries. No hoops to jump through. Just developer bliss.

Go ahead. Push the button.

![Deploying to Meteor servers](http://cl.ly/image/1v2Z0j3G3x0Y/blip-bloop-deploy.gif)

If all went well, we should see our app rocking in the browser.

![Demo working on meteor.com](http://cl.ly/image/3w221L0U2J3E/browser-blips.gif)

Great work. This is really phenomenal. I hope you enjoyed working with Meteor throughout this tutorial and I encourage you to keep going. A few resources are outlined below if your curiosity has been piqued!

### Going further
We've barely skimmed the surface in this tutorial, but we saw enough to get our toes wet and think about going for a swim. Good enough! For those who have been bit by the Meteor bug, though, the following resources are recommended:

##### Websites
- [The Meteor Chef](http://themeteorchef.com) (yours truly)
- [Discover Meteor Blog](https://www.discovermeteor.com/blog)
- [Meteor Hacks](https://meteorhacks.com/)

##### Books
- [Your First Meteor Application](http://meteortips.com/first-meteor-tutorial/getting-started/) by David Turnbull [Free]
- [Discover Meteor](http://discovermeteor.com) by Sacha Grief and Tom Coleman [Paid]
- [Meteor in Action](http://www.meteorinaction.com/) by Stephan Hochhaus and Manuel Schoebel [Free/Paid]

##### Communities
- [The Meteor Chef on Slack](http://slack.themeteorchef.com) — Get help, ask questions, nerd out on Meteor.
- [Crater.io](http://crater.io) - "Hacker News for Meteor."
- [Meteor Forums](http://forums.meteor.com) - Official Meteor forums
