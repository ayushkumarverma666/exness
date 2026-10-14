# Creator Data Analysis: Ayush Kumar Verma, LinkedIn 12-month export, benchmarked against public data

**Data sources (primary, creator-owned):**
- [Export A] `AggregateAnalytics_Ayush_Kumar_Verma_2025-10-15_2026-10-14.xlsx`: 12 months. Sheets: DISCOVERY, ENGAGEMENT (daily), TOP POSTS, FOLLOWERS (daily), AUDIENCE DEMOGRAPHICS (followers), CONTENT DEMOGRAPHICS (viewers).
- [Export B] `AggregateAnalytics_Ayush_Kumar_Verma_2026-10-08_2026-10-14.xlsx`: last 7 days.
- All computations were done with python/openpyxl on these files. The "Source" for any computed number is [Export A] or [Export B]. Web benchmarks are cited inline. Note: WebFetch could not resolve most benchmark domains (DNS failure in this environment), so web figures come from search-result summaries of the linked pages and could not be checked against the full page. Treat them as directional.
- Post text is not available. Each post's type was classified from its URL slug, which holds its opening words. Classification is my judgement, and one post's slug is hashtags only.

**Headline account facts ([Export A]):**

| Metric | Value |
|---|---|
| Impressions (12 mo) | 168,714 |
| Members reached | 91,210 (1.85 impressions per member) |
| Engagements (sum of daily) | 1,179 → account-level ER 0.70% |
| Posts in window | 24 (the "max 50" TOP POSTS list returned 24 unique posts covering 99.2% of impressions, so this is effectively every post) |
| First day with any impressions | 2026-06-19 (the day of the first post). Oct 2025 to mid-Jun 2026 had 0 impressions, meaning no posting at all |
| Total followers on 2026-10-14 | 5,548 |
| Sum of daily "new followers" | 5,911 |
| Top-3 posts' share of impressions | 148,383 / 168,714 = **88%** |
| Single biggest post's share | 110,656 / 168,714 = **66%** |

---

## Q1. Post-type classification and performance by type

### Takeaway
Every breakout post (3 of 24) was a **narrative or humor format: a real-person story, a satire, a Hinglish joke**. Each scored 12.8x to 123x the median. All 21 "opinion/insight" posts (hot takes, stat-led, explainers, B2B/GTM) fell within a tight 364 to 1,504 band with a median of about 870, and none broke out. Breakout posts had the **lowest** engagement rates (0.38 to 0.63%), because their reach went far beyond the network that engages. Stat-led and personal/photo posts had the highest ER (about 2.4%) but no reach upside. B2B/GTM was the weakest type on both measures.

### Cited Findings
Per-post table ([Export A]; ER = engagements / impressions; xMedian is relative to the 24-post median of 898):

| # | Date | DoW | Type (from slug) | Format* | Impr. | Eng. | ER % | x Median | Slug (opening words) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 2026-06-19 | Fri | technical explainer (uncertain, hashtag-only slug) | share | 1,169 | 15 | 1.28 | 1.3 | ai-machinelearning-aiengineer |
| 2 | 2026-06-20 | Sat | hot take | share | 1,488 | 17 | 1.14 | 1.7 | a-year-ago-everyone-wanted-to-become-a-prompt |
| 3 | 2026-06-21 | Sun | hot take | share | 896 | 16 | 1.79 | 1.0 | a-model-in-a-notebook-is-not-a-product-that |
| 4 | 2026-06-22 | Mon | hot take | share | 1,504 | 10 | 0.66 | 1.7 | ai-engineer-is-the-most-oversold-title-on |
| 5 | 2026-06-23 | Tue | hot take | share | 643 | 10 | 1.56 | 0.7 | if-youre-still-proud-of-the-ai-agent-you |
| **6** | **2026-06-27** | **Sat** | **satire** | share | **26,273** | 162 | 0.62 | **29.3** | job-posting-5-years-of-llm-experience-required |
| 7 | 2026-06-28 | Sun | technical explainer | ugcPost | 816 | 15 | 1.84 | 0.9 | you-think-attention-is-just-focus-youre |
| 8 | 2026-06-29 | Mon | stat-led | share | 872 | 21 | 2.41 | 1.0 | 90-of-ai-engineers-ive-seen-cant-actually |
| 9 | 2026-07-01 | Wed | hot take | share | 609 | 6 | 0.99 | 0.7 | the-biggest-risk-for-ai-startups-isnt-openai |
| 10 | 2026-07-02 | Thu | hot take | share | 425 | 5 | 1.18 | 0.5 | the-ai-era-doesnt-have-a-building-problem |
| 11 | 2026-07-06 | Mon | stat-led | share | 1,273 | 25 | 1.96 | 1.4 | 95-of-ai-startups-raising-millions-of-dollars |
| 12 | 2026-07-07 | Tue | hot take | share | 1,034 | 20 | 1.93 | 1.2 | companies-bragging-about-replacing-junior |
| 13 | 2026-07-08 | Wed | hot take | share | 1,254 | 14 | 1.12 | 1.4 | ai-product-managers-are-the-most-useless |
| **14** | **2026-07-09** | **Thu** | **real-person story** | share | **110,656** | 697 | 0.63 | **123.2** | my-friend-is-a-lead-engineer-at-a-500-crore |
| 15 | 2026-07-10 | Fri | stat-led | share | 1,156 | 29 | 2.51 | 1.3 | over-40-of-agentic-ai-projects-will-be-cancelled |
| 16 | 2026-07-14 | Tue | hot take (quote/curation) | share | 1,023 | 9 | 0.88 | 1.1 | best-line-ive-seen-on-ai-consulting-this |
| 17 | 2026-08-21 | Fri | technical explainer | share | 526 | 6 | 1.14 | 0.6 | the-context-window-excuse-we-just-need |
| 18 | 2026-08-25 | Tue | B2B/GTM (stat-led) | share | 815 | 7 | 0.86 | 0.9 | 63-of-b2b-buyers-now-use-ai-in-their-buying |
| 19 | 2026-08-27 | Thu | B2B/GTM | share | 364 | 4 | 1.10 | 0.4 | every-ai-gtm-tool-pitch-says-the-same-thing |
| 20 | 2026-09-03 | Thu | B2B/GTM (stat-led) | share | 675 | 10 | 1.48 | 0.8 | 32-of-organizations-skipped-buying-a-software |
| 21 | 2026-09-13 | Sun | real-person story (founder/B2B) | share | 763 | 6 | 0.79 | 0.8 | last-tuesday-at-9-pm-a-founder-i-know-killed |
| **22** | **2026-09-14** | **Mon** | **Hinglish humor** | share | **11,454** | 44 | 0.38 | **12.8** | papa-wo-btech-4-saal-se-5-saal-ki-hogyi-hai |
| 23 | 2026-09-25 | Fri | B2B/GTM (hashtag slug) | share | 696 | 8 | 1.15 | 0.8 | creatoreconomy-b2bmarketing |
| 24 | 2026-10-08 | Thu | personal/photo | ugcPost | 900 | 22 | 2.44 | 1.0 | its-always-chrome-today-me-and-anant-kumar |

*"ugcPost" in the URL usually marks a post created with media or in a different composer flow. "share" is the standard post. Only 2 posts are ugcPost (median 858 impressions vs 960 for share), which is too few to draw any conclusion.

Distribution by type ([Export A]):

| Type | n | Median impr. | Mean impr. | Max impr. | Median ER % | Mean ER % | Pooled ER % |
|---|---|---|---|---|---|---|---|
| Real-person story | 2 | 55,710 | 55,710 | 110,656 | 0.71 | 0.71 | 0.63 |
| Satire | 1 | 26,273 | 26,273 | 26,273 | 0.62 | 0.62 | 0.62 |
| Hinglish humor | 1 | 11,454 | 11,454 | 11,454 | 0.38 | 0.38 | 0.38 |
| Stat-led | 3 | 1,156 | 1,100 | 1,273 | 2.41 | 2.29 | 2.27 |
| Hot take | 9 | 1,023 | 986 | 1,504 | 1.14 | 1.25 | 1.21 |
| Personal/photo | 1 | 900 | 900 | 900 | 2.44 | 2.44 | 2.44 |
| Technical explainer | 3 | 816 | 837 | 1,169 | 1.28 | 1.42 | 1.43 |
| B2B/GTM | 4 | 686 | 638 | 815 | 1.12 | 1.15 | 1.14 |

Overall distribution ([Export A]):

| Stat | Value |
|---|---|
| Median impressions (24 posts) | 898 |
| Mean impressions | 6,970 (7.8x the median, so the distribution is extremely right-skewed) |
| Median / mean excluding top 3 | 872 / 900 (the "normal" band is very tight) |
| Range excluding top 3 | 364 to 1,504 |
| Posts > 5x median | 3 (the same 3 as > 10x): 12.5% of posts |
| Median ER (per post) | 1.15% |
| Mean ER (per post) | 1.33% |
| Pooled ER (sum eng / sum impr) | 0.70% (dragged down by the virals) |

Benchmarks:
- AuthoredUp reports a median ER for personal profiles of about 2.5–2.7% that stays stable from 0 to 20k followers, declining to 1.78% at 50k+ and 1.53% at 100k+ (sample: 372,812 personal-profile posts). Its median personal post overall is 2.37% — [AuthoredUp ER calculator](https://authoredup.com/tools/linkedin-engagement-rate-calculator) (via search summary; direct fetch failed).
- Socialinsider: personal-profile average 3.85% (Q1 2026, cited secondhand), and a 2026 average of 5.20% by impressions across 1.3M posts (mainly business pages). Native documents average 7.00% — [Socialinsider LinkedIn benchmarks](https://www.socialinsider.io/blog/linkedin-engagement-report/); [Viralbrain citing Socialinsider](https://www.viralbrain.ai/blog/good-linkedin-engagement-rate-2026-benchmarks?page=5). Socialinsider's older follower-band data shows 0–5k accounts averaging 14.2% on documents and 1.8% on images — [Socialinsider statistics](https://socialinsider.io/social-media-statistics/linkedin-statistics).
- Favikon (499 creator profiles, follower-based denominator): median 0.93% for 1k–10k followers — [Favikon](https://www.favikon.com/favlab/linkedin-engagement-rate-benchmark). This uses a different denominator, so it cannot be compared directly.

### Inferences
- **ER gap vs benchmark.** The creator's median per-post ER (1.15%) is about **half** of AuthoredUp's personal-profile median (2.4–2.7%), and below Socialinsider's 3.85%. Even the best non-viral types (stat-led 2.4%, personal photo 2.4%) only reach the benchmark median. This points to weak network engagement: hooks that get impressions but few reactions or comments. A likely contributor is the student-heavy follower base (see Q5).
- **Low ER on viral posts is normal.** Low ER on the three breakouts is expected. Reach went to cold audiences, which matches AuthoredUp's explanation that ER falls as posts reach more distant people. **Do not use ER as the success metric for breakouts. Use impressions per follower and followers gained.**
- **What actually broke out.** The breakouts share these traits: (a) a **concrete character or scenario** ("my friend is a lead engineer at a 500-crore [company]", "Papa, wo BTech 4 saal se 5 saal ki hogyi hai", a fake job posting); (b) **humor or absurdity**; (c) **India-specific cultural cues** (crore, Hinglish, BTech/parent dynamic); (d) **mass-relatable career anxiety** that the median Indian SWE feels. Opinion posts aimed at "AI engineers" or "AI founders" never broke out, nor did any of the 9 hot takes.
- **Sample size.** n=1 to 2 per breakout type. The three "winner" types cannot be separated statistically from luck. The robust finding is narrower: 0 of 21 opinion/insight posts exceeded 1.7x the median, while 3 of 4 narrative/humor posts exceeded 12x. The 4th narrative post (#21, founder story) got 0.8x. A Fisher exact test on 3/4 vs 0/20 gives roughly p ≈ 0.001. This is a back-of-envelope figure and the classification is post hoc.

### Gaps
- Without post text, I cannot code hook length, line breaks, image vs text-only, or call-to-action.
- The "share" vs "ugcPost" format signal is weak. I cannot tell carousel from image from video.

---

## Q2. Decay curves of the 3 breakout posts and lifespan of a typical post

### Takeaway
The biggest post got **95% of its lifetime impressions on publish day**. The satire post **peaked on day 2** (a Saturday post that exploded on Monday). The Hinglish post had a classic front-loaded curve (41% on day 0, 77% by day 2, about 96% by day 7). Typical posts get roughly 45–90% of their impressions on day 0 and fade to a floor of about 30–100 impressions per day within 4–6 days. Long tails exist but are small: the viral post still drew 21 impressions and the Hinglish post 286 impressions in the most recent week, 1 to 3 months later ([Export B]).

### Cited Findings
Account-level daily impressions after each breakout. These are account totals, so other posts' impressions are mixed in. Cumulative % is cumulative account impressions divided by the post's lifetime impressions ([Export A]):

| Day | Satire 6/27 (life 26,273) daily | cum % | Story 7/9 (life 110,656) daily | cum % | Hinglish 9/14 (life 11,454) daily | cum % |
|---|---|---|---|---|---|---|
| D-1 | 187 | – | 726 | – | 494* | – |
| D0 | 3,001 (Sat) | 11% | **105,424** (Thu) | **95%** | 4,694 (Mon) | 41% |
| D1 | 5,010 (Sun) | 31% | 2,659 | 98% | 3,093 | 68% |
| D2 | **14,069** (Mon) | **84%** | 1,266 | 99% | 1,037 | 77% |
| D3 | 2,681 | 94% | 1,254 | 100% | 558 | 82% |
| D4 | 1,312 | 99% | 698 | ~100% | 487 | 86% |
| D5 | 720 | ~100% | 776 | – | 352 | 89% |
| D6 | 490 | – | 439 | – | 393 | 93% |
| D7 | 647 | – | 258 | – | 337 | 96% |
| D10 | 549 | – | 234 | – | 103 | 98% |
| D14 | (post #14 goes viral) | – | 155 | – | 73 (after another post on 9/25) | – |
| D20 | – | – | 60 | – | 16 | – |

*D-1 for the Hinglish post includes the 9/13 founder-story post (763 lifetime).
Cumulative values above 100% (for example the satire curve) are caused by other posts published on 6/28, 6/29, 7/1 and so on being mixed into the account totals. Daily account data cannot separate them.

Typical (non-viral) posts in quiet periods, account daily impressions from D0 to D6 ([Export A]):

| Post | Lifetime | D0 | D1 | D2 | D3 | D4 | D5 | D6 | D0 share of lifetime |
|---|---|---|---|---|---|---|---|---|---|
| 8/25 B2B stat | 815 | 545 | 128 | 164† | 110 | 27 | 29 | 29 | 0.67 |
| 9/3 B2B stat | 675 | 433 | 577 | 259 | 210 | 81 | 37 | 39 | 0.64 |
| 9/25 B2B hashtag | 696 | 427 | 399 | 176 | 73 | 78 | 36 | 7 | 0.61 |
| 10/8 photo | 900 | 458 | 213 | 347 | 186 | 152 | 64 | 71 | 0.51 |
| 8/21 explainer | 526 | 293 | 35 | 17 | 34 | 545† | – | – | 0.56 |

†Another post was published that day. Across the quiet-period posts, D0 accounts for about **45–70%** of lifetime impressions, and the post is mostly done by D4–D5. The Aug baseline with almost no posting was about 76 impressions per day (residual tail).

Last-7-day residual impressions of old posts ([Export B], 10/8–10/14): Hinglish post 286, B2B hashtag post 161, viral story 21, 32%-stat post 15, founder story 14, satire 13, others 1–12.

Benchmarks:
- Vendor blogs say 70–80% of impressions arrive on day 1, with a sharp drop after 48 hours unless a post goes viral. Text posts get nearly all their impressions within about a day, while image and video posts can run 10–12 days — [Supergrow](https://www.supergrow.ai/blog/what-are-linkedin-impressions); [ContentIn](https://contentin.io/blog/what-are-impressions-on-linkedin/).
- A Towards Data Science tracking study found the main activity happens in the first 12 days, with occasional resurfacing after about 2 weeks — [Towards Data Science](https://towardsdatascience.com/?p=139407).
- A 2015 analysis described LinkedIn posts as lacking a "long tail", with most peaking within 48 hours — [GZ Consulting](https://gzconsulting.org/2015/09/27/7/).

### Inferences
- **Two viral shapes:**
  - (1) **Instant explosion.** The story post got 95% on D0. This suggests very fast early engagement (697 engagements) that pushed it into broad distribution within hours. It may also partly reflect how LinkedIn attributes impressions by date, which is an untested caveat.
  - (2) **Delayed ignition.** The satire post grew D0 < D1 < D2 and peaked on Monday. A weekend post found its audience when the workweek started, perhaps through reshares or re-distribution.
- **The Hinglish post sits in between.** Its curve is consistent with the benchmark "most in 48h" pattern, plus an unusually long tail: it still drew 286 impressions per week a month later.
- **Typical lifespan.** A typical post on this account is "alive" for about 4–5 days, about twice as long as the vendor "day 1" claim. Small accounts may get slower, second-degree spread.

### Gaps
- Per-post daily impressions are not in the export. Curves are account totals, so overlapping posts contaminate them.
- There is no hour-level data, so first-hour velocity cannot be measured.

---

## Q3. Posting cadence by month, and the Aug–Sep shift to B2B content

### Takeaway
There were two posting phases. **Phase 1** (Jun 19–Jul 14) had 16 AI-career posts, 2 of them viral, and 151k impressions. Then came a **38-day gap with no posts (Jul 15–Aug 20)** right after the biggest post ever. **Phase 2** (Aug 21–Oct 8) had 8 posts, mostly B2B/GTM. Non-viral median impressions fell by about 32% (1,028 to 696), and B2B posts were the weakest type. The only Phase 2 breakout was an off-strategy Hinglish humor post.

### Cited Findings
Monthly cadence ([Export A]):

| Month | Posts | Impressions | Engagements | Avg impr/day | New followers |
|---|---|---|---|---|---|
| 2025-10 (17 days) to 2026-01 | 0 | 0 | 0 | 0 | 21 total |
| 2026-02 | 0 | 0 | 0 | 0 | 185 |
| 2026-03 | 0 | 0 | 0 | 0 | 655 |
| 2026-04 | 0 | 0 | 0 | 0 | 374 |
| 2026-05 | 0 | 0 | 0 | 0 | 498 |
| 2026-06 | 8 | 28,641 | 197 | 955 | 795 |
| 2026-07 | 8 | 121,091 | 871 | 3,906 | 1,264 |
| 2026-08 | 3 | 2,367 | 21 | 76 | 800 |
| 2026-09 | 4 | 14,892 | 66 | 496 | 898 |
| 2026-10 (14 days) | 1 | 1,723 | 24 | 123 | 421 |

Phase comparison ([Export A]):

| Phase | Posts | Total post impr. | Median impr. | Median excl. >5k | Mean excl. >5k | Median ER |
|---|---|---|---|---|---|---|
| P1 AI-career (6/19–7/14) | 16 | 151,091 | 1,095 | 1,028 | 1,012 | 1.23% |
| P2 B2B-tilted (8/21–10/8) | 8 | 16,193 | 730 | 696 | 677 | 1.12% |
| B2B/GTM posts only | 4 | 2,550 | 686 | – | 638 | 1.12% |

- In Phase 1, the creator posted almost daily (16 posts in 26 days, about 4.3 per week). In Phase 2, about 1.1 posts per week ([Export A]).
- Benchmark: van der Blom's Algorithm Insights 2025 report is cited for year-over-year declines of views −50%, engagement −25% and follower growth −59% for creators — [Dataslayer](https://dataslayer.ai/blog/linkedin-algorithm-february-2026-whats-working-now); [Agorapulse FR](https://www.agorapulse.com/fr/blog/algorithme-linkedin-2025-comment-maximiser-sa-visibilite/). Podcast notes for the 2026 edition (1.3M posts, H1 2026) cite reach down about 60% over two years for active creators — [Creator Science podcast listing](https://www.castfox.net/podcast/creator-science-111713/episode/307-richard-van-der-blom-the-state-of-linkedin-in-2026-based-on-data-from-13-million-posts-2124510). This is secondhand and I could not access the report itself.

### Inferences
- **The B2B pivot cost reach.** B2B/GTM content addressed an audience the follower base does not contain. Followers and viewers are mostly SWEs, students and entry-level people. Owners, CXOs and VPs together are about 5% of followers (Q5). The best guess is that the pivot cut non-viral reach by about a third.
- **Confound: three changes at once.** Cadence dropped about 4x, there was a 38-day gap, and the topic changed, all at the same time. The data cannot isolate the topic effect. A platform-wide reach decline (van der Blom) is a further possible confound.
- **Missed window.** The 38-day silence right after a 110k post wasted the highest-attention moment. About 600 followers arrived in the 4 days after the viral post, and they then saw nothing for 5 weeks.
- **The off-strategy post won.** The one Phase 2 breakout was off-strategy (Hinglish family humor about a BTech degree taking 5 years). This reinforces that the audience rewards Indian-engineer-life humor and stories, not GTM.

### Gaps
- There is no data on comments or reshares split out, and no profile-view data.

---

## Q4. Follower growth: gross vs net, unexplained spikes, followers per 1k impressions

### Takeaway
Gross new followers (5,911) exceed the end total (5,548), which implies **at least 363 unfollows plus whatever the starting count was**. **Follower growth is mostly not driven by post impressions.** The account gained 1,712 followers in Feb–May with **zero posts and zero impressions**. Recurring spikes of 70–155 followers per day occur on days with under 1,000 impressions. Breakout posts converted at about 5–9 followers per 1k impressions (raw), or about 4–6 after subtracting baseline. The Hinglish post produced essentially **no** excess followers.

### Cited Findings
Totals ([Export A]):

| Item | Value |
|---|---|
| Sum of daily new followers (10/15/25–10/14/26) | 5,911 |
| Total followers on 10/14/26 | 5,548 |
| Implied unfollows | ≥ 363 (= starting followers + 363). Starting followers are unknown, but 21 followers were gained in Oct–Jan, so the account was likely small at the start |
| New before first post (to 6/18) | 2,163 |
| New from 6/19 onward | 3,748, so followers on 6/19 were ≥ 1,800 |
| Followers lower bound at 7/9 / 8/21 / 9/14 | ≥ 2,368 / ≥ 4,018 / ≥ 4,633 |

Baseline follower rates ([Export A]):

| Period | Avg new followers/day | Avg impr/day |
|---|---|---|
| Feb–May 2026 (no posts) | 14.3 | 0 |
| Jun 19–Jul 15 (active + 2 virals) | 45.8 | 5,450 |
| Aug 2026 (3 posts) | 25.8 | 76 |
| Jul 16–Oct 14 | 27.6 | 237 |

Correlation of daily impressions with daily new followers (6/19 onward) is r = 0.58. Excluding the days with more than 5k impressions, it drops to r = 0.16 ([Export A]).

Breakout follower conversion (D0–D3 window, raw) ([Export A]):

| Post | Followers D0–D3 | Impr. D0–D3 | Followers per 1k impr. (raw) | Excess over ~25/day baseline | Excess per 1k |
|---|---|---|---|---|---|
| Satire 6/27 | 212 (88, 42, 62, 20) | 24,761 | 8.6 | ~110–150 | ~4.5–6 |
| Story 7/9 | 592 (289, 117, 112, 74) | 110,603 | 5.4 | ~490 | ~4.4 |
| Hinglish 9/14 | 57 (26, 16, 11, 4) | 9,382 | 6.1 | ≈ 0 (baseline about 27/day × 4 ≈ 108) | ≈ 0 |

For normal posts, no follower lift can be detected. Daily followers on normal-post days look the same as baseline days.

Days with ≥ 70 new followers and < 1,000 impressions, i.e. not explained by posts ([Export A]):
2026-03-02 Mon (127), 03-16 Mon (83), 05-08 Fri (89), 06-15 Mon (76), 06-17 Wed (104), 06-24 Wed (106), 07-04 Sat (91), 07-17 Fri (72), 07-23 Thu (100), 08-01 Sat (83), 08-05 Wed (77), 08-12 Wed (111), 08-19 Wed (70), 08-25 Tue (94; 545 impr.), 09-05 Sat (78), 09-11 Fri (130), 09-19 Sat (114), 09-21 Mon (151), 10-03 Sat (114), 10-10 Sat (155).
- Mean new followers by weekday since Feb: Sat 33.0, Mon 27.6, Wed 23.8, Thu 21.4, Tue 21.2, Fri 20.7, Sun 13.5. Medians are 8–15, so spike days drive the means. Saturday spikes cluster from Aug to Oct (8/1, 9/5, 9/19, 10/3, 10/10).
- 248 followers arrived Jun 15–18, before the first post ever.

Benchmark: van der Blom 2025 reports follower growth down 59% year over year for creators — [Dataslayer](https://dataslayer.ai/blog/linkedin-algorithm-february-2026-whats-working-now). I found no public benchmark for followers gained per 1k impressions.

### Inferences
- **Most growth is off-feed.** Probable sources are profile surfacing in "People you may know" or follow suggestions, connection requests auto-converting to follows, comments on other creators' posts, and community or college channels. The top follower companies are Scaler School of Technology, Scaler AI Labs, GirlScript, Mirai School and BITS Pilani, which points to student/community channels. **Hypothesis:** the recurring Saturday spikes come from a weekly external event, such as a community newsletter, a class, a WhatsApp/Discord drop or a college event. The creator should check what happens on those days.
- **Story > humor for follows.** The story and satire posts converted cold viewers into followers at about 4–6 per 1k. The Hinglish humor post did not, likely because entertainment without a professional "why follow" gives no reason to follow. **Stories and satire about AI careers grow followers; generic humor only grows impressions.**
- **Unfollows.** At least 363 unfollows (≥6% of gross) is plausible for an account with large viral cohorts and a topic pivot. It cannot be dated from the export.

### Gaps
- Unfollows are not reported daily, so net growth cannot be tracked by day.
- Follower source (feed vs profile vs search) is not in the export.

---

## Q5. Follower vs viewer demographics (AUDIENCE vs CONTENT)

### Takeaway
Viewers over 12 months (dominated by the viral posts) were **more senior, more often at big tech or large enterprises, and more often SWE-titled** than the follower base. The follower base is **student- and entry-heavy and Delhi-skewed**. In the last 7 days with no virality, viewer demographics collapse back toward the follower profile ([Export B]). The viral posts reached a "working SWE at a large company" audience that the B2B pivot did not target either.

### Cited Findings
([Export A] AUDIENCE = followers, CONTENT = viewers. [Export B] = last-7-day viewers.)

| Dimension | Followers | Viewers (12 mo) | Viewers (last 7 d) |
|---|---|---|---|
| Seniority: Entry | 27% | 36% | 18% |
| Seniority: Senior | 11% | **31%** | 10% |
| Seniority: Training | 8% | 4% | 10% |
| Seniority: Owner / CXO / Director / VP | 3 / 1 / 1 / <1% | 2 / 1 / 2 / 1% | Owner 4% |
| Job title: Software Engineer | 9% | **29%** | 7% |
| Job title: Founder / Co-founder | 2% / 2% | 1% / <1% | Founder 3% |
| Job title: AI Eng / Data Sci / ML Eng | 2 / <1 / <1% | 3 / 3 / 2% | – |
| Company size 10,001+ | 8% | **26%** | 7% |
| Company size 1,001–5,000 | 5% | 11% | 3% |
| Company size 2–10 / 11–50 | 8% / 12% | 5% / 9% | 9% / 9% |
| Top companies | Scaler School of Tech, Scaler AI Labs, GirlScript, Google, Mirai School, TCS, BITS Pilani, Internshala | Microsoft, Amazon, Oracle, Google, TCS, IBM, JPMorganChase, Qualcomm, Accenture | n/a |
| Location: Bengaluru | 26% | 25% | 24% |
| Location: Delhi | 17% | 10% | 17% |
| Location: Hyderabad / Mumbai / Chennai | 5 / 3 / 2% | 7 / 5 / 4% | 3 / 3 / –% |
| Location: SF Bay Area | not in top 10 | 2% | – |
| Industry: Software Development | 22% | 35% | 19% |
| Industry: IT Services | 16% | 23% | 17% |
| Industry: Tech, Info & Internet | 28% | 13% | 26% |
| Industry: Education (all ed rows) | ~13% | ~5% | ~15% |

### Inferences
- **Who the viral posts reached.** The viral audience was "mid-career Indian software engineers at MNCs and big tech". That is the persona in the "lead engineer at a 500-crore company" and "5 years of LLM experience required" posts, and it is about 3x over-represented among viewers vs followers (Senior 31 vs 11%, SWE 29 vs 9%, 10k+ companies 26 vs 8%).
- **The pivot targeted an audience that isn't there.** B2B/GTM content targets owners and CXOs, who are about 4–5% of followers and about 3–4% of viewers. The pivot targeted an audience present in neither group.
- **Follower base vs content.** The base is about 35% entry/training plus about 13% education-industry. That may explain the low ER on senior-targeted founder/GTM takes, and the higher ER on relatable career content.

### Gaps
- The exports give only top-N buckets with rounded % values, not full distributions, and no follower-vs-viewer split per post.

---

## Q6. Day of week of posts vs impressions

### Takeaway
There is no reliable day-of-week effect. Two of the three breakouts landed on Sat or Mon and one on Thu, and the normal posts are flat (median about 700–1,400 on any day). n = 2–5 per day, so this is noise.

### Cited Findings
([Export A])

| DoW | n | Median impr. | Mean impr. | Median ER % |
|---|---|---|---|---|
| Mon | 4 | 1,388 | 3,776 | 1.31 |
| Tue | 4 | 919 | 879 | 1.22 |
| Wed | 2 | 932 | 932 | 1.05 |
| Thu | 5 | 675 | 22,604 (story viral) | 1.18 |
| Fri | 4 | 926 | 887 | 1.22 |
| Sat | 2 | 13,880 (satire viral) | 13,880 | 0.88 |
| Sun | 3 | 816 | 825 | 1.79 |

- The satire post published on Saturday peaked on Monday (14,069 impressions), which suggests the workweek audience drove its distribution ([Export A]).

### Inferences
- The only usable signal is that Monday was the big day for both the satire peak and the Hinglish launch (4,694 on D0). This is consistent with the workday-commute browsing audience of Indian SWEs, but the evidence is very weak.

### Gaps
- Post time of day is not in the export.

---

## Q7. External benchmarks: ER by follower bucket, impressions per follower, outlier frequency

### Takeaway
For a personal profile of about 2–5k followers, typical benchmarks are a **median ER of about 2.4–2.7%** (AuthoredUp) and **impressions per post of about 15–35% of followers** (various vendors). Industry data says about **2% of posts** reach "viral" (>10x average engagement), and creators get about 90–93% of impressions from their top 20% of posts. This creator's non-viral impressions per follower are in line with benchmarks. ER is about half of benchmark. Outlier frequency (12.5% of posts > 10x median) is **far above** the ~2% industry rate.

### Cited Findings
- **ER by follower bucket:** AuthoredUp reports a median of about 2.5–2.7% for 0–20k followers, 1.78% at 50k+ and 1.53% at 100k+ (n = 372,812 personal posts) — [AuthoredUp](https://authoredup.com/tools/linkedin-engagement-rate-calculator). ConnectSafely gives a similar <5k ≈ 2.5–2.7% — [ConnectSafely](https://connectsafely.ai/articles/linkedin-engagement-rate-calculator-guide-2026). Socialinsider gives a personal-profile average of 3.85% (Q1 2026) — [Viralbrain citing Socialinsider](https://www.viralbrain.ai/blog/good-linkedin-engagement-rate-2026-benchmarks?page=7). These are averages, which run higher than medians.
- **Impressions per follower:**
  - The Shield Index (personal/creator accounts, Mar 2026): a typical post reaches about 33% of the network at 0–1k followers and about 5% at 100k+ — [Shield Index](https://theshieldindex.beehiiv.com/p/march-2026-linkedin-reach-benchmarks-by-follower-size). The 1k–5k and 5k–10k band values were not visible in the summary.
  - Supergrow (claims 1.8M posts, unverified) gives average reach of 8–12% of followers, down from 15–20% — [Supergrow](https://supergrow.ai/blog/what-are-linkedin-impressions).
  - Socialinsider (<5k accounts) gives impression rate by format: text ~16%, images up to 26%, video ~30%, documents ~44% — [Socialinsider statistics](https://socialinsider.io/social-media-statistics/linkedin-statistics).
  - Rival IQ (company pages, 2023) gives an average of 8.6 impressions per 100 followers per post — [Rival IQ](https://www.rivaliq.com/blog/linkedin-benchmark-report/).
  - Willow (company pages, 2026) found 500–2,500-follower pages reach 28–34%, falling to 7% at 10k+ — [Willow](https://www.willow.co/blog/linkedin-followers-impressions-report).
- **Outlier frequency:**
  - ViralBrain defines viral as more than 10x *average* engagement and finds about 2% of posts qualify (454/20,796 in Q1 2026; 876/41,336 in Q3; 1,126/53,352 in Q4). In its data the median post has about 26–35 engagements — [ViralBrain Q3 2026](https://www.viralbrain.ai/blog/linkedin-intelligence-report-q3-2026); [Q1 2026](https://www.viralbrain.ai/blog/linkedin-intelligence-report-q1-2026).
  - Level Up/Saywhat says the median creator gets 93% of impressions from their top 20% of posts (an earlier version said 90% from 318k posts) — [Level Up newsletter](https://levelupnewsletter.beehiiv.com/p/consistency-is-the-wrong-goal-eec2).
  - I found no source that uses "10x *median* impressions" specifically.

Creator vs benchmark (creator values computed from [Export A]):

| Metric | Creator | Benchmark |
|---|---|---|
| Median per-post ER | 1.15% | ~2.4–2.7% median (AuthoredUp); 3.85% avg (Socialinsider) |
| Non-viral impr. per follower, P1 (median 1,028 / ≥1.8k–2.4k followers) | ≤ ~45–57% | ~33% at 0–1k (Shield Index); 28–34% at 500–2.5k company pages (Willow) |
| Non-viral impr. per follower, P2 (median 696 / ≥4.0k–5.5k followers) | ~13–17% | ~8–12% (Supergrow); text ~16% for <5k (Socialinsider) |
| Share of posts > 10x median | 12.5% (3/24) | ~2% > 10x average engagement (ViralBrain) |
| Impressions share of top 20% of posts (top 5 of 24) | top 5 = 152,363 / 168,714 = 90% | 90–93% (Level Up) |
| Median engagements per post | 15 | 26–35 (ViralBrain median, scraped sample of larger creators) |

### Inferences
- The creator's reach problem is not distribution (impressions per follower is at or above benchmark). The problems are **low engagement per impression on normal posts** and **topic/audience mismatch**.
- An unusually high hit rate (3/24) with heavy concentration means the creator has demonstrated breakout ability in a specific lane. The strategy question is how often he works in that lane, not whether he can break out.

### Gaps
- I could not access van der Blom's report directly for follower-bucket ER or impression figures. All van der Blom numbers here are secondhand.
- Most benchmark pages could not be fetched (DNS errors), so the figures rely on search summaries.

---

## Q8. Hypotheses on why the top 3 broke out, and what to log

### Takeaway
The leading hypothesis is a **"relatable Indian-engineer character + absurd/funny twist + hook that names a specific person or situation"** formula. It reached senior SWEs at large companies, a group much larger than the follower base. The creator needs to log post-level features to test this against alternatives such as timing, format and luck.

### Cited Findings (data supporting each hypothesis; all [Export A] unless noted)

| # | Hypothesis | Evidence for | Evidence against / confound |
|---|---|---|---|
| H1 | **Character-led hooks** ("my friend…", "Papa…", "Job posting:") beat abstract claims ("AI engineer is the most oversold title…") | 3/4 character/scenario posts broke out; 0/20 abstract posts went above 1.7x median | Founder story #21 ("last Tuesday at 9 pm a founder I know killed…") got 0.8x. It was a B2B topic, so the audience did not match |
| H2 | **Humor/satire about the Indian tech job market** (LLM-experience requirements, BTech taking 5 years, 500-crore company) taps mass relatability | All 3 breakouts are career-anxiety or absurdity themes. Viewer mix shifted to senior SWEs | n = 3 |
| H3 | **India-specific cultural cues** (crore, Hinglish, Papa/BTech) widen reach among Indian SWEs | 2/3 breakouts contain them. Viewers: Bengaluru/Hyderabad/Mumbai/Chennai up | Satire post had no obvious India cue in the slug |
| H4 | **Audience target = working SWEs, not founders/buyers.** The B2B pivot depressed reach | P2 non-viral median −32%; B2B lowest type (686); owner/CXO ≤5% of either audience | Cadence and gap confound |
| H5 | **Momentum/cadence.** Posting near-daily before a breakout primes distribution | Both big virals came during the 4/week phase (posts #6 and #14) | Hinglish broke out at ~1/week; no counterfactual |
| H6 | **Weekend/Monday timing** helps career-humor content | Satire peaked Monday; Hinglish launched Monday | Biggest post was Thursday; n tiny |
| H7 | **Low-ER posts can still break out.** Distribution is driven by early velocity among cold audiences, not by ER | All 3 breakouts had the *lowest* ERs (0.38–0.63%) | ER is diluted by reach, so this is circular. Need first-hour data |
| H8 | **Luck/fat tails.** Some breakouts are random | Industry: ~2% viral; 93% of impressions from top 20% (Level Up) | Creator's 12.5% is 6x the industry rate, which argues for skill/format |

Benchmarks on what to log: vendor sources stress format (documents/images out-reach text for <5k accounts) — [Socialinsider statistics](https://socialinsider.io/social-media-statistics/linkedin-statistics) — and early engagement within 48h — [Supergrow](https://www.supergrow.ai/blog/what-are-linkedin-impressions).

### Inferences: recommended logging schema (one row per post)
1. **Post text** (full) plus **hook line** (first ~140 chars shown before "…see more"), and hook type: character/"my friend", stat, question, contrarian claim, satire format (fake job post, fake chat), Hinglish/English.
2. **Format:** text-only / single image / carousel-document / video / poll / repost-with-comment. Note whether there is a photo of a person.
3. **Target persona** (student, junior SWE, senior SWE, founder, B2B buyer) and **topic** (AI careers, AI startups, GTM, personal).
4. **Publish time** (IST, to the hour) and day of week.
5. **First-hour and first-24h metrics:** impressions, reactions, comments, reposts at T+1h, T+3h and T+24h (LinkedIn's per-post analytics shows these if checked manually). Also comments the creator replied to within the first hour.
6. **Per-post 7-day impressions, followers gained from the post, and profile views** (LinkedIn per-post analytics shows "followers gained" per post on recent versions; record it).
7. **External distribution:** whether it was shared in WhatsApp/Slack/college groups or tagged someone (#24 tagged "Anant Kumar"), and whether a larger creator commented or reposted.
8. **Off-platform events** on spike days (Saturdays especially): sessions, community posts, newsletter mentions. This tests the off-feed follower-source hypothesis.
9. **Weekly unfollows** (net follower count snapshot each Monday) to separate gross from net.

Suggested test: over the next 8–12 posts, alternate character-led AI-career stories/satire (H1–H3) with matched abstract takes on the same topic. Hold the time slot constant, and compare median impressions and follower gain per 1k impressions.

### Gaps
- Without post text or first-hour data, H1–H3 and H7 cannot be separated. All hypotheses rest on 3 events.
- Per-post "followers gained" and "profile views" are not in the aggregate export.
