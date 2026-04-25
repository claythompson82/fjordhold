import Phaser from 'phaser';
import { hasTexture } from '../assets/productionAssetPipeline';

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;
const PLAYER_SPEED = 220;
const HARVEST_RANGE = 105;
const BUILD_GRID_SIZE = 64;

type ResourceKind = 'tree' | 'rock' | 'ore';
type InventoryItem = 'wood' | 'stone' | 'ironOre' | 'resin';
type BuildPieceId = 'woodFloor' | 'woodWall' | 'standingTorch' | 'spikeWall' | 'thatchRoof' | 'woodDoor';

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
type ResourceCost = Partial<InventoryCounts>;

type BuildPieceDefinition = {
  id: BuildPieceId;
  label: string;
  cost: ResourceCost;
  category: 'floor' | 'wall' | 'light' | 'defense' | 'roof' | 'door';
  hotkey: '1' | '2' | '3' | '4' | '5' | '6';
};

type PlacedBuildPiece = {
  id: string;
  pieceId: BuildPieceId;
  gridX: number;
  gridY: number;
  container: Phaser.GameObjects.Container;
  flame?: Phaser.GameObjects.Triangle;
};

type InputKeys = {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
  E: Phaser.Input.Keyboard.Key;
  B: Phaser.Input.Keyboard.Key;
  ESC: Phaser.Input.Keyboard.Key;
  ONE: Phaser.Input.Keyboard.Key;
  TWO: Phaser.Input.Keyboard.Key;
  THREE: Phaser.Input.Keyboard.Key;
  FOUR: Phaser.Input.Keyboard.Key;
  FIVE: Phaser.Input.Keyboard.Key;
  SIX: Phaser.Input.Keyboard.Key;
  X: Phaser.Input.Keyboard.Key;
};

const RESOURCE_DEFINITIONS: Record<ResourceKind, { health: number; item: InventoryItem; label: string }> = {
  tree: { health: 3, item: 'wood', label: 'Pine Tree' },
  rock: { health: 3, item: 'stone', label: 'Stone Boulder' },
  ore: { health: 4, item: 'ironOre', label: 'Iron Ore' }
};

const BUILD_PIECES: Record<BuildPieceId, BuildPieceDefinition> = {
  woodFloor: {
    id: 'woodFloor',
    label: 'Wood Floor',
    cost: { wood: 1 },
    category: 'floor',
    hotkey: '1'
  },
  woodWall: {
    id: 'woodWall',
    label: 'Wood Wall',
    cost: { wood: 3 },
    category: 'wall',
    hotkey: '2'
  },
  standingTorch: {
    id: 'standingTorch',
    label: 'Standing Torch',
    cost: { wood: 1, resin: 1 },
    category: 'light',
    hotkey: '3'
  },
  spikeWall: {
    id: 'spikeWall',
    label: 'Spike Wall',
    cost: { wood: 4, stone: 1 },
    category: 'defense',
    hotkey: '4'
  },
  thatchRoof: {
    id: 'thatchRoof',
    label: 'Thatch Roof',
    cost: { wood: 4 },
    category: 'roof',
    hotkey: '5'
  },
  woodDoor: {
    id: 'woodDoor',
    label: 'Wood Door',
    cost: { wood: 2 },
    category: 'door',
    hotkey: '6'
  }
};

const RESOURCE_TEXTURE_KEYS: Record<ResourceKind, string> = {
  tree: 'resource_pine_tree',
  rock: 'resource_stone_boulder',
  ore: 'resource_iron_ore'
};

const BUILD_TEXTURE_KEYS: Record<BuildPieceId, string> = {
  woodFloor: 'build_wood_floor',
  woodWall: 'build_wood_wall',
  standingTorch: 'build_standing_torch',
  spikeWall: 'build_spike_wall',
  thatchRoof: 'build_thatch_roof',
  woodDoor: 'build_wood_door'
};

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: InputKeys;
  private resourceNodes: ResourceNode[] = [];
  private inventory: InventoryCounts = {
    wood: 8,
    stone: 4,
    ironOre: 0,
    resin: 2
  };
  private interactionHint!: Phaser.GameObjects.Text;
  private buildMode = false;
  private selectedBuildPiece: BuildPieceId = 'woodFloor';
  private deleteMode = false;
  private buildGhost!: Phaser.GameObjects.Container;
  private buildGhostLabel!: Phaser.GameObjects.Text;
  private buildGhostPulse?: Phaser.GameObjects.Arc;
  private placedPieces: PlacedBuildPiece[] = [];

  constructor() {
    super('WorldScene');
  }

  create(): void {
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.createFrostpineWorld();
    this.player = this.createPlayer(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    this.interactionHint = this.createInteractionHint();
    this.buildGhost = this.createBuildGhost();
    this.buildGhostLabel = this.createBuildGhostLabel();

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.15);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('W,A,S,D,E,B,X,ESC,ONE,TWO,THREE,FOUR,FIVE,SIX') as InputKeys;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.handlePointerDown(pointer));
    this.emitInventoryChanged();
    this.emitBuildChanged();
  }

  update(_: number, delta: number): void {
    this.updatePlayerMovement(delta);
    this.updateBuildInput();

    if (Phaser.Input.Keyboard.JustDown(this.keys.E) && !this.buildMode) {
      this.harvestNearestResource();
    }

    this.updateInteractionHint();
    this.updateBuildGhost();
    this.updateInteriorReveal();
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
    const textureKey = RESOURCE_TEXTURE_KEYS[resource.kind];

    if (hasTexture(this, textureKey)) {
      container.add(this.add.image(0, 0, textureKey).setDisplaySize(64, 64).setOrigin(0.5, 0.84));
    } else if (resource.kind === 'tree') {
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
    if (hasTexture(this, 'player_viking_base')) {
      const sprite = this.add.image(0, 0, 'player_viking_base').setDisplaySize(64, 64).setOrigin(0.5, 0.74);
      const container = this.add.container(x, y, [sprite]);
      container.setDepth(20);
      return container;
    }

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

  private createBuildGhost(): Phaser.GameObjects.Container {
    const ghost = this.add.container(0, 0).setDepth(200).setVisible(false);
    ghost.add(this.add.rectangle(0, 0, BUILD_GRID_SIZE, BUILD_GRID_SIZE, 0x42f59b, 0.18).setStrokeStyle(3, 0x42f59b, 0.9));
    return ghost;
  }

  private createBuildGhostLabel(): Phaser.GameObjects.Text {
    return this.add.text(0, 0, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#f4d18a',
      backgroundColor: '#111820dd',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(210).setVisible(false);
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

  private updateBuildInput(): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.B)) {
      this.buildMode = !this.buildMode;
      this.deleteMode = false;
      this.showFloatingText(this.player.x, this.player.y - 72, this.buildMode ? 'Build mode' : 'Gather mode', this.buildMode ? '#42f59b' : '#b7c8d6');
      this.emitBuildChanged();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.ESC) && this.buildMode) {
      this.buildMode = false;
      this.deleteMode = false;
      this.emitBuildChanged();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.X) && this.buildMode) {
      this.deleteMode = !this.deleteMode;
      this.showFloatingText(this.player.x, this.player.y - 72, this.deleteMode ? 'Delete mode' : 'Place mode', this.deleteMode ? '#ff7f60' : '#42f59b');
      this.emitBuildChanged();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.ONE)) this.selectBuildPiece('woodFloor');
    if (Phaser.Input.Keyboard.JustDown(this.keys.TWO)) this.selectBuildPiece('woodWall');
    if (Phaser.Input.Keyboard.JustDown(this.keys.THREE)) this.selectBuildPiece('standingTorch');
    if (Phaser.Input.Keyboard.JustDown(this.keys.FOUR)) this.selectBuildPiece('spikeWall');
    if (Phaser.Input.Keyboard.JustDown(this.keys.FIVE)) this.selectBuildPiece('thatchRoof');
    if (Phaser.Input.Keyboard.JustDown(this.keys.SIX)) this.selectBuildPiece('woodDoor');
  }

  private selectBuildPiece(pieceId: BuildPieceId): void {
    this.selectedBuildPiece = pieceId;
    this.deleteMode = false;
    this.emitBuildChanged();

    if (this.buildMode) {
      this.showFloatingText(this.player.x, this.player.y - 72, BUILD_PIECES[pieceId].label, '#f4d18a');
    }
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (pointer.rightButtonDown()) {
      if (this.buildMode) {
        this.buildMode = false;
        this.emitBuildChanged();
      }
      return;
    }

    if (this.buildMode) {
      if (this.deleteMode) {
        this.deleteBuildPieceAtPointer();
      } else {
        this.placeSelectedBuildPiece();
      }
      return;
    }

    this.harvestNearestResource();
  }

  private harvestNearestResource(): void {
    const node = this.findNearestResource();

    if (!node) {
      this.showFloatingText(this.player.x, this.player.y - 54, 'Nothing nearby', '#b7c8d6');
      return;
    }

    node.health -= 1;
    const amount = node.kind === 'ore' ? Phaser.Math.Between(1, 2) : Phaser.Math.Between(2, 3);
    this.inventory[node.item] += amount;

    if (node.kind === 'tree' && Phaser.Math.Between(1, 4) === 1) {
      this.inventory.resin += 1;
      this.showFloatingText(node.x + 16, node.y - 62, '+1 resin', '#ffd37d');
    }

    this.emitInventoryChanged();
    this.showHarvestFeedback(node, amount);

    if (node.health <= 0) {
      this.destroyResource(node);
    }
  }

  private placeSelectedBuildPiece(): void {
    const snapped = this.getSnappedPointerPosition();
    const piece = BUILD_PIECES[this.selectedBuildPiece];
    const validation = this.validateBuildPlacement(snapped.x, snapped.y, piece);

    if (!validation.valid) {
      this.showFloatingText(snapped.x, snapped.y - 46, validation.reason, '#ff7f60');
      this.cameras.main.shake(80, 0.001);
      return;
    }

    this.spendResources(piece.cost);
    const container = this.createBuildPieceVisual(piece.id, snapped.x, snapped.y, false);
    const placedPiece: PlacedBuildPiece = {
      id: `${piece.id}_${snapped.x}_${snapped.y}_${this.placedPieces.length}`,
      pieceId: piece.id,
      gridX: snapped.x,
      gridY: snapped.y,
      container
    };

    this.animateBuildPlacement(placedPiece);
    this.placedPieces.push(placedPiece);
    this.emitInventoryChanged();
    this.showFloatingText(snapped.x, snapped.y - 48, `${piece.label} placed`, '#42f59b');
    this.cameras.main.flash(85, 244, 209, 138, false);
  }

  private createBuildPieceVisual(pieceId: BuildPieceId, x: number, y: number, ghost: boolean): Phaser.GameObjects.Container {
    const alpha = ghost ? 0.45 : 1;
    const container = this.add.container(x, y).setDepth(this.getBuildPieceDepth(pieceId, y)).setAlpha(alpha);
    const textureKey = BUILD_TEXTURE_KEYS[pieceId];

    if (hasTexture(this, textureKey)) {
      container.add(this.add.image(0, 0, textureKey).setDisplaySize(64, 64));
      return container;
    }

    switch (pieceId) {
      case 'woodFloor':
        container.add(this.add.rectangle(0, 0, 60, 60, 0x7a5134, 0.95).setStrokeStyle(2, 0x2d1c13));
        container.add(this.add.line(0, 0, -24, -8, 24, -8, 0xa06b42, 0.8).setLineWidth(2));
        container.add(this.add.line(0, 0, -24, 10, 24, 10, 0xa06b42, 0.55).setLineWidth(2));
        break;
      case 'woodWall':
        container.add(this.add.ellipse(0, 20, 58, 18, 0x071018, 0.25));
        container.add(this.add.rectangle(0, 2, 58, 42, 0x6d4528, 1).setStrokeStyle(3, 0x23160e));
        container.add(this.add.rectangle(-16, 2, 6, 48, 0xa06b42, 1));
        container.add(this.add.rectangle(16, 2, 6, 48, 0xa06b42, 1));
        container.add(this.add.line(0, 0, -24, -8, 24, -8, 0x2d1c13, 1).setLineWidth(3));
        container.add(this.add.line(0, 0, -24, 10, 24, 10, 0x2d1c13, 0.9).setLineWidth(3));
        break;
      case 'standingTorch':
        container.add(this.add.ellipse(0, 20, 34, 12, 0x071018, 0.24));
        container.add(this.add.rectangle(0, 8, 8, 42, 0x6d4528, 1));
        container.add(this.add.circle(0, -16, 22, 0xff9f3d, 0.16));
        container.add(this.add.circle(0, -16, 9, 0xff9f3d, 0.95));
        container.add(this.add.triangle(0, -26, 0, 26, 11, 0, 22, 26, 0xffdd7a, 0.95).setName('torch_flame'));
        break;
      case 'spikeWall':
        container.add(this.add.ellipse(0, 22, 60, 16, 0x071018, 0.26));
        for (let i = -2; i <= 2; i += 1) {
          container.add(this.add.triangle(i * 13, 0, 0, 44, 10, 0, 20, 44, 0x8a5937, 1).setRotation(Phaser.Math.DegToRad(180)));
        }
        container.add(this.add.rectangle(0, 14, 62, 9, 0x4b2e1c, 1));
        break;
      case 'thatchRoof':
        container.add(this.add.ellipse(0, 24, 76, 18, 0x071018, 0.28));
        container.add(this.add.polygon(0, -4, [-42, 18, 0, -36, 42, 18, 28, 34, -28, 34], 0x8b5d32, 1).setStrokeStyle(3, 0x2d1c13));
        container.add(this.add.polygon(0, -4, [-30, 16, 0, -26, 30, 16, 18, 26, -18, 26], 0xb68648, 0.85));
        container.add(this.add.rectangle(0, -22, 56, 7, 0x5a3821, 1).setRotation(-0.72));
        container.add(this.add.rectangle(0, -22, 56, 7, 0x5a3821, 1).setRotation(0.72));
        container.add(this.add.line(0, 0, -32, 14, 32, 14, 0xd0a15a, 0.65).setLineWidth(2));
        container.add(this.add.line(0, 0, -24, 24, 24, 24, 0x5a3821, 0.7).setLineWidth(2));
        break;
      case 'woodDoor':
        container.add(this.add.ellipse(0, 20, 56, 16, 0x071018, 0.24));
        container.add(this.add.rectangle(0, 4, 34, 50, 0x71482d, 1).setStrokeStyle(3, 0x2b1a11));
        container.add(this.add.line(0, 0, -11, -10, -11, 19, 0x9b6a40, 0.9).setLineWidth(2));
        container.add(this.add.line(0, 0, 1, -10, 1, 19, 0x9b6a40, 0.85).setLineWidth(2));
        container.add(this.add.circle(10, 4, 3, 0xd7b37a, 1));
        break;
    }

    return container;
  }

  private getBuildPieceDepth(pieceId: BuildPieceId, y: number): number {
    if (pieceId === 'woodFloor') return 4;
    if (pieceId === 'thatchRoof') return y + 220;
    return y + 10;
  }

  private updateBuildGhost(): void {
    if (!this.buildMode) {
      this.buildGhost.setVisible(false);
      this.buildGhostLabel.setVisible(false);
      return;
    }

    const snapped = this.getSnappedPointerPosition();
    const piece = BUILD_PIECES[this.selectedBuildPiece];
    const validation = this.deleteMode
      ? this.validateDeletePlacement(snapped.x, snapped.y)
      : this.validateBuildPlacement(snapped.x, snapped.y, piece);
    const color = this.deleteMode ? 0xff7f60 : (validation.valid ? 0x42f59b : 0xff543f);

    this.buildGhost.destroy();
    this.buildGhost = this.add.container(snapped.x, snapped.y).setDepth(200);
    this.buildGhost.add(this.add.rectangle(0, 0, BUILD_GRID_SIZE, BUILD_GRID_SIZE, color, 0.16).setStrokeStyle(3, color, 0.9));
    if (this.deleteMode) {
      this.buildGhost.add(this.add.line(0, 0, -20, -20, 20, 20, 0xff7f60, 0.95).setLineWidth(5));
      this.buildGhost.add(this.add.line(0, 0, 20, -20, -20, 20, 0xff7f60, 0.95).setLineWidth(5));
    } else {
      this.buildGhost.add(this.createBuildPieceVisual(piece.id, 0, 0, true).setDepth(201));
    }
    this.buildGhostPulse?.destroy();
    this.buildGhostPulse = this.add.circle(0, 0, 28, color, validation.valid ? 0.16 : 0.12)
      .setStrokeStyle(2, color, 0.45)
      .setName('build_ghost_pulse');
    this.buildGhost.add(this.buildGhostPulse);
    this.buildGhost.setVisible(true);

    this.buildGhostLabel
      .setText(this.deleteMode
        ? `X: Delete mode • click placed piece to refund`
        : `${piece.hotkey}: ${piece.label} • ${this.formatCost(piece.cost)}`)
      .setPosition(snapped.x, snapped.y - 52)
      .setVisible(true);

    if (validation.valid) {
      const pulseScale = 1 + ((Math.sin(this.time.now * 0.012) + 1) * 0.18);
      this.buildGhostPulse.setScale(pulseScale);
      this.buildGhostPulse.setAlpha(0.14 + ((Math.sin(this.time.now * 0.012) + 1) * 0.04));
    } else {
      this.buildGhostPulse.setScale(1);
      this.buildGhostPulse.setAlpha(0.12);
    }
  }

  private updateInteriorReveal(): void {
    const roofs = this.placedPieces.filter((piece) => piece.pieceId === 'thatchRoof');
    const insideRoof = roofs.some((roof) => Phaser.Math.Distance.Between(this.player.x, this.player.y, roof.gridX, roof.gridY) < 78);

    roofs.forEach((roof) => {
      const targetAlpha = insideRoof ? 0.18 : 1;
      roof.container.setAlpha(Phaser.Math.Linear(roof.container.alpha, targetAlpha, 0.16));
    });

    this.placedPieces.forEach((piece) => {
      if (!piece.flame || piece.pieceId !== 'standingTorch') {
        return;
      }

      piece.flame.setScale(0.9 + Math.sin((this.time.now + piece.gridX) * 0.02) * 0.08, 1);
      piece.flame.setAlpha(0.84 + Math.sin((this.time.now + piece.gridY) * 0.016) * 0.12);
    });
  }

  private getSnappedPointerPosition(): { x: number; y: number } {
    const pointer = this.input.activePointer;
    const x = Math.floor(pointer.worldX / BUILD_GRID_SIZE) * BUILD_GRID_SIZE + BUILD_GRID_SIZE / 2;
    const y = Math.floor(pointer.worldY / BUILD_GRID_SIZE) * BUILD_GRID_SIZE + BUILD_GRID_SIZE / 2;

    return {
      x: Phaser.Math.Clamp(x, BUILD_GRID_SIZE / 2, WORLD_WIDTH - BUILD_GRID_SIZE / 2),
      y: Phaser.Math.Clamp(y, BUILD_GRID_SIZE / 2, WORLD_HEIGHT - BUILD_GRID_SIZE / 2)
    };
  }

  private validateBuildPlacement(x: number, y: number, piece: BuildPieceDefinition): { valid: boolean; reason: string } {
    if (!this.canAfford(piece.cost)) {
      return { valid: false, reason: 'Need resources' };
    }

    const occupied = this.placedPieces.some((placed) => placed.gridX === x && placed.gridY === y);
    if (occupied) {
      return { valid: false, reason: 'Occupied' };
    }

    const tooCloseToResource = this.resourceNodes.some((node) => Phaser.Math.Distance.Between(x, y, node.x, node.y) < 54);
    if (tooCloseToResource) {
      return { valid: false, reason: 'Blocked' };
    }

    return { valid: true, reason: 'OK' };
  }

  private validateDeletePlacement(x: number, y: number): { valid: boolean; reason: string } {
    const placedPiece = this.findPlacedPieceAt(x, y);
    if (!placedPiece) {
      return { valid: false, reason: 'Nothing to remove' };
    }

    return { valid: true, reason: 'Remove piece' };
  }

  private canAfford(cost: ResourceCost): boolean {
    return Object.entries(cost).every(([item, amount]) => this.inventory[item as InventoryItem] >= (amount ?? 0));
  }

  private spendResources(cost: ResourceCost): void {
    Object.entries(cost).forEach(([item, amount]) => {
      this.inventory[item as InventoryItem] -= amount ?? 0;
    });
  }

  private refundResources(cost: ResourceCost): void {
    Object.entries(cost).forEach(([item, amount]) => {
      const spendAmount = amount ?? 0;
      if (spendAmount <= 0) {
        return;
      }

      const refundAmount = Math.max(1, Math.floor(spendAmount * 0.7));
      this.inventory[item as InventoryItem] += refundAmount;
    });
  }

  private deleteBuildPieceAtPointer(): void {
    const snapped = this.getSnappedPointerPosition();
    const placedPiece = this.findPlacedPieceAt(snapped.x, snapped.y);

    if (!placedPiece) {
      this.showFloatingText(snapped.x, snapped.y - 46, 'Nothing to remove', '#ff7f60');
      this.cameras.main.shake(70, 0.001);
      return;
    }

    const pieceDefinition = BUILD_PIECES[placedPiece.pieceId];
    this.refundResources(pieceDefinition.cost);
    this.emitInventoryChanged();

    this.placedPieces = this.placedPieces.filter((piece) => piece.id !== placedPiece.id);
    this.showFloatingText(snapped.x, snapped.y - 46, `${pieceDefinition.label} removed (+refund)`, '#f4d18a');

    this.tweens.add({
      targets: placedPiece.container,
      alpha: 0,
      scaleX: 0.65,
      scaleY: 0.65,
      duration: 150,
      ease: 'Quad.easeIn',
      onComplete: () => placedPiece.container.destroy()
    });

    this.cameras.main.shake(60, 0.0011);
  }

  private findPlacedPieceAt(x: number, y: number): PlacedBuildPiece | undefined {
    return this.placedPieces.find((placed) => placed.gridX === x && placed.gridY === y);
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
    if (this.buildMode) {
      this.interactionHint.setVisible(false);
      return;
    }

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

  private emitBuildChanged(): void {
    this.game.events.emit('build:changed', {
      buildMode: this.buildMode,
      deleteMode: this.deleteMode,
      selectedPiece: BUILD_PIECES[this.selectedBuildPiece],
      buildPieces: Object.values(BUILD_PIECES)
    });
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

  private formatCost(cost: ResourceCost): string {
    return Object.entries(cost)
      .map(([item, amount]) => `${this.getInventoryLabel(item as InventoryItem)} ${amount}`)
      .join(', ');
  }

  private animateBuildPlacement(piece: PlacedBuildPiece): void {
    piece.container.setScale(0.86);

    const flame = piece.container.getByName('torch_flame') as Phaser.GameObjects.Triangle | null;
    if (flame) {
      piece.flame = flame;
    }

    this.tweens.add({
      targets: piece.container,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 110,
      ease: 'Back.easeOut',
      yoyo: true
    });

    for (let i = 0; i < 9; i += 1) {
      const ember = this.add.circle(piece.gridX, piece.gridY + 8, Phaser.Math.Between(2, 4), 0xf4d18a, 0.85).setDepth(95);
      this.tweens.add({
        targets: ember,
        x: piece.gridX + Phaser.Math.Between(-40, 40),
        y: piece.gridY + Phaser.Math.Between(-48, 14),
        alpha: 0,
        scale: 0.2,
        duration: 280 + (i * 18),
        ease: 'Quad.easeOut',
        onComplete: () => ember.destroy()
      });
    }

    this.cameras.main.shake(75, 0.0012);
  }
}
