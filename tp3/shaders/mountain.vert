uniform sampler2D uSampler2;
  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec4 heightData = texture2D(uSampler2, uv);
    float height = heightData.r * 80.0; // Adjust the multiplier to control the displacement intensity

    vec3 newPosition = position + normal * height;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  }