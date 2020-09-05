# NgxTranslateRouterScullyPlugin

This Scully plugin allow you to use NgxTranslateRouter into your Angular project.

[![npm version](https://badge.fury.io/js/%40gilsdav%2Fngx-translate-router-scully-plugin.svg)](https://badge.fury.io/js/%40gilsdav%2Fngx-translate-router-scully-plugin)

## Installation

```
npm install --save @gilsdav/ngx-translate-router-scully-plugin
```

## Usage

### Global configuration

First, import the `registerNgxTranslateRouter` function into your Scully config file

```ts
import { registerNgxTranslateRouter } from '@gilsdav/ngx-translate-router-scully-plugin';
```

Now register the plugin by calling this function giving your different language files

```ts
registerNgxTranslateRouter({
  langs: {
    en: './src/assets/locales/en.json',
    fr: './src/assets/locales/fr.json'
  }
});
```

### Using router plugin

Your plugin has to set data.lang into the route.

For exemple if you use `contentFolder`, you have to set the metadata lang.

*`config file`*
```ts
routes: {
  '/blog/:slug': {
    type: 'contentFolder',
    slug: {
      folder: './blog'
    }
  }
}
```

*`my-article.md`*
```md
---
title: 'My article'
description: 'This is my first article'
published: true
keywords: first
lang: en
---
# My article

Hello you ! 
```
