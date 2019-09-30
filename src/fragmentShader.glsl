precision mediump float;
varying vec3 v_position;
uniform float u_time;
void main() {
  float halfS = 0.5;
  vec3 center = vec3(halfS, halfS, halfS);
  float d = length(v_position - center); // 0.5 ~ 0.5 * sqrt(3.0)
  float r = (d - halfS) / (0.5 * (sqrt(3.0) - 1.0));
  float y = sin(r * 3.14 * 10.0 - u_time * 2.0);
  gl_FragColor = vec4(0, y, y, 0.5);
}