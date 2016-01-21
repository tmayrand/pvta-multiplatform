# pvta-multiplatform 

### Welcome to the repository for UMass Transit's PVTA realtime app (name TBD)!

The app is a hybrid that uses the Ionic framework. This enables us to write Javascript
and have a fluid, beautiful app on all the smartphone platforms we could dream of!

All data comes from REST-ful endpoints located on the PVTA's website.  There is currently 
no distinction between production and development data.

To begin developing, follow these steps:

###<b>Prerequisites</b>
- [Node.js <b>4.x</b>](https://nodejs.org/en/)
- Angular.js (no explicit installation necessary)
- Ionic and Cordova: <code>npm install -g cordova ionic</code>

##Some Prep

1. Fork this repository

2. Clone your fork onto your local machine

3. In your fork's directory, run the following setup stuff:
  1. <code>npm install -g bower</code>
  2. <code>npm install -g gulp</code>
  3. <code>bower install</code>
  4. <code>gulp</code>

##Developing, Building, and Running

1. The javascript is contained in <i>www/js</i>.Start editing away!

###2. <b>Viewing the results of your changes is quick and easy to do:
## In the browser (do this during development):</b>
    Run <b><code>ionic serve -c</code></b> from the root project directory.

###On a Device (do this sparingly)
1. The project has been configured to be an Android and iOS project.  If you want to build a copy for an emulator on your machine, or you'd like to run it on your phone, do the following:

   a. <code>ionic build</code> generates, populates, and compiles all files for both platforms.  You must have <i>xcode</i>, <i>xcode command line tools</i>, Java and the JDK (version 1.7 or 1.8), and the Android SDK (kitkat, lollipop, and marshmallow preferrably) all installed. [Android SDK Download Page](http://developer.android.com/sdk/installing/index.html). I HIGHLY recommend downloading it with Android Studio.
   
   b. <code>ionic emulate {platform}</code> where <code>platform</code> = <i>android</i> or <i>ios</i>
   
   c. <code>ionic run</code> <b>should</b> install and run your app on a connected Android device (developer tools->USB Debugging must be enabled on the phone and the <code>Android Debugger</code> executable (ships with SDK in android_sdk_path/platform_tools/adb). Some phones royally screw this up, namely the Galaxy S5.
   
   d. For Android that give you trouble and iPhones/etc on iOS >= 9.0, open the project in <code>{project_root}/platforms/{android or ios}/</code> in Android Studio or Xcode.  From there, you can follow a tutorial on installing it on your phone (hint: click the <code>Run</code> button and select your device).

##Research/Learning:

<b>Angular</b>

I've found that the Angular APIs have a learning curve that flattens out fairly quickly.  While confusing at first, I absolutely recommend them, as other tutorials have steered me wrong in ways that I now have to refactor into better code.

[Angular APIDocs Root Page](https://docs.angularjs.org/api)

<b>Ionic</b>

Ionic is what makes our app pretty.  It has little else to do, but it is built <i>on top of</i> Cordova and Angular.  The Ionic team made it easy to do things with the <code>ionic {command}</code> syntax instead of switching between Cordova and Angular calls.

The Ionic API is fine, but kind of sparse.  Their forums are AWFUL.  Recommend random tutorials as a second resource if the API isn't sufficient (in many cases it IS).

[IonicDocs Root](http://ionicframework.com/docs/)

<b>Cordova</b>

Cordova does <b>all</b> the real heavy lifting that makes our app a mobile app.  Since ionic has aliases for the most common cordova commands, searching out Cordova features is currently on a need-to-know basis.  (Read: use Google)

Their API is thorough but has some quirks.  The real gem of Cordova is their plugins that will make our app seem native, such as push notifications and local database support.  

Currently, we leverage only 2 plugins: keyboard and statusbar.

[CordovaDocs](https://cordova.apache.org/docs/en/5.0.0/) (loves to say it's outdated, but the updated version doesn't cover everything and has too many 404s)



##Standard error help:

- The first time you boot an <i>ionic server</i> after installing all your dependencies, it's possible you'll run into errors.  The error codes are long and mostly useless; the source of your problem is assuredly the very first line of the first error block in the trace.
  - If you haven't changed any code, it's an error with your dependency binaries.  This is common, and a better way to organize them is being worked on.  
    - See which dependencies you seem to be missing.  In <code>index.html</code>, make sure the import statements (</code>'< script >'</code> tags) have paths to files that actually exist in your project.  bower installs to <code>bower_components</code>, a directory in the project's root, but <code>index.html</code> has troubles finding this directory.
    - To fix, I recommend moving the file from bower_components (assuming it's there and it's causing you trouble) to the <code>www/lib</code>, which, in unison with updating <code>index.html</code> to point there, should resolve this.  
    
    - <b>Before you push it, holler at Aaron, who thinks he has it set up with so many redundancies that you really shouldn't encounter this problem at all.</b>
 - If it worked before, but doesn't after you've begun editing, it's likely that you're using a service that you need to import in controllers that now use this service (or your code just has problems).
