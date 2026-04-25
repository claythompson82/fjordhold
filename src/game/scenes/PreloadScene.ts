import Phaser from 'phaser';
import { PRODUCTION_ASSET_INDEX_KEY, queueEnabledProductionAssets } from '../assets/productionAssetPipeline';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    const { width, height } = this.scale;

    this.load.json(PRODUCTION_ASSET_INDEX_KEY, 'assets/production/asset_pack_v1_index.json');
    this.load.once(`filecomplete-json-${PRODUCTION_ASSET_INDEX_KEY}`, () => {
      queueEnabledProductionAssets(this);
    });

    this.add.text(width / 2, height / 2 - 24, 'FJORDHOLD', {
      fontFamily: 'serif',
      fontSize: '42px',
      color: '#f4d18a',
      stroke: '#0b1118',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 24, 'lighting the hearth...', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#b7c8d6'
    }).setOrigin(0.5);
  }

  create(): void {
    this.scene.start('WorldScene');
    this.scene.launch('UIScene');
  }
}
