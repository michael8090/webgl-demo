import { mat4 } from "gl-matrix";
import vertexShaderString from "./vertexShader.glsl";
import fragmentShaderString from "./fragmentShader.glsl";
import { loadProgram } from "./loadProgram";
import { getBox } from "./geometryGenerators";
import { initControls } from "./controls";
import { SceneGraph, SceneNode } from "./SceneGraph";

const canvas = document.createElement("canvas");
const width = 300;
const height = 300;
canvas.style.cssText = `width: ${width}px; height: ${height}px; background: black;`;
canvas.width = width;
canvas.height = height;
document.body.append(canvas);

const gl = canvas.getContext("webgl")!;
gl.viewport(0, 0, width, height);
gl.clearColor(0, 0, 0, 1);

const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

const sceneGraph = new SceneGraph(gl);

const program = loadProgram(gl, vertexShaderString, fragmentShaderString);

function createBox(x: number, y: number, z: number) {
  const boxGeometry = getBox(width);
  const transform = mat4.create();
  const node: SceneNode = {
    geometry: boxGeometry,
    program,
    attributes: {
      vertexePosition: {
        type: "3fv",
        name: "a_position",
        value: boxGeometry.vertexes
      }
    },
    uniforms: {
      transform: {
        type: "Matrix4fv",
        name: "u_model_mat",
        value: transform
      },
      viewMatrix: {
        type: "Matrix4fv",
        name: "u_view_mat",
        value: viewMatrix
      },
      projectionMatrix: {
        type: "Matrix4fv",
        name: "u_project_mat",
        value: projectionMatrix
      },
      time: {
        type: "1f",
        name: "u_time",
        value: 0
      },
      size: {
        type: "1f",
        name: "u_size",
        value: width
      }
    }
  };
  mat4.translate(transform, transform, [x, y, z]);
  return node;
}

function getRandomValue() {
  return (Math.random() - 0.5) * 5 * width;
}

for (let i = 0, n = 25; i < n; i++) {
  sceneGraph.add(
    createBox(getRandomValue(), getRandomValue(), getRandomValue())
  );
}

mat4.perspective(
  projectionMatrix,
  Math.PI * 0.5,
  width / height,
  0.1,
  20 * width
);

initControls(canvas, width, viewMatrix);

const t0 = Date.now();

function draw() {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.DEPTH_TEST);
  // gl.enable(gl.SAMPLE_COVERAGE);
  // gl.sampleCoverage(1, false);
  // gl.enable(gl.CULL_FACE);
  // gl.cullFace(gl.BACK);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const now = Date.now() - t0;
  sceneGraph.nodes.forEach(node => {
    if (node.uniforms) {
      const timeUniform = node.uniforms.time;
      if (timeUniform) {
        timeUniform.value = now / 300;
        // the following line doesn't work... maybe it's about the float number range?
        // const now = (Date.now() - t0 + 10000000000) / 300;
      }
    }
  });
  sceneGraph.draw();
}

function tick() {
  draw();
  requestAnimationFrame(tick);
}

tick();
