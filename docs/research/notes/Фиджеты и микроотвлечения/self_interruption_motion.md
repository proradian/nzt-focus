# Attentional cost of brief self-interruptions and peripheral visual motion during focused work

Context: a focus timer shows animated, interactive "smoke" around the timer. Users sometimes stop working for a few seconds to click or drag it. Two questions follow: (a) what does a short self-interruption cost, and (b) what does continuous animation near the work area cost?

Method note: the primary PDFs for Katidioti et al. 2016, Altmann et al. 2014, Adler & Benbunan-Fich 2013, Dabbish et al. 2011, Burke et al. (ToCHI preprint), Mark et al. 2008, Bartram et al. 2003 and Maglio & Campbell 2000 were downloaded and text-extracted, so their numbers below come from the papers themselves. Other items come from abstracts, publisher pages or press coverage; each one is flagged.

---

## 1. Are self-interruptions costlier than external interruptions?

### Takeaway
In controlled lab tasks, choosing to interrupt yourself costs more time than being interrupted externally at the same moment. The extra cost is about a 1 s decision or preparation phase before the switch, not a slower return to the task. In field data, self-interruptions are almost as frequent as external ones, and self-interrupted work is resumed no faster. People who self-interrupt more perform worse, and negative feelings such as frustration and exhaustion drive more self-interruptions.

### Cited Findings
**Katidioti, Borst, van Vugt & Taatgen (2016), *Computers in Human Behavior* 63:906–915; University of Groningen, Netherlands**
- Two experiments: a behavioral one (N = 28, 14 female, mean age 22.8) and a pupillometry one (N = 21, 15 female). The main task was answering emails about product prices, which required holding the price or product in working memory. The interrupting task was a casual chat. External interruptions were timed to the same low-workload moments where people chose to self-interrupt — [Katidioti et al. 2016 PDF](https://www.interruptions.net/literature/Katidioti-ComputHumBehav16.pdf)
- Exp. 1, mean time per email: Control 20.79 s, Forced/external 23.36 s, Voluntary/self 24.83 s. F(2,54) = 27.03, p < .001, ηp² = 0.50. Self-interruption therefore added about 1.5 s per email over external, and about 4 s over no interruption — [Katidioti et al. 2016](https://www.interruptions.net/literature/Katidioti-ComputHumBehav16.pdf)
- Exp. 2 (N = 21): Control 20.59 s, external 21.78 s, self 22.71 s. F(2,40) = 8.48, p < .001, ηp² = 0.30. All conditions differed (ps < .05), except Control vs. Forced, which was marginal (p = .07) — [Katidioti et al. 2016](https://www.interruptions.net/literature/Katidioti-ComputHumBehav16.pdf)
- Resumption lag did not differ. Exp. 1: 1.65 s (self) vs. 1.64 s (external), t(27) < 1. Exp. 2: 1.49 s vs. 1.53 s, t(20) = −1.45, p = .16, d = 0.08. The extra cost of self-interruption is not in getting back to the task — [Katidioti et al. 2016](https://www.interruptions.net/literature/Katidioti-ComputHumBehav16.pdf)
- Pupil dilation time-locked to the switch shows a phase shift before self-interruptions. The authors read this as a decision to self-interrupt that takes about 1 s and adds time that external interruptions do not. Their suggested application is to replace "endless checking" with system-timed interruptions at low-workload moments — [Katidioti et al. 2016](https://www.interruptions.net/literature/Katidioti-ComputHumBehav16.pdf); press summary: [BPS Research Digest](https://www.bps.org.uk/research-digest/interrupting-yourself-can-be-more-disruptive-being-interrupted-someone-else)
- Earlier work (Katidioti, Borst & Taatgen 2014) found that people are "rational" self-interrupters: they choose low-workload moments, between subtasks. When external interruptions were matched to those moments, participants were faster with the external ones. The 2016 paper says the 2014 comparison was not designed for this question and should be "interpreted with care" — [Katidioti et al. 2014 PDF](https://www.ai.rug.nl/~ikatidioti/resources/Katidioti_et_al_2014.pdf); described in [Katidioti et al. 2016](https://www.interruptions.net/literature/Katidioti-ComputHumBehav16.pdf)
- Katidioti et al. 2016 cite field data: office workers switch tasks about every 3 min (Gonzalez & Mark 2004), students interrupt about every 6 min, mostly for social media (Rosen et al. 2013), and roughly half of all interruptions are self-initiated — [Katidioti et al. 2016](https://www.interruptions.net/literature/Katidioti-ComputHumBehav16.pdf)

**Dabbish, Mark & González (2011), CHI '11, pp. 3127–3130; UC Irvine / Carnegie Mellon, USA (field observation)**
- The study re-analyzed 889 hours of shadowing data on 36 information workers in three high-tech organizations. Of 5,089 task switches, 60% followed natural event completion, 22% followed external interruptions and 18% (889) were self-interruptions — [Dabbish et al. 2011 PDF](https://www.ics.uci.edu/~gmark/Home_page/Publications_files/CHI%202011%20Self-interruption.pdf)
- Table 1, means with SD:

  | Switch type | Rate per hour | Prior working-sphere duration | Resumption probability | Time to resume |
  |---|---|---|---|---|
  | Self-interruption | 1.00 (1.30) | 518 s | 70% | 2,057 s (about 34 min) |
  | External interruption | 1.28 (1.37) | 466 s | 72% | 1,940 s |
  | Event completion | 2.26 (2.04) | 506 s | 73% | 1,556 s |

  Self-interrupted work was therefore not resumed faster than externally interrupted work. In the field, "resumption" means minutes of returning to a work sphere, not a lab resumption lag in seconds — [Dabbish et al. 2011](https://www.ics.uci.edu/~gmark/Home_page/Publications_files/CHI%202011%20Self-interruption.pdf)
- Open-plan or cubicle seating went with a 64% higher self-interruption rate (mean 1.13/h vs. 0.69/h in enclosed offices). Organization explained 13% of variance and individual differences ("habit") a further 14%. Each external interruption in the previous hour raised next-hour self-interruptions by 8%. Self-interruptions were more frequent earlier in the day — [Dabbish et al. 2011](https://www.ics.uci.edu/~gmark/Home_page/Publications_files/CHI%202011%20Self-interruption.pdf); abstract at [UCI ISR](https://isr.uci.edu/node/1353.html)

**Adler & Benbunan-Fich (2013), *Computers in Human Behavior* 29:1441–1449; Northeastern Illinois University / Baruch College CUNY, USA**
- N = 212 undergraduates did six pre-assigned tasks, such as Sudoku and text tasks, in a custom multitasking environment with free switching. The authors propose a typology from Flow Theory and Self-regulation Theory: negative triggers (frustration, obstruction, exhaustion) vs. positive triggers (exploration, stimulation, reorganization) — [Adler & Benbunan-Fich 2013 PDF](https://interruptions.net/literature/Adler-ComputHumBehav13.pdf)
- Of 166 classifiable participants, 54 switched for negative reasons, 45 for positive reasons and 67 reported no switching. Mean self-interruptions: negative 5.26, positive 3.76, "no-switch" 1.46. Model F = 5.01, p < .001, R² = 18% — [Adler & Benbunan-Fich 2013](https://interruptions.net/literature/Adler-ComputHumBehav13.pdf)
- Among the 99 multitaskers, more self-interruptions went with lower overall performance (ρ = −0.24, p < .05). The negative-trigger group scored lower than the no-multitasking group (37.16 vs. 41.94; t = −1.99, p < .05). The authors describe a "downward spiral" — [Adler & Benbunan-Fich 2013](https://interruptions.net/literature/Adler-ComputHumBehav13.pdf)

**Jin & Dabbish (2009), CHI '09; Carnegie Mellon, USA (qualitative)**
- A grounded-theory observation study produced seven categories of self-interruption on the computer: adjustment, breaks due to frustration or fatigue, inquiry, recollection of unrelated tasks, routine or habit, trigger or stimulus, and waiting (filling time). The category names come from a secondary citation (Kim et al. 2017), not the original full text — [Kim et al. 2017 citing Jin & Dabbish](https://ic.kaist.ac.kr/files/papers/kim2017technology.pdf); ACM record [10.1145/1518701.1518979](https://mijn.bsl.nl/doi/10.1145/1518701.1518979)

### Inferences
- Clicking or dragging the smoke is a textbook self-interruption, specifically a "trigger/stimulus" or "waiting/filling-time" type in Jin & Dabbish's terms. The best lab evidence (Katidioti 2016, ηp² 0.3–0.5) says the cost is not mainly in returning. It is in the decision and preparation phase (about 1 s), plus the interruption itself, plus some reorientation. Over a 25-min session, a few such episodes cost only seconds of raw time. The bigger risks are errors and fragmentation (see §2) and reinforcing a habit loop (Dabbish: habit and individual differences explain a meaningful share of variance).
- An always-available interactive toy is a standing "trigger." Dabbish shows that self-interruption rates rise with environmental stimulation, as in open offices. A clickable animation inside the focus view plausibly works the same way.
- Katidioti's practical recommendation fits a timer app: move the "permission to play" to system-chosen moments, such as break phases, instead of leaving a constant self-interruption option during focus.

### Gaps
- None of these studies used a playful, purely motor micro-interaction of 2–5 s (drag or click with no information content) as the interrupting task. Chat, email and phone tasks are cognitively heavier. Purely motor fidget interactions may cost less than these numbers suggest, and I found no direct test.
- Katidioti samples are small (21–28 Dutch students). No replication with a non-student or field sample was found.
- I did not obtain the Jin & Dabbish 2009 full text, so category frequencies are not verified. A secondary source says "routines" were the most frequent type.

---

## 2. Attention residue and resumption costs after brief interruptions

### Takeaway
Even interruptions of about 3 s, shorter than one step of the main task, double sequence or placekeeping errors in procedural tasks. Leaving a task unfinished leaves "attention residue" that lowers performance on the next task. Resumption costs grow with interruption length and demand, but the paradigms differ.

### Cited Findings
**Altmann, Trafton & Hambrick (2014), *J. Exp. Psychol.: General* 143(1):215–226; Michigan State University and US Naval Research Laboratory, USA**
- N = 300 MSU undergraduates: 2 groups × 100 in Exp. 1 and 100 in Exp. 2. Nine more were replaced for low accuracy. Task: the "UNRAVEL" procedure, a 7-step sequence in which participants must keep their place. The interruption was typing 2 code letters — [Altmann et al. 2014 PDF](https://www.interruptions.net/literature/Altmann-JExpPsycholGen14.pdf)
- Interruptions averaging 4.4 s (Exp. 1) roughly tripled the sequence error rate on the first post-interruption trial: 5.8% vs. 1.8% at baseline. Interruptions averaging 2.8 s (Exp. 2), about the duration of one task step, roughly doubled it: 4.3% vs. 2.0% — [Altmann et al. 2014](https://www.interruptions.net/literature/Altmann-JExpPsycholGen14.pdf); abstract at [AHRQ PSNet](https://psnet.ahrq.gov/issue/momentary-interruptions-can-derail-train-thought)
- Non-sequence errors were not affected, so global attention was not disrupted. Only "placekeeping" (where am I in the sequence) suffered. The authors' explanation is that the interruption moves the focus of attention and breaks the activation flow that guides step order — [Altmann et al. 2014](https://www.interruptions.net/literature/Altmann-JExpPsycholGen14.pdf)
- Citation note: online publication and press coverage date to January 2013, while the print issue is 2014. Press coverage ("A mere 3 seconds…") is accurate on the ×2 and ×3 figures. It sometimes leaves out that these are relative increases on a low baseline (about 2% to about 4–6%), and that the effect is limited to sequence or placekeeping errors — [MSU Today / Lab Manager](https://www.labmanager.com/brief-interruptions-spawn-errors-15593); [Fiscal Times](https://www.thefiscaltimes.com/2013/01/18/Mere-3-Seconds-Can-Make-You-Screw-Work)

**Monk, Trafton & Boehm-Davis (2008), *J. Exp. Psychol.: Applied* 14(4):299–313, USA**
- Across three experiments, longer and more demanding interruptions produced longer resumption lags. This supports the memory-for-goals model: goals decay over the interruption, and rehearsal offsets the decay — [Monk et al. 2008 PDF](https://www.interruptions.net/literature/Monk-JEPA08.pdf) (abstract via [Ovid](https://www.ovid.com/journals/jepap/pdf/10.1037/a0014402~the-effect-of-interruption-duration-and-demand-on-resuming))
- Katidioti et al. 2016 summarize Monk et al. as finding that disruption stopped growing once interruptions passed about 23 s in that setup. I did not verify this against the original — [Katidioti et al. 2016](https://www.interruptions.net/literature/Katidioti-ComputHumBehav16.pdf)

**Leroy (2009), *Organizational Behavior and Human Decision Processes* 109(2):168–181; USA**
- In lab task switches (e.g., word puzzles, then evaluating résumés), people who left the first task unfinished kept thinking about it ("attention residue") and performed worse on the next task. Finishing the first task under time pressure produced cognitive closure and less residue — summaries via [BPS Research Digest](https://bps.org.uk/research-digest/surprising-benefits-time-pressure-work) and [UW Bothell](https://www.uwb.edu/news/2024/05/17/an-ongoing-study-on-the-success-of-staying-focused). Sample sizes and effect sizes were not verified (see Gaps)

**Leroy & Glomb (2018), *Organization Science* 29(3):380–397, USA**
- Four studies show that expecting to resume an interrupted task under time pressure creates attention residue and lowers performance on the interrupting task. A "Ready-to-Resume" plan (a brief note on where you are and what comes next, written before switching) reduced residue and protected performance — [INFORMS abstract](https://pubsonline.informs.org/doi/fpi/10.1287/orsc.2017.1184); [Futurity](https://www.futurity.org/ready-to-resume-plan-1656322/)
- Press coverage reports a field survey of 202 working professionals and lab studies with 66 and 44 students. A blog figure of "79% higher chance of an optimal decision" could not be verified and should not be used — [search summary of Futurity, GovExec and Lawyerist coverage](https://www.govexec.com/management/2018/01/better-focus-new-task-try-plan/145334/)

**Mark, Gudith & Klocke (2008), CHI '08, pp. 107–110; UC Irvine, USA; sample mostly in Germany**
- N = 48: 81% German university students, mean age 26, 15 male and 33 female. Email task in a simulated office with interruptions every 2 min by a "supervisor" — [Mark et al. 2008 PDF](https://www.interruptions.net/literature/Mark-CHI08.pdf)
- Interrupted participants finished faster with no quality loss: 22.77 min baseline vs. 20.31 (same context) and 20.60 (different context); F(2,77.98) = 3.36, p < .05. They wrote shorter emails and reported more stress (F(2,92) = 12.15, p < .001), frustration (F = 5.21, p < .007), time pressure (F = 4.71, p < .01) and workload (F = 3.82, p < .03). Conclusion: people compensate for interruptions by speeding up, at a stress cost — [Mark et al. 2008](https://www.interruptions.net/literature/Mark-CHI08.pdf)

**Misquoted statistic: "it takes 23 minutes to refocus"**
- The "23 min 15 s" figure comes from Gloria Mark's field shadowing data. It is the average time before an interrupted work sphere was resumed the same day (81.9% were resumed that day), as she described in a 2006 Gallup interview. It includes time spent on other tasks, so it is not the time to regain concentration. Popular phrasings like "23 minutes to regain focus" (Forbes, Family Circle) overstate it. A clear primary printed source for the exact figure is hard to find — [Gallup 2006 interview](https://news.gallup.com/businessjournal/23146/too-many-interruptions-work.aspx); [Silicon Canals analysis](https://siliconcanals.com/t-work-interruptions-23-minutes-275-pings-organisational-focus/). Dabbish et al. 2011, Table 1, gives similar field "time to resume" values of about 26–34 min from the same research program — [Dabbish et al. 2011](https://www.ics.uci.edu/~gmark/Home_page/Publications_files/CHI%202011%20Self-interruption.pdf)

### Inferences
- For a focus app, Altmann is the most relevant warning: a 3–5 s smoke-drag in the middle of a multi-step task (code, a proof, a list of edits) is in the range that doubles or triples placekeeping errors. For holistic work without a strict sequence (reading, free writing) the evidence is weaker.
- Leroy and Glomb imply that a 3-s fidget with no "unfinished business" may leave little residue. The risk is the reverse: it can be a doorway to longer self-interruptions such as phone or social media. Dabbish et al. 2011 show that switches are clustered and habit-driven.
- Mark 2008 suggests users may not "feel" the cost in output. They speed up and experience it as stress or time pressure instead.

### Gaps
- Sample sizes and effect sizes for Leroy 2009 Studies 1–2 were not obtained (the full text is behind a paywall).
- Leroy & Glomb 2018 sample sizes come from press coverage only.
- No study was found that directly measures residue after a sub-5-s, content-free motor interaction such as a fidget or toy.

---

## 3. Very short interruptions and checks: how many seconds, and does task difficulty matter?

### Takeaway
Time costs per brief switch are on the order of about 1–2 s: a decision of about 1 s plus a resumption lag of about 1.5 s in Katidioti's email task. Error costs in sequential tasks appear at about 3 s. Even a notification that is not acted on lowers sustained attention. Costs are larger at high-workload or mid-subtask moments and in more effortful tasks.

### Cited Findings
- Resumption lag after a chat interruption was about 1.5–1.65 s, and the decision before a self-interruption about 1 s (Netherlands, N = 28 and 21) — [Katidioti et al. 2016](https://www.interruptions.net/literature/Katidioti-ComputHumBehav16.pdf)
- 2.8-s interruptions doubled sequence errors and 4.4-s interruptions tripled them (USA, N = 300) — [Altmann et al. 2014](https://www.interruptions.net/literature/Altmann-JExpPsycholGen14.pdf)
- **Stothart, Mitchum & Yehnert (2015), *JEP: Human Perception & Performance* 41(4):893–897; USA.** N = 166 students did the Sustained Attention to Response Task (SART). Call or text notifications to their own phones, which they did not answer, significantly disrupted performance. The authors say this was comparable in size to the effect of actively using a phone, and they suggest that brief alerts trigger task-irrelevant thought (mind wandering) — [APA / Ovid record](https://www.ovid.com/journals/jephp/pdf/10.1037/xhp0000100~the-attentional-cost-of-receiving-a-cell-phone-notification); [APS summary](https://psychologicalscience.org/?p=116508). Exact effect sizes were not obtained
- Task difficulty and moment: interrupting at high-workload moments (working memory loaded) is more disruptive than at low-workload moments (Iqbal & Bailey 2005/2006; Katidioti & Taatgen 2014, as reviewed in Katidioti et al. 2016). People who self-interrupt tend to pick low-workload moments, and very few switches happened at high-workload or "delay" moments — [Katidioti et al. 2016](https://www.interruptions.net/literature/Katidioti-ComputHumBehav16.pdf)
- Longer and more demanding interruptions mean longer resumption lags — [Monk et al. 2008](https://www.interruptions.net/literature/Monk-JEPA08.pdf)
- In Bartram et al. 2003, peripheral motion cues were rated more distracting during a text task than during games, and detection was slower and less accurate in the most effortful game (Solitaire). The authors suggest that motion cues could be used to gauge task engagement — [Bartram et al. 2003 PDF](https://www.interruptions.net/literature/Bartram-IJHCS03.pdf)

### Inferences
- An honest estimate: one 3–5 s smoke interaction costs about 3–5 s of direct time, plus about 1 s of decision, plus about 1.5 s of resumption. That is roughly 6–8 s per episode, plus a higher error risk if it happens mid-sequence. Ten episodes per 25-min pomodoro would be about 1–1.5 min (about 4–6%) of raw time. The larger costs are probably errors, fragmentation and habit, not raw seconds.
- People self-interrupt mostly at low-load moments. So many smoke clicks may happen at natural breakpoints and cost less than an average interruption. Clicks that occur because the animation "pulled" attention (a stimulus-triggered interruption) are not timed by the user and may land at high-load moments.

### Gaps
- No peer-reviewed study was found on brief, purely motor "toy" interactions in a work UI (fidget-spinner-like digital widgets) with performance measured.
- Effect sizes for Stothart et al. 2015 were not extracted. Note also that "mere presence" phone effects (e.g., Ward et al. 2017 "brain drain") have had replication problems. That literature was not searched in depth here.

---

## 4. Motion and attention capture: onset vs. continuous motion, animated UI elements, ambient and peripheral displays

### Takeaway
Basic vision research shows that motion onset (and looming) captures attention, while ongoing motion by itself does not. HCI studies show that peripheral motion is detected very reliably, even at 40–50° eccentricity. How distracting it is depends heavily on the motion type: slow, small, "anchored" motion is least distracting, and traveling motion or continuous scrolling is most distracting. Animated or flashing UI elements measurably slow concentrated visual search and raise perceived workload, but the effects are modest and depend on the task.

### Cited Findings
**Basic attention research**
- **Abrams & Christ (2003), *Psychological Science* 14(5):427–432; Washington University in St. Louis, USA.** In visual search for target letters, moving items were not prioritized, but items that had just started moving were. Search became independent of set size when the target had just begun moving, and inhibition of return appeared later. Conclusion: motion onset captures attention, motion per se does not — [PubMed](https://pubmed.ncbi.nlm.nih.gov/12930472/); [WUSTL profile](https://profiles.wustl.edu/en/publications/motion-onset-captures-attention/)
- **Guo, Abrams, Moscovitch & Pratt (2010), *Attention, Perception & Psychophysics* 72(5).** Isoluminant motion onset (no luminance transient) still captures attention. The authors link this to a possible bias toward animacy cues — [U of Toronto PDF](https://neuropsychologylab.psych.utoronto.ca/files/Isoluminant%20motion%20onset%20captures%20attention.pdf); [Springer](https://link.springer.com/article/10.3758/APP.72.5.1311)
- **Franconeri & Simons (2003), *Perception & Psychophysics* 65:999–1010, USA.** Translating and looming objects capture attention, but receding objects did not. Their "behavioral urgency" hypothesis says capture happens when the motion may signal relevance or threat. Later work (Abrams & Christ; Skarratt et al.) disputes the receding result — [Franconeri & Simons PDF](https://visualcognition.psych.northwestern.edu/publications/FranconeriSimons_Motion.pdf); [Skarratt et al.](https://hull-repository.worktribe.com/output/460957/prioritization-of-looming-and-receding-objects-equal-slopes-different-intercepts)

**HCI: peripheral motion cues (moticons)**
- **Bartram, Ware & Calvert (2003), *IJHCS* 58(5):515–545; Simon Fraser University / UNH, Canada and USA.** Participants were 12 SFU students in Exp. 1, and Exp. 3 had about 13 subjects (df F(1,12)). Motion cues were detected at nearly 100% in both near (7–20°) and far (40–52°) periphery. Colour cue error was 5.5% near and 24% far. Detection time for some cues roughly doubled in the far field (0.92 s to 1.78 s), still better than static cues — [Bartram et al. 2003 PDF](https://www.interruptions.net/literature/Bartram-IJHCS03.pdf); [UNH record](https://scholars.unh.edu/ccom/979)
- Exp. 3, distraction: motion type was the dominant factor (F(7,84) = 86.89, p < .0001), ahead of task (F(2,24) = 14.62) and frequency (F(1,12) = 40.18). Ranked from least to most distracting: blink, linear (small anchored oscillation), zoom, then traveling. The two traveling cues were "by far the most distracting," and fast zoom came next. Slow blink and slow linear were least distracting. Cues were rated more distracting during the text task than during games. Authors' recommendation: slow, small linear motion is "a good compromise"; animated banners and popping images are "not comfortable" while one is trying to work — [Bartram et al. 2003](https://www.interruptions.net/literature/Bartram-IJHCS03.pdf)
- The authors' framework: "anchored" motions (small trajectories around an origin) vs. "traveling" motions (the object leaves its position and moves through several degrees). Scrolling tickers are the traveling type — [Bartram et al. 2003](https://www.interruptions.net/literature/Bartram-IJHCS03.pdf)

**HCI: peripheral tickers and animated secondary displays**
- **Maglio & Campbell (2000), CHI '00, pp. 241–248; IBM Almaden, USA.** Exp. 1: N = 29 IBM participants doing primary text editing plus peripheral headline tickers. Continuous horizontal scrolling hurt editing more than discrete vertical scrolling (t(13) = 2.46, p = .014). Memory for headlines did not differ by display (F(2,23) = 0.58). Conclusion: continuous scrolling distracts more than start-and-stop displays, with equal memorability. Caveat: participants were also asked to read the ticker, so this is a dual task, not ignoring the motion — [Maglio & Campbell PDF](https://www.interruptions.net/literature/Maglio-CHI00-p241-maglio.pdf); [IBM Research](https://research.ibm.com/publications/tradeoffs-in-displaying-peripheral-information)
- McCrickard and colleagues (fade, scroll and "blast-in" tickers during browsing) found that none of the cues impeded the primary browsing task, though they differed in noticeability. Shows the effect depends on the task — summarized in [Bartram et al. 2003](https://www.interruptions.net/literature/Bartram-IJHCS03.pdf); see also [Dutta/McCrickard "Evaluating benefits and distractions of animated secondary displays"](https://www.interruptions.net/literature/Dutta-CISST02.doc)

**HCI: animated ads**
- **Burke, Hornof, Nilsen & Gorman (2005), *ACM ToCHI* 12(4); University of Oregon / Lewis & Clark College, USA.** Exp. 1 (N = 12): word search with two banners on screen (blank, flashing text at 150 ms, animated commercial, static commercial). Overall search time did not differ significantly, but NASA-TLX workload was higher under flashing text (p < .05). When a target sat between two flashing banners, finding it took 75% (4.3 s) longer (F(1,298) = 7.0, p < .01) — [Burke et al. preprint](https://thoughtcrumbs.com/publications/ToCHI04.pdf)
- Exp. 2 (N = 24): headline search. For exact-match search, gray placeholder 2,040 ms, static ad 2,169 ms, animated ad 2,193 ms; F(2,46) = 5.5, p < .007. Both ad types were slower than gray (p < .005), about a 6–7.5% slowdown, and animated did not differ from static (p = .65). For harder semantic search there was no effect (F(2,36) = 0.18, p = .83) — [Burke et al.](https://thoughtcrumbs.com/publications/ToCHI04.pdf)
- Eye tracking: participants fixated banners on only 11.7% of trials, regardless of type. Banner recognition hit rate was about 20%, and animated banners were recognized worse than static ones (d′ ≈ −0.07, chance, vs. 0.667) — [Burke et al.](https://thoughtcrumbs.com/publications/ToCHI04.pdf); CHI 2004 short version: [RWTH mirror](https://hci.rwth-aachen.de/materials/conferences/CHI2004/2p1139.pdf)
- Common overstatement: "animated ads hurt performance more than static ones." In Burke et al., both commercial ad types slowed simple search, and animation added nothing significant beyond static. Flashing mainly raised perceived workload and local search cost — [Burke et al.](https://thoughtcrumbs.com/publications/ToCHI04.pdf)
- **Hong, Thong & Tam (2004), *Information Systems Research* 15(1):60–86; HKUST, Hong Kong.** Flash animation on the target speeds finding it in dense displays. Flash on a non-target item lowers recall of other items and has negative effects on users' focused attention and attitudes. Attracting attention did not raise recall of the flashed item. A 2007 *JASIST* follow-up (online shopping, non-banner animation) found that animation hurt task performance and perceptions, and that experience reduced the distraction — [INFORMS](https://pubsonline.informs.org/doi/fpi/10.1287/isre.1040.0017); [RePEc ISR](https://ideas.repec.org/a/inm/orisre/v15y2004i1p60-86.html); [RePEc JASIST 2007](https://ideas.repec.org/a/bla/jamist/v58y2007i10p1467-1482.html). Sample sizes not extracted

**Ambient / calm technology**
- **Weiser & Brown, "Designing Calm Technology" (dated Dec 1995; often cited as 1996).** Technology should move between the periphery and the center of attention, informing without demanding focus. Example: Jeremijenko's "Dangling String," which twitches slightly when network traffic is low and whirls when it is high — [calmtech.com copy](https://calmtech.com/papers/designing-calm-technology); [Wikipedia: Calm technology](https://en.wikipedia.org/wiki/Calm_technology)
- **Matthews, Dey, Mankoff, Carter & Rattenbury (2004), UIST '04, pp. 247–256; UC Berkeley, USA.** The Peripheral Display Toolkit organizes design around abstraction of data, notification levels (from ignorable to interruptive) and transitions between levels, with the aim of matching how "loud" a display is to how important its information is — [Berkeley PDF](https://www2.eecs.berkeley.edu/bears/2004/STARS/matthews-peripheral.pdf); [BibSonomy](https://bibsonomy.org/bibtex/7bd946980238be326420c53d252f2a9c)

### Inferences
- The smoke animation is decorative: it carries no information. In calm-technology and peripheral-display terms, it should sit at the lowest notification level. Any motion feature that captures attention is a pure cost.
- Design implications from the evidence, as inference: (1) avoid sudden onsets such as puffs, bursts, new particles appearing or speed changes, because these capture attention (Abrams & Christ; Guo et al.). (2) Keep motion slow and anchored around the timer, not drifting or traveling across the screen (Bartram: traveling is most distracting, slow linear least). (3) Avoid looming or expanding motion toward the viewer (Franconeri & Simons; Bartram's zoom ranked as distracting). (4) Avoid continuous traveling or scrolling flows if the timer sits next to the work (Maglio & Campbell). (5) Consider a "still while focusing" mode or reduced motion, and keep interactivity for break phases.
- Continuous, smooth, low-contrast motion may be partly habituated, much like "banner blindness" (11.7% fixation in Burke et al.). But Burke et al. still found a 6–7.5% search slowdown and higher workload with flashing. Peripheral awareness without fixation still costs something.

### Gaps
- No study was found that specifically tests smoke- or particle-like ambient animation (organic, continuous, low-contrast) next to a focus task with objective performance measures.
- Most HCI motion studies are small (N = 12–29), use North American students or IBM staff, and are pre-2010 desktop studies. Modern high-refresh displays and dark-mode particle effects are untested.
- Hong et al. 2004 sample sizes and effect sizes were not extracted.

---

## 5. Mind-wandering, boredom escape and fidgeting: is the urge to click a fatigue or break signal?

### Takeaway
Fidgeting and the urge to switch are reliably linked to mind-wandering, inattention and negative task states (frustration, exhaustion, boredom). That makes them plausible markers that executive control on the task is disengaging, and so a reasonable cue to take a break. But quick novelty-seeking switches do not relieve boredom; they can increase it. And self-interruptions driven by negative triggers predict worse performance.

### Cited Findings
- **Carriere, Seli & Smilek (2013), *Canadian Journal of Experimental Psychology* 67(1):19–31; University of Waterloo, Canada.** Across four studies, everyday tendencies toward spontaneous (not deliberate) mind-wandering and inattention predicted self-reported fidgeting — [Duke Scholars record](https://scholars.duke.edu/publication/1330888); described in [Farley, Risko & Kingstone 2013, Frontiers](https://www.frontiersin.org/articles/10.3389/fpsyg.2013.00619/pdf)
- **Seli, Carriere, Thomson, Cheyne, Ehgoetz Martens & Smilek (2014), *JEP: Learning, Memory, and Cognition* 40(3):660–668, Canada.** During a metronome response task on a Wii Balance Board, mind-wandering episodes (caught by thought probes) went with more fidgeting and more response variability. In Study 2, only deep mind-wandering went with more fidgeting. The authors read this as executive control disengaging, which also loosens control over extraneous movement — [Duke Scholars record](https://scholars.duke.edu/publication/1330885); [Colby CogBlog summary](https://web.colby.edu/cogblog/?p=1783)
- **Adler & Benbunan-Fich (2013), USA, N = 212.** Negative triggers (frustration, obstruction, exhaustion) produced more self-interruptions (5.26 vs. 3.76 for positive triggers) and lower performance. When negative feelings arise, the most frequent reaction is to stop and take a break, which can replenish resources — [Adler & Benbunan-Fich 2013](https://interruptions.net/literature/Adler-ComputHumBehav13.pdf)
- **Jin & Dabbish (2009).** "Breaks due to frustration or fatigue" and "waiting / filling time" are distinct self-interruption types, separate from habit or routine and from stimulus-triggered interruptions. Only the first type is a genuine fatigue signal — [Kim et al. 2017 citing Jin & Dabbish](https://ic.kaist.ac.kr/files/papers/kim2017technology.pdf)
- **Mark, Iqbal, Czerwinski & Johns (2014), CHI '14, pp. 3025–3034; Microsoft Research / UC Irvine, USA.** N = 32 information workers were logged and probed in situ for 5 days. Focus peaked mid-afternoon and boredom in early afternoon. People were happiest doing rote work and most stressed doing focused work. Online activity differed by attentional state — [UCI ISR](https://isr.uci.edu/node/2035.html); [PDF](https://Www.Gwern.net/doc/psychology/writing/2014-mark.pdf)
- **Tam & Inzlicht (2024), "Fast-forward to boredom" (*JEP: General*), Canada.** Switching between and within digital videos increased boredom rather than relieving it — [Inzlicht lab page](https://michaelinzlicht.com/publications/articles-chapters/2024/6/18/fast-forward-to-boredom-how-switching-behaviour-on-digital-media-makes-people-more-bored-pdf). Sample sizes not extracted
- **Stothart et al. (2015).** Brief external cues can trigger task-irrelevant thought (mind-wandering), which hurts sustained attention — [APS summary](https://psychologicalscience.org/?p=116508)

### Inferences
- An urge to play with the smoke can mean several things. It may be (a) a fatigue or frustration break, where taking a real break helps (Adler; Jin & Dabbish "breaks due to fatigue"). It may be (b) boredom or filling time, where micro-novelty may increase boredom (Tam & Inzlicht). It may be (c) stimulus-triggered capture by the animation itself (Abrams & Christ; Bartram), which is a design cost, not a user state. Or it may be (d) habit (Dabbish).
- The literature does not support treating every click as proof of fatigue. Repeated or clustered interactions, though, fit the profile of mind-wandering or negative-state self-interruption (Seli 2014; Adler 2013). A reasonable app behavior: after N interactions in a focus block, gently offer a short real break instead of continuing the micro-play. Also log whether interactions cluster late in the session (fatigue) or occur uniformly (habit or animation capture).
- Fidgeting research suggests motor restlessness goes with mind-wandering. It does not show that fidgeting causes better focus. Claims that "fidget toys improve concentration" in healthy adults should be checked separately.

### Gaps
- No study was found that validates a self-interruption or fidget count as a real-time fatigue or break-need detector in knowledge work.
- Whether a few seconds of playful motor interaction restores attention (a micro-break effect) or just fragments it was not resolved in the sources gathered here. The micro-break literature (e.g., meta-analyses on breaks of 10 minutes or less) was outside this search.
- The full-text effect sizes for Carriere 2013 and Seli 2014 were not extracted.
