---
title: Notes on Regression - Maximum Likelihood
author: Timothy Lin
date: '2017-09-21'
tags: ['regression', 'ols', 'notes']
summary: Deriving the OLS estimator via the maximum likelihood approach
---

Part 4 in the series of notes on regression analysis derives the OLS formula through the maximum likelihood approach. Maximum likelihood involves finding the value of the parameters that maximise the probability of the observed data by assuming a particular functional form distribution.

### Bernoulli example

Take for example a dataset consisting of results from a series of coin flips. The coin may be biased and we want to find an estimator for the probability of the coin landing heads. A fair assumption is that observations are drawn from $n$ independent coin flips that come from a $Bernoulli(p)$ distribution. This means that the probability mass function of a single observation $x_{i}$ is given by:

$$
f(x_{i};p) = p^{x_{i}}(1-p)^{1-x_{i}}
$$

Note that $x_{i}$ is a single observation and takes the value of 0 or 1. The likelihood function is simply the joint distribution expressed as a function of its parameters:

$$
\begin{aligned}
L(p) &= P(X_{1}=x_{1}, X_{2}=x_{2},...,X_{n}=x_{n}; p) \\
&= \prod_{i=1}^{n} f(x_{i};p)~~(\text{by independence})\\
&= p^{\sum x_{i}} (1-p)^{n - \sum x_{i}}
\end{aligned}
$$

Now we want to find the value $p$ that maximises the likelihood, $L(p)$. A simplier alternatively is to maximise the log likelihood.^[Since the $ln$ function is monotonic, the parameter value that maximises the log likelihood will also maximise the likelihood.] The maximum likelihood estimate can then be calculated by finding the value $p$ that maximises the log likelihood:

$$
\begin{aligned}
ln L(p) &= (\sum x_{i}) ln~p + (n - \sum x_{i}) ln (1-p) \\
\frac{\partial ln L(p)}{\partial p} &= \frac{\sum x_{i}}{p} - \frac{n - \sum x_{i}}{1 -p} \\
0 &= (1-p)\sum x_{i} - p(n - \sum x_{i}) \\
\hat{p} &= \frac{\sum x_{i}}{n}
\end{aligned}
$$

Not surprisingly, the probability that the biased coin will land heads is simply the average number of heads across all observations.

### Linear regression

Similarly, one can derive the formula for the OLS estimator through the maximum likelihood approach. Recall that linearity implies the following specification for the regression model: $y_{i} = \mathbf{x}_{i}'\beta + u_{i}$. In the maximum likelihood approach, we need to assume that the error terms conditional on $x_{i}$ are normally distributed with unknown variance i.e. $u_{i}\vert\mathbf{x}_{i} \sim N(0,\sigma^{2})$. The PDF of a single observation is given by:

$$
f(y_{i},\mathbf{x}_{i};\beta, \sigma^2) =
\frac{1}{\sqrt{2\pi\sigma^2}} exp(\frac{-(y_{i} -\mathbf{x}'_{i}\beta)^2}{2\sigma^2})
$$

The likelihood or the joint PDF is:

$$
L(\beta, \sigma^2) = \prod_{i=1}^{n}
\frac{1}{\sqrt{2\pi\sigma^2}} exp(\frac{-(y_{i} -\mathbf{x}'_{i}\beta)^2}{2\sigma^2})
$$

The log likelihood can be written as:

$$
\begin{aligned}
ln~L(\beta, \sigma^2) &= ln \prod_{i=1}^{n} f(y_{i},\mathbf{x}_{i};\beta, \sigma^2) \\
&= \sum_{i=1}^{n} ln~f(y_{i},\mathbf{x}_{i};\beta, \sigma^2) \\
&= \sum_{i=1}^{n} ln~\Big(
\frac{1}{\sqrt{2\pi\sigma^2}} exp(\frac{-(y_{i} -\mathbf{x}'_{i}\beta)^2}{2\sigma^2}) \Big) \\
&= -\frac{n}{2} ln~2\pi -\frac{n}{2} ln~\sigma^2 -\frac{1}{2\sigma^2}\sum_{i=1}^{n}(y_{i} -\mathbf{x}'_{i}\beta)^2
\end{aligned}
$$

Take the derivative with respect to $\beta$ and $\sigma$ to derive the maximum likelihood estimator:

$$
\begin{aligned}
\hat{\beta}_{ML} &= (\sum_{i=1}^{n}\mathbf{x}_{i}\mathbf{x}_{i}')^{-1}(\sum_{i=1}^{n}\mathbf{x}_{i}y_{i}) \\
\hat{\sigma}^{2}_{ML} &= \frac{\sum_{i=1}^{n}(y_{i} -\mathbf{x}'_{i}\beta)^2}{n}
\end{aligned}
$$

### Additional Comments

While the maximum likelihood estimator can only be derived under very strong assumptions of the functional form which the error term takes, it is nonetheless a very popular method in statistics and has widespread applications. For example, binary choice models such as probit and logit assume that the dependent variable takes the value of 0 or 1 and could be modelled using the following functional form:

$$
P(y_{i}=1 | \mathbf{x}_{i}) = f(\mathbf{x}_{i}'\beta)
$$

where f is the CDF for the normal distribution in the case of the probit model or the logistic CDF for the logistic regression.^[This corresponds to a latent variable model where the error terms are iid drawn from a normal or logistic distribution.]

Unlike the case of the linear regression presented above, for most other problems, there may be no explicit solution for the maximisation problem and the solution has to be derived using numerical optimisation.
