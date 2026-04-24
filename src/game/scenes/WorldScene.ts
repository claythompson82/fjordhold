import Phaser from 'phaser';

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;
const PLAYER_SPEED = 220;

type ResourceVisual = {
  x: number;
  y: number;
  kind: 'tree' | 'rock' | 'ore';
};

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>;

  constructor() {
    super('WorldScene');
  }

  create(): void {
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.createFrostpineWorld();
    this.player = this.createPlayer(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.15);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as Record<'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>;
  }

  update(_: number, delta: number): void {
    this.updatePlayerMovement(delta);
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

    resources.forEach((resource) => this.createResource(resource));
    this.createHearthSite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2 + 140);

    this.add.text(WORLD_WIDTH / 2, WORLD_HEIGHT / 2 - 210, 'Frostpine Fjord', {
      fontFamily: 'serif',
      fontSize: '34px',
      color: '#f4d18a',
      stroke: '#071018',
      strokeThickness: 7
    }).setOrigin(0.5).setDepth(30);
  }

  private createResource(resource: ResourceVisual): void {
    if (resource.kind === 'tree') {
      this.add.ellipse(resource.x, resource.y + 26, 52, 20, 0x071018, 0.26);
      this.add.triangle(resource.x, resource.y - 24, 0, 58, 34, 0, 68, 58, 0x203f35);
      this.add.triangle(resource.x, resource.y + 4, 0, 64, 40, 0, 80, 64, 0x2b5b49);
      this.add.rectangle(resource.x, resource.y + 40, 13, 36, 0x6d4528);
      return;
    }

    const baseColor = resource.kind === 'ore' ? 0x526978 : 0x6e7d83;
    this.add.ellipse(resource.x, resource.y + 18, 60, 20, 0x071018, 0.22);
    this.add.polygon(resource.x, resource.y, [
      -32, 16,
      -18, -16,
      8, -28,
      34, -6,
      26, 22,
      -10, 30
    ], baseColor);

    if (resource.kind === 'ore') {
      this.add.circle(resource.x + 8, resource.y - 6, 6, 0x8bd3ff, 0.8);
      this.add.circle(resource.x - 12, resource.y + 10, 4, 0x8bd3ff, 0.65);
    }
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

  private updatePlayerMovement(delta: number): void {
    const direction = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.left?.isDown || this.keys.a.isDown) direction.x -= 1;
    if (this.cursors.right?.isDown || this.keys.d.isDown) direction.x += 1;
    if (this.cursors.up?.isDown || this.keys.w.isDown) direction.y -= 1;
    if (this.cursors.down?.isDown || this.keys.s.isDown) direction.y += 1;

    if (direction.lengthSq() > 0) {
      direction.normalize();
      const distance = PLAYER_SPEED * (delta / 1000);
      this.player.x = Phaser.Math.Clamp(this.player.x + direction.x * distance, 40, WORLD_WIDTH - 40);
      this.player.y = Phaser.Math.Clamp(this.player.y + direction.y * distance, 40, WORLD_HEIGHT - 40);
      this.player.setScale(direction.x < 0 ? -1 : 1, 1);
    }
  }
}
