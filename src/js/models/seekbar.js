class SeekBar {
  constructor(id) {
    this.element = document.querySelector(id);
    this.castdebugger = null;
    this.show = false;
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
  animateSeekbar() {
    let totalwidth = this.element.parentElement.clientWidth;

    let interval = clearInterval(() => {
      let leftPosition = this.element.getBoundingClientRect().left;
      let leftParentPosition = this.element.getBoundingClientRect().left;
      let rightParentPosition = this.element.getBoundingClientRect().right;
      if (this.element.clientWidth >= totalwidth / 5) {
        this.element.style.width = `${this.element.clientWidth + 10}px`;
      } else {
        if (leftPosition < rightParentPosition) {
          this.element.style.left = `${leftPosition + 10}px`;
        } else {
          this.element.style.left = `${leftParentPosition}px`;
          this.element.style.width = "0px";
        }
      }
    }, 10);
  }
}

export default SeekBar;
