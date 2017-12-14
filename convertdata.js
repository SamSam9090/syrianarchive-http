import Metalsmith from 'metalsmith';
import collections from 'metalsmith-collections';
// import layouts from 'metalsmith-layouts';
import markdown from 'metalsmith-markdown';
// import permalinks from 'metalsmith-permalinks';
import multiLanguage from 'metalsmith-multi-language';
import {each, find, merge, omit, concat, compact, keys, filter} from 'lodash';
import filetree from 'metalsmith-filetree';

import nunjucks from 'nunjucks';

import t from './translations';

const lo = (u, l) => u.replace(/^.{3}/g, `/${l}/`);

const nun = new nunjucks.Environment(new nunjucks.FileSystemLoader('layouts'));

nun.addFilter('t', t);
nun.addFilter('l', lo);

nun.addFilter('split', function(str, seperator) {
    return str.split(seperator);
});

nun.addFilter('splitminuslast', function(str, seperator) {
    return str.split(seperator).slice(0, -1);
});


nun.addFilter('jointill', function(url, stop) {
    return `${url.substring(0, url.indexOf(stop))}${stop}`;
});

nun.addFilter('findtitle', function(url, siblings) {
  const bbb = find(siblings,
    s => 
      s.url === url ||
      s.url === `${url}.html` ||
      s.url === `${url}/` ||
      s.url === `${url}/index.html`
    );
  return bbb ? bbb.title : url;
});

const LOCALES = { default: 'en', locales: ['en', 'ar'] };

Metalsmith(__dirname)
  .metadata({
    sitename: 'Syrian Archive',
    siteurl: 'https://syrianarchive.org/',
    description: ' Preserving Documentation of Human rights Violations',
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
    investigations: 'investigations/*.html'
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
        console.log(ff);
        v.siblings = filter(compact(ff), gg => gg.path !== 'en/404.html'); //eslint-disable-line
        v.all = f;
      }
    });
    d();
  })
  .use((f, m, d) => {
    const newh = Object.assign({}, f['en/index.html'], {layout: 'roothomepage.html'});
    f['index.html'] = newh; // eslint-disable-line

    f['404.html'] = f['en/404.html']; // eslint-disable-line
    f = omit(f, ['en/404.html', 'ar/404.html']); // eslint-disable-line
    console.log(filter(keys(f), fff => fff.includes('404')));
    console.log('aaaaaaaaaaaa');

    f['ar/index.html'].latest = f['ar/investigations/index.html'].siblings; // eslint-disable-line
    f['en/index.html'].latest = f['en/investigations/index.html'].siblings; // eslint-disable-line
    f['index.html'].latest = f['en/investigations/index.html'].siblings; // eslint-disable-line

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


    d();
  })
  .build((err) => {      // build process
    console.log(err);
    if (err) throw err;       // error handling is required
  });
