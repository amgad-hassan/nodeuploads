const express = require('express');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');

 
const app = express();


// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits: {fileSize:1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
    
  }).single('myImage');


// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }

//routes
app.get('/',(req,res)=>{res.render('index')});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
      if(err){
        res.render('index', {
          msg: err
        });
      } else {
        if(req.file == undefined){
          res.render('index', {
            msg: 'Error: No File Selected!'
          });
        } else {
          res.render('index', {
            msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`
          });
        }
      }
    });
  });

//ejs
app.set('view engine','ejs');

//public folder
app.use(express.static('./public'));


const PORT = process.env.PORT||5000;
app.listen(PORT,(err)=>{console.log(`server running on port ${PORT}`)});

