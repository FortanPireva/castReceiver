class VastService {
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
    if (!window.google) {
      return;
    }
    google.ima.settings.setVpaidMode(
      google.ima.ImaSdkSettings.VpaidMode.ENABLED
    );

    this.adsDisplayContainer = new google.ima.adsDisplayContainer(
      this.adContainer,
      this.receiver.video
    );
    this.adsLoader = new google.ima.AdsLoader(this.adsDisplayContainer);

    this.adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      this.onAdsManagerLoaded,
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
    if (!window.google) return;
    if (!this.initialized) {
      this.init();
    }
    if (vastUrl) {
      this.currentAds.content = vastUrl;
      this.currentAds.type = "url";
    } else if (vastXml) {
      this.currentAds.content = vastXml;
      this.currentAds.type = "xml";
    }
    this.currentAds.currentAdIndex = 0;

    if (this.currentAds.type === "url")
      this.load(this.currentAds.array[this.currentAds.currentAdIndex]);
    else this.load(null, this.currentAds.array[this.currentAds.currentAdIndex]);
  }
  load(vastUrl, vastXml) {
    if (!window.google) {
      return;
    }

    if (!this.initialized) this.init();

    // this.skipOffset = this.player.videoObject.ad.skipTime;
    this.adContainer.addEventListener(
      "dblclick",
      this.onDoubleClick.bind(this)
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
    } catch (adError) {
      console.log("AdsManager could not be started", adError);
    }
  }
  onAdError() {}
}

export default VastService;
