var escena=new THREE.Scene();
var camara=new THREE.PerspectiveCamera();
camara.position.z=7;
var renderizador=new THREE.WebGLRenderer();
renderizador.setSize(window.innerHeight*.95,window.innerHeight*.95);
document.body.appendChild(renderizador.domElement);
var forma=new THREE.CylinderGeometry(0.5, 1, 2);
var forma2=new THREE.SphereGeometry(1.5,30,15);
var material=new THREE.MeshBasicMaterial({color: 0x704214});
var material2=new THREE.MeshBasicMaterial({color: 0x23530f});
var cilindro=new THREE.Mesh(forma,material);
var esfera=new THREE.Mesh(forma2,material2);
esfera.position.set(0,0.9,0);
cilindro.position.set(0,-1,0);
escena.add(cilindro,esfera);
renderizador.render(escena,camara);
