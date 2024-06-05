const vertexShader = `

varying vec2 vUv;

void main() {

    // Compute view direction in world space
    vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 viewDirection = normalize(-worldPosition.xyz);
    
    // Output vertex position
    gl_Position = projectionMatrix * worldPosition;
    vUv = uv;
}

`

export default vertexShader
