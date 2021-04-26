const filedb = require('../models/filestore.js');

const uploadPage = (req, res) => {
  res.render('upload');
};

const uploadFile = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  const { sampleFile } = req.files;

  const imageModel = new filedb.FileModel(sampleFile);

  const savePromise = imageModel.save();

  savePromise.then(() => {
    res.status(201).json({ message: 'Upload Successful! ' });
  });

  savePromise.catch((error) => {
    console.dir(error);
    res.status(400).json({ error: 'Something went wrong uploading' });
  });

  return savePromise;
};

const retrieveFile = (req, res) => {
  console.dir(req.query);
  if (!req.query.fileName) {
    return res.status(400).json({ error: 'Missing File Name!' });
  }

  return filedb.FileModel.findOne({ name: req.query.fileName }, (error, doc) => {
    if (error) {
      console.dir(error);
      return res.status(400).json({ error: 'An error occured retrieving the file. ' });
    }

    if (!doc) {
      return res.staus(404).json({ error: 'File not found' });
    }

    res.writeHead(200, { 'Content-Type': doc.mimetype, 'Content-Length': doc.size });
    return res.end(doc.data);
  });
};

module.exports.uploadPage = uploadPage;
module.exports.uploadFile = uploadFile;
module.exports.retrieveFile = retrieveFile;
