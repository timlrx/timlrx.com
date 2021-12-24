---
title: Benchmark of popular graph/network packages v2
author: Timothy Lin
date: '2020-05-10'
# bibliography: 'network-packages.bib'
link-citations: true
tags: ['benchmarks', 'networks', 'notes', 'python', 'r', 'julia']
summary: A revised benchmark of graphs / network computation packages featuring an updated methodology and more comprehensive testing. Find out how Networkx, igraph, graph-tool, Networkit, SNAP and lightgraphs perform
---

![](/static/img/graph_libraries.png)

This is an update of a [benchmark of popular graph / network packages](/blog/benchmark-of-popular-graph-network-packages) post. This study aims to serve as a starting point for anyone interested in applied graph or network analysis. The featured network packages offer a convenient and standardised API for modelling data as graphs and extracting network related insights. Some common use cases include finding the shortest path between entities or calculating a measure of centrality such as the page rank score.

To replicate the benchmark exercise and for the full codes, please refer to [my github repository](https://github.com/timlrx/graph-benchmarks). Instructions on how to setup and install the packages are also located in the repository. If you are a package maintainer and want to include your package, feel free to do a pull request. Alternatively, if you are interested in a particular algorithm which I do not cover, feel free to also submit a PR and I will include it in the benchmark as part of the next run.

## Main Updates

Here is a list of major developments since my previous post in April 2019:

- Python packages are now benchmark using `timeit` instead of `cprofile` for more accurate run time and to allow for better comparison across packages^[There is additional overhead from profiling code compared to just timing it.]

- Results are compared using the median run time instead of the mean.^[Median is more robust to outliers. Full results - min, median, mean, max are all available in the respective output files for each profiling run for a dataset.]

- For all packages, the dataset is read as a directed graph and the benchmark time covers both the analytical run time as well as memory allocation.^[This makes comparisons between packages more comparable compared to the previous run.]

- Lightgraphs v2.0-dev is included in the benchmark exercise.^[Initial results based on v1.3 were committed to the repository in the beginning of the year. This revised benchmark uses v2.0-dev which can be pulled from the master branch.] It is the first Julia library to be added to the study - read on to find out how it fares with the rest.

- igraph, the incumbent in the space with popular R, Mathematica and Python bindings has been updated to v0.8. The last major release was way back in 2014! For a full list of new features and improvements, check out [igraph's github release page](https://github.com/igraph/igraph/releases)

- SNAP, another stalwart in the space releases [v5.0](http://snap.stanford.edu/snappy/index.html), which finally supports Python 3 and pip install.

- [Networkit releases v6.0](https://networkit.github.io/news.html).

- Streamline installation procedures for SNAP, graph-tool and networkit as they now support conda or pip. Check out my [setup instructions](https://github.com/timlrx/graph-benchmarks/blob/master/setup/setup.md) to see how simple it is to install one of these packages now!

The changes to the benchmark methodology as well as standardisation of how the data is read and results are displayed allows for better comparisons to be drawn between packages.

At the same time the new features and improvements across the packages have made high-performance network analytics extremely accessible to any analyst out there - kudos to all the developers who have made this possible.

## Methodology

The benchmark was carried out using a Google Compute n1-standard-16 instance (16vCPU Haswell 2.3GHz, 60 GB memory). Please refer to the [setup folder](https://github.com/timlrx/graph-benchmarks/blob/master/setup/setup.md) for more detailed installation instructions.

Where applicable, all algorithms were tested using all 16 cores. I compared 6 different packages:

- lightgraphs, v2.0-dev [@lighgraphs]

Networkx is written in Python while the other four packages, with the exception of lightgraphs, are based on C / C++ but have Python APIs. Igraph has an R and Mathematica binding as well though the benchmark was carried out on the Python one. Lightgraphs offers a performant platform for network and graph analysis in Julia.

Selecting what tasks to compare on is not really a trivial decision with each package offering various tools and capabilities. In the end, I decided to focus on 5 specific problems:

- loading the data
- single source shortest path
- page rank
- k-core decomposition
- strongly connected components

Loading is more of an I/O task while the other 4 are common graph algorithms.

**Disclaimer**:

- As far as possible, I try to specify the same parameters for each algorithm but differences in API across the packages could translate to actual differences in how the algorithm is run and the final output. For example, some of the observed differences in performance might be a result of different stopping criteria used or different algorithm implementations etc.

- For lightgraphs, the data is represented using the SimpleGraphs structure. Better performance could be achieved by using the StaticGraphs structure at the expense of mutability.

- The performance benchmark captures run time differences across packages on basic graph algorithms on directed graphs. Other important metrics such as memory consumption are out of scope of this study. Differences in implementation between directed and undirected graphs or weighted and non-weighted algorithms limit the generalisability across the other functions.

## Dataset

3 datasets from the Stanford Large Network Dataset Collection <span className="citation">(Leskovec and Krevl <a href="#ref-snapnets" role="doc-biblioref">2014</a>)</span> were used in the exercise:

- [Amazon product co-purchasing network from March 2 2003](https://snap.stanford.edu/data/amazon0302.html), 262k nodes, 1.2m edges
- [Web graph from Google](https://snap.stanford.edu/data/web-Google.html), 875k nodes, 5.1m edges
- [Pokec online social network](https://snap.stanford.edu/data/soc-Pokec.html), 1.6m nodes, 30.6m edges

While it is the easiest to rank the packages based on the run-time of the algorithms, it is only one of the many considerations of what makes a good package. I try to offer a more subjective view based on my experience with these packages.

## Related Benchmarks

Here's a list of other comparative benchmarks for the interested viewer to check out:

- Graph-tool performance comparison <span className="citation">(Peixoto <a href="#ref-peixoto" role="doc-biblioref">2015</a>)</span>, compares graph-tool with igraph and networkx on the single-source shortest path, page rank, k-core, minimum spanning tree and betweeness algorithms.

- <span className="citation">Leskovec and Sosic (<a href="#ref-leskovec2016snap" role="doc-biblioref">2016</a>)</span>, compares snap with igraph and networkx on Erdos-Renyi graph generation and loading, page rank, clustering coefficient, weakly connected components, extracting 3-core of a network, and testing edge existence.

- <span className="citation">Staudt, Sazonovs, and Meyerhenke (<a href="#ref-networkit" role="doc-biblioref">2016</a>)</span>, compares networkit with igraph and graph-tool on the breadth-first search, connected components, core-decomposition, calculating the diameter of a graph, community detection, cluster coefficient, page rank, betweeness algorithms.

- Graph500 <span className="citation">(Murphy et al. <a href="#ref-murphy2010" role="doc-biblioref">2010</a>)</span>, a notable graph based benchmark based on breadth-first search mostly to benchmark supercomputers rather than packages.

Most of the package comparison studies were written in 2015/2016. Since then, there have been substantial improvements in the field and it will be interesting to see the changes over time.

## Results

All reported times are the median of that captured for a particular task. For the Amazon and Google dataset, all algorithms were run 100 times, while for the Pokec dataset 10 runs were carried out for each package. Networkx is the exception. Since it is slower by a significant magnitude (~approx 10 times than the _slowest_ library), only 10 runs were carried out on the Amazon and Google dataset and 1 run on the Pokec dataset. For example, it took 68s to run the single source shortest path problem on the Pokec dataset on networkx compared to 0.62s for networkit (the next slowest). Hence, I left it out of the comparison plots.

Here are the run times of the other packages across the 3 benchmark datasets:

![plot of chunk plot_all](/static/r/plot_all-1.png)

Full results can be seen from the table below:

| dataset | Algorithm     | graph-tool | igraph | lightgraphs | networkit | networkx |  snap |
| :------ | :------------ | ---------: | -----: | ----------: | --------: | -------: | ----: |
| Amazon  | CC            |       0.09 |   0.22 |        0.07 |      0.09 |     2.22 |  0.31 |
| Amazon  | k-core        |       0.08 |   0.15 |        0.04 |      0.15 |     3.63 |  0.37 |
| Amazon  | loading       |       2.61 |   0.57 |        4.66 |      0.98 |     4.72 |  1.61 |
| Amazon  | page rank     |       0.04 |   0.57 |        0.02 |      0.01 |     8.59 |  0.58 |
| Amazon  | shortest path |       0.03 |   0.05 |        0.01 |      0.04 |     1.37 |  0.12 |
| Google  | CC            |       0.28 |   1.38 |        0.29 |      0.37 |     7.77 |  1.56 |
| Google  | k-core        |       0.39 |   0.92 |        0.16 |      0.83 |    42.60 |  1.31 |
| Google  | loading       |      11.02 |   3.87 |       16.75 |      4.38 |    19.24 |  7.56 |
| Google  | page rank     |       0.36 |   2.42 |        0.06 |      0.10 |    33.50 |  2.31 |
| Google  | shortest path |       0.08 |   0.41 |        0.01 |      0.14 |     3.41 |  0.26 |
| Pokec   | CC            |       1.83 |   3.96 |        1.50 |      1.75 |    61.74 |  9.75 |
| Pokec   | k-core        |       3.60 |   5.99 |        0.95 |      5.05 |   296.26 |  6.91 |
| Pokec   | loading       |      71.46 |  25.75 |      170.63 |     26.77 |   140.19 | 52.73 |
| Pokec   | page rank     |       1.10 |  23.39 |        0.21 |      0.24 |   239.75 |  8.62 |
| Pokec   | shortest path |       0.48 |   0.60 |        0.05 |      0.56 |     5.65 |  2.30 |

Another way of looking at the results is by calculating the number of times one could run a particular algorithm given the time taken by networkx. This metric gives an indication of how many times more performant is a particular algorithm compared to networkx. The score calculated using the Google dataset is displayed below:

![plot of chunk ranking](/static/r/ranking-1.png)

| Package     | loading | shortest path | page rank | k-core |    CC |
| :---------- | ------: | ------------: | --------: | -----: | ----: |
| graph-tool  |    1.75 |         41.08 |     93.06 | 109.23 | 27.75 |
| igraph      |    4.97 |          8.32 |     13.84 |  46.30 |  5.63 |
| lightgraphs |    1.15 |        310.00 |    515.38 | 266.25 | 26.79 |
| networkit   |    4.39 |         24.36 |    335.00 |  51.33 | 21.00 |
| snap        |    2.54 |         13.12 |     14.50 |  32.52 |  4.98 |

### Loading

The SNAP datasets were read as a tab-delimited file into a directed graph format. From the plots above, igraph and networkit lead on the graph loading task. The difference in reading speed can be attributed to differences in loading as well as graph construction methods (possibly from the different internal representation of graphs).^[A pure construction based benchmark exercise is probably required to separate the two factors.]

For example, graph-tool uses Python code to parse the input while igraph and networkit are using C libraries to read the files which result in better performance.^[Graph-tool should read from other file types such as graphml or dot much faster though I did not actually try it out.]

### Algorithms

All the featured libraries are a magnitude more performant than networkx.

The **least** performant library (SNAP) is 13x faster on the single source shortest path problem, 14x faster on page rank, 32x faster in calculating the k-core and 5x faster in identifying connected components!

Lightgraphs is ~300x faster than networkx on the single source shortest path problem, and approximately 10x faster than the other competitors. It achieves the speed-up with a multi-threaded version of the algorithm.

Lightgraphs and networkit stands out in the page rank algorithm, with graph-tools exhibiting the next best performance.^[Note: this might be due to differences in stopping criteria. Matthew Galati from SAS pointed out that for the page rank algorithm, networkit (as of version 6.0) uses L2 norm as a stopping criteria while other packages use the L1 norm. This means that it is doing fewer iterations and the speed is somewhat artificial]

Once again, lightgraphs performs extremely well on the k-core decomposition, being more than >250x faster than networkx. _Note_: In the first benchmark study, networkit performed incredibly well on this measure when the dataset was read as an undirected graph. It does not seem that the multi-threading functionality extends to directed graphs.

Graph-tool, lightgraphs and networkit performed equally well on the strong connected components problem.

Other than SNAP being on the slower side, the rest of the packages performed very well across all tasks.

How have the packages improved from the previous year?^[This paragraph is based on my experience re-running the previous benchmark before making changes to the codes. Due to differences in methodology, i.e. `timeit` vs `cprofile` as well as median vs mean, one should expect all the results to be lower than the previous runs - which they are. I highlight results which differ significantly from the previous run.] Igraph certainly improved on both the page rank and connected components test with results at least 2x faster since the previous run. Networkit has made huge strides in loading using a new binary graph format as well as improvement on breadth-first search and connected components. The move from lightgraphs 1.x to 2.0 has also led to significant all-round performance gains with many multi-threading algorithms now available.

### Multi-threading

Besides having efficient single-thread algorithms, packages such as graph-tool, networkit and lightgraphs also take advantage of parallel processing to speed up computations.^[Graph-tool and networkit rely on openmp and one can set the number of threads using the `openmp_set_num_threads` function or `setNumberOfThreads` functions repectively. For lightgraphs, `JULIA_NUM_THREADS` environment variable has to be configured before running the multi-threaded functions.]

In this section, I compare the performance across 1, 4, 8 and 16 cores for these 3 packages.^[lightgraphs offer an explicit threaded or non-threaded version of the algorithm. Single thread results for lightgraphs are reported using the non-threaded algorithm run on a single core.] The Google web dataset was used for this part of the analysis.

One problem I faced when using graph-tool and networkit is that is is not immediately apparent which algorithm has multi-threaded implementations. Running the benchmark helps shed some light in this area.

Graph-tool, networkit and lightgraphs offer a threaded implementation of page rank. Both networkit and lightgraphs have a threaded version of the k-cores algorithm, though networkit version seems to only apply to undirected graphs. Only lightgraphs provide a threaded version of the single source shortest path problem out of the box.

First, let's take a look at how performance differs as we increase the number of threads on the page rank algorithm.

![plot of chunk threads_pr](/static/r/threads_pr-1.png)

For graph-tool and networkit, we see a substantial speed up when increasing from 1 to 4 to 8 cores. However, diminishing returns kicks in when increasing from 8 to 16 cores. For example, the run time of the page rank algorithm is 0.42s for 8 cores and 0.28s using 16 cores for graph-tool, while for networkit it was 0.098s for 8 cores and 0.1s for 16 cores. Lightgraphs is an anomaly over here since it's performance is really fast even on 1 thread and relatively consistent across all settings.^[The 'non-threaded' version is using BLAS which is inherently multi-threaded.]

Next, we take a look at the threaded k-core algorithm of lightgraphs.

![plot of chunk threads_kcore](/static/r/threads_kcore-1.png)

Running on one thread, lightgraphs takes 0.57s to run the k-core algorithm, slightly slower than graph-tool at 0.39s but faster than networkit at 0.83s. Running with all 16 cores gives it a 3.5x speed-up.

Finally, we take a look at the threaded single source shortest path algorithm between lightgraphs.

![plot of chunk threads_sssp](/static/r/threads_sssp-1.png)

This plot gives us some insight on how lightgraphs out-perform the other packages on the single source shortest path benchmark. If we were to consider only the single thread performance, lightgraphs (0.08s) would be comparable to graph-tool. Multi-threading gives it an approximately 8x speed up.

Both the k-core and single source shortest path results also exhibit diminishing returns going from 8 to 16 cores. This might be due to the size of the dataset and it would be interesting to whether this holds for the pokec dataset as well.

### Other Considerations

There are also other important points to consider before making a switch or starting a project on one of these packages. Besides pure numerical benchmarking, other considerations such as the learning curve, documentation, popularity, support should be examined.

**Packages**  
First, the algorithms available differ quite significantly across the packages. Users interested in switching to one of these packages should read the documentation on the list of features available. For example, while they all contain the basic tools needed to manipulate networks, graph-tool lacks the more usual modular clustering tools but has additional functionalities on statistical inference on graphs using stochastic block models. igraph also adds a spectral embedding function in the recent update.

Visualising networks is also an important part of the analytical toolchain. Igraph implements quite a few layout algorithms and renders them using the cairo library. Snap supports graphviz while graph-tool supports both graphviz and cairo. Networkit takes a different approach and relies on networkx to draw while also providing support and integration with Gephi via its streaming plugin. Lightgraphs also rely on other graphing packages in the Julia ecosystem and has tight integration with other JuliaGraph packages such as GraphPlot.jl.

**API**  
Moving away from native Python or R means that the syntax for the packages can sometimes be quite convoluted. Let's compare the syntax for deriving an array of the shortest path distance from an origin node.

networkx:

```python
nx.shortest_path_length(g, nodeid)
```

igraph:

```python
g.shortest_paths([g.vs[node_index]])[0]
```

graph-tool:

```python
shortest_distance(g, g.vertex(node_index)).a
```

networkit:

```python
distance.BFS(g, node_index, storePaths=False).run().getDistances(False)
```

snap:

```python
NIdToDistH = snap.TIntH()
snap.GetShortPath(g, node_index, NIdToDistH, True)
[(item, NIdToDistH[item]) for item in NIdToDistH]
```

lightgraphs:

```julia
distances(g, node_index, BreadthFirst(sort_alg=RadixSort)) # Non-threaded
distances(g, node_index, ThreadedBreadthFirst()) # Threaded
```

While this might be a matter of taste, I find SNAP's API the most cumbersome since one has to define an additional variable (with the correct variable type) to store the results before running it. Running more advanced functions on graph-tool and networkit also requires a user to pre-define variables with the correct type to store results. This is the trade-off one pays for more performant packages.

Lightgraphs offers non-threaded and threaded implementations of particular algorithms and it is up to the user to specify the algorithm to run.^[This is based on the development version of Lightgraphs v2.0-dev. Users of existing 1.x versions might find it slightly different.] On the other hand, networkit and graph-tool 'automatically' uses threaded implementation via openmp though this applies only to selected algorithms and it is not immediately clear without digging into the source code or trying it out (like this benchmark).

**Source code**  
Besides networkx, the other python based packages have underlying source code in C / C++ and rely on other libraries such as the boost library and template metaprogramming. This makes diving into the source code more difficult unless you are well versed in C / C++. The simplicity of networkx and the fact that it is written in Python, makes it easy to understand the logic of network algorithms and a good teaching tool. Lightgraphs being completely written in Julia is also relatively readable but requires learning another language to really master it.

**Support and Documentation**  
User support and documentation is really important when one wants to use the project in an actual project setting. Networkx is by far the winner in this category with more than 4k github stars and lots of issues documented in github and stackoverflow. Igraph fairs decently as well with more than a thousand stars across its different modules, though there are no consistent updates (until recently) or developmental roadmaps.

graph-tool and networkit have much smaller followings though the creators seem relatively responsive to user issues and the packages are in active development.

lightgraphs is probably the equivalent of networkx in Julia and currently sits close to 450 gihub stars and is in very active development. The improvements from v1.x to 2.0 over the past few months is really quite incredible.

## Conclusion

Here are my three main takeaways from this study. First, it is much easier to install any of these packages. One no longer needs to dig through all the documentation and fiddle around with installation. Most packages can now be installed from popular package managers with a single line. Some even offer docker builds.

Second, there has been a significant improvement across all packages. I am not sure whether this is because network analysis has become more popular or it is just a nice coincidence that most of the package maintainers decided to release major updates in 2019. Either way, it's good news to end-users who can enjoy 2-10x speedup on popular algorithms.

Third, for most of these packages, the run time of an algorithm is relatively comparable especially if it is based on a compiled language (C, C++, Julia). See the connected component results for an example. If speed is of utmost importance than finding the right package that implements a threaded version of the algorithm is probably the next consideration.

If you are looking for recommendations on packages coming from a R / Python background (like myself), I would recommend networkx to pick up the basics of graph algorithms. If you are looking for a next step up and a more performant solution, igraph and graph-tool and networkit seem like good choices, provided the out of the box algorithms offer all that you need. If you are willing to consider a new language, lightgraphs is very promising and seem to have a lower learning curve than other C / C++ alternatives. Of course, if you have a specific problem to solve - it is certainly worth to benchmark it, given that no package is broadly superior to all others. In that case, feel free to extend on my code and modify it to suit your needs.

## References

<div id="ref-igraph">
<p>Csardi, Gabor, and Tamas Nepusz. 2006. “The Igraph Software Package for Complex Network Research.” <em>InterJournal</em> Complex Systems: 1695. <a href="https://igraph.org/">https://igraph.org/</a>.</p>
</div>
<div id="ref-networkx">
<p>Hagberg, Aric, Pieter Swart, and Daniel S Chult. 2008. “Exploring Network Structure, Dynamics, and Function Using Networkx.” Los Alamos National Lab.(LANL), Los Alamos, NM (United States).</p>
</div>
<div id="ref-snapnets">
<p>Leskovec, Jure, and Andrej Krevl. 2014. “SNAP Datasets: Stanford Large Network Dataset Collection.” <a href="http://snap.stanford.edu/data">http://snap.stanford.edu/data</a>.</p>
</div>
<div id="ref-leskovec2016snap">
<p>Leskovec, Jure, and Rok Sosic. 2016. “SNAP: A General Purpose Network Analysis and Graph Mining Library.” <a href="http://arxiv.org/abs/1606.07550">http://arxiv.org/abs/1606.07550</a>.</p>
</div>
<div id="ref-snap">
<p>Leskovec, Jure, and Rok Sosič. 2016. “SNAP: A General-Purpose Network Analysis and Graph-Mining Library.” <em>ACM Transactions on Intelligent Systems and Technology (TIST)</em> 8 (1): 1.</p>
</div>
<div id="ref-murphy2010">
<p>Murphy, Richard C, Kyle B Wheeler, Brian W Barrett, and James A Ang. 2010. “Introducing the Graph 500.” <em>Cray Users Group (CUG)</em> 19: 45–74.</p>
</div>
<div id="ref-graphtool">
<p>Peixoto, Tiago P. 2014. “The Graph-Tool Python Library.” <em>Figshare</em>. <a href="https://doi.org/10.6084/m9.figshare.1164194">https://doi.org/10.6084/m9.figshare.1164194</a>.</p>
</div>
<div id="ref-peixoto">
<p>———. 2015. “Graph-Tool Performance Comparison.” <a href="https://graph-tool.skewed.de/performance">https://graph-tool.skewed.de/performance</a>.</p>
</div>
<div id="ref-lighgraphs">
<p>Seth Bromberger, James Fairbanks, and other contributors. 2017. “JuliaGraphs/Lightgraphs.jl: An Optimized Graphs Package for the Julia Programming Language.” <a href="https://doi.org/10.5281/zenodo.889971">https://doi.org/10.5281/zenodo.889971</a>.</p>
</div>
<div id="ref-networkit">
<p>Staudt, Christian L, Aleksejs Sazonovs, and Henning Meyerhenke. 2016. “NetworKit: A Tool Suite for Large-Scale Complex Network Analysis.” <em>Network Science</em> 4 (4): 508–30.</p>
</div>
