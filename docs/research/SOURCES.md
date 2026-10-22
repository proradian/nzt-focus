# Исследования, на которых построен Focus

Здесь собраны работы, которые прямо повлияли на устройство таймера: что именно взято и откуда. Подробный разбор, уровни доказательности и спорные места — в отчётах: [Фокус и перерывы в работе](reports/Фокус%20и%20перерывы%20в%20работе.md) и [Музыка и звук при работе](reports/Музыка%20и%20звук%20при%20работе.md).

Честная оговорка: оптимальную длину рабочего блока прямо никто не проверял. 60 минут — это согласованная норма охраны труда, а не результат эксперимента. Сильнее всего доказано другое: перерывы нужны, отдых лучше телефона, а слова в музыке мешают думать.

## Блок работы и перерывы

**Блок 60 минут, перерыв 10–15 минут**
- Министерство здравоохранения, труда и благосостояния Японии (MHLW), [руководство по работе за компьютером, 2019](https://www.mhlw.go.jp/content/000539603.pdf): не больше часа непрерывной работы, затем 10–15 минут отдыха.
- NIOSH (США), полевые испытания перерывов: [Galinsky et al. 2007](https://stacks.cdc.gov/view/cdc/186286), [обзор NIOSH](https://archive.cdc.gov/www_cdc_gov/niosh/updates/restbrks.html). Короткие перерывы снижают усталость и дискомфорт без потери выработки.
- [Albulescu et al. 2022](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0272460), метаанализ перерывов (PLOS One). Перерывы повышают бодрость и снижают усталость, и эффект растёт с длиной перерыва.

**Микропаузы каждые 20 минут**
- MHLW (то же руководство): внутри часа 1–2 короткие паузы (小休止).
- [Fujita et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6499340) (J Occup Health): паузы по 1–2 минуты; короткий отдых для глаз прямо во время работы заметно снижает их усталость.
- Balci et al. 2003: работа с микропаузами оказалась лучше схемы «60 минут работы, 10 отдыха» без пауз.
- Henning et al. 1997: частые навязчивые паузы соблюдают лишь наполовину, поэтому в Focus они мягкие и их можно отложить.

**«Ещё 5 минут» и предел 90 минут**
- Adamczyk & Bailey 2004; [Iqbal & Bailey 2008](https://www.interruptions.net/literature/Iqbal-CHI08.pdf): прерывать посреди подзадачи дороже всего, лучше дать дойти до точки остановки.
- Biwer et al. 2023 и [Smits et al. 2025](https://www.semanticscholar.org/paper/Investigating-the-Effectiveness-of-Self-Regulated,-Smits-Wenzel/defa071a4ae9da869677deb1df8d9c0d503cf7f3) (Маастрихт): без ограничений часть людей недоотдыхает, а жёсткий короткий таймер быстрее утомляет. Отсюда гибрид: мягкий сигнал плюс жёсткий потолок.

**Длинный перерыв каждые 3 блока, «на сегодня хватит» от 4 часов**
- Sonnentag & Fritz, исследования восстановления: отдых работает через отстранение от работы. Частоту длинных перерывов экспериментально не проверял никто.
- Ericsson et al. 1993 (около 4 часов глубокой работы в день) и примечание MHLW о ~300 минутах. Основание слабое, поэтому это мягкая подсказка, а не запрет.

**Что делать в перерыве: отдых без экрана**
- [Helton & Russell 2015](https://interruptions.net/literature/Helton-Cognition15.pdf) (Cognition): полный отдых восстанавливает лучше, чем смена задачи.
- [Kang & Kurtzberg 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC7044622): перерыв с телефоном восстанавливает не лучше, чем отсутствие перерыва.

**Задача блока на экране**
- [Leroy & Glomb 2018](https://www.washington.edu/news/2018/01/16/task-interrupted-a-plan-for-returning-helps-you-move-on/): план возвращения к задаче снимает «остаточное внимание».
- [Iqbal & Horvitz 2007](https://www.erichorvitz.com/CHI_2007_Iqbal_Horvitz.pdf): видимый контекст ускоряет возвращение к работе.

## Защита от отвлечений

- [Mark, Iqbal & Czerwinski 2017](https://www.interruptions.net/literature/Mark-UbiComp17.pdf): блокировка сайтов повышает фокус, но у части людей растёт стресс. Поэтому сайт сворачивается один раз, есть кнопка «Нужно для работы», а список сайтов настраивает сам пользователь.
- [Dabbish, Mark & González 2011](https://www.ics.uci.edu/~gmark/Home_page/Publications_files/CHI%202011%20Self-interruption.pdf): 18% переключений между задачами — самопрерывания, почти столько же, сколько прерываний извне (22%). Отвлекает не только чужое, но и собственная привычка проверить сайт.

## Музыка

**Никакой музыки со словами и треков с голосами и толпой**
- [Vasilev, Kirkby & Angele 2018](https://eprints.bournemouth.ac.uk/29995/9/1745691617747398.pdf), метаанализ: фоновая речь и песни со словами ухудшают понимание текста.
- [Salamé & Baddeley 1989](https://www.gwern.net/doc/music/music-distraction/1989-salame.pdf): механизм — слова конкурируют за вербальную память.
- [Shih, Huang & Chiang 2012](https://www.gwern.net/doc/music/music-distraction/2012-shih.pdf): музыка со словами снижает внимание на рабочем месте.
- [Souza & Barbosa 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10162369/): песни со словами ухудшили память, а инструментальный lo-fi по сравнению с тишиной эффекта не дал.

**Музыка без слов поднимает настроение, но думать лучше в тишине**
- [Kämpfe, Sedlmeier & Renkewitz 2011](https://www.gwern.net/doc/music/music-distraction/2011-kampfe.pdf), метаанализ: на сложные задачи фоновая музыка влияет около нуля или слегка вредит.
- [Cheah et al. 2022](https://livrepository.liverpool.ac.uk/3166444/), систематический обзор 154 экспериментов: музыка вредит задачам на память и язык, в большинстве сравнений эффекта нет.
- [Gonzalez & Aiello 2019](https://www.gwern.net/doc/music/music-distraction/2019-gonzalez.pdf): инструментальная музыка ухудшила сложную задачу и улучшила простую.

**Музыка на вход, а потом тишина**
- [Thompson, Schellenberg & Husain 2001](https://sites.utm.utoronto.ca/sites/sites.utm.utoronto.ca.glenn_website/files/download/Thompson2001.pdf): «эффект Моцарта» — это бодрость и настроение от музыки, прослушанной перед задачей. Поэтому музыка звучит в начале блока, а сама работа идёт в тишине.

**Громкость по умолчанию 30%**
- [Thompson, Schellenberg & Letnic 2012](https://sites.utm.utoronto.ca/sites/sites.utm.utoronto.ca.glenn_website/files/download/ThompsonEtAl2012.pdf): мешает сочетание быстро и громко, тихая музыка безвредна.
- [Mehta, Zhu & Cheema 2012](https://academic.oup.com/jcr/article-abstract/39/4/784/1798283): громкий фон (85 дБ) вредит даже творческим задачам.

**Перемешивание треков и выбор за пользователем**
- [Huang & Shih 2011](https://www.gwern.net/doc/music/music-distraction/2011-huang.pdf), [Perham & Sykora 2012](https://pure.cardiffmet.ac.uk/en/publications/disliked-music-can-be-better-for-performance-than-liked-music/): любимая музыка отвлекает сильнее, а люди этого не замечают.
- [Haake 2011](https://sonicfield.org/library/individual-music-listening-in-workplace-settings), [Lesiuk 2005](https://www.aaudxp-cms.aau.dk/media/ithhxegy/lesiukarticle2005.pdf): важен выбор и контроль, поэтому тишина — равноправный вариант.

## Живой фон

- Abrams & Christ 2003 (Psychological Science); [Franconeri & Simons 2003](https://visualcognition.psych.northwestern.edu/publications/FranconeriSimons_Motion.pdf): внимание цепляет начало движения, а не плавное течение. Поэтому фон переливается медленно, без вспышек и пульса.
- Simons, Franconeri & Reimer 2000: плавную смену цвета за 12 секунд люди часто не замечают. В Focus смена ещё медленнее, около минуты на цвет.
- Valdez & Mehrabian 1994; Mehta & Zhu 2009 (Science): сине-зелёные оттенки бодрят и приятны, синий помогает в задачах на идеи. Отсюда холодные цвета в фокусе и тёплые в перерыве.

## От чего отказались

- **Интерактивный «дымок» и фиджеты.** Заметки в [`notes/Фиджеты и микроотвлечения`](notes/Фиджеты%20и%20микроотвлечения): клики и игрушки на экране скорее мешают, а самопрерывания дорогие.
- **Популярные цифры** вроде «внимание как у золотой рыбки, 8 секунд», «90-минутные циклы», «правило 52/17», «23 минуты на возвращение к задаче». Первоисточники их не подтверждают, разбор — в отчёте о фокусе.
