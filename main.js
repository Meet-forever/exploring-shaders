import * as THREE from "three";


const _VS = `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const _FS = `
  varying vec2 vUv;
  uniform float u_time;
  vec3 palette(float t){
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1., 1., 1.);
    vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b * cos(6.28318 * (c*t + d));
  }

  void main(){
    vec2 uv = vUv;
    uv = uv*2.0 - 1.0;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    for(float i = 0.0; i < 4.0; i++){
        uv = fract(uv * 1.5) - 0.5;

        float d = length(uv) * exp(-length(uv0));;
        
        vec3 col = palette(length(uv0) + i*0.4 + u_time*.4); 

        d = sin(d*8. + u_time)/8.0;
        d = abs(d);
        d = pow(0.01/ d, 1.2);
        finalColor += col*d;
    }

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

const _FS2 = `
  varying vec2 vUv;
  uniform float u_time;

  void main(){
    vec2 uv = vUv;
    uv = uv*2.0 - 1.0;
    float d = length(uv);
    vec3 col = vec3(1., 2., 3.);
    d = sin(d*8. + u_time*2.)/8.;
    d = abs(d);
    d = 0.009/d;
    col *= d;
    col *= mix(uv.y, .2, 1.);
    gl_FragColor = vec4(col, 1.);
  }
`

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth/(window.innerHeight*2), 0.1, 500);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight*2);
document.body.appendChild(renderer.domElement);


const cube = new THREE.Mesh( 
  new THREE.PlaneGeometry(1, 1), 
  new THREE.ShaderMaterial({
      uniforms: {
        u_time: {value: 0.0},
      },
      vertexShader: _VS,
      fragmentShader: _FS,
  }) 
);

cube.position.y = 1.5;

scene.add( cube );

const cube2 = new THREE.Mesh( 
  new THREE.PlaneGeometry(1, 1), 
  new THREE.ShaderMaterial({
      uniforms: {
        u_time: {value: 0.0},
      },
      vertexShader: _VS,
      fragmentShader: _FS2,
  }) 
);

cube2.position.y = 0;

scene.add( cube2 );

camera.position.z = 5;

window.addEventListener('resize',()=>{
  camera.aspect = window.innerWidth/(window.innerHeight*2);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight*2);
});

function animate(delta_ms) {
	requestAnimationFrame( animate );

  cube.material.uniforms.u_time.value = delta_ms/1000;
  cube2.material.uniforms.u_time.value = delta_ms/1000;

	renderer.render( scene, camera );
}
animate();