---
title: Comparing the Population and Group Level Regression
author: Timothy Lin
date: '2017-10-01'
tags: ['regression', 'notes']
summary: To what extent do the coefficients obtained from a regression carried out at the group level correspond to the estimates at the individual level?
---

I was planning to write a post that uses region level data to infer the underlying relationship at the population level. However, after thinking through the issue over the past few days and working out the math (below), I realise that the question I wanted to answer could not be solved using the aggregate data at hand. Nonetheless, here is a formal description of the problem outlining the assumptions needed to infer population level trends from more aggregated data.

The set-up of the problem is as follows: one is interested in examining the correlation of certain individual level characteristics. However, such data is unavailable. A possible alternative is to use more aggregated data, for example at the level of a county or region, in place of the individual. For the U.S., this would mean examining the correlation of variables across states or counties. In Singapore's case, one could use region level data from the Censuses. To what extent do the coefficients obtained from a regression carried out at the group level correspond to the estimates at the individual level?

### Examining the Ecological Fallacy Problem

One should take great care when drawing inference of the individual from group level estimates. This is otherwise known as the ecological fallacy problem, where observations at the group level exhibits different trends compared to the micro-data. To analyse the issue more formally, we compare $\beta$, the coefficient from the model at the individual level:

$$
Y_{i} = \alpha + \beta X_{i} + u_{i}
$$

against $\beta_{G}$, the estimate obtained from running the regression at the group level:

$$
\sum_{i=1}^{N} Y_{i} = \alpha*N + \beta_{G} \sum_{i=1}^{N} X_{i} + \sum_{i=1}^{N} u_{i}
$$

In this model, each group or region consists of $N$ different individuals. In practice, the number of individuals might vary across each region. One can use the region average instead of the total for more meaningful results. If $X$ is a binary variable, this would simply be the proportion of people with a certain attribute.

For the estimate of the group regression to be equal to the underlying population regression, $\beta_{G} = \beta$, the following expression must hold:

$$
\frac{cov(\sum_{i=1}^{N} Y_{i}, \sum_{i=1}^{N} X_{i})}{var(\sum_{i=1}^{N} X_{i})} =
\frac{cov(Y_{i}, X_{i})}{var (X_{i})}
$$

The numerator for the first term on the left hand side can be rewritten as:

$$
cov(\sum_{i=1}^{N} Y_{i}, \sum_{i=1}^{N} X_{i}) =
\sum_{i=1}^{N}cov(Y_{i},X_{i}) + \sum_{i=1}^{N} \sum_{k \neq i} cov(Y_{k}, X_{i})
$$

The covariance term for the population level regression will only be equal to the group level equation if there are no spillover effects. Examining, the exogeneity condition, we see that:

$$
cov(\sum_{i=1}^{N} u_{i}, \sum_{i=1}^{N} X_{i}) =
\sum_{i=1}^{N}cov(u_{i},X_{i}) + \sum_{i=1}^{N} \sum_{k \neq i} cov(u_{k}, X_{i})
$$

For the group estimate to coincide with the individual level estimate the term on the right has to be equals to zero and any possible omitted variable bias has to be constant across the population.^[To have a causal interpretation of the estimate, we would also require that $cov(u_{i}, X_{i})=0$.] This condition also implies that there is no selection into groups based on the variables of interest.

Similarly, the denominator of the estimator of the group regression can be rewritten as:

$$
var(\sum_{i=1}^{N} X_{i}) = \sum_{i=1}^{N}var(X_{i}) + \sum_{i \neq j} cov(X_{i}, X_{j})
$$

The variance of the sum is only equal to the sum of the variance if the covariance term is zero. In short, the group and population estimates will coincide only if there are no cross-covariance relationships across the variables.

### Afterthought

Actually, I wanted to use the Singapore region dataset, which I previously compiled, to examine the relationship across individual attributes. After thinking through the problem, I realise that people sort into regions base on income and race. Interpreting the group estimates at the population level would definitely be falling prey to the ecological fallacy. Well at the very least, this problem gave me some food for thought and inspired the above post.
