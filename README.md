# vite-plugin-images-sharp 

一个把png,jpg图片转换成webp和avif格式的vite插件

## 用法

```bash
npm install vite-plugin-images-sharp -D
```

```javascript
import imagesSharp from 'vite-plugin-images-sharp';

export default defineConfig({
  plugins: [
      imagesSharp({
          entry: resolve(__dirname, './src/public/images'),  //入口目录
          outDir: resolve(__dirname, './artifact/images'),  //输入目录
      })
  ]
});
```

## 配置

```javascript
{
        entry: '', //入口
        imageType: ['.png', '.jpg'], // 处理图片类型
        sharpType: ['webp'], //生成的格式
        outDir: '', //输出目录
        compileTime: 'after', //编译时机  编译前：before   编译后：after
}
```


