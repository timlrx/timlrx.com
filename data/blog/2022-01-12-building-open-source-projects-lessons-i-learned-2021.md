---
title: Building open source projects - Lessons learned (2021)
date: '2022-01-12'
tags: ['open-source', 'musings', 'notes']
draft: false
summary: A review of the things I have learned from building in the open over the past year. Thoughts and reflections on what it takes to grow a project and the difficulty translating open-source success to commerical success.
images: ['/static/img/building-oss-cover.png']
layout: PostLayout
---

<TOCInline toc={props.toc} asDisclosure toHeading={3} />

In the past year, I explored the ins and outs of building, maintaining and selling open-source projects. Some of the highlights include growing [tailwind nextjs blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) to more than 1500 Github stars, seeing my [graph benchmarks](https://github.com/timlrx/graph-benchmarks) featured in JuliaCon, speaking about [Motif](https://github.com/cylynx/motif.gl) in [Neo4j's Nodes 2021 conference](https://neo4j.brand.live/c/2021nodes-homepage), and winning the Monetary Authority of Singapore's Global Veritas Challenge with [VerifyML](https://github.com/cylynx/verifyml).

This post summarises some of my learnings from the above-mentioned projects as well as from observing the successes and failures of other projects. It does not aim to fully characterise all open-source projects, which as my first lesson points out is incredibly diverse, but merely serves just as a reflection of the things I have come to realise in the course of my work.

If you are looking to start your first open-source project and wondering what marketing or traction has to do with it, perhaps this post would be of interest. If you are in the deep end of the open-source movement, my commiserations and gratitude - I hope this post resonates!

## Everyone has their reasons for being in open-source

In the melting pot called Github, there are students looking for a place to showcase their skills or gain some experience contributing to actual projects. There are job seekers looking to beef up their resume by building an open-source portfolio, and senior developers who are just using it as a publishing channel and sharing their latest side project with the world.

You also have enterprises and corporates. Startups peddling their freemium software and established incumbents looking to gain developers mindshare, staking a claim about their technological capabilities - perhaps to flaunt or maybe as a HR recruitment strategy.

In short, everyone has their own reasons for participating in open-source software.

The ease that all these different individuals (and probably hundreds of other profiles that I cannot characterise) can interact on a single platform is part of the joy of building in the open. Through my journey, I had the opportunity to learn from more senior developers, meet aspiring academics, chat about graph optimisation, as well as help other developers build their blogs.

On the converse, you also get unappreciative remarks or people who just don't read the detailed `README.md` which you spent days writing.

In those trying times, take a step back, remember the bigger picture of why you are doing this and learn to say no. Spend time on things that spark joy - after all, it is your project, just be nice about it along the way.

## The project is only as good as the community behind it

Moving from "here's a dump of my project code - you are free to copy and redistribute it in whatever form" to an _open-source project_, requires a shift in perspective from that of an individual (yourself) to the community. Growing and developing an open-source project requires a community of adopters and contributors to sustain it. A good community will help answer issues on Github, act as free marketing agents and amplify any outreach that you create.

There are two levels to building a community. The first is creating a space for different individuals to participate and contribute. The faster that you are able to identify the right segment of the community that the project is targeted towards, the more time you will save for yourself and others. The second, typically adopted for larger projects, is to create an additional layer of core contributors who helps shape the project at a more strategic level. This includes weighing in on new features or even proposing changes to the roadmap.

Within the open-source community, people are generally interested to participate and contribute, though they might not know how to go about doing it. Having good contributing guidelines help (e.g. contributing.md). The next challenge is to create a healthy environment, where people who are interested in the project can easily contribute to it, and know that their contributions are valued. In general, this just means being a nice person and letting people know how much you appreciate their contributions or why you are closing their pull request.

Tap on the psychology of social approval! The more someone feels that they are part of the community, the more motivated they will be. Some strategies include:

- Showcase the list of project contributors in the readme and credit them in the release notes.

- Promoting valuable contributors to maintainers

- Sending contributors some stickers or swag. This seems to be the favourite strategy adopted by many open-core, commercial projects - nothing works as good as a free physical memorabilia to motivate unpaid work 😅.

- Use open channels to engage the community e.g. Github Discussions, Discord or Slack. My preference is for truly open channels of communication i.e. Discussions or forums. Groups like Discord or Slack seem more gated and are better for projects hoping to target enterprise customers.

**Additional resources**

- [All contributors bot](https://github.com/all-contributors/all-contributors), automate acknowledging contributors to your open source projects.

- [The Maintenance of Large Open-Source Projects](https://www.welcometothejungle.com/en/articles/btc-discussion-open-source-maintenance), an interview with a former node.js core member and creator of Leaflet.js.

- [50 community building tips](https://www.feverbee.com/50-community-building-tips/), actionable steps that could be implemented by anyone interested in building a community. The tips are not specific to open-source communities, but the ideas are transferable.

## Marketing drives awareness and adoption

Making the source code publicly available on Github is only the first step in the open-sourcing journey. The key to awareness and adoption is **marketing**.

Ideally, you would know where the potential users of your solution tend to hang out, the people that they follow and the sites that they read. These would be the main channels that you should be targeting. Common channels for tech-related projects include Twitter, specific subreddits and Hackernews.

It helps if you are already a notable member of the community or have a large Twitter follower base which you can easily reach out to. In the absence of that, one can consider leveraging on the follower base of other popular individuals, projects and companies. I find it to be a pretty effective strategy to tag the accounts of such projects in Twitter, especially if you are building on their language / framework or created some kind of integration that their users would probably be interested in. People / organisations tend to appreciate the shout-out and would re-share or like the post, amplifying the outreach to their followers.

Beyond the realms of social media, there are also meetups and conferences that are great opportunities to share about your project. There might be a sense of self-doubt that one's new fledging project does not deserve to be on the same podium as another superstar developer, but on the contrary, most conference organisers are actually looking to showcase a variety of projects. From my personal experience, you are actually doing event organisers a favour and saving them the time and effort required to hunt down interesting talks!

These talks and conferences also provide a good avenue to hear from users / potential users directly. Getting a link to your project from their conference page also helps in SEO.

**Additional resources**

- [Skerritt's open source project guide](https://skerritt.blog/make-popular-open-source-projects), practical tips from the creator of Ciphey and RustScan on maintaining a Github project and getting the word out.

- [They can't hear you on mute](https://www.slideshare.net/finosfoundation/they-cant-hear-you-on-mute-96411236), a very apt title by Donald Raab of Eclipse Collections fame.

- [Marketing Eclipse Che to >4000 GitHub stars and >7M hours of usage in one year](https://www.slideshare.net/bmicklea/marketing-open-source-projects-to-great-success)

- [Growth Hacking Github - How to Get Github Stars](/blog/growth-hacking-github-how-to-get-github-stars), a previous article of mine.

## Open-source success is a weak indicator of commercial success

Translating open-source success to commercial success is an issue most open-source products face. As the A16z article linked below mentions, there are different business models which one could try to adopt ranging from providing paid support, open-core model with enhanced "enterprise" functionalities, to a full SAAS concept.

There's a chasm between open-source success and commercial success, especially for open-core and SAAS products. I think this can be attributed to the following three factors:

### 1. Different user needs

In most cases, the needs and requirements of commercial software are orthogonal to that of open-source software. Repurposing the solution to suit the needs of the enterprise environment requires incurring significant time and energy. This includes supporting role-based access control, LDAP integration and SOC2 compliance.

Normally, this means to go with technologies that are already battle-tested, not the newest greatest framework that you enjoy developing. If the ultimate aim is to achieve commercial success, it might be easier to design it for enterprises from the get-go.

Time and energy incurred in supporting different user groups should definitely not be underestimated. If the product can sell commercially, one has to question what's the additional benefit of open-sourcing other than the developers own interest (which is a perfectly fine reason).

I also noticed that open sourcing seems to be a last ditch effort by some enterprise projects, perhaps the last attempt to revive it and attract more interest. Unfortunately, that never seems to fair well. Open-sourcing is never a solution to a problem.

### 2. Open-source users are not the buyers

Unless the product is B2C and developer focused, users of open-source software are most often different from the people controlling the purse strings. While growing a passionate user base who would vouch for the product is one thing, getting the same group of users to guide you through their enterprise sales cycle is another. Conversely, being open-source can be detrimental and is often used as a reason not to purchase the product - if it's already free to use, what is the additional rationale for paying for it?

### 3. Open-source success is only a measure of interest, not an intent to pay

Success is relatively ambiguous, but in most open-source communities this normally refers to the number of Github stars, forks or docker downloads. Converting this interest to actual dollars is a totally different issue. There are some products that command tremendous interest but are not solutions where individuals / enterprises are used to paying, and there are other products that people will very easily fork out money for, but they are unlikely to be interested in following with the project's development. Examples of the former include, machine learning libraries and frontend frameworks. Examples of the latter include, email or sms delivery services and automated web-scrapers.

For a developer looking to start a new open-core project, the challenge is to successfully identify products that belong in the sweet spot - the project should be of significant interest and is also something that people are interested in paying. For a popular existing open-source project that is looking to commercialize, the challenge is to funnel users from the free to a paid model. Docker, is an interesting case study to look at, being a super popular open-source project but one whose shift towards a commercial model has been met with substantial user resistance and pushback.

There is an advantage of open-sourcing, namely, it works as a great pre-sales inbound channel, as users have already developed an attachment for the solution. These users could also help champion the product internally within their organisation, expediting the enterprise sales cycle. Nonetheless, closing the last mile is still a lot of work, and one should not naively assume that Github stars translate to dollars.

**Additional resources**

- [Open Source: From Community to Commercialization](https://future.a16z.com/open-source-community-commercialization/), an insightful article from a16z.

- [Open source for enterprise with HashiCorp](https://www.heavybit.com/library/podcasts/to-be-continuous/ep-44-open-source-for-enterprise-with-hashicorp/), the first 30 minutes on how HashiCorp struggled with translating open-source success to commercial success is worth a read. To quote Armon, the co-founder of HashiCorp, "on one hand, the enterprise is using the open source. So they're willing to even engage in the conversation, so that's a plus. But the downside is you have to jump over your own highest bar".

## OSS in 2022

As mentioned in the introduction, I have learned so much from the community and the positivity of everyone in the industry that I have interacted with, makes me happy to contribute back in code and time. Many thanks goes out to the various mentors and advisors that I have met along the journey!

To end the post, I will briefly point out some areas that I am very interested to see some progress made in 2022:

1. **Funding for developers**. [Github sponsors](https://github.com/sponsors) is a great channel, but how can monetization be made easier for other utility software that are often used but rarely recognised? How can enterprises more easily contribute to individual developers, given that they are big beneficiaries of the projects. See [open-source has a funding problem](https://stackoverflow.blog/2021/01/07/open-source-has-a-funding-problem/) for more information.

2. **Better security and dependency audits**. Thanks [Log4J](https://security.googleblog.com/2021/12/understanding-impact-of-apache-log4j.html) for showing us how many enterprise software are built on open-source offerings. Runner up goes to Marak Squires for corrupting his own [Faker.js and Color.js packages](https://www.bleepingcomputer.com/news/security/dev-corrupts-npm-libs-colors-and-faker-breaking-thousands-of-apps/). Both incidents also show the trade-off between always downloading the latest software version vs pinning the dependencies to a particular version.

3. **Open-source strategy for enterprises**. How can enterprises empower their developers to build in the open or give back to projects which they use? Or be used as a means to forge partnerships and collaboration across companies? With the soaring demand for developers, it seems odd that engaging with the open-source community is not a core strategy of HR teams. In summary, it will be interesting to see how the large incumbents adapt and compete with start-ups who have grown their entire presence through open-source platforms.

This article has gone on a little longer than I expected, but I hoped you enjoy reading it. If you wish to hear more, subscribe to the [RSS feed](https://www.timlrx.com/feed.xml) or the new newsletter that I have created! Here's to a fruitful year of OSS!🍻
