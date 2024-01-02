uniform sampler2D uSampler1;
varying vec2 vUv;

  void main() {
    vec4 mountainColor = texture2D(uSampler1, vUv);
    gl_FragColor = mountainColor;
  }