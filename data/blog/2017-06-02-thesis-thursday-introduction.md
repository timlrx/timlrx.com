---
title: Thesis Thursday - Introduction
author: Timothy Lin
date: '2017-06-02'
tags: ['Thesis Thursday']
summary: I decided to document my progress on my masters thesis as a weekly Thursday special. Hopefully I would have enough materials or progress to continue the weekly post but this should also give me some motivation to work on it
---

I decided to document my progress on my masters thesis as a weekly Thursday special. Hopefully I would have enough materials or progress to continue the weekly post but this should also give me some motivation to work on it. I find the process of writing also useful to think through some ideas more carefully. This week I will be introducing the idea of my research project, the data I will be using and some issues I am trying to solve.

# The effect of migration on consumption

That's the placeholder title for now which is pretty much self-descriptive. I was inspired by the Industrial Organisation literature where a number of researchers were trying to analyse consumers' supermarket purchase decisions. While most of the papers I came across used some kind of BLP model to analyse consumers' decisions, I was more attracted to the idea of looking at spillover effects. It turns out that Bronnenberg, Dube and Gentzkow have a 2012 AER paper that documents evidence of persistence in brand loyalty. Using variation in migration patterns within the U.S. they showed that a migrant's purchase decision is very much tied with the county which he is originally from though there appears to be convergence to local preferences over time.

Building on my interest in labour economics and migration, I thought of combining these two strands and analyse how foreign migrants shape local consumption patterns. The labour economics literature on migration is full of studies looking at the effect of migration on wage outcomes but there are much fewer studies done examining other softer socio-cultural outcomes, in part due to the difficulty of obtaining and measuring these characteristics.

Living in Vancouver, I can't help but wonder why there are so many sushi joints in the city and it would seem extremely likely that migration patterns shape local consumption.^[By consumption, I am treating it very literally to be the consumption of food.] I still want to go a step further and ask whether it is due to a supply effect (more foreign food available, lower prices etc.) or whether it is due to a difference in preferences (i.e. Vancouverites prefer sushi due to historical flow of Japanese migrants.)

## Data

Migration data is straightforward and I will be using the standard U.S. census and American Community Survey data to calculate migrant flows at the city/country level.

I am tapping on the Nielsen Consumer Panel data which is a super comprehensive dataset containing supposedly nationally representative data of a panel of consumers' purchases. This is a bread and butter dataset for IO researchers but I think it is somewhat underused by researchers in other areas. Basically, consumers have to scan all their products in their weekly shopping cart which is sent to Nielsen who uses it to provide insights on business trends and sales strategy. It is _extremely_ comprehensive, e.g Tropicana orange juice purchased at $x by consumer y at shop z.

The tricky issue is coming up with a way to quantify the degree of 'foreignness' of consumers' supermarket purchases. Spending patterns at food outlets (e.g. through credit card data) might provide a good indicator of consumers' preferences but it is not immediately clear how to match a supermarket basket to different origin countries.

One possible solution is to trace the source of production of products, though that approach has severe limitations since everything is probably made in China. Another alternative would be to associate particular brands with particular regions (e.g polky = Japan), but I cannot seem to find a convenient source which contains all these brand associations. Moreover, the complex shareholding structure also means that one can't really be sure what is a Japanese brand.

Currently, I am trying to tackle this issue by associating each product with the likelihood that it would be used in a particular recipe. So for example, buying a chicken probably provides no information since it is used almost universally across all regions but the purchase of seaweed is likely to be informative. I have scraped some recipes from allrecipes.com and plan on using that to associate ingredients with cuisine. Not perfect but we shall see how far that goes...

## Methodology

Method wise I would stick with a simple cross-sectional regression of consumption on migrant inflow at the city / county level. One could potentially try to exploit the panel structure of the Nielsen dataset though the 5 year period may be too small to observe any meaningful signal. A more interesting question, at least to me, is how the timing of migrant inflow affects current consumption patterns.

Endogeneity would always be a concern with such analysis and I would most likely have to construct some kind of push/pull IV which is typically use in the migration literature. Though I should add that any omitted variable bias threats are probably not as severe since I doubt that factors affecting differential trends in migration should be correlated with local food consumption patterns.

## To-do list

- [x] Download and clean ipums data
- [x] Scrape recipe data
- [ ] Explore other recipe sources
- [ ] Clean consumer panel data
- [ ] Flesh out the model in greater detail
- [ ] Settle on the right level of aggregation across the datasets
- [ ] Think about the relationship between recipe, purchases, migration

## Additional thoughts

Another possibility would be to look at the type of restaurants available in each area. Scrape yelp? In fact, this might be a more direct approach but I still want to explore the Nielsen panel.
