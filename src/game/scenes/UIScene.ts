import Phaser from 'phaser';

type InventoryCounts = {
  wood: number;
  stone: number;
  ironOre: number;
  resin: number;
};

type BuildPieceDefinition = {
  id: string;
  label: string;
  cost: Partial<InventoryCounts>;
  category: string;
  hotkey: string;
};

type BuildState = {
  buildMode: boolean;
  deleteMode: boolean;
  selectedPiece: BuildPieceDefinition;
  buildPieces: BuildPieceDefinition[];
};

export class UIScene extends Phaser.Scene {
  private hudContainer!: Phaser.GameObjects.Container;
  private inventoryText!: Phaser.GameObjects.Text;
  private modeText!: Phaser.GameObjects.Text;
  private buildText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;

  constructor() {
    super('UIScene');
  }

  create(): void {
    this.createHud();
    this.game.events.on('inventory:changed', this.updateInventory, this);
    this.game.events.on('build:changed', this.updateBuildState, this);
    this.game.events.on('hud:visibility-changed', this.updateHudVisibility, this);
    this.game.events.on('hud:feedback', this.showFeedback, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('inventory:changed', this.updateInventory, this);
      this.game.events.off('build:changed', this.updateBuildState, this);
      this.game.events.off('hud:visibility-changed', this.updateHudVisibility, this);
      this.game.events.off('hud:feedback', this.showFeedback, this);
    });
  }

  private createHud(): void {
    const panel = this.add.rectangle(22, 22, 620, 226, 0x111820, 0.84)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setStrokeStyle(2, 0x6e4a2f, 0.95);

    const titleText = this.add.text(panel.x + 18, panel.y + 14, 'FJORDHOLD', {
      fontFamily: 'serif',
      fontSize: '22px',
      color: '#f4d18a',
      stroke: '#071018',
      strokeThickness: 4
    }).setScrollFactor(0);

    const controlsText = this.add.text(panel.x + 18, panel.y + 48, 'WASD / arrows: move  •  E / click: harvest  •  B: build  •  X: delete mode', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#b7c8d6'
    }).setScrollFactor(0);

    this.modeText = this.add.text(panel.x + 18, panel.y + 70, 'Mode: Gather', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#d6b16a'
    }).setScrollFactor(0);

    this.inventoryText = this.add.text(panel.x + 18, panel.y + 101, 'Wood 0  Stone 0  Iron 0  Resin 0', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#f4d18a'
    }).setScrollFactor(0);

    this.buildText = this.add.text(panel.x + 18, panel.y + 130, 'Build: press B, then 1 Floor / 2 Wall / 3 Torch / 4 Spikes / 5 Roof / 6 Door', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#90aebf',
      wordWrap: { width: 572 }
    }).setScrollFactor(0);

    const utilityText = this.add.text(panel.x + 18, panel.y + 168, 'J: save  •  K: load  •  R: reset save (double-press)  •  H: hide HUD', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#8ba4b6'
    }).setScrollFactor(0);

    this.feedbackText = this.add.text(panel.x + 18, panel.y + 194, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#8bd3ff'
    }).setScrollFactor(0);

    this.hudContainer = this.add.container(0, 0, [
      panel,
      titleText,
      controlsText,
      this.modeText,
      this.inventoryText,
      this.buildText,
      utilityText,
      this.feedbackText
    ]);
  }

  private updateInventory(inventory: InventoryCounts): void {
    this.inventoryText.setText(
      `Wood ${inventory.wood}  Stone ${inventory.stone}  Iron ${inventory.ironOre}  Resin ${inventory.resin}`
    );
  }

  private updateBuildState(state: BuildState): void {
    if (state.buildMode) {
      this.modeText.setText(state.deleteMode ? 'Mode: Build — Delete / Refund' : `Mode: Build — ${state.selectedPiece.label}`);
      this.modeText.setColor(state.deleteMode ? '#ff9a7a' : '#42f59b');
    } else {
      this.modeText.setText('Mode: Gather');
      this.modeText.setColor('#d6b16a');
    }

    const pieces = state.buildPieces
      .map((piece) => `${piece.hotkey} ${piece.label} (${this.formatCost(piece.cost)})`)
      .join('  •  ');

    this.buildText.setText(
      state.buildMode
        ? (state.deleteMode ? 'Delete mode: click placed piece to remove and refund 70% of materials' : pieces)
        : 'Build: press B, then 1 Floor / 2 Wall / 3 Torch / 4 Spikes / 5 Roof / 6 Door'
    );
    this.buildText.setColor(state.buildMode ? '#f4d18a' : '#90aebf');
  }

  private formatCost(cost: Partial<InventoryCounts>): string {
    return Object.entries(cost)
      .map(([item, amount]) => `${this.formatItemName(item)} ${amount}`)
      .join(', ');
  }

  private formatItemName(item: string): string {
    if (item === 'ironOre') return 'iron';
    return item;
  }

  private updateHudVisibility(visible: boolean): void {
    this.hudContainer.setVisible(visible);
  }

  private showFeedback(payload: { message: string; color: string }): void {
    this.feedbackText.setText(payload.message);
    this.feedbackText.setColor(payload.color);

    this.tweens.killTweensOf(this.feedbackText);
    this.feedbackText.setAlpha(1);
    this.tweens.add({
      targets: this.feedbackText,
      alpha: 0.65,
      duration: 1600,
      ease: 'Quad.easeOut'
    });
  }
}
