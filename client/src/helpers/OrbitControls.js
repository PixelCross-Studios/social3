/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
import {
  EventDispatcher,
  Quaternion,
  Spherical,
  Vector2,
  Vector3
} from 'three';

// This set of controls performs orbiting
// Unlike TrackballControls, it maintains the "up" direction camera.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move

const _changeEvent = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };

class OrbitControls extends EventDispatcher {
  constructor(camera, domElement) {
    super();

    // eslint-disable-next-line no-console
    if (domElement === undefined) console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.');
    // eslint-disable-next-line no-console
    if (domElement === document) console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.');

    this.camera = camera;
    this.domElement = domElement;

    // Set to false to disable this control
    this.enabled = true;

    // "target" sets the location of focus, where the camera orbits around
    this.target = new Vector3();

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    this.minPolarAngle = Math.PI / 2 - Math.PI * 0.3; // radians
    this.maxPolarAngle = Math.PI / 2 + Math.PI * 0.3; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
    this.minAzimuthAngle = -1; // radians
    this.maxAzimuthAngle = 1; // radians

    // Set to true to enable damping (inertia)
    // If damping is enabled, you must call controls.update() in your animation loop
    this.enableDamping = false;
    this.dampingFactor = 0.3;

    // Set to false to disable rotating
    this.enableRotate = true;
    this.rotateSpeed = 1.0;
    this.keyRotateSpeed = 1.0;

    // The four arrow keys
    this.keys = {
      LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown'
    };

    // Touch fingers
    this.touches = { ONE: 0 };

    // for reset
    this.target0 = this.target.clone();
    this.position0 = this.camera.position.clone();
    this.zoom0 = this.camera.zoom;

    // the target DOM element for key events
    this._domElementKeyEvents = null;

    //
    // internals
    //

    const scope = this;

    const STATE = {
      NONE: -1,
      ROTATE: 0,
      TOUCH_ROTATE: 1
    };

    let state = STATE.NONE;

    const EPS = 0.000001;

    // current position in spherical coordinates
    const spherical = new Spherical();
    const sphericalDelta = new Spherical();

    let scale = 1;
    let zoomChanged = false;

    const rotateStart = new Vector2();
    const rotateEnd = new Vector2();
    const rotateDelta = new Vector2();

    function rotateLeft(angle) {
      sphericalDelta.theta -= angle;
    }

    function rotateUp(angle) {
      sphericalDelta.phi -= angle;
    }

    //
    // event callbacks - update the camera state
    //

    function handleMouseDownRotate(event) {
      rotateStart.set(event.clientX, event.clientY);
    }

    function handleMouseMoveRotate(event) {
      rotateEnd.set(event.clientX, event.clientY);

      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);

      const element = scope.domElement;

      rotateLeft((2 * Math.PI * rotateDelta.x) / element.clientHeight); // yes, height

      rotateUp((2 * Math.PI * rotateDelta.y) / element.clientHeight);

      rotateStart.copy(rotateEnd);

      scope.update();
    }

    function handleMouseUp(/* event */) {

      // no-op

    }

    function handleKeyRotate(x, y) {
      rotateDelta.set(x, y).multiplyScalar(scope.keyRotateSpeed);

      rotateEnd.addVectors(rotateStart, rotateDelta);

      const element = scope.domElement;

      rotateLeft((2 * Math.PI * rotateDelta.x) / element.clientHeight); // yes, height

      rotateUp((2 * Math.PI * rotateDelta.y) / element.clientHeight);

      rotateStart.copy(rotateEnd);
    }

    function handleKeyDown(event) {
      let needsUpdate = false;
      switch (event.code) {
        case scope.keys.UP:
          handleKeyRotate(0, 1);
          needsUpdate = true;
          break;

        case scope.keys.BOTTOM:
          handleKeyRotate(0, -1);
          needsUpdate = true;
          break;

        case scope.keys.LEFT:
          handleKeyRotate(1, 0);
          needsUpdate = true;
          break;

        case scope.keys.RIGHT:
          handleKeyRotate(-1, 0);
          needsUpdate = true;
          break;

        default:
      }

      if (needsUpdate) {
        // prevent the browser from scrolling on cursor keys
        event.preventDefault();

        scope.update();
      }
    }

    function handleTouchStartRotate(event) {
      if (event.touches.length === 1) {
        rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
      } else {
        const x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
        const y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

        rotateStart.set(x, y);
      }
    }

    function handleTouchMoveRotate(event) {
      if (event.touches.length === 1) {
        rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
      } else {
        const x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
        const y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

        rotateEnd.set(x, y);
      }

      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);

      const element = scope.domElement;

      rotateLeft((2 * Math.PI * rotateDelta.x) / element.clientHeight); // yes, height

      rotateUp((2 * Math.PI * rotateDelta.y) / element.clientHeight);

      rotateStart.copy(rotateEnd);
    }

    function handleTouchEnd(/* event */) {

      // no-op

    }

    //
    // event handlers - FSM: listen for events and reset state
    //

    function onMouseMove(event) {
      if (scope.enabled === false) return;

      event.preventDefault();

      if (state === STATE.ROTATE && scope.enableRotate === true) {
        handleMouseMoveRotate(event);
      }
    }

    function onPointerMove(event) {
      if (scope.enabled === false) return;

      switch (event.pointerType) {
        case 'mouse':
        case 'pen':
          onMouseMove(event);
          break;
        default:
        // TODO touch
      }
    }

    function onPointerUp(event) {
      switch (event.pointerType) {
        case 'mouse':
        case 'pen':
          // eslint-disable-next-line no-use-before-define
          onMouseUp(event);
          break;
        default:
        // TODO touch
      }
    }

    function onMouseDown(event) {
      // Prevent the browser from scrolling.
      event.preventDefault();

      // Manually set the focus since calling preventDefault above
      // prevents the browser from setting it automatically.
      if (scope.domElement.focus) {
        scope.domElement.focus();
      } else {
        window.focus();
      }

      if (event.button === 0) {
        if (scope.enableRotate === false) return;

        handleMouseDownRotate(event);

        state = STATE.ROTATE;
      } else {
        state = STATE.NONE;
      }

      if (state !== STATE.NONE) {
        scope.domElement.ownerDocument.addEventListener('pointermove', onPointerMove);
        scope.domElement.ownerDocument.addEventListener('pointerup', onPointerUp);

        scope.dispatchEvent(_startEvent);
      }
    }

    function onMouseUp(event) {
      scope.domElement.ownerDocument.removeEventListener('pointermove', onPointerMove);
      scope.domElement.ownerDocument.removeEventListener('pointerup', onPointerUp);

      if (scope.enabled === false) return;

      handleMouseUp(event);

      scope.dispatchEvent(_endEvent);

      state = STATE.NONE;
    }

    function onKeyDown(event) {
      if (scope.enabled === false || scope.enableRotate === false) return;

      handleKeyDown(event);
    }

    function onPointerDown(event) {
      if (scope.enabled === false) return;

      switch (event.pointerType) {
        case 'mouse':
        case 'pen':
          onMouseDown(event);
          break;
        default:
        // TODO touch
      }
    }

    function onTouchStart(event) {
      if (scope.enabled === false) return;

      event.preventDefault(); // prevent scrolling

      if (event.touches.length === 1 && scope.touches.ONE === 0) {
        if (scope.enableRotate === false) return;

        handleTouchStartRotate(event);

        state = STATE.TOUCH_ROTATE;
      } else {
        state = STATE.NONE;
      }

      if (state !== STATE.NONE) {
        scope.dispatchEvent(_startEvent);
      }
    }

    function onTouchMove(event) {
      if (scope.enabled === false) return;

      event.preventDefault(); // prevent scrolling

      if (state === STATE.TOUCH_ROTATE) {
        if (scope.enableRotate === false) return;

        handleTouchMoveRotate(event);

        scope.update();
      } else {
        state = STATE.NONE;
      }
    }

    function onTouchEnd(event) {
      if (scope.enabled === false) return;

      handleTouchEnd(event);

      scope.dispatchEvent(_endEvent);

      state = STATE.NONE;
    }

    function onContextMenu(event) {
      if (scope.enabled === true) {
        event.preventDefault();
      }
    }

    //
    // public methods
    //

    this.getPolarAngle = () => spherical.phi;

    this.getAzimuthalAngle = () => spherical.theta;

    this.listenToKeyEvents = (elem) => {
      elem.addEventListener('keydown', onKeyDown);
      this._domElementKeyEvents = elem;
    };

    this.saveState = () => {
      scope.target0.copy(scope.target);
      scope.position0.copy(scope.camera.position);
      scope.zoom0 = scope.camera.zoom;
    };

    this.reset = () => {
      scope.target.copy(scope.target0);
      scope.camera.position.copy(scope.position0);
      scope.camera.zoom = scope.zoom0;

      scope.camera.updateProjectionMatrix();
      scope.dispatchEvent(_changeEvent);

      scope.update();

      state = STATE.NONE;
    };

    // this method is exposed, but perhaps it would be better if we can make it private...
    this.update = (() => {
      const offset = new Vector3();

      // so camera.up is the orbit axis
      const quat = new Quaternion().setFromUnitVectors(camera.up, new Vector3(0, 1, 0));
      const quatInverse = quat.clone().invert();

      const lastPosition = new Vector3();
      const lastQuaternion = new Quaternion();

      const twoPI = 2 * Math.PI;

      return function update() {
        const { position } = scope.camera;

        offset.copy(position).sub(scope.target);

        // rotate offset to "y-axis-is-up" space
        offset.applyQuaternion(quat);

        // angle from z-axis around y-axis
        spherical.setFromVector3(offset);

        if (scope.enableDamping) {
          spherical.theta += sphericalDelta.theta * scope.dampingFactor;
          spherical.phi += sphericalDelta.phi * scope.dampingFactor;
        } else {
          spherical.theta += sphericalDelta.theta;
          spherical.phi += sphericalDelta.phi;
        }

        // restrict theta to be between desired limits

        let min = scope.minAzimuthAngle;
        let max = scope.maxAzimuthAngle;

        if (Number.isFinite(min) && Number.isFinite(max)) {
          if (min < -Math.PI) min += twoPI; else if (min > Math.PI) min -= twoPI;

          if (max < -Math.PI) max += twoPI; else if (max > Math.PI) max -= twoPI;

          if (min <= max) {
            spherical.theta = Math.max(min, Math.min(max, spherical.theta));
          } else {
            spherical.theta = (spherical.theta > (min + max) / 2)
              ? Math.max(min, spherical.theta)
              : Math.min(max, spherical.theta);
          }
        }

        // restrict phi to be between desired limits
        spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));

        spherical.makeSafe();

        spherical.radius *= scale;

        // restrict radius to be between desired limits
        spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));

        offset.setFromSpherical(spherical);

        // rotate offset back to "camera-up-vector-is-up" space
        offset.applyQuaternion(quatInverse);

        position.copy(scope.target).add(offset);

        scope.camera.lookAt(scope.target);

        if (scope.enableDamping === true) {
          sphericalDelta.theta *= (1 - scope.dampingFactor);
          sphericalDelta.phi *= (1 - scope.dampingFactor);
        } else {
          sphericalDelta.set(0, 0, 0);
        }

        scale = 1;

        // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8

        if (zoomChanged
          || lastPosition.distanceToSquared(scope.camera.position) > EPS
          || 8 * (1 - lastQuaternion.dot(scope.camera.quaternion)) > EPS) {
          scope.dispatchEvent(_changeEvent);

          lastPosition.copy(scope.camera.position);
          lastQuaternion.copy(scope.camera.quaternion);
          zoomChanged = false;

          return true;
        }

        return false;
      };
    })();

    this.dispose = () => {
      scope.domElement.removeEventListener('contextmenu', onContextMenu);

      scope.domElement.removeEventListener('pointerdown', onPointerDown);

      scope.domElement.removeEventListener('touchstart', onTouchStart);
      scope.domElement.removeEventListener('touchend', onTouchEnd);
      scope.domElement.removeEventListener('touchmove', onTouchMove);

      scope.domElement.ownerDocument.removeEventListener('pointermove', onPointerMove);
      scope.domElement.ownerDocument.removeEventListener('pointerup', onPointerUp);

      if (scope._domElementKeyEvents !== null) {
        scope._domElementKeyEvents.removeEventListener('keydown', onKeyDown);
      }
    };

    //

    scope.domElement.addEventListener('contextmenu', onContextMenu);

    scope.domElement.addEventListener('pointerdown', onPointerDown);

    scope.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    scope.domElement.addEventListener('touchend', onTouchEnd);
    scope.domElement.addEventListener('touchmove', onTouchMove, { passive: false });

    // force an update at start

    this.update();
  }
}

export default OrbitControls;
