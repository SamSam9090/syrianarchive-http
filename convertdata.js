import Metalsmith from 'metalsmith';
import collections from 'metalsmith-collections';
// import layouts from 'metalsmith-layouts';
import markdown from 'metalsmith-markdown';
// import permalinks from 'metalsmith-permalinks';
import multiLanguage from 'metalsmith-multi-language';
import {each, merge, keys, concat, map, compact} from 'lodash';
import filetree from 'metalsmith-filetree';

import nunjucks from 'nunjucks';

import t from './translations';

const lo = (u, l) => u.replace(/^.{3}/g, `/${l}/`);

const nun = new nunjucks.Environment(new nunjucks.FileSystemLoader('layouts'));

nun.addFilter('t', t);
nun.addFilter('l', lo);

const LOCALES = { default: 'en', locales: ['en', 'ar'] };

Metalsmith(__dirname)
  .metadata({
    sitename: 'My Static Site & Blog',
    siteurl: 'http://example.com/',
    description: 'Its about saying »Hello« to the world.',
    generatorname: 'Metalsmith',
    generatorurl: 'http://metalsmith.io/',
  })
  .source('./Pages')
  .destination('./dist')
  .clean(true)
  .use(multiLanguage(LOCALES))
  .use(markdown())
  .use((f, m, d) => {
    each(f, (v, k) => {
      if (k.includes('html')) {
        k = k.replace('.html', '') // eslint-disable-line
        if (k === 'ar/index') {
          k = 'index_ar'; //eslint-disable-line
          f[`${k}.html`] = merge({}, v); // eslint-disable-line
          delete f['ar/index.html']; // eslint-disable-line
        }
        if ((!f[`${k}_ar.html`] && !k.includes('_ar'))) {
          f[`${k}_ar.html`] = merge({}, v); // eslint-disable-line
          f[`${k}_ar.html`].locale = 'ar'; // eslint-disable-line
        }
      }
    });
    d();
  })
  .use(collections({
    posts: 'investigations/*.html'
  }))
  .use((f, m, d) => {
    each(f, (v, k) => {
      if (k.includes('html')) {
        delete f[k]; // eslint-disable-line
        let p = `${v.locale}/${v.path}`; // eslint-disable-line
        p = p.replace('.md', '.html') // eslint-disable-line
        p = p.replace('_ar', '') // eslint-disable-line
        v.url = p.replace('index.html', ''); // eslint-disable-line
        f[p] = v; // eslint-disable-line
      }
    });

    d();
  })
  .use(filetree({
    pattern: ':title'
  }))
  .use((f, m, d) => {
    const md = m['_metadata'].fileTree.path; // eslint-disable-line
    each(f, (v, k) => {
      if (k.includes('html')) {
        const ppath = `/${k.replace(/[^\/]*$/, '').slice(0, -1)}`; //eslint-disable-line
        const ft = md[ppath];

        const ff = concat([], ft.files);
        each(ft.children, c => {
          const b2f = `${c.path.substring(1)}/index.html`;
          ff.push(f[b2f]);
        });
        v.siblings = compact(ff); //eslint-disable-line
        console.log(v);
        console.log(map(v.siblings, s => s.path));
        console.log('-----------------d');
      }
    });
    d();
  })
  .use((f, m, d) => {
    console.log(keys(f));
    console.log('--------------------------------');
    each(f, (v, k) => {
      if (k.includes('html')) {
        console.log(k);
        console.log(v.layout);
        const deets = Object.assign({}, m['_metadata'], v); // eslint-disable-line
        let rs = nun.render(v.layout, deets);
        rs = rs.replace('.md', '.html');
        f[k].contents = new Buffer(rs); // eslint-disable-line
      }
    });
    console.log(keys(f));
    d();
  })
  .build((err) => {      // build process
    console.log(err);
    if (err) throw err;       // error handling is required
  });
