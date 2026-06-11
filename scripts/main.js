/**
 * TypingEffect
 */
class TypingEffect {
  constructor(element, options = {}) {
    this.element =
      element instanceof Element ? element : document.querySelector(element);
    this.speed = options.speed || 50;
    this.initialText = this.element.textContent;
  }

  delete() {
    return new Promise((resolve) => {
      const deleteChar = () => {
        const currentText = this.element.textContent;
        if (currentText.length === 0) {
          this.element.classList.remove("removing");
          resolve(this);
          return;
        }

        this.element.classList.add("removing");
        this.element.textContent = currentText.slice(0, -1);
        setTimeout(deleteChar, this.speed);
      };

      deleteChar();
    });
  }

  type(text) {
    return new Promise((resolve) => {
      if (this.element.textContent.length > 0) {
        resolve(this);
        return;
      }

      let currentIndex = 0;
      const typeChar = () => {
        if (currentIndex >= text.length) {
          this.element.classList.remove("typing");
          resolve(this);
          return;
        }

        this.element.classList.add("typing");
        this.element.textContent += text[currentIndex];
        currentIndex++;
        setTimeout(typeChar, this.speed);
      };

      typeChar();
    });
  }
}

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
    handlWorkItemVideos();
  }

  function handlWorkItemVideos() {
    const scroller = scrollama();
    scroller
      .setup({
        step: ".work-item__video", // required,
        offset: 0.3,
      })
      .onStepEnter(handleVideoEnter)
      .onStepExit(handleVideoExit);

    function handleVideoEnter(data) {
      const video_container = data.element;
      const video = video_container.querySelector("video");

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
      const video_container = data.element;
      const video = video_container.querySelector("video");

      video_container.classList.remove("in-view");

      if (video.playing) {
        video.pause();
      }
    }
  }
})();
