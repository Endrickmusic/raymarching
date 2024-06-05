const fragmentShader = `

uniform float uEps;
uniform float uMaxDis;
uniform float uMaxSteps;
// uniform vec3 uClearColor;

uniform vec3 uCamPos;
uniform mat4 uCamToWorldMat;
uniform mat4 uCamInverseProjMat;

uniform vec3 uLightDir;
// uniform vec3 uLightColor;

uniform float uDiffIntensity;
uniform float uSpecIntensity;
uniform float uAmbientIntensity;
uniform float uShininess;

uniform float uTime;
uniform sampler2D uFBO;

varying vec2 vUv;

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0-h);
}

float scene(vec3 p) {
    float sphere1Dis = distance(p, vec3(cos(uTime), sin(uTime), 0.0)) - 0.5;
    float sphere2Dis = distance(p, vec3(sin(uTime), cos(uTime), 0.0)) - 0.75;
    return smin(sphere1Dis, sphere2Dis, 0.5);
}

float rayMarch(vec3 ro, vec3 rd) {
    
    float dis = 0.0;

    for (int i = 0; i < int(uMaxSteps); i++) {
        vec3 p = ro + rd * dis;
        float disEst = scene(p);
        dis += disEst;
        if (disEst < uEps || dis >= uMaxDis) break;
    }
    return dis;
}

vec3 sceneColor(vec3 p) {
    float sphere1Dis = distance(p, vec3(cos(uTime), sin(uTime), 0.0)) - 1.;
    float sphere2Dis = distance(p, vec3(sin(uTime), cos(uTime), 0.0)) - 0.75;

    float k = 0.5;
    float h = clamp(0.5 + 0.5*(sphere2Dis-sphere1Dis)/k, 0.0, 1.0);

    vec3 color1 = vec3(1.0, 0.0, 0.0);
    vec3 color2 = vec3(0.0, 0.0, 1.0);

    return mix(color1, color2, h);
}

// from https://iquilezles.org/articles/normalsSDF/
vec3 calcNormal( vec3 p ) // for function f(p)
{
    vec3 n = vec3(0.0);
    for( int i=0; i < 4; i++ )
    {
        vec3 e = 0.5773 * (2.0 * vec3((((i + 3)>>1)&1),((i>>1)&1),(i&1))-1.0);
        n += e * scene(p + e * uEps);
    }
    return normalize(n);
}

void main() {

    vec2 uv = vUv;
    vec3 color = vec3(0.0);
    // Get ray origin and direction from camera uniforms
    vec3 ro = uCamPos;
    vec3 rd = (uCamInverseProjMat * vec4(uv * 2.0 - 1.0, 0.0, 1.0)).xyz;
    rd = (uCamToWorldMat * vec4(rd, 0.0)).xyz;
    rd = normalize(rd);

    // ray marching and find total distance travelled
    float dis = rayMarch(ro, rd);


        // hit position
        vec3 hp = ro + rd * dis;
        // normal at hit position
        vec3 normal = calcNormal(hp);

        // calculate lighting
        float dotNL = dot(normal, uLightDir);
        float diff = max(dotNL, 0.0) * uDiffIntensity;
        float spec = pow(max(dot(reflect(-uLightDir, normal), -rd), 0.0), uShininess) * uSpecIntensity;
        // float spec = 0.0;
        float amb = uAmbientIntensity;

        // vec3 color = uLightColor * ((diff + spec + amb) * sceneColor(hp));
        color = ((diff + spec + amb) * sceneColor(hp));
        if(dis >= uMaxDis) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.0);}
        else{
        gl_FragColor = vec4(color,1.0);
        }
}

`
export default fragmentShader
