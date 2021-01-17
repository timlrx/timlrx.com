---
title: Speeding up R Plotly web apps - R x Javascript
author: Timothy Lin
date: '2019-12-17'
tags: ['notes', 'javascript', 'r', 'visualisation', 'Dashboard']
summary: Tips and tricks to speed up R and plotly based web apps
---

Back to blogging! Sorry for the long hiatus, had some personal projects which kept me really occupied over the past few months. Hope to share about them one of these days and potentially even explore open sourcing parts of them but the idea of this post is to transfer some of my learnings over the past year to an issue in R that always irritated me - slow loading webapps. Over the past year, I picked up quite a bit of javascript skills that I think it is fair to say makes me a full stack data scientist.

**What is javascript?** Javascript is the programming language that powers the web. That means all interactive web based visualizations such as the D3 framework, plotly, highcharts and even R shiny are all based in javascript.

**Why javascript?** I get this question too frequently from other data science candidates I interview, but in short I feel that there is a big gulf between analysis and actually producing useful output. Sure, shiny, tableau and other BI tools has made data visualization much more accessible but I think there are many other small gaps that are not served by existing tools. Knowing javascript has given me the ability to fully control the development of any data science project from conception to execution :)

## Speeding up R plotly web apps

Now let's take that javascript knowledge back to R and apply some tricks to speed up our R visualization dashboard built on plotly and flexdashboard. I like plotly as a visualization library - it's interactive and beautiful. To make it even better, you can easily convert a static ggplot image to an interactive visualization using the `ggplotly()` function. The only downside is that it seems to take quite long to load. Let's investigate and see what's the issue. I will use my [sg-dashboard](/dashboard/sg-dashboard.html) as a guide.

Side story, I was wondering why there were so few viewers for my posts which featured plotly interactive graphs compared to the rest of my blog. After some digging, I realise that it takes quite a bit longer to load than most other pages which makes it both user and search engine unfriendly. I considered switching to other smaller packages but in the end found some tricks to reduce the bundle size.^[I guess that shows R's main focus as an internal data science tool rather than to deliver analytics through the web.] I am sure the techniques featured would be useful for other htmlwidgets with relatively large javascript bundles as well.^[See the bonus section on using a CDN]

When it comes to debugging web applications, chrome devtools (F12) is our best friend. Here's what my local dashboard html file looks like:

![](/static/img/r_js/part1_devtools1.PNG)

We can see that the html file is 3.5MB big! It takes only 200ms to load as it is from my local computer but having to move a 3.5MB file across the internet might take a few seconds. Why is the file so big? This is explained by the `self_contained` argument in flex dashboard:

> Produce a standalone HTML file with no external dependencies, using data:
> URIs to incorporate the contents of linked scripts, stylesheets, images, and
> videos.

A lot of the output in R, such as htmlwidgets, are built primarly for internal sharing purposes. Hence, they package all the html, css, js dependencies in a single file which makes sharing the widget or dashboard relatively easy email. However, this obscures the reason for the file bloat so let's turn off self_contained mode. Another small optimization we can do is to disable mathjax since we are only using simple graphs with no math symbols. Here's how our flexdashboard config looks like:

```r
title: "SG-Dashboard"
output:
  flexdashboard::flex_dashboard:
    orientation: rows
    vertical_layout: scroll
    mathjax: NULL
    self_contained: FALSE
```

We can knit the file again. This time it produces a folder with the seperate javascript dependencies. You should see the bootstrap theme, jquery and of course plotly which takes up 3.1MB! The number of graphs you plot or the type of graphs you use does not affect the bundle size - the whole plotly package is loaded. So this means that even though we are only using bar and line charts, the scripts for drawing maps, 3D graphs, heatmaps etc. are all being loaded.

Thankfully, that's a way around this that is already built into R plotly. Since v1.39.0, partial bundles are available^[https://github.com/plotly/plotly.js/tree/master/dist]. To use this, we just need to pass our plotly object to the partial_bundle function:

```r
ggplotly(graph) %>%
  partial_bundle()
```

This gives us a 70% reduction in loading time since the minified size of the basic bundle is about 850kB. The only other thing to note is that you have to apply this to all your plotly graphs.^[Also as mentioned in the documentation: "WARNING: use this function with caution when rendering multiple plotly graphs on a single website. That's because, if multiple plotly.js bundles are used, the most recent bundle will override the other bundles."]

If you check out [plotly's github page](https://github.com/plotly/plotly.js/tree/master/dist), you might have noticed that the basic bundle is 277kB minified + gzip. How are we able to get that further size reduction? That's the job of our web hosting service (Netlify in my case), who would serve the file in a compressed form. Let's take a look at chrome dev tools once again:

![](/static/img/r_js/part1_devtools2.PNG)

The bar at the bottom shows that now 418kB of content was pushed to us. That's the minified size. 1.3MB refers to the unminified size.

That's it, we are done and our dashboard is now around 3 times faster 👏👏👏

## Bonus

Another possibility is to use a CDN to serve the javascript assets. Perhaps we do not have a good hosting service^[Check out netlify - it's great!] or we just want to leverage on a popular CDN to cache common web packages that are frequently used by the users.

Here's how to do it. It's quite a hack but it's an interesting exploration of how javascript dependencies are stored in an R object. Let's explore the insides of a plotly object.

```r
library(ggplot2)
library(plotly)

p <- qplot(mpg, wt, data = mtcars) %>%
  ggplotly() %>%
  partial_bundle()

ls(p)
```

```
## [1] "dependencies"  "elementId"     "height"        "jsHooks"
## [5] "preRenderHook" "sizingPolicy"  "width"         "x"
```

We see an interesting 'dependencies' object as part of plotly. Let's take a look at one of the dependencies:

```r
p$dependencies[[5]]
```

```
## List of 10
##  $ name      : chr "plotly-htmlwidgets-css"
##  $ version   : chr "1.52.2"
##  $ src       :List of 1
##   ..$ file: chr "htmlwidgets/lib/plotlyjs"
##  $ meta      : NULL
##  $ script    : NULL
##  $ stylesheet: chr "plotly-htmlwidgets.css"
##  $ head      : NULL
##  $ attachment: NULL
##  $ package   : chr "plotly"
##  $ all_files : logi FALSE
##  - attr(*, "class")= chr "html_dependency"
```

We found the plotly dependency. It references both a web source as well as local file source but unfortunately will crash with a "path for html_dependency not provided" error when we try to knit it. This is an irritating bug documented here: https://github.com/rstudio/rmarkdown/issues/794. We need to fix it manually and pass a CDN reference to it. Here's a script that does that:^[This was inspired by https://github.com/ramnathv/htmlwidgets/issues/79]

```r
plotly_mod_dep = function(p){
  deps <- p$dependencies
  deps_urls <- purrr::map(
    deps,
    ~if(.x$name == "plotly-basic") {
      .x$src = list(file=getwd())
      .x$script = "plotly-redirect-cdn-1.39.2.js"
      .x
    } else {
      .x
    }
  )
  p$dependencies <- deps_urls
  p
}
```

The `plotly-redirect-cdn-1.39.2.js` file is a simple one-liner:

```js
document.write(
  '<script src="https://cdn.plot.ly/plotly-basic-1.39.2.min.js" type="text/javascript"></script>'
)
```

We can modify our function to the following:

```r
p <- qplot(mpg, wt, data = mtcars) %>%
  ggplotly %>%
  partial_bundle(local = FALSE) %>%
  plotly_mod_dep()
```

And now our content is delivered by plotly's CDN!

That's it for this blog post. Hope you find some useful tricks to speed up your R plotly load times! Check back soon for the next installment of R X Javascript tricks and tips.
