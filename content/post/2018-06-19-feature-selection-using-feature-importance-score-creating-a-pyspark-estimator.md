---
title: Feature Selection Using Feature Importance Score - Creating a PySpark Estimator
author: Timothy Lin
date: '2018-06-19'
slug: feature-selection-using-feature-importance-score-creating-a-pyspark-estimator
categories: ['python', 'spark', 'big data']
tags: []
subtitle: ''
---

In this post I discuss how to create a new pyspark estimator to integrate in an existing machine learning pipeline. This is an extension of my [previous post](https://www.timlrx.com/2018/04/08/creating-a-custom-cross-validation-function-in-pyspark/) where I discussed how to create a custom cross validation function. Recently, I have been looking at integrating existing code in the pyspark ML pipeline framework. A pipeline is a fantastic concept of abstraction since it allows the analyst to focus on the main tasks that needs to be carried out and allows the entire piece of work to be reusable.

As a fun and useful example, I will show how feature selection using feature importance score can be coded into a pipeline. I find Pyspark's MLlib native feature selection functions relatively limited so this is also part of an effort to extend the feature selection methods. Here, I use the feature importance score as estimated from a model (decision tree / random forest / gradient boosted trees) to extract the variables that are plausibly the most important.

First, let's setup the jupyter notebook and import the relevant functions. I use a local version of spark to illustrate how this works but one can easily use a yarn cluster instead.

```python
from IPython.core.interactiveshell import InteractiveShell
InteractiveShell.ast_node_interactivity = "all"

import numpy as np
import pandas as pd
pd.options.display.max_columns = None

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
from pyspark.sql.functions import *
from pyspark.ml.classification import  RandomForestClassifier
from pyspark.ml.feature import StringIndexer, OneHotEncoderEstimator, VectorAssembler, VectorSlicer
from pyspark.ml import Pipeline
from pyspark.ml.evaluation import BinaryClassificationEvaluator
from pyspark.ml.linalg import Vectors
from pyspark.ml.tuning import ParamGridBuilder, TrainValidationSplit
```

### Bank Marketing Data Set
To show the usefulness of feature selection and to sort of validate the script, I used the [Bank Marketing Data Set from UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/datasets/bank+marketing) as an example throughout this post. This comes from Moro et al., 2014 paper on A Data-Driven Approach to Predict the Success of Bank Telemarketing. As the name of the paper suggests, the goal of this dataset is to predict which bank customers would subscribe to a term deposit product as a result of a phone marketing campaign.

Let us read in the file and take a look at the variables of the dataset.


```python
df = spark.read.option("delimiter", ";").csv("../data/bank-additional/bank-additional-full.csv", header=True, inferSchema = True)
```


```python
df.dtypes
```

    [('age', 'int'),
     ('job', 'string'),
     ('marital', 'string'),
     ('education', 'string'),
     ('default', 'string'),
     ('housing', 'string'),
     ('loan', 'string'),
     ('contact', 'string'),
     ('month', 'string'),
     ('day_of_week', 'string'),
     ('duration', 'int'),
     ('campaign', 'int'),
     ('pdays', 'int'),
     ('previous', 'int'),
     ('poutcome', 'string'),
     ('emp.var.rate', 'double'),
     ('cons.price.idx', 'double'),
     ('cons.conf.idx', 'double'),
     ('euribor3m', 'double'),
     ('nr.employed', 'double'),
     ('y', 'string')]

There are some problematic variable names and we should replace the dot seperator with an underscore.

```python
df = df.toDF(*(c.replace('.', '_') for c in df.columns))
```

```python
df.limit(5).toPandas()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>age</th>
      <th>job</th>
      <th>marital</th>
      <th>education</th>
      <th>default</th>
      <th>housing</th>
      <th>loan</th>
      <th>contact</th>
      <th>month</th>
      <th>day_of_week</th>
      <th>duration</th>
      <th>campaign</th>
      <th>pdays</th>
      <th>previous</th>
      <th>poutcome</th>
      <th>emp_var_rate</th>
      <th>cons_price_idx</th>
      <th>cons_conf_idx</th>
      <th>euribor3m</th>
      <th>nr_employed</th>
      <th>y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>56</td>
      <td>housemaid</td>
      <td>married</td>
      <td>basic.4y</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>261</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
      <td>no</td>
    </tr>
    <tr>
      <th>1</th>
      <td>57</td>
      <td>services</td>
      <td>married</td>
      <td>high.school</td>
      <td>unknown</td>
      <td>no</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>149</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
      <td>no</td>
    </tr>
    <tr>
      <th>2</th>
      <td>37</td>
      <td>services</td>
      <td>married</td>
      <td>high.school</td>
      <td>no</td>
      <td>yes</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>226</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
      <td>no</td>
    </tr>
    <tr>
      <th>3</th>
      <td>40</td>
      <td>admin.</td>
      <td>married</td>
      <td>basic.6y</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>151</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
      <td>no</td>
    </tr>
    <tr>
      <th>4</th>
      <td>56</td>
      <td>services</td>
      <td>married</td>
      <td>high.school</td>
      <td>no</td>
      <td>no</td>
      <td>yes</td>
      <td>telephone</td>
      <td>may</td>
      <td>mon</td>
      <td>307</td>
      <td>1</td>
      <td>999</td>
      <td>0</td>
      <td>nonexistent</td>
      <td>1.1</td>
      <td>93.994</td>
      <td>-36.4</td>
      <td>4.857</td>
      <td>5191.0</td>
      <td>no</td>
    </tr>
  </tbody>
</table>
</div>

It's always nice to take a look at the distribution of the variables

```python
df.describe().toPandas()
```

<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>summary</th>
      <th>age</th>
      <th>job</th>
      <th>marital</th>
      <th>education</th>
      <th>default</th>
      <th>housing</th>
      <th>loan</th>
      <th>contact</th>
      <th>month</th>
      <th>day_of_week</th>
      <th>duration</th>
      <th>campaign</th>
      <th>pdays</th>
      <th>previous</th>
      <th>poutcome</th>
      <th>emp_var_rate</th>
      <th>cons_price_idx</th>
      <th>cons_conf_idx</th>
      <th>euribor3m</th>
      <th>nr_employed</th>
      <th>y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>count</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
      <td>41188</td>
    </tr>
    <tr>
      <th>1</th>
      <td>mean</td>
      <td>40.02406040594348</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>258.2850101971448</td>
      <td>2.567592502670681</td>
      <td>962.4754540157328</td>
      <td>0.17296299893172767</td>
      <td>None</td>
      <td>0.08188550063178392</td>
      <td>93.57566436828918</td>
      <td>-40.50260027191787</td>
      <td>3.6212908128585366</td>
      <td>5167.035910944004</td>
      <td>None</td>
    </tr>
    <tr>
      <th>2</th>
      <td>stddev</td>
      <td>10.421249980934057</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
      <td>259.27924883646455</td>
      <td>2.770013542902331</td>
      <td>186.9109073447414</td>
      <td>0.49490107983928927</td>
      <td>None</td>
      <td>1.57095974051703</td>
      <td>0.5788400489541355</td>
      <td>4.628197856174595</td>
      <td>1.7344474048512557</td>
      <td>72.25152766825924</td>
      <td>None</td>
    </tr>
    <tr>
      <th>3</th>
      <td>min</td>
      <td>17</td>
      <td>admin.</td>
      <td>divorced</td>
      <td>basic.4y</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>cellular</td>
      <td>apr</td>
      <td>fri</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>failure</td>
      <td>-3.4</td>
      <td>92.201</td>
      <td>-50.8</td>
      <td>0.634</td>
      <td>4963.6</td>
      <td>no</td>
    </tr>
    <tr>
      <th>4</th>
      <td>max</td>
      <td>98</td>
      <td>unknown</td>
      <td>unknown</td>
      <td>unknown</td>
      <td>yes</td>
      <td>yes</td>
      <td>yes</td>
      <td>telephone</td>
      <td>sep</td>
      <td>wed</td>
      <td>4918</td>
      <td>56</td>
      <td>999</td>
      <td>7</td>
      <td>success</td>
      <td>1.4</td>
      <td>94.767</td>
      <td>-26.9</td>
      <td>5.045</td>
      <td>5228.1</td>
      <td>yes</td>
    </tr>
  </tbody>
</table>
</div>

There are quite a few variables that are encoded as a string in this dataset. Converting strings to a binary indicator variable / dummy variable takes up quite a few degrees of freedom. In machine learning speak it might also lead to the model being overfitted. Let us take a look at what is represented by each variable that is of string type.


```python
for i in df.dtypes:
    if i[1]=='string':
        df.groupBy(i[0]).count().orderBy('count', ascending=False).toPandas()
```

<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>job</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>admin.</td>
      <td>10422</td>
    </tr>
    <tr>
      <th>1</th>
      <td>blue-collar</td>
      <td>9254</td>
    </tr>
    <tr>
      <th>2</th>
      <td>technician</td>
      <td>6743</td>
    </tr>
    <tr>
      <th>3</th>
      <td>services</td>
      <td>3969</td>
    </tr>
    <tr>
      <th>4</th>
      <td>management</td>
      <td>2924</td>
    </tr>
    <tr>
      <th>5</th>
      <td>retired</td>
      <td>1720</td>
    </tr>
    <tr>
      <th>6</th>
      <td>entrepreneur</td>
      <td>1456</td>
    </tr>
    <tr>
      <th>7</th>
      <td>self-employed</td>
      <td>1421</td>
    </tr>
    <tr>
      <th>8</th>
      <td>housemaid</td>
      <td>1060</td>
    </tr>
    <tr>
      <th>9</th>
      <td>unemployed</td>
      <td>1014</td>
    </tr>
    <tr>
      <th>10</th>
      <td>student</td>
      <td>875</td>
    </tr>
    <tr>
      <th>11</th>
      <td>unknown</td>
      <td>330</td>
    </tr>
  </tbody>
</table>
</div>
<br>



<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>marital</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>married</td>
      <td>24928</td>
    </tr>
    <tr>
      <th>1</th>
      <td>single</td>
      <td>11568</td>
    </tr>
    <tr>
      <th>2</th>
      <td>divorced</td>
      <td>4612</td>
    </tr>
    <tr>
      <th>3</th>
      <td>unknown</td>
      <td>80</td>
    </tr>
  </tbody>
</table>
</div>
<br>



<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>education</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>university.degree</td>
      <td>12168</td>
    </tr>
    <tr>
      <th>1</th>
      <td>high.school</td>
      <td>9515</td>
    </tr>
    <tr>
      <th>2</th>
      <td>basic.9y</td>
      <td>6045</td>
    </tr>
    <tr>
      <th>3</th>
      <td>professional.course</td>
      <td>5243</td>
    </tr>
    <tr>
      <th>4</th>
      <td>basic.4y</td>
      <td>4176</td>
    </tr>
    <tr>
      <th>5</th>
      <td>basic.6y</td>
      <td>2292</td>
    </tr>
    <tr>
      <th>6</th>
      <td>unknown</td>
      <td>1731</td>
    </tr>
    <tr>
      <th>7</th>
      <td>illiterate</td>
      <td>18</td>
    </tr>
  </tbody>
</table>
</div>
<br>



<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>default</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>no</td>
      <td>32588</td>
    </tr>
    <tr>
      <th>1</th>
      <td>unknown</td>
      <td>8597</td>
    </tr>
    <tr>
      <th>2</th>
      <td>yes</td>
      <td>3</td>
    </tr>
  </tbody>
</table>
</div>
<br>



<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>housing</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>yes</td>
      <td>21576</td>
    </tr>
    <tr>
      <th>1</th>
      <td>no</td>
      <td>18622</td>
    </tr>
    <tr>
      <th>2</th>
      <td>unknown</td>
      <td>990</td>
    </tr>
  </tbody>
</table>
</div>
<br>



<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>loan</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>no</td>
      <td>33950</td>
    </tr>
    <tr>
      <th>1</th>
      <td>yes</td>
      <td>6248</td>
    </tr>
    <tr>
      <th>2</th>
      <td>unknown</td>
      <td>990</td>
    </tr>
  </tbody>
</table>
</div>
<br>



<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>contact</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>cellular</td>
      <td>26144</td>
    </tr>
    <tr>
      <th>1</th>
      <td>telephone</td>
      <td>15044</td>
    </tr>
  </tbody>
</table>
</div>
<br>



<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>month</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>may</td>
      <td>13769</td>
    </tr>
    <tr>
      <th>1</th>
      <td>jul</td>
      <td>7174</td>
    </tr>
    <tr>
      <th>2</th>
      <td>aug</td>
      <td>6178</td>
    </tr>
    <tr>
      <th>3</th>
      <td>jun</td>
      <td>5318</td>
    </tr>
    <tr>
      <th>4</th>
      <td>nov</td>
      <td>4101</td>
    </tr>
    <tr>
      <th>5</th>
      <td>apr</td>
      <td>2632</td>
    </tr>
    <tr>
      <th>6</th>
      <td>oct</td>
      <td>718</td>
    </tr>
    <tr>
      <th>7</th>
      <td>sep</td>
      <td>570</td>
    </tr>
    <tr>
      <th>8</th>
      <td>mar</td>
      <td>546</td>
    </tr>
    <tr>
      <th>9</th>
      <td>dec</td>
      <td>182</td>
    </tr>
  </tbody>
</table>
</div>
<br>



<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>day_of_week</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>thu</td>
      <td>8623</td>
    </tr>
    <tr>
      <th>1</th>
      <td>mon</td>
      <td>8514</td>
    </tr>
    <tr>
      <th>2</th>
      <td>wed</td>
      <td>8134</td>
    </tr>
    <tr>
      <th>3</th>
      <td>tue</td>
      <td>8090</td>
    </tr>
    <tr>
      <th>4</th>
      <td>fri</td>
      <td>7827</td>
    </tr>
  </tbody>
</table>
</div>
<br>



<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>poutcome</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>nonexistent</td>
      <td>35563</td>
    </tr>
    <tr>
      <th>1</th>
      <td>failure</td>
      <td>4252</td>
    </tr>
    <tr>
      <th>2</th>
      <td>success</td>
      <td>1373</td>
    </tr>
  </tbody>
</table>
</div>
<br>



<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>y</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>no</td>
      <td>36548</td>
    </tr>
    <tr>
      <th>1</th>
      <td>yes</td>
      <td>4640</td>
    </tr>
  </tbody>
</table>
</div>


The number of categories for each string type is relatively small which makes creating binary indicator variables / one-hot encoding a suitable pre-processing step. Let us take a look at how to do feature selection using the feature importance score the manual way before coding it as an estimator to fit into a Pyspark pipeline.

### Data Preprocessing

Before we run the model on the most relevant features, we would first need to encode the string variables as binary vectors and run a random forest model on the whole feature set to get the feature importance score. Here I just run most of these tasks as part of a pipeline.


```python
# one hot encoding and assembling
encoding_var = [i[0] for i in df.dtypes if (i[1]=='string') & (i[0]!='y')]
num_var = [i[0] for i in df.dtypes if ((i[1]=='int') | (i[1]=='double')) & (i[0]!='y')]

string_indexes = [StringIndexer(inputCol = c, outputCol = 'IDX_' + c, handleInvalid = 'keep') for c in encoding_var]
onehot_indexes = [OneHotEncoderEstimator(inputCols = ['IDX_' + c], outputCols = ['OHE_' + c]) for c in encoding_var]
label_indexes = StringIndexer(inputCol = 'y', outputCol = 'label', handleInvalid = 'keep')
assembler = VectorAssembler(inputCols = num_var + ['OHE_' + c for c in encoding_var], outputCol = "features")
rf = RandomForestClassifier(labelCol="label", featuresCol="features", seed = 8464,
                            numTrees=10, cacheNodeIds = True, subsamplingRate = 0.7)

pipe = Pipeline(stages = string_indexes + onehot_indexes + [assembler, label_indexes, rf])
```


```python
mod = pipe.fit(df)
```


```python
df2 = mod.transform(df)
```

The feature importance score that is returned comes in the form of a sparse vector. This is not very human readable and we would need to map this to the actual variable names for some insights. I wrote a little function to return the variable names sorted by importance score as a pandas data frame. This was inspired by the following post on [stackoverflow](https://stackoverflow.com/questions/42935914/how-to-map-features-from-the-output-of-a-vectorassembler-back-to-the-column-name) 

```python
mod.stages[-1].featureImportances
```




    SparseVector(63, {0: 0.0257, 1: 0.1596, 2: 0.0037, 3: 0.2212, 4: 0.0305, 5: 0.0389, 6: 0.0762, 7: 0.0423, 8: 0.1869, 9: 0.063, 10: 0.0002, 12: 0.0003, 13: 0.0002, 14: 0.0003, 15: 0.0005, 16: 0.0002, 18: 0.0006, 19: 0.0003, 20: 0.0002, 21: 0.0, 22: 0.001, 23: 0.0003, 24: 0.0005, 26: 0.0005, 27: 0.0007, 28: 0.0008, 29: 0.0003, 30: 0.0, 31: 0.0001, 34: 0.0002, 35: 0.0021, 37: 0.0001, 38: 0.0003, 39: 0.0003, 40: 0.0003, 41: 0.0001, 42: 0.0002, 43: 0.0284, 44: 0.0167, 45: 0.0038, 46: 0.0007, 47: 0.0008, 48: 0.0132, 49: 0.0003, 50: 0.0014, 51: 0.0159, 52: 0.0114, 53: 0.0103, 54: 0.0036, 55: 0.0002, 56: 0.0021, 57: 0.0002, 58: 0.0006, 59: 0.0005, 60: 0.0158, 61: 0.0038, 62: 0.0121})




```python
def ExtractFeatureImp(featureImp, dataset, featuresCol):
    list_extract = []
    for i in dataset.schema[featuresCol].metadata["ml_attr"]["attrs"]:
        list_extract = list_extract + dataset.schema[featuresCol].metadata["ml_attr"]["attrs"][i]
    varlist = pd.DataFrame(list_extract)
    varlist['score'] = varlist['idx'].apply(lambda x: featureImp[x])
    return(varlist.sort_values('score', ascending = False))
```


```python
ExtractFeatureImp(mod.stages[-1].featureImportances, df2, "features").head(10)
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>idx</th>
      <th>name</th>
      <th>score</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>3</th>
      <td>3</td>
      <td>pdays</td>
      <td>0.221203</td>
    </tr>
    <tr>
      <th>8</th>
      <td>8</td>
      <td>euribor3m</td>
      <td>0.186892</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>duration</td>
      <td>0.159579</td>
    </tr>
    <tr>
      <th>6</th>
      <td>6</td>
      <td>cons_price_idx</td>
      <td>0.076177</td>
    </tr>
    <tr>
      <th>9</th>
      <td>9</td>
      <td>nr_employed</td>
      <td>0.063016</td>
    </tr>
    <tr>
      <th>7</th>
      <td>7</td>
      <td>cons_conf_idx</td>
      <td>0.042298</td>
    </tr>
    <tr>
      <th>5</th>
      <td>5</td>
      <td>emp_var_rate</td>
      <td>0.038875</td>
    </tr>
    <tr>
      <th>4</th>
      <td>4</td>
      <td>previous</td>
      <td>0.030470</td>
    </tr>
    <tr>
      <th>43</th>
      <td>43</td>
      <td>OHE_contact_cellular</td>
      <td>0.028401</td>
    </tr>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>age</td>
      <td>0.025732</td>
    </tr>
  </tbody>
</table>
</div>


Now that we have the most important faatures in a nicely formatted list, we can extract the top 10 features and create a new input vector column with only these variables. Pyspark has a VectorSlicer function that does exactly that. A new model can then be trained just on these 10 variables.


```python
varlist = ExtractFeatureImp(mod.stages[-1].featureImportances, df2, "features")
```


```python
varidx = [x for x in varlist['idx'][0:10]]
```


```python
varidx
```




    [3, 8, 1, 6, 9, 7, 5, 4, 43, 0]




```python
slicer = VectorSlicer(inputCol="features", outputCol="features2", indices=varidx)
df3 = slicer.transform(df2)
```


```python
df3 = df3.drop('rawPrediction', 'probability', 'prediction')
rf2 = RandomForestClassifier(labelCol="label", featuresCol="features2", seed = 8464,
                            numTrees=10, cacheNodeIds = True, subsamplingRate = 0.7)
mod2 = rf2.fit(df3)
df4 = mod2.transform(df3)
```

### Building the estimator function
Now let us learn to build a new pipeline object that makes the above task easy! 

First a bit of theory as taken from the [ML pipeline documentation](https://spark.apache.org/docs/2.3.0/ml-pipeline.html):

>__DataFrame__: This ML API uses DataFrame from Spark SQL as an ML dataset, which can hold a variety of data types. E.g., a DataFrame could have different columns storing text, feature vectors, true labels, and predictions.  
__Transformer__: A Transformer is an algorithm which can transform one DataFrame into another DataFrame. E.g., an ML model is a Transformer which transforms a DataFrame with features into a DataFrame with predictions.  
__Estimator__: An Estimator is an algorithm which can be fit on a DataFrame to produce a Transformer. E.g., a learning algorithm is an Estimator which trains on a DataFrame and produces a model.  
__Pipeline__: A Pipeline chains multiple Transformers and Estimators together to specify an ML workflow.

The important thing to remember is that the pipeline object has two components. The first is the estimator which returns a model and the second is the model/transformer which returns a dataframe.

We begin by coding up the estimator object. The cross-validation function in the [previous post](https://www.timlrx.com/2018/04/08/creating-a-custom-cross-validation-function-in-pyspark/) provides a thorough walk-through on creating the estimator object and params needed. In this case, I wanted the function to select either the top n features or based on a certain cut-off so these parameters are included as arguments to the function. An estimator (either decision tree / random forest / gradient boosted trees) is also required as an input.

```python
def __init__(self, estimator = None, selectorType = "numTopFeatures",
                 numTopFeatures = 20, threshold = 0.01, outputCol = "features")
```

Given a dataset we can write a fit function that extracts the feature importance scores

```python
mod = est.fit(dataset)
dataset2 = mod.transform(dataset)
varlist = ExtractFeatureImp(mod.featureImportances, dataset2, est.getFeaturesCol())
```
Some conditional statements to select the correct indexes that corresponds to the feature we want to extract. This gives us the output of the model - a list of features we want to extract.

```python
if (selectorType == "numTopFeatures"):
    varidx = [x for x in varlist['idx'][0:nfeatures]]
elif (selectorType == "threshold"):
    varidx = [x for x in varlist[varlist['score'] > threshold]['idx']]
```

Now for the second part of the problem - we want to take this list of features and create a transform function that returns the dataset with a new column containing our most relevant features. Sounds familiar? This is exactly what the VectorSlicer transformer does. So there is no need to re-invent the wheel and we can just reurn a VectorSlicer with the correct indices to slice.


```python
return VectorSlicer(inputCol = est.getFeaturesCol(),
                           outputCol = outputCol,
                           indices = varidx)
```

That concludes our new feature selection estimator! The full code can be obtained [here](https://gist.github.com/timlrx/1d5fdb0a43adbbe32a9336ba5c85b1b2).

### Putting the new function to the test
Let's try out the new function. I saved it as a file called FeatureImportanceSelector.py. Notice there is a new pipeline object called fis (featureImpSelector). This takes in the first random forest model and uses the feature importance score from it to extract the top 10 variables.

```python
from FeatureImportanceSelector import ExtractFeatureImp, FeatureImpSelector
```


```python
# one hot encoding and assembling
encoding_var = [i[0] for i in df.dtypes if (i[1]=='string') & (i[0]!='y')]
num_var = [i[0] for i in df.dtypes if ((i[1]=='int') | (i[1]=='double')) & (i[0]!='y')]

string_indexes = [StringIndexer(inputCol = c, outputCol = 'IDX_' + c, handleInvalid = 'keep') for c in encoding_var]
onehot_indexes = [OneHotEncoderEstimator(inputCols = ['IDX_' + c], outputCols = ['OHE_' + c]) for c in encoding_var]
label_indexes = StringIndexer(inputCol = 'y', outputCol = 'label', handleInvalid = 'keep')
assembler = VectorAssembler(inputCols = num_var + ['OHE_' + c for c in encoding_var], outputCol = "features")

rf = RandomForestClassifier(labelCol="label", featuresCol="features", seed = 8464,
                            numTrees=10, cacheNodeIds = True, subsamplingRate = 0.7)
fis = FeatureImpSelector(estimator = rf, selectorType = "numTopFeatures",
                         numTopFeatures = 10, outputCol = "features_subset")
rf2 = RandomForestClassifier(labelCol="label", featuresCol="features_subset", seed = 8464,
                            numTrees=10, cacheNodeIds = True, subsamplingRate = 0.7)

pipe = Pipeline(stages = string_indexes + onehot_indexes + [assembler, label_indexes, fis, rf2])
```


```python
pipeline_mod = pipe.fit(df)
```


```python
df2 = pipeline_mod.transform(df)
```


```python
ExtractFeatureImp(mod.stages[-1].featureImportances, df2, "features_subset")
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>idx</th>
      <th>name</th>
      <th>score</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>3</th>
      <td>3</td>
      <td>cons_price_idx</td>
      <td>0.221203</td>
    </tr>
    <tr>
      <th>9</th>
      <td>8</td>
      <td>OHE_contact_cellular</td>
      <td>0.186892</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>euribor3m</td>
      <td>0.159579</td>
    </tr>
    <tr>
      <th>6</th>
      <td>6</td>
      <td>emp_var_rate</td>
      <td>0.076177</td>
    </tr>
    <tr>
      <th>8</th>
      <td>9</td>
      <td>age</td>
      <td>0.063016</td>
    </tr>
    <tr>
      <th>7</th>
      <td>7</td>
      <td>previous</td>
      <td>0.042298</td>
    </tr>
    <tr>
      <th>5</th>
      <td>5</td>
      <td>cons_conf_idx</td>
      <td>0.038875</td>
    </tr>
    <tr>
      <th>4</th>
      <td>4</td>
      <td>nr_employed</td>
      <td>0.030470</td>
    </tr>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>pdays</td>
      <td>0.025732</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2</td>
      <td>duration</td>
      <td>0.003744</td>
    </tr>
  </tbody>
</table>
</div>

10 features as intended and not suprisingly, it matches the top 10 features as generated by our previous non-pipeline method. 

Hope you found the tutorial useful and maybe it will inspire you to create more useful extensions for pyspark.
