import { mat4 } from "gl-matrix";
import vertexShaderString from "./vertexShader.glsl";
import fragmentShaderString from "./fragmentShader.glsl";
import { loadProgram } from "./loadProgram";
import { getRectangle } from "./geometryGenerators";
import { initControls } from "./controls";
import { SceneGraph, SceneNode } from "./SceneGraph";

const canvas = document.createElement("canvas");
const width = 500;
const height = 500;
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

const rect = getRectangle(width);
const transform = mat4.create();
const rectNode: SceneNode = {
  geometry: rect,
  program,
  attributes: [
    {
      type: "3fv",
      name: "a_position",
      value: rect.vertexes
    }
  ],
  uniforms: [
    {
      type: "Matrix4fv",
      name: "u_model_mat",
      value: transform
    },
    {
      type: "Matrix4fv",
      name: "u_view_mat",
      value: viewMatrix
    },
    {
      type: "Matrix4fv",
      name: "u_project_mat",
      value: projectionMatrix
    },
    {
      type: "1f",
      name: "u_time",
      value: 0
    },
    {
      type: "1f",
      name: "u_size",
      value: width
    }
  ]
};
mat4.translate(transform, transform, [
  -0.5 * width,
  -0.5 * width,
  -0.5 * width
]);

sceneGraph.add(rectNode);

mat4.perspective(
  projectionMatrix,
  Math.PI * 0.5,
  width / height,
  0.1,
  20 * width
);

initControls(canvas, width, viewMatrix);

// const modelMatLoc = gl.getUniformLocation(program, "u_model_mat");

// const sizeLoc = gl.getUniformLocation(program, "u_size");
// const timeLoc = gl.getUniformLocation(program, "u_time");

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

  // sceneGraph.nodes.forEach(node => {
  //   gl.useProgram(node.program);

  //   gl.uniform1f(sizeLoc, width);
  //   const now = (Date.now() - t0) / 300;
  //   // the following line doesn't work... maybe it's about the float number range?
  //   // const now = (Date.now() - t0 + 10000000000) / 300;
  //   gl.uniform1f(timeLoc, now);

  //   // gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  //   // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  //   // gl.drawElements(gl.TRIANGLES, rect.indices.length, gl.UNSIGNED_SHORT, 0);
  // });
  sceneGraph.nodes.forEach(node => {
    if (node.uniforms) {
      const timeUniform = node.uniforms.find(u => u.name === "u_time");
      if (timeUniform) {
        timeUniform.value = (Date.now() - t0) / 300;
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
