# Genius Blender

stop the Genius web annotator

# The Story So Far
- [why this is necessary](http://www.vijithassar.com/2641/how-to-block-genius-annotations)
- [security issues](http://www.theverge.com/2016/5/25/11505454/news-genius-annotate-the-web-content-security-policy-vulnerability)
- previously: Genius Defender, a stranger and more complicated server-side solution for [Wordpress/PHP](https://github.com/vijithassar/genius-defender) and [Node.js](https://github.com/vijithassar/genius-defender-js)

# Quick Start

To remove Genius annotations, just add this one line of HTML to your post, page, or site:

```html
<script type="text/javascript" src="https://vijithassar.github.io/genius-blender/genius-blender.js"></script>
```

This should work even if you don't control your own server or content management software, such as with hosted blogging services, so long as the host allows scripts in your content.

# Bonkers Mode

Bonkers Mode deliberately embraces the primary failing of [Genius Defender](https://github.com/vijithassar/genius-defender), which was that the annotations weren't removed completely, and traces were left behind. It tries to **very visibly** break the Genius product by moving the annotations around randomly instead of just cleanly stripping them. This is eXtReMeLy dIsRuPtIvE, so perhaps Genius will eventually offer a proper opt-out to site owners instead of forcing them to use this solution.

![Bonkers Mode](https://cloud.githubusercontent.com/assets/3488572/14799431/73bfc0c8-0b0a-11e6-9418-68b7fce20362.gif)

To enable Bonkers Mode, just add a second script with a global variable containing a numeric interval, like this:

```html
<script type="text/javascript">var genius = {interval: 1000};</script>
<script type="text/javascript" src="https://vijithassar.github.io/genius-blender/genius-blender.js"></script>
```

The interval controls how frequently the annotations will move. It is given in milliseconds, and can be as large as 30000 (thirty seconds) or as small as 500 (half a second). The latter is slow enough to be safe for people with epilepsy.

# Dissemination

Genius could quite easily block the instance of the script I've linked to above from running on their annotation pages, so you are encouraged to host your own copy and share it with anybody who can't do the same. If you [fork this repository on GitHub](#fork-destination-box), a copy will be made available via [GitHub Pages](https://pages.github.com/), located at {your-github-username}.github.io/genius-blender/genius-blender.js. You can also make it a part of your site's build by [installing it from npm](http://www.npmjs.com/package/genius-blender), or you can [download it manually](./genius-blender.js). In any of these scenarios, changing the filename of the script should also make it even harder for Genius to recognize and suppress.

There are [absolutely no restrictions](LICENSE) on how you can use this code.

# Nerds Complaining

A global variable was the easiest way to both allow this to be loaded as a remote script and also make it easy for site owners to set customized configuration options like the optional time interval, which also acts as a switch for Bonkers Mode. Sites that are automatically including it in builds are unlikely to use Bonkers Mode, so in those cases the global variable will not be present anyway. Feel free to change this in your fork.
