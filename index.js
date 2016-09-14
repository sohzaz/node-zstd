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
            self.push(null);
            callback(err);
        });
        proc.stdin.write(chunk);
        proc.stdin.end();
    }

    _flush() {
        this.push(null);
    }
}

class DecompressionStream extends Transform {
    constructor(options) {
        super(options);
        this.proc = cp.spawn('zstd', ['-c','-d', '-']);
        var self = this;
        this.proc.stdout.on('data', (data) => {
            self.push(data);
        });
        this.proc.on('exit', () => {
            self.push(null);
        });
    }
    _transform(chunk, encoding, callback) {
        this.proc.stderr.on('error', (err) => {
            self.push(null);
            callback(err);
        });
        this.proc.stdin.write(chunk);
        callback();
    }

    _flush() {
        this.proc.stdin.end();
    }
}

module.exports.CompressionStream = CompressionStream;
module.exports.DecompressionStream = DecompressionStream;