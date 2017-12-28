/**
 * Polyfill
 */

/**
 * Plugin
 */
// Szko, simple Promise style typing effect
var Szko=function(t,e){var n=e&&e.speed?e.speed:50;this.ele=t instanceof Element?t:document.querySelector(t),this.initial_string=this.ele.textContent,this["delete"]=function(){var t=this,e=t.ele.textContent,i=new Promise(function(i,o){function s(){c>0?(e=e.slice(0,-1),t.ele.textContent=e,c--,setTimeout(function(){s()},n)):i(t)}var c=e.length;s()});return i},this.type=function(t){var e=this;if(!e.ele.textContent.length){new Promise(function(i,o){function s(){c<t.length?(e.ele.textContent+=t.charAt(c),c++,setTimeout(function(){s()},n)):i(e)}var c=0;s()})}}};

/**
 * Start
 */
(function() {
  /**
   * Helpers
   */
  function nodeList_to_array(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }

  function select_all(q) {
    return nodeList_to_array(document.querySelectorAll(q));
  }

  document.addEventListener('DOMContentLoaded', DOM_ready);

  /**
   * Functions
   */

  // DOM Ready
  function DOM_ready() {
    start_descriptions_animation();
  }

  // Events
  function start_descriptions_animation() {
    var headings = [
      'Bball Devotee',
      'Coffee Lover',
      'Gaming Geek',
      'NBA Follower',
      'Travel Enthusiast',
      'Chillhop Fan'
    ];

    var descs = select_all('.site-description__typing-heading');
    var descs_szko = [];

    descs.forEach( function(desc, index) {
      descs_szko.push(new Szko(desc));
      headings.push(desc.textContent);
    });

    // Start
    setInterval(function() {
      var rand_index = Math.round((Math.random() * (descs_szko.length - 1)));

      var filtered_heading = headings.filter(function(val) {
        return descs_szko.findIndex(function(szko) { return szko.ele.textContent === val }) === -1;
      });

      var rand_index_heading = Math.round((Math.random() * (filtered_heading.length - 1)));
      var next_heading = filtered_heading[rand_index_heading];

      console.log(rand_index_heading);
      console.log(next_heading);

      descs_szko[rand_index].delete().then(function(szko) {
        setTimeout(function() {
          szko.type(next_heading);
        }, 50);
      });

    }, 4000);


  }
})();