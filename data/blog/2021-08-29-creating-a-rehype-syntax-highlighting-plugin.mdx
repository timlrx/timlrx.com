---
title: Creating a Rehype Syntax Highlighting Plugin
date: '2021-08-29'
tags: ['mdx', 'javascript', 'markdown', 'notes']
draft: false
summary: An exploration of markdown and HTML syntax trees. Documenting my experience creating rehype-prism-plus, a syntax highlighting plugin that creates pretty code blocks.
images: ['/static/img/rehype-syntax-highlighting-cover.png']
layout: PostLayout
---

<TOCInline toc={props.toc} asDisclosure toHeading={2} />

## Introduction and motivation

I have been working on improving my [blog template](https://github.com/timlrx/tailwind-nextjs-starter-blog) over the past few months.
One of the key features of the template is that it supports parsing markdown and mdx files into HTML blog posts.
^[I use markdown and mdx interchangeably in the rest of the post, and for the purposes of this code highlighting example there is little differences.]

This is courtesy of the [unifiedjs](https://github.com/unifiedjs/unified) ecosystem which contains a variety of tools to parse markdown files,
augment them with additional meta information and render them to HTML. This makes it really easy to parse a file to support
[github flavour markdown](https://github.com/remarkjs/remark-gfm), and do really cool things like automatically
adding [anchor links to header elements](https://github.com/rehypejs/rehype-autolink-headings).

However, I could not find a plugin that allows me to perform syntax highlighting of code blocks with features such as line numbers and line highlighting.
Hence, I decided to create one - [rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus).

This technical post documents my experience creating the syntax highlighter plugin and some things I learnt along the way.
If you prefer to dive right into the code, check out the plugin on [Github](https://github.com/timlrx/rehype-prism-plus/blob/v0.0.6/index.js).
^[This post refers to v0.0.6 of rehype-prism-plus and may not correspond to future versions of the package,
though the general principles and approach outlined in the post should still hold.]

## Requirements

My requirements are as follows:

- No client-side javascript, i.e. server-side plugin
- Syntax-highlighting
- Optional line numbers
- Optional line highlighting
- Renders as text, rather than an image
- Framework agnostic

## Prior art

There are lots of syntax highlighting packages available, so let's briefly go through them and why they were not suitable for my use case:

- [Prismjs](https://prismjs.com/), the original syntax highlighter - if you don't mind client side js, this is definitely the one to consider. It supports multiple plugins including line highlighting and line numbers
- [Prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer), a React solution to using prismjs on the client side
- [Carbon.now.sh](https://carbon.now.sh/), pretty code blocks which you can export as an image but hard to incorporate in a website and it's a web app rather than a library which I can use directly in my blog
- [Mapbox rehype-prism](https://github.com/mapbox/rehype-prism), the original plugin which I was using but it lacks line numbers and line highlighting
- [Gatsby-remark-prismjs](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-prismjs), has all the necessary features but it's tightly coupled to Gatsbyjs. I feel that an ideal markdown plugin should be indepedently of any web framework.

In the end, I modified Mapbox rehype-prism and borrowed a few ideas from [Pedro Duarte](https://ped.ro/blog/code-blocks-but-better) and the Gatsbyjs plugin.

The code blocks on my website support additional features like title headers and a copy code button.
If you are interested to know how those are created and pick up more remark-rehype wizardry, check out the source code in the template.^[Implementation of
[title headers](https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/master/lib/remark-code-title.js) and
[copy code button](https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/master/components/Pre.js)]

The new plugin solves the harder challenge of creating optional line numbers and line highlighting which I shall go through in the rest of the post.

## Parsing markdown code blocks

Our intended objective is to parse and transform a code block written in markdown like this:

````
```py {5-6, 8} showLineNumbers
def factorial(x):
    """This is a recursive function
    to find the factorial of an integer"""

    if x == 1:
        return 1
    else:
        return (x * factorial(x-1))
```
````

to HTML which renders as follows:

```py {5-6, 8} showLineNumbers
def factorial(x):
    """This is a recursive function
    to find the factorial of an integer"""

    if x == 1:
        return 1
    else:
        return (x * factorial(x-1))
```

The steps could be further broken into the following sequences:

1. Parse markdown file to markdown syntax tree
2. Transform markdown syntax tree to HTML syntax tree
3. Process HTML to add the desired functionalities
4. Output as HTML file

Thankfully, the hard work is done by [Xdm](https://github.com/wooorm/xdm), a MDX compiler does all the heavy lifting from steps 1 to 4 and more,
by combining multiple core packages within the unifiedjs ecosystem, including [remark](https://github.com/remarkjs/remark), which parses and processes markdown
and [rehype](https://github.com/rehypejs/rehype) which parses and processes HTML.^[It is also framework agnostic and works with the likes of React, Preact and Vue!]

What we need to do, is to modify step 3 in the sequences of steps and work out the logic to augment code blocks with our desired features.

We do this by creating a rehype plugin.

## Introducing rehype

Rehype consists of two main parts, a [parser](https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse) that converts HTML documents
to syntax trees and [rehype-stringify](https://github.com/rehypejs/rehype/tree/main/packages/rehype-stringify) which goes the other direction.

It's worth taking a look at the [typings of the HTML syntax tree (hast)](https://github.com/syntax-tree/hast#nodes) to understand what we are working
with and looking to transform.

Unifiedjs comes with a variety of libraries to help operate on abstract syntax trees (ASTs). One of which is `unist-util-visit`, which visits nodes in a tree.
We can log the output of the syntax tree before any transformation to see what we are working on:

```js
;() => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      console.log(node)
    })
  }
}
```

Here's the output snippet:

```js
{
  type: 'element',
  tagName: 'pre',
  properties: {},
  children: [
    {
      type: 'element',
      tagName: 'code',
      properties: { className: [ 'language-py' ] },
      children: [
        {
          type: 'text',
          value: 'def factorial(x):\n' +
            '    """This is a recursive function\n' +
            '    to find the factorial of an integer"""\n' +
            '\n' +
            '    if x == 1:\n' +
            '        return 1\n' +
            '    else:\n' +
            '        return (x * factorial(x-1))\n'
        }
      ],
      position: {
        start: { line: 11, column: 1, offset: 242 },
        end: { line: 20, column: 4, offset: 452 }
      },
      data: { meta: '{5-6, 8} showLineNumbers' }
    }
  ],
  position: {
    start: { line: 11, column: 1, offset: 242 },
    end: { line: 20, column: 4, offset: 452 }
  }
}
```

Remark and rehype parses the markdown into a `code` block nested in a `pre` block. It also tags the `code` block with the language which we assigned
as a className property: `language-py`. The innermost block consists of the code in text form. This is returned with positional information
which corresponds to the line in the markdown file which it belongs to, and additional metadata information - `{5-6, 8} showLineNumbers`.

We now need to operate on this code block text element and add our required functionalities as className tags or as a modified AST.

## Syntax highlighting with prismjs and refractor

The [refractor](https://github.com/wooorm/refractor) package brings prismjs syntax highlighting capabilities to the unifiedjs / rehype world.
This is also used by `mapbox/rehype-prism` plugin which visits the `pre` and `code` blocks and replaces the text node with
the AST returned after running `refractor.highlight` on the code block.

Here's a condensed version of what the code looks like:

```js
visit(tree, 'element', (node, index, parent) => {
  if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
    return
  }
  const lang = getLanguage(node)
  result = refractor.highlight(toString(node), lang)
  node.children = result
})
```

Running the line `if x == 1:` through `refractor` would return the following AST:

```js
{
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'span',
      properties: { className: [ 'token', 'keyword' ] },
      children: [ { type: 'text', value: 'if' } ]
    },
    { type: 'text', value: ' x ' },
    {
      type: 'element',
      tagName: 'span',
      properties: { className: [ 'token', 'operator' ] },
      children: [ { type: 'text', value: '==' } ]
    },
    { type: 'text', value: ' ' },
    {
      type: 'element',
      tagName: 'span',
      properties: { className: [ 'token', 'number' ] },
      children: [ { type: 'text', value: '1' } ]
    },
    {
      type: 'element',
      tagName: 'span',
      properties: { className: [ 'token', 'punctuation' ] },
      children: [ { type: 'text', value: ':' } ]
    }
  ]
}
```

This solves the main issue of syntax highlighting and we can add a stylesheet to style the lines based on the generated class names.

## Adding line numbers and line highlighting

To support line numbers and line highlighting, we need to parse the metadata field and add it to the AST. The initial naive approach which I implemented
involves splitting the code text by the newline character, `\n`, wrapping each line in its own `div` and checking if a line should be tagged as a highlighted line.
This can be done with a higher order function that determines whether a given index should be highlighted:

```js
const calculateLinesToHighlight = (meta) => {
  const RE = /{([\d,-]+)}/
  // Remove space between {} e.g. {1, 3}
  const parsedMeta = meta
    .split(',')
    .map((str) => str.trim())
    .join()
  if (RE.test(parsedMeta)) {
    const strlineNumbers = RE.exec(parsedMeta)[1]
    const lineNumbers = rangeParser(strlineNumbers)
    return (index) => lineNumbers.includes(index + 1)
  } else {
    return () => false
  }
}
```

We run `refractor` on each line and assign it as the node content.

One approach to adding a line number would be to insert it as a text node. However, that is fairly complicated and muddles the rest of the code.
The approach that I opted for was to add it as a property of the node e.g. `line`, which can then be displayed with the following CSS code:

```css
.line-number::before {
  content: attr(line);
}
```

While relatively simple to implement, this approach of styling lines individually quickly ran into a wall when it was unable to parse multiple
lines of code correctly e.g. python doc strings or jsdoc comments.

Key lesson: **Parsing of code is context dependent and not indepedent across lines**.

## Traversing and transforming the syntax tree

What we actually need to do is traverse the AST, group neighbouring child nodes together and split them as a new parent node if we encounter a newline character.
On top of that, we have to copy the parent classNames to preserve the styles. This makes it a pretty difficult problem to solve, since token nodes could be nested
at arbitrary depths e.g. a html file with a script tag and comments, and there could be multiple newline characters in a single text node.

After googling for some solutions, I chanced upon Pedro Duarte's [post](https://ped.ro/blog/code-blocks-but-better) which presented a rather simple solution
to the problem. We can use `rehype` to convert the current HTML AST into HTML and parse it again with `rehype-parse`.
This would return the positional information of each node (start and end line), which we can split into separate text nodes.

As implemented in `rehype-prism-plus`:

```js
refractorRoot = refractor.highlight(toString(node), lang)
refractorRoot = getNodePosition(refractorRoot)
refractorRoot.children = splitTextByLine(refractorRoot.children)
```

Here's the function to get node positions:

```js
const getNodePosition = (ast) => {
  const html = toHtml(ast)
  const hast = unified().use(parse, { emitParseErrors: true, fragment: true }).parse(html)
  return hast
}
```

And here's the reducer which walks through the nodes and split multi-line nodes into individual node components:

```js
const splitTextByLine = (ast) => {
  return ast.reduce((result, node) => {
    if (node.type === 'text') {
      if (node.value.indexOf('\n') === -1) {
        result.push(node)
        return result
      }

      const lines = node.value.split('\n')
      for (const [i, line] of lines.entries()) {
        result.push({
          type: 'text',
          value: i === lines.length - 1 ? line : line + '\n',
          position: {
            start: { line: node.position.start.line + i },
            end: { line: node.position.start.line + i },
          },
        })
      }

      return result
    }

    if (node.children) {
      node.children = splitTextByLine(node.children)
      result.push(node)
      return result
    }

    result.push(node)
    return result
  }, [])
}
```

The rest of the code then iterates through each code line and assigns the relevant nodes of the AST to it.
A node is "relevant" if the start and end positions include the particular line of interest.

To implement this, we use the `filter` function from `unist-util-filter` to filter the AST to meet the requirements as specified above.
The final part of the code, with the filtering function on lines 15-18 highlighted, is as follows:

```js {15-18} showLineNumbers
for (const [i, line] of codeLineArray.entries()) {
  // Code lines
  if (meta.toLowerCase().includes('showLineNumbers'.toLowerCase()) || options.showLineNumbers) {
    line.properties.line = [(i + 1).toString()]
    line.properties.className = [`${line.properties.className} line-number`]
  }

  // Line highlight
  if (shouldHighlightLine(i)) {
    line.properties.className = [`${line.properties.className} highlight-line`]
  }

  // Syntax highlight
  if (lang && line.children && !langError) {
    const treeExtract = filter(
      refractorRoot,
      (node) => node.position.start.line <= i + 1 && node.position.end.line >= i + 1
    )
    line.children = treeExtract.children
  }
}
```

## Wrapping up

[Rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus) implements all of the above and can be used as a rehype plugin to add additional
syntax-highlighting, line numbers and line highlighting capabilities to code blocks. A developer integrating the package would just need to add a
stylesheet with the desired styles to bring syntax highlighting to live.

The approach outlined in this post allows us to parse on the server side, ship html with no javascript but still retain the full power and functionality
of syntax highlighting. This makes it a perfect solution for static websites like blogs, tutorials and documentation pages.
