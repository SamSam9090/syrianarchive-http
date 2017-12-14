import {each} from 'lodash/fp';


// Remove surrounding p tags from images in article.
const nodes = document.body.querySelectorAll('article p img');

each(node => {
  const pn = node.parentNode;
  if (pn.childNodes.length === 1) {
    pn.replaceWith(...pn.childNodes);
  }
})(nodes);
