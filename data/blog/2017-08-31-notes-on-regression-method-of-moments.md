---
title: Notes on Regression - Method of Moments
author: Timothy Lin
date: '2017-08-31'
tags: ['regression', 'ols', 'notes']
summary: Establishing the OLS formula via the method of moments approach
---

Another way of establishing the OLS formula is through the method of moments approach. This method supposedly goes way back to Pearson in 1894. It could be thought of as replacing a population moment with a sample analogue and using it to solve for the parameter of interest.

### Example 1

To find an estimator for the sample mean, $\mu=E[X]$, one replaces the expected value with a sample analogue, $\hat{\mu}=\frac{1}{n}\sum_{i=1}^{n} X_{i} = \bar{X}$

### Example 2

Let $X_{1}, X_{2}, ..., X_{n}$ be drawn from a normal distribution i.e. $X_{i} \sim N(\mu,\sigma^{2})$
The goal is to find an estimator for the two parameters, $\mu$ and $\sigma$. The first and second moment of a normal distribution is given by:

$$
\begin{aligned}
E[X] &= \mu \\
E[X^{2}] &= \mu_{2} = \mu^{2} + \sigma^{2}
\end{aligned}
$$

An estimator for $\mu$ is easy and is simply $\hat{\mu} = \frac{1}{n}\sum_{i=1}^{n} X_{i} = \bar{X}$.

Replace the moment condition with the sample analogue and substitute in the estimator for $\mu$ to find an estimator for $\sigma^2$:

$$
\begin{aligned}
\frac{1}{n}\sum_{i=1}^{n} X_{i}^{2} &= \mu^{2} + \hat{\sigma}^{2} \\
\hat{\sigma}^{2} &= \frac{1}{n}\sum_{i=1}^{n} X_{i}^{2} - \bar{X}^{2} \\
&= \frac{1}{n}\sum_{i=1}^{n}(X_{i}-\bar{X})^2
\end{aligned}
$$

### Example 3

Let $X_{1}, X_{2}, ..., X_{n}$ be drawn from a poisson distribution i.e. $X_{i} \sim Poisson(\lambda)$. The poisson distribution is characterised by the following equality: $E[X]=var(X)=\lambda$. This gives rise to two possible estimators for $\lambda$:

$$
\begin{aligned}
\hat{\lambda}_{1} &= \bar{X} \\
\hat{\lambda}_{2} &= \frac{1}{n}\sum_{i=1}^{n}(X_{i}-\bar{X})^2
\end{aligned}
$$

Since there is only one parameter to be estimated but two moment conditions, one would need some way of 'combining' the two conditions. Using only one condition would be not making full use of the information at hand.

### Regression - Method of Moments

More generally, one can write the moment conditions as a vector of functions $g(X_{i},\beta)$, where $\mathbf{X}_{i}$ is the observed data, including all variables $(y_{i}, X_{i})$ and instruments $(\mathbf{Z}_{i})$ in the regression model, while $\beta$ is the vector of parameters of length $k$. The model is identified if the solution is unique, i.e. $Eg(X_{i},\beta)=0$ and $Eg(X_{i},\hat{\beta})=0$ imply that $\beta=\hat{\beta}$. This requires that we have at least $k$ restrictions for $k$ parameters.

For the OLS regression, one can use the moment condition $E(\mathbf{X}_{i}U_{i})=0$ or $E(\mathbf{X_{i}}(y_{i}-\mathbf{X}_{i}'\beta))=0$ to solve for the usual OLS estimator.

The idea can be carried over to other more complicated regression models. For example, in the case where $g(X_{i},\beta)$ is linear in $\beta$ i.e. $g(X_{i},\beta) = \mathbf{Z}_{i}(y_{i} - \mathbf{X}_{i}'\beta)$ or $E(\mathbf{Z}_{i}U_{i})=0$, and the model is perfectly identified $(l=k)$, solving the moment condition yields the formula for the IV regression:

$$
\begin{aligned}
0 &= \sum_{i=1}^{n}\mathbf{Z}_{i}(y_{i} - \mathbf{X}_{i}'\hat{\beta}^{IV})  \\
\hat{\beta}^{IV} &= \Big(\sum_{i=1}^{n} \mathbf{Z}_{i}\mathbf{X}_{i}' \Big)^{-1} \sum_{i=1}^{n}\mathbf{Z}_{i}y_{i} \\
&= (\mathbf{Z}'\mathbf{X})^{-1}\mathbf{Z}'\mathbf{y}
\end{aligned}
$$

Hence an IV regression could be thought of as substituting 'problematic' OLS moments for hopefully better moment conditions with the addition of instruments.

### Extension - Generalised Method of Moments (GMM)

While it is not possible to identify $\beta$ if there are too few restrictions, one could still identify $\beta$ if there are $l > k$ restrictions (overidentified), as seen in the poisson example.^[In the case of regressions, this happens when there are more instruments than endogenous regressors.] One might then wonder what is the best way to combine these restrictions. The GMM approach, introduced by Hansen in 1982, finds an estimate of $\beta$ that brings the sample moments as close to zero as possible. Note that the moment conditions for all the restrictions are still equal to zero, but the sample approximation, being drawn from a finite sample, may not be equal to zero. In other words, the GMM estimator is defined as the value of $\beta$ that minimizes the weighted distance of $\frac{1}{n}\sum_{i=1}^{n}g(X_{i},\beta)$:

$$
\begin{aligned}
\hat{\beta}^{GMM} &= \arg \min_{\beta \in B} \Big\lVert \frac{1}{n}\sum_{i=1}^{n}g(X_{i},\beta)  \Big\rVert^{2}_{W}  \\
&= \arg \min_{\beta \in B} \Big( \frac{1}{n}\sum_{i=1}^{n}g(X_{i},\beta) \Big)'\mathbf{W}
\Big( \frac{1}{n}\sum_{i=1}^{n}g(X_{i},\beta) \Big)
\end{aligned}
$$

where $\mathbf{W}$ is the $l \times l$ matrix of weights which is used to select the ideal linear combination of instruments. In the case of the regression model where $g(X_{i},\beta)$ is linear in $\beta$ but is overidentified, the general GMM formula can be found by minimising the above condition and is given by:

$$
\hat{\beta}^{GMM} = \Big((\mathbf{X}'\mathbf{Z})\mathbf{W}(\mathbf{Z}'\mathbf{X}) \Big)^{-1}
(\mathbf{X}'\mathbf{Z})\mathbf{W}(\mathbf{Z}'\mathbf{y})
$$

Note that when $\mathbf{W}=(\mathbf{Z}'\mathbf{Z})^{-1}$, $\hat{\beta}^{GMM}=\hat{\beta}^{IV}$.^[This also shows that the 2SLS estimator is a GMM estimator for the linear model. $\mathbf{W}=(\mathbf{Z}'\mathbf{Z})^{-1}$ is also the most efficient estimator if the errors are homoskedastic. In general, there may be other more efficient choices of the weighting matrix.] Please google efficient GMM, for more information on the optimal choice of the weighting matrix.
