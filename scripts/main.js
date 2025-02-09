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
    const cleanUpTypingEffectHeadings = initTypingEffectHeadings();
    window.addEventListener("unload", cleanUpTypingEffectHeadings);
    handlWorkItemVideos();
  }

  function getRandomFromArray(array) {
    if (!Array.isArray(array)) {
      throw new Error("Input is not an array");
    }
    if (array.length === 0) {
      throw new Error("Array is empty");
    }
    return array[Math.floor(Math.random() * array.length)];
  }

  const ROLES = [
    "Developer",
    "Architect",
    "Creator",
    "Craftsman",
    "Trader",
    "Gamer",
    "Hodler",
    "Explorer",
    "Hooper",
  ];

  // Events
  function initTypingEffectHeadings() {
    const roleRefs = querySelectorAll(".site-description__typing-heading");
    if (roleRefs.length === 0) return;

    // Create a Set for O(1) lookup
    const activeRoles = new Set(roleRefs.map((ref) => ref.textContent));
    let inactiveRoles = ROLES.filter((role) => !activeRoles.has(role));

    const roleTypingEffectRefs = roleRefs.map(
      (ref) => new TypingEffect(ref, { speed: 40 })
    );

    let isAnimating = false;
    const intervalId = setInterval(async () => {
      if (isAnimating) return; // Prevent overlapping animations

      try {
        isAnimating = true;
        const pickedEffectRef = getRandomFromArray(roleTypingEffectRefs);
        const currentRole = pickedEffectRef.element.textContent;

        // Get next role randomly instead of always using first
        const nextRole = getRandomFromArray(inactiveRoles);
        inactiveRoles = inactiveRoles.filter((role) => role !== nextRole);

        await pickedEffectRef.delete();
        // pause to make delete to type animantion smoother
        await new Promise((resolve) => setTimeout(resolve, 50));
        await pickedEffectRef.type(nextRole);

        inactiveRoles.push(currentRole);
      } finally {
        isAnimating = false;
      }
    }, 8000);

    // Cleanup function (should be called when component unmounts)
    return () => clearInterval(intervalId);
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
