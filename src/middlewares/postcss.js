import postcss from 'postcss';
import fs from 'node:fs';

const processCSS = async (filePath) => {
  const css = fs.readFileSync(filePath, 'utf8');
  const result = await postcss()
    .use(require('tailwindcss'))
    .use(require('autoprefixer'))
    .use(require('cssnano')({
      preset: 'default',
    }))
    .process(css, {
      from: filePath,
      map: { inline: false }
    });
  return result.css;
};

module.exports = { processCSS };
