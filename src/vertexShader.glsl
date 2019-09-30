attribute vec3 a_position;
varying vec3 v_position;
uniform mat4 u_view_mat;
uniform mat4 u_project_mat;
uniform mat4 u_model_mat;
uniform float u_size;
void main() {
  gl_Position = u_project_mat * u_view_mat * u_model_mat * vec4(a_position, 1);
  v_position = a_position / u_size;
}