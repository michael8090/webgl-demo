precision mediump float;
varying vec3 v_position;
varying vec3 v_normal;
uniform float u_time;
uniform vec3 u_eye_pos;
uniform vec3 u_color;
uniform vec3 u_spot_light_pos;
uniform vec3 u_extra_color;
uniform vec3 u_light_color;

void main() {
  // light data
  vec3 spotLightPosition = vec3(sin(u_time), 0, cos(u_time)) * 500.0;
  spotLightPosition = u_spot_light_pos;
  vec3 lightColor = u_light_color;

  vec3 lightD = v_position - spotLightPosition;
  vec3 lightDirection = normalize(lightD);
  float lightDistance = length(lightD);
  float sl = lightDistance * lightDistance;
  vec3 normal = normalize(v_normal);
  
  // ambient
  vec3 ambientColor = 0.1 * u_color;

  // diffuse
  float diffuse = max(dot(-lightDirection, normal), 0.0) * (1.0 / (sl * 0.00000001 + 1.0));
  vec3 diffuseColor = lightColor * diffuse;

  // speclar
  float specularStrength = 0.5;
  vec3 reflectDirection = normalize(reflect(lightDirection, v_normal));
  vec3 eyeDirection = normalize(u_eye_pos - v_position);
  float speclar = pow(max(dot(reflectDirection, eyeDirection), 0.0), 256.0); 
  vec3 speclarColor = lightColor * specularStrength * speclar;

  gl_FragColor = vec4((ambientColor + diffuseColor + speclarColor) * u_color + u_extra_color, 1.0);
  // gl_FragColor = vec4(diffuseColor * u_color, 1);
}