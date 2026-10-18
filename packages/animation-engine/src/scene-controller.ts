import * as THREE from "three";
import { AnimationPackage, ExplodedComponent, CameraPathKeyframe } from "@gcp/contracts";

export class DisassemblySceneController {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private componentMeshes: Map<string, THREE.Mesh> = new Map();
  private initialPositions: Map<string, THREE.Vector3> = new Map();
  private targetPositions: Map<string, THREE.Vector3> = new Map();
  private animationFrameId: number | null = null;

  constructor(
    private container: HTMLElement,
    private pkg: AnimationPackage,
    private onStageChange?: (stage: number, activeCallout?: string) => void
  ) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e17);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.01, 100);
    this.camera.position.set(0, 0, 0.35);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    container.appendChild(this.renderer.domElement);

    this.setupLighting();
    this.buildProceduralComponents();
    this.startRenderLoop();
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x3b82f6, 2.5);
    keyLight.position.set(2, 4, 3);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-2, -1, 2);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 2.0);
    rimLight.position.set(0, -3, -2);
    this.scene.add(rimLight);
  }

  /**
   * Procedural precision geometry representing the hardware components of the exact model
   */
  private buildProceduralComponents() {
    const group = new THREE.Group();

    for (const comp of this.pkg.components) {
      let geom: THREE.BufferGeometry;
      let mat: THREE.Material;

      if (comp.category === "CHASSIS_FRAME") {
        geom = new THREE.BoxGeometry(0.08, 0.165, 0.008);
        mat = new THREE.MeshStandardMaterial({
          color: 0xb8b3a8,
          metalness: 0.9,
          roughness: 0.2,
        });
      } else if (comp.category === "DISPLAY_PANEL") {
        geom = new THREE.BoxGeometry(0.076, 0.16, 0.002);
        mat = new THREE.MeshStandardMaterial({
          color: 0x050505,
          metalness: 0.1,
          roughness: 0.05,
        });
      } else if (comp.category === "BATTERY_PACK") {
        geom = new THREE.BoxGeometry(0.045, 0.11, 0.005);
        mat = new THREE.MeshStandardMaterial({
          color: 0x222222,
          metalness: 0.8,
          roughness: 0.3,
        });
      } else if (comp.category === "CAMERA_MODULE") {
        geom = new THREE.CylinderGeometry(0.015, 0.015, 0.008, 32);
        mat = new THREE.MeshStandardMaterial({
          color: 0x111111,
          metalness: 0.95,
          roughness: 0.1,
        });
      } else if (comp.category === "PROCESSOR_SOC") {
        geom = new THREE.BoxGeometry(0.035, 0.045, 0.003);
        mat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          metalness: 0.6,
          roughness: 0.4,
        });
      } else {
        geom = new THREE.BoxGeometry(0.04, 0.04, 0.004);
        mat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      }

      const mesh = new THREE.Mesh(geom, mat);
      const initialPos = new THREE.Vector3(0, 0, 0);
      const targetPos = new THREE.Vector3(...comp.offsetPosition);

      mesh.position.copy(initialPos);
      group.add(mesh);

      this.componentMeshes.set(comp.id, mesh);
      this.initialPositions.set(comp.id, initialPos);
      this.targetPositions.set(comp.id, targetPos);
    }

    this.scene.add(group);
  }

  /**
   * Applies scroll progress (0.0 to 1.0) to camera sequence and exploded component offsets
   */
  public updateProgress(progress: number) {
    const clamped = Math.max(0, Math.min(1, progress));

    // 1. Interpolate component positions
    for (const comp of this.pkg.components) {
      const mesh = this.componentMeshes.get(comp.id);
      const initial = this.initialPositions.get(comp.id);
      const target = this.targetPositions.get(comp.id);

      if (mesh && initial && target) {
        // Explode proportionally to progress
        mesh.position.lerpVectors(initial, target, clamped);
      }
    }

    // 2. Interpolate camera keyframes
    this.interpolateCamera(clamped);

    // 3. Notify stage
    const stage = Math.min(10, Math.max(1, Math.ceil(clamped * 10)));
    const activeKeyframe = this.findNearestKeyframe(clamped);
    this.onStageChange?.(stage, activeKeyframe?.activeCallout);
  }

  private interpolateCamera(progress: number) {
    const seq = this.pkg.cameraSequence;
    if (seq.length < 2) return;

    let k1 = seq[0];
    let k2 = seq[seq.length - 1];

    for (let i = 0; i < seq.length - 1; i++) {
      if (progress >= seq[i].scrollProgress && progress <= seq[i + 1].scrollProgress) {
        k1 = seq[i];
        k2 = seq[i + 1];
        break;
      }
    }

    const range = k2.scrollProgress - k1.scrollProgress;
    const factor = range > 0 ? (progress - k1.scrollProgress) / range : 0;

    const p1 = new THREE.Vector3(...k1.cameraPosition);
    const p2 = new THREE.Vector3(...k2.cameraPosition);
    this.camera.position.lerpVectors(p1, p2, factor);

    const t1 = new THREE.Vector3(...k1.targetLookAt);
    const t2 = new THREE.Vector3(...k2.targetLookAt);
    const currentTarget = new THREE.Vector3().lerpVectors(t1, t2, factor);
    this.camera.lookAt(currentTarget);

    this.camera.fov = k1.fov + (k2.fov - k1.fov) * factor;
    this.camera.updateProjectionMatrix();
  }

  private findNearestKeyframe(progress: number): CameraPathKeyframe | undefined {
    let nearest: CameraPathKeyframe | undefined;
    let minDiff = Infinity;
    for (const k of this.pkg.cameraSequence) {
      const diff = Math.abs(k.scrollProgress - progress);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = k;
      }
    }
    return nearest;
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private startRenderLoop() {
    const animate = () => {
      this.renderer.render(this.scene, this.camera);
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
