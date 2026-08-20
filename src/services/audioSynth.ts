// Audio Synthesizer - Disabled (Silent Mode)

class AudioSynthesizer {
  private isEnabled: boolean = false;
  private volume: number = 0;

  public setEnabled(_enabled: boolean) {
    this.isEnabled = false;
  }

  public setVolume(_vol: number) {
    this.volume = 0;
  }

  public playHoloClick(_frequency = 1200, _type: OscillatorType = 'sine') {
    // Pure silent no-op
  }

  public playZoomTransition() {
    // Pure silent no-op
  }

  public playAlertChime() {
    // Pure silent no-op
  }

  public playGavelStrike() {
    // Pure silent no-op
  }

  public startAmbient() {
    // Pure silent no-op
  }

  public stopAmbient() {
    // Pure silent no-op
  }
}

export const audioSynth = new AudioSynthesizer();
