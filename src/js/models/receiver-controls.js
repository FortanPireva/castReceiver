import SeekBar from "./seekbar";
import Timer from "./timer";
class ReceiverControls {
  constructor(id, receiver) {
    this.seekbar = new SeekBar(".seekbar-progress");
    this.timer = new Timer(".timer");
    this.castDebugger = null;
    this.element = document.querySelector(id);
    this.overlay = this.element.parentElement;
    this.info = this.overlay.children[0];
    this.show = true;
    this.loader = document.querySelector(".loader");
    this.playIcon = document.querySelector(".vp-icon-play");
    this.pauseIcon = document.querySelector(".vp-icon-pause");
    this.videoInfo = document.querySelector(".video-info");
    this.splashScreen = document.querySelector(".splash-screen");
    this.thumbnail = document.querySelector("#thumbnail");
    this.receiver = receiver;
  }
  setCastDebugger(castDebugger) {
    this.castDebugger = castDebugger;
    this.seekbar.setCastDebugger(this.castDebugger);
  }
  pause() {
    this.pauseIcon.style.display = "none";
    this.playIcon.style.display = "block";
    setTimeout(() => {
      this.playIcon.style.display = "none";
    }, 2000);
  }
  play() {
    this.playIcon.style.display = "none";
    this.pauseIcon.style.display = "block";
    setTimeout(() => {
      this.pauseIcon.style.display = "none";
    }, 2000);
  }
  update(state) {
    this.seekbar.setProgress(state.currentTime, state.duration);
    this.timer.update(state.currentTime, state.duration);
  }
  hideControls(time) {
    this.show = false;
    this.showHide(time || 5000);
  }
  showControls() {
    this.show = true;
    this.showHide(10);
  }
  resetOverlay() {
    setTimeout(() => {
      this.seekbar.reset();

      this.info.style.display = "none";
    }, 3000);
  }
  showHide(timing) {
    // this.castdebugger.debug("showHide", `${timing} ${this.show}`);
    if (this.show) {
      this.element.style.display = "flex";
    } else {
      setTimeout(() => {
        this.element.style.display = "none";
      }, timing);
    }
  }
  initOverlay(metadata) {
    this.splashScreen.style.display = "none";
    this.overlay.style.display = "block";
    try {
      if (metadata.images.length > 0 && metadata) {
        this.thumbnail.src = metadata.images[0].url;
        this.videoInfo.children[0].textContent = metadata.title;
        this.videoInfo.children[1].textContent = metadata.description;
      }
      this.seekbar.animateSeekbar();
    } catch (error) {}
  }
}

export default ReceiverControls;
