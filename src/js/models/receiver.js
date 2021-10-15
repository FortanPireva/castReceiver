import defaulConfig from "../config/defaultConfig";
import hlsconfig from "../config/hlsConfig";
import ReceiverControls from "./receiver-controls";
import VastService from "./vastService";
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
    this.receiverControls = new ReceiverControls(".controls", this);
    this.mediaManager = null;
    this.castReceiverManager = null;
    this.videoStarted = false;
    this.vastService = new VastService(this);
    this.config = {};
    this.ads = [];
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
    };
    this.config = { ...defaulConfig, ...config };
    this.isAdPlaying = false;
    this.NAMESPACE = "urn:x-cast:tech.gjirafa.vp-service";
    this.receiverControls = new ReceiverControls(".controls", this);
  }
  start() {
    this.receiverControls.resetOverlay();
    this.castDebugLogger.debug(this.debugTags.START, "Starting video...");
    this.broadcast(this.debugTags.START + "Starting video...");
    this.onPlay();
  }

  onPlay() {
    this.castDebugLogger.debug("on play", this.video.getAttribute("src"));
    this.broadcast("on play" + this.video.getAttribute("src"));
    this.castDebugLogger.debug("isadplaying", this.isAdPlaying);
    if (!this.isAdPlaying) {
      this.video
        .play()
        .then(() => {
          if (!this.videoStarted) {
            this.receiverControls.showControls();
            this.videoStarted = true;
          } else {
            this.receiverControls.play();
          }
        })
        .catch((e) => {
          this.onPause();
          this.castDebugLogger.debug(
            this.debugTags.ONPLAY,
            " Couldn't play video.Tring one more time " + e
          );
          this.broadcast(
            " Couldn't play video.Tring one more time " + e.toString()
          );
        });
    } else this.vastService.resume();
  }
  onPause() {
    if (!this.isAdPlaying) this.video.pause();
    else {
      this.vastService.pause();
    }
    this.receiverControls.pause();
    this.receiverControls.showControls();
  }
  addPlayerEvents() {
    this.video.addEventListener("timeupdate", this.onTimeUpdate);
    this.video.addEventListener("ended", this.onEnd.bind(this));
  }
  broadcast(message) {
    this.castDebugLogger.debug(this.debugTags.BROADCAST, message);
    if (this.context)
      this.context.sendCustomMessage(this.NAMESPACE, undefined, message);
  }
  onEnd() {
    this.castDebugLogger.debug("on End", this.config.replay);
    try {
      if (this.isAdPlaying) {
        this.broadcast({
          message: "Ad finished",
          code: 2,
          time: this.currentTime,
        });
        if (this.hls) {
          this.hls.destroy();
        }
        this.isAdPlaying = false;
      } else {
        this.broadcast({
          message: "Video finished",
          code: 3,
        });
      }
    } catch (error) {
      this.castDebugLogger.error(
        this.debugTags.ONEND,
        " Error" + error.toString()
      );
    }
    return null;
  }
  onTimeUpdate() {
    if (this.isAdPlaying) return;
    try {
      if (
        this.ads.adCuePoints.includes(Math.floor(this.video.currentTime)) &&
        !this.isAdPlaying
      ) {
        this.onPause();
        this.currentTime = Math.floor(this.video.currentTime);
        this.isAdPlaying = true;
        this.vastService.loadAds(this.ads.vasts[0][0], this.ads.vasts[0][1]);
        if (this.hls) {
          this.hls.destroy();
        }
        this.ads.vasts.pop();
        this.ads.adCuePoints.pop();
        // this.hls.destroy();
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
      duration: this.videoObject.duration || this.video.duration,
    };
  }
  attachMedia() {
    vpReceiver.HLSsupported = Hls.isSupported();
    this.castDebugLogger.debug("inside attach media", vpReceiver.HLSsupported);

    this.video.playbackRate = 1;
    this.castDebugLogger.debug(
      "video file",
      JSON.stringify(this.video, ["id", "className", "tagName"])
    );
    this.broadcast({
      message:
        "video file" +
        JSON.stringify(this.video, ["id", "className", "tagName"]),
    });
    if (this.videoObject.file.endsWith("mp4")) {
      this.castDebugLogger.debug("inside mp4", this.videoObject.file);
      this.video.src = this.videoObject.file;
      this.start();
    } else if (vpReceiver.HLSsupported) {
      this.castDebugLogger.debug("inside hlssupported", this.videoObject.file);
      try {
        this.hls = new Hls(hlsconfig);
        this.castDebugLogger.debug("hls initialized", this.videoObject.file);
        this.broadcast({
          message: "hls initialized " + this.videoObject.file,
        });
        console.log("attachMedia " + this.currentTime);

        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          this.castDebugLogger.debug("amedia attached", this.videoObject.file);
          this.castDebugLogger.debug(
            "loading source hlssupported",
            this.videoObject.file
          );
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
        });
        this.hls.attachMedia(this.video);
      } catch (error) {}
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
              self.attachMedia();
            }, 700);
          }
        }
        console.log(type, message);
      },
      error: function (type, message) {
        console.log(type, message);
      },
    };
    this.receiverControls.setCastDebugger(this.castDebugLogger);
    this.videoObject.file =
      "https://vp.gjirafa.net/vps/prod/odgehtyo/encode/vjsmyjhs/hls/master_file.m3u8";
    this.videoObject.duration = 119;
    this.receiverControls.seekbar.animateSeekbar();
    this.receiverControls.initOverlay({
      title: "Some title",
      images: [
        {
          url: "https://liki.gjirafa.com/api/media/gjvideo/yqz0gq/retina.jpg",
        },
      ],
    });
    this.ads = {
      adCuePoints: [10],
      vasts: [
        ["https://vp-dev.gjirafa.net/vps/content/vast/preroll-2.xml", null],
      ],
    };

    setTimeout(() => {
      this.attachMedia();
    }, 5000);

    this.bindMethods();
    this.addPlayerEvents();
  }
  init() {
    this.context = cast.framework.CastReceiverContext.getInstance();

    this.context.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);

    this.castDebugLogger = cast.debug.CastDebugLogger.getInstance();
    this.castDebugLogger.setEnabled(true);
    this.castDebugLogger.debug(this.debugTags.INIT, "castdebugger initialized");
    this.playerManager = this.context.getPlayerManager();
    this.playerManager.setMediaElement(this.video);

    this.receiverControls.setCastDebugger(this.castDebugLogger);
    const options = new cast.framework.CastReceiverOptions();
    // Map of namespace names to their types.
    options.customNamespaces = {};
    options.customNamespaces[this.NAMESPACE] =
      cast.framework.system.MessageType.JSON;
    this.context.start(options);
    this.bindMethods();
    this.bindInterceptors();
    this.addPlayerEvents();
  }
  onSeek(requestData) {
    this.video.currentTime = requestData.currentTime;
    this.receiverControls.showControls();
    this.receiverControls.hideControls(6000);

    this.receiverControls.update(this.updatePlayerState());
  }
  drawButtons() {
    this.controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_SECONDARY_1,
      cast.framework.ui.ControlsButton.QUEUE_PREV
    );
    this.controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_PRIMARY_1,
      cast.framework.ui.ControlsButton.CAPTIONS
    );
    this.controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_PRIMARY_2,
      cast.framework.ui.ControlsButton.SEEK_FORWARD_15
    );
    this.controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_SECONDARY_2,
      cast.framework.ui.ControlsButton.QUEUE_NEXT
    );
  }

  bindInterceptors() {
    this.context.addEventListener(
      cast.framework.system.EventType.SENDER_DISCONNECTED,
      (event) => {
        window.close();
      }
    );
    this.context.addCustomMessageListener(this.NAMESPACE, (event) => {
      this.castDebugLogger.debug(
        this.debugTags.EVENTS,
        "addCustomMessageListener" + event.data
      );
      let message = JSON.parse(event.data);
      if (message.code == 2) {
        this.attachMedia();
      }
    });
    this.playerManager.setMessageInterceptor(
      cast.framework.messages.MessageType.LOAD,
      this.onLoadRequest.bind(this)
    );
    this.playerManager.setMessageInterceptor(
      cast.framework.messages.MessageType.PLAY,
      this.onPlay.bind(this)
    );
    this.playerManager.setMessageInterceptor(
      cast.framework.messages.MessageType.PAUSE,
      this.onPause.bind(this)
    );
    this.playerManager.setMessageInterceptor(
      cast.framework.messages.MessageType.SEEK,
      this.onSeek.bind(this)
    );
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
  }
  onLoadRequest(loadRequestData) {
    if (this.hls) this.hls.destroy();
    this.receiverControls.initOverlay(loadRequestData.media.metadata);
    this.castDebugLogger.debug("VPreceiver", loadRequestData.media.contentId);
    this.castDebugLogger.debug("VPreceiver1", Hls.isSupported());
    this.videoObject.file = loadRequestData.media.contentId;
    this.videoObject.duration = loadRequestData.media.metadata.duration;
    this.currentTime = loadRequestData.currentTime;
    this.playbackRate = loadRequestData.playbackRate;
    this.autoplay = loadRequestData.autoplay;
    if (loadRequestData.requireAds)
      this.ads = {
        adCuePoints: [10],
        vasts: [
          [
            loadRequestData.customData.vastUrl,
            loadRequestData.customData.vastXml,
          ],
        ],
      };
    // try {
    this.config.replay =
      typeof loadRequestData.replay !== "undefined"
        ? loadRequestData.replay
        : true;
    try {
      this.attachMedia();
      this.broadcast({
        message: "attaching media",
      });
    } catch (error) {
      this.broadcast({
        message: error.toString(),
        stack: error.stack,
      });
    }
    return null;
  }
  addBreaks(mediaInformation) {
    castDebugLogger.debug(
      LOG_RECEIVER_TAG,
      "addBreaks: " + JSON.stringify(mediaInformation)
    );
    return fetchMediaById("fbb_ad").then((clip1) => {
      mediaInformation.breakClips = [
        {
          id: "fbb_ad",
          title: clip1.title,
          contentUrl: clip1.stream.dash,
          contentType: "application/dash+xml",
          whenSkippable: 5,
        },
      ];

      mediaInformation.breaks = [
        {
          id: "pre-roll",
          breakClipIds: ["fbb_ad"],
          position: 0,
        },
      ];
    });
  }
  fetchMediaById(id) {
    castDebugLogger.debug(LOG_RECEIVER_TAG, "fetching id: " + id);

    return new Promise((accept, reject) => {
      fetch(CONTENT_URL)
        .then((response) => response.json())
        .then((obj) => {
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

export default Receiver;
