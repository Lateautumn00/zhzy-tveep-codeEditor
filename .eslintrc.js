module.exports = {
  root: true,
  env: {
    node: true // 启动node环境
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    semi: 0,
    quotes: [2, 'single'], // 建议使用单引号
    'no-duplicate-case': 2,
    'no-irregular-whitespace': 2, // 不能有不规则的空格
    'no-mixed-spaces-and-tabs': [2, false], // 禁止混用tab和空格
    'array-bracket-spacing': [2, 'never'], // 是否允许非空数组里面有多余的空格
    'no-multi-spaces': 1, // 不能用多余的空格
    'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格
    'no-undef': 2, // 不能有未定义的变量
    'no-unreachable': 2, // 不能有无法执行的代码
    'no-unused-expressions': ["error", { "allowTernary": true }], // 禁止无用的表达式
    eqeqeq: 2, // 必须使用全等 2必须
    'no-eval': 1, // 禁止使用eval
    'no-unused-vars': [
      2,
      {
        vars: 'all',
        args: 'after-used'
      }
    ], // 不能有声明后未被使用的变量或参数
    'no-use-before-define': 0, // 未定义前不能使用
    'no-dupe-args': 2, // 函数参数不能重复
    strict: 2, // 使用严格模式
    'comma-dangle': [2, 'never'],
    indent: 0,
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    "vue/comment-directive": 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
