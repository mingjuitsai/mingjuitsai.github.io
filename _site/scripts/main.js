/**
 * Polyfill
 */
// Classlist
"document"in self&&("classList"in document.createElement("_")&&(!document.createElementNS||"classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))||function(t){if("Element"in t){t=t.Element.prototype;var e=Object,n=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")},i=Array.prototype.indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1},s=function(t,e){this.name=t,this.code=DOMException[t],this.message=e},r=function(t,e){if(""===e)throw new s("SYNTAX_ERR","The token must not be empty.");if(/\s/.test(e))throw new s("INVALID_CHARACTER_ERR","The token must not contain space characters.");return i.call(t,e)},o=function(t){var e=n.call(t.getAttribute("class")||"");e=e?e.split(/\s+/):[];for(var i=0,s=e.length;s>i;i++)this.push(e[i]);this._updateClassName=function(){t.setAttribute("class",this.toString())}},a=o.prototype=[],c=function(){return new o(this)};if(s.prototype=Error.prototype,a.item=function(t){return this[t]||null},a.contains=function(t){return!~r(this,t+"")},a.add=function(){var t=arguments,e=0,n=t.length,i=!1;do{var s=t[e]+"";~r(this,s)&&(this.push(s),i=!0)}while(++e<n);i&&this._updateClassName()},a.remove=function(){var t,e=arguments,n=0,i=e.length,s=!1;do{var o=e[n]+"";for(t=r(this,o);~t;)this.splice(t,1),s=!0,t=r(this,o)}while(++n<i);s&&this._updateClassName()},a.toggle=function(t,e){var n=this.contains(t),i=n?!0!==e&&"remove":!1!==e&&"add";return i&&this[i](t),!0===e||!1===e?e:!n},a.replace=function(t,e){var n=r(t+"");~n&&(this.splice(n,1,e),this._updateClassName())},a.toString=function(){return this.join(" ")},e.defineProperty){a={get:c,enumerable:!0,configurable:!0};try{e.defineProperty(t,"classList",a)}catch(l){(void 0===l.number||-2146823252===l.number)&&(a.enumerable=!1,e.defineProperty(t,"classList",a))}}else e.prototype.__defineGetter__&&t.__defineGetter__("classList",c)}}(self),function(){var t=document.createElement("_");if(t.classList.add("c1","c2"),!t.classList.contains("c2")){var e=function(t){var e=DOMTokenList.prototype[t];DOMTokenList.prototype[t]=function(t){var n,i=arguments.length;for(n=0;i>n;n++)t=arguments[n],e.call(this,t)}};e("add"),e("remove")}if(t.classList.toggle("c3",!1),t.classList.contains("c3")){var n=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(t,e){return 1 in arguments&&!this.contains(t)==!e?e:n.call(this,t)}}"replace"in document.createElement("_").classList||(DOMTokenList.prototype.replace=function(t,e){var n=this.toString().split(" "),i=n.indexOf(t+"");~i&&(n=n.slice(i),this.remove.apply(this,n),this.add(e),this.add.apply(this,n.slice(1)))}),t=null}());

// Findindex
Array.prototype.findIndex||Object.defineProperty(Array.prototype,"findIndex",{value:function(r){if(null==this)throw new TypeError('"this" is null or not defined');var e=Object(this),t=e.length>>>0;if("function"!=typeof r)throw new TypeError("predicate must be a function");for(var n=arguments[1],o=0;t>o;){var i=e[o];if(r.call(n,i,o,e))return o;o++}return-1}});

/**
 * Plugin
 */
// Szko, simple Promise style typing effect
var Szko=function(e,t){var n=t&&t.speed?t.speed:50;this.ele=e instanceof Element?e:document.querySelector(e),this.initial_string=this.ele.textContent,this["delete"]=function(){var e=this,t=e.ele.textContent,i=new Promise(function(i,s){function o(){l>0?(t=t.slice(0,-1),e.ele.textContent=t,l--,e.ele.classList.contains("removing")||e.ele.classList.add("removing"),setTimeout(function(){o()},n)):(e.ele.classList.contains("removing")&&e.ele.classList.remove("removing"),i(e))}var l=t.length;o()});return i},this.type=function(e){var t=this;if(!t.ele.textContent.length){new Promise(function(i,s){function o(){l<e.length?(t.ele.textContent+=e.charAt(l),l++,t.ele.classList.contains("typing")||t.ele.classList.add("typing"),setTimeout(function(){o()},n)):(t.ele.classList.contains("typing")&&t.ele.classList.remove("typing"),i(t))}var l=0;o()})}}};

/**
 * Helpers
 */
function nodeList_to_array(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

function select_all(q) {
  return nodeList_to_array(document.querySelectorAll(q));
}

// Media element add-on
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function(){
      return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
});



/**
 * App Start
 */
(function() {

  document.addEventListener('DOMContentLoaded', DOM_ready);

  /**
   * Functions
   */

  // DOM Ready
  function DOM_ready() {
    start_descriptions_animation();
    handle_workItem_videos();
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

    // Init Szko typing effect
    // push current heading into heading array data
    descs.forEach( function(desc, index) {
      descs_szko.push(new Szko(desc, {
        speed: 40
      }));
      headings.push(desc.textContent);
    });

    // Start animation loop
    // Fire a quick one then slow it down...
    setTimeout(function() {
      update_description_randomly();

      setInterval(update_description_randomly, 8000);
    }, 4000);

    function update_description_randomly() {
      // Grab random szko instance
      var rand_index = Math.round((Math.random() * (descs_szko.length - 1)));
      // Find filtered heading
      var filtered_heading = headings.filter(function(val) {
        return descs_szko.findIndex(function(szko) { return szko.ele.textContent === val }) === -1;
      });
      // Get next random heading
      var rand_index_heading = Math.round((Math.random() * (filtered_heading.length - 1)));
      var next_heading = filtered_heading[rand_index_heading];
      // Do the typing effect magic
      descs_szko[rand_index].delete().then(function(szko) {
        setTimeout(function() {
          szko.type(next_heading);
        }, 50);
      });
    }
  }

  function handle_workItem_videos() {
    var scroller = scrollama();
    scroller.setup({
      step: '.work-item__video', // required,
      offset: .3
    })
    .onStepEnter(handleVideoEnter)
    .onStepExit(handleVideoExit);


    function handleVideoEnter(data) {
      var video_container = data.element;
      var video = video_container.querySelector('video');

      video_container.classList.add('in-view');

      if(video.played && video.paused) {
        video.play();
      } else if (video.readyState >= video.HAVE_FUTURE_DATA) {
        video.play();
      } else {
        video.addEventListener('canplay', function() {
          video.play();
        });
      }
    }

    function handleVideoExit(data) {
      var video_container = data.element;
      var video = video_container.querySelector('video');

      video_container.classList.remove('in-view');

      if(video.playing) {
        video.pause();
      }
    }

  }

})();