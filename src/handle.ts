
import fs from 'fs';
import path from 'path';
import helper from './helper';
import sharpImg from './sharpImg';
function createWebp(dir: string, options: any) {
    if (fs.existsSync(dir) === false) {
        return;
    }
    const { imageType, entry, outDir, sharpType } = options;
    const files = fs.readdirSync(dir);
    files.forEach((v) => {
        const abs = path.join(dir, v);
        if (helper.isDirectory(abs)) {
            createWebp(abs, options);
        } else if (helper.isTargetImage(abs, imageType)) {
            if (Array.isArray(sharpType)) {
                sharpType.forEach((type) => {
                    //全局路径
                    const nPath = helper.getWebpPath(abs, entry, outDir, type);
                    sharpImg(abs, nPath, type);
                });
            } else {
                console.error('sharpType需为数组');
            }
        }
    });
}
export const handle = (options: any) => {
    const { entry } = options;
    const arr = helper.toArray(entry);
    for (let i = 0; i < arr.length; i++) {
        const dir: string = arr[i];
        createWebp(dir, options);
    }
};
