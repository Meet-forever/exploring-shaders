#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main(){
    vec2 uv = (gl_FragCoord.xy/u_resolution.xy)*2. - 1.;
    uv.x *= u_resolution.x/u_resolution.y;
    float d = length(uv);
    vec3 col = vec3(1., 2., 3.);
    d = sin(d*8. + u_time*2.0)/8.;
    d = abs(d);
    d = 0.009/d;
    col *= d;
    col *= mix(uv.y, .2, 1.);
    gl_FragColor = vec4(col, 1.);
}