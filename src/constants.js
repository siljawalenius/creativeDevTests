const params = {
    numParticles: 238, //number of particles currently visible
    maxDistance: 250, //max distancne two pointns cann be and still be connected
    particleSpeed: 2,
    lineOpacity: 0.3, //no longer necessary - used opacity prop on materia;s
    limitConnections: false,
    maxConnections: 100,
  };

  const radius = 300; //length of each side of geometry
  const maxParticles = 1000; //max number of points
  


module.exports = {
    params : params,
    radius : radius,
    maxParticles : maxParticles
}