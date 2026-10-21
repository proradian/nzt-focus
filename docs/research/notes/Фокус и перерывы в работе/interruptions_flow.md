# Interruptions, Task Switching, Attention Residue and Flow in Knowledge Work: Evidence for Designing ~1-Hour Focus Sessions

Note on method: primary PDFs were retrieved and text-extracted where possible (Mark et al. 2008; Mark et al. 2017; Iqbal & Horvitz 2007; Iqbal & Bailey 2008; Dabbish et al. 2011; Mark et al. CSCW 2015; Ma et al. ICSE 2024; Pandab 2015 thesis). Abstracts were pulled from Europe PMC / Crossref for Biwer 2023, Ophir 2009, Stothart 2015, Altmann 2014, Ruiz Pardo & Minda 2022, Leroy & Glomb 2018. Items marked "secondary" were not checked against the original paper.

## 1. Gloria Mark's numbers: screen-switching time (2.5 min → 47 s) and the "23 minutes 15 seconds" statistic

### Takeaway
The "47 seconds" is average time on one screen before switching (computer logging), not a measure of "attention span" as a cognitive capacity. The "23 min 15 s" figure comes from a 2006 Gallup interview: it is the average time until people *returned* to an interrupted work project (with ~2 other tasks done in between). It is not time spent "refocusing", and it is not a finding of the frequently cited 2008 "Cost of Interrupted Work" paper. That paper actually found interrupted people finished *faster*, but with more stress.

### Cited Findings
**Screen-switching ("attention span") series**
- Mark: "back in 2004, we found that people averaged two and a half minutes on a screen before switching"; since "around 2016" the average is 47 seconds; "the median ... is 40 seconds". She describes the method as objective, unobtrusive background logging, and says other researchers replicated it with computer logging. — [Steelcase podcast transcript with Gloria Mark](https://www.steelcase.com/research/articles/our-47-second-attention-span-with-gloria-mark-s5-ep3-transcript/)
- The 2004 baseline came from in-person observation (researchers timing switches with a stopwatch). A ~75-second figure from a 2012 round is reported in UC interviews; the 47 s figure comes from logging studies of roughly the last 5–6 years before 2023. — [UC Irvine podcast/interview](https://news.uci.edu/2023/05/05/uci-podcast-if-you-cant-pay-attention-youre-not-alone); [University of California news](https://www.universityofcalifornia.edu/news/cant-pay-attention-youre-not-alone)
- A 2016 Mark et al. study logged 40 information workers over two work weeks and reported a median online-screen focus duration of 40 s (secondary). — [Silicon Canals summary](https://siliconcanals.com/t-screen-attention-47-seconds-gloria-mark/)
- In a Microsoft field study (Mark, Iqbal, Czerwinski, Johns, CSCW 2015; N=32 employees, 5 days, logging plus experience sampling):
  - The average Facebook visit lasted ~18 s and the average email visit ~32 s.
  - People visited Facebook 21 times/day on average (max 264) and checked email 74 times/day on average (max 373).
  - The more total screen switches and email time in a day, the lower people rated their productivity at day's end.
  - "Rote" and bored states preceded more Facebook and face-to-face interaction.
  - — [Mark et al. 2015, "Focused, Aroused, but so Distractible" (PDF)](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/10/p903-mark.pdf)
- Caveat: the 47-second figure describes time on one screen before switching. It does not show a biological attention limit (secondary). — [Silicon Canals](https://siliconcanals.com/t-screen-attention-47-seconds-gloria-mark/)

**The "23 minutes 15 seconds" origin and what it measured**
- Gallup Business Journal interview (June 8, 2006), describing the field observation study behind Mark, González & Harris (CHI 2005):
  - "most interrupted work was resumed on the same day -- 81.9 percent"; the average return time was 23 minutes 15 seconds, which Mark called "not so long".
  - "There are about two intervening tasks before you go back to your original task."
  - People spent about 3 min 5 s on an event before switching.
  - With interruptions of ≤2 min removed, people still worked 12 min 18 s in a "working sphere" before switching.
  - — [Gallup, "Too Many Interruptions at Work?" (2006)](https://news.gallup.com/businessjournal/23146/Too-Many-Interruptions-Work.aspx)
- Mark's own later peer-reviewed citation states it loosely: "Mark et al. [20] found that it takes people on average around 23 minutes to resume an interrupted task". Reference [20] is Mark, González & Harris, "No task left behind?" (CHI 2005). — [Mark et al. CSCW 2015 PDF](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/10/p903-mark.pdf)
- The underlying observational dataset (36 informants, 3 US high-tech firms; analyzed in Dabbish, Mark & González 2011) puts the mean duration of a working-sphere segment at 11 min 28 s. — [Dabbish et al. CHI 2011 PDF](https://www.ics.uci.edu/~gmark/Home_page/Publications_files/CHI%202011%20Self-interruption.pdf)
- Several commentators note that the exact "23 min 15 s" figure does not appear in the peer-reviewed papers it is usually attached to (2004, 2005, 2008). They trace it to the interview. — [BRNSFT](https://www.brnsft.com/blog/gloria-mark-23-minute-rule-revisited); [dam-it.io](https://dam-it.io/blog/interruption-myth-23-minutes); [Medium](https://medium.com/write-rise/the-attention-span-stat-everyone-keeps-getting-wrong-91c418793ccc)
- **Common misquote:** "it takes 23 minutes to regain focus after any distraction." The actual quantity is elapsed clock time until a person goes back to an interrupted *project*. That time includes handling the interruption itself and ~2 other tasks. It does not measure cognitive ramp-up. — [Gallup 2006](https://news.gallup.com/businessjournal/23146/Too-Many-Interruptions-Work.aspx); [siliconcanals commentary](https://siliconcanals.com/t-work-interruptions-23-minutes-275-pings-organisational-focus/)

**Mark, Gudith & Klocke 2008, "The Cost of Interrupted Work: More Speed and Stress" (CHI 2008) — often wrongly cited as the 23-min source**
- Lab study in Germany. N=48 (81% German university students, mean age 26; 15 male, 33 female; paid €12).
- Email-processing task under 3 conditions: no interruption, same-context interruptions, different-context interruptions. Interruptions came by phone or IM, and "interruption frequency was set to two minutes".
- Time to complete the task was **shortest when interrupted**: baseline 22.77 min vs 20.31 min (same context) vs 20.60 min (different context), p<.05. There were no differences in errors or politeness, and emails were shorter when interrupted.
- Interrupted conditions had higher stress, frustration, time pressure and effort (scale 1–20):
  - Stress: 6.92 baseline vs 9.46 / 9.13 (p<.001).
  - Frustration: 4.73 vs 6.63 / 6.48 (p<.007).
  - Effort: 9.50 vs 11.04 / 11.52 (p<.001).
- Authors: "After only 20 minutes of interrupted performance people reported significantly higher stress, frustration, workload, effort, and pressure"; "interrupted work may be done faster, but at a price."
- Interruption context (same vs different topic) made no difference.
- — [Mark, Gudith & Klocke 2008 (PDF)](https://www.ics.uci.edu/~gmark/chi08-mark.pdf)

**Other "recovery time" figures that are misattributed**
- A widely shared claim says "10–15 min to return to editing code and 30–45 min to recover full context". It is attributed to the ICSE 2024 study "Breaking the Flow" (Ma, Huang & Leach; N=20, 2-hour lab sessions). A text search of that paper found no such figures. Its actual findings: on-screen interruptions with high requester dominance increased code-comprehension time; in-person interruptions *lowered* physiological stress, yet participants *reported* more stress. — [Ma et al. ICSE 2024 (PDF)](https://kjl.name/papers/icse24.pdf); claim as reported by [ShiftMag](https://shiftmag.dev/do-not-interrupt-developers-study-says-5715/)
- Microsoft 2025 Work Trend Index (telemetry; ~31,000 workers, 31 countries per press coverage): interruptions from meetings, email or notifications arrive about every 2 minutes during core hours, ~275/day. This is an industry report, not peer-reviewed. Press paraphrases such as "only two minutes of deep focus" are interpretations. — [HR Executive](https://hrexecutive.com/talent-management-in-the-age-of-the-infinite-workday-microsofts-recommendations/); [Business Today](https://www.businesstoday.in/amp/technology/news/story/microsoft-report-warns-of-the-infinite-workday-calls-for-radical-ai-led-reinvention-480791-2025-06-18); [Unleash](https://unleash.ai/artificial-intelligence/news/microsoft-employees-are-interrupted-every-2-minutes-how-can-ai-help-us-re-focus-on-the-work-that-matters)

### Inferences
- In app copy, avoid "every distraction costs 23 minutes". A defensible phrasing: "In field studies, an interrupted project was picked back up ~23 minutes later on average, usually after two other tasks."
- The robust finding in Mark 2008 is stress and effort cost, not lost time. People compensate by working faster. A focus app should frame the benefit of interruption-free sessions partly as lower strain and stress, not only as more output.
- Twenty minutes of interruption every ~2 minutes was enough to raise stress measurably. This supports protecting at least ~20–60 min blocks.

### Gaps
- I did not retrieve the full text of Mark, González & Harris 2005 to confirm the exact resumption metric and its distribution (median vs mean). The Gallup interview is the only verified source for "23 min 15 s".
- No peer-reviewed paper with its sample size was located for the 2012 "75 seconds" round. Only interview sources were found.

## 2. Task-switching costs, attention residue and resumption lag (Leroy, Monsell, Altmann & Trafton, Iqbal & Horvitz)

### Takeaway
Switching has costs at every timescale:
- **Milliseconds:** lab switch costs, with a "residual" cost that persists even after preparation.
- **Seconds:** a 2.8 s interruption doubles sequence errors.
- **Minutes:** in the field, after an email or IM alert people spend ~10 min on diversions and another ~10–16 min before regaining the prior state of the work; 27% of suspensions last more than 2 h.
- **Lingering:** attention residue from an unfinished task lowers performance on the next task.

A brief "ready-to-resume" plan reduces residue.

### Cited Findings
- **Monsell 2003** (Trends in Cognitive Sciences 7(3):134–140, UK review): switching tasks yields slower, more error-prone responses. A "residual" switch cost remains even when time is allowed to prepare (Rogers & Monsell 1995). — [Monsell 2003, copy on Scribd](https://www.scribd.com/document/467027720/m3); [overview, Univ. Granada record](https://produccioncientifica.ugr.es/documentos/618f55209ff8c939aacbae50?lang=en)
- **Altmann, Trafton & Hambrick 2014** (J Exp Psychol: General 143(1):215–226, USA; ~300 participants per press release):
  - Interruptions averaging 4.4 s tripled sequence errors after the interruption; interruptions averaging 2.8 s doubled them.
  - Non-sequence errors were unaffected. Interruptions "shift the focus and thereby cut off the flow" of activation needed to keep one's place.
  - — [Europe PMC abstract / APA](https://www.interruptions.net/literature/Altmann-JExpPsycholGen14.pdf); [MSU press release](https://msutoday.msu.edu/news/2013/brief-interruptions-spawn-errors)
- **Altmann & Trafton 2002, "Memory for goals"** (Cognitive Science 26(1)): resumption depends on the activation of a suspended goal, which decays, and on environmental cues. This is the theoretical basis for "resumption lag". The abstract was not retrieved this session, so specific numbers are not reported here.
- **Iqbal & Horvitz 2007** (CHI 2007, Microsoft Research, USA). 27 Microsoft employees (program managers, admins, researchers, developers); 2 weeks; 2,267 h of logs; 974 sessions (mean 2 h 17 min).
  - Email alerts: after an alert, users took on average 4 min 59 s to suspend their current task. 40.8% of email alerts got an immediate response.
  - Time spent on the diversion (until returning to the app of the primary task) averaged 9 min 33 s for email and 8 min for IM.
  - After that, the "resumption phase" before getting back to the pre-suspension state averaged:
    - email: 16 min 33 s (immediate response) / 15 min 50 s (delayed);
    - IM: 10 min 58 s / 12 min 2 s.
  - The authors summarize this as "another 10 to 15 minutes ... before returning to focused activity".
  - **27% of task suspensions led to more than two hours until resumption.** Users blamed this on lost context.
  - Suspended windows that were less than 25% visible took significantly longer to resume than windows more than 75% visible, so visual cues help.
  - — [Iqbal & Horvitz 2007 (PDF)](https://www.erichorvitz.com/CHI_2007_Iqbal_Horvitz.pdf)
- **Leroy 2009** (Organizational Behavior and Human Decision Processes 109(2):168–181, USA):
  - People struggle to move attention away from an unfinished task, and "their subsequent task performance suffers". This is attention residue.
  - Secondary summaries say finishing the first task under high time pressure can reduce residue by giving cognitive closure. Some secondary sources blur this with Leroy & Glomb 2018. Exact sample and effect sizes were not verified this session.
  - — [citation, UW Bothell faculty page](https://www.uwb.edu/business/faculty/sophie-leroy); [UW Bothell news](https://www.uwb.edu/news/2024/05/17/an-ongoing-study-on-the-success-of-staying-focused); secondary: [strategy+business](https://strategy-business.com/article/re00088)
- **Leroy & Glomb 2018** (Organization Science; 4 studies):
  - Anticipating time pressure when resuming an interrupted task causes attention residue and lower performance on the *interrupting* task.
  - A **"ready-to-resume" plan**, a brief note on where you are and what to do on return, reduces residue, and performance on the interrupting task "does not suffer".
  - — [Crossref abstract / INFORMS](https://pubsonline.informs.org/doi/fpi/10.1287/orsc.2017.1184); [UW news 2018](https://www.washington.edu/news/2018/01/16/task-interrupted-a-plan-for-returning-helps-you-move-on/)

### Inferences
- **"Park your thought" at session end or any pause:** a 10–20 s prompt ("where am I / next step") applies Leroy & Glomb's ready-to-resume plan. It should reduce residue during breaks and speed resumption.
- **Keep the task visible:** Iqbal & Horvitz's visibility finding suggests the app should keep the session's task or goal visible, or restore the working context after a break.
- Even a ~3 s glance at a notification doubles place-losing errors in sequential tasks (Altmann 2014). This argues for full suppression during sessions rather than banners.

### Gaps
- I could not retrieve the full text of Leroy 2009 (sample sizes, effect sizes, exact manipulations). The report writer should describe it qualitatively.
- No exact millisecond values for Monsell 2003 were verified. Typical lab switch costs are commonly described as tens to hundreds of ms, but this was not sourced here.

## 3. Self-interruptions vs. external interruptions

### Takeaway
Self-interruptions are roughly as frequent and as costly as external ones. In field data, people take as long or longer to return to self-interrupted work. External interruptions *breed* later self-interruptions, and open offices raise self-interruption. Blocking external pings therefore also reduces internally driven switching.

### Cited Findings
- **Dabbish, Mark & González 2011** (CHI 2011; 889 h of observation, 36 informants, 3 US high-tech organizations):
  - Of 5,089 task switches, 60% followed natural event completion, 22% external interruptions and 18% self-interruptions.
  - Self-interruptions: 1.00/h; prior working-sphere duration 518 s; resumption likelihood 70%; **mean resumption lag 2,057 s (~34 min, SD 3,956)**.
  - External interruptions: 1.28/h; 466 s; 72%; **1,940 s (~32 min, SD 3,671)**.
  - Event completion: 2.26/h; 506 s; 73%; 1,556 s.
  - Open-plan cubicles were associated with **64% more self-interruption** than enclosed offices (1.13 vs 0.69/h).
  - **Each additional external interruption in the previous hour raised self-interruptions in the next hour by 8%.**
  - Self-interruption was more frequent earlier in the day.
  - The introduction notes that interruptions occur "every 4 to 11 minutes" and that almost half are self-initiated.
  - — [Dabbish et al. 2011 (PDF)](https://www.ics.uci.edu/~gmark/Home_page/Publications_files/CHI%202011%20Self-interruption.pdf)
- Mark et al. CSCW 2015: attentional state *precedes* distraction. Rote or bored states were followed by more Facebook and face-to-face interaction, while focused and aroused states were followed by more email. Self-interruption is partly a response to boredom or low challenge. — [Mark et al. 2015 PDF](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/10/p903-mark.pdf)

### Inferences
- The SDs are very large (resumption lags of ~30+ min with SD ~1 h). Treat means as indicative only.
- **Design implications:**
  - Notification blocking is necessary but not sufficient. Self-interruptions need their own countermeasures, such as an "impulse log" for noting the urge to switch, website blocking, and keeping a low challenge–skill mismatch.
  - Boredom predicts self-distraction. The app could suggest increasing challenge or switching task type at planned break points rather than mid-session.

### Gaps
- No experimental (vs. observational) study was found that directly compares resumption cost for self- vs externally-initiated interruptions in matched tasks this session.

## 4. Distraction blockers, focus modes, and notification management (incl. batching)

### Takeaway
Blocking non-work sites for a week raised self-rated focus and productivity in a Microsoft field study. Gains were biggest for the most social-media-distractible users. The study also found costs: about half of users reported *more* stress, higher temporal workload, and some skipped breaks. Batching phone notifications ~3×/day beats both "as usual" and "none". Deferring notifications to task breakpoints reduces frustration.

### Cited Findings
- **Mark, Iqbal & Czerwinski 2017** (UbiComp/ISWC '17 adjunct): in situ, N=32 (31 analyzed) information workers at a "large U.S. west coast corporation" (Microsoft Research). Baseline week, then a week with Freedom software blocking non-work sites the participants chose (Facebook, Instagram, YouTube, news...).
  - Focus: significantly more "Focused Immersion" (Cognitive Absorption scale) when sites were blocked. Self-reported susceptibility to social media distraction explained **19% of the variance** in focus gain (F(1,30)=8.15, p<.008).
  - Productivity: self-rated weekly productivity was significantly higher in the blocked week.
  - Costs:
    - Temporal workload rose significantly (mean diff .80, p<.005).
    - **16 of 31 reported more stress** while blocked; they scored higher on impulsivity (lack of premeditation, urgency).
    - Some low-self-control participants "were more focused and worked longer without taking breaks and therefore, experienced higher stress"; some replaced online distraction with physically leaving the office.
  - Authors' design recommendations: software that lets users set goals for uninterrupted time; adaptive/personalized blocking; recommending healthy physical breaks; microbreaks of "30 seconds to a few minutes".
  - — [Mark, Iqbal & Czerwinski 2017 (PDF)](https://www.interruptions.net/literature/Mark-UbiComp17.pdf); [Microsoft Research page](https://www.microsoft.com/en-us/research/?p=452322)
- **Mark et al. CHI 2018 follow-up** (same sample): people who felt less in control of their work benefited most from blocking, while those with high control faced higher workload when distractions were blocked. — [Microsoft Research publication page](https://www.microsoft.com/en-us/research/publication/effects-individual-differences-blocking-workplace-distractions/)
- **Iqbal & Bailey 2008** (CHI 2008, Univ. of Illinois):
  - The OASIS system deferred desktop notifications to automatically detected breakpoints (coarse/medium/fine) in programming and diagram editing.
  - Study 2 (16 users): "scheduling notifications at breakpoints reduces frustration and reaction time relative to delivering them immediately". Earlier work found coarser breakpoints have lower interruption cost (resumption lag, frustration, errors).
  - The most relevant notifications should go at finer breakpoints and less relevant ones at coarse breakpoints.
  - Coarse-breakpoint detection reached 71% recall in study 1.
  - — [Iqbal & Bailey 2008 (PDF)](https://www.interruptions.net/literature/Iqbal-CHI08.pdf)
- **Adamczyk & Bailey 2004** (CHI '04, "If not now, when?"): the foundational lab study showing interruption cost depends on the moment within task execution. Interruptions at breakpoints, especially coarse ones, are less costly than mid-subtask. Details are cited via Iqbal & Bailey 2008; the original's numbers were not retrieved. — [Iqbal & Bailey 2008 citing [1]](https://www.interruptions.net/literature/Iqbal-CHI08.pdf); [interruptions.net literature list](https://interruptions.net/literature.htm)
- **Fitz et al. 2019** (Computers in Human Behavior; randomized field experiment, n≈237, USA; sample size varies between summaries): notifications batched **3 times/day** improved attention, productivity, well-being, mood and sense of control vs. usual delivery. The **no-notification group fared worst on some measures** (more anxiety/FOMO, more phone unlocks). The study used self-report only. — [Springer Nature community post by authors](https://communities.springernature.com/posts/batching-notifications-can-improve-attention-well-being-and-productivity); [Georgia Tech summary](https://work21.gatech.edu/?p=402)
- **Kushlev, Proulx & Dunn 2016** (CHI 2016 "Silence Your Phones"; N=221, UBC Canada): a week with alerts on and the phone nearby produced more self-reported inattention and hyperactivity symptoms than a week with alerts off and the phone away. — [Kushlev CHI16 (PDF)](https://www.interruptions.net/literature/Kushlev-CHI16.pdf); [UVA news](https://news.virginia.edu/node/213646)

### Inferences
- **Make blocking user-configured and goal-based:** the opt-in, user-chosen site list is what Mark 2017 tested. Expect heterogeneous responses. Impulsive users may feel more stress, so pair blocking with *scheduled* breaks rather than letting people grind on.
- **Batch rather than fully cut off:** "Deliver at session end / break" matches Iqbal & Bailey's breakpoint policy and Fitz's batching. A full blackout may raise anxiety.
- Allow a whitelist for truly urgent contacts. That would be a design choice; it is not directly tested here.

### Gaps
- No peer-reviewed evaluation of OS-level "Focus modes" (iOS Focus, Windows Focus Sessions, Teams "focus time") with objective outcomes was found this session.
- The blocking study is one week, N=31, self-report outcomes. No long-term data on whether gains persist was found.

## 5. Phone presence and notifications: Ward et al. 2017 "Brain Drain" and Stothart et al. 2015

### Takeaway
The "mere presence" effect (Ward 2017) has failed a pre-registered direct replication. Meta-analyses find at most a small working-memory effect (Parry 2024) or none (Hartanto 2024). In contrast, *receiving* a notification while not touching the phone measurably hurts sustained attention (Stothart 2015). Silencing matters more than the phone's location, though keeping it away is cheap insurance.

### Cited Findings
- **Ward, Duke, Gneezy & Bos 2017** (Journal of the Association for Consumer Research 2(2):140–154, USA): the original claim was that a phone on the desk, vs in a pocket/bag or another room, reduces available cognitive capacity (OSpan, Raven's), even when off and face-down. — [Ward et al. 2017, U. Chicago Press](https://www.journals.uchicago.edu/doi/full/10.1086/691462)
- **Ruiz Pardo & Minda 2022** (Acta Psychologica; pre-registered direct replication of Ward Exp. 2, Canada): 6 conditions (location × power). "The 'brain drain' effect did not replicate: there was no difference between smartphone location conditions on performance on either the o-span task or the go/no-go task." — [PubMed 36007374](https://pubmed.ncbi.nlm.nih.gov/36007374/)
- The FORRT replication atlas lists 2 replications, both failed. — [FORRT](https://forrt.org/flora-replication-atlas/doi/10.1086/691462/)
- **Parry 2024 meta-analysis** (k=56, n=7,093; six meta-analyses): working memory capacity was negatively affected by phone presence, with other cognitive functions null. It reports heterogeneity and low power, and gives "limited support for a negative albeit smaller than theorized brain drain effect". A secondary report gives d ≈ −0.20 for working memory (not verified). — [VU Amsterdam record](https://research.vu.nl/en/publications/does-the-mere-presence-of-a-smartphone-impact-cognitive-performan/); [Substack review](https://grimoiremanor.substack.com/p/does-the-mere-presence-of-a-smartphone)
- **Hartanto et al. 2024 meta-analysis** (Technology, Mind, and Behavior; 33 studies, 166 effect sizes, N=4,368): no significant effect (d = −0.02, 95% CI [−0.06, 0.01]), not moderated by smartphone dependency or method. — [JCU repository](https://researchonline.jcu.edu.au/91280/); [PsyPost](https://www.psypost.org/smartphone-in-sight-no-impact-on-cognitive-performance-study-finds/)
- A 2023 Scientific Reports study (Germany/Austria) reported that mere presence reduced basal attentional performance, so the evidence is mixed. — [Nature Sci Rep 2023](https://www.nature.com/articles/s41598-023-36256-4)
- **Stothart, Mitchum & Yehnert 2015** (J Exp Psychol: Human Perception & Performance; N=166 students, Florida State Univ., USA):
  - Receiving a call or text notification during the SART, without touching the phone, "significantly disrupted performance".
  - The effect was "comparable in magnitude" to actively using the phone for calls or texts. The proposed mechanism is notification-triggered mind wandering.
  - — [Europe PMC abstract / APA PsycNet](https://www.ovid.com/journals/jephp/pdf/10.1037/xhp0000100~the-attentional-cost-of-receiving-a-cell-phone-notification); [APS summary](https://www.psychologicalscience.org/?p=116508)

### Inferences
- Do not market "put your phone in another room" as proven brain-capacity science. Do recommend silencing all notifications, including vibration, because notifications alone impair attention.
- A focus app that controls its own and the OS's notifications targets the better-supported mechanism.

### Gaps
- Exact Stothart effect sizes and error rates were not retrieved. Ward 2017 sample sizes were not re-verified this session; the original reports ~800 participants across 2 experiments.

## 6. Media multitasking (Ophir, Nass & Wagner 2009) and replications

### Takeaway
The headline claim was that heavy media multitaskers are worse at filtering distraction and even at task switching. It has weakened substantially: replications are mixed, and meta-analyses find small effects that may shrink to negligible after correcting for small-study bias. Habitual multitasking is not clearly "rewiring", but single-tasking is never worse.

### Cited Findings
- **Ophir, Nass & Wagner 2009** (PNAS 106(37):15583–7, Stanford, USA):
  - Heavy media multitaskers (HMMs), identified by a trait media-multitasking index, were "more susceptible to interference from irrelevant environmental stimuli and from irrelevant representations in memory" and performed worse on task switching.
  - Group sizes reported secondarily: 19 HMM vs 22 LMM.
  - — [PubMed 19706386](https://pubmed.ncbi.nlm.nih.gov/19706386); [Stanford news 2009](https://news.stanford.edu/stories/2009/08/multitask-research-study-082409?view=print)
- **Wiradhany & Nieuwenstein 2017** (Attention, Perception & Psychophysics, Netherlands): two replications using the original program (14 tests, mean power 0.81) largely failed. Their meta-analysis found weak effects that "might become negligible" after small-study correction. — [PMC5662702](https://pmc.ncbi.nlm.nih.gov/articles/PMC5662702); [Psychonomic Society](https://featuredcontent.psychonomic.org/the-good-the-bad-and-the-media-multi-tasking-its-all-the-internets-fault-or-is-it/)
- **Parry & le Roux 2021** (Cyberpsychology, meta-analysis of 118 assessments): small pooled association between media multitasking and cognitive control, moderated by measurement approach. — [Cyberpsychology](https://cyberpsychology.eu/article/view/13303)

### Inferences
- Use multitasking research cautiously in marketing. The firmer basis for single-tasking design is the experimental switch-cost and interruption literature (sections 2–5).

### Gaps
- None critical. Causal direction (does multitasking cause poorer control, or vice versa) remains unresolved in the literature.

## 7. Flow: time to enter, episode length, and whether timer-imposed breaks harm it

### Takeaway
There is **no solid empirical figure** for "time to enter flow". The ubiquitous "~15 minutes" comes from DeMarco & Lister's *Peopleware* (1987), a practitioner book, not a study. Flow-episode duration is essentially unmeasured, because experience sampling itself interrupts flow. What evidence exists:
- Removing notifications raises time in flow (small N).
- Interruption cost is lowest at coarse task breakpoints.
- In a real study-session RCT, **fixed, pre-scheduled breaks (Pomodoro-like) beat self-regulated breaks** on fatigue, concentration and motivation, with equal task completion in less time.

Self-chosen timing is not clearly superior, but forcing a break mid-subtask is the costliest moment.

### Cited Findings
- **"15 minutes to immersion"** (DeMarco & Lister, *Peopleware*, 1987): flow requires "fifteen minutes or more of concentration before the state is locked in". Reviews add the illustrative arithmetic that a 5-min call plus 15-min re-immersion costs ~20 min. **Anecdotal/practitioner, not empirical.** — [Dr. Dobb's 1990 review](https://jacobfilipp.com/DrDobbs/articles/DDJ/1990/9012/9012k/9012k.htm); [Shortform summary](https://www.shortform.com/blog/peopleware-productive-projects-and-teams/)
- **Notifications vs flow, Pandab 2015** (MSc thesis, Univ. of Oulu, Finland; **N=8**, ESM 6×/day for 3 weeks, >600 responses):
  - % of time in flow: 23.2% at baseline (notifications on), **39.9% with notifications off** (t(7)=−4.18, p=.004), 32.1% in week 3 (not significant vs either).
  - Concentration also rose. Anxiety, enjoyment and life satisfaction showed no change.
  - Users reported five handling strategies, including "self-initiated technology breaks" and "glancing".
  - Limitations: unpublished thesis, tiny sample, order confounded.
  - — [Pandab 2015 (PDF)](https://www.interruptions.net/literature/Pandab-MSc.pdf)
- Flow research methods: experience sampling "necessarily interrupts the flow experience", so flow-episode timing is hard to measure. — [Frontiers in Psychology 2023](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1187153/full)
- Csikszentmihalyi-tradition ESM data (cited in Pandab): British teens spent ~24% of time in flow conditions. — [Pandab 2015](https://www.interruptions.net/literature/Pandab-MSc.pdf)
- **Breakpoints:** delivering interruptions at task breakpoints, especially coarse ones (between major sub-goals), lowers resumption lag, frustration and errors vs mid-task delivery (Adamczyk & Bailey 2004; Iqbal & Bailey 2008). — [Iqbal & Bailey 2008 (PDF)](https://www.interruptions.net/literature/Iqbal-CHI08.pdf)
- **Biwer, de Bruin & Persky 2023** (British J. Educational Psychology; N=87 Dutch university students, real self-study for 1 day). Conditions:
  - self-regulated breaks (n=35);
  - "Pomodoro" 24-min study + 6-min break (n=25);
  - 12-min study + 3-min break (n=27).

  Results:
  - Self-regulators had **longer sessions and longer breaks**, and **more fatigue and distractedness, less concentration and motivation**.
  - There was no difference in mental effort or task completion. Systematic breaks gave "similar task completion in shorter time".
  - — [Europe PMC / PubMed 36859717](https://pubmed.ncbi.nlm.nih.gov/36859717/); [Maastricht University record](https://cris.maastrichtuniversity.nl/en/publications/understanding-effort-regulation-comparing-pomodoro-breaks-and-sel)
- A 2025 preprint (Smits, Wenzel & de Bruin; N=94, 2-h session) compares Pomodoro vs **Flowtime** (work until you naturally pause, then a proportional break) vs self-regulated breaks, including flow as an outcome. It is not peer-reviewed and its results were not verified. — [Preprints.org](https://www.preprints.org/manuscript/202503.0845/v1)
- **Albulescu et al. 2022** (PLOS ONE meta-analysis, Romania; 22 samples, N=2,335):
  - Micro-breaks (≤10 min) boost vigor (d=.36) and reduce fatigue (d=.35).
  - The effect on performance was not significant overall (d=.16, p=.116); it was significant only for less cognitively demanding tasks.
  - Longer breaks gave larger performance gains. Highly depleting tasks may need breaks longer than 10 min.
  - — [DOAJ / PLOS ONE](https://doaj.org/article/c6f37b6ba159469296b2cb968b65505f); [EurekAlert](https://www.eurekalert.org/news-releases/962663)
- Mark 2017: with distractions blocked, low-self-control users skipped breaks and became more stressed. Self-regulation of breaks fails for some people. — [Mark et al. 2017 PDF](https://www.interruptions.net/literature/Mark-UbiComp17.pdf)

### Inferences
- **Recommended break policy for ~1-hour sessions: app-proposed by default, with a short flexible window that lands on a natural breakpoint.**
  - Make breaks app-initiated by default. The best direct evidence (Biwer 2023) favors scheduled breaks over purely self-chosen ones, and Mark 2017 shows that some users skip breaks when left alone.
  - To avoid cutting flow mid-subtask (Adamczyk & Bailey; Iqbal & Bailey), offer a soft prompt: "Break due — finish your current thought?" Allow a short extension (e.g., up to ~5–10 min) or one-tap snooze instead of a hard stop. Optionally detect breakpoints such as file save, commit, or app switch.
  - This is a synthesis. No study directly tested "soft-deadline breaks" vs hard timers on flow.
- **Break length:** the micro-break meta-analysis suggests 5–10+ min breaks for cognitively demanding work. Pair break end with a "ready-to-resume" note (section 2) to cut re-entry cost.
- **Ramp-up:** since entering deep focus plausibly takes some minutes (Peopleware heuristic; resumption-lag data), 50–60 min blocks waste proportionally less on ramp-up than 25-min blocks. However, Biwer found 12-min and 24-min blocks performed equally well for students. Session length should be user-adjustable.
- **During sessions:** suppress notifications entirely and batch them to the break. The flow-time gain from notifications off in Pandab is suggestive. Stothart and Altmann show that even brief alerts or glances disrupt.

### Gaps
- **No peer-reviewed empirical measurement was found of (a) the time needed to enter flow, or (b) typical flow-episode duration in knowledge work.** Any number given in the app for these should be labeled a heuristic.
- No study directly compared forced timer breaks vs flow-contingent breaks on measured flow in knowledge workers. The Smits et al. 2025 preprint may address this but is unverified.
- No Csikszentmihalyi primary source on episode duration was retrieved this session.
