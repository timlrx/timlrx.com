---
title: Notes on Graphs and Spectral Properties
author: Timothy Lin
date: '2017-12-25'
tags: ['graph theory', 'notes']
summary: A reference cheatsheet on adjacency matrix, incidence matrix, laplacian matrix and the basics of algebraic graph theory
---

Here is the first series of a collection of notes which I jotted down over the past 2 months as I tried to make sense of algebraic graph theory. This one focuses on the basic definitions and some properties of matrices related to graphs. Having all the symbols and main properties in a single page is a useful reference as I delve deeper into the applications of the theories. Also, it saves me time from googling and checking the relationship between these objects.

## Adjacency Matrix

Let $n$ be the number of vertices and $m$ the number of edges. Then the adjacency matrix $A$ of dimension $n \times n$ is a matrix where $a_{ij}=1$ where there is an edge from vertex i to vertex j and zero otherwise. For a weighted adjacency matrix, $W$, we replace 1 with the weights, $w_{ij}$.

Here we consider the case of undirected graphs. This means that the adjacency matrix is symmetric which implies it has a complete set of real eigenvalues (not necessary positive) and an orthogonal eigenvector basis. The set of eigenvalues ($\alpha_{1} \geq \alpha_{2} \geq ... \geq \alpha_{n}$) is known as the spectrum of a graph.

### Properties

- The greatest eigenvalue, $\alpha_{1}$ is bounded by the maximum degree.
- Given two graphs with adjacency matrix $A_{1}$ and $A_{2}$, the graphs are isomorphic iff there exist a permutation matrix $P$ such that $PA_{1}P^{-1}=A_{2}$. Implies same eigenvalue /eigenvectors/determinant/trace etc. Note: Two graphs may be isospectral (same set of eigenvalues) but NOT isomorphic.

## Incidence Matrix

An incidence matrix $\tilde{D}$ is of dimension $n \times m$ with $D_{ij}=1$ if $e_{j} = (v_{i},v_{k})$ or $-1$ if$e_{j} = (v_{j},v_{i})$ or zero otherwise. In other words, each column represents an edge that shows the vertex it is emitting from (1) and the vertex it is pointing to (-1).

For an undirected graph, there are two kinds of incidence matrix: oriented and unoriented. In the unoriented graph, we just put 1 for any vertex that is connected to an edge. The unoriented graph is similar to that of a directed graph (1 and -1) and is unique up to the negation of the columns.

## Laplacian Matrix

Laplacian matrix is defined as $L = D - A = \tilde{D}\tilde{D}'$, or the degree matrix $D$ minus the adjacency matrix $A$. Hence, the diagonals are the degree while $L_{ij}=-1$ if $v_{i}$ and $v_{j}$ are connected, else 0.

**Note:**

- $\tilde{D}$ is the unoriented incidence matrix.
- The degree matrix is defined as $D = diag(W \cdot \mathbf{1})$.
- For a weighted degree matrix, the diagonal element $d(i,i) = \sum_{j:(i,j)\in E} w_{ij}$.
- The conventional ordering of eigenvalue is opposite to the adjacency matrix! ($0=\lambda_{1} \leq \lambda_{2} \leq ... \leq \lambda_{n}$.)

### Walks

A walk on a graph is an alternating path of vertex and series from one vertex to another. A walk between two vertices $u$ and $v$ is called a $u-v$ walk. It's length is the number of edges.

**Cool fact:** Take the adjacency matrix and multiply it $n$ times, then $a^{n}_{ij}$, an entry from the $A^{n}$ matrix gives the number of $i-j$ walks of length $n$. Divide the $i,j$ entry by the degree of vertex $i$. Then the $i,j$ entry would give the probability that starting from $i$, you will end up at $j$ after $n$ steps.

### Matrices as operators on the vertices

The adjacency and laplacian matrix can be interpreted as operators on functions of a graph. That is, given $Ax$, $x$ can be interpreted as a function on the vertices, while $A$ is a linear mapping of the function $x$.

$$
Ax(i) = \sum_{j:(i,j)\in E} x_{j}
$$

Or in other words, it is the sum of the elements of x that are connected to vertex $i$. It can also be viewed as a quadratic form:

$$
x'Ax = \sum_{e_{ij}} x_{i}x_{j}
$$

Similarly, expressing the weighted laplacian matrix as an operator:

$$
\begin{aligned}
Lx(i) &= Dx(i) - Wx(i) \\
&= \sum_{j:(i,j)\in E} w_{ij} x_{i} - \sum_{j:(i,j)\in E} w_{ij}x_{j}  \\
&= \sum_{j:(i,j)\in E} w_{ij}(x_{i}-x_{j})
\end{aligned}
$$

As a quadratic form

$$
\begin{aligned}
x'Lx &= x'Dx - x'Wx \\
&= \sum w_{ij}x_{i}^{2} - \sum_{e_{ij}} x_{i}w_{ij}x_{j} \\
&= \frac{1}{2}(\sum w_{ij}x_{i}^{2} - 2\sum_{e_{ij}} x_{i}w_{ij}x_{j} + \sum w_{ij}x_{j}^{2}) \\
&= \frac{1}{2}\sum_{e_{ij}} w_{ij}(x_{i}-x_{j})^{2}
\end{aligned}
$$

The symmetric normalised Laplacian matrix is defined as $L^{sym} = D^{-1/2}LD^{-1/2} = I - D^{-1/2}AD^{-1/2}$.

Since the degree matrix is a diagonal matrix, $D^{-1/2}$ is just the $D$ matrix with the diagonals square rooted.

### Properties of $L$

- $L$ is symmetry because $W$ is symmetric.
- $\mathbf{1}$ is an eigenvector of the matrix (sum of any column=0), and $L\mathbf{1} = 0\mathbf{1}$, hence 0 is the smallest eigenvalue.
- The eigenvalues $0=\lambda_{1} \leq \lambda_{2} \leq ... \leq \lambda_{n}$ are real and non-negative.

## Laplacian Matrix and Connectedness

Define a path as a walk without any repeated vertices. A graph is connected if any two of its vertices are contained in a path.

In a fully connected graph, $\lambda_{2}>0$. Proof that the only eigenvector is $\mathbf{1}$: Let $x$ be the eigenvector associated with the eigenvalue 0. From the quadratic form:

$$
x'Lx = x'0 = 0 = \sum_{e_{ij}} w_{ij}(x_{i}-x_{j})^{2}
$$

This implies that for any ${i,j} \in E, x_{i} = x_{j}$. Since, there exist a path from any two vertices, $x_{i} = x_{j}$ for all $i,j \in V$:

$$
x = \alpha
\left[\begin{array}{c}
1 \\
1 \\
. \\
. \\
1
\end{array}\right]
$$

Hence, the multiplicity (number of linearly independent) of eigenvalue 0 is 1, and $\lambda_{2} > 0$.

In fact, the multiplicity of the eigenvalue 0 tells us the number of connected components in the graph. For example, a graph with two connected components (the adjacency matrix and the laplacian matrix will have a block diagonal structure), you will get two eigenvectors associated with the eigenvalue 0. Something like $[1~1~1~0~0~0]'$ and $[0~0~0~1~1~1]'$.

To summarise, the number of connected components is equal to the multiplicity of eigenvalue 0 which is equal to the dimension of the null space of $L$.

### Normalised Symmetric Laplacian and Random walk matrix

The normalised symmetric laplacian is defined as:

$$
L_{sym} = I - D^{-1/2}WD^{-1/2} = D^{-1/2}LD^{-1/2}
$$

In other words, it has 1 on the diagonals and $-\frac{1}{\sqrt{deg(v_{i})deg(v_{j})}}$ if $v_{i}$ is adjacent to $v_{j}$ and 0 otherwise.

The random walk matrix is defined as:

$$
L_{rw} = D^{-1}L = I - D^{-1}W = D^{-1/2}L_{sym}D^{1/2}
$$

$L_{sym}$ and $L_{rw}$ are similar matrices.

### Properties of $L$,$L_{sym}$ and $L_{rw}$

- The three matrices are symmetric, positive, semidefinite.
- $L_{sym}$ and $L_{rw}$ share the same eigenvalues. $u$ is an eigenvector of $L_{rw}$ iff $D^{1/2}u$ is an eigenvector of $L_{sym}$.
- $u$ is a solution of the eigenvalue problem $Lu = \lambda Du$ iff $D^{1/2}u$ is an eigenvector of $L_{sym}$ for the eigenvalue $\lambda$ iff $u$ is an eigenvector of $L_{rw}$ for the eigenvalue $\lambda$ .
- A similar connection between the connected components and $L$ can be made with $L_{sym}$ and $L_{rw}$.
