function detectLandmarks(fileName) {
  const vision = require('@google-cloud/vision');
  const client = new vision.ImageAnnotatorClient();
  client.landmarkDetection(fileName)
    .then(result => {
      const landmarks = result.landmarkAnnotations;
      return result[0].landmarkAnnotations[0].description
    })
    .catch(err => {
      console.log(err)
    })
  
}

module.exports = detectLandmarks;