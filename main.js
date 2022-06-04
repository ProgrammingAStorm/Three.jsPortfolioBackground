import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { initTextures, initRender, initCore, initSphere, initTori, initOctahedra, initKnots, initStars, initSpaceStuff } from './utils/init';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 12500);
camera.position.set(5, 5, 5); //50, 10, 25 //5, 5, 5 //50, 10, 25 //30, 10, 25

let selector;

let objTextures;

let renderer;

let core;

let tori;

let octahedra;

let sphere

let torusKnots;

let stars;

let spaceStuff;

scene.fog = new THREE.FogExp2(0x000e4d, 0.00045)

// const canvas1 = document.querySelector('#bg')
// const gl1 = canvas1.getContext('webgl')
// console.log(gl1)


await init();

//GENERAL//
//add some more randomly generated things in space around

//look into fixed camera path on scroll

//make sure to clean up and finalize codebase ESPECIALLY the nomenclature! very cringe

//find a way to make load time faster, at the very least have the page wait for the canvas to render before everything else renders
//maybe have a loading bar for the scene while its rendering
//Try out promise.all or maybe parallel.js to speed up and generally do init() better

//god rays and lens glare at core

//proper init function for the sphere

//proper init function for the octahedron

//responsive to resizing

//catch too many uniforms and try to reinit with less polys

//needs to work in browser with github pages so it doesn't need to query a server that doesn't exist

//STARS//

//CORE//

//SPACESTUFF//

//KNOTS//

//CLUSTERS

//LAST-MINUTE MAYBES//
//async animate
//if time and energy remain, fix shadows
//implement settings in browser to allow for tweaking if graphics are too much
//look into adding tori and stars to the core to try and a do a dramatic scenic draging affect of the core moving around as the page is scrolled
//add long galactic arms to the knots
//light trails on the stars
//light trails on tori
//lazers from stars to core
//spotlights
//more knots maybe bigger better larger more spinny stuff on the outeside. just push the limits and see how far you can go
//ring around core inside of the knots big big big and spinning fast
//very last minute try n avoid having things colide

//IMMEDIATE LIST//
//god rays and lens glare at core
//Try out promise.all or maybe parallel.js to speed up and generally do init() better
//light trails on the stars
//light trails on tori
//reorganize and optimize init

const controls = new OrbitControls(camera, renderer.domElement);

animate();

async function init() {
  console.log('textures started')
  const textureJob = initTextures().then(textures => {
    objTextures = textures;
    console.log('textures done')
  })

  console.log('renderer started')
  const renderJob = initRender(document.querySelector('#bg')).then(shape => {
    renderer = shape;
    console.log("renderer done")
  });

  await textureJob;

  let coreReady = false;
  console.log('core started')
  const coreJob = initCore( objTextures.crystalTex, objTextures.crystalNormMap ).then(shape => {    
    core = shape;
    scene.add(core.shape);

    /*setInterval(() => {
      core.rotation = {
        x: THREE.MathUtils.randFloatSpread(0.1),
        y: THREE.MathUtils.randFloatSpread(0.1),
        z: THREE.MathUtils.randFloatSpread(0.1)
      };
    }, 10000)*/

    console.log("core done")
    coreReady = true;
  });

  console.log('tori started')
  let toriPopJob; //THIS IS BEING USED. LEAVE IT HERE
  const toriJob = initTori( objTextures.metalTex, objTextures.metalNormMap ).then(torus => {
    tori = torus;
    console.log("tori done")
    toriPopJob = populateTori();
  })

  console.log('octahedra started')
  const octahedraJob = initOctahedra(10).then(shapes => {
    octahedra = shapes;

    octahedra.forEach(shape => {
      scene.add(shape.obj.item);
    });

    console.log('octahedra done')
  });

  console.log('sphere started')
  const sphereJob = initSphere().then(shape => {
    sphere = shape;
    scene.add(sphere);
    console.log('sphere done')
  });

  console.log('knots started')
  const knotJob = initKnots().then(knots => {
    torusKnots = knots;

    torusKnots.forEach(knot => {
      rotateShape(knot.shape, knot.x, knot.y, knot.z);

      scene.add(knot.shape);
    });

    console.log('knots done')
  });
  
  console.log('stars started')
  const starJob = initStars( objTextures.crystalTex, objTextures.crystalNormMap ).then(shape => {
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

  console.log('stuff started'); 
  const stuffJob = initSpaceStuff( 100, objTextures.crystalTex, objTextures.crystalNormMap ).then(stuff => {
    spaceStuff = stuff;

    spaceStuff.forEach(stuff => {
      scene.add(stuff.thingObj);
    });

    console.log("stuff done")
  });

  /*(async () => {
    
    //await populateTori();
  })();*/
  await renderJob;
  await coreJob;
  await toriJob;
  await octahedraJob;
  await sphereJob;
  //await toriPopJob;
  await knotJob;
  await starJob;
  await stuffJob;

  async function populateTori() { 
    console.log('tori population started')

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
  
    /*await innerJob;
    await middleJob;
    await outerJob;
    await exoJob;*/
    
    console.log('tori population done')
  }
}

function animate() {
  requestAnimationFrame(animate);

  //core
  if(true) {
    rotateShape(core.shape, core.rotation.x, core.rotation.y, core.rotation.z);
  }
  //clusters
  if(true) {
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
  //octahedra
  if(true) {
    octahedra.forEach(octahedron => {
      rotateShape(
        octahedron.shape.item,
        octahedron.shape.x,
        octahedron.shape.y,
        octahedron.shape.z
      );
      rotateShape(
        octahedron.obj.item,
        octahedron.obj.x,
        octahedron.obj.y,
        octahedron.obj.z
      );
    });
  }
  //knots
  if(true) {
    torusKnots.forEach(shape => {
      rotateShape(shape.shape, shape.xRot, shape.yRot, shape.zRot);
    });
  }
  //stars
  if(true) {
    stars.forEach(shape => {  
      rotateShape(
        shape.shape,
        shape.animRot.x,
        shape.animRot.y,
        shape.animRot.z
      );
    });
  }
  //spacestuff
  if(true) {
    spaceStuff.forEach(stuff => {
      rotateShape(
        stuff.thing,
        stuff.x,
        stuff.y,
        stuff.z
      );

      rotateShape(
        stuff.thingObj,
        stuff.xOrb,
        stuff.yOrb,
        stuff.zOrb
      )
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

  scene.fog = new THREE.FogExp2(0x000e4d, parseFloat(document.querySelector('#x').value))  
})*/