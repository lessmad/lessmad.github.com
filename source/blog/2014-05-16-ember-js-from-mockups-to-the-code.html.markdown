---
title: "Ember.js: Starting guide"
date: 2014-05-16 17:44 UTC
tags: "Ember.js"
layout: "article"
---

Ember.js is a javascript framework that was started more than 3 years ago now and
made a huge step forward when the version 1.0 was released in August 2013. It is now
possible to build quite fast complex web applications while increasing the developers'
productivity (by reducing boilerplate code) and the end user's happiness (no slow page refresh).

Doing consulting work at LessMad, I've discovered that despite the
great documentation, it is not always clear for some developers how to structure an
Ember application and when to use some features. The goal of this post will be
to work on a real example, from the mockups to the code. I'll assume that the general concepts of
Ember.js (routing, controllers, views, models, layouts, components, ...) are
understood. This post is the first of a serie that will lead us to build a blog engine.

## The blog application

Here is the simple application we will build in this first step.

The homepage renders all the posts.

![Emblog homepage mockup](2014/05/16/ember-js-from-mockups-to-the-code/emblog-homepage.png "Emblog homepage mockup")

A post has its own link.

![Emblog article mockup](2014/05/16/ember-js-from-mockups-to-the-code/emblog-article.png "Emblog article mockup")

The Archives page displays a summary of all the posts.

![Emblog archives mockup](2014/05/16/ember-js-from-mockups-to-the-code/emblog-archives.png "Emblog archives mockup")


While taking a look at those 3 mockups, we can start looking at some details that will help us make decisions on how 
to structure our Ember.js code:

* The application has 3 different types of URLs, which will guide how we implement our routes
* The page layout 
* The displayed content ( we manipulate posts )

## The layout

Our 3 views are composed of 4 distinct areas:

* The header
* The content for the specific route
* The sidebar that contains shortcuts
* The footer

The application template allows to define those elements through the entire
application.

```handlebars
<script type="text/x-handlebars" data-template-name="application">
  <div class="header">
    <div id="logo">Ember Is Magic</div>
    <div class="menu">
      <a href="#">Home</a>
    </div>
  </div>

  {{outlet}}
  
  <div class="footer">©LessMad LLC</div>
</script>
```

It's easy to add too many elements in a single template. It's a good practice to
create templates for differents sections of the application. In our case, we
define two additional templates, one for the header and another one for the
footer.

```handlebars
<script type="text/x-handlebars" data-template-name="header">
  <div class="header">
    <div id="logo">Ember Is Magic</div>
    <div class="menu">
      <a href="#">Home</a>
    </div>
  </div>
</script>

<script type="text/x-handlebars" data-template-name="footer">
  <div class="footer">©LessMad LLC</div>
</script>
```

We can then insert those templates into our layout using the `render`
helper.

```handlebars
<script type="text/x-handlebars" data-template-name="application">
  {{render 'header'}}

  {{outlet}}
  
  {{render 'footer'}}
</script>
```

The sidebar currently displays the same information through all our pages. It's
easy to imagine that it could be customized for each route. Instead of simply
rendering a template, we will create a named outlet `sidebar` and let each route
manages its content. A route can then easily decide to not have a sidebar by not
connecting it.

```handlebars
<script type="text/x-handlebars" data-template-name="application">
  {{render 'header'}}

  {{outlet}}
  
  {{outlet sidebar}}
  
  {{render 'footer'}}
</script>
```

## The routes

We can identify 3 different routes:

* `/`, which represents the index route, offered for free by Ember
* `/articles/:id` for reading a specific post
* `/archives/:year/:month` for filtering posts published a month of a year

The routes defined in the application are:

```javascript
App.Router.map(function() {
  // The `IndexRoute` offered by Ember.js will take care of the `/` url
  this.route('post', {path: 'posts/:post_id'});
  this.route('archive', {path: 'archives/:year/:month'});
});
```

A route needs to define which model is represented by that url. In this first
part, we will use `Ember.Object`s. A post has an id, a title, a date and a body.

```js
App.Post = Ember.Object.extend({
  id: null,
  title: null,
  body: null,
  date: null
});

App.Post.FIXTURES = [{
  id: '1',
  title: 'Welcome!',
  date: new Date(2014, 1, 1),
  body: 'Something will happen here real soon'
},{
  id: '2',
  title: 'My 1st post',
  date: new Date(2014, 1, 15),
  body: 'I start blogging, this is not a joke!'
},{
  id: '3',
  title: 'My 2nd post',
  easily 
},{
  id: '4',
  title: 'My 3rd post',
  date: new Date(2014, 3, 5),
  body: "There's so much to learn that I can't say everything."
}];
```

The next goal is to setup the content that will be displayed in the views.
In Ember.js, a route defines a `model` that is passed to a `controller` that is
used as context for a `view`/`template`. If you don't define a controller or a
view for a route, Ember.js will create one for you. 

## The controllers

Our index page displays posts. The default `IndexController` that would be
be generated by Ember.js inherits from `Ember.Controller` [TODO: check that].
As our homepage displays a collection of posts, we need to make sure that our
controller can manage an array. We would declare explicitely the `IndexController`
as a subclass of `Ember.ArrayController`.

```js
App.IndexController = Ember.ArrayController.extend();
```

This solution works, but if we look at our application, we realize that we use
the collection of posts in different areas. We also know that a controller in that
case is a singleton and can be shared across the entire app. It makes sense then
to create a `PostsController` that inherits from `Ember.ArrayController` to store
the posts.

```js
App.PostsController = Ember.ArrayController.extend();
```

Ember.js is all about convention over configuration. By default, you would
expect the `IndexRoute` to work automatically with the `IndexController`. As our
`IndexRoute` uses now the `PostsController`, we need to specify it manually:

```js
App.IndexRoute = Ember.Route.extend({
  controllerName: 'posts'
});
```

The route can now set the content to be used by returning an array of posts
that will be assigned to the `PostsController` instance.

```js
App.IndexRoute = Ember.Route.extend({
  controllerName: 'posts',

  model: function() {
    return App.Post.FIXTURES.map( function( post ) {
      return App.Post.create( post );
    });
  }
});
```

## The templates

Ember.js uses currently handlebars as the default templating language. The same way our
`IndexRoute` was expecting an `IndexController`, Ember.js will use the `index`
template. We can use the `each` helper to iterate through our posts. By default,
the context of a template is the controller, which acts as a proxy to the data
returned by the `model` function of the route. As we don't have any customization at that
point, no need to create an `App.IndexView` class, we will rely on the default one provided
by Ember.

```handlebars
<script type="text/x-handlebars" data-template-name="index">
  {{#each}}
    <article>
      <h2>{{link-to 'post' this}}{{item.title}}{{/link-to}}</h2>
      <span>{{item.date}}</span>
      <p>
        {{item.body}}
      </p>
    </article>
  {{/each}}
</script>
```

With this template, we can see our posts on the index page. But this is not
exactly what we were expecting:

- the posts are not displayed from the newest to the oldest date
- the posts' dates are not readible ( `Sat Mar 01 2014 00:00:00 GMT-0800 (PST)`
when we were expecting `March 1st 2014` )

Manipulating the data displayed is usually the concern of the controller.
Sorting the content is really easy with Ember.js [add ref to doc]. We need to 
update our `PostsController` to take advantage of the builtin sort mechanism,
based on the `SortableMixin`.

```js
App.PostsController = Ember.ArrayController.extend({
  sortProperties: ['date'],
  sortAscending: false
});
```

For the date format, we know that the same date can theoretically be displayed
differently depending on the area of the application ( `03/01/2014` or `March 1st 2014`
etc... ). A good way of doing it is to create a Handlebars helper that can be 
call with the needed format. Moment.js provides the API to actually format a javascript
date to a string.

```js
Ember.Handlebars.registerBoundHelper('formatDate', function(date, format) {
  return moment(date).format(format);
});
```

We can now call that helper inside our template, passing the date and format.

```handlebars
<script type="text/x-handlebars" data-template-name="index">
  {{#each}}
    <article>
      <h2>{{link-to 'post' this}}{{item.title}}{{/link-to}}</h2>
      <span>{{formatDate item.date 'MMMM Do YYYY'}}</span>
      <p>
        {{item.body}}
      </p>
    </article>
  {{/each}}
</script>
```

It's easy to reuse that helper in different templates.

```handlebars
<header>
  <h2>{{title}}</h2>
  <span>{{formatDate date 'MMMM Do YYYY'}}</span>
</header>
```

And voila!


## The sidebar

The sidebar contains two widgets, one showing the last 3 posts, the other months
when posts were published. It is visible on all pages of our blog, so we will let
the `ApplicationRoute` manages its default state for now. The widgets don't represent
the full content of the `PostsController` that we have used so far, but a
subset (the top 3) or a different representation. So let's add two placeholders
for our widget in the `sidebar` template.

```handlebars
<script type="text/x-handlebars" data-template-name="sidebar">
  {{outlet recentPosts}}

  {{outlet archives}}
</script>
```

and connect it to our application template in the `renderTemplate` method of the
route. Ember.js is all about convention over configuration. By default, you would
expect the `ApplicationRoute` to work with the `ApplicationController`. As our
widgets use the `PostsController`, we need to specify it manually with
`controllerName`:

```js
App.ApplicationRoute = Ember.Route.extend({
  controllerName: 'posts',

  renderTemplate: function() {
    this._super();
    
    this.render('sidebar', {
      into: 'application',
      outlet: 'sidebar'
    });
  }
});
```

One easy mistake to make here is to forget to call `_super` when overriding a
method defined by the framework. In that specific case, the resulting bug would
be the absence of the main content.

The easiest way to get the recent posts is to create a computed property on the
`PostsController`. An `ArrayController` exposes 2 computed properties to access
its content:

- `content` which represents the array passed by the route
- `arrangedContent` which represents the filtered/sorted data. By default, it is an
alias to `content`. When defining a sort with `sortProperties` and `sortOrder`, it
returns the sorted `content`.

[TODO: insert example/sample]

As we are sorting posts by date using `sortProperties`, we want to rely on
`arrangedContent` to retrieve the recent posts.

```js
App.PostsController = Ember.ArrayController.extend({
  sortProperties: ['date'],
  sortAscending: false,

  recentPosts: Ember.computed( 'arrangedContent', function() {
    return this.get('arrangedContent').slice(0, 3);
  })
});
```

`recentPosts` returns the last three posts which allows us to use that computed
property in our template with the `link-to` helper.

```handlebars
<script type="text/x-handlebars" data-template-name="recent-posts">
  <h4>Recent posts</h4>
  <ol>
    {{#each post in recentPosts}}
      <li>{{#link-to 'post' post}}{{post.title}}{{/link-to}}</li>
    {{/each}}
  </ol>
</script>
```

We can now render the `recent-posts` template inside `recentPosts` outlet of 
the sidebar.

```js
App.ApplicationRoute = Ember.Route.extend({
  renderTemplate: function() {
    this._super();
    
    this.render('sidebar', {
      into: 'application',
      outlet: 'sidebar'
    });

    this.render('recent-posts', {
      outlet: 'recentPosts',
      into: 'sidebar'
    });
  }
});
```

We don't have a specific model for the archives, it can be deduced from the
posts. An archive item as we see it right now is a month/year and a list of
posts. The month/year can be computed with the collection of posts, they should
all have the same month and year.

```js
App.Archive = Ember.Object.extend({
  posts: null
});
```

As we will display archives, we can create that list in the
`ArchivesController` based on the data from the `PostsController`. Ember.js
offers a way to deal with such a dependency between controllers with the `needs`
attribute.

```js
App.ArchivesController = Ember.ArrayController.extend({
  needs: ['posts']
});
```

By declaring a dependency on `posts`, the `ArchivesController` can access the
posts through the `controllers.post` variable. We can now generate the
`ArchivesController`'s `content` based on the posts and the `monthYear` computed
property on the `App.Post` model to group posts. We will use the `reduce` method
exposed by `Ember.Enumerable`, a mixin used by `Ember.Array`.

```js
App.Post = Ember.Object.extend({
  monthYear: Ember.computed('date', function () {
    return moment( this.get('date') ).startOf('month');
  })
});

App.ArchivesController = Ember.ArrayController.extend({
  needs: ['posts'],

  content: Ember.computed('controllers.posts.arrangedContent', function() {
    var posts = this.get('controllers.posts.arrangedContent');

    return posts.reduce( function( previousValue, post, index ) {
      var prevMonthYear = previousValue.get('lastObject.monthYear');
      
      if( !prevMonthYear || prevMonthYear.diff( post.get('monthYear') )) {
        previousValue.pushObject( App.Archive.create({
          posts: Ember.A([])
        }));
      }
      
      previousValue.get('lastObject.posts').pushObject( post );

      return previousValue;
    }, []);
  })
});
```

[CHECK: groupBy]

We have the right data, we simply need to display it. The `archive` route
contains 2 dynamic segments, `year` and `month`. If we want `link-to` to generate
automatically the anchor tag, an `App.Archive` instance needs to expose those
attributes. We can again use computed properties to extract that information out
of the `monthYear` variable.

```js
App.Archive = Ember.Object.extend({
  monthYear: Ember.computed('posts.firstObject', function() {
    return this.get('posts.firstObject.monthYear');
  }),
  month: Ember.computed('monthYear', function() {
    return this.get('monthYear').month();
  }),
  year: Ember.computed('monthYear', function() {
    return this.get('monthYear').year();
  })
});
```

The template takes advantage of our `App.Archive` model and the `archive` route.

```handlebars
<script type="text/x-handlebars" data-template-name="archives-widget">
  <h4>Archives</h4>
  <ol>
    {{#each}}
      <li>
        {{#link-to 'archive' this}}
          {{formatDate monthYear 'MMMM YYYY'}} ({{this.content.length}})
        {{/link-to}}
      </li>
    {{/each}}
  </ol>
</script>
```

As we know, the `archives-widget` template expects data from the
`ArchivesController`. We can retrieve this controller in the `renderTemplate`
method of the `IndexRoute` with `controllerFor` and pass it to `render`.

```javascript
// IndexRoute class
renderTemplate: function() {
  var archivesController = this.controllerFor('archives');
  
  this._super();
  
  this.render('sidebar', {
    outlet: 'sidebar'
  });
  
  this.render('recent-posts', {
    into: 'sidebar',
    outlet: 'recentPosts'
  });
  
  this.render('archives-widget', {
    into: 'sidebar',
    outlet: 'archives',
    controller: archivesController
  });  
}
```

Our index page is now complete. The code is available in the
[JsBin](http://emberjs.jsbin.com/yuxan/2).

## Ember Component

Building the `post` page is straight forward after having implemented the
`index` page. We notice that the content remains a post as defined in the
`index` template. This looks like a good candidate to implement an Ember
component. 

As always with Ember.js, it is important to know the convention. The
template name starts with `components/` and contains an hyphen. The component
class name ends with `Component`. In our case, the class doesn't need to provide
any specific behavior, so we don't declare it, Ember will provide a default one.

```handlebars
<script type="text/x-handlebars" data-template-name="components/blog-post">
  <article>
    <header>
      <h2>{{#link-to 'post' postId}}{{title}}{{/link-to}}</h2>
      <span>{{formatDate date 'MMMM Do YYYY'}}</span>
    </header>
    <p>
      {{body}}
    </p>
  </article>
</script>
```

that can be used now in the `index` and `post` templates

```handlebars
<script type="text/x-handlebars" data-template-name="index">
  {{#each}}
    {{blog-post title=title body=body date=date postId=id}}
  {{/each}}
</script>

<script type="text/x-handlebars" data-template-name="post">
  {{blog-post title=title body=body date=date postId=id}}
</script>
```

Looking at the mockup for the `archive` page, we can notice that the `body` of
the post isn't displayed entirely, but is truncated after the first 20
characters. Adding that feature to our component is really easy and requires to
expose a new `summary` attribute to the `blog-post` component and a `truncate`
Handlebars helper to displays ellipses.

```handlebars
<script type="text/x-handlebars" data-template-name="components/blog-post">
  <article>
    <header>
      <h2>{{#link-to 'post' postId}}{{title}}{{/link-to}}</h2>
      <span>{{formatDate date 'MMMM Do YYYY'}}</span>
    </header>
    <p>
      {{#if summary}}
        {{truncate body 20}}
      {{else}}
        {{{body}}}
      {{/if}}
    </p>
  </article>
</script>
```

The `truncate` helper creates a new string using the `&:hellip;` html entity.
[TODO: find the right name for that attack] By default, Ember will escape all
printed strings to prevent vulnerability in your application.
In our case, we don't want here to escape our ellipsis, so we don't return a
simple string but an instance of `Ember.Handlebars.SafeString`. 

```js
Ember.Handlebars.helper('truncate', function(str, length) {
  var truncatedString = str.length>length ? str.substr(0,length-1)+'&hellip;' : str;

  return new Ember.Handlebars.SafeString(truncatedString);
});
```

The `archive` template can now take advantage of that new feature by setting 
`summary=true` when inserting the `blog-post` component:

```handlebars
<script type="text/x-handlebars" data-template-name="archive">
  <div>Posts from {{formatDate monthYear 'MMMM YYYY'}}</div>
  {{#each post in posts}}
    {{blog-post title=post.title body=post.body date=post.date postId=post.id summary=true}}
  {{/each}}
</script>
```

The `ArchiveRoute` connects the pieces together.

```js
App.ArchiveRoute = Ember.Route.extend({
  model: function(params) {
    var posts = App.Post.FIXTURES.filter( function(postPayload) {
      var month = postPayload.date.getMonth() + 1 + '',
          year = postPayload.date.getFullYear() + '';
      
      return month === params.month && year === params.year;
    });
    
    return App.Archive.create({
      monthYear: new Date(params.year, params.month-1, 1),
      posts: posts
    });
  }
});
```

## Conclusion
