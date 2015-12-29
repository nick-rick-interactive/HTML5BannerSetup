# HTML5 Banner Setup<br/>

#### This repository will get you up and running with a basic layout for a DoubleClick banner set.
###### It utilizes Gulp to create banner sets from a template, copy existing completed banners to a new size, and compiling.

You must install NPM and GULP to generate banners<br/><br/>

### Jade<br/>

The html for the banners is generated with Jade mark up.

### Coffeescript<br/>

The javascript is generated using coffeescript.  A basic banner class utilizing polite load is added to the project to extend into the Banner's class.

### SASS<br/>

Sass is used for all css.  A mixin file and basic banner additional mixins are added to the project to get you started

### Gulp<br/>

Gulp is setup to use 3 main functions<br/><br/><br/>

##### new-banner<br/>
This will generate the template files needed to create a banner.  Use the "size" argument to send the folder naming convention.

    gulp new-banner --size=728x90
    
<br/>
This will generate the Jade, Coffeescript and SASS files to start your project

##### copy-banner<br/>
This will copy the files from one banner to a new banner size

    gulp copy-banner --size=728x90 --newSize
    
<br/>
A duplicate banner set will be generated in the new size and an empty dist folder

##### build (Default)<br/>
This will compile the Jade, Coffeescript and SASS files to a minified JS file, an normal JS file, a CSS file and HTML file using the banner size as the naming convention in the argument sent

    gulp --size=728x90
or
    gulp build --size=728x90
<br/>
This will compile all the code in the 728x90 folder.  It will also compress all images added to _img and zip up the CSS, HTML, minified JS and all images into a zip archive.