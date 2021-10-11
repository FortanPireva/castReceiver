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
    if (this.currentAds.type === "url")
      this.load(this.currentAds.content).bind(this);
    else this.load(null, this.currentAds.content).bind(this);
  }
  onDoubleClick(event) {}
  load(vastUrl, vastXml) {
    if (!this.initialized) this.init();
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      "Initialized" + this.vastUrl
    );

    // this.skipOffset = this.player.videoObject.ad.skipTime;
    this.adContainer.addEventListener(
      "dblclick",
      this.onDoubleClick.bind(this)
    );
    this.adsRequest = new google.ima.AdsRequest();
    this.receiver.castDebugLogger.debug("okej e qity pra", "pse" + vastUrl);

    if (vastUrl) {
      this.adsRequest.adTagUrl = vastUrl;
    } else if (vastXml) {
      this.adsRequest.adsResponse = vastXml;
    } else {
      return;
    }
    this.receiver.castDebugLogger.debug("okej e qity pra", "Asdfxx");

    this.adsRequest.linearAdSlotWidth = this.receiver.video.clientWidth;
    this.adsRequest.linearAdSlotHeight = this.receiver.video.clientHeight;
    this.adsRequest.nonLinearAdSlotWidth = this.receiver.video.clientWidth;
    this.adsRequest.nonLinearAdSlotHeight =
      this.receiver.video.clientHeight / 3;

    this.adsRequest.setAdWillAutoPlay(this.autoplayAllowed);
    this.adsRequest.setAdWillPlayMuted(this.autoplayRequiresMuted);
    this.receiver.castDebugLogger.debug("okej e qity pra", "Asdf");

    this.adsRequest.vastLoadTimeout = 8000;
    this.adsLoader.requestAds(this.adsRequest);
  }

  onAdsManagerLoaded(adsManagerLoadedEvent) {
    if (this.adsManager) {
      this.adsManager.destroy();
    }
    const adsRenderingSettings = new google.ima.AdsRenderingSettings();
    this.adsManager = adsManagerLoadedEvent.getAdsManager(
      this.receiver.video,
      adsRenderingSettings
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
      this.adsManager.init(width, height, google.ima.ViewMode.FULLSCREEN);
      this.adsManager.start();
      this.receiver.receiverControls.loader.style.display = "none";
    } catch (adError) {
      console.log("AdsManager could not be started", adError);
    }
  }
  onAdError(e) {
    this.receiver.castDebugLogger.debug(
      VastService.DEBUG_VAST_SERVICE,
      " ad error" + e
    );
  }
}

export default VastService;
