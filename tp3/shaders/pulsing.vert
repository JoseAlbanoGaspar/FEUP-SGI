varying vec2 vUv;
uniform float timeFactor;

void main() {
    vUv = uv;

    // Pulsating effect based on time
    float pulse = abs(sin(timeFactor * 2.0))* 0.20 + 1.0; // Adjust the frequency and amplitude as needed
    vec3 scaledPosition = position * vec3(pulse, pulse, pulse) + vec3(0.0, 1.0 , 0.0);

    // Rotation matrix based on time (rotation around the y-axis)
    float rotationAngle = timeFactor;
    mat3 rotationMatrix = mat3(
        cos(rotationAngle), 0.0, sin(rotationAngle),
        0.0, 1.0, 0.0,
        -sin(rotationAngle), 0.0, cos(rotationAngle)
    );

    vec3 rotatedPosition = rotationMatrix * scaledPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(rotatedPosition, 1.0);
}
