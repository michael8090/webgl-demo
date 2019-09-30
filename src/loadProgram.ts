export function loadShader(
  gl: WebGLRenderingContext,
  type: number,
  sourceString: string
) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("could not create shader");
  }
  gl.shaderSource(shader, sourceString);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const infoLog = `
---shader compile error begin---
${gl.getShaderInfoLog(shader)}
---shader compile error end  ---
    `;
    gl.deleteShader(shader);
    throw new Error(infoLog);
  }
  return shader;
}

export function loadProgram(
  gl: WebGLRenderingContext,
  vertexShaderString: string,
  fragmentShaderString: string
): WebGLProgram {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderString);
  const fragmentShader = loadShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderString
  );

  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  return program;
}
