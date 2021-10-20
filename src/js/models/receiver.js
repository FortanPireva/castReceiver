import defaulConfig from "../config/defaultConfig";
import hlsconfig from "../config/hlsConfig";
import ReceiverControls from "./receiver-controls";
import VastService from "./vastService";
import Environment from "../config/environment";
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
      INITSTATE: "INITSTATE",
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

  onPlay(data) {
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
          this.receiverControls.show = false;
          this.receiverControls.showHide(2000);
          return data;
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
  onPause(data) {
    if (!this.isAdPlaying) this.video.pause();
    else {
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
    this.castDebugLogger.debug(
      this.debugTags.BROADCAST,
      Environment.isDevelopment
    );
    if (!required && !Environment.isDevelopment) return;
    this.castDebugLogger.debug(this.debugTags.BROADCAST, message);
    if (this.context)
      this.context.sendCustomMessage(this.NAMESPACE, undefined, message);
  }
  onEnd() {
    this.castDebugLogger.debug("on End", this.config.replay);
    try {
      if (this.isAdPlaying) {
        this.broadcast(
          {
            message: "Ad finished",
            code: 2,
            time: this.currentTime,
          },
          true
        );
        if (this.hls) {
          this.hls.destroy();
        }
        this.isAdPlaying = false;
      } else {
        this.broadcast(
          {
            message: "Video finished",
            code: 3,
          },
          true
        );
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
        this.adBreaks
          .map((ad) => ad.breakTimingValue)
          .includes(Math.floor(this.video.currentTime)) &&
        !this.isAdPlaying
      ) {
        this.broadcast(this.adBreaks);
        this.onPause();
        this.currentTime = Math.floor(this.video.currentTime);
        this.isAdPlaying = true;
        this.vastService.loadAds(this.adBreaks[0].adTagUrl[0]);
        if (this.hls) {
          this.hls.destroy();
        }
        this.adBreaks.shift();
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
    (this.adBreaks = [
      {
        breakType: "midroll",
        adTagUrl: ["https://vp-dev.gjirafa.net/vps/content/vast/preroll-2.xml"],
        breakTimingType: "time",
        breakTimingValue: 15,
      },
      {
        breakType: "midroll",
        adTagUrl: ["https://vp-dev.gjirafa.net/vps/content/vast/preroll-2.xml"],
        breakTimingType: "time",
        breakTimingValue: 30,
      },
    ]),
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
    this.castDebugLogger.setEnabled(Environment.isDevelopment);
    this.castDebugLogger.debug(this.debugTags.INIT, "castdebugger initialized");
    this.playerManager = this.context.getPlayerManager();
    this.playerManager.setMediaElement(this.video);

    this.playerManager.setSupportedMediaCommands(
      cast.framework.messages.Command.SEEK |
        cast.framework.messages.Command.PAUSE |
        cast.framework.messages.Command.PLAY
    );

    // browse content area
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
    this.broadcast(requestData.toString());
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
    if (loadRequestData.requireAds)
      this.adBreaks = loadRequestData.customData.adBreaks;
    // try {
    this.config.replay =
      typeof loadRequestData.replay !== "undefined"
        ? loadRequestData.replay
        : true;
    try {
      this.attachMedia();
      this.receiverControls.update(this.updatePlayerState());
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
