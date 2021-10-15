import AdUI from "./adUI";
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
    google.ima.settings.setVpaidMode(
      google.ima.ImaSdkSettings.VpaidMode.ENABLED
    );

    this.adsDisplayContainer = new google.ima.AdDisplayContainer(
      this.adContainer,
      this.receiver.video
    );
    this.adsLoader = new google.ima.AdsLoader(this.adsDisplayContainer);
    this.adsLoader.getSettings().setPlayerType("cast/client-side");
    this.adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      this.onAdsManagerLoaded.bind(this),
      false
    );

    this.adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      this.onAdError,
      false
    );
    this.adUI = new AdUI(this.receiver);
  }

  onAllAdsCompleted(e) {
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "ad completed"
    );
  }
  onAdCompleted(e) {
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "ad completed"
    );
    this.adUI.disable();
    if (this.adsManager) this.adsManager.destroy();
    if (!this.hasErrors && this.receiver.isAdPlaying) this.receiver.onEnd();
    // this.adsManager.destroy();
    // this.receiver.playerManager.s`etMediaElement(this.video);
  }
  onContentPauseRequested(e) {
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "Content Pause Request"
    );
  }
  onContentResumeRequested() {
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "Content Resume Request"
    );
  }
  onAdLoaded(e) {
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "Ad loaded"
    );
  }
  loadAds(vastUrl, vastXml) {
    this.currentAds = {};
    if (!this.initialized) {
      this.init();
    }
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "load " + vastUrl
    );

    if (vastUrl) {
      this.currentAds.content = vastUrl;
      this.currentAds.type = "url";
    } else if (vastXml) {
      this.currentAds.content = vastXml;
      this.currentAds.type = "xml";
    }
    this.currentAds.currentAdIndex = 0;
    this.receiver.castDebugLogger.debug(VastService.DEBUG_VAST_SERVICE);
    if (this.currentAds.type === "url") this.load(this.currentAds.content);
    else this.load(null, this.currentAds.content);
  }
  load(vastUrl, vastXml) {
    if (!this.initialized) this.init();
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "Initialized" + this.vastUrl
    );

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
    this.adsRequest.nonLinearAdSlotHeight =
      this.receiver.video.clientHeight / 3;

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
      duration: adData.duration,
      // ad: adIndexInfo,
    });
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " ON TIME UPDATE"
    );
  }
  onAdSkip(e) {
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "ON AD Ski"
    );
  }
  onAdStarted(e) {
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "ON AD STARTED"
    );
    this.receiver.isAdPlaying = true;
    this.adUI.enable();
  }
  onAdsManagerLoaded(adsManagerLoadedEvent) {
    if (this.adsManager) {
      this.adsManager.destroy();
    }
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " before getadsmanager"
    );
    const adsRenderingSettings = new google.ima.AdsRenderingSettings();
    this.adsManager = adsManagerLoadedEvent.getAdsManager(
      this.receiver.video,
      adsRenderingSettings
    );
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " after getadsmanager"
    );
    this.adsManager.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      this.onAdError.bind(this)
    );
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " after onaderror"
    );
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      this.onContentPauseRequested.bind(this)
    );
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " after onContentPauseRequested"
    );
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      this.onContentResumeRequested.bind(this)
    );
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " after onAllAdsCompleted"
    );
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      this.onAllAdsCompleted.bind(this)
    );
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " after onAdLoaded"
    );
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.LOADED,
      this.onAdLoaded.bind(this)
    );
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " after onAdStarted"
    );
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.STARTED,
      this.onAdStarted.bind(this)
    );
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " after onAdCompleted"
    );
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.COMPLETE,
      this.onAdCompleted.bind(this)
    );
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " after onContentPauseRequested"
    );
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.SKIPPED,
      this.onAdSkip.bind(this)
    );
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " after onAdSkip"
    );
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.AD_PROGRESS,
      this.onTimeUpdate.bind(this)
    );
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " after onTimeUpdate"
    );
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.AD_BUFFERING,
      () => {
        this.loading = true;
      }
    );
    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED,
      () => {
        Utils.fire(this.adContainer, Events.adEvents.AD_SKIPPABLE, {
          currentTime: this.player.video.currentTime,
          adPlayId: this.adsManager.getCurrentAd()?.getAdId(),
        });
      }
    );
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " just before playing ad"
    );
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
      this.receiver.castDebugLogger.debug(
        this.VastService.DEBUG_VAST_SERVICE,
        "AdsManager could not be started" + adError.getMessage()
      );
    }
  }
  onAdError(e) {
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " ad error" + e
    );
    this.hasErrors = true;
    this.receiver.onEnd().bind(this.receiver);
  }
  resume() {
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "RESUMING AD Event"
    );
    if (!this.adsManager) return;
    this.adsManager.resume();
  }
  pause() {
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "PAUSE AD Event"
    );
    if (!this.adsManager) return;
    this.adsManager.pause();
  }
}

export default VastService;
