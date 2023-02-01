import { handle } from './handle';
import { name  } from '../package.json';
interface IOptions {
    entry: string;
    imageType: Array<string>;
    sharpType: Array<string>;
    outDir: string;
    compileTime: string;
}

export default function main(options: IOptions | unknown = {}) {
    const customOpts: IOptions = {
        entry: '', //入口
        imageType: ['.png', '.jpg'], // 处理图片类型
        sharpType: ['webp'], //生成的格式
        outDir: '', //输出目录
        compileTime: 'after', //编译时机  编译前：before   编译后：after
    };
    const opts: IOptions = Object.assign(customOpts, options);
    if (opts.compileTime === 'before') {
        handle(opts);
    }

    return {
        name,
        enforce: 'post',
        closeBundle() {
            if (opts.compileTime === 'after') {
                handle(opts);
                console.info('编译结束');
            }
        },
    };
}
