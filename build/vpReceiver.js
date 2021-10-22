/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/config/defaultConfig.js":
/*!****************************************!*\
  !*** ./src/js/config/defaultConfig.js ***!
  \****************************************/
/***/ ((module) => {

const defaulConfig = {
  adTimeSliderColor: "yellow",
  timeSliderColor: "#194694"
};
module.exports = defaulConfig;

/***/ }),

/***/ "./src/js/config/environment.js":
/*!**************************************!*\
  !*** ./src/js/config/environment.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const isDevelopment = "true" === "true";
console.log("isDevelopment", isDevelopment);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isDevelopment
});

/***/ }),

/***/ "./src/js/config/hlsConfig.js":
/*!************************************!*\
  !*** ./src/js/config/hlsConfig.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const config = {
  debug: false,
  maxBufferSize: 20971520,
  maxLoadingDelay: 2,
  nudgeMaxRetry: 2,
  liveSyncDurationCount: 3,
  liveMaxLatencyDurationCount: Infinity,
  manifestLoadingMaxRetry: 1,
  manifestLoadingRetryDelay: 1000,
  manifestLoadingMaxRetryTimeout: 2000,
  emeEnabled: true,
  // startLevel: 3,
  // autoLevelCapping: 3,
  widevineLicenseUrl: "https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=90FC04"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);

/***/ }),

/***/ "./src/js/helpers/Utils.js":
/*!*********************************!*\
  !*** ./src/js/helpers/Utils.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const formatTime = time => {
  if (!time) return "00:00";
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time - hours * 3600) / 60);
  let seconds = Math.floor(time % 60); // format the minutes and seconds string to look consistent across all values

  if (!hours) {
    return minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
  }

  return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
}; // Fire custom event


const fire = (el, eventName, detail = null, bubbles = true, cancelable = true) => {
  let evt = new CustomEvent(eventName, {
    detail,
    bubbles,
    cancelable
  });
  el.dispatchEvent(evt);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  formatTime,
  fire
});

/***/ }),

/***/ "./src/js/models/adUI.js":
/*!*******************************!*\
  !*** ./src/js/models/adUI.js ***!
  \*******************************/
/***/ ((module) => {

class AdUI {
  constructor(receiver) {
    this.receiver = receiver;
    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
  }

  enable() {
    console.log(this.receiver.config.adTimeSliderColor);
    this.receiver.receiverControls.seekbar.setColor(this.receiver.config.adTimeSliderColor);
  }

  disable() {
    this.receiver.receiverControls.seekbar.setColor(this.receiver.config.timeSliderColor);
  }

}

module.exports = AdUI;

/***/ }),

/***/ "./src/js/models/receiver-controls.js":
/*!********************************************!*\
  !*** ./src/js/models/receiver-controls.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _seekbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./seekbar */ "./src/js/models/seekbar.js");
/* harmony import */ var _timer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./timer */ "./src/js/models/timer.js");



class ReceiverControls {
  constructor(id, receiver) {
    this.seekbar = new _seekbar__WEBPACK_IMPORTED_MODULE_0__["default"](".seekbar-progress");
    this.timer = new _timer__WEBPACK_IMPORTED_MODULE_1__["default"](".timer");
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

  resetOverlay(timeout) {
    const reset = () => {
      this.seekbar.reset();
      this.info.style.display = "none";
    };

    if (!timeout) return setTimeout(reset, 3000);
    return reset();
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReceiverControls);

/***/ }),

/***/ "./src/js/models/receiver.js":
/*!***********************************!*\
  !*** ./src/js/models/receiver.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _config_defaultConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/defaultConfig */ "./src/js/config/defaultConfig.js");
/* harmony import */ var _config_defaultConfig__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_config_defaultConfig__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_hlsConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/hlsConfig */ "./src/js/config/hlsConfig.js");
/* harmony import */ var _receiver_controls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./receiver-controls */ "./src/js/models/receiver-controls.js");
/* harmony import */ var _vastService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./vastService */ "./src/js/models/vastService.js");
/* harmony import */ var _config_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config/environment */ "./src/js/config/environment.js");






class Receiver {
  constructor(id, config) {
    this.context = null;
    this.playerManager = null;
    this.castDebugLogger = null;
    this.appId = config.appId;
    this.video = document.querySelector(id);
    this.playbackConfig = null;
    this.controls = null;
    this.hls = null;
    this.videoObject = {};
    this.videoContainer = this.video.parentElement;
    this.playbackRate = 1;
    this.autoplay = false;
    this.receiverControls = new _receiver_controls__WEBPACK_IMPORTED_MODULE_2__["default"](".controls", this);
    this.mediaManager = null;
    this.castReceiverManager = null;
    this.videoStarted = false;
    this.vastService = new _vastService__WEBPACK_IMPORTED_MODULE_3__["default"](this);
    this.config = {};
    this.adBreaks = [];
    this.debugTags = {
      LOAD_REQUEST: "LOAD_REQUEST",
      ATTACH_MEDIA: "ATTACH_MEDIA",
      ONPLAY: "ON_PLAY",
      START: "START",
      INIT: "INIT",
      EVENTS: "EVENTS",
      ONEND: "ONEND",
      BROADCAST: "BROADCAST",
      ONTIMEUPDATEE: "ONTIMEUPDATE",
      INITSTATE: "INITSTATE"
    };
    this.config = { ...(_config_defaultConfig__WEBPACK_IMPORTED_MODULE_0___default()),
      ...config
    };
    this.isAdPlaying = false;
    this.NAMESPACE = "urn:x-cast:tech.gjirafa.vp-service";
    this.receiverControls = new _receiver_controls__WEBPACK_IMPORTED_MODULE_2__["default"](".controls", this);
  }

  start() {
    this.receiverControls.resetOverlay();
    this.castDebugLogger.debug(this.debugTags.START, "Starting video...");
    this.broadcast(this.debugTags.START + "Starting video...");
    this.onPlay();
  }

  onPlay(data) {
    this.castDebugLogger.debug("on play", this.video.getAttribute("src"));
    this.broadcast("on play" + this.video.getAttribute("src"));
    this.castDebugLogger.debug("isadplaying", this.isAdPlaying);

    if (!this.isAdPlaying) {
      this.video.play().then(() => {
        if (!this.videoStarted) {
          this.receiverControls.showControls();
          this.videoStarted = true;
        } else {
          this.receiverControls.play();
        }

        this.receiverControls.show = false;
        this.receiverControls.showHide(2000);
        return data;
      }).catch(e => {
        this.castDebugLogger.debug(this.debugTags.ONPLAY, " Couldn't play video.Tring one more time " + e);
        this.onPause();
        this.broadcast(" Couldn't play video.Tring one more time " + e.toString());
        this.video.play().catch(e => this.castDebugLogger.debug(this.debugTags.ONPLAY, " not working"));
      });
    } else this.vastService.resume();
  }

  onPause(data) {
    if (!this.isAdPlaying) this.video.pause();else {
      this.vastService.pause();
    }
    this.receiverControls.pause();
    this.receiverControls.showControls();
    return data;
  }

  addPlayerEvents() {
    this.video.addEventListener("timeupdate", this.onTimeUpdate);
    this.video.addEventListener("ended", this.onEnd.bind(this));
  }

  broadcast(message, required) {
    this.castDebugLogger.debug(this.debugTags.BROADCAST, _config_environment__WEBPACK_IMPORTED_MODULE_4__["default"].isDevelopment); // if (!required && !Environment.isDevelopment) return;

    this.castDebugLogger.debug(this.debugTags.BROADCAST, message);
    if (this.context) this.context.sendCustomMessage(this.NAMESPACE, undefined, message);
  }

  onEnd() {
    this.castDebugLogger.debug("on End", this.config.replay);

    try {
      if (this.isAdPlaying) {
        this.broadcast({
          message: "Ad finished",
          code: 2,
          time: this.currentTime
        }, true);

        if (this.hls) {
          this.hls.destroy();
        }

        this.isAdPlaying = false;
      } else {
        this.broadcast({
          message: "Video finished",
          code: 3
        }, true);
      }
    } catch (error) {
      this.castDebugLogger.error(this.debugTags.ONEND, " Error" + error.toString());
    }

    return null;
  }

  onTimeUpdate() {
    if (this.isAdPlaying) return;

    try {
      if (this.adBreaks.map(ad => ad.breakTimingValue).includes(Math.floor(this.video.currentTime)) && !this.isAdPlaying) {
        this.broadcast(this.adBreaks);
        this.onPause();
        this.currentTime = Math.floor(this.video.currentTime);
        this.isAdPlaying = true;
        this.vastService.loadAds(this.adBreaks[0].adTagUrl[0]);

        if (this.hls) {
          this.hls.destroy();
        }

        this.adBreaks.shift(); // this.hls.destroy();

        return;
      }
    } catch (error) {
      this.castDebugLogger.error(this.debugTags.ONTIMEUPDATE, error.toString());
    }

    this.receiverControls.update(this.updatePlayerState());
  }

  updatePlayerState() {
    return {
      currentTime: this.video.currentTime,
      duration: this.videoObject.duration || this.video.duration
    };
  }

  attachMedia() {
    vpReceiver.HLSsupported = Hls.isSupported();
    this.castDebugLogger.debug("inside attach media", vpReceiver.HLSsupported);
    this.video.playbackRate = 1;
    this.castDebugLogger.debug("video file", JSON.stringify(this.video, ["id", "className", "tagName"]));
    this.broadcast({
      message: "video file" + JSON.stringify(this.video, ["id", "className", "tagName"])
    });

    if (this.videoObject.file.endsWith("mp4")) {
      this.castDebugLogger.debug("inside mp4", this.videoObject.file);
      this.video.src = this.videoObject.file;
      this.start();
    } else if (this.videoObject.file.endsWith("mpd")) {
      //create source and append to video
      try {
        let dash = dashjs.MediaPlayer().create();
        this.castDebugLogger.debug("DASH - playerinitialized", dash);
        dash.setProtectionData({
          "com.widevine.alpha": {
            serverURL: "https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=90FC04"
          }
        });
        dash.initialize(this.video, this.videoObject.file, true);
        this.start();
      } catch (error) {
        this.castDebugLogger.debug("DASH", error.toString());
      }
    } else if (vpReceiver.HLSsupported) {
      this.castDebugLogger.debug("inside hlssupported", this.videoObject.file);

      try {
        this.hls = new Hls(_config_hlsConfig__WEBPACK_IMPORTED_MODULE_1__["default"]);
        this.castDebugLogger.debug("hls initialized", this.videoObject.file);
        this.broadcast({
          message: "hls initialized " + this.videoObject.file
        });
        console.log("attachMedia " + this.currentTime);
        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          this.castDebugLogger.debug("amedia attached", this.videoObject.file);
          this.castDebugLogger.debug("loading source hlssupported", this.videoObject.file);

          if (this.currentTime > 0) {
            this.video.currentTime = this.currentTime;
          }

          this.hls.loadSource(this.videoObject.file);
        });
        this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          this.castDebugLogger.debug("manifest parsed", this.videoObject.file);

          if (this.currentTime > 0) {
            this.video.currentTime = this.currentTime;
          }

          this.start();
        });
        this.hls.on(Hls.Events.ERROR, (event, data) => {
          this.castDebugLogger.debug("HLS  ERROR", data.details);
          this.broadcast({
            message: "HLS  ERROR",
            details: data.details
          });
        });
        this.hls.attachMedia(this.video);
      } catch (error) {
        this.castDebugLogger.debug("DASH- error", error.toString());
      }
    }

    this.castDebugLogger.debug("finished attach media");
  }

  fakeinit() {
    let self = this;
    this.castDebugLogger = {
      debug: function (type, message) {
        if (typeof message === "object") {
          if (message.code == 2) {
            self.video.currentTime = message.time;
            setTimeout(() => {
              // if (self.hls) {
              //   self.hls.destroy();
              //   self.vastService.adUI.disable();
              //   self.initState();
              // }
              self.attachMedia();
            }, 700);
          }
        }

        console.log(type, message);
      },
      error: function (type, message) {
        console.log(type, message);
      }
    };
    this.receiverControls.setCastDebugger(this.castDebugLogger);
    this.videoObject.file = "http://blob.gjirafa.com/kviffcz/media/y1qgkx36/packaged/index.mpd";
    this.videoObject.duration = 119;
    this.receiverControls.seekbar.animateSeekbar();
    this.receiverControls.initOverlay({
      title: "Some title",
      images: [{
        url: "https://liki.gjirafa.com/api/media/gjvideo/yqz0gq/retina.jpg"
      }]
    });
    this.adBreaks = [{
      breakType: "midroll",
      adTagUrl: ["https://vp-dev.gjirafa.net/vps/content/vast/preroll-2.xml"],
      breakTimingType: "time",
      breakTimingValue: 15
    }, {
      breakType: "midroll",
      adTagUrl: ["https://vp-dev.gjirafa.net/vps/content/vast/preroll-2.xml"],
      breakTimingType: "time",
      breakTimingValue: 30
    }], setTimeout(() => {
      this.attachMedia();
    }, 5000);
    this.bindMethods();
    this.addPlayerEvents();
  }

  init() {
    this.context = cast.framework.CastReceiverContext.getInstance();
    this.context.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
    this.castDebugLogger = cast.debug.CastDebugLogger.getInstance();
    this.castDebugLogger.setEnabled(_config_environment__WEBPACK_IMPORTED_MODULE_4__["default"].isDevelopment);
    this.castDebugLogger.debug(this.debugTags.INIT, "castdebugger initialized");
    this.playerManager = this.context.getPlayerManager();
    this.playerManager.setMediaElement(this.video);
    this.playerManager.setSupportedMediaCommands(cast.framework.messages.Command.SEEK | cast.framework.messages.Command.PAUSE | cast.framework.messages.Command.PLAY); // browse content area

    const controls = cast.framework.ui.Controls.getInstance();
    const item1 = new cast.framework.ui.BrowseItem();
    item1.title = "Title 1";
    item1.subtitle = "Subtitle 1";
    item1.duration = 300;
    item1.imageType = cast.framework.ui.BrowseImageType.MUSIC_TRACK;
    item1.image = new cast.framework.messages.Image("1.jpg");
    item1.entity = "example://gizmos/1";
    const item2 = new cast.framework.ui.BrowseItem();
    item2.title = "Title 2";
    item2.subtitle = "Subtitle 2";
    item2.duration = 100;
    item2.imageType = cast.framework.ui.BrowseImageType.MUSIC_TRACK;
    item2.image = new cast.framework.messages.Image("2.jpg");
    item2.entity = "example://gizmos/2";
    const items = [item1, item2];
    const browseContent = new cast.framework.ui.BrowseContent();
    browseContent.title = "Up Next";
    browseContent.items = items;
    this.receiverControls.setCastDebugger(this.castDebugLogger);
    const options = new cast.framework.CastReceiverOptions(); // Map of namespace names to their types.

    options.customNamespaces = {};
    options.customNamespaces[this.NAMESPACE] = cast.framework.system.MessageType.JSON; // const playbackConfig = new cast.framework.PlaybackConfig();
    // // Customize the license url for playback
    // playbackConfig.protectionSystem = cast.framework.ContentProtection.WIDEVINE;
    // playbackConfig.licenseRequestHandler = (requestInfo) => {
    //   requestInfo.withCredentials = false;
    // };
    // // Update playback config licenseUrl according to provided value in load request.
    // this.playerManager.setMediaPlaybackInfoHandler(
    //   (loadRequest, playbackConfig) => {
    //     if (
    //       loadRequest.media.customData &&
    //       loadRequest.media.customData.licenseUrl
    //     ) {
    //       playbackConfig.licenseUrl = loadRequest.media.customData.licenseUrl;
    //     }
    //     return playbackConfig;
    //   }
    // );
    // options.playbackConfig = playbackConfig;
    // this.castDebugLogger.debug("licenseUrl", playbackConfig.licenseUrl);
    // Starting cast

    this.context.start(options);
    this.bindMethods();
    this.bindInterceptors();
    this.addPlayerEvents();
  }

  onSeek(requestData) {
    this.broadcast(requestData.toString());
    this.video.currentTime = requestData.currentTime;
    this.receiverControls.showControls();
    this.receiverControls.hideControls(6000);
    this.receiverControls.update(this.updatePlayerState());
  }

  drawButtons() {
    this.controls.assignButton(cast.framework.ui.ControlsSlot.SLOT_SECONDARY_1, cast.framework.ui.ControlsButton.QUEUE_PREV);
    this.controls.assignButton(cast.framework.ui.ControlsSlot.SLOT_PRIMARY_1, cast.framework.ui.ControlsButton.CAPTIONS);
    this.controls.assignButton(cast.framework.ui.ControlsSlot.SLOT_PRIMARY_2, cast.framework.ui.ControlsButton.SEEK_FORWARD_15);
    this.controls.assignButton(cast.framework.ui.ControlsSlot.SLOT_SECONDARY_2, cast.framework.ui.ControlsButton.QUEUE_NEXT);
  }

  bindInterceptors() {
    this.context.addEventListener(cast.framework.system.EventType.SENDER_DISCONNECTED, event => {
      window.close();
    });
    this.context.addCustomMessageListener(this.NAMESPACE, event => {
      this.castDebugLogger.debug(this.debugTags.EVENTS, "addCustomMessageListener" + event.data);
      let message = JSON.parse(event.data);

      if (message.code == 2) {
        this.attachMedia();
      }
    });
    this.playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, this.onLoadRequest.bind(this));
    this.playerManager.setMessageInterceptor(cast.framework.messages.MessageType.PLAY, this.onPlay.bind(this));
    this.playerManager.setMessageInterceptor(cast.framework.messages.MessageType.PAUSE, this.onPause.bind(this));
    this.playerManager.setMessageInterceptor(cast.framework.messages.MessageType.SEEK, this.onSeek.bind(this));
  }

  bindMethods() {
    this.bindInterceptors = this.bindInterceptors.bind(this);
    this.onLoadRequest = this.onLoadRequest.bind(this);
    this.attachMedia = this.attachMedia.bind(this);
    this.start = this.start.bind(this);
    this.addPlayerEvents = this.addPlayerEvents.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.updatePlayerState = this.updatePlayerState.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.initState = this.initState.bind(this);
  }

  initState() {
    this.castDebugLogger.debug(this.debugTags.INITSTATE, "initState");
    this.hls = null;
    this.currentTime = 0;
    this.video.currentTime = 0;
    this.receiverControls.resetOverlay(true);
  }

  onLoadRequest(loadRequestData) {
    if (this.hls) {
      this.hls.destroy();
      this.vastService.adUI.disable();
      this.initState();
    }

    this.receiverControls.initOverlay(loadRequestData.media.metadata);
    this.castDebugLogger.debug("VPreceiver", loadRequestData.media.contentId);
    this.castDebugLogger.debug("VPreceiver1", Hls.isSupported());
    this.videoObject.file = loadRequestData.media.contentId;
    this.videoObject.duration = loadRequestData.media.metadata.duration;
    this.currentTime = loadRequestData.currentTime;
    this.playbackRate = loadRequestData.playbackRate;
    this.autoplay = loadRequestData.autoplay;
    if (loadRequestData.requireAds) this.adBreaks = loadRequestData.customData.adBreaks; // try {

    this.config.replay = typeof loadRequestData.replay !== "undefined" ? loadRequestData.replay : true;

    try {
      this.attachMedia();
      this.receiverControls.update(this.updatePlayerState());
      this.broadcast({
        message: "attaching media"
      });
    } catch (error) {
      this.broadcast({
        message: error.toString(),
        stack: error.stack
      });
    }

    return null;
  }

  addBreaks(mediaInformation) {
    castDebugLogger.debug(LOG_RECEIVER_TAG, "addBreaks: " + JSON.stringify(mediaInformation));
    return fetchMediaById("fbb_ad").then(clip1 => {
      mediaInformation.breakClips = [{
        id: "fbb_ad",
        title: clip1.title,
        contentUrl: clip1.stream.dash,
        contentType: "application/dash+xml",
        whenSkippable: 5
      }];
      mediaInformation.breaks = [{
        id: "pre-roll",
        breakClipIds: ["fbb_ad"],
        position: 0
      }];
    });
  }

  fetchMediaById(id) {
    castDebugLogger.debug(LOG_RECEIVER_TAG, "fetching id: " + id);
    return new Promise((accept, reject) => {
      fetch(CONTENT_URL).then(response => response.json()).then(obj => {
        if (obj) {
          if (obj[id]) {
            accept(obj[id]);
          } else {
            reject(`${id} not found in repository`);
          }
        } else {
          reject("Content repository not found.");
        }
      });
    });
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Receiver);

/***/ }),

/***/ "./src/js/models/seekbar.js":
/*!**********************************!*\
  !*** ./src/js/models/seekbar.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
    this.element.style.width = time / duration * 100 + "%"; // this.castdebugger.debug("width", this.element.style.width);
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
        let rightPosition = this.element.parentElement.getBoundingClientRect().right;
        let leftParentPosition = this.element.parentElement.getBoundingClientRect().left;
        let rightParentPosition = this.element.parentElement.getBoundingClientRect().right;

        if (this.element.clientWidth <= totalwidth / 4 && leftPosition <= leftParentPosition) {
          this.element.style.width = `${this.element.clientWidth + this.speed}px`;
        } else {
          if (leftPosition + this.element.clientWidth < rightParentPosition) {
            this.element.style.left = `${leftPosition + this.speed}px`;
          } else {
            if (leftPosition < rightParentPosition) {
              this.element.style.left = `${leftPosition + this.speed}px`;
              this.element.style.width = `${this.element.clientWidth - this.speed}px`;
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SeekBar);

/***/ }),

/***/ "./src/js/models/timer.js":
/*!********************************!*\
  !*** ./src/js/models/timer.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/Utils */ "./src/js/helpers/Utils.js");


class Timer {
  constructor(id) {
    this.element = document.querySelector(id);
    this.element.textContent = "00:00 / 00:00";
  }

  update(currentTime, duration) {
    this.element.textContent = `${_helpers_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].formatTime(currentTime)} /${_helpers_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].formatTime(duration)}`;
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Timer);

/***/ }),

/***/ "./src/js/models/vastService.js":
/*!**************************************!*\
  !*** ./src/js/models/vastService.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _adUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adUI */ "./src/js/models/adUI.js");
/* harmony import */ var _adUI__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_adUI__WEBPACK_IMPORTED_MODULE_0__);


class VastService {
  static DEBUG_VAST_SERVICE = "DEBUG_VAST_SERVICE";

  constructor(receiver) {
    this.receiver = receiver;
    this.adContainer = document.querySelector(".adContainer");
    this.adsDisplayContainer = null;
    this.adsLoader = null;
    this.adsDisplayInitialized = false;
    this.currentAds = null;
    this.initialized = false;
    this.autoplayAllowed = false;
    this.autoplayRequiresMuted = false;
    this.hasErrors = false;
    this.adUI = null;
    this.adDuration = 0;
  }

  init() {
    this.initialized = true;
    google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);
    this.adsDisplayContainer = new google.ima.AdDisplayContainer(this.adContainer, this.receiver.video);
    this.adsLoader = new google.ima.AdsLoader(this.adsDisplayContainer);
    this.adsLoader.getSettings().setPlayerType("cast/client-side");
    this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdsManagerLoaded.bind(this), false);
    this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, false);
    this.adUI = new (_adUI__WEBPACK_IMPORTED_MODULE_0___default())(this.receiver);
  }

  onAllAdsCompleted(e) {
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, "ad completed");
  }

  onAdCompleted(e) {
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, "ad completed");
    this.adUI.disable();
    if (this.adsManager) this.adsManager.destroy();
    if (!this.hasErrors && this.receiver.isAdPlaying) this.receiver.onEnd(); // this.adsManager.destroy();
    // this.receiver.playerManager.s`etMediaElement(this.video);
  }

  onContentPauseRequested(e) {
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, "Content Pause Request");
  }

  onContentResumeRequested() {
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, "Content Resume Request");
  }

  onAdLoaded(e) {
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, "Ad loaded");
  }

  loadAds(vastUrl, vastXml) {
    this.currentAds = {};

    if (!this.initialized) {
      this.init();
    }

    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, "load " + vastUrl);

    if (vastUrl) {
      this.currentAds.content = vastUrl;
      this.currentAds.type = "url";
    } else if (vastXml) {
      this.currentAds.content = vastXml;
      this.currentAds.type = "xml";
    }

    this.currentAds.currentAdIndex = 0;
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE);
    if (this.currentAds.type === "url") this.load(this.currentAds.content);else this.load(null, this.currentAds.content);
  }

  load(vastUrl, vastXml) {
    if (!this.initialized) this.init();
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, "Initialized" + this.vastUrl);
    this.adsRequest = new google.ima.AdsRequest();

    if (vastUrl) {
      this.adsRequest.adTagUrl = vastUrl;
    } else if (vastXml) {
      this.adsRequest.adsResponse = vastXml;
    } else {
      return;
    }

    this.adsRequest.linearAdSlotWidth = this.receiver.video.clientWidth;
    this.adsRequest.linearAdSlotHeight = this.receiver.video.clientHeight;
    this.adsRequest.nonLinearAdSlotWidth = this.receiver.video.clientWidth;
    this.adsRequest.nonLinearAdSlotHeight = this.receiver.video.clientHeight / 3;
    this.adsRequest.setAdWillAutoPlay(this.autoplayAllowed);
    this.adsRequest.setAdWillPlayMuted(this.autoplayRequiresMuted);
    this.adsRequest.vastLoadTimeout = 8000;
    this.adsLoader.requestAds(this.adsRequest);
  }

  onTimeUpdate(event) {
    const adData = event.getAdData();
    const currentAd = this.adsManager.getCurrentAd();
    let adId = currentAd?.getAdId()?.toString();
    this.receiver.receiverControls.update({
      currentTime: adData.currentTime,
      duration: adData.duration // ad: adIndexInfo,

    });
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " ON TIME UPDATE");
  }

  onAdSkip(e) {
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, "ON AD Ski");
  }

  onAdStarted(e) {
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, "ON AD STARTED");
    this.receiver.isAdPlaying = true;
    this.adUI.enable();
  }

  onAdsManagerLoaded(adsManagerLoadedEvent) {
    if (this.adsManager) {
      this.adsManager.destroy();
    }

    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " before getadsmanager");
    const adsRenderingSettings = new google.ima.AdsRenderingSettings();
    this.adsManager = adsManagerLoadedEvent.getAdsManager(this.receiver.video, adsRenderingSettings);
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " after getadsmanager");
    this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError.bind(this));
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " after onaderror");
    this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onContentPauseRequested.bind(this));
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " after onContentPauseRequested");
    this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.onContentResumeRequested.bind(this));
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " after onAllAdsCompleted");
    this.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, this.onAllAdsCompleted.bind(this));
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " after onAdLoaded");
    this.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, this.onAdLoaded.bind(this));
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " after onAdStarted");
    this.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, this.onAdStarted.bind(this));
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " after onAdCompleted");
    this.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, this.onAdCompleted.bind(this));
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " after onContentPauseRequested");
    this.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, this.onAdSkip.bind(this));
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " after onAdSkip");
    this.adsManager.addEventListener(google.ima.AdEvent.Type.AD_PROGRESS, this.onTimeUpdate.bind(this));
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " after onTimeUpdate");
    this.adsManager.addEventListener(google.ima.AdEvent.Type.AD_BUFFERING, () => {
      this.loading = true;
    });
    this.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED, () => {
      Utils.fire(this.adContainer, Events.adEvents.AD_SKIPPABLE, {
        currentTime: this.player.video.currentTime,
        adPlayId: this.adsManager.getCurrentAd()?.getAdId()
      });
    });
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " just before playing ad");
    this.playAds();
  }

  playAds() {
    if (!this.adsDisplayInitialized) {
      this.adsDisplayContainer.initialize();
      this.adsDisplayInitialized = true;
    }

    const width = this.receiver.video.clientWidth;
    const height = this.receiver.video.clientHeight;

    try {
      this.receiver.isAdPlaying = true;
      this.adsManager.init(width, height, google.ima.ViewMode.FULLSCREEN);
      this.adsManager.start();
      this.receiver.receiverControls.loader.style.display = "none";
    } catch (adError) {
      this.receiver.castDebugLogger.debug(this.VastService.DEBUG_VAST_SERVICE, "AdsManager could not be started" + adError.getMessage());
    }
  }

  onAdError(e) {
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, " ad error" + e);
    this.hasErrors = true;
    this.receiver.onEnd().bind(this.receiver);
  }

  resume() {
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, "RESUMING AD Event");
    if (!this.adsManager) return;
    this.adsManager.resume();
  }

  pause() {
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE, "PAUSE AD Event");
    if (!this.adsManager) return;
    this.adsManager.pause();
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VastService);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************************!*\
  !*** ./src/js/vpReceiver.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_receiver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/receiver */ "./src/js/models/receiver.js");
 //a boolean telling whether HLS is supported in the browser

vpReceiver.HLSsupported = false;

function vpReceiver(id, config) {
  let receiver = new _models_receiver__WEBPACK_IMPORTED_MODULE_0__["default"](id, config);
  receiver.fakeinit();
  vpReceiver.receiver = receiver;
  return receiver;
}

window.vpReceiver = vpReceiver;
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFBTCxDQUFnQnhRLEtBQWhCO0FBQ0Q7O0FBcFRlOztBQXVUbEIsaUVBQWU2QixXQUFmOzs7Ozs7VUN4VEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Q0NKQTs7QUFDQWdFLFVBQVUsQ0FBQ0MsWUFBWCxHQUEwQixLQUExQjs7QUFFQSxTQUFTRCxVQUFULENBQW9CL0csRUFBcEIsRUFBd0IzQyxNQUF4QixFQUFnQztBQUM5QixNQUFJaUMsUUFBUSxHQUFHLElBQUkyRCx3REFBSixDQUFhakQsRUFBYixFQUFpQjNDLE1BQWpCLENBQWY7QUFDQWlDLEVBQUFBLFFBQVEsQ0FBQ2dKLFFBQVQ7QUFDQXZCLEVBQUFBLFVBQVUsQ0FBQ3pILFFBQVgsR0FBc0JBLFFBQXRCO0FBQ0EsU0FBT0EsUUFBUDtBQUNEOztBQUVENk0sTUFBTSxDQUFDcEYsVUFBUCxHQUFvQkEsVUFBcEIsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3ZwLXJlY2VpdmVyLy4vc3JjL2pzL2NvbmZpZy9kZWZhdWx0Q29uZmlnLmpzIiwid2VicGFjazovL3ZwLXJlY2VpdmVyLy4vc3JjL2pzL2NvbmZpZy9lbnZpcm9ubWVudC5qcyIsIndlYnBhY2s6Ly92cC1yZWNlaXZlci8uL3NyYy9qcy9jb25maWcvaGxzQ29uZmlnLmpzIiwid2VicGFjazovL3ZwLXJlY2VpdmVyLy4vc3JjL2pzL2hlbHBlcnMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vdnAtcmVjZWl2ZXIvLi9zcmMvanMvbW9kZWxzL2FkVUkuanMiLCJ3ZWJwYWNrOi8vdnAtcmVjZWl2ZXIvLi9zcmMvanMvbW9kZWxzL3JlY2VpdmVyLWNvbnRyb2xzLmpzIiwid2VicGFjazovL3ZwLXJlY2VpdmVyLy4vc3JjL2pzL21vZGVscy9yZWNlaXZlci5qcyIsIndlYnBhY2s6Ly92cC1yZWNlaXZlci8uL3NyYy9qcy9tb2RlbHMvc2Vla2Jhci5qcyIsIndlYnBhY2s6Ly92cC1yZWNlaXZlci8uL3NyYy9qcy9tb2RlbHMvdGltZXIuanMiLCJ3ZWJwYWNrOi8vdnAtcmVjZWl2ZXIvLi9zcmMvanMvbW9kZWxzL3Zhc3RTZXJ2aWNlLmpzIiwid2VicGFjazovL3ZwLXJlY2VpdmVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZwLXJlY2VpdmVyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3ZwLXJlY2VpdmVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly92cC1yZWNlaXZlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZwLXJlY2VpdmVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdnAtcmVjZWl2ZXIvLi9zcmMvanMvdnBSZWNlaXZlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkZWZhdWxDb25maWcgPSB7XHJcbiAgYWRUaW1lU2xpZGVyQ29sb3I6IFwieWVsbG93XCIsXHJcbiAgdGltZVNsaWRlckNvbG9yOiBcIiMxOTQ2OTRcIixcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsQ29uZmlnO1xyXG4iLCJjb25zdCBpc0RldmVsb3BtZW50ID0gcHJvY2Vzcy5lbnYuSVNERVZFTE9QTUVOVCA9PT0gXCJ0cnVlXCI7XHJcbmNvbnNvbGUubG9nKFwiaXNEZXZlbG9wbWVudFwiLCBpc0RldmVsb3BtZW50KTtcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGlzRGV2ZWxvcG1lbnQsXHJcbn07XHJcbiIsImNvbnN0IGNvbmZpZyA9IHtcclxuICBkZWJ1ZzogZmFsc2UsXHJcbiAgbWF4QnVmZmVyU2l6ZTogMjA5NzE1MjAsXHJcbiAgbWF4TG9hZGluZ0RlbGF5OiAyLFxyXG4gIG51ZGdlTWF4UmV0cnk6IDIsXHJcbiAgbGl2ZVN5bmNEdXJhdGlvbkNvdW50OiAzLFxyXG4gIGxpdmVNYXhMYXRlbmN5RHVyYXRpb25Db3VudDogSW5maW5pdHksXHJcbiAgbWFuaWZlc3RMb2FkaW5nTWF4UmV0cnk6IDEsXHJcbiAgbWFuaWZlc3RMb2FkaW5nUmV0cnlEZWxheTogMTAwMCxcclxuICBtYW5pZmVzdExvYWRpbmdNYXhSZXRyeVRpbWVvdXQ6IDIwMDAsXHJcbiAgZW1lRW5hYmxlZDogdHJ1ZSxcclxuICAvLyBzdGFydExldmVsOiAzLFxyXG4gIC8vIGF1dG9MZXZlbENhcHBpbmc6IDMsXHJcbiAgd2lkZXZpbmVMaWNlbnNlVXJsOlxyXG4gICAgXCJodHRwczovL3dpZGV2aW5lLWRhc2guZXpkcm0uY29tL3dpZGV2aW5lLXBocC93aWRldmluZS1mb3JlaWdua2V5LnBocD9wWD05MEZDMDRcIixcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcclxuIiwiY29uc3QgZm9ybWF0VGltZSA9ICh0aW1lKSA9PiB7XHJcbiAgaWYgKCF0aW1lKSByZXR1cm4gXCIwMDowMFwiO1xyXG5cclxuICBsZXQgaG91cnMgPSBNYXRoLmZsb29yKHRpbWUgLyAzNjAwKTtcclxuICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IoKHRpbWUgLSBob3VycyAqIDM2MDApIC8gNjApO1xyXG4gIGxldCBzZWNvbmRzID0gTWF0aC5mbG9vcih0aW1lICUgNjApO1xyXG5cclxuICAvLyBmb3JtYXQgdGhlIG1pbnV0ZXMgYW5kIHNlY29uZHMgc3RyaW5nIHRvIGxvb2sgY29uc2lzdGVudCBhY3Jvc3MgYWxsIHZhbHVlc1xyXG4gIGlmICghaG91cnMpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIG1pbnV0ZXMudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIikgK1xyXG4gICAgICBcIjpcIiArXHJcbiAgICAgIHNlY29uZHMudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgaG91cnMudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIikgK1xyXG4gICAgXCI6XCIgK1xyXG4gICAgbWludXRlcy50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKSArXHJcbiAgICBcIjpcIiArXHJcbiAgICBzZWNvbmRzLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpXHJcbiAgKTtcclxufTtcclxuLy8gRmlyZSBjdXN0b20gZXZlbnRcclxuY29uc3QgZmlyZSA9IChcclxuICBlbCxcclxuICBldmVudE5hbWUsXHJcbiAgZGV0YWlsID0gbnVsbCxcclxuICBidWJibGVzID0gdHJ1ZSxcclxuICBjYW5jZWxhYmxlID0gdHJ1ZVxyXG4pID0+IHtcclxuICBsZXQgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xyXG4gICAgZGV0YWlsLFxyXG4gICAgYnViYmxlcyxcclxuICAgIGNhbmNlbGFibGUsXHJcbiAgfSk7XHJcblxyXG4gIGVsLmRpc3BhdGNoRXZlbnQoZXZ0KTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBmb3JtYXRUaW1lLFxyXG4gIGZpcmUsXHJcbn07XHJcbiIsImNsYXNzIEFkVUkge1xyXG4gIGNvbnN0cnVjdG9yKHJlY2VpdmVyKSB7XHJcbiAgICB0aGlzLnJlY2VpdmVyID0gcmVjZWl2ZXI7XHJcbiAgICB0aGlzLmVuYWJsZSA9IHRoaXMuZW5hYmxlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmRpc2FibGUgPSB0aGlzLmRpc2FibGUuYmluZCh0aGlzKTtcclxuICB9XHJcbiAgZW5hYmxlKCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5yZWNlaXZlci5jb25maWcuYWRUaW1lU2xpZGVyQ29sb3IpO1xyXG4gICAgdGhpcy5yZWNlaXZlci5yZWNlaXZlckNvbnRyb2xzLnNlZWtiYXIuc2V0Q29sb3IoXHJcbiAgICAgIHRoaXMucmVjZWl2ZXIuY29uZmlnLmFkVGltZVNsaWRlckNvbG9yXHJcbiAgICApO1xyXG4gIH1cclxuICBkaXNhYmxlKCkge1xyXG4gICAgdGhpcy5yZWNlaXZlci5yZWNlaXZlckNvbnRyb2xzLnNlZWtiYXIuc2V0Q29sb3IoXHJcbiAgICAgIHRoaXMucmVjZWl2ZXIuY29uZmlnLnRpbWVTbGlkZXJDb2xvclxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWRVSTtcclxuIiwiaW1wb3J0IFNlZWtCYXIgZnJvbSBcIi4vc2Vla2JhclwiO1xyXG5pbXBvcnQgVGltZXIgZnJvbSBcIi4vdGltZXJcIjtcclxuY2xhc3MgUmVjZWl2ZXJDb250cm9scyB7XHJcbiAgY29uc3RydWN0b3IoaWQsIHJlY2VpdmVyKSB7XHJcbiAgICB0aGlzLnNlZWtiYXIgPSBuZXcgU2Vla0JhcihcIi5zZWVrYmFyLXByb2dyZXNzXCIpO1xyXG4gICAgdGhpcy50aW1lciA9IG5ldyBUaW1lcihcIi50aW1lclwiKTtcclxuICAgIHRoaXMuY2FzdERlYnVnZ2VyID0gbnVsbDtcclxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpO1xyXG4gICAgdGhpcy5vdmVybGF5ID0gdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICB0aGlzLmluZm8gPSB0aGlzLm92ZXJsYXkuY2hpbGRyZW5bMF07XHJcbiAgICB0aGlzLnNob3cgPSB0cnVlO1xyXG4gICAgdGhpcy5sb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvYWRlclwiKTtcclxuICAgIHRoaXMucGxheUljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZwLWljb24tcGxheVwiKTtcclxuICAgIHRoaXMucGF1c2VJY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52cC1pY29uLXBhdXNlXCIpO1xyXG4gICAgdGhpcy52aWRlb0luZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZpZGVvLWluZm9cIik7XHJcbiAgICB0aGlzLnNwbGFzaFNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3BsYXNoLXNjcmVlblwiKTtcclxuICAgIHRoaXMudGh1bWJuYWlsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0aHVtYm5haWxcIik7XHJcbiAgICB0aGlzLnJlY2VpdmVyID0gcmVjZWl2ZXI7XHJcbiAgfVxyXG4gIHNldENhc3REZWJ1Z2dlcihjYXN0RGVidWdnZXIpIHtcclxuICAgIHRoaXMuY2FzdERlYnVnZ2VyID0gY2FzdERlYnVnZ2VyO1xyXG4gICAgdGhpcy5zZWVrYmFyLnNldENhc3REZWJ1Z2dlcih0aGlzLmNhc3REZWJ1Z2dlcik7XHJcbiAgfVxyXG4gIHBhdXNlKCkge1xyXG4gICAgdGhpcy5wYXVzZUljb24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgdGhpcy5wbGF5SWNvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMucGxheUljb24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfSwgMjAwMCk7XHJcbiAgfVxyXG4gIHBsYXkoKSB7XHJcbiAgICB0aGlzLnBsYXlJY29uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIHRoaXMucGF1c2VJY29uLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5wYXVzZUljb24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfSwgMjAwMCk7XHJcbiAgfVxyXG4gIHVwZGF0ZShzdGF0ZSkge1xyXG4gICAgdGhpcy5zZWVrYmFyLnNldFByb2dyZXNzKHN0YXRlLmN1cnJlbnRUaW1lLCBzdGF0ZS5kdXJhdGlvbik7XHJcbiAgICB0aGlzLnRpbWVyLnVwZGF0ZShzdGF0ZS5jdXJyZW50VGltZSwgc3RhdGUuZHVyYXRpb24pO1xyXG4gIH1cclxuICBoaWRlQ29udHJvbHModGltZSkge1xyXG4gICAgdGhpcy5zaG93ID0gZmFsc2U7XHJcbiAgICB0aGlzLnNob3dIaWRlKHRpbWUgfHwgNTAwMCk7XHJcbiAgfVxyXG4gIHNob3dDb250cm9scygpIHtcclxuICAgIHRoaXMuc2hvdyA9IHRydWU7XHJcbiAgICB0aGlzLnNob3dIaWRlKDEwKTtcclxuICB9XHJcbiAgcmVzZXRPdmVybGF5KHRpbWVvdXQpIHtcclxuICAgIGNvbnN0IHJlc2V0ID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLnNlZWtiYXIucmVzZXQoKTtcclxuXHJcbiAgICAgIHRoaXMuaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICB9O1xyXG4gICAgaWYgKCF0aW1lb3V0KSByZXR1cm4gc2V0VGltZW91dChyZXNldCwgMzAwMCk7XHJcbiAgICByZXR1cm4gcmVzZXQoKTtcclxuICB9XHJcbiAgc2hvd0hpZGUodGltaW5nKSB7XHJcbiAgICAvLyB0aGlzLmNhc3RkZWJ1Z2dlci5kZWJ1ZyhcInNob3dIaWRlXCIsIGAke3RpbWluZ30gJHt0aGlzLnNob3d9YCk7XHJcbiAgICBpZiAodGhpcy5zaG93KSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9LCB0aW1pbmcpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpbml0T3ZlcmxheShtZXRhZGF0YSkge1xyXG4gICAgdGhpcy5zcGxhc2hTY3JlZW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgdGhpcy5vdmVybGF5LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAobWV0YWRhdGEuaW1hZ2VzLmxlbmd0aCA+IDAgJiYgbWV0YWRhdGEpIHtcclxuICAgICAgICB0aGlzLnRodW1ibmFpbC5zcmMgPSBtZXRhZGF0YS5pbWFnZXNbMF0udXJsO1xyXG4gICAgICAgIHRoaXMudmlkZW9JbmZvLmNoaWxkcmVuWzBdLnRleHRDb250ZW50ID0gbWV0YWRhdGEudGl0bGU7XHJcbiAgICAgICAgdGhpcy52aWRlb0luZm8uY2hpbGRyZW5bMV0udGV4dENvbnRlbnQgPSBtZXRhZGF0YS5kZXNjcmlwdGlvbjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNlZWtiYXIuYW5pbWF0ZVNlZWtiYXIoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVjZWl2ZXJDb250cm9scztcclxuIiwiaW1wb3J0IGRlZmF1bENvbmZpZyBmcm9tIFwiLi4vY29uZmlnL2RlZmF1bHRDb25maWdcIjtcclxuaW1wb3J0IGhsc2NvbmZpZyBmcm9tIFwiLi4vY29uZmlnL2hsc0NvbmZpZ1wiO1xyXG5pbXBvcnQgUmVjZWl2ZXJDb250cm9scyBmcm9tIFwiLi9yZWNlaXZlci1jb250cm9sc1wiO1xyXG5pbXBvcnQgVmFzdFNlcnZpY2UgZnJvbSBcIi4vdmFzdFNlcnZpY2VcIjtcclxuaW1wb3J0IEVudmlyb25tZW50IGZyb20gXCIuLi9jb25maWcvZW52aXJvbm1lbnRcIjtcclxuY2xhc3MgUmVjZWl2ZXIge1xyXG4gIGNvbnN0cnVjdG9yKGlkLCBjb25maWcpIHtcclxuICAgIHRoaXMuY29udGV4dCA9IG51bGw7XHJcbiAgICB0aGlzLnBsYXllck1hbmFnZXIgPSBudWxsO1xyXG4gICAgdGhpcy5jYXN0RGVidWdMb2dnZXIgPSBudWxsO1xyXG4gICAgdGhpcy5hcHBJZCA9IGNvbmZpZy5hcHBJZDtcclxuICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKTtcclxuICAgIHRoaXMucGxheWJhY2tDb25maWcgPSBudWxsO1xyXG4gICAgdGhpcy5jb250cm9scyA9IG51bGw7XHJcbiAgICB0aGlzLmhscyA9IG51bGw7XHJcbiAgICB0aGlzLnZpZGVvT2JqZWN0ID0ge307XHJcbiAgICB0aGlzLnZpZGVvQ29udGFpbmVyID0gdGhpcy52aWRlby5wYXJlbnRFbGVtZW50O1xyXG4gICAgdGhpcy5wbGF5YmFja1JhdGUgPSAxO1xyXG4gICAgdGhpcy5hdXRvcGxheSA9IGZhbHNlO1xyXG4gICAgdGhpcy5yZWNlaXZlckNvbnRyb2xzID0gbmV3IFJlY2VpdmVyQ29udHJvbHMoXCIuY29udHJvbHNcIiwgdGhpcyk7XHJcbiAgICB0aGlzLm1lZGlhTWFuYWdlciA9IG51bGw7XHJcbiAgICB0aGlzLmNhc3RSZWNlaXZlck1hbmFnZXIgPSBudWxsO1xyXG4gICAgdGhpcy52aWRlb1N0YXJ0ZWQgPSBmYWxzZTtcclxuICAgIHRoaXMudmFzdFNlcnZpY2UgPSBuZXcgVmFzdFNlcnZpY2UodGhpcyk7XHJcbiAgICB0aGlzLmNvbmZpZyA9IHt9O1xyXG4gICAgdGhpcy5hZEJyZWFrcyA9IFtdO1xyXG4gICAgdGhpcy5kZWJ1Z1RhZ3MgPSB7XHJcbiAgICAgIExPQURfUkVRVUVTVDogXCJMT0FEX1JFUVVFU1RcIixcclxuICAgICAgQVRUQUNIX01FRElBOiBcIkFUVEFDSF9NRURJQVwiLFxyXG4gICAgICBPTlBMQVk6IFwiT05fUExBWVwiLFxyXG4gICAgICBTVEFSVDogXCJTVEFSVFwiLFxyXG4gICAgICBJTklUOiBcIklOSVRcIixcclxuICAgICAgRVZFTlRTOiBcIkVWRU5UU1wiLFxyXG4gICAgICBPTkVORDogXCJPTkVORFwiLFxyXG4gICAgICBCUk9BRENBU1Q6IFwiQlJPQURDQVNUXCIsXHJcbiAgICAgIE9OVElNRVVQREFURUU6IFwiT05USU1FVVBEQVRFXCIsXHJcbiAgICAgIElOSVRTVEFURTogXCJJTklUU1RBVEVcIixcclxuICAgIH07XHJcbiAgICB0aGlzLmNvbmZpZyA9IHsgLi4uZGVmYXVsQ29uZmlnLCAuLi5jb25maWcgfTtcclxuICAgIHRoaXMuaXNBZFBsYXlpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuTkFNRVNQQUNFID0gXCJ1cm46eC1jYXN0OnRlY2guZ2ppcmFmYS52cC1zZXJ2aWNlXCI7XHJcbiAgICB0aGlzLnJlY2VpdmVyQ29udHJvbHMgPSBuZXcgUmVjZWl2ZXJDb250cm9scyhcIi5jb250cm9sc1wiLCB0aGlzKTtcclxuICB9XHJcbiAgc3RhcnQoKSB7XHJcbiAgICB0aGlzLnJlY2VpdmVyQ29udHJvbHMucmVzZXRPdmVybGF5KCk7XHJcbiAgICB0aGlzLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1Zyh0aGlzLmRlYnVnVGFncy5TVEFSVCwgXCJTdGFydGluZyB2aWRlby4uLlwiKTtcclxuICAgIHRoaXMuYnJvYWRjYXN0KHRoaXMuZGVidWdUYWdzLlNUQVJUICsgXCJTdGFydGluZyB2aWRlby4uLlwiKTtcclxuICAgIHRoaXMub25QbGF5KCk7XHJcbiAgfVxyXG5cclxuICBvblBsYXkoZGF0YSkge1xyXG4gICAgdGhpcy5jYXN0RGVidWdMb2dnZXIuZGVidWcoXCJvbiBwbGF5XCIsIHRoaXMudmlkZW8uZ2V0QXR0cmlidXRlKFwic3JjXCIpKTtcclxuICAgIHRoaXMuYnJvYWRjYXN0KFwib24gcGxheVwiICsgdGhpcy52aWRlby5nZXRBdHRyaWJ1dGUoXCJzcmNcIikpO1xyXG4gICAgdGhpcy5jYXN0RGVidWdMb2dnZXIuZGVidWcoXCJpc2FkcGxheWluZ1wiLCB0aGlzLmlzQWRQbGF5aW5nKTtcclxuICAgIGlmICghdGhpcy5pc0FkUGxheWluZykge1xyXG4gICAgICB0aGlzLnZpZGVvXHJcbiAgICAgICAgLnBsYXkoKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGlmICghdGhpcy52aWRlb1N0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWNlaXZlckNvbnRyb2xzLnNob3dDb250cm9scygpO1xyXG4gICAgICAgICAgICB0aGlzLnZpZGVvU3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlY2VpdmVyQ29udHJvbHMucGxheSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5yZWNlaXZlckNvbnRyb2xzLnNob3cgPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMucmVjZWl2ZXJDb250cm9scy5zaG93SGlkZSgyMDAwKTtcclxuICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcclxuICAgICAgICAgICAgdGhpcy5kZWJ1Z1RhZ3MuT05QTEFZLFxyXG4gICAgICAgICAgICBcIiBDb3VsZG4ndCBwbGF5IHZpZGVvLlRyaW5nIG9uZSBtb3JlIHRpbWUgXCIgKyBlXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgdGhpcy5vblBhdXNlKCk7XHJcblxyXG4gICAgICAgICAgdGhpcy5icm9hZGNhc3QoXHJcbiAgICAgICAgICAgIFwiIENvdWxkbid0IHBsYXkgdmlkZW8uVHJpbmcgb25lIG1vcmUgdGltZSBcIiArIGUudG9TdHJpbmcoKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHRoaXMudmlkZW9cclxuICAgICAgICAgICAgLnBsYXkoKVxyXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+XHJcbiAgICAgICAgICAgICAgdGhpcy5jYXN0RGVidWdMb2dnZXIuZGVidWcodGhpcy5kZWJ1Z1RhZ3MuT05QTEFZLCBcIiBub3Qgd29ya2luZ1wiKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHRoaXMudmFzdFNlcnZpY2UucmVzdW1lKCk7XHJcbiAgfVxyXG4gIG9uUGF1c2UoZGF0YSkge1xyXG4gICAgaWYgKCF0aGlzLmlzQWRQbGF5aW5nKSB0aGlzLnZpZGVvLnBhdXNlKCk7XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy52YXN0U2VydmljZS5wYXVzZSgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZWNlaXZlckNvbnRyb2xzLnBhdXNlKCk7XHJcbiAgICB0aGlzLnJlY2VpdmVyQ29udHJvbHMuc2hvd0NvbnRyb2xzKCk7XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcbiAgYWRkUGxheWVyRXZlbnRzKCkge1xyXG4gICAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKFwidGltZXVwZGF0ZVwiLCB0aGlzLm9uVGltZVVwZGF0ZSk7XHJcbiAgICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRlZFwiLCB0aGlzLm9uRW5kLmJpbmQodGhpcykpO1xyXG4gIH1cclxuICBicm9hZGNhc3QobWVzc2FnZSwgcmVxdWlyZWQpIHtcclxuICAgIHRoaXMuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFxyXG4gICAgICB0aGlzLmRlYnVnVGFncy5CUk9BRENBU1QsXHJcbiAgICAgIEVudmlyb25tZW50LmlzRGV2ZWxvcG1lbnRcclxuICAgICk7XHJcbiAgICAvLyBpZiAoIXJlcXVpcmVkICYmICFFbnZpcm9ubWVudC5pc0RldmVsb3BtZW50KSByZXR1cm47XHJcbiAgICB0aGlzLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1Zyh0aGlzLmRlYnVnVGFncy5CUk9BRENBU1QsIG1lc3NhZ2UpO1xyXG4gICAgaWYgKHRoaXMuY29udGV4dClcclxuICAgICAgdGhpcy5jb250ZXh0LnNlbmRDdXN0b21NZXNzYWdlKHRoaXMuTkFNRVNQQUNFLCB1bmRlZmluZWQsIG1lc3NhZ2UpO1xyXG4gIH1cclxuICBvbkVuZCgpIHtcclxuICAgIHRoaXMuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFwib24gRW5kXCIsIHRoaXMuY29uZmlnLnJlcGxheSk7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAodGhpcy5pc0FkUGxheWluZykge1xyXG4gICAgICAgIHRoaXMuYnJvYWRjYXN0KFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkFkIGZpbmlzaGVkXCIsXHJcbiAgICAgICAgICAgIGNvZGU6IDIsXHJcbiAgICAgICAgICAgIHRpbWU6IHRoaXMuY3VycmVudFRpbWUsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdHJ1ZVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGxzKSB7XHJcbiAgICAgICAgICB0aGlzLmhscy5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNBZFBsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmJyb2FkY2FzdChcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgbWVzc2FnZTogXCJWaWRlbyBmaW5pc2hlZFwiLFxyXG4gICAgICAgICAgICBjb2RlOiAzLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRydWVcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLmNhc3REZWJ1Z0xvZ2dlci5lcnJvcihcclxuICAgICAgICB0aGlzLmRlYnVnVGFncy5PTkVORCxcclxuICAgICAgICBcIiBFcnJvclwiICsgZXJyb3IudG9TdHJpbmcoKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG4gIG9uVGltZVVwZGF0ZSgpIHtcclxuICAgIGlmICh0aGlzLmlzQWRQbGF5aW5nKSByZXR1cm47XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgdGhpcy5hZEJyZWFrc1xyXG4gICAgICAgICAgLm1hcCgoYWQpID0+IGFkLmJyZWFrVGltaW5nVmFsdWUpXHJcbiAgICAgICAgICAuaW5jbHVkZXMoTWF0aC5mbG9vcih0aGlzLnZpZGVvLmN1cnJlbnRUaW1lKSkgJiZcclxuICAgICAgICAhdGhpcy5pc0FkUGxheWluZ1xyXG4gICAgICApIHtcclxuICAgICAgICB0aGlzLmJyb2FkY2FzdCh0aGlzLmFkQnJlYWtzKTtcclxuICAgICAgICB0aGlzLm9uUGF1c2UoKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUaW1lID0gTWF0aC5mbG9vcih0aGlzLnZpZGVvLmN1cnJlbnRUaW1lKTtcclxuICAgICAgICB0aGlzLmlzQWRQbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnZhc3RTZXJ2aWNlLmxvYWRBZHModGhpcy5hZEJyZWFrc1swXS5hZFRhZ1VybFswXSk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGxzKSB7XHJcbiAgICAgICAgICB0aGlzLmhscy5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRCcmVha3Muc2hpZnQoKTtcclxuICAgICAgICAvLyB0aGlzLmhscy5kZXN0cm95KCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLmNhc3REZWJ1Z0xvZ2dlci5lcnJvcih0aGlzLmRlYnVnVGFncy5PTlRJTUVVUERBVEUsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVjZWl2ZXJDb250cm9scy51cGRhdGUodGhpcy51cGRhdGVQbGF5ZXJTdGF0ZSgpKTtcclxuICB9XHJcbiAgdXBkYXRlUGxheWVyU3RhdGUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBjdXJyZW50VGltZTogdGhpcy52aWRlby5jdXJyZW50VGltZSxcclxuICAgICAgZHVyYXRpb246IHRoaXMudmlkZW9PYmplY3QuZHVyYXRpb24gfHwgdGhpcy52aWRlby5kdXJhdGlvbixcclxuICAgIH07XHJcbiAgfVxyXG4gIGF0dGFjaE1lZGlhKCkge1xyXG4gICAgdnBSZWNlaXZlci5ITFNzdXBwb3J0ZWQgPSBIbHMuaXNTdXBwb3J0ZWQoKTtcclxuICAgIHRoaXMuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFwiaW5zaWRlIGF0dGFjaCBtZWRpYVwiLCB2cFJlY2VpdmVyLkhMU3N1cHBvcnRlZCk7XHJcblxyXG4gICAgdGhpcy52aWRlby5wbGF5YmFja1JhdGUgPSAxO1xyXG4gICAgdGhpcy5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFwidmlkZW8gZmlsZVwiLFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLnZpZGVvLCBbXCJpZFwiLCBcImNsYXNzTmFtZVwiLCBcInRhZ05hbWVcIl0pXHJcbiAgICApO1xyXG4gICAgdGhpcy5icm9hZGNhc3Qoe1xyXG4gICAgICBtZXNzYWdlOlxyXG4gICAgICAgIFwidmlkZW8gZmlsZVwiICtcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLnZpZGVvLCBbXCJpZFwiLCBcImNsYXNzTmFtZVwiLCBcInRhZ05hbWVcIl0pLFxyXG4gICAgfSk7XHJcbiAgICBpZiAodGhpcy52aWRlb09iamVjdC5maWxlLmVuZHNXaXRoKFwibXA0XCIpKSB7XHJcbiAgICAgIHRoaXMuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFwiaW5zaWRlIG1wNFwiLCB0aGlzLnZpZGVvT2JqZWN0LmZpbGUpO1xyXG4gICAgICB0aGlzLnZpZGVvLnNyYyA9IHRoaXMudmlkZW9PYmplY3QuZmlsZTtcclxuICAgICAgdGhpcy5zdGFydCgpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnZpZGVvT2JqZWN0LmZpbGUuZW5kc1dpdGgoXCJtcGRcIikpIHtcclxuICAgICAgLy9jcmVhdGUgc291cmNlIGFuZCBhcHBlbmQgdG8gdmlkZW9cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgZGFzaCA9IGRhc2hqcy5NZWRpYVBsYXllcigpLmNyZWF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFwiREFTSCAtIHBsYXllcmluaXRpYWxpemVkXCIsIGRhc2gpO1xyXG4gICAgICAgIGRhc2guc2V0UHJvdGVjdGlvbkRhdGEoe1xyXG4gICAgICAgICAgXCJjb20ud2lkZXZpbmUuYWxwaGFcIjoge1xyXG4gICAgICAgICAgICBzZXJ2ZXJVUkw6XHJcbiAgICAgICAgICAgICAgXCJodHRwczovL3dpZGV2aW5lLWRhc2guZXpkcm0uY29tL3dpZGV2aW5lLXBocC93aWRldmluZS1mb3JlaWdua2V5LnBocD9wWD05MEZDMDRcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZGFzaC5pbml0aWFsaXplKHRoaXMudmlkZW8sIHRoaXMudmlkZW9PYmplY3QuZmlsZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICB0aGlzLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcIkRBU0hcIiwgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodnBSZWNlaXZlci5ITFNzdXBwb3J0ZWQpIHtcclxuICAgICAgdGhpcy5jYXN0RGVidWdMb2dnZXIuZGVidWcoXCJpbnNpZGUgaGxzc3VwcG9ydGVkXCIsIHRoaXMudmlkZW9PYmplY3QuZmlsZSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5obHMgPSBuZXcgSGxzKGhsc2NvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5jYXN0RGVidWdMb2dnZXIuZGVidWcoXCJobHMgaW5pdGlhbGl6ZWRcIiwgdGhpcy52aWRlb09iamVjdC5maWxlKTtcclxuICAgICAgICB0aGlzLmJyb2FkY2FzdCh7XHJcbiAgICAgICAgICBtZXNzYWdlOiBcImhscyBpbml0aWFsaXplZCBcIiArIHRoaXMudmlkZW9PYmplY3QuZmlsZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImF0dGFjaE1lZGlhIFwiICsgdGhpcy5jdXJyZW50VGltZSk7XHJcblxyXG4gICAgICAgIHRoaXMuaGxzLm9uKEhscy5FdmVudHMuTUVESUFfQVRUQUNIRUQsICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFwiYW1lZGlhIGF0dGFjaGVkXCIsIHRoaXMudmlkZW9PYmplY3QuZmlsZSk7XHJcbiAgICAgICAgICB0aGlzLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcclxuICAgICAgICAgICAgXCJsb2FkaW5nIHNvdXJjZSBobHNzdXBwb3J0ZWRcIixcclxuICAgICAgICAgICAgdGhpcy52aWRlb09iamVjdC5maWxlXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudFRpbWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlkZW8uY3VycmVudFRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5obHMubG9hZFNvdXJjZSh0aGlzLnZpZGVvT2JqZWN0LmZpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaGxzLm9uKEhscy5FdmVudHMuTUFOSUZFU1RfUEFSU0VELCAoZXZlbnQsIGRhdGEpID0+IHtcclxuICAgICAgICAgIHRoaXMuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFwibWFuaWZlc3QgcGFyc2VkXCIsIHRoaXMudmlkZW9PYmplY3QuZmlsZSk7XHJcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50VGltZSA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy52aWRlby5jdXJyZW50VGltZSA9IHRoaXMuY3VycmVudFRpbWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5obHMub24oSGxzLkV2ZW50cy5FUlJPUiwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcIkhMUyAgRVJST1JcIiwgZGF0YS5kZXRhaWxzKTtcclxuICAgICAgICAgIHRoaXMuYnJvYWRjYXN0KHsgbWVzc2FnZTogXCJITFMgIEVSUk9SXCIsIGRldGFpbHM6IGRhdGEuZGV0YWlscyB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmhscy5hdHRhY2hNZWRpYSh0aGlzLnZpZGVvKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICB0aGlzLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcIkRBU0gtIGVycm9yXCIsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcImZpbmlzaGVkIGF0dGFjaCBtZWRpYVwiKTtcclxuICB9XHJcbiAgZmFrZWluaXQoKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLmNhc3REZWJ1Z0xvZ2dlciA9IHtcclxuICAgICAgZGVidWc6IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtZXNzYWdlID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICBpZiAobWVzc2FnZS5jb2RlID09IDIpIHtcclxuICAgICAgICAgICAgc2VsZi52aWRlby5jdXJyZW50VGltZSA9IG1lc3NhZ2UudGltZTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgLy8gaWYgKHNlbGYuaGxzKSB7XHJcbiAgICAgICAgICAgICAgLy8gICBzZWxmLmhscy5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgLy8gICBzZWxmLnZhc3RTZXJ2aWNlLmFkVUkuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgIC8vICAgc2VsZi5pbml0U3RhdGUoKTtcclxuICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgIHNlbGYuYXR0YWNoTWVkaWEoKTtcclxuICAgICAgICAgICAgfSwgNzAwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2codHlwZSwgbWVzc2FnZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAodHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHR5cGUsIG1lc3NhZ2UpO1xyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICAgIHRoaXMucmVjZWl2ZXJDb250cm9scy5zZXRDYXN0RGVidWdnZXIodGhpcy5jYXN0RGVidWdMb2dnZXIpO1xyXG4gICAgdGhpcy52aWRlb09iamVjdC5maWxlID1cclxuICAgICAgXCJodHRwOi8vYmxvYi5namlyYWZhLmNvbS9rdmlmZmN6L21lZGlhL3kxcWdreDM2L3BhY2thZ2VkL2luZGV4Lm1wZFwiO1xyXG4gICAgdGhpcy52aWRlb09iamVjdC5kdXJhdGlvbiA9IDExOTtcclxuICAgIHRoaXMucmVjZWl2ZXJDb250cm9scy5zZWVrYmFyLmFuaW1hdGVTZWVrYmFyKCk7XHJcbiAgICB0aGlzLnJlY2VpdmVyQ29udHJvbHMuaW5pdE92ZXJsYXkoe1xyXG4gICAgICB0aXRsZTogXCJTb21lIHRpdGxlXCIsXHJcbiAgICAgIGltYWdlczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHVybDogXCJodHRwczovL2xpa2kuZ2ppcmFmYS5jb20vYXBpL21lZGlhL2dqdmlkZW8veXF6MGdxL3JldGluYS5qcGdcIixcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSk7XHJcbiAgICAodGhpcy5hZEJyZWFrcyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIGJyZWFrVHlwZTogXCJtaWRyb2xsXCIsXHJcbiAgICAgICAgYWRUYWdVcmw6IFtcImh0dHBzOi8vdnAtZGV2LmdqaXJhZmEubmV0L3Zwcy9jb250ZW50L3Zhc3QvcHJlcm9sbC0yLnhtbFwiXSxcclxuICAgICAgICBicmVha1RpbWluZ1R5cGU6IFwidGltZVwiLFxyXG4gICAgICAgIGJyZWFrVGltaW5nVmFsdWU6IDE1LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgYnJlYWtUeXBlOiBcIm1pZHJvbGxcIixcclxuICAgICAgICBhZFRhZ1VybDogW1wiaHR0cHM6Ly92cC1kZXYuZ2ppcmFmYS5uZXQvdnBzL2NvbnRlbnQvdmFzdC9wcmVyb2xsLTIueG1sXCJdLFxyXG4gICAgICAgIGJyZWFrVGltaW5nVHlwZTogXCJ0aW1lXCIsXHJcbiAgICAgICAgYnJlYWtUaW1pbmdWYWx1ZTogMzAsXHJcbiAgICAgIH0sXHJcbiAgICBdKSxcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hNZWRpYSgpO1xyXG4gICAgICB9LCA1MDAwKTtcclxuXHJcbiAgICB0aGlzLmJpbmRNZXRob2RzKCk7XHJcbiAgICB0aGlzLmFkZFBsYXllckV2ZW50cygpO1xyXG4gIH1cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5jb250ZXh0ID0gY2FzdC5mcmFtZXdvcmsuQ2FzdFJlY2VpdmVyQ29udGV4dC5nZXRJbnN0YW5jZSgpO1xyXG5cclxuICAgIHRoaXMuY29udGV4dC5zZXRMb2dnZXJMZXZlbChjYXN0LmZyYW1ld29yay5Mb2dnZXJMZXZlbC5ERUJVRyk7XHJcblxyXG4gICAgdGhpcy5jYXN0RGVidWdMb2dnZXIgPSBjYXN0LmRlYnVnLkNhc3REZWJ1Z0xvZ2dlci5nZXRJbnN0YW5jZSgpO1xyXG4gICAgdGhpcy5jYXN0RGVidWdMb2dnZXIuc2V0RW5hYmxlZChFbnZpcm9ubWVudC5pc0RldmVsb3BtZW50KTtcclxuICAgIHRoaXMuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKHRoaXMuZGVidWdUYWdzLklOSVQsIFwiY2FzdGRlYnVnZ2VyIGluaXRpYWxpemVkXCIpO1xyXG4gICAgdGhpcy5wbGF5ZXJNYW5hZ2VyID0gdGhpcy5jb250ZXh0LmdldFBsYXllck1hbmFnZXIoKTtcclxuICAgIHRoaXMucGxheWVyTWFuYWdlci5zZXRNZWRpYUVsZW1lbnQodGhpcy52aWRlbyk7XHJcblxyXG4gICAgdGhpcy5wbGF5ZXJNYW5hZ2VyLnNldFN1cHBvcnRlZE1lZGlhQ29tbWFuZHMoXHJcbiAgICAgIGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLkNvbW1hbmQuU0VFSyB8XHJcbiAgICAgICAgY2FzdC5mcmFtZXdvcmsubWVzc2FnZXMuQ29tbWFuZC5QQVVTRSB8XHJcbiAgICAgICAgY2FzdC5mcmFtZXdvcmsubWVzc2FnZXMuQ29tbWFuZC5QTEFZXHJcbiAgICApO1xyXG5cclxuICAgIC8vIGJyb3dzZSBjb250ZW50IGFyZWFcclxuICAgIGNvbnN0IGNvbnRyb2xzID0gY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHMuZ2V0SW5zdGFuY2UoKTtcclxuXHJcbiAgICBjb25zdCBpdGVtMSA9IG5ldyBjYXN0LmZyYW1ld29yay51aS5Ccm93c2VJdGVtKCk7XHJcbiAgICBpdGVtMS50aXRsZSA9IFwiVGl0bGUgMVwiO1xyXG4gICAgaXRlbTEuc3VidGl0bGUgPSBcIlN1YnRpdGxlIDFcIjtcclxuICAgIGl0ZW0xLmR1cmF0aW9uID0gMzAwO1xyXG4gICAgaXRlbTEuaW1hZ2VUeXBlID0gY2FzdC5mcmFtZXdvcmsudWkuQnJvd3NlSW1hZ2VUeXBlLk1VU0lDX1RSQUNLO1xyXG4gICAgaXRlbTEuaW1hZ2UgPSBuZXcgY2FzdC5mcmFtZXdvcmsubWVzc2FnZXMuSW1hZ2UoXCIxLmpwZ1wiKTtcclxuICAgIGl0ZW0xLmVudGl0eSA9IFwiZXhhbXBsZTovL2dpem1vcy8xXCI7XHJcblxyXG4gICAgY29uc3QgaXRlbTIgPSBuZXcgY2FzdC5mcmFtZXdvcmsudWkuQnJvd3NlSXRlbSgpO1xyXG4gICAgaXRlbTIudGl0bGUgPSBcIlRpdGxlIDJcIjtcclxuICAgIGl0ZW0yLnN1YnRpdGxlID0gXCJTdWJ0aXRsZSAyXCI7XHJcbiAgICBpdGVtMi5kdXJhdGlvbiA9IDEwMDtcclxuICAgIGl0ZW0yLmltYWdlVHlwZSA9IGNhc3QuZnJhbWV3b3JrLnVpLkJyb3dzZUltYWdlVHlwZS5NVVNJQ19UUkFDSztcclxuICAgIGl0ZW0yLmltYWdlID0gbmV3IGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLkltYWdlKFwiMi5qcGdcIik7XHJcbiAgICBpdGVtMi5lbnRpdHkgPSBcImV4YW1wbGU6Ly9naXptb3MvMlwiO1xyXG5cclxuICAgIGNvbnN0IGl0ZW1zID0gW2l0ZW0xLCBpdGVtMl07XHJcblxyXG4gICAgY29uc3QgYnJvd3NlQ29udGVudCA9IG5ldyBjYXN0LmZyYW1ld29yay51aS5Ccm93c2VDb250ZW50KCk7XHJcbiAgICBicm93c2VDb250ZW50LnRpdGxlID0gXCJVcCBOZXh0XCI7XHJcbiAgICBicm93c2VDb250ZW50Lml0ZW1zID0gaXRlbXM7XHJcbiAgICB0aGlzLnJlY2VpdmVyQ29udHJvbHMuc2V0Q2FzdERlYnVnZ2VyKHRoaXMuY2FzdERlYnVnTG9nZ2VyKTtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSBuZXcgY2FzdC5mcmFtZXdvcmsuQ2FzdFJlY2VpdmVyT3B0aW9ucygpO1xyXG4gICAgLy8gTWFwIG9mIG5hbWVzcGFjZSBuYW1lcyB0byB0aGVpciB0eXBlcy5cclxuICAgIG9wdGlvbnMuY3VzdG9tTmFtZXNwYWNlcyA9IHt9O1xyXG4gICAgb3B0aW9ucy5jdXN0b21OYW1lc3BhY2VzW3RoaXMuTkFNRVNQQUNFXSA9XHJcbiAgICAgIGNhc3QuZnJhbWV3b3JrLnN5c3RlbS5NZXNzYWdlVHlwZS5KU09OO1xyXG5cclxuICAgIC8vIGNvbnN0IHBsYXliYWNrQ29uZmlnID0gbmV3IGNhc3QuZnJhbWV3b3JrLlBsYXliYWNrQ29uZmlnKCk7XHJcbiAgICAvLyAvLyBDdXN0b21pemUgdGhlIGxpY2Vuc2UgdXJsIGZvciBwbGF5YmFja1xyXG4gICAgLy8gcGxheWJhY2tDb25maWcucHJvdGVjdGlvblN5c3RlbSA9IGNhc3QuZnJhbWV3b3JrLkNvbnRlbnRQcm90ZWN0aW9uLldJREVWSU5FO1xyXG4gICAgLy8gcGxheWJhY2tDb25maWcubGljZW5zZVJlcXVlc3RIYW5kbGVyID0gKHJlcXVlc3RJbmZvKSA9PiB7XHJcbiAgICAvLyAgIHJlcXVlc3RJbmZvLndpdGhDcmVkZW50aWFscyA9IGZhbHNlO1xyXG4gICAgLy8gfTtcclxuICAgIC8vIC8vIFVwZGF0ZSBwbGF5YmFjayBjb25maWcgbGljZW5zZVVybCBhY2NvcmRpbmcgdG8gcHJvdmlkZWQgdmFsdWUgaW4gbG9hZCByZXF1ZXN0LlxyXG4gICAgLy8gdGhpcy5wbGF5ZXJNYW5hZ2VyLnNldE1lZGlhUGxheWJhY2tJbmZvSGFuZGxlcihcclxuICAgIC8vICAgKGxvYWRSZXF1ZXN0LCBwbGF5YmFja0NvbmZpZykgPT4ge1xyXG4gICAgLy8gICAgIGlmIChcclxuICAgIC8vICAgICAgIGxvYWRSZXF1ZXN0Lm1lZGlhLmN1c3RvbURhdGEgJiZcclxuICAgIC8vICAgICAgIGxvYWRSZXF1ZXN0Lm1lZGlhLmN1c3RvbURhdGEubGljZW5zZVVybFxyXG4gICAgLy8gICAgICkge1xyXG4gICAgLy8gICAgICAgcGxheWJhY2tDb25maWcubGljZW5zZVVybCA9IGxvYWRSZXF1ZXN0Lm1lZGlhLmN1c3RvbURhdGEubGljZW5zZVVybDtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgcmV0dXJuIHBsYXliYWNrQ29uZmlnO1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyApO1xyXG4gICAgLy8gb3B0aW9ucy5wbGF5YmFja0NvbmZpZyA9IHBsYXliYWNrQ29uZmlnO1xyXG4gICAgLy8gdGhpcy5jYXN0RGVidWdMb2dnZXIuZGVidWcoXCJsaWNlbnNlVXJsXCIsIHBsYXliYWNrQ29uZmlnLmxpY2Vuc2VVcmwpO1xyXG4gICAgLy8gU3RhcnRpbmcgY2FzdFxyXG4gICAgdGhpcy5jb250ZXh0LnN0YXJ0KG9wdGlvbnMpO1xyXG4gICAgdGhpcy5iaW5kTWV0aG9kcygpO1xyXG4gICAgdGhpcy5iaW5kSW50ZXJjZXB0b3JzKCk7XHJcbiAgICB0aGlzLmFkZFBsYXllckV2ZW50cygpO1xyXG4gIH1cclxuICBvblNlZWsocmVxdWVzdERhdGEpIHtcclxuICAgIHRoaXMuYnJvYWRjYXN0KHJlcXVlc3REYXRhLnRvU3RyaW5nKCkpO1xyXG4gICAgdGhpcy52aWRlby5jdXJyZW50VGltZSA9IHJlcXVlc3REYXRhLmN1cnJlbnRUaW1lO1xyXG4gICAgdGhpcy5yZWNlaXZlckNvbnRyb2xzLnNob3dDb250cm9scygpO1xyXG4gICAgdGhpcy5yZWNlaXZlckNvbnRyb2xzLmhpZGVDb250cm9scyg2MDAwKTtcclxuXHJcbiAgICB0aGlzLnJlY2VpdmVyQ29udHJvbHMudXBkYXRlKHRoaXMudXBkYXRlUGxheWVyU3RhdGUoKSk7XHJcbiAgfVxyXG4gIGRyYXdCdXR0b25zKCkge1xyXG4gICAgdGhpcy5jb250cm9scy5hc3NpZ25CdXR0b24oXHJcbiAgICAgIGNhc3QuZnJhbWV3b3JrLnVpLkNvbnRyb2xzU2xvdC5TTE9UX1NFQ09OREFSWV8xLFxyXG4gICAgICBjYXN0LmZyYW1ld29yay51aS5Db250cm9sc0J1dHRvbi5RVUVVRV9QUkVWXHJcbiAgICApO1xyXG4gICAgdGhpcy5jb250cm9scy5hc3NpZ25CdXR0b24oXHJcbiAgICAgIGNhc3QuZnJhbWV3b3JrLnVpLkNvbnRyb2xzU2xvdC5TTE9UX1BSSU1BUllfMSxcclxuICAgICAgY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHNCdXR0b24uQ0FQVElPTlNcclxuICAgICk7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmFzc2lnbkJ1dHRvbihcclxuICAgICAgY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHNTbG90LlNMT1RfUFJJTUFSWV8yLFxyXG4gICAgICBjYXN0LmZyYW1ld29yay51aS5Db250cm9sc0J1dHRvbi5TRUVLX0ZPUldBUkRfMTVcclxuICAgICk7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmFzc2lnbkJ1dHRvbihcclxuICAgICAgY2FzdC5mcmFtZXdvcmsudWkuQ29udHJvbHNTbG90LlNMT1RfU0VDT05EQVJZXzIsXHJcbiAgICAgIGNhc3QuZnJhbWV3b3JrLnVpLkNvbnRyb2xzQnV0dG9uLlFVRVVFX05FWFRcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBiaW5kSW50ZXJjZXB0b3JzKCkge1xyXG4gICAgdGhpcy5jb250ZXh0LmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIGNhc3QuZnJhbWV3b3JrLnN5c3RlbS5FdmVudFR5cGUuU0VOREVSX0RJU0NPTk5FQ1RFRCxcclxuICAgICAgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgd2luZG93LmNsb3NlKCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICB0aGlzLmNvbnRleHQuYWRkQ3VzdG9tTWVzc2FnZUxpc3RlbmVyKHRoaXMuTkFNRVNQQUNFLCAoZXZlbnQpID0+IHtcclxuICAgICAgdGhpcy5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgICAgdGhpcy5kZWJ1Z1RhZ3MuRVZFTlRTLFxyXG4gICAgICAgIFwiYWRkQ3VzdG9tTWVzc2FnZUxpc3RlbmVyXCIgKyBldmVudC5kYXRhXHJcbiAgICAgICk7XHJcbiAgICAgIGxldCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcclxuICAgICAgaWYgKG1lc3NhZ2UuY29kZSA9PSAyKSB7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hNZWRpYSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMucGxheWVyTWFuYWdlci5zZXRNZXNzYWdlSW50ZXJjZXB0b3IoXHJcbiAgICAgIGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLk1lc3NhZ2VUeXBlLkxPQUQsXHJcbiAgICAgIHRoaXMub25Mb2FkUmVxdWVzdC5iaW5kKHRoaXMpXHJcbiAgICApO1xyXG4gICAgdGhpcy5wbGF5ZXJNYW5hZ2VyLnNldE1lc3NhZ2VJbnRlcmNlcHRvcihcclxuICAgICAgY2FzdC5mcmFtZXdvcmsubWVzc2FnZXMuTWVzc2FnZVR5cGUuUExBWSxcclxuICAgICAgdGhpcy5vblBsYXkuYmluZCh0aGlzKVxyXG4gICAgKTtcclxuICAgIHRoaXMucGxheWVyTWFuYWdlci5zZXRNZXNzYWdlSW50ZXJjZXB0b3IoXHJcbiAgICAgIGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLk1lc3NhZ2VUeXBlLlBBVVNFLFxyXG4gICAgICB0aGlzLm9uUGF1c2UuYmluZCh0aGlzKVxyXG4gICAgKTtcclxuICAgIHRoaXMucGxheWVyTWFuYWdlci5zZXRNZXNzYWdlSW50ZXJjZXB0b3IoXHJcbiAgICAgIGNhc3QuZnJhbWV3b3JrLm1lc3NhZ2VzLk1lc3NhZ2VUeXBlLlNFRUssXHJcbiAgICAgIHRoaXMub25TZWVrLmJpbmQodGhpcylcclxuICAgICk7XHJcbiAgfVxyXG4gIGJpbmRNZXRob2RzKCkge1xyXG4gICAgdGhpcy5iaW5kSW50ZXJjZXB0b3JzID0gdGhpcy5iaW5kSW50ZXJjZXB0b3JzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm9uTG9hZFJlcXVlc3QgPSB0aGlzLm9uTG9hZFJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYXR0YWNoTWVkaWEgPSB0aGlzLmF0dGFjaE1lZGlhLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN0YXJ0ID0gdGhpcy5zdGFydC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5hZGRQbGF5ZXJFdmVudHMgPSB0aGlzLmFkZFBsYXllckV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5vblRpbWVVcGRhdGUgPSB0aGlzLm9uVGltZVVwZGF0ZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5vblBsYXkgPSB0aGlzLm9uUGxheS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5vblBhdXNlID0gdGhpcy5vblBhdXNlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnVwZGF0ZVBsYXllclN0YXRlID0gdGhpcy51cGRhdGVQbGF5ZXJTdGF0ZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5vbkVuZCA9IHRoaXMub25FbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdFN0YXRlID0gdGhpcy5pbml0U3RhdGUuYmluZCh0aGlzKTtcclxuICB9XHJcbiAgaW5pdFN0YXRlKCkge1xyXG4gICAgdGhpcy5jYXN0RGVidWdMb2dnZXIuZGVidWcodGhpcy5kZWJ1Z1RhZ3MuSU5JVFNUQVRFLCBcImluaXRTdGF0ZVwiKTtcclxuICAgIHRoaXMuaGxzID0gbnVsbDtcclxuICAgIHRoaXMuY3VycmVudFRpbWUgPSAwO1xyXG4gICAgdGhpcy52aWRlby5jdXJyZW50VGltZSA9IDA7XHJcbiAgICB0aGlzLnJlY2VpdmVyQ29udHJvbHMucmVzZXRPdmVybGF5KHRydWUpO1xyXG4gIH1cclxuICBvbkxvYWRSZXF1ZXN0KGxvYWRSZXF1ZXN0RGF0YSkge1xyXG4gICAgaWYgKHRoaXMuaGxzKSB7XHJcbiAgICAgIHRoaXMuaGxzLmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy52YXN0U2VydmljZS5hZFVJLmRpc2FibGUoKTtcclxuICAgICAgdGhpcy5pbml0U3RhdGUoKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVjZWl2ZXJDb250cm9scy5pbml0T3ZlcmxheShsb2FkUmVxdWVzdERhdGEubWVkaWEubWV0YWRhdGEpO1xyXG4gICAgdGhpcy5jYXN0RGVidWdMb2dnZXIuZGVidWcoXCJWUHJlY2VpdmVyXCIsIGxvYWRSZXF1ZXN0RGF0YS5tZWRpYS5jb250ZW50SWQpO1xyXG4gICAgdGhpcy5jYXN0RGVidWdMb2dnZXIuZGVidWcoXCJWUHJlY2VpdmVyMVwiLCBIbHMuaXNTdXBwb3J0ZWQoKSk7XHJcbiAgICB0aGlzLnZpZGVvT2JqZWN0LmZpbGUgPSBsb2FkUmVxdWVzdERhdGEubWVkaWEuY29udGVudElkO1xyXG4gICAgdGhpcy52aWRlb09iamVjdC5kdXJhdGlvbiA9IGxvYWRSZXF1ZXN0RGF0YS5tZWRpYS5tZXRhZGF0YS5kdXJhdGlvbjtcclxuICAgIHRoaXMuY3VycmVudFRpbWUgPSBsb2FkUmVxdWVzdERhdGEuY3VycmVudFRpbWU7XHJcbiAgICB0aGlzLnBsYXliYWNrUmF0ZSA9IGxvYWRSZXF1ZXN0RGF0YS5wbGF5YmFja1JhdGU7XHJcbiAgICB0aGlzLmF1dG9wbGF5ID0gbG9hZFJlcXVlc3REYXRhLmF1dG9wbGF5O1xyXG4gICAgaWYgKGxvYWRSZXF1ZXN0RGF0YS5yZXF1aXJlQWRzKVxyXG4gICAgICB0aGlzLmFkQnJlYWtzID0gbG9hZFJlcXVlc3REYXRhLmN1c3RvbURhdGEuYWRCcmVha3M7XHJcbiAgICAvLyB0cnkge1xyXG4gICAgdGhpcy5jb25maWcucmVwbGF5ID1cclxuICAgICAgdHlwZW9mIGxvYWRSZXF1ZXN0RGF0YS5yZXBsYXkgIT09IFwidW5kZWZpbmVkXCJcclxuICAgICAgICA/IGxvYWRSZXF1ZXN0RGF0YS5yZXBsYXlcclxuICAgICAgICA6IHRydWU7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLmF0dGFjaE1lZGlhKCk7XHJcbiAgICAgIHRoaXMucmVjZWl2ZXJDb250cm9scy51cGRhdGUodGhpcy51cGRhdGVQbGF5ZXJTdGF0ZSgpKTtcclxuICAgICAgdGhpcy5icm9hZGNhc3Qoe1xyXG4gICAgICAgIG1lc3NhZ2U6IFwiYXR0YWNoaW5nIG1lZGlhXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5icm9hZGNhc3Qoe1xyXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yLnRvU3RyaW5nKCksXHJcbiAgICAgICAgc3RhY2s6IGVycm9yLnN0YWNrLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuICBhZGRCcmVha3MobWVkaWFJbmZvcm1hdGlvbikge1xyXG4gICAgY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFxyXG4gICAgICBMT0dfUkVDRUlWRVJfVEFHLFxyXG4gICAgICBcImFkZEJyZWFrczogXCIgKyBKU09OLnN0cmluZ2lmeShtZWRpYUluZm9ybWF0aW9uKVxyXG4gICAgKTtcclxuICAgIHJldHVybiBmZXRjaE1lZGlhQnlJZChcImZiYl9hZFwiKS50aGVuKChjbGlwMSkgPT4ge1xyXG4gICAgICBtZWRpYUluZm9ybWF0aW9uLmJyZWFrQ2xpcHMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IFwiZmJiX2FkXCIsXHJcbiAgICAgICAgICB0aXRsZTogY2xpcDEudGl0bGUsXHJcbiAgICAgICAgICBjb250ZW50VXJsOiBjbGlwMS5zdHJlYW0uZGFzaCxcclxuICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2Rhc2greG1sXCIsXHJcbiAgICAgICAgICB3aGVuU2tpcHBhYmxlOiA1LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF07XHJcblxyXG4gICAgICBtZWRpYUluZm9ybWF0aW9uLmJyZWFrcyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogXCJwcmUtcm9sbFwiLFxyXG4gICAgICAgICAgYnJlYWtDbGlwSWRzOiBbXCJmYmJfYWRcIl0sXHJcbiAgICAgICAgICBwb3NpdGlvbjogMCxcclxuICAgICAgICB9LFxyXG4gICAgICBdO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGZldGNoTWVkaWFCeUlkKGlkKSB7XHJcbiAgICBjYXN0RGVidWdMb2dnZXIuZGVidWcoTE9HX1JFQ0VJVkVSX1RBRywgXCJmZXRjaGluZyBpZDogXCIgKyBpZCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChhY2NlcHQsIHJlamVjdCkgPT4ge1xyXG4gICAgICBmZXRjaChDT05URU5UX1VSTClcclxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgICAgICAudGhlbigob2JqKSA9PiB7XHJcbiAgICAgICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmpbaWRdKSB7XHJcbiAgICAgICAgICAgICAgYWNjZXB0KG9ialtpZF0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlamVjdChgJHtpZH0gbm90IGZvdW5kIGluIHJlcG9zaXRvcnlgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVqZWN0KFwiQ29udGVudCByZXBvc2l0b3J5IG5vdCBmb3VuZC5cIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlY2VpdmVyO1xyXG4iLCJjbGFzcyBTZWVrQmFyIHtcclxuICBjb25zdHJ1Y3RvcihpZCkge1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZCk7XHJcbiAgICB0aGlzLmNhc3RkZWJ1Z2dlciA9IG51bGw7XHJcbiAgICB0aGlzLnNob3cgPSBmYWxzZTtcclxuICAgIHRoaXMuc3BlZWQgPSAzMDtcclxuICAgIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xyXG4gICAgdGhpcy5jYW5jZWxBbmltYXRpb24gPSBmYWxzZTtcclxuICAgIHRoaXMuaW5pdGlhbExlZnRQb3NpdGlvbiA9IHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0O1xyXG4gIH1cclxuICBzZXRDYXN0RGVidWdnZXIoY2FzdGRlYnVnZ2VyKSB7XHJcbiAgICB0aGlzLmNhc3RkZWJ1Z2dlciA9IGNhc3RkZWJ1Z2dlcjtcclxuICB9XHJcbiAgc2V0UHJvZ3Jlc3ModGltZSwgZHVyYXRpb24pIHtcclxuICAgIC8vIHRoaXMuY2FzdGRlYnVnZ2VyLmRlYnVnKFwiZWxlXCIsIEpTT04uc3RyaW5naWZ5KHRoaXMuZWxlbWVudCkpO1xyXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gKHRpbWUgLyBkdXJhdGlvbikgKiAxMDAgKyBcIiVcIjtcclxuICAgIC8vIHRoaXMuY2FzdGRlYnVnZ2VyLmRlYnVnKFwid2lkdGhcIiwgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoKTtcclxuICB9XHJcblxyXG4gIHNob3dIaWRlKHRpbWluZykge1xyXG4gICAgdGhpcy5jYXN0ZGVidWdnZXIuZGVidWcoXCJzaG93SGlkZVwiLCBgJHt0aW1pbmd9ICR7dGhpcy5zaG93fWApO1xyXG4gICAgaWYgKHRoaXMuc2hvdykge1xyXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9LCB0aW1pbmcpO1xyXG4gICAgfVxyXG4gIH1cclxuICBzZXRDb2xvcihjb2xvcikge1xyXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gIH1cclxuICBhbmltYXRlU2Vla2JhcigpIHtcclxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuXHJcbiAgICBsZXQgdG90YWx3aWR0aCA9IHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgY29uc3QgaW5uZXJGdW5jdGlvbiA9ICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgbGVmdFBvc2l0aW9uID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XHJcbiAgICAgICAgbGV0IHJpZ2h0UG9zaXRpb24gPVxyXG4gICAgICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQ7XHJcbiAgICAgICAgbGV0IGxlZnRQYXJlbnRQb3NpdGlvbiA9XHJcbiAgICAgICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xyXG4gICAgICAgIGxldCByaWdodFBhcmVudFBvc2l0aW9uID1cclxuICAgICAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0O1xyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggPD0gdG90YWx3aWR0aCAvIDQgJiZcclxuICAgICAgICAgIGxlZnRQb3NpdGlvbiA8PSBsZWZ0UGFyZW50UG9zaXRpb25cclxuICAgICAgICApIHtcclxuICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggKyB0aGlzLnNwZWVkXHJcbiAgICAgICAgICB9cHhgO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAobGVmdFBvc2l0aW9uICsgdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIDwgcmlnaHRQYXJlbnRQb3NpdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2xlZnRQb3NpdGlvbiArIHRoaXMuc3BlZWR9cHhgO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGxlZnRQb3NpdGlvbiA8IHJpZ2h0UGFyZW50UG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2xlZnRQb3NpdGlvbiArIHRoaXMuc3BlZWR9cHhgO1xyXG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC0gdGhpcy5zcGVlZFxyXG4gICAgICAgICAgICAgIH1weGA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtsZWZ0UGFyZW50UG9zaXRpb259cHhgO1xyXG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY2FuY2VsQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoaW5uZXJGdW5jdGlvbik7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShpbm5lckZ1bmN0aW9uKTtcclxuICB9XHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLmNhbmNlbEFuaW1hdGlvbiA9IHRydWU7XHJcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBcIjAlXCI7XHJcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHRoaXMuaW5pdGlhbExlZnRQb3NpdGlvbjtcclxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlZWtCYXI7XHJcbiIsImltcG9ydCBVdGlscyBmcm9tIFwiLi4vaGVscGVycy9VdGlsc1wiO1xyXG5cclxuY2xhc3MgVGltZXIge1xyXG4gIGNvbnN0cnVjdG9yKGlkKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKTtcclxuICAgIHRoaXMuZWxlbWVudC50ZXh0Q29udGVudCA9IFwiMDA6MDAgLyAwMDowMFwiO1xyXG4gIH1cclxuICB1cGRhdGUoY3VycmVudFRpbWUsIGR1cmF0aW9uKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSBgJHtVdGlscy5mb3JtYXRUaW1lKFxyXG4gICAgICBjdXJyZW50VGltZVxyXG4gICAgKX0gLyR7VXRpbHMuZm9ybWF0VGltZShkdXJhdGlvbil9YDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRpbWVyO1xyXG4iLCJpbXBvcnQgQWRVSSBmcm9tIFwiLi9hZFVJXCI7XHJcbmNsYXNzIFZhc3RTZXJ2aWNlIHtcclxuICBzdGF0aWMgREVCVUdfVkFTVF9TRVJWSUNFID0gXCJERUJVR19WQVNUX1NFUlZJQ0VcIjtcclxuICBjb25zdHJ1Y3RvcihyZWNlaXZlcikge1xyXG4gICAgdGhpcy5yZWNlaXZlciA9IHJlY2VpdmVyO1xyXG4gICAgdGhpcy5hZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWRDb250YWluZXJcIik7XHJcbiAgICB0aGlzLmFkc0Rpc3BsYXlDb250YWluZXIgPSBudWxsO1xyXG4gICAgdGhpcy5hZHNMb2FkZXIgPSBudWxsO1xyXG4gICAgdGhpcy5hZHNEaXNwbGF5SW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuY3VycmVudEFkcyA9IG51bGw7XHJcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgICB0aGlzLmF1dG9wbGF5QWxsb3dlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5hdXRvcGxheVJlcXVpcmVzTXV0ZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuaGFzRXJyb3JzID0gZmFsc2U7XHJcbiAgICB0aGlzLmFkVUkgPSBudWxsO1xyXG4gICAgdGhpcy5hZER1cmF0aW9uID0gMDtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgIGdvb2dsZS5pbWEuc2V0dGluZ3Muc2V0VnBhaWRNb2RlKFxyXG4gICAgICBnb29nbGUuaW1hLkltYVNka1NldHRpbmdzLlZwYWlkTW9kZS5FTkFCTEVEXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYWRzRGlzcGxheUNvbnRhaW5lciA9IG5ldyBnb29nbGUuaW1hLkFkRGlzcGxheUNvbnRhaW5lcihcclxuICAgICAgdGhpcy5hZENvbnRhaW5lcixcclxuICAgICAgdGhpcy5yZWNlaXZlci52aWRlb1xyXG4gICAgKTtcclxuICAgIHRoaXMuYWRzTG9hZGVyID0gbmV3IGdvb2dsZS5pbWEuQWRzTG9hZGVyKHRoaXMuYWRzRGlzcGxheUNvbnRhaW5lcik7XHJcbiAgICB0aGlzLmFkc0xvYWRlci5nZXRTZXR0aW5ncygpLnNldFBsYXllclR5cGUoXCJjYXN0L2NsaWVudC1zaWRlXCIpO1xyXG4gICAgdGhpcy5hZHNMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgZ29vZ2xlLmltYS5BZHNNYW5hZ2VyTG9hZGVkRXZlbnQuVHlwZS5BRFNfTUFOQUdFUl9MT0FERUQsXHJcbiAgICAgIHRoaXMub25BZHNNYW5hZ2VyTG9hZGVkLmJpbmQodGhpcyksXHJcbiAgICAgIGZhbHNlXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYWRzTG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIGdvb2dsZS5pbWEuQWRFcnJvckV2ZW50LlR5cGUuQURfRVJST1IsXHJcbiAgICAgIHRoaXMub25BZEVycm9yLFxyXG4gICAgICBmYWxzZVxyXG4gICAgKTtcclxuICAgIHRoaXMuYWRVSSA9IG5ldyBBZFVJKHRoaXMucmVjZWl2ZXIpO1xyXG4gIH1cclxuXHJcbiAgb25BbGxBZHNDb21wbGV0ZWQoZSkge1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFZhc3RTZXJ2aWNlLkRFQlVHX1ZBU1RfU0VSVklDRSxcclxuICAgICAgXCJhZCBjb21wbGV0ZWRcIlxyXG4gICAgKTtcclxuICB9XHJcbiAgb25BZENvbXBsZXRlZChlKSB7XHJcbiAgICB0aGlzLnJlY2VpdmVyLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcclxuICAgICAgVmFzdFNlcnZpY2UuREVCVUdfVkFTVF9TRVJWSUNFLFxyXG4gICAgICBcImFkIGNvbXBsZXRlZFwiXHJcbiAgICApO1xyXG4gICAgdGhpcy5hZFVJLmRpc2FibGUoKTtcclxuICAgIGlmICh0aGlzLmFkc01hbmFnZXIpIHRoaXMuYWRzTWFuYWdlci5kZXN0cm95KCk7XHJcbiAgICBpZiAoIXRoaXMuaGFzRXJyb3JzICYmIHRoaXMucmVjZWl2ZXIuaXNBZFBsYXlpbmcpIHRoaXMucmVjZWl2ZXIub25FbmQoKTtcclxuICAgIC8vIHRoaXMuYWRzTWFuYWdlci5kZXN0cm95KCk7XHJcbiAgICAvLyB0aGlzLnJlY2VpdmVyLnBsYXllck1hbmFnZXIuc2BldE1lZGlhRWxlbWVudCh0aGlzLnZpZGVvKTtcclxuICB9XHJcbiAgb25Db250ZW50UGF1c2VSZXF1ZXN0ZWQoZSkge1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFZhc3RTZXJ2aWNlLkRFQlVHX1ZBU1RfU0VSVklDRSxcclxuICAgICAgXCJDb250ZW50IFBhdXNlIFJlcXVlc3RcIlxyXG4gICAgKTtcclxuICB9XHJcbiAgb25Db250ZW50UmVzdW1lUmVxdWVzdGVkKCkge1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFZhc3RTZXJ2aWNlLkRFQlVHX1ZBU1RfU0VSVklDRSxcclxuICAgICAgXCJDb250ZW50IFJlc3VtZSBSZXF1ZXN0XCJcclxuICAgICk7XHJcbiAgfVxyXG4gIG9uQWRMb2FkZWQoZSkge1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFZhc3RTZXJ2aWNlLkRFQlVHX1ZBU1RfU0VSVklDRSxcclxuICAgICAgXCJBZCBsb2FkZWRcIlxyXG4gICAgKTtcclxuICB9XHJcbiAgbG9hZEFkcyh2YXN0VXJsLCB2YXN0WG1sKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRBZHMgPSB7fTtcclxuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xyXG4gICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVjZWl2ZXIuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFxyXG4gICAgICBWYXN0U2VydmljZS5ERUJVR19WQVNUX1NFUlZJQ0UsXHJcbiAgICAgIFwibG9hZCBcIiArIHZhc3RVcmxcclxuICAgICk7XHJcblxyXG4gICAgaWYgKHZhc3RVcmwpIHtcclxuICAgICAgdGhpcy5jdXJyZW50QWRzLmNvbnRlbnQgPSB2YXN0VXJsO1xyXG4gICAgICB0aGlzLmN1cnJlbnRBZHMudHlwZSA9IFwidXJsXCI7XHJcbiAgICB9IGVsc2UgaWYgKHZhc3RYbWwpIHtcclxuICAgICAgdGhpcy5jdXJyZW50QWRzLmNvbnRlbnQgPSB2YXN0WG1sO1xyXG4gICAgICB0aGlzLmN1cnJlbnRBZHMudHlwZSA9IFwieG1sXCI7XHJcbiAgICB9XHJcbiAgICB0aGlzLmN1cnJlbnRBZHMuY3VycmVudEFkSW5kZXggPSAwO1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoVmFzdFNlcnZpY2UuREVCVUdfVkFTVF9TRVJWSUNFKTtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRBZHMudHlwZSA9PT0gXCJ1cmxcIikgdGhpcy5sb2FkKHRoaXMuY3VycmVudEFkcy5jb250ZW50KTtcclxuICAgIGVsc2UgdGhpcy5sb2FkKG51bGwsIHRoaXMuY3VycmVudEFkcy5jb250ZW50KTtcclxuICB9XHJcbiAgbG9hZCh2YXN0VXJsLCB2YXN0WG1sKSB7XHJcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdCgpO1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFZhc3RTZXJ2aWNlLkRFQlVHX1ZBU1RfU0VSVklDRSxcclxuICAgICAgXCJJbml0aWFsaXplZFwiICsgdGhpcy52YXN0VXJsXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYWRzUmVxdWVzdCA9IG5ldyBnb29nbGUuaW1hLkFkc1JlcXVlc3QoKTtcclxuICAgIGlmICh2YXN0VXJsKSB7XHJcbiAgICAgIHRoaXMuYWRzUmVxdWVzdC5hZFRhZ1VybCA9IHZhc3RVcmw7XHJcbiAgICB9IGVsc2UgaWYgKHZhc3RYbWwpIHtcclxuICAgICAgdGhpcy5hZHNSZXF1ZXN0LmFkc1Jlc3BvbnNlID0gdmFzdFhtbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFkc1JlcXVlc3QubGluZWFyQWRTbG90V2lkdGggPSB0aGlzLnJlY2VpdmVyLnZpZGVvLmNsaWVudFdpZHRoO1xyXG4gICAgdGhpcy5hZHNSZXF1ZXN0LmxpbmVhckFkU2xvdEhlaWdodCA9IHRoaXMucmVjZWl2ZXIudmlkZW8uY2xpZW50SGVpZ2h0O1xyXG4gICAgdGhpcy5hZHNSZXF1ZXN0Lm5vbkxpbmVhckFkU2xvdFdpZHRoID0gdGhpcy5yZWNlaXZlci52aWRlby5jbGllbnRXaWR0aDtcclxuICAgIHRoaXMuYWRzUmVxdWVzdC5ub25MaW5lYXJBZFNsb3RIZWlnaHQgPVxyXG4gICAgICB0aGlzLnJlY2VpdmVyLnZpZGVvLmNsaWVudEhlaWdodCAvIDM7XHJcblxyXG4gICAgdGhpcy5hZHNSZXF1ZXN0LnNldEFkV2lsbEF1dG9QbGF5KHRoaXMuYXV0b3BsYXlBbGxvd2VkKTtcclxuICAgIHRoaXMuYWRzUmVxdWVzdC5zZXRBZFdpbGxQbGF5TXV0ZWQodGhpcy5hdXRvcGxheVJlcXVpcmVzTXV0ZWQpO1xyXG5cclxuICAgIHRoaXMuYWRzUmVxdWVzdC52YXN0TG9hZFRpbWVvdXQgPSA4MDAwO1xyXG4gICAgdGhpcy5hZHNMb2FkZXIucmVxdWVzdEFkcyh0aGlzLmFkc1JlcXVlc3QpO1xyXG4gIH1cclxuICBvblRpbWVVcGRhdGUoZXZlbnQpIHtcclxuICAgIGNvbnN0IGFkRGF0YSA9IGV2ZW50LmdldEFkRGF0YSgpO1xyXG4gICAgY29uc3QgY3VycmVudEFkID0gdGhpcy5hZHNNYW5hZ2VyLmdldEN1cnJlbnRBZCgpO1xyXG4gICAgbGV0IGFkSWQgPSBjdXJyZW50QWQ/LmdldEFkSWQoKT8udG9TdHJpbmcoKTtcclxuICAgIHRoaXMucmVjZWl2ZXIucmVjZWl2ZXJDb250cm9scy51cGRhdGUoe1xyXG4gICAgICBjdXJyZW50VGltZTogYWREYXRhLmN1cnJlbnRUaW1lLFxyXG4gICAgICBkdXJhdGlvbjogYWREYXRhLmR1cmF0aW9uLFxyXG4gICAgICAvLyBhZDogYWRJbmRleEluZm8sXHJcbiAgICB9KTtcclxuICAgIHRoaXMucmVjZWl2ZXIuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFxyXG4gICAgICBWYXN0U2VydmljZS5ERUJVR19WQVNUX1NFUlZJQ0UsXHJcbiAgICAgIFwiIE9OIFRJTUUgVVBEQVRFXCJcclxuICAgICk7XHJcbiAgfVxyXG4gIG9uQWRTa2lwKGUpIHtcclxuICAgIHRoaXMucmVjZWl2ZXIuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFxyXG4gICAgICBWYXN0U2VydmljZS5ERUJVR19WQVNUX1NFUlZJQ0UsXHJcbiAgICAgIFwiT04gQUQgU2tpXCJcclxuICAgICk7XHJcbiAgfVxyXG4gIG9uQWRTdGFydGVkKGUpIHtcclxuICAgIHRoaXMucmVjZWl2ZXIuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFxyXG4gICAgICBWYXN0U2VydmljZS5ERUJVR19WQVNUX1NFUlZJQ0UsXHJcbiAgICAgIFwiT04gQUQgU1RBUlRFRFwiXHJcbiAgICApO1xyXG4gICAgdGhpcy5yZWNlaXZlci5pc0FkUGxheWluZyA9IHRydWU7XHJcbiAgICB0aGlzLmFkVUkuZW5hYmxlKCk7XHJcbiAgfVxyXG4gIG9uQWRzTWFuYWdlckxvYWRlZChhZHNNYW5hZ2VyTG9hZGVkRXZlbnQpIHtcclxuICAgIGlmICh0aGlzLmFkc01hbmFnZXIpIHtcclxuICAgICAgdGhpcy5hZHNNYW5hZ2VyLmRlc3Ryb3koKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVjZWl2ZXIuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFxyXG4gICAgICBWYXN0U2VydmljZS5ERUJVR19WQVNUX1NFUlZJQ0UsXHJcbiAgICAgIFwiIGJlZm9yZSBnZXRhZHNtYW5hZ2VyXCJcclxuICAgICk7XHJcbiAgICBjb25zdCBhZHNSZW5kZXJpbmdTZXR0aW5ncyA9IG5ldyBnb29nbGUuaW1hLkFkc1JlbmRlcmluZ1NldHRpbmdzKCk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIgPSBhZHNNYW5hZ2VyTG9hZGVkRXZlbnQuZ2V0QWRzTWFuYWdlcihcclxuICAgICAgdGhpcy5yZWNlaXZlci52aWRlbyxcclxuICAgICAgYWRzUmVuZGVyaW5nU2V0dGluZ3NcclxuICAgICk7XHJcbiAgICB0aGlzLnJlY2VpdmVyLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcclxuICAgICAgVmFzdFNlcnZpY2UuREVCVUdfVkFTVF9TRVJWSUNFLFxyXG4gICAgICBcIiBhZnRlciBnZXRhZHNtYW5hZ2VyXCJcclxuICAgICk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgZ29vZ2xlLmltYS5BZEVycm9yRXZlbnQuVHlwZS5BRF9FUlJPUixcclxuICAgICAgdGhpcy5vbkFkRXJyb3IuYmluZCh0aGlzKVxyXG4gICAgKTtcclxuICAgIHRoaXMucmVjZWl2ZXIuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFxyXG4gICAgICBWYXN0U2VydmljZS5ERUJVR19WQVNUX1NFUlZJQ0UsXHJcbiAgICAgIFwiIGFmdGVyIG9uYWRlcnJvclwiXHJcbiAgICApO1xyXG4gICAgdGhpcy5hZHNNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIGdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkNPTlRFTlRfUEFVU0VfUkVRVUVTVEVELFxyXG4gICAgICB0aGlzLm9uQ29udGVudFBhdXNlUmVxdWVzdGVkLmJpbmQodGhpcylcclxuICAgICk7XHJcbiAgICB0aGlzLnJlY2VpdmVyLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcclxuICAgICAgVmFzdFNlcnZpY2UuREVCVUdfVkFTVF9TRVJWSUNFLFxyXG4gICAgICBcIiBhZnRlciBvbkNvbnRlbnRQYXVzZVJlcXVlc3RlZFwiXHJcbiAgICApO1xyXG4gICAgdGhpcy5hZHNNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIGdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkNPTlRFTlRfUkVTVU1FX1JFUVVFU1RFRCxcclxuICAgICAgdGhpcy5vbkNvbnRlbnRSZXN1bWVSZXF1ZXN0ZWQuYmluZCh0aGlzKVxyXG4gICAgKTtcclxuICAgIHRoaXMucmVjZWl2ZXIuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFxyXG4gICAgICBWYXN0U2VydmljZS5ERUJVR19WQVNUX1NFUlZJQ0UsXHJcbiAgICAgIFwiIGFmdGVyIG9uQWxsQWRzQ29tcGxldGVkXCJcclxuICAgICk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuQUxMX0FEU19DT01QTEVURUQsXHJcbiAgICAgIHRoaXMub25BbGxBZHNDb21wbGV0ZWQuYmluZCh0aGlzKVxyXG4gICAgKTtcclxuICAgIHRoaXMucmVjZWl2ZXIuY2FzdERlYnVnTG9nZ2VyLmRlYnVnKFxyXG4gICAgICBWYXN0U2VydmljZS5ERUJVR19WQVNUX1NFUlZJQ0UsXHJcbiAgICAgIFwiIGFmdGVyIG9uQWRMb2FkZWRcIlxyXG4gICAgKTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBnb29nbGUuaW1hLkFkRXZlbnQuVHlwZS5MT0FERUQsXHJcbiAgICAgIHRoaXMub25BZExvYWRlZC5iaW5kKHRoaXMpXHJcbiAgICApO1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFZhc3RTZXJ2aWNlLkRFQlVHX1ZBU1RfU0VSVklDRSxcclxuICAgICAgXCIgYWZ0ZXIgb25BZFN0YXJ0ZWRcIlxyXG4gICAgKTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBnb29nbGUuaW1hLkFkRXZlbnQuVHlwZS5TVEFSVEVELFxyXG4gICAgICB0aGlzLm9uQWRTdGFydGVkLmJpbmQodGhpcylcclxuICAgICk7XHJcbiAgICB0aGlzLnJlY2VpdmVyLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcclxuICAgICAgVmFzdFNlcnZpY2UuREVCVUdfVkFTVF9TRVJWSUNFLFxyXG4gICAgICBcIiBhZnRlciBvbkFkQ29tcGxldGVkXCJcclxuICAgICk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuQ09NUExFVEUsXHJcbiAgICAgIHRoaXMub25BZENvbXBsZXRlZC5iaW5kKHRoaXMpXHJcbiAgICApO1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFZhc3RTZXJ2aWNlLkRFQlVHX1ZBU1RfU0VSVklDRSxcclxuICAgICAgXCIgYWZ0ZXIgb25Db250ZW50UGF1c2VSZXF1ZXN0ZWRcIlxyXG4gICAgKTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBnb29nbGUuaW1hLkFkRXZlbnQuVHlwZS5TS0lQUEVELFxyXG4gICAgICB0aGlzLm9uQWRTa2lwLmJpbmQodGhpcylcclxuICAgICk7XHJcbiAgICB0aGlzLnJlY2VpdmVyLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcclxuICAgICAgVmFzdFNlcnZpY2UuREVCVUdfVkFTVF9TRVJWSUNFLFxyXG4gICAgICBcIiBhZnRlciBvbkFkU2tpcFwiXHJcbiAgICApO1xyXG4gICAgdGhpcy5hZHNNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIGdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkFEX1BST0dSRVNTLFxyXG4gICAgICB0aGlzLm9uVGltZVVwZGF0ZS5iaW5kKHRoaXMpXHJcbiAgICApO1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFZhc3RTZXJ2aWNlLkRFQlVHX1ZBU1RfU0VSVklDRSxcclxuICAgICAgXCIgYWZ0ZXIgb25UaW1lVXBkYXRlXCJcclxuICAgICk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuQURfQlVGRkVSSU5HLFxyXG4gICAgICAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBnb29nbGUuaW1hLkFkRXZlbnQuVHlwZS5TS0lQUEFCTEVfU1RBVEVfQ0hBTkdFRCxcclxuICAgICAgKCkgPT4ge1xyXG4gICAgICAgIFV0aWxzLmZpcmUodGhpcy5hZENvbnRhaW5lciwgRXZlbnRzLmFkRXZlbnRzLkFEX1NLSVBQQUJMRSwge1xyXG4gICAgICAgICAgY3VycmVudFRpbWU6IHRoaXMucGxheWVyLnZpZGVvLmN1cnJlbnRUaW1lLFxyXG4gICAgICAgICAgYWRQbGF5SWQ6IHRoaXMuYWRzTWFuYWdlci5nZXRDdXJyZW50QWQoKT8uZ2V0QWRJZCgpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFZhc3RTZXJ2aWNlLkRFQlVHX1ZBU1RfU0VSVklDRSxcclxuICAgICAgXCIganVzdCBiZWZvcmUgcGxheWluZyBhZFwiXHJcbiAgICApO1xyXG4gICAgdGhpcy5wbGF5QWRzKCk7XHJcbiAgfVxyXG4gIHBsYXlBZHMoKSB7XHJcbiAgICBpZiAoIXRoaXMuYWRzRGlzcGxheUluaXRpYWxpemVkKSB7XHJcbiAgICAgIHRoaXMuYWRzRGlzcGxheUNvbnRhaW5lci5pbml0aWFsaXplKCk7XHJcbiAgICAgIHRoaXMuYWRzRGlzcGxheUluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5yZWNlaXZlci52aWRlby5jbGllbnRXaWR0aDtcclxuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucmVjZWl2ZXIudmlkZW8uY2xpZW50SGVpZ2h0O1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5yZWNlaXZlci5pc0FkUGxheWluZyA9IHRydWU7XHJcbiAgICAgIHRoaXMuYWRzTWFuYWdlci5pbml0KHdpZHRoLCBoZWlnaHQsIGdvb2dsZS5pbWEuVmlld01vZGUuRlVMTFNDUkVFTik7XHJcbiAgICAgIHRoaXMuYWRzTWFuYWdlci5zdGFydCgpO1xyXG4gICAgICB0aGlzLnJlY2VpdmVyLnJlY2VpdmVyQ29udHJvbHMubG9hZGVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH0gY2F0Y2ggKGFkRXJyb3IpIHtcclxuICAgICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgICAgdGhpcy5WYXN0U2VydmljZS5ERUJVR19WQVNUX1NFUlZJQ0UsXHJcbiAgICAgICAgXCJBZHNNYW5hZ2VyIGNvdWxkIG5vdCBiZSBzdGFydGVkXCIgKyBhZEVycm9yLmdldE1lc3NhZ2UoKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuICBvbkFkRXJyb3IoZSkge1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFZhc3RTZXJ2aWNlLkRFQlVHX1ZBU1RfU0VSVklDRSxcclxuICAgICAgXCIgYWQgZXJyb3JcIiArIGVcclxuICAgICk7XHJcbiAgICB0aGlzLmhhc0Vycm9ycyA9IHRydWU7XHJcbiAgICB0aGlzLnJlY2VpdmVyLm9uRW5kKCkuYmluZCh0aGlzLnJlY2VpdmVyKTtcclxuICB9XHJcbiAgcmVzdW1lKCkge1xyXG4gICAgdGhpcy5yZWNlaXZlci5jYXN0RGVidWdMb2dnZXIuZGVidWcoXHJcbiAgICAgIFZhc3RTZXJ2aWNlLkRFQlVHX1ZBU1RfU0VSVklDRSxcclxuICAgICAgXCJSRVNVTUlORyBBRCBFdmVudFwiXHJcbiAgICApO1xyXG4gICAgaWYgKCF0aGlzLmFkc01hbmFnZXIpIHJldHVybjtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5yZXN1bWUoKTtcclxuICB9XHJcbiAgcGF1c2UoKSB7XHJcbiAgICB0aGlzLnJlY2VpdmVyLmNhc3REZWJ1Z0xvZ2dlci5kZWJ1ZyhcclxuICAgICAgVmFzdFNlcnZpY2UuREVCVUdfVkFTVF9TRVJWSUNFLFxyXG4gICAgICBcIlBBVVNFIEFEIEV2ZW50XCJcclxuICAgICk7XHJcbiAgICBpZiAoIXRoaXMuYWRzTWFuYWdlcikgcmV0dXJuO1xyXG4gICAgdGhpcy5hZHNNYW5hZ2VyLnBhdXNlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWYXN0U2VydmljZTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBSZWNlaXZlciBmcm9tIFwiLi9tb2RlbHMvcmVjZWl2ZXJcIjtcclxuXHJcbi8vYSBib29sZWFuIHRlbGxpbmcgd2hldGhlciBITFMgaXMgc3VwcG9ydGVkIGluIHRoZSBicm93c2VyXHJcbnZwUmVjZWl2ZXIuSExTc3VwcG9ydGVkID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiB2cFJlY2VpdmVyKGlkLCBjb25maWcpIHtcclxuICBsZXQgcmVjZWl2ZXIgPSBuZXcgUmVjZWl2ZXIoaWQsIGNvbmZpZyk7XHJcbiAgcmVjZWl2ZXIuZmFrZWluaXQoKTtcclxuICB2cFJlY2VpdmVyLnJlY2VpdmVyID0gcmVjZWl2ZXI7XHJcbiAgcmV0dXJuIHJlY2VpdmVyO1xyXG59XHJcblxyXG53aW5kb3cudnBSZWNlaXZlciA9IHZwUmVjZWl2ZXI7XHJcbiJdLCJuYW1lcyI6WyJkZWZhdWxDb25maWciLCJhZFRpbWVTbGlkZXJDb2xvciIsInRpbWVTbGlkZXJDb2xvciIsIm1vZHVsZSIsImV4cG9ydHMiLCJpc0RldmVsb3BtZW50IiwicHJvY2VzcyIsImVudiIsIklTREVWRUxPUE1FTlQiLCJjb25zb2xlIiwibG9nIiwiY29uZmlnIiwiZGVidWciLCJtYXhCdWZmZXJTaXplIiwibWF4TG9hZGluZ0RlbGF5IiwibnVkZ2VNYXhSZXRyeSIsImxpdmVTeW5jRHVyYXRpb25Db3VudCIsImxpdmVNYXhMYXRlbmN5RHVyYXRpb25Db3VudCIsIkluZmluaXR5IiwibWFuaWZlc3RMb2FkaW5nTWF4UmV0cnkiLCJtYW5pZmVzdExvYWRpbmdSZXRyeURlbGF5IiwibWFuaWZlc3RMb2FkaW5nTWF4UmV0cnlUaW1lb3V0IiwiZW1lRW5hYmxlZCIsIndpZGV2aW5lTGljZW5zZVVybCIsImZvcm1hdFRpbWUiLCJ0aW1lIiwiaG91cnMiLCJNYXRoIiwiZmxvb3IiLCJtaW51dGVzIiwic2Vjb25kcyIsInRvU3RyaW5nIiwicGFkU3RhcnQiLCJmaXJlIiwiZWwiLCJldmVudE5hbWUiLCJkZXRhaWwiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImV2dCIsIkN1c3RvbUV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsIkFkVUkiLCJjb25zdHJ1Y3RvciIsInJlY2VpdmVyIiwiZW5hYmxlIiwiYmluZCIsImRpc2FibGUiLCJyZWNlaXZlckNvbnRyb2xzIiwic2Vla2JhciIsInNldENvbG9yIiwiU2Vla0JhciIsIlRpbWVyIiwiUmVjZWl2ZXJDb250cm9scyIsImlkIiwidGltZXIiLCJjYXN0RGVidWdnZXIiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwib3ZlcmxheSIsInBhcmVudEVsZW1lbnQiLCJpbmZvIiwiY2hpbGRyZW4iLCJzaG93IiwibG9hZGVyIiwicGxheUljb24iLCJwYXVzZUljb24iLCJ2aWRlb0luZm8iLCJzcGxhc2hTY3JlZW4iLCJ0aHVtYm5haWwiLCJzZXRDYXN0RGVidWdnZXIiLCJwYXVzZSIsInN0eWxlIiwiZGlzcGxheSIsInNldFRpbWVvdXQiLCJwbGF5IiwidXBkYXRlIiwic3RhdGUiLCJzZXRQcm9ncmVzcyIsImN1cnJlbnRUaW1lIiwiZHVyYXRpb24iLCJoaWRlQ29udHJvbHMiLCJzaG93SGlkZSIsInNob3dDb250cm9scyIsInJlc2V0T3ZlcmxheSIsInRpbWVvdXQiLCJyZXNldCIsInRpbWluZyIsImluaXRPdmVybGF5IiwibWV0YWRhdGEiLCJpbWFnZXMiLCJsZW5ndGgiLCJzcmMiLCJ1cmwiLCJ0ZXh0Q29udGVudCIsInRpdGxlIiwiZGVzY3JpcHRpb24iLCJhbmltYXRlU2Vla2JhciIsImVycm9yIiwiaGxzY29uZmlnIiwiVmFzdFNlcnZpY2UiLCJFbnZpcm9ubWVudCIsIlJlY2VpdmVyIiwiY29udGV4dCIsInBsYXllck1hbmFnZXIiLCJjYXN0RGVidWdMb2dnZXIiLCJhcHBJZCIsInZpZGVvIiwicGxheWJhY2tDb25maWciLCJjb250cm9scyIsImhscyIsInZpZGVvT2JqZWN0IiwidmlkZW9Db250YWluZXIiLCJwbGF5YmFja1JhdGUiLCJhdXRvcGxheSIsIm1lZGlhTWFuYWdlciIsImNhc3RSZWNlaXZlck1hbmFnZXIiLCJ2aWRlb1N0YXJ0ZWQiLCJ2YXN0U2VydmljZSIsImFkQnJlYWtzIiwiZGVidWdUYWdzIiwiTE9BRF9SRVFVRVNUIiwiQVRUQUNIX01FRElBIiwiT05QTEFZIiwiU1RBUlQiLCJJTklUIiwiRVZFTlRTIiwiT05FTkQiLCJCUk9BRENBU1QiLCJPTlRJTUVVUERBVEVFIiwiSU5JVFNUQVRFIiwiaXNBZFBsYXlpbmciLCJOQU1FU1BBQ0UiLCJzdGFydCIsImJyb2FkY2FzdCIsIm9uUGxheSIsImRhdGEiLCJnZXRBdHRyaWJ1dGUiLCJ0aGVuIiwiY2F0Y2giLCJlIiwib25QYXVzZSIsInJlc3VtZSIsImFkZFBsYXllckV2ZW50cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJvblRpbWVVcGRhdGUiLCJvbkVuZCIsIm1lc3NhZ2UiLCJyZXF1aXJlZCIsInNlbmRDdXN0b21NZXNzYWdlIiwidW5kZWZpbmVkIiwicmVwbGF5IiwiY29kZSIsImRlc3Ryb3kiLCJtYXAiLCJhZCIsImJyZWFrVGltaW5nVmFsdWUiLCJpbmNsdWRlcyIsImxvYWRBZHMiLCJhZFRhZ1VybCIsInNoaWZ0IiwiT05USU1FVVBEQVRFIiwidXBkYXRlUGxheWVyU3RhdGUiLCJhdHRhY2hNZWRpYSIsInZwUmVjZWl2ZXIiLCJITFNzdXBwb3J0ZWQiLCJIbHMiLCJpc1N1cHBvcnRlZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJmaWxlIiwiZW5kc1dpdGgiLCJkYXNoIiwiZGFzaGpzIiwiTWVkaWFQbGF5ZXIiLCJjcmVhdGUiLCJzZXRQcm90ZWN0aW9uRGF0YSIsInNlcnZlclVSTCIsImluaXRpYWxpemUiLCJvbiIsIkV2ZW50cyIsIk1FRElBX0FUVEFDSEVEIiwibG9hZFNvdXJjZSIsIk1BTklGRVNUX1BBUlNFRCIsImV2ZW50IiwiRVJST1IiLCJkZXRhaWxzIiwiZmFrZWluaXQiLCJzZWxmIiwidHlwZSIsImJyZWFrVHlwZSIsImJyZWFrVGltaW5nVHlwZSIsImJpbmRNZXRob2RzIiwiaW5pdCIsImNhc3QiLCJmcmFtZXdvcmsiLCJDYXN0UmVjZWl2ZXJDb250ZXh0IiwiZ2V0SW5zdGFuY2UiLCJzZXRMb2dnZXJMZXZlbCIsIkxvZ2dlckxldmVsIiwiREVCVUciLCJDYXN0RGVidWdMb2dnZXIiLCJzZXRFbmFibGVkIiwiZ2V0UGxheWVyTWFuYWdlciIsInNldE1lZGlhRWxlbWVudCIsInNldFN1cHBvcnRlZE1lZGlhQ29tbWFuZHMiLCJtZXNzYWdlcyIsIkNvbW1hbmQiLCJTRUVLIiwiUEFVU0UiLCJQTEFZIiwidWkiLCJDb250cm9scyIsIml0ZW0xIiwiQnJvd3NlSXRlbSIsInN1YnRpdGxlIiwiaW1hZ2VUeXBlIiwiQnJvd3NlSW1hZ2VUeXBlIiwiTVVTSUNfVFJBQ0siLCJpbWFnZSIsIkltYWdlIiwiZW50aXR5IiwiaXRlbTIiLCJpdGVtcyIsImJyb3dzZUNvbnRlbnQiLCJCcm93c2VDb250ZW50Iiwib3B0aW9ucyIsIkNhc3RSZWNlaXZlck9wdGlvbnMiLCJjdXN0b21OYW1lc3BhY2VzIiwic3lzdGVtIiwiTWVzc2FnZVR5cGUiLCJiaW5kSW50ZXJjZXB0b3JzIiwib25TZWVrIiwicmVxdWVzdERhdGEiLCJkcmF3QnV0dG9ucyIsImFzc2lnbkJ1dHRvbiIsIkNvbnRyb2xzU2xvdCIsIlNMT1RfU0VDT05EQVJZXzEiLCJDb250cm9sc0J1dHRvbiIsIlFVRVVFX1BSRVYiLCJTTE9UX1BSSU1BUllfMSIsIkNBUFRJT05TIiwiU0xPVF9QUklNQVJZXzIiLCJTRUVLX0ZPUldBUkRfMTUiLCJTTE9UX1NFQ09OREFSWV8yIiwiUVVFVUVfTkVYVCIsIkV2ZW50VHlwZSIsIlNFTkRFUl9ESVNDT05ORUNURUQiLCJ3aW5kb3ciLCJjbG9zZSIsImFkZEN1c3RvbU1lc3NhZ2VMaXN0ZW5lciIsInBhcnNlIiwic2V0TWVzc2FnZUludGVyY2VwdG9yIiwiTE9BRCIsIm9uTG9hZFJlcXVlc3QiLCJpbml0U3RhdGUiLCJsb2FkUmVxdWVzdERhdGEiLCJhZFVJIiwibWVkaWEiLCJjb250ZW50SWQiLCJyZXF1aXJlQWRzIiwiY3VzdG9tRGF0YSIsInN0YWNrIiwiYWRkQnJlYWtzIiwibWVkaWFJbmZvcm1hdGlvbiIsIkxPR19SRUNFSVZFUl9UQUciLCJmZXRjaE1lZGlhQnlJZCIsImNsaXAxIiwiYnJlYWtDbGlwcyIsImNvbnRlbnRVcmwiLCJzdHJlYW0iLCJjb250ZW50VHlwZSIsIndoZW5Ta2lwcGFibGUiLCJicmVha3MiLCJicmVha0NsaXBJZHMiLCJwb3NpdGlvbiIsIlByb21pc2UiLCJhY2NlcHQiLCJyZWplY3QiLCJmZXRjaCIsIkNPTlRFTlRfVVJMIiwicmVzcG9uc2UiLCJqc29uIiwib2JqIiwiY2FzdGRlYnVnZ2VyIiwic3BlZWQiLCJpbnRlcnZhbCIsImNhbmNlbEFuaW1hdGlvbiIsImluaXRpYWxMZWZ0UG9zaXRpb24iLCJsZWZ0Iiwid2lkdGgiLCJjb2xvciIsImJhY2tncm91bmRDb2xvciIsInRvdGFsd2lkdGgiLCJjbGllbnRXaWR0aCIsImlubmVyRnVuY3Rpb24iLCJsZWZ0UG9zaXRpb24iLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJyaWdodFBvc2l0aW9uIiwicmlnaHQiLCJsZWZ0UGFyZW50UG9zaXRpb24iLCJyaWdodFBhcmVudFBvc2l0aW9uIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiVXRpbHMiLCJERUJVR19WQVNUX1NFUlZJQ0UiLCJhZENvbnRhaW5lciIsImFkc0Rpc3BsYXlDb250YWluZXIiLCJhZHNMb2FkZXIiLCJhZHNEaXNwbGF5SW5pdGlhbGl6ZWQiLCJjdXJyZW50QWRzIiwiaW5pdGlhbGl6ZWQiLCJhdXRvcGxheUFsbG93ZWQiLCJhdXRvcGxheVJlcXVpcmVzTXV0ZWQiLCJoYXNFcnJvcnMiLCJhZER1cmF0aW9uIiwiZ29vZ2xlIiwiaW1hIiwic2V0dGluZ3MiLCJzZXRWcGFpZE1vZGUiLCJJbWFTZGtTZXR0aW5ncyIsIlZwYWlkTW9kZSIsIkVOQUJMRUQiLCJBZERpc3BsYXlDb250YWluZXIiLCJBZHNMb2FkZXIiLCJnZXRTZXR0aW5ncyIsInNldFBsYXllclR5cGUiLCJBZHNNYW5hZ2VyTG9hZGVkRXZlbnQiLCJUeXBlIiwiQURTX01BTkFHRVJfTE9BREVEIiwib25BZHNNYW5hZ2VyTG9hZGVkIiwiQWRFcnJvckV2ZW50IiwiQURfRVJST1IiLCJvbkFkRXJyb3IiLCJvbkFsbEFkc0NvbXBsZXRlZCIsIm9uQWRDb21wbGV0ZWQiLCJhZHNNYW5hZ2VyIiwib25Db250ZW50UGF1c2VSZXF1ZXN0ZWQiLCJvbkNvbnRlbnRSZXN1bWVSZXF1ZXN0ZWQiLCJvbkFkTG9hZGVkIiwidmFzdFVybCIsInZhc3RYbWwiLCJjb250ZW50IiwiY3VycmVudEFkSW5kZXgiLCJsb2FkIiwiYWRzUmVxdWVzdCIsIkFkc1JlcXVlc3QiLCJhZHNSZXNwb25zZSIsImxpbmVhckFkU2xvdFdpZHRoIiwibGluZWFyQWRTbG90SGVpZ2h0IiwiY2xpZW50SGVpZ2h0Iiwibm9uTGluZWFyQWRTbG90V2lkdGgiLCJub25MaW5lYXJBZFNsb3RIZWlnaHQiLCJzZXRBZFdpbGxBdXRvUGxheSIsInNldEFkV2lsbFBsYXlNdXRlZCIsInZhc3RMb2FkVGltZW91dCIsInJlcXVlc3RBZHMiLCJhZERhdGEiLCJnZXRBZERhdGEiLCJjdXJyZW50QWQiLCJnZXRDdXJyZW50QWQiLCJhZElkIiwiZ2V0QWRJZCIsIm9uQWRTa2lwIiwib25BZFN0YXJ0ZWQiLCJhZHNNYW5hZ2VyTG9hZGVkRXZlbnQiLCJhZHNSZW5kZXJpbmdTZXR0aW5ncyIsIkFkc1JlbmRlcmluZ1NldHRpbmdzIiwiZ2V0QWRzTWFuYWdlciIsIkFkRXZlbnQiLCJDT05URU5UX1BBVVNFX1JFUVVFU1RFRCIsIkNPTlRFTlRfUkVTVU1FX1JFUVVFU1RFRCIsIkFMTF9BRFNfQ09NUExFVEVEIiwiTE9BREVEIiwiU1RBUlRFRCIsIkNPTVBMRVRFIiwiU0tJUFBFRCIsIkFEX1BST0dSRVNTIiwiQURfQlVGRkVSSU5HIiwibG9hZGluZyIsIlNLSVBQQUJMRV9TVEFURV9DSEFOR0VEIiwiYWRFdmVudHMiLCJBRF9TS0lQUEFCTEUiLCJwbGF5ZXIiLCJhZFBsYXlJZCIsInBsYXlBZHMiLCJoZWlnaHQiLCJWaWV3TW9kZSIsIkZVTExTQ1JFRU4iLCJhZEVycm9yIiwiZ2V0TWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=