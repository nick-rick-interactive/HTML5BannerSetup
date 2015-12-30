# HTML5 Banner Setup<br/>

#### This repository will get you up and running with a basic layout for a <a href="https://www.doubleclickbygoogle.com/" target="_blank">DoubleClick</a> banner set.
###### It utilizes Gulp to create banner sets from a template, copy existing completed banners to a new size, and compiling.

You must install <a href="https://www.npmjs.com" target="_blank">NPM</a> to generate banners<br/><br/>

### Start by installing the Node Modules needed

    npm install

### <a href="http://sass-lang.com/" target="_blank">Jade</a><br/>

The html for the banners is generated with Jade mark up.

### <a href="http://coffeescript.org/" target="_blank">Coffeescript</a><br/>

The javascript is generated using coffeescript.  A basic banner class utilizing polite load is added to the project to extend into the Banner's class.

### <a href="http://sass-lang.com//" target="_blank">SASS</a><br/>

Sass is used for all css.  A Cross Browser CSS3 mixin file (<a href="https://github.com/matthieua/sass-css3-mixins" target="_blank">matthieua/sass-css3-mixins</a>) and basic banner additional mixins are added to the project to get you started

### <a href="http://sass-lang.com//" target="_blank">Gulp</a><br/>

Gulp is setup to use 3 main functions<br/><br/>

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