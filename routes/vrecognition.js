const express = require("express");
const router = express.Router();
const multer = require("multer");
var VisualRecognitionV3 = require("watson-developer-cloud/visual-recognition/v3");
var fs = require("fs");

var classifier_ids = ["Modelocaras_1370499543"];
var threshold = 0.0;
let recognition;

var visualRecognition = new VisualRecognitionV3({
  url: "https://gateway.watsonplatform.net/visual-recognition/api",
  version: "2018-03-19",
  iam_apikey: "sLMwz_JZdS3lgsDJOtI8Bg99nQYawYLPGeLfhCmA44Ot"
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    let fecha = new Date().toISOString();
    console.log(fecha);
    fecha = fecha.replace(/:/g, "-");
    console.log(fecha);

    cb(null, fecha + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    (file.mimetype === file.mimetype) === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.post("/", upload.single("image"), (req, res, next) => {
  if (req.file) {
    ruta = req.file.path;
    var images_file = fs.createReadStream(ruta);

    var params = {
      images_file: images_file,
      classifier_ids: classifier_ids,
      threshold: threshold
    };

    var params2 = {
      images_file: images_file
    };

    visualRecognition.classify(params, function(err, response1) {
      if (err) {
        console.log(err);
        res.json({ error: err });
      } else {
        this.recognition = response1;
        // var result = response.images[0].classifiers[0].classes;
      }
      
      //   res.json(response);
    });

    visualRecognition.detectFaces(params2, function(err, response2) {
      if (err) console.log(err);
      else 
      console.log(this.recognition);
        res.json({ 'resp': this.recognition,
    'resp2': response2});

      //   console.log(unir+ "asd");
      // res.json(response);
    });
  } else {
    res.json({
      error: "Hubo un error al subir los archivos, por favor intente nuevamente"
    });
  }
});

module.exports = router;
