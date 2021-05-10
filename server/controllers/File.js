const filedb = require('../models/filestore.js');

const uploadPage = (req, res) => {
    res.render('upload');
};

const searchPage = (req, res) => {
    return res.render('search', {
      csrfToken: req.csrfToken(),    
  });
};

const uploadFile = (req, res) => {
    console.dir(req.body.userName);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            error: 'No files were uploaded'
        });
    }

    const {
        sampleFile
    } = req.files;
    if (!req.body.userName) {
        sampleFile["uploaderName"] = req.session.account.username;
    } else {
        sampleFile["uploaderName"] = req.body.userName;
    }

    if (!req.body.fileInfo){
        return res.status(400).json({
            error: 'No file information provided'
        });
    }
    else{
        sampleFile["fileInformation"] = req.body.fileInfo;   
    }
    
    const imageModel = new filedb.FileModel(sampleFile);

    const savePromise = imageModel.save();

    savePromise.then(() => {
        res.status(201).json({
            message: 'Upload Successful! '
        });
    });

    savePromise.catch((error) => {
        console.dir(error);
        res.status(400).json({
            error: 'Something went wrong uploading'
        });
    });

    return savePromise;
};

const retrieveFile = (req, res) => {
    console.dir(req.query);
    console.dir(req.body);
    console.dir(req.query.fileName);
    if (!req.query.fileName) {
        return res.status(400).json({
            error: 'Missing File Name!'
        });
    }

    return filedb.FileModel.findOne({
        name: req.query.fileName
    }, (error, doc) => {
        if (error) {
            console.dir(error);
            return res.status(400).json({
                error: 'An error occured retrieving the file. '
            });
        }

        if (!doc) {
            return res.staus(404).json({
                error: 'File not found'
            });
        }

        res.writeHead(200, {
            'Content-Type': doc.mimetype,
            'Content-Length': doc.size
        });
        console.dir("1234532453");
        return res.end(doc.data);
    });
};

const retrieveOwnerFiles = (req, res) => {
    const currentUser = req.session.account.username;

    return filedb.FileModel.findByOwner(currentUser, (error, doc) => {
        if (error) {
            console.dir(error);
            return res.status(400).json({
                error: 'An error occured retrieving the files. '
            });
        }

        if (!doc) {
            return res.staus(404).json({
                error: 'File not found'
            });
        }
        
        return res.json({files: doc});
    });
};

const retrieveFilesByUserName = (req, res) => {
    if (!req.query.searchName) {
        return res.status(400).json({
            error: 'Missing User Name!'
        });
    }

    return filedb.FileModel.findByOwner(req.query.searchName, (error, doc) => {
        if (error) {
            console.dir(error);
            return res.status(400).json({
                error: 'An error occured retrieving the files. '
            });
        }

        if (!doc) {
            return res.staus(404).json({
                error: 'File not found'
            });
        }

        return res.json({files: doc});
    });
};

module.exports.searchPage = searchPage;
module.exports.uploadPage = uploadPage;
module.exports.uploadFile = uploadFile;
module.exports.retrieveFile = retrieveFile;
module.exports.retrieveFilesByUserName = retrieveFilesByUserName;
module.exports.retrieveOwnerFiles = retrieveOwnerFiles;