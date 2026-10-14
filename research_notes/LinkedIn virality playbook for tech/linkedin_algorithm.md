# LinkedIn Feed Algorithm & Reach Drivers for Individual Creators (2024–2026)

> Method note (important for the report writer): Direct page fetches were blocked by the environment's egress policy (news.linkedin.com, authoredup.com, ppc.land all returned connect-rejected). All findings below come from web-search result summaries/snippets of the cited pages, not full-page reads. Numbers were cross-checked across multiple snippets where possible; where snippets disagree, this is flagged. Source-type tags: **[OFFICIAL]** = LinkedIn newsroom/engineering/LinkedIn-authored paper or LinkedIn employee quote; **[STUDY N=…]** = third-party dataset study; **[SECONDARY]** = blog recap of someone else's data; **[ANECDOTE/FOLKLORE]** = untraceable or creator claim. Confidence: H/M/L. Today = 2026-10-14.

## 1. What LinkedIn has officially said about feed ranking

### Takeaway
LinkedIn has officially moved feed ranking from feature-engineered deep models (LiRank, 2024) to LLM-augmented "Generative Recommender" sequence models (announced March 12, 2026), and in 2025–2026 explicitly stated it reduces reach of engagement bait, pod/automation-boosted content, and "generic AI content" (often capping it at 1st-degree connections). LinkedIn has NOT officially published weights for comments vs likes, dwell thresholds, or a link penalty.

### Cited Findings
- **LiRank (2024) [OFFICIAL – LinkedIn-authored paper, H]:** arXiv:2402.06859 (Borisyuk et al.), v1 10 Feb 2024, v2 7 Aug 2024. Covers Feed ranking, Jobs and Ads CTR; key modeling change is "Residual DCN" (attention + residual connections on DCNv2) plus Dense Gating and Transformers. Feed models evaluated with a replay metric estimating online "contribution rate" (likes, comments, re-posts). Reported gains: +0.5% member sessions in Feed, +1.76% qualified job applications, +4.3% Ads CTR. Dwell time not surfaced in the snippets retrieved. — [arXiv 2402.06859](https://arxiv.org/abs/2402.06859v2); [arXiv HTML](https://arxiv.org/html/2402.06859v1)
- **360Brew (2025) [OFFICIAL – LinkedIn-authored paper + talk, H for existence / L for feed-rollout date]:** arXiv 2501.16450 frames 360Brew as a decoder-only LLM-based ranker that removes the need for item/member feature engineering by treating all input as text, generalizing across surfaces/tasks. LinkedIn AI talk (Hamed Firooz, Maziar Sanjabi, AI Engineer World's Fair 2025): teacher model "Brew-XL" ~150B parameters, distilled to a smaller student for serving; summaries say >30 predictive tasks incl. Feed, Jobs, Search, Ads. One secondary source says the arXiv paper was later withdrawn over a licensing issue (unverified). — [arXiv 2501.16450](https://export.arxiv.org/pdf/2501.16450); [AI Engineer talk](https://ai.engineer/talks/360brew-llm-based-personalized-ranking-and-recommendation-hamed-firooz-and-maziar-sanjabi-linked)
- **360Brew feed rollout timing is contested [SECONDARY, L]:** one blog says 360Brew rolled out across the feed in March 2026; a German agency blog says LinkedIn switched to a "Depth Score" in April 2026. Neither matched an official LinkedIn post. Many creator blogs since 2025 attribute reach drops to "360Brew" — this attribution is folklore-grade. — [pettauer.net](https://pettauer.net/en/linkedin-360brew-semantic-visibility-2026/); [collectivebrain.de](https://collectivebrain.de/linkedin-depth-score-mittelstand-reach-verlust/)
- **March 12, 2026 feed rebuild [OFFICIAL via newsroom + engineering blog (Hristo Danchev), M-H]:** LinkedIn newsroom post "How LinkedIn Is Improving the Feed to Show More Relevant, Authentic Professional Content" says it now uses larger sequence models called Generative Recommenders, augmented with LLMs, to capture how interests change over time, drawing on profile signals such as industry, skills, geography. Coverage of the engineering post: LLM-based dual-encoder retrieval replaced several separate retrieval systems; ranker is a causal-attention transformer reading >1,000 past interactions per member and scoring candidates against that history (not each post in isolation); custom GPU serving, sub-second latency. A related paper reportedly pulls ~2,000 out-of-network candidates from hundreds of millions. — [LinkedIn newsroom](https://news.linkedin.com/2026/ImprovingTheFeed); [ByteByteGo recap](https://blog.bytebytego.com/p/how-linkedin-feed-uses-llms-to-serve); [ZenML LLMOps DB](https://www.zenml.io/llmops-database/next-generation-feed-ranking-with-llms-and-sequential-transformers); [PPC Land](https://ppc.land/linkedin-rebuilds-its-feed-from-scratch-with-llms-and-gpu-powered-ranking/)
- **Engagement bait named officially (March 2026) [OFFICIAL via secondary, M]:** the same announcement said LinkedIn aims to reduce low-substance posts and engagement bait, giving examples of "comment to agree" prompts and videos that don't match the post text; also says it acts against "comment automation, engagement pods, and unauthorized third-party tools." — [SocialPilot recap](https://www.socialpilot.co/blog/linkedin-algorithm); [breakingsocialmedia.news](https://breakingsocialmedia.news/linkedin-feed-update-prioritizes-relevant-comments-and-replies/2026/)
- **Engagement pods [OFFICIAL quote, H]:** LinkedIn to Social Media Today: "Our goal is to make engagement pods entirely ineffective… We are increasingly flagging any artificially boosted content internally, and then also, we are limiting the reach of this content." — [Social Media Today](https://www.socialmediatoday.com/news/linkedin-vows-to-take-action-against-engagement-pods-fake-engagement/804970/)
- **AI-generated content (May 2026) [OFFICIAL via journalism, M-H]:** LinkedIn says it will not delete suspected "AI slop" but its algorithm will depress reach, "often not allowing it to be seen beyond a poster's first-degree contacts"; also targets generic AI comments. A claimed 94% accuracy at flagging generic content in early testing is reported (company claim, not independently verified). — [Social Media Today](https://www.socialmediatoday.com/news/linkedin-wants-to-limit-the-reach-of-ai-generated-content/820935/); [Engadget](https://www.engadget.com/2174163/linkedin-doesnt-want-your-ai-slop-anymore/); [Entrepreneur](https://www.entrepreneur.com/business-news/linkedin-is-fighting-back-against-ai-slop-and-ai-comments); [Shelly Palmer](https://shellypalmer.com/2026/05/linkedin-declares-war-on-ai-slop/); [ReplyGenius (secondary on 94%)](https://replygenius.io/blog/linkedin-suppressing-generic-ai-comments)
- **LinkedIn employee statements on links/tagging [OFFICIAL-ish (exec quote), M]:** Laura Lorenzetti (LinkedIn News exec editor): "Our algorithm is really focusing on the value and content that's being shared in the post"; posts with links generally get less engagement so the accompanying text matters; tag people when relevant; headline is a credibility signal shown on posts. In a Substack interview she reportedly said ranking uses "non-LLM" models watching early engagement, relevance and network connections. — [Buffer: LinkedIn algorithm according to the LinkedIn team](https://buffer.com/resources/linkedin-algorithm/); [Megan Cornish Substack](https://megancornish.substack.com/p/a-week-as-a-man-a-conversation-with)
- **Video push (Feb 2025) [OFFICIAL via journalism, H]:** LinkedIn said video uploads/viewership up 36% YoY (Oct 30 2024–Jan 29 2025; coverage alternately labels the 36% as uploads or viewership) and video creation growing 2x faster than other formats; vertical video feed expanded to web, still in test. Added "average watch time" creator metric. — [TechCrunch](https://techcrunch.com/2025/02/04/linkedin-amps-up-vertical-video-tools-as-uploads-jump-36); [Digiday](https://digiday.com/media/linkedins-video-push-appears-to-be-working-in-2025/); [MediaPost](https://www.mediapost.com/publications/article/403132/linkedin-takes-on-tiktok-with-new-vertical-video-f.html); [Mediabrief](https://mediabrief.com/linkedin-enhances-vertical-video-tools/)
- **No official link penalty [SECONDARY, M]:** several sources note LinkedIn has never publicly confirmed an external-link penalty and its public docs on quality criteria do not mention links. — [contentin.io glossary](https://contentin.io/glossary/external-link-penalty/); [gromming.com](https://gromming.com/blog/linkedin-external-links-penalty)

### Inferences
- The officially described architecture (sequence model over >1,000 of the *viewer's* past interactions + LLM text understanding) implies topical consistency and semantic relevance of post text to a viewer's history matter more than hacks; LiRank's "contribution rate" target implies active engagement (comments/reposts) is the optimization goal, not just views.
- Official anti-bait, anti-pod, anti-generic-AI statements mean "comment X to get Y" CTAs, pods, and templated AI posts/comments are now explicitly risky, with the stated penalty being confinement to 1st-degree network.

### Gaps
- Could not read the March 2026 engineering post in full (fetch blocked); no official metric deltas (e.g., engagement lift) captured.
- Did not find in search results the official 2023–2024 statements on "knowledge and advice" prioritization or the 2024 retirement of Creator Mode; background knowledge says Creator Mode was retired in early 2024 (follow became default) but this is UNSOURCED here — verify before use.
- No official LinkedIn statement on dwell-time thresholds was found.

## 2. Third-party studies: reach decline, signals, formats, behaviors

### Takeaway
All major datasets agree organic personal-profile reach fell sharply in 2024–2025 (roughly −34% to −50% depending on study); within that, polls and documents/carousels over-index on reach, text declined least, and video is contested (LinkedIn/Metricool say growth, AuthoredUp says steepest reach drop). Many popular "numbers" (15x comment weight, golden hour, 31–60s dwell, 25–60% link penalty, edit penalty) are not traceable to primary data.

### Cited Findings
**Reach decline**
- **Van der Blom Algorithm Insights 2025 [STUDY N≈1.8M posts, ~400k profiles; via secondary, M]:** recaps report views ≈ −47% to −50% YoY, but disagree on others: one says engagement −39%, follower growth −42%; another says engagement −25%, follower growth −59%. Primary report not accessed. — [Scribd chapter 1](https://www.scribd.com/document/984921783/Algorithm-Insights-Report-2025-chapter-1-Richard-Van-der-Blom); [contentin.io](https://contentin.io/blog/why-97-of-linkedin-creators-lost-half-their-reach-in-2025/); [contentin.io Dec 2025](https://contentin.io/blog/linkedin-algorithm-2025-why-your-reach-dropped-how-to-win-in-2026/); [leadmagic](https://leadmagic.io/gtm-skills/linkedin-algorithm)
- **AuthoredUp [STUDY N=621,833 posts; H-M]:** average personal-profile reach −34% in 2025 vs 2024. Median reach by format, June 2024 → May 2025: video −72% (1,764 → 477), images −45%, documents −43%, text −34% (least decline). AuthoredUp attributes it to competition, not content quality. — [AuthoredUp algorithm guide](https://authoredup.com/blog/linkedin-algorithm); [AuthoredUp newsletter](https://authoredup.com/newsletter/linkedin-vanishing-audience)
- **AuthoredUp unique reach [STUDY N=476,465 posts, Sep 2025–Feb 2026, M]:** median post's unique members reached ≈ 46% of impressions (i.e., heavy repeat exposure). — [AuthoredUp impressions vs views](https://authoredup.com/blog/linkedin-impressions-vs-views)
- **Van der Blom (recap):** organic company-page content shrank to ~2% of feed while top creator content grew to ~31% [SECONDARY, L]. — [mercermackay recap](https://mercermackay.com/thinking/blog/a-leaders-guide-to-the-linkedin-algorithm-what-the-data-says/)

**Comments vs reactions, comment length, early engagement, dwell**
- Comments outweigh likes, but magnitude contested: one recap says ~2x weight and explicitly notes the widely repeated "~15x" has no traceable primary source; another claims 15+ word comments carry 2.5x more weight (untraceable) [SECONDARY/FOLKLORE, L]. — [meet-lea.com](https://meet-lea.com/en/blog/linkedin-algorithm-explained); [contentin.io](https://contentin.io/blog/linkedin-algorithm-2025-the-complete-content-format-strategy-guide/)
- AuthoredUp: algorithm rewards posts sparking early interaction incl. saves, comments, reposts [STUDY interpretation, M]. — [AuthoredUp newsletter](https://authoredup.com/newsletter/linkedin-vanishing-audience)
- Dwell time widely described as major signal; one recap says no single universal "long dwell" threshold (calibrated per content type); "31–60 seconds = max distribution" claim is untraceable [FOLKLORE, L]. — [meet-lea.com](https://meet-lea.com/en/blog/linkedin-algorithm-explained); [contentin.io](https://contentin.io/blog/linkedin-algorithm-2025-the-complete-content-format-strategy-guide/)
- "Golden hour" (first 60–90 min) — no primary dataset found; only official support is Lorenzetti's reported mention that models watch "early engagement" [OFFICIAL-ish qualitative / numbers = FOLKLORE]. — [Megan Cornish Substack](https://megancornish.substack.com/p/a-week-as-a-man-a-conversation-with)

**External links**
- Van der Blom analysis of 1.3M posts (via secondary): median reach reduction from one body link ≈ 18.8% [SECONDARY citing STUDY, M-L]. Other blogs claim 25–40% or ~60% (untraceable, L). A "Saywhat" report found posts with several external links performed better (contradicting). — [contentin.io glossary](https://contentin.io/glossary/external-link-penalty/); [wechangeminds](https://www.wechangeminds.com/the-linkedin-link-tax/); [gromming.com](https://gromming.com/blog/linkedin-external-links-penalty)

**Formats**
- **Polls:** Metricool 2025 [STUDY N≈577k posts, ~48k pages — mostly company pages]: poll reach +206% (another write-up of same study: +158% impressions vs average post); polls used in only 0.00034% of content. Metricool 2026 [N=673,658 posts, >60k accounts, Jan–Feb 2025 vs 2026]: polls reach nearly 3x more people per post. AuthoredUp (via secondary): polls 1.78x reach but 0.37x engagement multiplier. — [Social Media Today press release](https://www.socialmediatoday.com/press-release/20250402-metricools-2025-linkedin-study-reveals-content-shifts-video-dominates-po); [Marketing Tech News](https://www.marketingtechnews.net/news/the-linkedin-ecosystem-in-2025-data-from-metricools-industry-report/); [Metricool 2026 PDF](https://metricool.com/wp-content/uploads/Linkedin-Study-2026-EN.pdf); [Metricool trends](https://metricool.com/linkedin-trends/); [contentin.io stats](https://contentin.io/blog/linkedin-content-statistics/)
- **Documents/carousels:** Metricool 2025: carousels +13% impressions vs average and +247% interactions; another write-up claims 45.85% engagement rate (implausibly high, L); Marketing4eCommerce: carousels 11x more interactions than static images; Socialinsider 2025: native documents/carousels 7.00% engagement rate (top format). — [Marketing4eCommerce](https://marketing4ecommerce.net/en/carousels-dominate-linkedin/); [meet-lea benchmarks](https://meet-lea.com/en/blog/linkedin-engagement-metrics-benchmarks); [Ordinal](https://www.tryordinal.com/blog/linkedin-post-ideas)
- **Video:** Metricool 2025: video impressions +73.39%, views +52.17% (2024→2025), video posts grew 53% with engagement +87%; contradicted by AuthoredUp's −72% median video reach for personal profiles. Different populations (pages vs profiles) and metrics. — [Teleprompter video stats](https://www.teleprompter.com/blog/linkedin-video-statistics); [AuthoredUp newsletter](https://authoredup.com/newsletter/linkedin-vanishing-audience); [Social Media Today](https://www.socialmediatoday.com/press-release/20250402-metricools-2025-linkedin-study-reveals-content-shifts-video-dominates-po)
- **Text vs image:** only AuthoredUp's decline data (text −34%, image −45%) found; text most resilient [STUDY, M].

**Hashtags, tagging, editing**
- Hashtags: AuthoredUp 8-month study — "no impact" on reach; 3–5 hashtags may slightly reduce visibility [STUDY, M]. Usera & Durham (2025, peer-reviewed, N=991 posts): hashtags ≈ +6% expected reactions; tagging people ≈ +15% reactions [STUDY small N, M]. "Don't tag >5 people" threshold untraceable [FOLKLORE]. — [AuthoredUp](https://authoredup.com/blog/linkedin-algorithm); [contentin.io hashtags](https://contentin.io/blog/do-hashtags-work-on-linkedin/); [ConnectSafely hashtags](https://connectsafely.ai/articles/linkedin-hashtags)
- Editing: only claim found is "major edits after 30 min cut impressions 30–50%," attributed to van der Blom but not verifiable [FOLKLORE, L]. — [ConnectSafely editing](https://connectsafely.ai/articles/does-editing-linkedin-post-affect-reach-2026)

**Frequency & timing**
- Buffer 2026 [STUDY N=4.8M posts]: strongest window ~3–8 pm weekdays, Wednesday 4 pm top slot; Monday and Tuesday weakest; in 2025 peak was confined to working hours and fell after 5 pm — 2026 shifted later. (Page date given as July or Sept 2026.) — [Buffer](https://buffer.com/resources/best-time-to-post-on-linkedin/)
- Buffer frequency claim (via secondary, unverified): 6–10 posts/week ≈ +5,000 impressions/post; 11+ ≈ +17,000. Treat L. — [Expandi](https://expandi.io/blog/best-time-to-post-on-linkedin/)
- Conflicting: Sprout Social (~2B engagements) Tuesday 11am–5pm; Hootsuite 2025 Tue/Wed 8–9am. — [frameos comparison](https://frameos.studio/blog/best-time-to-post-on-linkedin); [growtempo](https://www.growtempo.com/blog/best-time-to-post-on-linkedin)
- **India:** no rigorous study found. Vendor blogs converge on Tue–Thu 10am–12pm IST (WSCubeTech, Internshala); RecurPost suggests 7–9am, 1–2pm, 6–7pm IST; timetopost.co says its IST recs (2:30–4:30pm) are an editorial baseline, not data [ANECDOTE, L]. — [WSCubeTech](https://www.wscubetech.com/blog/best-time-to-post-on-linkedin/); [Internshala](https://internshala.com/blog/employer-best-time-to-post-on-linkedin-india/); [RecurPost](https://recurpost.com/schedule-linkedin-posts/best-and-worst-times-to-post-on-linkedin/); [timetopost.co](https://timetopost.co/best-time-to-post/linkedin/india/)

### Inferences
- Combining official anti-bait statements with study data: formats that hold attention natively (documents, polls, text) are safest; polls inflate reach but not engagement quality.
- Timing advice is weakly evidenced; the Buffer shift toward afternoons is the largest dataset. For India-based tech creators targeting global/US audiences, timing should be tested rather than copied.

### Gaps
- Primary van der Blom 2025/2026 reports not accessed; 2026 edition findings not found in search.
- Shield analytics: no study data surfaced. Hootsuite only via comparison snippets.
- No verified data on post length, edit penalty, AI-content downranking magnitude, or exact "golden hour" effect.

## 3. Follower count, network, and in- vs out-of-network distribution

### Takeaway
No public study found that quantifies follower vs non-follower share of impressions for personal profiles in 2024–2026. Evidence shows impressions scale strongly with audience size, personal profiles out-reach company pages, and LinkedIn's official system explicitly retrieves out-of-network candidates while confining flagged content to 1st-degree.

### Cited Findings
- No 2025 study splitting follower vs non-follower impressions found. — [AuthoredUp metrics](https://authoredup.com/blog/linkedin-metrics-to-track)
- Typical impressions: ~225 per post under 1k followers → ~12,111 at 100k+ (≈50x spread) [STUDY vendor data, M-L]. — [magicpost.in](https://magicpost.in/blog/how-many-impressions-are-good-on-linkedin)
- Refine Labs: employee profiles averaged >2.75x impressions and 5x engagement vs the company page despite 46% fewer followers [case study, M]. — [Refine Labs](https://www.refinelabs.com/blog/personal-linkedin-engagement-vs-company-page)
- Official system: retrieval reportedly pulls ~2,000 out-of-network candidates per request; flagged AI/pod content is limited to 1st-degree. — [ByteByteGo](https://blog.bytebytego.com/p/how-linkedin-feed-uses-llms-to-serve); [Engadget](https://www.engadget.com/2174163/linkedin-doesnt-want-your-ai-slop-anymore/)

### Inferences
- Out-of-network distribution is now driven by semantic/interest matching (LLM retrieval) rather than network virality chains; topical consistency likely improves out-of-network matching.

### Gaps
- Follower vs non-follower impression share: no data (LinkedIn analytics show it per-post; no aggregate study found).

## 4. Engagement rates by account size

### Takeaway
Engagement rate (by impressions) for personal profiles is ~2.2–2.7% median for accounts under ~10–20k followers and falls to ~1.5–1.8% for large accounts.

### Cited Findings
- Contentin (Dec 2025, N≈100,000 posts, impression-based): median 2.29%; ~2.2–2.4% under 10k followers; 1.77% at 10k+; median engagements 5 (<1k) → 13 (10k+). — [contentin.io](https://contentin.io/blog/linkedin-engagement-benchmarks/)
- AuthoredUp (N=372,812 personal profiles, via ConnectSafely): ~2.4–2.7% under 20k; 1.78% at 50–100k; 1.53% at 100k+. — [ConnectSafely](https://connectsafely.ai/articles/linkedin-engagement-rate-calculator-guide-2026)
- Favikon citing Socialinsider (follower-based): top quartile nano (0–10k) 2.4%+, mega (500k+) ~0.15%+. — [Favikon](https://www.favikon.com/blog/what-is-a-good-engagement-rate-on-linkedin-a-data-driven-analysis)

### Inferences
- Small tech creators should benchmark against ~2–3% per impression; above that is outperforming.

### Gaps
- Buffer/Metricool follower-tier tables for personal profiles not found.
