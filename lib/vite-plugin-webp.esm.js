/*!
 * vite-plugin-webp v1.1.1
 * (c) Wed Feb 01 2023 14:08:16 GMT+0800 (China Standard Time) luchuanqi
 * Released under the MIT License.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

function toArray(data) {
    if (typeof data === 'string') {
        return data ? [data] : [];
    }
    return data;
}
function isDirectory(path) {
    return fs.statSync(path).isDirectory();
}
function evalCatch(data) {
    try {
        // @ts-ignore
        return window.eval(data);
    }
    catch (_) {
        return data;
    }
}
function isTargetImage(id, imageType) {
    const arr = evalCatch(id).split('.');
    const suffix = arr[arr.length - 1];
    return imageType.includes(`.${suffix}`);
}
function getWebpPath(id, entry, outDir, type) {
    const arr = id.split('.');
    const suffix = arr[arr.length - 1];
    const reg = new RegExp(`${suffix}$`);
    const reg2 = new RegExp(`${entry}`, 'g');
    return id.replace(reg, type).replace(reg2, outDir);
}
var helper = {
    toArray,
    isDirectory,
    evalCatch,
    isTargetImage,
    getWebpPath,
};

const resizeReg = /\D+(\d+)[xX*](\d+)\.webp$/;
const sharpImg = (absPath, nPath, type) => {
    let width = null;
    let height = null;
    resizeReg.lastIndex = 0;
    if (resizeReg.test(nPath)) {
        width = Number(RegExp.$1);
        height = Number(RegExp.$2);
    }
    return new Promise((resolve, reject) => {
        if (type === 'avif') {
            try {
                sharp(absPath)
                    .resize({ width, height })
                    .avif()
                    .toFile(nPath, (err, info) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(info);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        }
        else {
            try {
                sharp(absPath)
                    .resize({ width, height })
                    .webp()
                    .toFile(nPath, (err, info) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(info);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        }
    });
};

function createWebp(dir, options) {
    if (fs.existsSync(dir) === false) {
        return;
    }
    const { imageType, entry, outDir, sharpType } = options;
    const files = fs.readdirSync(dir);
    files.forEach((v) => {
        const abs = path.join(dir, v);
        if (helper.isDirectory(abs)) {
            createWebp(abs, options);
        }
        else if (helper.isTargetImage(abs, imageType)) {
            if (Array.isArray(sharpType)) {
                sharpType.forEach((type) => {
                    const nPath = helper.getWebpPath(abs, entry, outDir, type);
                    console.log('生产');
                    console.log(nPath);
                    sharpImg(abs, nPath, type);
                });
            }
            else {
                console.error('sharpType需为数组');
            }
        }
    });
}
const webp = (options) => {
    const { entry } = options;
    const arr = helper.toArray(entry);
    for (let i = 0; i < arr.length; i++) {
        const dir = arr[i];
        createWebp(dir, options);
    }
};

function main(options = {}) {
    const customOpts = {
        entry: '',
        imageType: ['.png', '.jpg'],
        sharpType: ['webp'],
        outDir: '',
        compileTime: 'after', //编译时机  编译前：before   编译后：after
    };
    const opts = Object.assign(customOpts, options);
    if (opts.compileTime === 'before') {
        webp(opts);
    }
    return {
        name: 'vite-plugin-sharp',
        enforce: 'post',
        closeBundle() {
            if (opts.compileTime === 'after') {
                webp(opts);
                console.info('编译结束');
            }
        },
    };
}

export { main as default };
