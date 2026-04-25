import Phaser from 'phaser';

type InventoryCounts = {
  wood: number;
  stone: number;
  ironOre: number;
  resin: number;
};

export class UIScene extends Phaser.Scene {
  private inventoryText!: Phaser.GameObjects.Text;

  constructor() {
    super('UIScene');
  }

  create(): void {
    this.createHud();
    this.game.events.on('inventory:changed', this.updateInventory, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('inventory:changed', this.updateInventory, this);
    });
  }

  private createHud(): void {
    const panel = this.add.rectangle(22, 22, 404, 142, 0x111820, 0.84)
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

    this.add.text(panel.x + 18, panel.y + 48, 'WASD / arrows: move  •  E / click: harvest', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#b7c8d6'
    }).setScrollFactor(0);

    this.add.text(panel.x + 18, panel.y + 70, 'Next: inventory panel, building mode, crafting', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#d6b16a'
    }).setScrollFactor(0);

    this.inventoryText = this.add.text(panel.x + 18, panel.y + 101, 'Wood 0  Stone 0  Iron 0  Resin 0', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#f4d18a'
    }).setScrollFactor(0);
  }

  private updateInventory(inventory: InventoryCounts): void {
    this.inventoryText.setText(
      `Wood ${inventory.wood}  Stone ${inventory.stone}  Iron ${inventory.ironOre}  Resin ${inventory.resin}`
    );
  }
}
