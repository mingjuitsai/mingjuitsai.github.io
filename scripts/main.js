/**
 * Plugin
 */
// Szko, simple Promise style typing effect
var Szko = function (e, t) {
  var n = t && t.speed ? t.speed : 50;
  (this.ele = e instanceof Element ? e : document.querySelector(e)),
    (this.initial_string = this.ele.textContent),
    (this["delete"] = function () {
      var e = this,
        t = e.ele.textContent,
        i = new Promise(function (i, s) {
          function o() {
            l > 0
              ? ((t = t.slice(0, -1)),
                (e.ele.textContent = t),
                l--,
                e.ele.classList.contains("removing") ||
                  e.ele.classList.add("removing"),
                setTimeout(function () {
                  o();
                }, n))
              : (e.ele.classList.contains("removing") &&
                  e.ele.classList.remove("removing"),
                i(e));
          }
          var l = t.length;
          o();
        });
      return i;
    }),
    (this.type = function (e) {
      var t = this;
      if (!t.ele.textContent.length) {
        new Promise(function (i, s) {
          function o() {
            l < e.length
              ? ((t.ele.textContent += e.charAt(l)),
                l++,
                t.ele.classList.contains("typing") ||
                  t.ele.classList.add("typing"),
                setTimeout(function () {
                  o();
                }, n))
              : (t.ele.classList.contains("typing") &&
                  t.ele.classList.remove("typing"),
                i(t));
          }
          var l = 0;
          o();
        });
      }
    });
};

/**
 * Helpers
 */
function nodeListToArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

function querySelectorAll(q) {
  return nodeListToArray(document.querySelectorAll(q));
}

// Media element add-on
Object.defineProperty(HTMLMediaElement.prototype, "playing", {
  get: function () {
    return !!(
      this.currentTime > 0 &&
      !this.paused &&
      !this.ended &&
      this.readyState > 2
    );
  },
});

/**
 * App Start
 */
(function () {
  document.addEventListener("DOMContentLoaded", DOM_ready);

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
    var headings = ["Hooper", "Coffee Lover", "Gamer", "Trader"];

    var descs = querySelectorAll(".site-description__typing-heading");
    var descs_szko = [];

    // Init Szko typing effect
    // push current heading into heading array data
    descs.forEach(function (desc, index) {
      descs_szko.push(
        new Szko(desc, {
          speed: 40,
        })
      );
      headings.push(desc.textContent);
    });

    // Start animation loop
    // Fire a quick one then slow it down...
    setTimeout(function () {
      update_description_randomly();

      setInterval(update_description_randomly, 8000);
    }, 4000);

    function update_description_randomly() {
      // Grab random szko instance
      var rand_index = Math.round(Math.random() * (descs_szko.length - 1));
      // Find filtered heading
      var filtered_heading = headings.filter(function (val) {
        return (
          descs_szko.findIndex(function (szko) {
            return szko.ele.textContent === val;
          }) === -1
        );
      });
      // Get next random heading
      var rand_index_heading = Math.round(
        Math.random() * (filtered_heading.length - 1)
      );
      var next_heading = filtered_heading[rand_index_heading];
      // Do the typing effect magic
      descs_szko[rand_index].delete().then(function (szko) {
        setTimeout(function () {
          szko.type(next_heading);
        }, 50);
      });
    }
  }

  function handle_workItem_videos() {
    var scroller = scrollama();
    scroller
      .setup({
        step: ".work-item__video", // required,
        offset: 0.3,
      })
      .onStepEnter(handleVideoEnter)
      .onStepExit(handleVideoExit);

    function handleVideoEnter(data) {
      var video_container = data.element;
      var video = video_container.querySelector("video");

      video_container.classList.add("in-view");

      if (video.played && video.paused) {
        video.play();
      } else if (video.readyState >= video.HAVE_FUTURE_DATA) {
        video.play();
      } else {
        video.addEventListener("canplay", function () {
          video.play();
        });
      }
    }

    function handleVideoExit(data) {
      var video_container = data.element;
      var video = video_container.querySelector("video");

      video_container.classList.remove("in-view");

      if (video.playing) {
        video.pause();
      }
    }
  }
})();
