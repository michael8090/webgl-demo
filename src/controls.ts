import { vec3, mat4, vec2 } from "gl-matrix";

export function initControls(
  canvas: HTMLCanvasElement,
  spaceSize: number,
  viewMatrix: mat4
) {
  const eyePosition = vec3.create();
  const center = vec3.create();
  const up = [0, 1, 0];
  vec3.set(center, 0, 0, 0);
  let alpha = Math.PI * 0.25;
  let beta = alpha;
  let r = 1.7 * spaceSize;
  function updateEyePosition() {
    const maxRotate = Math.PI * 0.5 - 0.00001;
    const maxR = 10 * spaceSize;
    const minR = 0.5 * spaceSize;
    if (r < minR) {
      r = minR;
    }
    if (r > maxR) {
      r = maxR;
    }
    if (beta < -maxRotate) {
      beta = -maxRotate;
    }
    if (beta > maxRotate) {
      beta = maxRotate;
    }
    vec3.set(
      eyePosition,
      center[0] + Math.cos(beta) * Math.cos(alpha) * r,
      center[1] + Math.sin(beta) * r,
      center[2] + Math.cos(beta) * Math.sin(alpha) * r
    );
  }

  updateEyePosition();
  mat4.lookAt(viewMatrix, eyePosition, center, up);

  // for controls
  {
    const p0 = vec2.create();
    const p1 = vec2.create();
    const d = vec2.create();
    const v0 = vec3.create();
    const rotateSpeed = Math.PI / 100;
    const moveSpeed = spaceSize * 0.01;
    let isDown = false;
    canvas.onmousedown = e => {
      vec2.set(p0, e.pageX, e.pageY);
      isDown = true;
    };
    document.onmousemove = e => {
      if (isDown) {
        vec2.set(p1, e.pageX, e.pageY);
        vec2.sub(d, p1, p0);
        vec2.copy(p0, p1);
        // left
        if (e.which === 1) {
          alpha += d[0] * rotateSpeed;
          beta += d[1] * rotateSpeed;
          updateEyePosition();
        } else if (e.which === 3) {
          // right
          vec3.subtract(v0, center, eyePosition);
          vec3.set(v0, v0[0], 0, v0[2]);
          vec3.normalize(v0, v0);
          const dx = v0[0] * d[1] * moveSpeed;
          const dz = v0[2] * d[1] * moveSpeed;
          const vdx = v0[2] * d[0] * moveSpeed;
          const vdz = -v0[0] * d[0] * moveSpeed;
          const x = dx + vdx;
          const z = dz + vdz;
          vec3.set(center, center[0] + x, center[1], center[2] + z);
          vec3.set(
            eyePosition,
            eyePosition[0] + x,
            eyePosition[1],
            eyePosition[2] + z
          );
        }
        mat4.lookAt(viewMatrix, eyePosition, center, up);
      }
    };
    document.onmouseup = () => {
      isDown = false;
    };
    canvas.oncontextmenu = e => e.preventDefault();
    canvas.onwheel = e => {
      e.preventDefault();
      const zoomSpeed = 0.1 * spaceSize;
      if (e.deltaY > 0) {
        r += zoomSpeed;
      } else {
        r -= zoomSpeed;
      }
      updateEyePosition();
      mat4.lookAt(viewMatrix, eyePosition, center, up);
    };
  }
}
