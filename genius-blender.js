(function() {

  'use strict';

  var is_genius,
      overwrite_loader,
      referent_tags,
      annotation_tags,
      attributes,
      validate_config,
      mode,
      get_mode,
      fix_links,
      swap_node,
      create_node,
      random_item,
      text_nodes,
      get_text_nodes,
      add_mistakes,
      remove_annotations,
      execute,
      existing;

  is_genius = window.location.hostname === 'genius.it';

  // overwrite load function containing mutation observer for link rewriting
  overwrite_loader = function() {
    var element;
    element = document.getElementById('s14t-genius-injection');
    if (element) {
      element.onload = function() {
        return false;
      };
    }
  };

  // problematic things that may be present in the HTML
  referent_tags = [
    'genius-referent'
  ];
  annotation_tags = [
    'genius-back-page',
    'genius-back-page-mobile-clickjacker'
  ];
  attributes = [
    'data-genius-referent-id',
    'data-genius-style-id',
    'data-genius-wrapped-path',
    'data-genius-api-path',
    'data-genius-annotator-id',
    'data-genius-featured-referent',
    'data-genius-hover',
    'data-genius-is-highlighted'
  ];

  // make sure global object is safe for epilepsy
  validate_config = function(config) {
    var min,
        max,
        has_interval,
        too_big,
        too_small;
    min = 500;
    max = 30000;
    has_interval = typeof config.interval === 'number';
    too_small = config.interval < min;
    too_big = config.interval > max;
    if (!has_interval || too_big || too_small) {
      if (too_big) {
        config = {interval: max};
      } else if (too_small) {
        config = {interval: min};
      } else {
        config = {interval: (max / 2)};
      }
    }
    return config;
  };

  // is Bonkers Mode enabled?
  get_mode = function() {
    // look for a randomization interval
    if (typeof genius !=='undefined' && typeof genius.interval === 'number') {
      return 'random';
    } else {
      return 'remove';
    }
  };

  // substitute one node for another, and return a signal indicating whether the
  // operation succeeded
  swap_node = function(new_node, old_node) {
    if (old_node.parentNode !== null) {
      old_node.parentNode.replaceChild(new_node, old_node);
      return true;
    } else {
      return false;
    }
  };

  // create a new node with the specified name, copying attributes from
  // an old node
  create_node = function(name, old_node) {
    var new_node;
    // create node
    if (name === 'text') {
      new_node = document.createTextNode(old_node.textContent);
    } else {
      new_node = document.createElement(name);
    }
    // copy attributes
    if (old_node) {
      Object.keys(old_node).forEach(function(attribute) {
        var value;
        value = old_node[attribute];
        new_node.setAttribute(attribute, value);
      });
    }
    return new_node;
  };

  // choose a random element from an array
  random_item = function(array) {
    var index;
    index = Math.round(Math.random() * array.length);
    return array[index];
  };

  // remove genius.it prefix from links
  fix_links = function() {
    var links,
        link,
        url_fragments,
        new_url;
    links = document.querySelectorAll('a[href^="http://genius.it"]');
    if (links.length) {
      for (var i = 0, ilength = links.length; i < ilength; i++) {
        link = links[i];
        url_fragments = link.getAttribute('href').split('/');
        url_fragments.splice(2, 1);
        new_url = url_fragments.join('/');
        link.setAttribute('href', new_url);
      }
    }
  };

  // get all text nodes in the document suitable for use as a mistake insertion
  get_text_nodes = function() {
    var text_nodes,
        xpath_result;
    // compile an array of text nodes using xpath
    text_nodes = [];
    xpath_result = document.evaluate("//*/text()", document, null, 6, null);
    for (var i = 0, ilength = xpath_result.snapshotLength; i < ilength; i++) {
       text_nodes.push(xpath_result.snapshotItem(i));
    }
    // filter out unusable nodes
    text_nodes = text_nodes.filter(function(node) {
      var is_node,
          is_text_node,
          has_parent,
          parent_is_visible,
          valid;
      is_node = typeof node !== undefined && typeof node.nodeType !== 'undefined';
      is_text_node = node.nodeType === 3;
      has_parent = typeof node.parentNode !== 'undefined';
      // make sure it occupies some screen space, to rule out scripts and other
      // functional elements
      parent_is_visible = node.parentNode.getBoundingClientRect().height > 0;
      valid = is_node && is_text_node && has_parent && parent_is_visible;
      return valid;
    });
    return text_nodes;
  };

  // generate errant referents from an array of hashmaps containing
  // data properties
  add_mistakes = function(mistakes, referent_tag) {
    text_nodes = get_text_nodes();
    mistakes.forEach(function(mistake) {
      var random_text_node,
          fake_referent_node;
      // select a random text node from the page content, using a loop in case
      // the node has already been chosen and comes back as undefined
      while (!random_text_node) {
        random_text_node = random_item(text_nodes);
      }
      // generate a fake referent node
      fake_referent_node = create_node(referent_tag, mistake);
      // copy random page text into referent node
      fake_referent_node.textContent = random_text_node.textContent;
      // replace
      swap_node(fake_referent_node, random_text_node);
    });
  };

  // remove iframe containing annotations
  remove_annotations = function() {
    annotation_tags.forEach(function(annotation_tag) {
      var annotation_nodes,
          annotation_node;
      annotation_nodes = document.body.querySelectorAll(annotation_tag);
      for (var i = 0, ilength = annotation_nodes.length; i < ilength; i++) {
        annotation_node = annotation_nodes[i];
        annotation_node.parentNode.removeChild(annotation_node);
      }
    });
  };

  // run everything
  execute = function(mode) {
    overwrite_loader();
    fix_links();
    // for each prohibited tag
    referent_tags.forEach(function(referent_tag) {
      var referent_nodes,
          referent_node,
          text_node,
          attribute;
      // select nodes
      referent_nodes = document.querySelectorAll(referent_tag);
      if (mode === 'random') {
        var mistakes = [];
      }
      // iterate through all nodes
      for (var i = 0, ilength = referent_nodes.length; i < ilength; i++) {
        referent_node = referent_nodes[i];
        if (mode === 'random') {
          // store data attribute values for this node
          var mistake = {};
        }
        // iterate through all specified data attributes
        for (var j = 0, jlength = attributes.length; j < jlength; j++) {
          attribute = attributes[j];
          // change data attributes
          if (mode === 'random') {
            if (referent_node.hasAttribute(attribute)) {
              // store data attribute value
              mistake[attribute] = referent_node.getAttribute(attribute);
            }
          }
        }
        // replace referent node with a text equivalent
        text_node = create_node('text', referent_node);
        swap_node(text_node, referent_node);
        if (mode === 'random') {
          // save data attribute store for later use
          mistakes.push(mistake);
        }
      }
      if (mode === 'random') {
        add_mistakes(mistakes, referent_tag);
      }
    });
    if (mode === 'remove') {
      remove_annotations();
    }
  };

  // only run if viewing from genius
  if (is_genius) {
    if (typeof genius !== 'undefined') {
      genius = validate_config(genius);
    }
    mode = get_mode();
    // extend existing onload actions
    if (typeof window.onload === 'function') {
      existing = window.onload;
    }
    // attach to onload
    window.onload = function() {
      var observer,
          observer_options;
      if (mode === 'remove') {
        // for removal, register an observer
        observer = new MutationObserver(function() {
          execute(mode);
        });
        observer_options = {
          childList: true,
          attributes: true,
          subtree: true
        };
        observer.observe(document.body, observer_options);
      // for Bonkers Mode, start randomizing
      } else if (mode === 'random') {
        setInterval(function() {
          execute(mode);
        }, genius.interval);
      }
      // execute other onload actions
      if (typeof existing === 'function') {
        existing();
      }
    }
  }

}).call(this);
