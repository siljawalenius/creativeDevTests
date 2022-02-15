import GUI from "lil-gui";
import { maxParticles, params } from './constants'

const initGUI = ({ boundingBox, pointCloud, linesShape}, particles, camera) => {
  // Debug
  const gui = new GUI();
   gui.add(camera.position, "x", -1000, 2000, 0.001).name("cameraX");
   gui.add(camera.position, "y", -1000, 2000, 0.001).name("cameraY");
   gui.add(camera.position, "z", 0, 4000, 0.001).name("cameraZ");

  gui.add(params, "maxDistance", 10, 400, 1);
 
  gui.add(params, "limitConnections"); //true or false
  gui.add(params, "maxConnections", 0, 100, 1); //limit connections

  gui.add(linesShape.material, "opacity", 0, 1, 0.001).name("linesOpacity");

  gui.add(params, 'radius', 200, 600, 1)


  const shapeControls = gui.addFolder('shape controls')
  shapeControls.add(params, "particleSpeed", 0.2, 4, 0.001);
  shapeControls.add(params, "numParticles", 0, maxParticles, 1)
  .onFinishChange((value) => {
      if (particles){ //avoids error of "no particles"
          particles.setDrawRange(0, value);
      }
  })
  shapeControls.add(pointCloud.material, "size", 0, 10, 0.001).name("pointSize");


  const breathControls = gui.addFolder('breath controls')
  breathControls.add(params,'inhaleLength', 0, 10, 0.5)
  breathControls.add(params,'exhaleLength', 0, 10, 0.5)
  breathControls.add(params,'holdLength', 0, 10, 0.5)

};

export default initGUI; 