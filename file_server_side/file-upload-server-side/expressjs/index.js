const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const fs = require('fs');
const TRAIN_subdir = "train_image/"
const VALIDATION_subdir = "validation_image/"
const BASE_ROUTE = "../../../../coco-annotator/datasets/"

// eg: using BASE_ROUTE + TRAIN_subdir to obtain the complete route  


function get_highest_file_index(route) {
  var files = fs.readdirSync(route);
  var max_index = 0
  for (var i = 0; i < files.length; i++) {
      this_file_index_position = files[i].match(/\d+/)
      if (this_file_index_position !== null) {
        this_file_index = parseInt(this_file_index_position[0])
        if ( max_index < this_file_index) {
          max_index = this_file_index
      }
      }
  }
  return max_index
}

const app = express();

// enable files upload
app.use(fileUpload({ createParentPath: true }));
//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

//start app
const port = process.env.PORT || 2000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));


// api to receive the train_images
app.post("/api/upload-file/train_image", async (req, res) => {
  const train_image_route = BASE_ROUTE + TRAIN_subdir
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
        payload: {},
      });
    } else {
      //Use the name of the input field (i.e. "file") to retrieve the uploaded file
      let file = req.files.file;
      //Get highest file index to figure out a valid name
      var filename = (get_highest_file_index(train_image_route) + 1).toString() + ".jpg"
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      file.mv(train_image_route + filename);
      //send response
      res.send({
        status: true,
        message: "File was uploaded successfully",
        payload: {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size,
        },
      });
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: false,
      message: "Unspected problem",
      payload: {},
    });
  }
});


// api to receive the validation_images
app.post("/api/upload-file/validation_image", async (req, res) => {
  const validation_image_route = BASE_ROUTE + VALIDATION_subdir
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
        payload: {},
      });
    } else {
      //Use the name of the input field (i.e. "file") to retrieve the uploaded file
      let file = req.files.file;
      //Get highest file index to figure out a valid name
      var filename = (get_highest_file_index(validation_image_route) + 1).toString() + ".jpg"
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      file.mv(validation_image_route + filename);
      //send response
      res.send({
        status: true,
        message: "File was uploaded successfully",
        payload: {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size,
        },
      });
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: false,
      message: "Unspected problem",
      payload: {},
    });
  }
});
