import WEBGL from "three/examples/jsm/capabilities/WebGL";
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Vector2,
    Vector3,
    AmbientLight,
    MeshBasicMaterial,
    Mesh,
    Raycaster,
    sRGBEncoding,
    Object3D,
    HemisphereLight,
    SphereBufferGeometry,
    TextureLoader,
    PointsMaterial,
    Points,
    BufferGeometry,
    BufferAttribute,
    Material,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { createLabel, latLonToRad } from "./util";
import { gsap, Quint } from "gsap";

interface Point {
    mesh: Mesh;
    label: HTMLDivElement;
}

interface RendererOptions {
    mounted: () => void;
}

export class GlobeRenderer {
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private controls: OrbitControls;
    private raycaster: Raycaster;
    private object: Object3D | null = null;

    private mouse: Vector2;
    private radius = 90;
    private activeSequence = 0;

    private requestId: number | null = null;

    private features: Api.Feature[] = [];
    private points: Point[] = [];

    private onMounted: () => void;

    constructor(options: RendererOptions) {
        if (!WEBGL.isWebGLAvailable()) {
            // @todo alert user
            throw new Error("WebGl is not supported");
        }

        this.onMounted = options.mounted;

        this.scene = new Scene();
        this.raycaster = new Raycaster();
        this.mouse = new Vector2();

        this.initRenderer();
        this.initCamera();
        this.initControls();
        this.initLights();
        this.initStars();
        this.initObject();
        this.addEventListeners();
    }

    /**
     * Initialize scene
     */
    private initRenderer() {
        this.renderer = new WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = sRGBEncoding;
        document.body.appendChild(this.renderer.domElement);
    }

    private initCamera() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 75;
        this.camera.updateMatrix();
        this.camera.updateMatrixWorld();
    }

    private initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.maxDistance = 400;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        this.controls.enablePan = false;
    }

    private initStars() {
        const geometry = new BufferGeometry();
        const particlesCnt = 2000;
        const positions = new Float32Array(particlesCnt * 3);

        for (let i = 0; i < positions.length; i++) {
            const star = new Vector3(
                Math.random() * 600 - 300,
                Math.random() * 600 - 300,
                Math.random() * 600 - 300
            );

            positions[i] = star.x;
            positions[i] = star.y;
            positions[i] = star.z;
        }

        geometry.setAttribute("position", new BufferAttribute(positions, 3));

        const loader = new TextureLoader();
        const sprite = loader.load("/star.png");

        const material = new PointsMaterial({
            color: 0xaaaaaa,
            size: 0.7,
            map: sprite,
        });

        const stars = new Points(geometry, material);
        this.scene.add(stars);
    }

    private initObject(): void {
        const loader = new GLTFLoader();
        loader.load(
            "/model/scene.gltf",
            gltf => {
                this.object = gltf.scene.children[0];
                this.object.position.y = -100;
                this.object.rotation.z += 2.32;
                this.scene.add(this.object);
                this.render();
                this.onMounted();
            },
            undefined,
            error => console.error(error)
        );
    }

    private initLights() {
        const ambientLight = new AmbientLight(0x404040, 0.5);
        const hemisphereLight = new HemisphereLight(0xffffbb, 0x080820, 1);
        this.scene.add(ambientLight);
        this.scene.add(hemisphereLight);
    }

    /**
     * Scene controls
     */
    private toPos(pos: Vector3, duration = 2): void {
        const { x, y, z } = this.camera.position;
        const start = new Vector3(x, y, z);
        const camDistance = this.camera.position.length();

        this.camera.position.copy(pos).normalize().multiplyScalar(camDistance);

        const { x: a, y: b, z: c } = this.camera.position;

        this.camera.position.copy(start).normalize().multiplyScalar(camDistance);

        gsap.timeline().to(this.camera.position, {
            x: a,
            y: b,
            z: c,
            duration,
        });
    }

    private toScreenPosition(obj: Mesh) {
        const vector = new Vector3();

        const widthHalf = 0.5 * window.innerWidth;
        const heightHalf = 0.5 * window.innerHeight;

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(this.camera);

        vector.x = vector.x * widthHalf + widthHalf;
        vector.y = -(vector.y * heightHalf) + heightHalf;

        return {
            x: vector.x,
            y: vector.y,
        };
    }

    public toCoords(coords: [number, number]) {
        this.controls.autoRotateSpeed = 0.15;
        const lon = coords[0];
        const lat = coords[1];
        const pos = latLonToRad(lat, lon, this.radius);
        this.toPos(pos);
    }

    private clearPoints() {
        this.points.forEach(point => {
            point.label.remove();
            point.mesh.geometry.dispose();
            (point.mesh.material as Material).dispose();
            this.scene.remove(point.mesh);
        });

        this.points = [];
    }

    public setFeatures(features: Api.Feature[]): void {
        this.clearPoints();

        this.features = features;
        this.addCoordinates();
    }

    private addCoordinates() {
        if (!this.features) {
            return;
        }

        this.features.map(feature => {
            const coordinates = feature.geometry.coordinates;
            this.addPoint(coordinates[0], coordinates[1], feature);
        });
    }

    private addPoint(lon: number, lat: number, feature: Api.Feature) {
        if (!this.object) {
            return;
        }

        const mesh = new Mesh(new SphereBufferGeometry(0.0001, 20, 20), new MeshBasicMaterial());

        const { x, y, z } = latLonToRad(lat, lon, this.radius);

        mesh.position.set(x, y, z);

        const label = createLabel(feature);

        this.points.push({ mesh, label });

        this.scene.add(mesh);
    }

    public sequenceOpen() {
        if (!this.object) {
            return;
        }

        gsap.timeline({
            defaults: { duration: 1, ease: Quint.easeInOut },
            onComplete: () => {
                this.activeSequence = 1;
                this.controls.minDistance = 150;
            },
        })
            .to(
                this.object.position,
                {
                    y: 0,
                },
                0
            )
            .to(
                this.camera.position,
                {
                    z: 200,
                },
                0
            )
            .to(
                this.scene.rotation,
                {
                    y: 0,
                },
                0
            );
    }

    /**
     * Event listeners
     */
    private onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private onMouseMove(event: MouseEvent) {
        this.mouse.x = event.clientX / window.innerWidth - 0.5;
        this.mouse.y = event.clientY / window.innerHeight - 0.5;
    }

    private addEventListeners(): void {
        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener("mousemove", this.onMouseMove.bind(this));
    }

    private removeEventListeners(): void {
        window.removeEventListener("resize", this.onResize.bind(this));
        window.removeEventListener("mousemove", this.onMouseMove.bind(this));
    }

    /**
     * Render scene
     */
    private render(): void {
        this.renderer.render(this.scene, this.camera);

        if (this.activeSequence < 1) {
            this.scene.rotation.y -= this.mouse.x * 0.01;
        } else {
            this.points.forEach(({ label, mesh }) => {
                const point = mesh.clone();

                point.position.set(
                    point.position.x * 0.966,
                    point.position.y * 0.966,
                    point.position.z * 0.966
                );

                const screen = this.toScreenPosition(point);
                label.style.transform = `translate3d(${screen.x - 15}px, ${screen.y}px, 0)`;

                const direction = new Vector3();
                direction.copy(mesh.position).sub(this.camera.position).normalize();
                this.raycaster.set(this.camera.position, direction);
                const intersections = this.raycaster.intersectObject(this.scene, true);
                const intersected =
                    intersections.length > 0 ? intersections[0].object.uuid === mesh.uuid : false;

                if (intersected && label.style.opacity === "0") {
                    label.style.opacity = "1";
                } else if (!intersected && label.style.opacity === "1") {
                    label.style.opacity = "0";
                }
            });

            this.controls.update();
        }

        this.requestId = window.requestAnimationFrame(this.render.bind(this));
    }

    /**
     * Destroy scene
     */
    public destroy(): void {
        if (this.requestId) {
            window.cancelAnimationFrame(this.requestId);
        }

        this.removeEventListeners();
        this.renderer.domElement.remove();

        this.points.forEach(point => point.label.remove());
    }
}
