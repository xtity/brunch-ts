var TypeScriptCompiler;

module.exports = TypeScriptCompiler = (function () {

    var exec    = require('child_process'),
        sysPath = require('path'),
        fs = require('fs');

    TypeScriptCompiler.prototype.brunchPlugin = true;
    TypeScriptCompiler.prototype.type = 'javascript';
    TypeScriptCompiler.prototype.extension = 'ts';
    TypeScriptCompiler.prototype.pattern = /\.ts(x)?$/;

    function TypeScriptCompiler(config) {
        this.config = config;
    }

    TypeScriptCompiler.prototype.compile = function (params, callback) {
        var opt = (
            typeof this.config.plugins.brunchTypescript === 'undefined' ?
            {} :
            this.config.plugins.brunchTypescript
        );
        
        var cmd = [
            sysPath.join(__dirname) + '/../.bin/tsc ' + params.path
        ];
        
        // Initialize options as a string
        if (typeof opt.tscOption === 'undefined') {
            opt.tscOption = '';
        }

        // Add support for React JSX files by default
        if (opt.tscOption.indexOf('--jsx') < 0) {
            cmd.push('--jsx react');
        }

        cmd.push(opt.tscOption);

        var child = exec.exec(cmd.join(' '), function (error, stdout, stderr) {
            if (error) { // TODO 設定からエラーで止めるか指定
                return callback(error + "\n" + stdout + "\n" + stderr, params);
            }

            outputFile = params.path.replace(/\.[^/.]+$/, ".js");
            fs.readFile(outputFile, 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                }
                params.data = data;
				// TODO 設定からJSファイル削除指定
                fs.unlink(outputFile);
                return callback(err, params);
            });
        });
        
    }

    return TypeScriptCompiler;

})();
