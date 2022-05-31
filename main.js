import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { getOctaHed, getTorus, getTorusKnot, Shape } from './utils/shapes';
import { initRender, initCore, initTori, initKnots, initStars, initSpaceStuff } from './utils/init';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(50, 10, 25); //5, 5, 5 //50, 10, 25 //30, 10, 25
let selector;

//const backgroundTex = new THREE.TextureLoader().load('assets/textures/space-background.jpg')
//scene.background = backgroundTex;

let renderer;

let core;

let tori;

let torusKnots;

let stars;

let spaceStuff;

scene.fog = new THREE.FogExp2(0x3333ff, 0.00025)

await init();

//GENERAL//
//add some more randomly generated things in space around

//look into fixed camera path on scroll

//make sure to clean up and finalize codebase ESPECIALLY the nomenclature! very cringe

//find a way to make load time faster, at the very least have the page wait for the canvas to render before everything else renders
//maybe have a loading bar for the scene while its rendering

//god rays and lens glare at core

//STARS//

//CORE//

//SPACESTUFF//
//fix orbits around core

//KNOTS//

//CLUSTERS
//mess with tori segment geometry
//make the tori init async

//LAST-MINUTE MAYBES//
//async animate
//if time and energy remain, fix shadows
//implement settings in browser to allow for tweaking if graphics are too much
//look into adding tori and stars to the core to try and a do a dramatic scenic draging affect of the core moving around as the page is scrolled
//add long galactic arms to the knots
//light trails on the stars
//interval to randomize rotations

//IMMEDIATE LIST//
//tori async
//async texture loading
//reorganize and optimize init

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

animate();

async function init() {
  console.log('renderer started')
  const renderJob = initRender(document.querySelector('#bg'))
  .then(shape => {
    renderer = shape;
    console.log("renderer done")
  });

  let coreReady = false;
  console.log('core started')
  const coreJob = initCore().then(shape => {    
    core = shape;
    scene.add(core.shape);

    setInterval(() => {
      core.rotation = {
        x: THREE.MathUtils.randFloatSpread(0.1),
        y: THREE.MathUtils.randFloatSpread(0.1),
        z: THREE.MathUtils.randFloatSpread(0.1)
      };
    }, 1500)

    console.log("core done")
    coreReady = true;
  });

  console.log('tori started')
  let toriReady = false;
  const toriJob = initTori().then(torus => {
    tori = torus;
    toriReady = true;

    tori.innerCluster.forEach(shape => {
      //shape.shape.castShadow = true;
      //shape.shape.receiveShadow = true;
    
      rotateShape(shape.shape, shape.x, shape.y, shape.z);
      scene.add(shape.shape);
    });
    tori.middleCluster.forEach(shape => {
      //shape.shape.castShadow = true;
      //shape.shape.receiveShadow = true;
    
      rotateShape(shape.shape, shape.x, shape.y, shape.z);
      scene.add(shape.shape);
    });
    tori.outerCluster.forEach(shape => {
      //shape.shape.castShadow = true;
      //shape.shape.receiveShadow = true;
    
      rotateShape(shape.shape, shape.x, shape.y, shape.z);
      scene.add(shape.shape);
    }); 
    tori.exoCluster.forEach(shape => {
      //shape.shape.castShadow = true;
      //shape.shape.receiveShadow = true;
    
      rotateShape(shape.shape, shape.x, shape.y, shape.z);
      scene.add(shape.shape);
    });

    console.log("tori done")
  })

  console.log('knots started')
  const knotJob = initKnots().then(knots => {
    torusKnots = knots;

    torusKnots.forEach(knot => {
      rotateShape(knot.shape, knot.x, knot.y, knot.z);

      scene.add(knot.shape);
    });

    console.log('knots finished')
  });

  /*const toriPopJob = new Promise(() => {
    while(!toriReady) {
      continue;
    }

    const innerJob = new Promise(() => {
      tori.innerCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      });
    });

    const middleJob = new Promise(() => {
      tori.middleCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      });
    });

    const outerJob = new Promise(() => {
      tori.outerCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      }); 
    });

    const exoJob = new Promise(() => {
      tori.exoCluster.forEach(shape => {
        //shape.shape.castShadow = true;
        //shape.shape.receiveShadow = true;
      
        rotateShape(shape.shape, shape.x, shape.y, shape.z);
        scene.add(shape.shape);
      });
    });

    await innerJob;
    await middleJob;
    await outerJob;
    await exoJob;
  });*/

  
  console.log('stars started')
  const starJob = initStars().then(shape => {
    while(!coreReady) {
      continue;
    }

    stars = shape;
    stars.forEach(star => {
      core.shape.add(star.shape);
      //scene.add(star.lightShine)
    });

    console.log("stars done")
  });

  console.log('stuff started')
  const stuffJob = initSpaceStuff(100).then(stuff => {
    spaceStuff = stuff;

    while(!coreReady) {
      continue
    }

    spaceStuff.forEach(stuff => {
      core.shape.add(stuff.thing);
    });

    console.log("stuff done")
  })

  await renderJob;
  await coreJob;
  await toriJob;
  await knotJob;
  ////await toriPopJob;
  await starJob;
  await stuffJob;
}

function animate() {
  requestAnimationFrame(animate);

  //core
  if(false) {
    rotateShape(core.shape, core.rotation.x, core.rotation.y, core.rotation.z);
  }
  //clusters
  if(false) {
    tori.innerCluster.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
    tori.middleCluster.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
    tori.outerCluster.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
    tori.exoCluster.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
  }
  //knots
  if(true) {
    torusKnots.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
  }
  //stars
  if(false) {
    stars.forEach(shape => {  
      rotateShape(
        shape.shape.shape,
        shape.shape.animRot.x,
        shape.shape.animRot.y,
        shape.shape.animRot.z
      );
    });
  }
  //spacestuff
  if(false) {
    spaceStuff.forEach(stuff => {
      rotateShape(
        stuff.thing,
        stuff.x,
        stuff.y,
        stuff.z
      );
    })
  }
  
  controls.update();
  
  renderer.render(scene, camera);
}

function rotateShape(shape, x, y, z) {
  shape.rotation.x += x;
  shape.rotation.y += y;
  shape.rotation.z += z;
}

/*document.querySelector('#change').addEventListener('click', event => {
  event.preventDefault()

  if(!parseFloat(document.querySelector('#x').value)) {
    return
  }

  scene.fog = new THREE.FogExp2(0x3333ff, parseFloat(document.querySelector('#x').value))
   
})*/