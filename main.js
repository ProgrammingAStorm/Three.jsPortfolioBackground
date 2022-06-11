import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as INIT from './utils/init';

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x000e4d, 0.00045);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 12500);

camera.position.set(5, 5, 5);

let objTextures;

let renderer;

let core;

let tori;

let octahedra;

let sphere

let torusKnots;

let stars;

let spaceStuff;

let composer;

await init();

const controls = new OrbitControls(camera, renderer.domElement);

animate();

async function init() {
  console.log('textures started')
  const textureJob = INIT.initTextures().then(textures => {
    objTextures = textures;
    console.log('textures done')
  })

  console.log('renderer started')
  const renderJob = INIT.initRender(document.querySelector('#bg')).then(shape => {
    renderer = shape;
    console.log("renderer done")
  });

  await textureJob;

  let coreReady = false;
  console.log('core started')
  const coreJob = INIT.initCore( objTextures.crystalTex, objTextures.crystalNormMap ).then(shape => {    
    core = shape;
    scene.add(core.shape);

    setInterval(() => {
      core.rotation = {
        x: THREE.MathUtils.randFloatSpread(0.1),
        y: THREE.MathUtils.randFloatSpread(0.1),
        z: THREE.MathUtils.randFloatSpread(0.1)
      };
    }, 10000)

    console.log("core done")
    coreReady = true;
  });

  console.log('tori started')
  let toriPopJob; //THIS IS BEING USED. LEAVE IT HERE
  const toriJob = INIT.initTori( objTextures.metalTex, objTextures.metalNormMap ).then(torus => {
    tori = torus;
    console.log("tori done")
    toriPopJob = populateTori();
  })

  console.log('octahedra started')
  const octahedraJob = INIT.initOctahedra(10).then(shapes => {
    octahedra = shapes;

    octahedra.forEach(shape => {
      scene.add(shape.obj.item);
    });

    console.log('octahedra done')
  });

  console.log('sphere started')
  const sphereJob = INIT.initSphere().then(shape => {
    sphere = shape;
    scene.add(sphere);
    console.log('sphere done')
  });

  console.log('knots started')
  const knotJob = INIT.initKnots().then(knots => {
    torusKnots = knots;

    torusKnots.forEach(knot => {
      rotateShape(knot.shape, knot.x, knot.y, knot.z);

      scene.add(knot.shape);
    });

    console.log('knots done')
  });
  
  console.log('stars started')
  const starJob = INIT.initStars( objTextures.crystalTex, objTextures.crystalNormMap ).then(shape => {
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
  const stuffJob = INIT.initSpaceStuff( 100, objTextures.crystalTex, objTextures.crystalNormMap ).then(stuff => {
    spaceStuff = stuff;

    spaceStuff.forEach(stuff => {
      scene.add(stuff.thingObj);
    });

    console.log("stuff done")
  });

  await renderJob;
  await coreJob;

  const composerJob = INIT.initComposer(
    renderer, 
    [      
      await INIT.initRenderPass(scene, camera),

      await INIT.initEffectPass(camera, ...[

        await INIT.initGodRays(camera, core.shape, {
          resolutionScale: 1,
          density: 10,
          decay: 0.98,
          weight: 0.1125,
          samples: 196,
          exposure: 1,
        }),

        await INIT.initSmaaEffect(),
      ]),
    ]
  ).then(cmpsr => {
    composer = cmpsr;
  })

  await toriJob;
  await octahedraJob;
  await sphereJob;
  //await toriPopJob;
  await knotJob;
  await starJob;
  await stuffJob;

  await composerJob;

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
  
  composer.render();
}

function rotateShape(shape, x, y, z) {
  shape.rotation.x += x;
  shape.rotation.y += y;
  shape.rotation.z += z;
}

window.addEventListener('resize', () => {
  renderer.setPixelRatio(window.devicePixelRatio);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize( window.innerWidth, window.innerHeight )
})
