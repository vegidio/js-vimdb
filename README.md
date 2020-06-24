# TypeScript (Template)

[![Actions](https://github.com/vegidio/template-typescript/workflows/test/badge.svg)](https://github.com/vegidio/template-typescript/actions)
[![MIT](https://img.shields.io/badge/license-MIT-blue)](https://choosealicense.com/licenses/mit/)

A template project for TypeScript with the usual scripts to **run**, **lint**, **build** and **test** the source code.

## 🤖 Usage

Clone the repository and in the project directory install its dependencies by running `yarn` in the terminal. Afterwards you can run the following scripts:

- `yarn build`: to create an app bundle. The entry point is the file `./src/index.ts` and the resolving binary will be saved in `./build/app.bundle.js`.
- `yarn lint`: to statically check the code with ESLint.
- `yarn start`: to execute the code. The entry point is the file `.src/index.ts`.
- `yarn test`: to run the tests specified in the folder `./test`.

## 🧩 Dependencies

This template depends on a few Node packages in order to work. All dependencies under the __devDependencies__ scope are mandatory; the most notable ones are:

- [eslint](https://www.npmjs.com/package/eslint): a tool for identifying and reporting problems in TypeScript code.
- [jest](https://www.npmjs.com/package/jest): a JavaScript test framework.
- [ts-node](https://www.npmjs.com/package/ts-node): a TypeScript execution environment.
- [typescript](https://www.npmjs.com/package/typescript): the TypeScript language support.
- [webpack](https://www.npmjs.com/package/webpack): a module bundler for JavaScript.

## 🗂 Directory Structure

This project follows the directory structure below:

```
[root]
  ├── build/
  ├── src/
  │   └── index.ts
  └── test/
```

where:

- `build/`: is the directory containing the binaries created by the project. This folder is auto-generated and you shouldn't manually put any file here.
- `src/`: is the directory where you will place the project code. The entry point of the project's execution is the file `index.ts`.
- `test/`: is the directory where you will place your test scripts.

### Important Files

- `.eslintrc`: ESLint configuration file; you can change the linting rules here.
- `jest.config.js`: Jest configuration file; you can change the test parameters here.
- `tsconfig.json`: TypeScript configuration file; you can change how TypeScript transpile the files here.
- `types.d.ts`: File where you create the definitions for the JS modules that don't have TypeScript support.
- `webpack.config.ts`: Webpack configuration file; you can change how the project bundle is created here.

## 📝 License

**TypeScript (Template)** is released under the MIT License. See [LICENSE](LICENSE.txt) for details.

## 👨🏾‍💻 Author

Vinicius Egidio ([vinicius.io](http://vinicius.io))