class SeekBar {
  constructor(id) {
    this.element = document.querySelector(id);
    this.castdebugger = null;
    this.show = false;
    this.speed = 30;
    this.interval = null;
    this.cancelAnimation = false;
    this.initialLeftPosition = this.element.style.left;
  }
  setCastDebugger(castdebugger) {
    this.castdebugger = castdebugger;
  }
  setProgress(time, duration) {
    // this.castdebugger.debug("ele", JSON.stringify(this.element));
    this.element.style.width = (time / duration) * 100 + "%";
    // this.castdebugger.debug("width", this.element.style.width);
  }

  showHide(timing) {
    this.castdebugger.debug("showHide", `${timing} ${this.show}`);
    if (this.show) {
      this.element.parentElement.style.display = "block";
    } else {
      setTimeout(() => {
        this.element.parentElement.style.display = "none";
      }, timing);
    }
  }
  setColor(color) {
    this.element.style.backgroundColor = color;
  }
  animateSeekbar() {
    this.element.style.position = "absolute";

    let totalwidth = this.element.parentElement.clientWidth;
    const innerFunction = () => {
      try {
        let leftPosition = this.element.getBoundingClientRect().left;
        let rightPosition =
          this.element.parentElement.getBoundingClientRect().right;
        let leftParentPosition =
          this.element.parentElement.getBoundingClientRect().left;
        let rightParentPosition =
          this.element.parentElement.getBoundingClientRect().right;

        if (
          this.element.clientWidth <= totalwidth / 4 &&
          leftPosition <= leftParentPosition
        ) {
          this.element.style.width = `${
            this.element.clientWidth + this.speed
          }px`;
        } else {
          if (leftPosition + this.element.clientWidth < rightParentPosition) {
            this.element.style.left = `${leftPosition + this.speed}px`;
          } else {
            if (leftPosition < rightParentPosition) {
              this.element.style.left = `${leftPosition + this.speed}px`;
              this.element.style.width = `${
                this.element.clientWidth - this.speed
              }px`;
            } else {
              this.element.style.left = `${leftParentPosition}px`;
              this.element.style.width = "0px";
            }
          }
        }
        if (this.cancelAnimation) {
          return;
        }
        window.requestAnimationFrame(innerFunction);
      } catch (error) {
        console.log(error);
        console.log(error.toString());
      }
    };
    window.requestAnimationFrame(innerFunction);
  }
  reset() {
    this.cancelAnimation = true;
    this.element.style.width = "0%";
    this.element.style.left = this.initialLeftPosition;
    this.element.style.position = "relative";
  }
}

export default SeekBar;
