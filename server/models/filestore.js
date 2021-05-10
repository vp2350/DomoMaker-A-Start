const mongoose = require('mongoose');

let FileModel = {};

const FileSchema = new mongoose.Schema({
  fileInformation: {
    type: String,
    required: true,
  },
  uploaderName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    unique: true,
  },
  data: {
    type: Buffer,
  },
  size: {
    type: Number,
  },
  encoding: {
    type: String,
  },
  tempFilePath: {
    type: String,
  },
  truncated: {
    type: Boolean,
  },
  mimetype: {
    type: String,
  },
  md5: {
    type: String,
  },
});

FileSchema.statics.findByOwner = (username, callback) => {
  const search = {
    uploaderName: username,
  };

  return FileModel.find(search).select('fileInformation uploaderName size name mimetype').lean().exec(callback);
};

FileSchema.statics.findByName = (filename, callback) => {
  const search = {
    name: filename,
  };

  return FileModel.find(search).select('fileInformation uploaderName size name mimetype').lean().exec(callback);
};

FileModel = mongoose.model('FileModel', FileSchema);

module.exports.FileModel = FileModel;
module.exports.FileSchema = FileSchema;
