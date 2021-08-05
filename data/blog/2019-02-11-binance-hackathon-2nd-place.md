---
title: Binance hackathon - 2nd place solution
author: Timothy Lin
date: '2019-02-11'
tags: ['javascript', 'react', 'visualisation', 'networks', 'notes', 'crypto']
summary: 'Technical overview of our 2nd place solution and my experience at the Binance hackathon'
---

It has been about a month since my team and I placed 2nd in a [hackathon organised by Binance](https://www.binance.com/en/blog/294032626086199296/Binance-SAFU-Hackathon-Making-the-Blockchain-World-More-SAFU). Since it was my first time officially doing front-end development, I thought it would be fun to blog about my experience in the hackathon and document the technical solution which I coded up in react.js.

<script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>

{<blockquote className="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">A massive congratulations to the three winning teams of the <a href="https://twitter.com/hashtag/Binance?src=hash&ref_src=twsrc%5Etfw">#Binance</a> <a href="https://twitter.com/hashtag/SAFU?src=hash&ref_src=twsrc%5Etfw">#SAFU</a> Hackathon who shared a prize of $100,000 USD worth of <a href="https://twitter.com/search?q=%24BNB&src=ctag&ref_src=twsrc%5Etfw">$BNB</a>! Teams Perlin, Crypto Lynx &amp; the overall winners Merkle Blox we salute you! <a href="https://twitter.com/hashtag/BUIDL?src=hash&ref_src=twsrc%5Etfw">#BUIDL</a> <a href="https://twitter.com/hashtag/BinanceBlockchainWeek?src=hash&ref_src=twsrc%5Etfw">#BinanceBlockchainWeek</a> <a href="https://t.co/ywixYx43S7">pic.twitter.com/ywixYx43S7</a></p>— Binance (@binance) <a href="https://twitter.com/binance/status/1087288650608472064?ref_src=twsrc%5Etfw">January 21, 2019</a></blockquote>
}

## Background

[Binance](https://www.binance.com/en) is the biggest cryptocurrency exchange in the world. It organised the hackathon to prototype solutions to combat fraud and make the crypto-space more secure.

My team came together quite last minute and consists of Basile (blockchain expert), Michael (cyber security consultant), Chema (data engineer), Dr Gabor (data scientist), and myself. Stacked with analytical experts and backed by my company's analytical software (LynxKite), I decided to work on the frontend parts of the project. I thought it was a nice opportunity to put my javascript skills to the test and take a break from my usual day job.^[I should blog about my motivation to learn web development in another post.]

We probably won it due to our business idea and analytics potential rather than the front-end web portal, but nevertheless I think the web-app is still a cool output for a 24 hours project and something worth sharing about.

## Our Business Solution

Here's a picture which describes the gist of our solution:

![](/static/img/cryptolynx_idea.png)

Basically, we proposed building a wall around the exchanges to prevent fraudulent users from cashing out their cryptocurrencies to fiat money. We realised that there are three main features which makes fraud detection in the cryptocurrency space unique:

1. The identities of the wallets are anonymous

2. It's very easy to create new wallets

3. Transactions are non-reversible

Features 1 and 2 make it very difficult to trace the chain of scams while features 1 and 3 create little or no incentive for an individual to report a scam, even is he is a victim. We suggested using graph analytics and machine learning solutions to solve the problem of identifying fraudulent addresses. However, it is impossible to run any machine learning if there is no dataset. Hence, our solution involves giving potential scam victims an avenue to retrieve their funds and incentivise reporting of fraudulent actors. As the main intermediaries between the crypto-world and fiat money, exchanges could play a role in intercepting fraudulent transactions.

## The Frontend Graph Explorer

As part of the solution we showcased a graph explorer that would enable an analyst to trace the trail of potential scam nodes / money laundering activities. You can check out a demo of the app at: https://cryptolynx.netlify.com/console/.

It takes in an Ethereum address and visualise its transactions as a graph network. You can input any address from Etherscan (it uses their API) or try this one, 0x4203f8bF23805B269b1543E52C869A7aFB9946cd, which creates a nice branching structure.

Each node represents an Ethereum address and an edge shows the direction of Ethereum transfer between two addresses with the value of transaction displayed above it.

Click on a node to view important information related to it. You can trace the trail of transactions by clicking the `Expand Node` button and watch the graph unfold.

Some caveats:

1. The current information shown on each node is randomly generated. In the original solution it would come from a backend server but since we shut down the cluster, I just replaced it with random values.

2. The nodes would be coloured by the risk of it being a fraudulent node. In this demo, I coloured it such that each node that is expanded on is orange while the rest are light blue.

3. Explore in LynxKite does not work (sorry that is a proprietary tool).

4. Certain addresses make way too many transactions (e.g. exchanges). For those, I show only the top 1000 transactions.

## Techincal Overview

I wrote the app in `React.js` using the Semantic UI framework. The network graph was based on [react graph vis](https://www.npmjs.com/package/react-graph-vis) component, though I also experimented with a [react sigma.js library](https://www.npmjs.com/package/react-sigma). For navigation, I used the standard react-router library.

No particular reasons for choosing Semantic UI. I am still experimenting with the different UI frameworks out there and decided to try Semantic UI for the first time. Turns out to be a little harder to get the hang of it then I initially thought. The semantics become apparent only after using it repeatedly, but I find myself referring to the documentation more often than I would have liked.

The choice between which network visualisation package to use is a little more difficult. `React.js` has a certain declarative style to it which makes the implementation of native javascript libraries more tricky. Since users have created a react component for both `sigma.js`and `vis.js`, they were the main libraries I tried to implement. While `sigma.js` supports many user-defined layouts, the nesting of each of these features makes for a more convoluted syntax then the `vis.js` alternative.The `vis.js` library also offers more out of the box, such as the ability to drag and drop nodes.

The main app can be divided into 3 parts: The search bar, the graph visualisation, and the side panel which displays additional statistics relevant to a selected node. In the following sections, I outline the code to create the 3 components.

![](/static/img/cryptolynx_ui.png)

### The Search Bar

This part is relatively straight forward. We want to create a component that takes in an Ethereum address, searches for all transactions using the [Etherscan API](https://etherscan.io/apis) and stores the address. For the output side, we create a form object which updates the address when it is changed and queries the API when the form is submitted.

```javascript
<Form onSubmit={this.onSubmit}>
  <Input
    style={{ width: '80%' }}
    loading={isLoading}
    icon={<Icon name="search" link onClick={this.onSubmit} />}
    placeholder="Enter Address..."
    onChange={this.onChange}
  />
</Form>
```

The `onChange` function contains the following code:

```javascript
onChange = (event) => {
  this.setState({ address: event.target.value.toLowerCase() })
}
```

While the `onSubmit` function looks like this:

```javascript
onSubmit = () => {
  const { address } = this.state
  this.queryTransactionsAPI(address)
  this.setState({
    newQuery: true,
    isLoading: true,
  })
}
```

Here we introduced two new state variables, `newQuery`, to keep track whether a query is new or additional and `isLoading`, which returns the status of the API call. `queryTransactionsAPI` is the main function which sends a GET request to the Etherscan API. We do not put it in the onSubmit button as there would be other cases where we need to get the transactions data through other events (expand node button).

```javascript
queryTransactionsAPI = (address) => {
  axios
    .get(
      `${ETHER_API_PATH}&address=${address}&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc&${ETHER_API_KEY}`,
      {}
    )
    .then((response) => response.data)
    .then((data) => {
      this.updateQueriedNodes(address)
      return data
    })
    .then((data) => this.storeEdges(data.result))
    .catch((error) => console.log(error))
}
```

### The Graph Visualisation

With a given Ethereum address we want to plot the transaction graph in the browser. React graph vis has a relatively simple API. The component takes a graph, events and options object. I bundled it up to create a `GraphVis` component which specifies certain default options and a loading property. Here is what it looks like:

```javascript
class GraphVis extends Component {
  render() {
    const { loading, graph, events } = this.props

    return (
      <Fragment>
        <div style={{ height: '60vh' }}>
          {loading ? 'Loading...' : ' '}
          <Graph graph={graph} options={options} events={events} />
        </div>
      </Fragment>
    )
  }
}
export default GraphVis
```

For the render section in the main component we call the `GraphVis` component.

```javascript
<GraphVis graph={graph} events={events} loading={isLoading} />
```

Loading is already defined in the previous search bar so let's turn our attention back to creating the graph. We will specify the events object in the next section when we are dealing with the graph object. Recall that in the `queryTransactionsAPI` function, we use the `axios` library to fetch our request and the output is fed into two functions, `updateQueriedNodes` and `storeEdges`. The former function simply stores the latest list of queried nodes in a state variable:

```javascript
updateQueriedNodes = (address) => {
  this.setState({ queriedNodes: [...this.state.queriedNodes, address] })
}
```

The `storeEdges` function stores the results from the API in as an edge list. Since there might be multiple transactions between two individuals, we have to summarise and group it as a single edge. If the query is not new, we also need to combine the set of edges with the existing ones.

```javascript
storeEdges = (result) => {
  const { edges, newQuery } = this.state
  this.setState({ data: result })
  const newEdges = []
  for (let i in result) {
    let item = result[i]
    const edge = {
      id: item.hash,
      from: item.from,
      to: item.to,
      value: Number(item.value) / XRATE,
      label: item.value,
    }
    newEdges.push(edge)
  }

  const processedEdges = [
    ...newEdges
      .reduce((r, o) => {
        const key = o.from + '-' + o.to
        const item =
          r.get(key) ||
          Object.assign({}, o, {
            value: 0,
            label: 0,
            numTransactions: 0,
          })
        item.value += o.value
        item.label = (Math.round(item.value * 1000) / 1000).toString()
        item.numTransactions += 1
        item.id = o.id

        return r.set(key, item)
      }, new Map())
      .values(),
  ]

  const oldEdges = newQuery ? [] : edges

  const updatedEdges = [...oldEdges, ...processedEdges]

  const uniqueEdges = uniqBy(updatedEdges, 'id')

  this.setState({ edges: uniqueEdges }, this.storeNodes)
}
```

Now we can process the edges to obtain the nodes for the graph. At the same time, we colour the nodes orange if they are part of the queried nodes, otherwise we leave them as blue.

```javascript
storeNodes = () => {
  const { nodes, edges, queriedNodes, newQuery } = this.state
  const newNodes = []
  const newNodes2 = []
  for (let i = 0; i < edges.length; i++) {
    newNodes.push({ id: edges[i].from, title: edges[i].from })
    newNodes.push({ id: edges[i].to, title: edges[i].to })
  }

  for (let i = 0; i < newNodes.length; i++) {
    const nodeColor = queriedNodes.includes(newNodes[i].id) ? '#ff9a02' : '#84b3ff'
    newNodes2.push({ id: newNodes[i].id, title: newNodes[i].id, color: nodeColor })
  }

  const oldNodes = newQuery ? [] : nodes

  const updatedNodes = [...newNodes2, ...oldNodes]
  const uniqueNodes = uniqBy(updatedNodes, 'id')

  this.setState({ nodes: uniqueNodes }, () => this.updateGraph(uniqueNodes, this.state.edges))
}
```

We are ready to create a graph object from the nodes and edges:

```javascript
updateGraph = (nodes, edges) => {
  const newGraph = { nodes: [...nodes], edges: [...edges] }
  this.setState({
    graph: newGraph,
    isLoading: false,
  })
}
```

That sums up the graph object, so let's turn our attention to the side panel and creating the expanding graph structure.

### The Side Panel

The side panel consists of the selected node, some summary statistics about it and a button to expand the node. Here is what the render function looks like.^[I exclude the list of summary statistics for brevity. One could put data from a backend API but in this the demo I just filled it with random data.]

```javascript
<div style={{ textAlign: 'left' }}>
  <b>{selectedNode}</b>
  <Button color="blue" fluid size="medium" onClick={() => this.onExpandNode()}>
    Expand Node
  </Button>
  <br />
  <Button color="green" fluid size="medium">
    Explore in LynxKite
  </Button>
  <Button
    color="blue"
    fluid
    size="medium"
    onClick={() => this.downloadJSON()}
    style={{ position: 'absolute', bottom: 0 }}
  >
    Export graph as Json
  </Button>
</div>
```

The above code is wrapped in a conditional statement that displays the side panel if a node is selected. How do we know if a node is selected? That goes back to the events object which we used as an input to `GraphVis` but did not specify. It looks like this:

```javascript
const events = {
  select: (e) => this.onNodeClick(e),
}
```

`onNodeClick` simply saves the identity of the selected node.

```javascript
onNodeClick = (e) => {
  const { nodes } = e
  this.setState({ selectedNode: nodes[0] })
}
```

Now the last thing we have to do is to write the `onExpandNode` function to call the `queryTransactionsAPI` which will add the new edge set to the previous edge list and build the new graph which would be reflected in the network visualisation.

```javascript
onExpandNode = () => {
  this.queryTransactionsAPI(this.state.selectedNode)
  this.setState({
    newQuery: false,
    isLoading: true,
  })
}
```

Since, we did the hard work of combining the new edge list with the old edge list and the new node list with the old node list previously, we can now sit back expand the nodes and watch the graph bloom.

![](/static/img/cryptolynx_bloom.png)

## Post Hackathon Thoughts

Of course, the above description makes it seem easier than it actually was. Well, if I was familiar with the UI framework, more well versed with the graph javascript libraries, I would require less time experimenting and more time implementing actual features. My sleeping scheduled suffered for that, but I guess part of the fun of such hackathons is to try something new, which I definitely did.

On the coding side, I enjoyed the flexibility and adaptability of the React.js ecosystem which makes creating nice, responsive web app relatively easy. Materials UI made nice looking layouts while I could simply reuse some existing old code to create a new interface for this project. In fact, it probably took me more time to remove the actual login components and substituted it with a dummy one then if I had copied an old one I previously created which is integrated with my Amazon user pool.

The hackathon also made me more aware on the importance of having a proper debugging workflow. Printing to console repeatedly seems like a very rudimentary procedure to diagnose bugs and I should look into better methods to be more efficient.

Having said that, sleep is definitely a factor affecting performance and I can't believe how many bugs I detected after cleaning up the project a few days later. Or maybe it is the pressure and the timeline which compels one to adopt a tunnel vision approach in solving a problem, rather than looking at the program as a whole.

The follow-up conference was really interesting as well and I think I learnt more about cryptocurrencies and blockchains in those two days then the past two years. It was a nice surprise to bump into some familiar faces in the event and learn from others in the field.

To close, I want to thank the crypto-community for being so generous in sharing their knowledge and to Binance for the well-organised hackathon as well as the BNBs.
