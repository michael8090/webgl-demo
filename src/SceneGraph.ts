import { mat4 } from "gl-matrix";

export interface Geometry {
  vertexes: Float32Array;
  indices: Uint16Array;
}

export interface GlAttribute {
  name: string;
  type: "3fv";
  value: Float32Array;
  location?: number;
}

export type GlUniform =
  | {
      name: string;
      type: "Matrix4fv";
      value: mat4;
      location?: WebGLUniformLocation;
    }
  | {
      name: string;
      type: "1f";
      value: number;
      location?: WebGLUniformLocation;
    };

export interface SceneNode {
  geometry: {
    indices: Uint16Array;
  };
  program: WebGLProgram;
  attributes?: { [key: string]: GlAttribute | undefined };
  uniforms?: { [key: string]: GlUniform | undefined };
}

export class SceneGraph {
  constructor(private gl: WebGLRenderingContext) {}
  nodes: SceneNode[] = [];
  add(node: SceneNode) {
    const { gl } = this;
    const { program, attributes, uniforms, geometry } = node;
    if (attributes) {
      Object.values(attributes).forEach(attribute => {
        attribute = attribute as GlAttribute;
        const attribLoc = gl.getAttribLocation(program, attribute.name);
        if (attribLoc === -1) {
          throw new Error(`could not find attribute: ${attribute.name}`);
        }
        attribute.location = attribLoc;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, attribute.value, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribLoc);
      });
    }

    if (uniforms) {
      Object.values(uniforms).forEach(uniform => {
        uniform = uniform as GlUniform;
        const uniformLoc = gl.getUniformLocation(program, uniform.name);
        if (!uniformLoc) {
          throw new Error(`could not find uniform: ${uniform.name}`);
        }
        uniform.location = uniformLoc;
      });
    }

    const ibo = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
    this.nodes.push(node);
  }
  draw() {
    const { gl } = this;
    this.nodes.forEach((node, i) => {
      gl.useProgram(node.program);
      if (node.uniforms) {
        Object.values(node.uniforms).forEach(uniform => {
          uniform = uniform as GlUniform;
          if (uniform.type === "Matrix4fv") {
            if (
              uniform.name === "u_project_mat" ||
              uniform.name === "u_view_mat"
            ) {
              if (i === 0) {
                gl.uniformMatrix4fv(uniform.location!, false, uniform.value);
              }
            } else {
              gl.uniformMatrix4fv(uniform.location!, false, uniform.value);
            }
          } else if (uniform.type === "1f" && i === 0) {
            gl.uniform1f(uniform.location!, uniform.value);
          }
        });
      }

      gl.drawElements(
        gl.TRIANGLES,
        node.geometry.indices.length,
        gl.UNSIGNED_SHORT,
        0
      );
    });
  }
}
