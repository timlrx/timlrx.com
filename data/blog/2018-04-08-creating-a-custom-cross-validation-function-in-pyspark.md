---
title: Creating a Custom Cross-Validation Function in PySpark
author: Timothy Lin
date: '2018-04-08'
lastmod: '2021-01-16'
tags: ['python', 'spark', 'big data']
summary: Custom cross-validation class written in PySpark with support for user-defined category such as by time, geographical or consumer segments.
---

### Introduction

Lately, I have been using PySpark in my data processing and modeling pipeline. While Spark is great for most data processing needs, the machine learning component is slightly lacking. Coming from R and Python's scikit-learn where there are so many machine learning packages available, this limitation is frustrating. Having said that, there are ongoing efforts to improve the machine learning library so hopefully there would be more functionalities in the future.

One of the problems that I am solving involves a time series component to the task of prediction. As such, k-fold cross-validation techniques, which is available in PySpark, would not give an accurate representation of the model's performance. For such problems doing a rolling window approach to cross-validation is much better i.e. repeating the process of training the model on a lagged time period and testing the performance on a recent period.

However, other variants of cross-validation is not supported by PySpark. As of PySpark 2.3 it supports a k-fold version and a simple random split into train / test dataset. Normally, it would be difficult to create a customise algorithm on PySpark as most of the functions call their Scala equivalent, which is the native language of Spark. Thankfully, the [cross-validation function](https://github.com/apache/spark/blob/master/python/pyspark/ml/tuning.py) is largely written using base PySpark functions before being parallelise as tasks and distributed for computation. The rest of this post discusses my implementation of a custom cross-validation class.

### Implementation

First, we will use the `CrossValidator` class as a template to base our new class on. The two main portions that need to be changed are the `__init__` and `_fit` functions. Let's take a look at the `__init__` function first.

```python
    @keyword_only
    def __init__(self, estimator=None, estimatorParamMaps=None, evaluator=None, numFolds=3,
                 seed=None, parallelism=1):

        super(CrossValidator, self).__init__()
        self._setDefault(numFolds=3, parallelism=1)
        kwargs = self._input_kwargs
        self._set(**kwargs)
```

Rather than the typical `self.input = input` kind of statements, PySpark uses a decorator (`@keyword_only`) to assign the inputs as params. So this means that we would have to define additional params before assigning them as inputs when initialising the class.

Now let us examine the `_fit` function:

```python
   def _fit(self, dataset):
        est = self.getOrDefault(self.estimator)
        epm = self.getOrDefault(self.estimatorParamMaps)
        numModels = len(epm)
        eva = self.getOrDefault(self.evaluator)
        nFolds = self.getOrDefault(self.numFolds)
        seed = self.getOrDefault(self.seed)
        h = 1.0 / nFolds
        randCol = self.uid + "_rand"
        df = dataset.select("*", rand(seed).alias(randCol))
        metrics = [0.0] * numModels

        pool = ThreadPool(processes=min(self.getParallelism(), numModels))

        for i in range(nFolds):
            validateLB = i * h
            validateUB = (i + 1) * h
            condition = (df[randCol] >= validateLB) & (df[randCol] < validateUB)
            validation = df.filter(condition).cache()
            train = df.filter(~condition).cache()

            tasks = _parallelFitTasks(est, train, eva, validation, epm)
            for j, metric in pool.imap_unordered(lambda f: f(), tasks):
                metrics[j] += (metric / nFolds)
            validation.unpersist()
            train.unpersist()
```

The main thing to note here is the way to retrieve the value of a parameter using the `getOrDefault` function. We also see how PySpark implements the k-fold cross-validation by using a column of random numbers and using the `filter` function to select the relevant fold to train and test on. That would be the main portion which we will change when implementing our custom cross-validation function. In addition, I would also like to print some information on the progress status of the task as well as the results of the cross-validation.

Here's the full custom cross-validation class. It loops through a dictionary of datasets and identifies which column to train and test via the cvCol and splitWord inputs. This is actually the second version of my cross-validation class. The first one runs on a merged dataset but in some cases the union operation messes up the metadata so I modified the code to take in a dictionary as an input insted.

```python
class CustomCrossValidator(Estimator, ValidatorParams, HasParallelism, MLReadable, MLWritable):
    """
    Modifies CrossValidator allowing custom train and test dataset to be passed into the function
    Bypass generation of train/test via numFolds
    instead train and test set is user define
    """

    splitWord = Param(Params._dummy(), "splitWord", "Tuple to split train and test set e.g. ('train', 'test')",
                      typeConverter=TypeConverters.toListString)
    cvCol = Param(Params._dummy(), "cvCol", "Column name to filter train and test list",
                      typeConverter=TypeConverters.toString)

    @keyword_only
    def __init__(self, estimator=None, estimatorParamMaps=None, evaluator=None,
                 splitWord = ('train', 'test'), cvCol = 'cv', seed=None, parallelism=1):

        super(CustomCrossValidator, self).__init__()
        self._setDefault(parallelism=1)
        kwargs = self._input_kwargs
        self._set(**kwargs)

    def _fit(self, dataset):
        est = self.getOrDefault(self.estimator)
        epm = self.getOrDefault(self.estimatorParamMaps)
        numModels = len(epm)
        eva = self.getOrDefault(self.evaluator)
        nFolds = len(dataset)
        seed = self.getOrDefault(self.seed)
        metrics = [0.0] * numModels
        matrix_metrics = [[0 for x in range(nFolds)] for y in range(len(epm))]

        pool = ThreadPool(processes=min(self.getParallelism(), numModels))

        for i in range(nFolds):
            validation = dataset[list(dataset.keys())[i]].filter(col(self.getOrDefault(self.cvCol))==(self.getOrDefault(self.splitWord))[0]).cache()
            train = dataset[list(dataset.keys())[i]].filter(col(self.getOrDefault(self.cvCol))==(self.getOrDefault(self.splitWord))[1]).cache()

            print('fold {}'.format(i))
            tasks = _parallelFitTasks(est, train, eva, validation, epm)
            for j, metric in pool.imap_unordered(lambda f: f(), tasks):
                # print(j, metric)
                matrix_metrics[j][i] = metric
                metrics[j] += (metric / nFolds)
            # print(metrics)
            validation.unpersist()
            train.unpersist()

        if eva.isLargerBetter():
            bestIndex = np.argmax(metrics)
        else:
            bestIndex = np.argmin(metrics)

        for i in range(len(metrics)):
            print(epm[i], 'Detailed Score {}'.format(matrix_metrics[i]), 'Avg Score {}'.format(metrics[i]))

        print('Best Model: ', epm[bestIndex], 'Detailed Score {}'.format(matrix_metrics[bestIndex]),
              'Avg Score {}'.format(metrics[bestIndex]))

        ### Do not bother to train on full dataset, just the latest train supplied
        # bestModel = est.fit(dataset, epm[bestIndex])
        bestModel = est.fit(train, epm[bestIndex])
        return self._copyValues(CrossValidatorModel(bestModel, metrics))
```

Let's test it out on a similar example as the one in the source code:

```python
import findspark
findspark.init()

from pyspark import SparkContext
from pyspark import SQLContext
```

```python
sc = SparkContext()
spark = SQLContext(sc)
```

```python
from CustomCrossValidatorDict import CustomCrossValidator
```

```python
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.evaluation import BinaryClassificationEvaluator
from pyspark.ml.linalg import Vectors
from pyspark.ml.tuning import ParamGridBuilder
```

```python
d = {}
d['df1'] = spark.createDataFrame(
     [(Vectors.dense([0.0]), 0.0, 'train'),
     (Vectors.dense([0.4]), 1.0, 'train'),
     (Vectors.dense([0.5]), 0.0, 'train'),
     (Vectors.dense([0.6]), 1.0, 'train'),
     (Vectors.dense([1.0]), 1.0, 'train'),
     (Vectors.dense([0.0]), 0.0, 'test'),
     (Vectors.dense([0.4]), 1.0, 'test'),
     (Vectors.dense([0.5]), 0.0, 'test'),
     (Vectors.dense([0.6]), 1.0, 'test'),
     (Vectors.dense([1.0]), 1.0, 'test')] * 10,
     ["features", "label", 'cv'])
d['df2'] = spark.createDataFrame(
     [(Vectors.dense([0.0]), 0.0, 'train'),
     (Vectors.dense([0.4]), 1.0, 'train'),
     (Vectors.dense([0.5]), 0.0, 'train'),
     (Vectors.dense([0.6]), 1.0, 'train'),
     (Vectors.dense([1.0]), 1.0, 'train'),
     (Vectors.dense([0.0]), 0.0, 'test'),
     (Vectors.dense([0.4]), 1.0, 'test'),
     (Vectors.dense([0.5]), 0.0, 'test'),
     (Vectors.dense([0.6]), 1.0, 'test'),
     (Vectors.dense([1.0]), 1.0, 'test')] * 10,
     ["features", "label", 'cv'])
lr = LogisticRegression()
grid = ParamGridBuilder().addGrid(lr.maxIter, [0, 1, 5]).build()
evaluator = BinaryClassificationEvaluator()
```

```python
cv = CustomCrossValidator(estimator=lr, estimatorParamMaps=grid, evaluator=evaluator,
     splitWord = ('train', 'test'), cvCol = 'cv', parallelism=4)
```

```python
cv.extractParamMap()
```

```
{Param(parent='CustomCrossValidator_4acca941d35632cf8f28', name='parallelism', doc='the number of threads to use when running parallel algorithms (>= 1).'): 4,
Param(parent='CustomCrossValidator_4acca941d35632cf8f28', name='seed', doc='random seed.'): 7665653429569288359,
Param(parent='CustomCrossValidator_4acca941d35632cf8f28', name='estimator', doc='estimator to be cross-validated'): LogisticRegression_487fb6aaeb91e051211c,
Param(parent='CustomCrossValidator_4acca941d35632cf8f28', name='estimatorParamMaps', doc='estimator param maps'): [{Param(parent='LogisticRegression_487fb6aaeb91e051211c', name='maxIter', doc='max number of iterations (>= 0).'): 0},
{Param(parent='LogisticRegression_487fb6aaeb91e051211c', name='maxIter', doc='max number of iterations (>= 0).'): 1},
{Param(parent='LogisticRegression_487fb6aaeb91e051211c', name='maxIter', doc='max number of iterations (>= 0).'): 5}],
Param(parent='CustomCrossValidator_4acca941d35632cf8f28', name='evaluator', doc='evaluator used to select hyper-parameters that maximize the validator metric'): BinaryClassificationEvaluator_44cc9ebbba7a7a85e22e,
Param(parent='CustomCrossValidator_4acca941d35632cf8f28', name='splitWord', doc="Tuple to split train and test set e.g. ('train', 'test')"): ['train',
'test'],
Param(parent='CustomCrossValidator_4acca941d35632cf8f28', name='cvCol', doc='Column name to filter train and test list'): 'cv'}
```

```python
cvModel = cv.fit(d)
```

```
fold 0
fold 1
{Param(parent='LogisticRegression_487fb6aaeb91e051211c', name='maxIter', doc='max number of iterations (>= 0).'): 0} Detailed Score [0.5, 0.5] Avg Score 0.5
{Param(parent='LogisticRegression_487fb6aaeb91e051211c', name='maxIter', doc='max number of iterations (>= 0).'): 1} Detailed Score [0.8333333333333333, 0.8333333333333333] Avg Score 0.8333333333333333
{Param(parent='LogisticRegression_487fb6aaeb91e051211c', name='maxIter', doc='max number of iterations (>= 0).'): 5} Detailed Score [0.8333333333333333, 0.8333333333333333] Avg Score 0.8333333333333333
Best Model:  {Param(parent='LogisticRegression_487fb6aaeb91e051211c', name='maxIter', doc='max number of iterations (>= 0).'): 1} Detailed Score [0.8333333333333333, 0.8333333333333333] Avg Score 0.8333333333333333`
```

### Concluding Thoughts

Hope this post has been useful! The custom cross-validation class is really quite handy. It can be used for time series problems as well as times when you want to test a model's performance over different geographical areas or customer segments. Took some time to work through the PySpark source code but my understanding of it has definitely improved after this episode.
