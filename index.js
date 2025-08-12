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


app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/home', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/fileanalyse", upload.single('upfile'),(req, res)=>{
  const file =req.file;

setTimeout(() => {
   res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size
  }) 
}, 3000);

  console.log(file,' details requested');
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
