import { Geometry } from "./SceneGraph";
import { vec3 } from "gl-matrix";

const computeNormal = (function() {
  const v0 = vec3.create();
  const v1 = vec3.create();
  const n = vec3.create();
  const p0 = vec3.create();
  const p1 = vec3.create();
  const p2 = vec3.create();
  return function(vertexes: Float32Array, indices: Uint16Array) {
    const vertexNormalMap: {
      [vidx: number]: vec3;
    } = {};
    // get the normal of every triangle

    for (let i = 0, l = indices.length; i < l; i += 3) {
      const i0 = indices[i];
      const i1 = indices[i + 1];
      const i2 = indices[i + 2];

      const ai0 = i0 * 3;
      const ai1 = i1 * 3;
      const ai2 = i2 * 3;

      vec3.set(p0, vertexes[ai0], vertexes[ai0 + 1], vertexes[ai0 + 2]);
      vec3.set(p1, vertexes[ai1], vertexes[ai1 + 1], vertexes[ai1 + 2]);
      vec3.set(p2, vertexes[ai2], vertexes[ai2 + 1], vertexes[ai2 + 2]);

      vec3.sub(v0, p1, p0);
      vec3.sub(v1, p2, p0);
      vec3.cross(n, v0, v1);
      vec3.normalize(n, n);
      const idxs = [i0, i1, i2];
      for (let i = 0, l = idxs.length; i < l; i++) {
        const idx = idxs[i];
        let normal = vertexNormalMap[idx];
        if (normal === undefined) {
          vertexNormalMap[idx] = vec3.clone(n);
        } else {
          // it should never be here
          vec3.add(normal, normal, n);
        }
      }
    }
    const normals = new Float32Array(vertexes.length);
    // console.log(vertexNormalMap);
    for (let key in vertexNormalMap) {
      const idx = parseInt(key, 10);
      const normal = vertexNormalMap[idx];
      vec3.normalize(normal, normal);
      const ai = idx * 3;
      normals[ai] = normal[0];
      normals[ai + 1] = normal[1];
      normals[ai + 2] = normal[2];
    }
    // console.log(normals);
    return normals;
  };
})();

export function getBox(size: number): Geometry {
  const indicesForSharedVertexes = new Uint16Array([
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

  const sharedVertexes = new Float32Array([
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

  const vertexes = new Float32Array(
    indicesForSharedVertexes.reduce(
      (acc, idx) => {
        const ai = idx * 3;
        acc.push(
          sharedVertexes[ai],
          sharedVertexes[ai + 1],
          sharedVertexes[ai + 2]
        );
        return acc;
      },
      [] as number[]
    )
  );

  const idxes: number[] = [];
  for (let i = 0, l = indicesForSharedVertexes.length; i < l; i++) {
    idxes[i] = i;
  }

  const indices = new Uint16Array(idxes);

  return {
    vertexes,
    indices,
    normals: computeNormal(vertexes, indices)
  };
}
