interface IOptions {
    entry: string;
    imageType: Array<string>;
    sharpType: Array<string>;
    outDir: string;
    compileTime: string;
}
export default function main(options?: IOptions | unknown): {
    name: string;
    enforce: string;
    closeBundle(): void;
};
export {};
