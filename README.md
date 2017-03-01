# emojione-png-sprites

This repo provides [EmojiOne](https://emojione.com) spritesheets in various sprite sizes.

There's also a Sass mixin that generates CSS for given sizes with support for retina.



## Why

[EmojiOne](https://emojione.com) is an awesome & free collection of emoji.

Unfortunately, its PNG sprites aren't very usable because:

* No sprite sizes below 64px are provided.
* The spritesheets have a 1px padding between sprites, making it impossible to downscale them.
* Spritesheets aren't hosted on their official CDN.
* Resizing emoji rendered via PNG sprites is a pain.



## Available sizes

This repo provides [EmojiOne](https://emojione.com) spritesheets in the following sprite sizes: 10-32, 64, 128.
 
The reason other sizes aren't provided is because missing stylesheets turn out larger in file size than a larger stylesheet whose sprite size is a fraction of two (e. g. file size for 49 is larger than file size for 64).

As for size 256, [sprity](https://github.com/sprity/sprity) crashes when source emoji size is larger than 128. :(



## Including spritesheets into your project

If your frontend doesn't have a build pipeline, skip this step and instead download files manually.

To avoid downloading all spritesheets from this repo, it recommended that you import individual spritesheets that you need with Bower.

1. Open latest commit in this repo in order to fix the version.
2. Open the spritesheet that you need from the `dist/` folder.
3. Click `Raw` to open the file directly.
4. Copy the URL.
5. Use it in Bower like this:

        bower install -S emojione-png-sprite-<size>=<url>
        
6. Repeat for every size that you need.
7. Import the Sass file in a similar way: 

        bower install -S emojione-png-sprite-sass=<url>

Then you need to configure your build pipeline to include the spritesheets into your app distribution, e. g. move to the `public/` folder.



## Using the Sass mixin

Import the Sass file into your stylesheet:

```scss
@import "bower_components/emojione-png-sprites-sass/style.scss";
```

Note that you may need to configure Sass include paths and adjust the import path.

This makes the `sprity-emojione` mixin available. It accepts three arguments:

| # | Type            | Default value | Description                                                                                                                                                        |
|:--|:----------------|:--------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | Unitless number | required      | Desired emoji size in px.                                                                                                                                          |
| 2 | String          | required      | Path to the directory on your web server where the spritesheets are located. Can be stylesheet-relative, root-relative or full (with protocol). No trailing slash! |
| 3 | Map             | `()`          | A map where keys are retina scale factors and values are corresponding sprite sizes, e. g. `(2: 48, 3: 64)`.                                                       |



### Example usage

Say, we want emoji to be 20px in size. For retina screens, we want the emoji to be displayed in double and triple quality.

40 and 60 sprite sizes aren't available, so we'll use larger ones: 48 and 64.

The following example assumes that the spritesheets are available on the web server under these paths:

    /assets/emojione-png-sprites/sprite-20.png
    /assets/emojione-png-sprites/sprite-48.png
    /assets/emojione-png-sprites/sprite-64.png

Import the mixin and invoke it like this:

```scss
@import "bower_components/emojione-png-sprites-sass/style.scss";

@include sprity-emojione(20, "/assets/emojione-png-sprites", (2: 48, 3: 64));
```

This mixin invocation will make EmojiOne emoji have CSS width and height of **20**px.

For non-retina screens, the spritesheet with sprite size **20** will be used.

For retina screens with a scale factor of **2** (DPI >= 192), the spritesheet with sprite size **48** will be used.

For retina screens with a scale factor of **3** (DPI >= 256), the spritesheet with sprite size **64** will be used.

The resulting CSS will be:

```css
.emojione {
    width:  20px;
    height: 20px;
    background-image: url("/assets/emojione-png-sprites/sprite-20.png");
    background-size:  20px;
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2),
only screen and (        min-device-pixel-ratio: 2),
only screen and (min-resolution: 192dpi),
only screen and (min-resolution: 2dppx) {
    .emojione {
        background-image: url("/assets/emojione-png-sprites/sprite-48.png");
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 3),
only screen and (        min-device-pixel-ratio: 3),
only screen and (min-resolution: 288dpi),
only screen and (min-resolution: 3dppx) {
    .emojione {
        background-image: url("/assets/emojione-png-sprites/sprite-64.png");
    }
}

.emojione-1f46e-1f3fc {
    background-position: 0 0px;
}

.emojione-0023-20e3 {
    background-position: 0 -20px;
}

/* ... */
```



### Development: rebuilding stylesheets

1. Install Node and [pngcrush](https://pmt.sourceforge.io/pngcrush/).
2. Clone this repo and `cd` into it.
3. Install dependencies:
    * `bower install`
    * `npm install` or `yarn install`
4. Run `node index.js`.

Regenerating and compressing stylesheets will take some time.
