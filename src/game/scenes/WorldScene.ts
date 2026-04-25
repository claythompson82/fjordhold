import Phaser from 'phaser';

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;
const PLAYER_SPEED = 220;
const HARVEST_RANGE = 105;

type ResourceKind = 'tree' | 'rock' | 'ore';
type InventoryItem = 'wood' | 'stone' | 'ironOre' | 'resin';

type ResourceVisual = {
  x: number;
  y: number;
  kind: ResourceKind;
};

type ResourceNode = ResourceVisual & {
  id: string;
  health: number;
  maxHealth: number;
  item: InventoryItem;
  label: string;
  container: Phaser.GameObjects.Container;
};

type InventoryCounts = Record<InventoryItem, number>;

type InputKeys = {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
  E: Phaser.Input.Keyboard.Key;
};

const RESOURCE_DEFINITIONS: Record<ResourceKind, { health: number; item: InventoryItem; label: string }> = {
  tree: { health: 3, item: 'wood', label: 'Pine Tree' },
  rock: { health: 3, item: 'stone', label: 'Stone Boulder' },
  ore: { health: 4, item: 'ironOre', label: 'Iron Ore' }
};

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: InputKeys;
  private resourceNodes: ResourceNode[] = [];
  private inventory: InventoryCounts = {
    wood: 0,
    stone: 0,
    ironOre: 0,
    resin: 0
  };
  private interactionHint!: Phaser.GameObjects.Text;

  constructor() {
    super('WorldScene');
  }

  create(): void {
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.createFrostpineWorld();
    this.player = this.createPlayer(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    this.interactionHint = this.createInteractionHint();

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.15);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('W,A,S,D,E') as InputKeys;

    this.input.on('pointerdown', () => this.harvestNearestResource());
    this.emitInventoryChanged();
  }

  update(_: number, delta: number): void {
    this.updatePlayerMovement(delta);

    if (Phaser.Input.Keyboard.JustDown(this.keys.E)) {
      this.harvestNearestResource();
    }

    this.updateInteractionHint();
  }

  private createFrostpineWorld(): void {
    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x172733);

    for (let y = 0; y < WORLD_HEIGHT; y += 64) {
      for (let x = 0; x < WORLD_WIDTH; x += 64) {
        const noise = Phaser.Math.Between(-8, 8);
        const color = Phaser.Display.Color.GetColor(22 + noise, 42 + noise, 50 + noise);
        this.add.rectangle(x + 32, y + 32, 62, 62, color, 0.95);
      }
    }

    this.add.ellipse(520, 400, 520, 240, 0x2f4858, 0.5);
    this.add.ellipse(1650, 1180, 700, 280, 0x2a4050, 0.45);
    this.add.ellipse(1980, 420, 360, 180, 0x243a49, 0.5);

    const resources: ResourceVisual[] = [
      { x: 360, y: 340, kind: 'tree' },
      { x: 460, y: 420, kind: 'tree' },
      { x: 620, y: 300, kind: 'tree' },
      { x: 760, y: 500, kind: 'tree' },
      { x: 1810, y: 360, kind: 'tree' },
      { x: 1940, y: 520, kind: 'tree' },
      { x: 1720, y: 650, kind: 'tree' },
      { x: 1340, y: 1120, kind: 'rock' },
      { x: 1460, y: 1180, kind: 'rock' },
      { x: 1550, y: 1050, kind: 'ore' },
      { x: 960, y: 860, kind: 'rock' },
      { x: 830, y: 960, kind: 'tree' },
      { x: 680, y: 1070, kind: 'tree' },
      { x: 1130, y: 380, kind: 'ore' }
    ];

    resources.forEach((resource, index) => this.createResource(resource, index));
    this.createHearthSite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2 + 140);

    this.add.text(WORLD_WIDTH / 2, WORLD_HEIGHT / 2 - 210, 'Frostpine Fjord', {
      fontFamily: 'serif',
      fontSize: '34px',
      color: '#f4d18a',
      stroke: '#071018',
      strokeThickness: 7
    }).setOrigin(0.5).setDepth(30);
  }

  private createResource(resource: ResourceVisual, index: number): void {
    const container = this.add.container(resource.x, resource.y).setDepth(resource.y);
    const definition = RESOURCE_DEFINITIONS[resource.kind];

    if (resource.kind === 'tree') {
      container.add(this.add.ellipse(0, 26, 52, 20, 0x071018, 0.26));
      container.add(this.add.triangle(0, -24, 0, 58, 34, 0, 68, 58, 0x203f35));
      container.add(this.add.triangle(0, 4, 0, 64, 40, 0, 80, 64, 0x2b5b49));
      container.add(this.add.rectangle(0, 40, 13, 36, 0x6d4528));
    } else {
      const baseColor = resource.kind === 'ore' ? 0x526978 : 0x6e7d83;
      container.add(this.add.ellipse(0, 18, 60, 20, 0x071018, 0.22));
      container.add(this.add.polygon(0, 0, [
        -32, 16,
        -18, -16,
        8, -28,
        34, -6,
        26, 22,
        -10, 30
      ], baseColor));

      if (resource.kind === 'ore') {
        container.add(this.add.circle(8, -6, 6, 0x8bd3ff, 0.8));
        container.add(this.add.circle(-12, 10, 4, 0x8bd3ff, 0.65));
      }
    }

    this.resourceNodes.push({
      ...resource,
      id: `${resource.kind}_${index}`,
      health: definition.health,
      maxHealth: definition.health,
      item: definition.item,
      label: definition.label,
      container
    });
  }

  private createHearthSite(x: number, y: number): void {
    this.add.rectangle(x, y, 390, 250, 0x2b211b, 0.35);
    this.add.rectangle(x, y, 330, 190, 0x6a4329, 0.4).setStrokeStyle(3, 0x241711, 0.8);
    this.add.rectangle(x, y + 78, 90, 32, 0x7a5134, 0.9);
    this.add.rectangle(x, y - 18, 120, 76, 0x8a5937, 0.9).setStrokeStyle(3, 0x2d1c13);
    this.add.circle(x, y - 8, 32, 0xff9f3d, 0.18);
    this.add.circle(x, y - 8, 16, 0xffb454, 0.85);
    this.add.triangle(x, y - 20, 0, 34, 14, 0, 28, 34, 0xffdd7a, 0.9);
    this.add.text(x, y + 132, 'future hearth site / building test zone', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#b7c8d6'
    }).setOrigin(0.5);
  }

  private createPlayer(x: number, y: number): Phaser.GameObjects.Container {
    const bodyShadow = this.add.ellipse(0, 20, 42, 18, 0x02070a, 0.35);
    const cloak = this.add.circle(0, 6, 23, 0x33485a, 1);
    const tunic = this.add.rectangle(0, 10, 28, 36, 0x7a5134, 1).setStrokeStyle(2, 0x241711);
    const head = this.add.circle(0, -18, 15, 0xd7a170, 1).setStrokeStyle(2, 0x241711);
    const helm = this.add.arc(0, -21, 16, 180, 360, false, 0xaeb7bd, 1).setStrokeStyle(2, 0x323c45);
    const axeHandle = this.add.rectangle(26, 4, 5, 42, 0x6d4528, 1).setRotation(-0.45);
    const axeHead = this.add.triangle(35, -12, 0, 12, 22, 0, 20, 24, 0xc5d3d8, 1).setRotation(-0.45);

    const container = this.add.container(x, y, [bodyShadow, cloak, tunic, head, helm, axeHandle, axeHead]);
    container.setDepth(20);
    return container;
  }

  private createInteractionHint(): Phaser.GameObjects.Text {
    return this.add.text(0, 0, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#f4d18a',
      backgroundColor: '#111820cc',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(100).setVisible(false);
  }

  private updatePlayerMovement(delta: number): void {
    const direction = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.left?.isDown || this.keys.A.isDown) direction.x -= 1;
    if (this.cursors.right?.isDown || this.keys.D.isDown) direction.x += 1;
    if (this.cursors.up?.isDown || this.keys.W.isDown) direction.y -= 1;
    if (this.cursors.down?.isDown || this.keys.S.isDown) direction.y += 1;

    if (direction.lengthSq() > 0) {
      direction.normalize();
      const distance = PLAYER_SPEED * (delta / 1000);
      this.player.x = Phaser.Math.Clamp(this.player.x + direction.x * distance, 40, WORLD_WIDTH - 40);
      this.player.y = Phaser.Math.Clamp(this.player.y + direction.y * distance, 40, WORLD_HEIGHT - 40);

      if (direction.x !== 0) {
        this.player.setScale(direction.x < 0 ? -1 : 1, 1);
      }
    }
  }

  private harvestNearestResource(): void {
    const node = this.findNearestResource();

    if (!node) {
      this.showFloatingText(this.player.x, this.player.y - 54, 'Nothing nearby', '#b7c8d6');
      return;
    }

    node.health -= 1;
    const amount = node.kind === 'ore' ? 1 : Phaser.Math.Between(1, 2);
    this.inventory[node.item] += amount;

    if (node.kind === 'tree' && Phaser.Math.Between(1, 5) === 1) {
      this.inventory.resin += 1;
      this.showFloatingText(node.x + 16, node.y - 62, '+1 resin', '#ffd37d');
    }

    this.emitInventoryChanged();
    this.showHarvestFeedback(node, amount);

    if (node.health <= 0) {
      this.destroyResource(node);
    }
  }

  private findNearestResource(): ResourceNode | undefined {
    let nearest: ResourceNode | undefined;
    let nearestDistance = HARVEST_RANGE;

    for (const node of this.resourceNodes) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, node.x, node.y);
      if (distance < nearestDistance) {
        nearest = node;
        nearestDistance = distance;
      }
    }

    return nearest;
  }

  private showHarvestFeedback(node: ResourceNode, amount: number): void {
    const label = this.getInventoryLabel(node.item);
    const color = node.kind === 'tree' ? '#d6b16a' : node.kind === 'ore' ? '#8bd3ff' : '#c9d4d8';

    this.showFloatingText(node.x, node.y - 52, `+${amount} ${label}`, color);
    this.cameras.main.shake(65, 0.0015);

    this.tweens.add({
      targets: node.container,
      scaleX: 1.12,
      scaleY: 0.9,
      angle: Phaser.Math.Between(-3, 3),
      duration: 60,
      yoyo: true,
      ease: 'Quad.easeOut',
      onComplete: () => {
        node.container.setScale(1);
        node.container.setAngle(0);
      }
    });

    for (let i = 0; i < 5; i += 1) {
      const chip = this.add.circle(node.x, node.y, Phaser.Math.Between(2, 4), node.kind === 'tree' ? 0x9a653c : 0xb7c8d6, 0.9)
        .setDepth(90);
      this.tweens.add({
        targets: chip,
        x: node.x + Phaser.Math.Between(-34, 34),
        y: node.y + Phaser.Math.Between(-46, -8),
        alpha: 0,
        scale: 0.25,
        duration: 420,
        ease: 'Quad.easeOut',
        onComplete: () => chip.destroy()
      });
    }
  }

  private destroyResource(node: ResourceNode): void {
    this.resourceNodes = this.resourceNodes.filter((candidate) => candidate.id !== node.id);
    this.showFloatingText(node.x, node.y - 82, `${node.label} depleted`, '#ef8f5f');

    this.tweens.add({
      targets: node.container,
      alpha: 0,
      scaleX: 0.4,
      scaleY: 0.4,
      y: node.y + 18,
      duration: 260,
      ease: 'Back.easeIn',
      onComplete: () => node.container.destroy()
    });
  }

  private updateInteractionHint(): void {
    const node = this.findNearestResource();

    if (!node) {
      this.interactionHint.setVisible(false);
      return;
    }

    this.interactionHint
      .setText(`E / click: harvest ${node.label} (${node.health}/${node.maxHealth})`)
      .setPosition(this.player.x, this.player.y - 78)
      .setVisible(true);
  }

  private emitInventoryChanged(): void {
    this.game.events.emit('inventory:changed', { ...this.inventory });
  }

  private showFloatingText(x: number, y: number, message: string, color: string): void {
    const text = this.add.text(x, y, message, {
      fontFamily: 'monospace',
      fontSize: '13px',
      color,
      stroke: '#071018',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(120);

    this.tweens.add({
      targets: text,
      y: y - 34,
      alpha: 0,
      duration: 760,
      ease: 'Quad.easeOut',
      onComplete: () => text.destroy()
    });
  }

  private getInventoryLabel(item: InventoryItem): string {
    switch (item) {
      case 'ironOre':
        return 'iron ore';
      default:
        return item;
    }
  }
}
