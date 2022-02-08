import GUI from "lil-gui";
import { maxParticles, params } from './constants'

const initGUI = ({ boundingBox, pointCloud, linesShape}) => {
  // Debug
  const gui = new GUI();
  // gui.add(camera.position, "x", 0, 2000, 0.001).name("cameraX");
  // gui.add(camera.position, "y", 0, 2000, 0.001).name("cameraY");
  // gui.add(camera.position, "z", 0, 4000, 0.001).name("cameraZ");

  gui.add(params, "maxDistance", 10, 400, 1);
  gui
    .add(params, "numParticles", 0, maxParticles, 1)
    .onFinishChange((value) => {
      particles.setDrawRange(0, value);
    });
  gui.add(params, "particleSpeed", 0.2, 4, 0.001);

  gui.add(params, "limitConnections"); //true or false
  gui.add(params, "maxConnections", 0, 100, 1); //limit connections

  gui
    .add(boundingBox.material, "opacity", 0, 1, 0.01)
    .name("boundingBoxOpacity");

  gui.add(pointCloud.material, "size", 0, 10, 0.001).name("pointSize");

  gui.add(linesShape.material, "opacity", 0, 1, 0.001).name("linesOpacity");
};

export default initGUI; 