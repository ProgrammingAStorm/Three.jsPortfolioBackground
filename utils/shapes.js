import { OctahedronGeometry, TorusGeometry, TorusKnotGeometry } from 'three';
import { MeshPhongMaterial, MeshToonMaterial, MeshPhysicalMaterial, Mesh } from 'three';

function getOctaHed(material, radius, detail) {
    if(!detail) {
        detail = 0;
    }

    if(!material) {
        material = {};
    }

    return new Mesh(
        new OctahedronGeometry(radius, detail),
        new MeshPhongMaterial(material)
    );
}

function getTorus(
    radius,
    tube,
    radialSegments,
    tubularSegments,
    material,
    arc
) {
    if(!material) {
        material = {};
    }

  return new Mesh (
    new TorusGeometry(
        radius,
        tube,
        radialSegments,
        tubularSegments,
        arc
    ),
    new MeshPhysicalMaterial(material)
  );     
}

function getTorusKnot(
    radius,
    tube,
    tubularSegments,
    radialSegments,
    p,
    q,
    material
) {

    if(!material) {
        material = {};
    }

    return new Mesh(
        new TorusKnotGeometry(
            radius,
            tube,
            tubularSegments,
            radialSegments,
            p,
            q
        ),
        new MeshToonMaterial(material)
    )
}

export {
    getOctaHed,
    getTorus,
    getTorusKnot
};