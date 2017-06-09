---
title: 'Thesis Thursday #2'
author: Timothy Lin
date: '2017-06-09'
slug: thesis-thursday-2
categories: []
tags: ["Thesis Thursday"]
subtitle: ''
---

Over the past week I made numerous detours and pursued various options that yielded little. On the positive side, I managed to merge and clean most of the datasets and started generating some descriptive statistics to get a better understanding of the data.

## Migration to the U.S.

Let us take a look at some of the migration patterns from 1970 to 2012.^[2012 data is from the 3 year ACS 1% sample.] I use the share of foreign born as surveyed in the decennial census and American Community Survey as a proxy for migration patterns.^[The list of countries are not consistent across the survey so aggregation is required to generate a consistent set of data for comparison.] Here are the geographical regions which experienced the largest increase in foreign-born share over this period:

<table style="text-align:center" width="500"><tr><td colspan="10" style="border-bottom: 1px solid black"></td></tr><tr><td style="text-align:left"></td><td>Place of Birth</td><td>1970</td><td>2012</td><td>Difference</td></tr>
<tr><td colspan="5" style="border-bottom: 1px solid black"></td></tr><tr><td style="text-align:left">1</td><td>Central America</td><td>0.07</td><td>1.02</td><td>0.95</td></tr>
<tr><td style="text-align:left">2</td><td>Carribean</td><td>0.34</td><td>1.26</td><td>0.91</td></tr>
<tr><td style="text-align:left">3</td><td>India</td><td>0.03</td><td>0.82</td><td>0.79</td></tr>
<tr><td style="text-align:left">4</td><td>South America</td><td>0.14</td><td>0.91</td><td>0.77</td></tr>
<tr><td style="text-align:left">5</td><td>China</td><td>0.10</td><td>0.74</td><td>0.64</td></tr>
<tr><td style="text-align:left">6</td><td>Philippines</td><td>0.10</td><td>0.63</td><td>0.52</td></tr>
<td colspan="10" style="border-bottom: 1px solid black"></td></tr></table><br>
  
The bottom 6 regions are tabled below:  

<table style="text-align:center" width="500"><tr><td colspan="5" style="border-bottom: 1px solid black"></td></tr><tr><td style="text-align:left"></td><td>Place of Birth</td><td>1970</td><td>2012</td><td>Difference</td></tr>
<tr><td colspan="5" style="border-bottom: 1px solid black"></td></tr>
<tr><td style="text-align:left">19</td><td>Eastern Europe</td><td>0.87</td><td>0.74</td><td>-0.14</td></tr>
<tr><td style="text-align:left">20</td><td>Germany</td><td>0.53</td><td>0.39</td><td>-0.14</td></tr>
<tr><td style="text-align:left">21</td><td>Uk-Ireland</td><td>0.52</td><td>0.32</td><td>-0.20</td></tr>
<tr><td style="text-align:left">22</td><td>North America</td><td>0.52</td><td>0.32</td><td>-0.20</td></tr>
<tr><td style="text-align:left">23</td><td>Italy</td><td>0.52</td><td>0.14</td><td>-0.38</td></tr>
<tr><td style="text-align:left">24</td><td>Local</td><td>94.15</td><td>85.64</td><td>-8.51</td></tr>
<tr><td colspan="5" style="border-bottom: 1px solid black"></td></tr></table><br>

There is some ambiguity over the choice of geographical aggregation which might affect the relative ordering but the underlying point can be seen quite clearly from the tables. The share of individuals born in the U.S. or from other European countries declined as individuals from Latin America and Asia migrated to the U.S. In fact this period captures the reverse in the rebound in foreign born share as captured in this graph, taken from [Abramitzky and Boustan (2016)](https://people.stanford.edu/ranabr/sites/default/files/abramitzky_boustan_jel.pdf)^[The paper provides a nice historical review on the the two eras of U.S. migration, the Age of Mass Migration from Europe (1850-1920) and the recent immigration flow documented above.], which plots foreign-born share through the years:

![Foreign_born_stock](/img/TT_foreign_born_stock.jpg)

The geographical dispersion of migrants is also worth a closer look. Here is a plot comparing the share of foreign-born in 1970 and 2012:

![1970_2012_comparison](/img/TT_maps.fb1970.2012.jpg)

The numerous missing values is due to data being censored if the population in the statistical unit being sampled falls below a certain size. Not surpringsly, a significant fraction of the population is concentrated along the cost and these are also the places with high share of foreign-born. The fraction of foreign-born has also increased almost across all regions.^[Each polygon corresponds to a fips code, which is used to identify states and counties in the U.S.]

Let us also take a look at the variation in settlement pattern by country of origin. Here I compare India against China in 2012:

![India_China_2012](/img/TT_maps.2012.India.China.jpg)

## Data issues

I still have not solve the tricky issue of mapping consumption data to immigration flows. After cleaning the consumer panel data I was a disappointed by the level of detail it contains on fresh produce. While it has extensive documentation on brand data, the actual nature of the product is also not exactly clear (e.g. oriental noodles). I gave the idea of using restaurant data further consideration but eventually decided against it as I do not think the question is of economic interest.^[Sure, one would expect a correlation but what does that mean? Without data on consumer spending, it hard to identify what causes the correlation which is the more interesting question.] 

In the end I have gone back to the consumer panel data and would be trying to work at a very broad "oriental" level for these few days. This also means putting aside the recipe data for now which would actually simplify the analysis. Nonetheless, I still aim to explore heterogeneity using the dataset but would have to take a closer look at it to come up with a workable idea.

## To-do list

- [x] Download and clean ipums data
- [x] Scrape recipe data
- [x] Clean consumer panel data
- [ ] Flesh out the model in greater detail
- [x] Settle on the right level of aggregation across the datasets
- [x] Think about the relationship between recipe, purchases, migration (always doing so...)
- [ ] Merge all the datasets and analyse the data at a broader level
- [ ] See if there is some way to break down oriental products
