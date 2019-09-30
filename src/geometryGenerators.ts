import { Geometry } from "./SceneGraph";
export function getRectangle(size: number): Geometry {
  const indices = new Uint16Array([
    4,
    5,
    6,
    6,
    7,
    4, // front
    0,
    3,
    2,
    2,
    1,
    0, // back
    2,
    3,
    7,
    7,
    6,
    2, // top
    0,
    1,
    5,
    5,
    4,
    0, // bottom
    0,
    4,
    7,
    7,
    3,
    0, // left
    1,
    2,
    6,
    6,
    5,
    1 // right
  ]);

  const vertexes = new Float32Array([
    0,
    0,
    0,
    size,
    0,
    0,
    size,
    size,
    0,
    0,
    size,
    0,

    0,
    0,
    size,
    size,
    0,
    size,
    size,
    size,
    size,
    0,
    size,
    size
  ]);

  return {
    vertexes,
    indices
  };
}
