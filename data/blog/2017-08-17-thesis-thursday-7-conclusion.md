---
title: Thesis Thursday 7 - Conclusion
author: Timothy Lin
date: '2017-08-17'
tags: ['Thesis Thursday', 'R', 'Stata']
summary: The last installment of the Thesis Thursday series - some miscellaneous thoughts and lessons learnt over the past few months
---

Finally, the last installment of the Thesis Thursday series! Rather than going through what I have done since the previous post (basically more refinements and robustness checks), I have decided to share some miscellaneous thoughts and lessons learnt over the past few months. The completed [research paper](/static/files/mig_cons_paper.pdf) and [accompanying slides](/static/mig_cons_slides/index.html) can be downloaded from my website.

### On R and Stata

I decided to code the entire project in R this time round and I have to say that I am quite won over by the capabilities of the various packages.

Features that I like:

- Graphing capabilities. Ggplot2 offers great default graphics, not to mention the numerous other add-ons and mapping tools (plotly, ggally, htmlwidgets, choroplethr, tmap).

- Superior workflow. I can code in R, write a report in R markdown, produce tables in both html and tex, pull together a series of slides using ioslides/slidfy and blog in the same interface. The only time I moved out of Rstudio was when I was writing up my paper (Latex), though bookdown is an attractive alternative.

- Pipe syntax. I used to dislike it but I noticed that I have been using it quite often over the past few months. It does help reduce clutter but requires a certain frame of mind to read the syntax (Think of it as water flowing through a pipe).

- Dplyr. Greatly speeds up the time it takes to do simple data manipulation compared to base R commands and replicates egen type commands in Stata.

- Free

Nonetheless, Stata still has certain advantages:

- Help manual. Stata's help files are the best, comprehensive with examples. Unfortunately, some R packages, being user written, are not as helpful. Stackoverflow and google make it much better though.

- Syntax. I still find Stata's syntax more direct and intuitive. A problem with the many user written commands in R is that everyone tries to come up with new names for functions, many of which are not the most intuitive.

- Reshape. Reshape2 does not allow one to change multiple variables from long to wide. One can use reshape from the data.table package but I find it a hassle to use another package to do an elementary task.

- Speed. Stata is much faster at reading and processing large datasets on memory.

- Econometric tools. This is a major selling point of Stata and is where it still holds a comparative advantage. Recently developed tools in applied econometrics are introduced in Stata over R (e.g. ivreg2). By default, Stata commands normally come with the option of weights and different standard errors. To implement these features in R normally require an additional package and some clunky syntax.

### Misc thoughts

- More data is not necessary better.

  - When working with shapefiles, try to find the simplest one that gives you the necessary detail. Any more is just a waste of memory and a waste of time to compress it down.

  - There isn't much point using micro level data when working at the broader aggregate level. Just take the mean and use the number of observation as weights. The regression results will be the same but much faster to compute.

- On a similar note, work with a small sample before running the code on the entire dataset.

- For complex text manipulation, use regex. Most helpful guide which I constantly refer to comes from a [UBC stat's class.](http://stat545.com/block022_regular-expression.html)

- While ggcounty and choroplethr make mapping of U.S. states and counties a relatively simple task, it is worth learning to work with shapefiles. Doing it manually also made me realise how much of an art mapping is and the arbitrariness from the different projection systems.

- More RAM is better. It's hard to go back to 4GB once you are used to 64GB.
