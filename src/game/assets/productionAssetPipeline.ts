import Phaser from 'phaser';

export const PRODUCTION_ASSET_INDEX_KEY = 'productionAssetIndex';

export type ProductionAssetEntry = {
  key: string;
  type: 'image' | 'spritesheet';
  url: string;
  enabled: boolean;
  notes?: string;
  frameConfig?: {
    frameWidth: number;
    frameHeight: number;
    startFrame?: number;
    endFrame?: number;
    margin?: number;
    spacing?: number;
  };
};

export type ProductionAssetIndex = {
  version: string;
  description: string;
  textures: ProductionAssetEntry[];
};

export const queueEnabledProductionAssets = (scene: Phaser.Scene): void => {
  const index = scene.cache.json.get(PRODUCTION_ASSET_INDEX_KEY) as ProductionAssetIndex | undefined;
  if (!index) {
    return;
  }

  index.textures.forEach((asset) => {
    if (!asset.enabled) {
      return;
    }

    if (asset.type === 'image') {
      scene.load.image(asset.key, asset.url);
      return;
    }

    if (asset.type === 'spritesheet' && asset.frameConfig) {
      scene.load.spritesheet(asset.key, asset.url, asset.frameConfig);
    }
  });
};

export const hasTexture = (scene: Phaser.Scene, key: string): boolean => scene.textures.exists(key);
