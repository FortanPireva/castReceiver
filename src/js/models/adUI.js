class AdUI {
  constructor(receiver) {
    this.receiver = receiver;
    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
  }
  enable() {
    console.log(this.receiver.config.adTimeSliderColor);
    this.receiver.receiverControls.seekbar.setColor(
      this.receiver.config.adTimeSliderColor
    );
  }
  disable() {
    this.receiver.receiverControls.seekbar.setColor(
      this.receiver.config.timeSliderColor
    );
  }
}

module.exports = AdUI;
