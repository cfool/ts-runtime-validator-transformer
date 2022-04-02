## 安装
```
npm i ts-runtime-validator-transformer
OR
yarn add ts-runtime-validator-transformer
```
## 快速开始
使用该库进行运行时编译主要包含两个步骤。1、代码中添加校验代码 2、构建工具中添加自定义Transformer
### 添加校验代码
```typescript
import { trvalidate } from 'ts-runtime-validator-transformer';

const r = trvalidate<string>(1) // trvalidate<T>(v: any), T为校验目标类型, v为校验值

console.log(r)
```

### 修改构建工具
需要给ts的编译过程增加自定义transformer。主要分以下两种场景。
#### 1、采用tsc编译

由于`tsc`不支持自定义transformer，我们需要换用`ttypescript`来进行编译。安装`ttypescript`后，使用`ttsc`替换编译脚本中的`tsc`命令。

```
// 安装ttypescript
npm i ttypescript -D
OR
yarn add ttypescript -D

// 修改tsconfig.json
{
  "compilerOptions": {
    ...,
    "plugins": [
      { "transform": "ts-runtime-validator-transformer" }
    ]
  }
}

// 编译代码
npx ttsc
```

#### 2、采用webpack, ts-loader编译
webpack的ts-loader支持配置自定义transformer。参考配置修改如下
```
// webpack.config.js
import { createTransformer } from 'ts-runtime-validator-transformer'

module.export = {
  ...,
  module: {
    rules: [
      ...,
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          ... // other loader's options
          getCustomTransformers: (program) => ({ before: [ createTransformer(program) ] })
        }
      }
    ]
  }
}
```