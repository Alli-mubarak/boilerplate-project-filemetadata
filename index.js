var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
var app = express();

app.use(express.urlencoded({ extended: true }));

app.use( function middleware(req, res, next){
    console.log(req.method + " "+req.path+" - "+ req.ip);
    next();
})

// Configuring Multer storage
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Use path.join to create a robust path to your 'uploads' folder
            // relative to the current working directory (which is usually your project root)
            cb(null, path.join(__dirname, 'uploads')); 
        },
        filename: function (req, file, cb) {
            // Define how files should be named (e.g., original name with a timestamp)
            cb(null,file.originalname);
        }
    });

    // Create the Multer upload instance
    const upload = multer({ storage: storage });
let fileSize = '';
  async function getImageDetails(imageFileName) {
          const imagePath = path.join(__dirname, `/uploads/${imageFileName}`); // __dirname is the current directory
          try {
              const stats = await fs.stat(imagePath);
              // console.log(stats.size);
              fileSize = stats.size
              // console.log('File Size:', stats.size, 'bytes');
              // console.log('Creation Time:', stats.birthtime);
              // console.log('Last Modified Time:', stats.mtime);
  
              
              // For image dimensions, you might need a third-party library like 'sharp' or 'jimp'
              // Example with 'sharp':
              // const sharp = require('sharp');
              // const metadata = await sharp(imagePath).metadata();
              // console.log('Image Width:', metadata.width);
              // console.log('Image Height:', metadata.height);
  
          } catch (error) {
              console.error('Error reading image details:', error);
          }
      }

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/fileanalyse", upload.single('upfile'),(req, res)=>{
  const file =req.file? req.file.filename :"No file uploaded";
getImageDetails(file);
const  imgtype = file.split('.')[1];

setTimeout(() => {
   res.json({
    name: file,
    type: `img/${imgtype}`,
    size: fileSize
  }) 
}, 3000);

  console.log(file,' details requested');
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
