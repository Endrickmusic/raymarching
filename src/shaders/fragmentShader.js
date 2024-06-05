const fragmentShader = `

uniform float uEps;
uniform float uMaxDis;
uniform float uMaxSteps;

uniform vec3 uCamPos;
uniform mat4 uCamToWorldMat;
uniform mat4 uCamInverseProjMat;

uniform vec3 uLightDir;
uniform vec3 uLightColor;

uniform float uDiffIntensity;
uniform float uSpecIntensity;
uniform float uAmbientIntensity;
uniform float uShininess;

uniform float uTime;

varying vec2 vUv;

void main() {

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(uTime+vUv.xyx + vec3(0,2,4));

    // Output to screen
    gl_FragColor = vec4(col,1.0);
	
}

`

export default fragmentShader
