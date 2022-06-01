import * as THREE from 'three';

import { getOctaHed, getTorus, getTorusKnot, Shape } from './shapes';

async function initTextures() {
  const crystalTex = new THREE.TextureLoader().load('../assets/textures/crystal-texture.jpg');
  const crystalNormMap = new THREE.TextureLoader().load('../assets/normal-maps/crystal-map.jpg');
  const metalTex = new THREE.TextureLoader().load('../assets/textures/metal-texture.jpg');
  const metalNormMap = new THREE.TextureLoader().load('../assets/normal-maps/metal-map.jpg');

  return {
    crystalTex: crystalTex,
    crystalNormMap: crystalNormMap,
    metalTex: metalTex,
    metalNormMap: metalNormMap
  };
}

async function initRender(doc) {
    let renderer = new THREE.WebGL1Renderer({
        canvas: doc
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    return renderer;
}

async function initCore(coreTex, coreNormMap) {
  const core = {
      shape: getOctaHed({
        color: 0xff00ff,
        map: coreTex,
        normalMap: coreNormMap,
        emissiveMap: coreNormMap,
        emissive: 0xff00ff
      }),
      rotation: {
        x: THREE.MathUtils.randFloatSpread(0.1),
        y: THREE.MathUtils.randFloatSpread(0.1),
        z: THREE.MathUtils.randFloatSpread(0.1)
      },
      lightShine: new THREE.PointLight(
        0xff00ff, //color
        50,        //intensity
        10000,       //distance
        35        //decay
      ),
      spotLights: [
        new THREE.SpotLight(  
          0xff00ff, //color
          0.1,        //intensity
          0,        //distance
          0.5,      //angle
          0.8,        //penumbra
          50         //decay
        ),
        new THREE.SpotLight(  
          0xff00ff, //color
          0.1,        //intensity
          0,        //distance
          0.5,      //angle
          0.8,        //penumbra
          50         //decay
        ),new THREE.SpotLight(  
          0xff00ff, //color
          0.1,        //intensity
          0,        //distance
          0.5,      //angle
          0.8,        //penumbra
          50         //decay
        ),new THREE.SpotLight(  
          0xff00ff, //color
          0.1,        //intensity
          0,        //distance
          0.5,      //angle
          0.8,        //penumbra
          50         //decay
        ),new THREE.SpotLight(  
          0xff00ff, //color
          0.1,        //intensity
          0,        //distance
          0.5,      //angle
          0.8,        //penumbra
          50         //decay
        ),new THREE.SpotLight(  
          0xff00ff, //color
          0.1,        //intensity
          0,        //distance
          0.5,      //angle
          0.8,        //penumbra
          50         //decay
        )
      ]
  }; 

  core.lightShine.position.set(0, 0, 0);
  core.shape.add(core.lightShine);
  core.spotLights.forEach(light => {      
    //Set up shadow properties for the light    
    light.shadow.mapSize.width = 2048; // default    
    light.shadow.mapSize.height = 2048; // default    
    light.shadow.camera.near = 0.5; // default   
    light.shadow.camera.far = 500; // default    
    light.shadow.focus = 1; // default      
    core.shape.add(light);  
  });

  core.spotLights[0].position.set(0, 2, 0);
  core.spotLights[1].position.set(0, -2, 0);
  core.spotLights[2].position.set(2, 0, 0);
  core.spotLights[3].position.set(-2, 0, 0);
  core.spotLights[4].position.set(0, 0, 2);
  core.spotLights[5].position.set(0, 0, -2);

  return core;
  //core.castShadow = true;
  //core.receiveShadow = true;
}

async function initTori(toriTex, toriNorMap) {
    const tori = {};

    const innerJob = new Promise(resolve => {
        resolve([
            {
              shape: getTorus(5, 1, 25, 25, {
                map: toriTex,
                normalMap: toriNorMap
              }),
              x: 0,
              y: 0,
              z: 0,
              xRot: -0.05,
              yRot: 0.01,
              zRot: -0.5
            },
            {
              shape: getTorus(10, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1.75),
              x: 1.5,
              y: 0.5,
              z: 5,
              xRot: 0,
              yRot: 0,
              zRot: 0.05
            },
            {
              shape: getTorus(13, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: -2,
              y: 0,
              z: 1,
              xRot: 0.05,
              yRot: 0,
              zRot: 0.0065
            },
            {
              shape: getTorus(13, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 1,
              y: 0,
              z: 1,
              xRot: -0.05,
              yRot: 0,
              zRot: -0.0065
            },
        ]);
    });

    const middleJob = new Promise(resolve => {
        resolve([
            {
              shape: getTorus(16, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 2),
              x: 1,
              y: 0.5,
              z: 0,
              xRot: 0,
              yRot: 0.01,
              zRot: 0.3
            },
            {
              shape: getTorus(20, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1.5),
              x: 0,
              y: 0,
              z: 0,
              xRot: 0.02,
              yRot: 0,
              zRot: 0.05
            },
            {
              shape: getTorus(20, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1.5),
              x: 1.57,
              y: 0,
              z: 0,
              xRot: 0.02,
              yRot: 0,
              zRot: 0.05
            },
            {
              shape: getTorus(20, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1.5),
              x: 3.14,
              y: 0,
              z: 0,
              xRot: 0.02,
              yRot: 0,
              zRot: 0.05
            },
            {
              shape: getTorus(20, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1.5),
              x: -1.57,
              y: 0,
              z: 0,
              xRot: 0.02,
              yRot: 0,
              zRot: 0.05
            },
        ]);
    });

    const outerJob = new Promise(resolve => {
        resolve([
            {
              shape: getTorus(30, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 0,
              y: 0,
              z: 0,
              xRot: 0.01,
              yRot: 0,
              zRot: 0.01
            },
            {
              shape: getTorus(30, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 0,
              y: 1.57,
              z: 0,
              xRot: 0.01,
              yRot: 0,
              zRot: 0 //Must Stay Zero
            },  
            {
              shape: getTorus(30, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 0,
              y: 3.14,
              z: 0,
              xRot: 0.01,
              yRot: 0,
              zRot: 0.01
            },  
            {
              shape: getTorus(30, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 0,
              y: 4.71,
              z: 0,
              xRot: 0, //Must Stay Zero
              yRot: 0,
              zRot: 0.01 
            }, 
            {
              shape: getTorus(30, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 0,
              y: 0,
              z: 3.14,
              xRot: 0.01,
              yRot: 0,
              zRot: 0.01,
            },  
            {
              shape: getTorus(30, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 0,
              y: 1.57,
              z: 3.14,
              xRot: 0,//Must Stay Zero
              yRot: 0,
              zRot: 0.01 
            },  
            {
              shape: getTorus(30, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 0,
              y: 3.14,
              z: 3.14,
              xRot: 0.01,
              yRot: 0,
              zRot: 0.01,
            }, 
            {
              shape: getTorus(30, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 0,
              y: 4.71,
              z: 3.14,
              xRot: 0,//Must Stay Zero
              yRot: 0,
              zRot: 0.01 
            },
        ]);
    });

    const exoJob = new Promise(resolve => {
        resolve([
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 0.785,
              y: 0,
              z: 0,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },  
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 2.355,
              y: 0,
              z: 0,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },  
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 3.925,
              y: 0,
              z: 0,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },  
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 5.495,
              y: 0,
              z: 0,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 0.785,
              y: 3.14,
              z: 0,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },  
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 2.355,
              y: 3.14,
              z: 0,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },  
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 3.925,
              y: 3.14,
              z: 0,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },  
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 5.495,
              y: 3.14,
              z: 0,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 1.57,
              y: 0.785,
              z: 0.58875,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 1.57,
              y: 0.785,
              z: 1.57,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 1.57,
              y: 2.355,
              z: 0.58875,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 4.71,
              y: 0.785,
              z: 4.71,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 4.71,
              y: 0.785,
              z: 0.58875,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },  
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 4.71,
              y: 2.355,
              z: 0.58875,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },  
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 4.71,
              y: 3.925,
              z: 0.58875,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            },  
            {
              shape: getTorus(40, 1, 30, 200, {
                map: toriTex,
                normalMap: toriNorMap
              }, 1),
              x: 4.71,
              y: 5.495,
              z: 0.58875,
              xRot: 0.001,
              yRot: 0.001,
              zRot: 0.001
            }
        ]);
    });

    await innerJob.then(inner => {
        tori.innerCluster = inner;
    });

    await middleJob.then(middle => {
        tori.middleCluster = middle;
    });

    await outerJob.then(outer => {
        tori.outerCluster = outer;
    });

    await exoJob.then(exo => {
        tori.exoCluster = exo;
    });

    return tori;
}

async function initKnots() {
  return [
    {
      shape: getTorusKnot(2500, 50, 300, 20, 11, 10, {
        color: 0x3333ff,
        emissive: 0x000033
      }),
      x: 0,
      y: 0,
      z: 0,
      xRot: 0.001,
      yRot: -0.001,
      zRot: 0.005
    },
    {
      shape: getTorusKnot(2500, 50, 300, 300, 11, 10, {
        color: 0x3333ff,
        emissive: 0x000033
      }),
      x: 1.57,
      y: 0,
      z: 0,
      xRot: -0.001,
      yRot: 0.001,
      zRot: -0.005
    }
  ];
}

async function initStars(starTex, starNormMap) {
  const stars = [
    {
      shape: getOctaHed({
        color: 0xff00ff,
        map: starTex,
        normalMap: starNormMap,
        emissiveMap: starNormMap,
        emissive: 0xff00ff
      }, 5,),
      initRot: {
        x: 0,
        y: 0,
        z: 0
      },
      animRot: {
        x: getRnd(0.05, 0.1, 1),
        y: getRnd(0.05, 0.1, 1),
        z: getRnd(0.05, 0.1, 1)
      }, 
      pos: {
        x: 68,
        y: 0,
        z: 0
      }          
    },
    {
      shape: getOctaHed({
        color: 0xff00ff,
        map: starTex,
        normalMap: starNormMap,
        emissiveMap: starNormMap,
        emissive: 0xff00ff
      }, 5,),
      initRot: {
        x: 0,
        y: 0,
        z: 0
      },
      animRot: {
        x: getRnd(0.05, 0.1, 1),
        y: getRnd(0.05, 0.1, 1),
        z: getRnd(0.05, 0.1, 1)
      }, 
      pos: {
        x: -68,
        y: 0,
        z: 0
      }         
    },
    {
      shape: getOctaHed({
        color: 0xff00ff,
        map: starTex,
        normalMap: starNormMap,
        emissiveMap: starNormMap,
        emissive: 0xff00ff
      }, 5,),
      initRot: {
        x: 0,
        y: 0,
        z: 0
      },
      animRot: {
        x: getRnd(0.05, 0.1, 1),
        y: getRnd(0.05, 0.1, 1),
        z: getRnd(0.05, 0.1, 1)  
      }, 
      pos: {
        x: 0,
        y: 68,
        z: 0
      }         
    },
    {
      shape: getOctaHed({
        color: 0xff00ff,
        map: starTex,
        normalMap: starNormMap,
        emissiveMap: starNormMap,
        emissive: 0xff00ff
      }, 5,),
      initRot: {
        x: 0,
        y: 0,
        z: 0
      },
      animRot: {
        x: getRnd(0.05, 0.1, 1),
        y: getRnd(0.05, 0.1, 1),
        z: getRnd(0.05, 0.1, 1)
      }, 
      pos: {
        x: 0,
        y: -68,
        z: 0
      }           
    },
    {
      shape: getOctaHed({
        color: 0xff00ff,
        map: starTex,
        normalMap: starNormMap,
        emissiveMap: starNormMap,
        emissive: 0xff00ff
      }, 5,),
      initRot: {
        x: 0,
        y: 0,
        z: 0
      },
      animRot: {
        x: getRnd(0.05, 0.1, 1),
        y: getRnd(0.05, 0.1, 1),
        z: getRnd(0.05, 0.1, 1)
      }, 
      pos: {
        x: 0,
        y: 0,
        z: 68
      }            
    },
    {
      shape: getOctaHed({
        color: 0xff00ff,
        map: starTex,
        normalMap: starNormMap,
        emissiveMap: starNormMap,
        emissive: 0xff00ff
      }, 5,),
      initRot: {
        x: 0,
        y: 0,
        z: 0
      },
      animRot: {
        x: getRnd(0.05, 0.1, 1),
        y: getRnd(0.05, 0.1, 1),
        z: getRnd(0.05, 0.1, 1)
      }, 
      pos: {
        x: 0,
        y: 0,
        z: -68
      }   
    }
  ];

  stars.forEach(shape => {
    //shape.shape.castShadow = true;
    //shape.shape.receiveShadow = true;
      
    shape.shape.position.setX(shape.pos.x);
    shape.shape.position.setY(shape.pos.y);
    shape.shape.position.setZ(shape.pos.z);
      
    
    shape.shape.add(new THREE.PointLight(
      0xff00ff, //color
      25,        //intensity
      250,       //distance
      35        //decay
    ));
  });

  return stars;
}

async function initSpaceStuff(count, stuffTex, stuffNormMap) {

    const spaceStuff = Array();

    for(let i = 0; i < count; i++) {
        const spaceThing = getOctaHed({
          color: 0xff0066,
          map: stuffTex,
          normalMap: stuffNormMap,
          emissive: 0xff0066,
          emissiveMap: stuffNormMap
        }, getRnd(1, 100, 1), 1);

        spaceThing.add(new THREE.PointLight(
          0xff0066, //color
          spaceThing.geometry.parameters.radius / 5,        //intensity
          10000,       //distance
          35        //decay
        ))

        let z = THREE.MathUtils.randFloatSpread(THREE.MathUtils.randFloat(500, 10000));
        let x = THREE.MathUtils.randFloatSpread(THREE.MathUtils.randFloat(500, 10000));
        let y = THREE.MathUtils.randFloatSpread(THREE.MathUtils.randFloat(500, 10000));

        if(x >= -500 && x <= 500) {
          x = 750;
        }
        if(y >= -500 && y <= 500) {
          y = 750;
        }
        if(z >= -500 && z <= 500) {
          z = 750;
        }

        spaceThing.position.set(
            x,
            y,
            z
        )

        spaceStuff.push({
            thing: spaceThing,
            x: getRnd(0.0001, 3, 1),
            y: getRnd(0.0001, 3, 1),
            z: getRnd(0.0001, 3, 1)
      });
    }
    return spaceStuff; 
}

function getRnd(min, max, modifier) {
    let rand = (Math.floor(Math.random() * (max - min + 1) ) + min) * modifier;
  
    return rand;
}

export {
  initTextures,
  initRender,
  initCore,
  initTori,
  initKnots,
  initStars,
  initSpaceStuff
}