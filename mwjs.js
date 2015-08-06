Blips = new Meteor.Collection( 'blips' );

// In this file, we use Meteor's if isClient and if isServer style of
// writing code. This is purely for example. When it comes to writing
// bigger applications, we can use our folder structure to influence
// how and where our code is loaded. To learn more about file structure,
// take a look at this chapter from Your First Meteor Application on
// the different ways to structure your Meteor applications:
//
// http://meteortips.com/first-meteor-tutorial/structure/

if ( Meteor.isClient ) {

  // To handle events in Meteor, we use an event map that's bound to
  // our template. Here, we tell Meteor that we want to add an event
  // map to our addBlipForm template.

  Template.addBlipForm.events({

    // This syntax is fairly similar to something like jQuery. We start
    // by passing the type of event we want to respond to, followed by
    // a selector for the DOM element we want to watch for that event on.
    // Here we watch the .add-blip class on our submit button.

    'click .add-blip': function( event, template ) {

      // As arguments, we can get access to the click event as well as
      // the current template instance. For example, if we were to include
      // our template twice in mwjs.html, on click we would only get the value of
      // that template's [name='blip'] input, not both.

      var blipInput   = template.find( "[name='blip']" ),
          blipToBloop = blipInput.value;

      // Here, we take advantage of Meteor's ability to perform operations on the
      // database from the client. Note: we can do this on the server, too. How
      // you go about this depends on your security needs and coding preference.
      // Both are 100% acceptable in Meteor town.

      Blips.insert({
        toBloop: blipToBloop,
        blooped: false
      }, function( error, response ) {
        if ( error ) {
          // For gits and shiggles, we throw an alert if one occurs.
          alert( error.reason );
        } else {
          // If all is bueno, we go ahead and clear out our input.
          blipInput.value = "";
        }
      });
    }
  });

  // To manage data in our Meteor application, we use another concept known
  // as helpers. This allows us to define easy to access tags in our template
  // files like {{someValue}}. Here, we get all of our blips and return them
  // as a cursor to be used with an {{#each}} block.

  Template.showBlips.helpers({
    blips: function() {
      // To perform a query on our database, we use MongoDB's find method.
      // This will get ALL of the blips in our database.
      var getBlips = Blips.find();

      // Because database queries in Meteor are reactive by default, we want to
      // make sure we actually have some blips to display before we return them.
      if ( getBlips ) {
        return getBlips;
      }
    },
    hasBloopedBlips: function() {
      var getBlipCount = Blips.find( { "blooped": true } ).count();
      return getBlipCount > 0 ? true : false;
    }
  });

  Template.showBlips.events({
    'click .clear-blooped-blips': function() {
      // Instead of returning a MongoDB cursor, by using the .fetch() method
      // we can get a plain array of objects.
      var bloopedBlips = Blips.find( { blooped: true } ).fetch();

      for ( var blip in bloopedBlips ) {
        var item = bloopedBlips[ blip ];
        // We can also call our database operations like remove without a
        // callback if we wish.
        Blips.remove( item._id );
      }

    }
  });

  Template.blip.events({
    'click .bloop-it': function( event, template ) {
      // When our template is used inside of an {{#each}} loop like our blips
      // are, we can access an individual blip's ID by calling this._id.

      var blip = this._id;

      // Here we use the update method on our Blips collection, passing the
      // blip's ID we grabbed using this._id. First we pass the ID to update
      // and then the changes we want to make.
      Blips.update({
        _id: blip
      }, {
        $set: {
          // Make our change. Because we can access our current items blooped
          // value from `this` just like our ID, we can simply toggle the value
          // before we update our blip by using the inverse value. Nifty!
          blooped: !this.blooped
        }
      }, function( error, response ) {
        if ( error ) {
          // For gits and shiggles, we throw an alert if one occurs.
          alert( error.reason );
        }
      });
    },
    'click .delete-blip': function( event, template ) {

      var confirmDelete = confirm( "Are you sure? This blip will be permanently deleted. Forever Unbloopable." );

      if ( confirmDelete ) {
        var blip = this._id;

        // Here we use the update method on our Blips collection, passing the
        // blip's ID we grabbed using this._id. First we pass the ID to update
        // and then the changes we want to make.
        Blips.remove({
          _id: blip
        }, function( error, response ) {
          if ( error ) {
            // For gits and shiggles, we throw an alert if one occurs.
            alert( error.reason );
          }
        });
      }
    }
  });
}
