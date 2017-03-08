# emojione-png-sprites

This repo provides [EmojiOne](https://emojione.com) spritesheets in various sprite sizes.

There's also a Sass mixin that generates CSS for given sizes with support for retina.



## Table of content

* [Why](#why)
* [Available sizes](#available-sizes)
* [Including spritesheets and Sass mixins into your project](#including-spritesheets-and-sass-mixins-into-your-project)
* [Serving from a free CDN](#serving-from-a-free-cdn)
* [Using the Sass mixin](#using-the-sass-mixin)
    * [Example usage](#example-usage)
* [Development](#development)
    * [Rebuilding stylesheets](#rebuilding-stylesheets)
    * [Updating file size table](#updating-file-size-table)
    * [Updating the table of content](#updating-the-table-of-content)



## Why

[EmojiOne](https://emojione.com) is an awesome & free collection of emoji.

Unfortunately, its PNG sprites aren't very usable because:

* No sprite sizes below 64px are provided.
* The spritesheets have a 1px padding between sprites, making it impossible to downscale them.
* Spritesheets aren't hosted on their official CDN.
* Resizing emoji rendered via PNG sprites is a pain.



## Available sizes

This repo provides [EmojiOne](https://emojione.com) spritesheets in the following sprite sizes: 10-32, 64, 128.

| Filename & sprtie size | Fize size |
|:-----------------------|:----------|
| sprite-10.png          | 329K      |
| sprite-11.png          | 379K      |
| sprite-12.png          | 430K      |
| sprite-13.png          | 477K      |
| sprite-14.png          | 560K      |
| sprite-15.png          | 603K      |
| sprite-16.png          | 606K      |
| sprite-17.png          | 713K      |
| sprite-18.png          | 778K      |
| sprite-19.png          | 837K      |
| sprite-20.png          | 897K      |
| sprite-21.png          | 934K      |
| sprite-22.png          | 1007K     |
| sprite-23.png          | 1,1M      |
| sprite-24.png          | 1,2M      |
| sprite-25.png          | 1,2M      |
| sprite-26.png          | 1,3M      |
| sprite-27.png          | 2,2M      |
| sprite-28.png          | 1,4M      |
| sprite-29.png          | 2,4M      |
| sprite-30.png          | 1,5M      |
| sprite-31.png          | 2,6M      |
| sprite-32.png          | 1,5M      |
| sprite-64.png          | 3,3M      |
| sprite-128.png         | 7,2M      |
| style.scss             | 41K       |

The reason other sizes aren't provided is because other stylesheets turn out larger in file size than next stylesheet whose sprite size is a power of two (e. g. file size for 48 is larger than file size for 64).

As for size 256, [sprity](https://github.com/sprity/sprity) crashes when source emoji size is larger than 128, so we were unable to generate it. If you need sprite size of 256, you should revert to the official EmojiOne spritesheet of size 512.



## Including spritesheets and Sass mixins into your project

If your frontend doesn't have a build pipeline, skip this step and instead download files manually.

To avoid downloading all spritesheets from this repo, it recommended that you import individual spritesheets that you need with Bower.

1. Open latest commit in this GitHub repo in order to fix the version.
2. Open the spritesheet that you need from the `dist/` folder.
3. Click `Download` or `Raw` to open the file directly.
4. Copy the URL.
5. Use it in Bower like this:

        bower install -S emojione-png-sprite-<size>=<url>

6. Repeat for every size that you need.
7. Import the Sass file in a similar way: 

        bower install -S emojione-png-sprite-sass=<url>

Then you need to configure your build pipeline to include the spritesheets into your app distribution, e. g. move to the `public/` folder.



## Serving from a free CDN

[RawGit.com](http://rawgit.com/) is a free CDN for GitHub-hosted files powered by [StackPath.com](https://www.stackpath.com/).

Here's how you can use it.

1. Open latest commit in this GitHub repo in order to fix the version (very important!).
2. Open the spritesheet that you need from the `dist/` folder.
3. Click `Raw` to open the file directly.
4. Copy the URL.
5. Paste the URL into the top field on [RawGit.com](http://rawgit.com/).
6. Copy the resulting URL from the bottom-left field. That's your permanent CDN URL!

Note that RawGit is very reliable, but it provides no guarantees and should not be used for applications that demand 100% uptime.



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



## Development

### Rebuilding stylesheets

1. Install [Node](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/en/) and [pngcrush](https://pmt.sourceforge.io/pngcrush/)
2. Clone this repo and `cd` into it
3. Install dependencies:
    * `bower install`
    * `yarn install`
4. Run `node index.js`

Regenerating and compressing stylesheets will take some time.




### Updating file size table

Use `ls -alhF` to get file sizes.

Use this regex to extract size and filename: 

```js
/^.*?([\d,]+[A-Z]).*?([\w|.|-]+)$/gm
```



### Updating the table of content

Use https://lolmaus.github.io/tocdown/ with first two checkboxes enabled.
