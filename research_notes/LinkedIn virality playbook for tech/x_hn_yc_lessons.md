# Lessons from X/Twitter, Hacker News and the YC/founder ecosystem for writing posts that spread (and what transfers to LinkedIn)

Research date: 2026-10-14. Source-type tags: [PRIMARY-CODE] = repository/source code or README; [PRIMARY-PLATFORM] = official platform docs or exec statements; [PRIMARY-AUTHOR] = the essayist's or creator's own work; [ACADEMIC] = peer-reviewed or arXiv paper; [SECONDARY] = journalism or analysis; [VENDOR/BLOG] = marketing blog or newsletter (weakest). Confidence: High / Medium / Low.

Method note: some primary domains (news.ycombinator.com, paulgraham.com, pub.towardsai.net) could not be fetched directly from this environment because of DNS failures. Claims about them come from search-result summaries and are marked that way.

## Q1. What does X's open-sourced algorithm reveal about engagement weights, and what changed in 2025–2026?

### Takeaway
The 2023 Twitter release put a number on the gap: a predicted reply was worth about 27 likes, and a reply that the author then engaged with was worth about 150 likes. Negative feedback and reports carried very large negative weights. In the 2026 xAI/Grok-based "Phoenix" release, X still ranks posts by a weighted sum of predicted actions, and it now models dwell, shares (including DM and copy-link sharing), follows and negative actions directly. It also adds author-diversity decay, an out-of-network discount and a new-author boost. Conversation, dwell and shares are the levers. Bait that triggers "not interested", mutes or reports is very costly.

### Cited Findings
**2023 release (twitter/the-algorithm, twitter/the-algorithm-ml)** [PRIMARY-CODE, High]
- The heavy-ranker README lists these engagement weights "as of April 5, 2023". Like (favorite) 0.5; Retweet 1.0; Reply 13.5; Good profile click 12.0; Video playback 50% 0.005; Reply engaged by author 75.0; Good click 11.0; Good click v2 10.0; Negative feedback v2 −74.0; Report −369.0. The README says the weights "can be adjusted at any time." — [twitter/the-algorithm-ml recap README](https://github.com/twitter/the-algorithm-ml/blob/main/projects/home/recap/README.md)
- The weights multiply *predicted probabilities* of each action, not raw counts. The 2026 xAI README says the same explicitly (below).

**2026 xAI / Grok-based release (xai-org/x-algorithm)** [PRIMARY-CODE, High for README content]
- X open-sourced the new For You ranking code in January 2026. Musk promised updates every 4 weeks. The ranking model uses the same transformer architecture as Grok and ranks posts by predicting user actions such as likes and replies. — [Decrypt](https://decrypt.co/355108/elon-musks-x-open-sources-grok-powered-algorithm-driving-for-you-feed); [Business Today, Jan 20 2026](https://www.businesstoday.in/amp/technology/news/story/decoding-xs-algorithm-heres-how-grok-open-sources-and-curates-the-for-you-feed-511751-2026-01-20) [SECONDARY, Medium]
- Coverage says the "Phoenix" ranker replaced every heuristic and hand-engineered rule of the old system, though that is X's own claim. Coverage also reports a May 15, 2026 commit that touched 187 files, and that the repo is Apache-2.0 licensed (Rust and Python). — [OpenSourceForU, Aug 2026](https://www.opensourceforu.com/2026/08/x-open-sources-its-ranking-algorithm/) [SECONDARY, Medium; not verified against commits]
- Architecture: the Home Mixer service runs a post pipeline and a blending pipeline. In-network candidates come from "Thunder", which holds recent posts from accounts the viewer follows in memory. Out-of-network candidates come from Phoenix retrieval (embedding nearest-neighbours), SimClusters and a popular-posts list. The README notes that "Ranking sets the order", while separate visibility-filtering rules decide whether a post can be shown at all. — [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm)
- Predicted actions modelled: **engagement** (favorite, reply, repost, quote, share, share via DM, share via copy link); **clicks** (post, profile, link, photo expand, video open, quoted post); **attention** (video quality view, dwell, dwell time, click dwell time, video continuation seconds, profile visit seconds); **follow author**; **negative** (not interested, mute author, block author, report, "not dwelled"). — [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm)
- Final score = Σ(weight_i × P(action_i)). Positive actions have positive weights and negative actions have negative weights. The weights live in `home-mixer/params/param.rs`. An August 14, 2026 README update clarifies that the weights multiply predicted probabilities or values, not raw engagement counts. It also warns against reading the weights as "one report cancels out many likes." — [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm)
- Post-scoring adjustments in the README:
  - Author diversity: each post after an author's first is multiplied by a decaying factor.
  - Out-of-network discount: posts from accounts the viewer does not follow get a factor below 1.
  - New-author boost: authors whose impressions are below a threshold are lifted toward a target position.
  - VMRanker: reorders results using a determinantal point process to reduce similarity between neighbouring posts.
  - Pre-scoring filters: drop posts older than 48 hours, previously seen posts, muted keywords, out-of-network reposts and replies, and others. — [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm)
- The README timeline:
  - Aug 13, 2026: release added the parameters and weights, the visibility-filtering code, Phoenix training code with synthetic data, and SimClusters.
  - Aug 14, 2026: weights clarification and a Brazil 2026 elections filter.
  - Sep 18, 2026: "Under the Hood" reports now show legal-compliance limits by country. — [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm)
- Coverage says some parts are withheld, such as the Grok models that predict rule violations, to prevent gaming. — [OpenSourceForU](https://www.opensourceforu.com/2026/08/x-open-sources-its-ranking-algorithm/) [SECONDARY, Medium]

**Links (2025)** [PRIMARY-PLATFORM statements reported by SECONDARY outlets, Medium]
- In October 2025, X's head of product Nikita Bier tested an iOS link view that keeps the post's engagement bar visible while the link is open, so that X can capture the engagement signals it misses when a link covers the post. Bier denied that links are "deboosted" and attributed their lower reach to "lower engagement." — [Nieman Lab, Oct 2025](https://www.niemanlab.org/2025/10/x-makes-overtures-to-journalists-with-new-feature-designed-to-improve-reach-for-links/); [Social Media Today](https://www.socialmediatoday.com/news/x-formerly-twitter-testing-links-in-app-link-post-penalties/803176/)
- Musk: "Posting a link with almost no description will get weak distribution, but posting a link with an interesting description/image will get distribution." Musk also said that xAI, not Bier, builds the algorithm. — [Nieman Lab](https://www.niemanlab.org/2025/10/x-makes-overtures-to-journalists-with-new-feature-designed-to-improve-reach-for-links/); [Michael Tsai blog, Oct 27 2025](https://mjtsai.com/blog/2025/10/27/twitter-to-show-link-content-and-tweet-simultaneously/) (Tsai argues that deboosting persists and pushes people to put links in replies; this is opinion)

### Inferences
- The widely quoted "reply = 27x a like" and "author-replied reply = 150x a like" figures are ratios derived from the 2023 weights (13.5 / 0.5 and 75 / 0.5). They are not separately documented numbers, and they compare predicted probabilities, not counts.
- The 2026 model still mechanically rewards several things: (1) conversation, (2) dwell and reading time, (3) shares, especially private shares by DM or copied link, and (4) profile visits and follows. Its explicit "not dwelled" negative signal punishes scroll-past bait. These map almost one-to-one onto what LinkedIn says it rewards (dwell, meaningful comments, saves and sends), so the craft transfers.
- The link question is in practice an engagement-prediction question. A bare link earns few on-platform actions. A link with substantive native text and an image does better. Practitioners still put links in the first reply or comment, and that habit carries over to LinkedIn.
- The author-diversity decay suggests that one strong post beats several weak posts in a row.
- The new-author boost and out-of-network retrieval help small accounts. This favours niche technical topics that embed close to an interested cluster.

### Gaps
- Actual 2026 numeric weights in `param.rs` were not inspected line by line. The README describes them qualitatively, so do not quote 2026 numbers.
- No independent verification that the open-sourced code equals the production system (the same caveat applied in 2023).
- Premium/verified reach boosts were not researched in this pass.

## Q2. How does Hacker News ranking work, and what kinds of Show HN and story posts succeed?

### Takeaway
HN ranking decays with time faster than it grows with votes. Moderators, flags and a "controversy" penalty heavily adjust it. In one sample, about 20% of front-page stories were penalized. HN culture rewards plain, literal, non-editorialized titles and things readers can try right away. Posting time matters more than the "Show HN" label.

### Cited Findings
- Analysis of live rankings in 2013 gives the score as (votes − 1)^0.8 / (age_hours + 2)^1.8 × penalties. Because the time exponent ("gravity") is larger than the vote exponent, every story's score eventually falls to zero. — [Ken Shirriff, righto.com 2013](https://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html) [SECONDARY-analysis, Medium; dated]
- In the same analysis, about 20% of front-page stories were penalized. A "controversy" penalty applied to posts with more than 20 comments and more comments than upvotes. A penalty factor of 0.4 makes a story drop about 66% faster. — [righto.com 2013](https://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html)
- The original Arc code (2009) used gravity 1.8. The live formula has grown more complex since. — [righto.com 2009](https://www.righto.com/2009/06/how-does-newsyc-ranking-work.html) [SECONDARY, Medium]
- Official HN title rules (via search excerpt; the page could not be fetched directly):
  - "Please use the original title, unless it is misleading or linkbait; don't editorialize."
  - No uppercase or exclamation points, and no saying how great an article is.
  - Remove the site name.
  - "Crop gratuitous number or number + adjective."
  - Append [video] or [pdf] for those formats.
  — [HN Guidelines](https://news.ycombinator.com/newsguidelines.html) [PRIMARY-PLATFORM, High]
- YC introduced Show HN for original work people can try. A post should link to the thing itself, not a landing page about it, and the title should describe what was built rather than promote it. — [YC blog "Make Things and Show Them"](https://www.ycombinator.com/blog/make-things-and-show-them) [PRIMARY-PLATFORM, Medium]; [Lucas F. Costa, HN launch guide](https://lucasfcosta.com/hn-launch) [VENDOR/BLOG, Low-Medium]
- An arXiv study of 138 AI/LLM repository launches on HN (2024–2025) found average GitHub star gains of about 121 in 24 hours, 189 in 48 hours and 289 in a week. Posting time was the strongest factor, and the "Show HN" label showed no statistically significant benefit after controls. — [arXiv 2511.04453](https://arxiv.org/abs/2511.04453v1) [ACADEMIC preprint, Medium; small n]
- "Show HN" is among the most frequent title prefixes, with about 96k–99k occurrences in roughly 3 million submissions. — [vsupalov.com](https://vsupalov.com/frequent-hn-title-suffixes-prefixes/) [BLOG, Medium]

### Inferences
- Lessons for LinkedIn:
  - Specific, literal and verifiable beats hype. A hook like "I cut our Postgres p99 from 800ms to 40ms by removing one index" is the HN-style title, and it carries over well.
  - Comment-heavy controversy can be penalized on HN. On LinkedIn and X, comments are rewarded, but reports, "not interested" and hides are punished. Debate is fine; rage-bait is risky.
  - Early-hours velocity matters on every time-decayed feed. Post when your audience is online.
- "Show, don't tell" artefacts get credibility: a demo GIF, a repo, a benchmark table.

### Gaps
- No up-to-date (2024–2026) official description of the HN formula exists. HN does not publish it.
- I found no large-sample analysis of title features versus HN points that I could verify. One HN commenter argues that surface title features predict virality poorly (unverified).

## Q3. What do YC and founder-ecosystem writers advise on writing and audience-building, and what hook and structure patterns do they use?

### Takeaway
The founder canon converges on a few rules: write simply, make strong but true claims, write what you yourself wanted to read, ship imperfectly and in public, and systematize one core idea into many formats. Creator operators such as Justin Welsh treat LinkedIn as the primary platform and X as the repurposing surface.

### Cited Findings
- Paul Graham, "How to Write Usefully" (Feb 2020):
  - Usefulness = importance × novelty × correctness × strength. The factors multiply.
  - Vague statements are easy to make true but useless. Make claims as strong as they can be without becoming false.
  - Use yourself as a proxy for the reader.
  - Ruthlessly delete bad sentences.
  — [paulgraham.com/useful.html](https://www.paulgraham.com/useful.html) [PRIMARY-AUTHOR via search summary, High for gist]
- Paul Graham, "Write Simply": use ordinary words and simple sentences, because "the less energy they expend on your prose, the more they'll have left for your ideas." Fancy writing can conceal a lack of ideas. — [paulgraham.com/simply.html](https://www.paulgraham.com/simply.html) (could not fetch; summarized via [Clear Communication Guidelines](https://juanibiapina.substack.com/p/clear-communication-guidelines)) [Medium]
- swyx, "Learn in Public":
  - Learning in public is the "golden rule"; most people lurk instead.
  - Make the resource you wished you had found when you were learning.
  - Separate ego from work, and ship before it is perfect.
  - Ignore vanity metrics; compare yourself with your past self.
  - It is the fastest way to learn and to build a network.
  - Some people have valid safety reasons not to learn in public.
  — [swyx gist / essay mirror](https://gist.github.com/swyxio/9720bd4a30606ca3ffb8d407113c0fe5); [swyx.io Learning Gears](https://swyx.io/learning-gears.md) [PRIMARY-AUTHOR via secondary quotes, Medium]
- YC "Make Things and Show Them": the norm is to share working artefacts early with the community. — [YC blog](https://www.ycombinator.com/blog/make-things-and-show-them) [PRIMARY-PLATFORM, Medium]
- Justin Welsh: LinkedIn is the primary surface and X the repurpose surface; posts are structured to translate to both. He writes one core piece and distributes it across channels. His seven-step recycling process: review performance, pick top posts, rewrite the hooks, restructure the body, refresh the CTA, then reschedule. A third-party breakdown also says he posts daily, often with a tweet-style image and long copy, and adds links to posts after they have been distributed. — [autotweet style guide](https://www.autotweet.io/creators/justin-welsh-style); [Growing Viral](https://growingviral.beehiiv.com/p/justin-welsh-turning-1-piece-content-100-highvalue-posts); [The Way Up](https://thewayup.beehiiv.com/p/how-justin-welsh-built-1-5m-followers-with-a-content-system); [Josh Spector](https://joshspector.com/justin-welsh-linkedin-system/) [VENDOR/BLOG, Low-Medium; his follower and revenue figures are self-reported]
- Ship 30 for 30 (Dickie Bush and Nicolas Cole) explicitly recommends reposting X content on LinkedIn, for example as Typeshare "decks" or carousels, to "2x your reach." — [Ship 30 for 30 blog](https://www.ship30for30.com/post/repurpose-your-x-content-on-linkedin-with-typeshare-decks) [PRIMARY-AUTHOR, but marketing for their own tool; Medium]

### Inferences
- Hook and structure patterns that fit both the founder canon and the algorithm signals above:
  1. **Specific result + number + timeframe** ("Shipped X in 9 days; 1,200 users; here's the stack"). This draws on PG's "strength" and Twitter's +17% retweet lift for numbers.
  2. **Contrarian but true claim** ("Most RAG pipelines don't need a vector DB"). This is strong but defensible and invites replies.
  3. **"What I wish I knew"** or learn-in-public teardowns (swyx).
  4. **One idea per post**, short sentences and plain words (PG "Write Simply"), with whitespace that rewards reading and so drives dwell.
  5. **End with an open question**, and reply to commenters quickly. The 2023 "reply engaged by author" weight was 75, the highest positive weight.
- Treat "Ship 30's 1/3/1 structure", "Naval-style aphorisms" and "Sahil Lavingia's minimalist-entrepreneur posts" as known creator lore. None was verified with a source in this pass.

### Gaps
- Could not retrieve primary sources for the Ship 30 "1/3/1" and atomic-essay formats, Naval, or Sahil Lavingia (searches returned irrelevant results). Do not cite specifics for them without verification.
- No YC Startup School talk specifically on building in public was located.

## Q4. Does building in public grow audiences, and which Indian founders and engineers are examples?

### Takeaway
There is strong anecdotal evidence (Pieter Levels publishing revenue and process openly while building a multi-million-dollar solo portfolio) but no controlled evidence. Indian examples exist (Zerodha's transparency and its Varsity education content, and the GrowthX community), but I found no verified data on individual Indian engineers' growth.

### Cited Findings
- Pieter Levels publishes real-time revenue, launches, technical decisions and operational details on X, and his audience grew alongside Nomad List. Revenue figures conflict across secondary sources: about $50K/month (2018 tweet), a reported peak of about $420K/month in 2024, and a reported $5.3M per year in 2024. — [Everything PR](https://everything-pr.com/pieter-levels-the-solopreneur-saas-portfolio-operator); [DEV analysis of 751 of his blog posts](https://dev.to/idonthaveapen/failures-behind-a-420kmonth-solo-founder-i-read-all-751-of-pieter-levels-blog-posts-1h3b); [Indie Hackers](https://www.indiehackers.com/post/from-google-sheets-to-3-6m-as-a-solo-founder-de782f722a) [SECONDARY/BLOG, Low-Medium; figures are self-reported]
- Zerodha (India) is cited as a case of content-led and trust-led growth. About a third of users came via referrals, and its free Varsity education platform builds trust. — [echai.ventures](https://echai.ventures/startingup/personal-brand-social/how-are-indian-founders-using-social-to-build-distribution-and-community) [VENDOR/BLOG, Low]
- Indian growth operators build audiences on LinkedIn, X and podcasts; GrowthX and The Neon Show are named. — [echai.ventures](https://echai.ventures/startingup/content-seo/how-do-i-build-content-and-an-audience-the-indian-way-like-the-founders-who-do-it-well) [VENDOR/BLOG, Low]
- A vendor claims personal accounts get 5–10x the engagement of brand accounts. — [echai.ventures build-in-public guide](https://echai.ventures/how-founders-use-ai/social-community/does-building-in-public-still-work-in-the-ai-era-and-how-do-founders-do-it-well) [VENDOR, Low]

### Inferences
- The mechanism is consistent with the algorithm. Metric updates and build logs create recurring narrative hooks: specific numbers, progress and stakes. They also invite replies and follows, both of which are heavily weighted.
- Survivorship bias is significant. Present building in public as a compounding habit, not a guaranteed growth tactic.

### Gaps
- No verified follower-growth data was found for Indian builders (for example Kailash Nadh, Varun Mayya or Peer Richelsen); a targeted search returned nothing usable.
- No controlled study comparing building in public with a control group was found.

## Q5. Does repurposing X content to LinkedIn work, and how do audience norms differ?

### Takeaway
Leading creators (Welsh, Ship 30) do repurpose systematically and report it extends reach, but they adapt the post rather than copy it: rewritten hook, restructured body, a different format such as an image or carousel. There is no independent data quantifying the effect.

### Cited Findings
- Welsh repurposes between LinkedIn (primary) and X, rewriting the hooks and the body. — [autotweet](https://www.autotweet.io/creators/justin-welsh-style); [The Way Up](https://thewayup.beehiiv.com/p/how-justin-welsh-built-1-5m-followers-with-a-content-system) [VENDOR/BLOG, Low-Medium]
- Ship 30 recommends converting X threads into LinkedIn carousels ("decks"). — [Ship 30 for 30](https://www.ship30for30.com/post/repurpose-your-x-content-on-linkedin-with-typeshare-decks) [Medium; self-interested]
- A guide on repurposing LinkedIn content covers common problems such as format and tone mismatch. — [contentin.io](https://contentin.io/blog/repurposing-linkedin-content-common-problems-and-solutions) [VENDOR, Low]

### Inferences
- Adaptation checklist for X to LinkedIn:
  - Merge a thread into one long-form post or a carousel.
  - Replace X slang and irony with professional framing.
  - Lead with the career or business relevance.
  - Keep links out of the body; put them in a comment or edit them in later, as Welsh is reported to do.
  - Keep the numbers and the specificity.

### Gaps
- No platform-published or independent A/B data on cross-posting performance was found.

## Q6. What do data studies say about which tweet features drive virality (length, images, numbers, questions, controversy)?

### Takeaway
The account matters most: followers, account age and existing reach. Among content features, images, numbers and high-arousal emotion (awe, anger, anxiety) reliably lift sharing. Hashtag results conflict. Low-arousal content, such as sad content, spreads less.

### Cited Findings
- Twitter's own 2014 study of over 2 million tweets from verified accounts found these average retweet lifts: photos +35%, videos +28%, quotes +19%, numbers or stats +17%, hashtags +16%. The lifts varied by sector; in TV, quotes gave +53% and photos +46%. — [blog.twitter.com 2014](https://blog.twitter.com/2014/what-fuels-a-tweets-engagement); figures via [Associations Now](https://associationsnow.com/2014/03/study-youre-tweeting-add-photo-higher-engagement/) [PRIMARY-PLATFORM via SECONDARY, Medium; dated]
- Berger & Milkman (JMR 2012), a study of New York Times articles: content that evokes high-arousal positive emotion (awe) or negative emotion (anger, anxiety) is more viral, and low-arousal content (sadness) is less viral. This holds after controlling for how surprising, interesting or useful the content is; those three are also positively linked to virality. — [Berger & Milkman PDF](https://faculty.wharton.upenn.edu/wp-content/uploads/2011/11/Virality.pdf) [ACADEMIC, High]
- Account-level features (followers, followees, account age) predict retweetability. ViralBERT found sentiment and follower count to be the strongest features, and found hashtag count detrimental. — [Jenders et al. 2013](https://hpi.de/oldsite/fileadmin/user_upload/fachgebiete/naumann/publications/PDFs/2013_jenders_analyzing.pdf); [ViralBERT](https://physics.paperswithcode.com/paper/viralbert-a-user-focused-bert-based-approach) [ACADEMIC, Medium]
- Hashtag findings conflict: some studies find a positive association, and ViralBERT finds a negative one. — [SRI retweet analytics](https://sri.com/?p=89300) vs [ViralBERT](https://physics.paperswithcode.com/paper/viralbert-a-user-focused-bert-based-approach) [ACADEMIC, Medium]

### Inferences
- For a technical creator on LinkedIn:
  - Include a visual, such as a diagram, a screenshot or a chart of a metric.
  - Lead with a concrete number.
  - Aim for awe ("this is surprisingly possible") or productive tension (a respectful contrarian take) rather than outrage. Outrage draws reports and "not interested", which carry heavy negative weights on X and plausibly on LinkedIn.
  - Hashtags are not a growth lever.

### Gaps
- No rigorous study isolating questions-as-hooks or optimal post length on X in 2023–2026 was found. Most "hook formula" statistics online come from vendors and are unverified.
