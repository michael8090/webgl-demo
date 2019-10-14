precision mediump float;
varying vec3 v_position;
varying vec3 v_normal;
uniform float u_time;
uniform vec3 u_eye_pos;

void main() {
  // light data
  vec3 spotLightPosition = vec3(sin(u_time), 0, cos(u_time)) * 500.0;
  vec3 lightColor = vec3(0, 1, 1) * 0.9;

  vec3 lightDirection = normalize(v_position - spotLightPosition);
  vec3 normal = normalize(v_normal);
  
  // ambient
  vec3 ambientColor = vec3(0.03, 0.03, 0.03);

  // diffuse
  float diffuse = max(dot(-lightDirection, normal), 0.0);
  vec3 diffuseColor = lightColor * diffuse;
  //gl_FragColor = vec4(0, y, y, 0.5) + vec4(ambientColor + diffuseColor, 1.0);


  // speclar
  float specularStrength = 0.5;
  vec3 reflectDirection = normalize(reflect(lightDirection, v_normal));
  vec3 eyeDirection = normalize(u_eye_pos - v_position);
  float speclar = pow(max(dot(reflectDirection, eyeDirection), 0.0), 256.0); 
  vec3 speclarColor = lightColor * specularStrength * speclar;

  gl_FragColor = vec4(ambientColor + diffuseColor + speclarColor, 1.0);
}