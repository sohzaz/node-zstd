var cp =require('cp'),
    Transform = require('stream').Transform;

class CompressionStream extends Transform {


}

class DecompressionStream extends Transform {

}

module.exports.CompressionStream = CompressionStream;
module.exports.DecompressionStream = DecompressionStream;