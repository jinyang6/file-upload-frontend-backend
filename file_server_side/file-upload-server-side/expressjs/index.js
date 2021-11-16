const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const fs = require('fs');
const ROUTE = "../../../../coco-annotator/datasets/train_image/"
function get_highest_file_index(route) {
  var files = fs.readdirSync(route);
  var max_index = 0
  for (var i = 0; i < files.length; i++) {
      this_file_index = parseInt(files[i].match(/\d+/)[0])
      if ( max_index < this_file_index) {
          max_index = this_file_index
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

app.post("/api/upload-file", async (req, res) => {
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
      var filename = (get_highest_file_index(ROUTE) + 1).toString() + ".jpg"
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      file.mv(ROUTE + filename);
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
    res.status(500).send({
      status: false,
      message: "Unspected problem",
      payload: {},
    });
  }
});
