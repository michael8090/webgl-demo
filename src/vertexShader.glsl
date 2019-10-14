attribute vec3 a_position;
varying vec3 v_position;

attribute vec3 a_normal;
varying vec3 v_normal;

uniform mat4 u_view_mat;
uniform mat4 u_project_mat;
uniform mat4 u_model_mat;
uniform float u_size;
void main() {
  vec4 worldPosition = u_model_mat * vec4(a_position, 1);
  gl_Position = u_project_mat * u_view_mat * worldPosition;

  v_position = a_position / u_size;
  v_position = worldPosition.xyz;
  v_normal = (u_model_mat * vec4(a_normal, 1)).xyz;
  v_normal = a_normal;
}