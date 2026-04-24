import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create(): void {
    this.createHud();
  }

  private createHud(): void {
    const panel = this.add.rectangle(22, 22, 360, 104, 0x111820, 0.82)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setStrokeStyle(2, 0x6e4a2f, 0.95);

    this.add.text(panel.x + 18, panel.y + 14, 'FJORDHOLD', {
      fontFamily: 'serif',
      fontSize: '22px',
      color: '#f4d18a',
      stroke: '#071018',
      strokeThickness: 4
    }).setScrollFactor(0);

    this.add.text(panel.x + 18, panel.y + 48, 'WASD / arrows: move  •  v0.1.0 scaffold', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#b7c8d6'
    }).setScrollFactor(0);

    this.add.text(panel.x + 18, panel.y + 70, 'Next: gathering, inventory, building mode', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#d6b16a'
    }).setScrollFactor(0);
  }
}
