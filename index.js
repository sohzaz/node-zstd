var cp =require('child_process'),
    Transform = require('stream').Transform;

class CompressionStream extends Transform {
    constructor(options) {
        super(options);
    }
    _transform(chunk, encoding, callback) {
        var proc = cp.spawn('zstd', [ '-c' , '-']);
        var self = this;
        proc.stdout.on('data', (data) => {
            self.push(data);
        });
        proc.stdout.on('finish', () => {
            callback();
        });
        proc.stderr.on('error', (err) => {
            throw err;
        });
        proc.stdin.write(chunk);
        proc.stdin.end();
    }
}

class DecompressionStream extends Transform {
    constructor(options) {
        super(options);
    }
    _transform(chunk, encoding, callback) {

    }
}

module.exports.CompressionStream = CompressionStream;
module.exports.DecompressionStream = DecompressionStream;