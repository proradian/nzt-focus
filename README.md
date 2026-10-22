# NZT Focus

**Русский** | [English](README.en.md)

Таймер для фокуса построенный на исследованиях о внимании, перерывах и фоновом звуке.

<p align="center">
  <img src="docs/screenshots/focus.png" width="300" alt="Фокус: таймер, задача и музыка на вход">
  &nbsp;
  <img src="docs/screenshots/break.png" width="300" alt="Перерыв: отдых без экрана">
</p>

## На чём построен Focus

1. **Блок 60 минут, перерыв 10–15 минут, микропаузы каждые 20 минут.** [Руководство MHLW 2019](https://www.mhlw.go.jp/content/000539603.pdf) (Япония: не больше часа за экраном, затем 10–15 минут отдыха, внутри часа 1–2 короткие паузы); NIOSH, [Galinsky et al. 2000](https://stacks.cdc.gov/view/cdc/198356) и [2007](https://stacks.cdc.gov/view/cdc/186286) (5 минут отдыха каждый час снижают дискомфорт без потери выработки, в 2007 скорость ввода даже выросла); метаанализ [Albulescu et al. 2022](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0272460) (N = 2335: перерывы повышают бодрость, d = 0,36, и снижают усталость, d = 0,35; чем длиннее перерыв, тем больше прирост); [Fujita et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6499340) (короткий отдых для глаз прямо во время работы снижает их усталость); [Henning et al. 1997](https://search.pedro.org.au/search-results/record-detail/19236) (частые навязанные паузы брали только наполовину — поэтому микропаузы в Focus мягкие); [McLean et al. 2001](https://search.pedro.org.au/search-results/record-detail/19242) (микропаузы каждые 20 минут, каждые 40 минут или по желанию одинаково снижают мышечное утомление).
2. **«Ещё 5 минут» и потолок 90 минут вместо жёсткого таймера.** [Iqbal & Bailey 2008](https://www.interruptions.net/literature/Iqbal-CHI08.pdf) (прерывать в точке остановки дешевле, чем посреди подзадачи); [Biwer et al. 2023](https://pubmed.ncbi.nlm.nih.gov/36859717/) (87 студентов: со свободными перерывами недоотдыхали и сильнее уставали); [Smits et al. 2025](https://www.mdpi.com/2076-328X/15/7/861) (94 студента: при жёстком Pomodoro усталость росла быстрее); [Göksu et al. 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13405840/) (176 студентов: понимание текста одинаковое, но свободные перерывы дают больше энергии и меньше отвлечений).
3. **Почему не 25 минут и не 3 часа подряд.** [Helton & Russell 2015](https://interruptions.net/literature/Helton-Cognition15.pdf) (при интенсивной задаче внимание проседает меньше чем за 5 минут); метаанализ [Langner & Eickhoff 2013](https://www.academia.edu/15499833/Sustaining_attention_to_simple_tasks_A_meta_analytic_review_of_the_neural_mechanisms_of_vigilant_attention) (сильнее всего страдают простые однообразные задачи); [Van Cutsem et al. 2017](https://researchonline.jcu.edu.au/50619/) (30 минут — минимальная «утомляющая доза» умственной работы); [Tanaka et al. 2011](https://behavioralandbrainfunctions.biomedcentral.com/track/pdf/10.1186/1744-9081-7-46) (30 минут задачи на рабочую память вызывают измеримую усталость); [Boksem et al. 2005](https://www.boksem.nl/pdf/boksem2005cbr.pdf) (за 3 часа без отдыха растут усталость, время реакции и ошибки); [Huang et al. 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11655751) (ЭЭГ на 80-минутном уроке: утомление возвращается к исходному уровню примерно к 43-й минуте, выборка 8 человек). Прямых сравнений блоков 25, 60 и 90 минут на реальной работе нет: 60 минут — обоснованное значение по умолчанию, а не доказанный оптимум, поэтому длительность можно менять.
4. **Перерыв без экрана.** [Helton & Russell 2015](https://interruptions.net/literature/Helton-Cognition15.pdf) (N = 266 и 521: полный отдых восстанавливает лучше, чем смена задачи); [Kang & Kurtzberg 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC7044622) (N = 414: после перерыва с телефоном задачи решали на 19% дольше и на 22% меньше); [Lee et al. 2015](https://www.ltl.org.uk/wp-content/uploads/2019/02/40-second-green-roof-views-sustain-attention.pdf) (40 секунд взгляда на зелень уменьшают ошибки внимания); [Bergouignan et al. 2016](https://pubmed.ncbi.nlm.nih.gov/27809874/) (короткие прогулки каждый час повышают бодрость и настроение).
5. **Задача блока на экране.** [Iqbal & Horvitz 2007](https://www.erichorvitz.com/CHI_2007_Iqbal_Horvitz.pdf) (видимый контекст ускоряет возвращение к работе после отвлечения).
6. **Защита от отвлекающих сайтов, которую настраиваешь сам.** [Mark, Iqbal & Czerwinski 2017](https://www.interruptions.net/literature/Mark-UbiComp17.pdf) (блокировка повышает фокус, но у части людей растёт стресс — поэтому сайт сворачивается один раз и есть кнопка «Нужно для работы»); [Dabbish, Mark & González 2011](https://www.ics.uci.edu/~gmark/Home_page/Publications_files/CHI%202011%20Self-interruption.pdf) (18% переключений между задачами — самопрерывания, почти столько же, сколько прерываний извне).
7. **Никакой музыки со словами, для сложной работы — тишина.** Метаанализ [Vasilev et al. 2018](https://eprints.bournemouth.ac.uk/29995/9/1745691617747398.pdf) (фоновая речь и песни со словами ухудшают понимание текста, g ≈ −0,35 и −0,34); [Salamé & Baddeley 1989](https://www.gwern.net/doc/music/music-distraction/1989-salame.pdf) (слова конкурируют за вербальную память); [Shih et al. 2012](https://www.gwern.net/doc/music/music-distraction/2012-shih.pdf) (музыка со словами снижает внимание на работе); [Souza & Barbosa 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10162369/) (песни со словами ухудшили память, инструментальный lo-fi против тишины эффекта не дал); метаанализ [Kämpfe et al. 2011](https://www.gwern.net/doc/music/music-distraction/2011-kampfe.pdf) и обзор [Cheah et al. 2022](https://livrepository.liverpool.ac.uk/3166444/) (на сложные задачи фоновая музыка влияет около нуля или слегка вредит); [Gonzalez & Aiello 2019](https://www.gwern.net/doc/music/music-distraction/2019-gonzalez.pdf) (музыка ухудшила сложную задачу и улучшила простую).
8. **Музыка на вход, тихо, вперемешку, с выбором тишины.** [Thompson, Schellenberg & Husain 2001](https://sites.utm.utoronto.ca/sites/sites.utm.utoronto.ca.glenn_website/files/download/Thompson2001.pdf) («эффект Моцарта» — это бодрость и настроение от музыки, прослушанной перед задачей); [Thompson, Schellenberg & Letnic 2012](https://sites.utm.utoronto.ca/sites/sites.utm.utoronto.ca.glenn_website/files/download/ThompsonEtAl2012.pdf) (понимание текста ухудшила только быстрая и громкая музыка, тихая безвредна); [Mehta, Zhu & Cheema 2012](https://academic.oup.com/jcr/article-abstract/39/4/784/1798283) (громкий фон, 85 дБ, вредит даже творчеству); [Huang & Shih 2011](https://www.gwern.net/doc/music/music-distraction/2011-huang.pdf) и [Perham & Sykora 2012](https://pure.cardiffmet.ac.uk/en/publications/disliked-music-can-be-better-for-performance-than-liked-music/) (любимая музыка отвлекает сильнее); [Haake 2011](https://sonicfield.org/library/individual-music-listening-in-workplace-settings) и [Lesiuk 2005](https://www.aaudxp-cms.aau.dk/media/ithhxegy/lesiukarticle2005.pdf) (важны выбор и контроль над звуком).
9. **Медленный живой фон без вспышек.** [Franconeri & Simons 2003](https://visualcognition.psych.northwestern.edu/publications/FranconeriSimons_Motion.pdf) (движущиеся и приближающиеся объекты захватывают внимание — поэтому фон течёт медленно, без вспышек и пульса).

Подробности, оговорки и уровни доказательности — в [списке исследований](docs/research/SOURCES.md) и отчётах [«Фокус и перерывы в работе»](docs/research/reports/Фокус%20и%20перерывы%20в%20работе.md) и [«Музыка и звук при работе»](docs/research/reports/Музыка%20и%20звук%20при%20работе.md).

## Сборка

Нужны [Node.js](https://nodejs.org), [Rust](https://rustup.rs) и WebView2 (в Windows 10 и 11 уже есть).

```powershell
cd app
npm install
npx tauri build
```

Установщик появится в `app/src-tauri/target/release/bundle/nsis/`. Для разработки: `npx tauri dev`.

Интерфейс можно посмотреть и в обычном браузере (`python -m http.server --directory app/src`), только без нативных функций: музыки, защиты и трея.

## Структура

| Путь | Что это |
|---|---|
| `app/src/` | Интерфейс: HTML, CSS и JS без сборщика |
| `app/src-tauri/src/` | Нативная часть на Rust: окно, трей, хранение данных, защита от отвлечений (`guard.rs`, `urlbar.rs`, `curtain.rs`), музыка (`tta.rs`) |
| `docs/research/` | Исследования, на которых основан Focus |
| `docs/screenshots/` | Скриншоты для README |

## Данные

Всё хранится только на вашем компьютере, в `%APPDATA%\app.focus.timer\`. Focus ничего никуда не отправляет. Из сети он загружает только сайт tabletopaudio.com, когда играет музыка.

## Музыка: Tabletop Audio

Музыка — [Tabletop Audio](https://tabletopaudio.com) (автор Tim Wright), лицензия [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/). Focus не хранит и не распространяет треки: они играют через собственный сайт и плеер Tabletop Audio, а Focus только управляет воспроизведением. Проект живёт на поддержке слушателей. Если музыка нравится, поддержите автора на [Patreon](https://www.patreon.com/tabletopaudio).

Focus — некоммерческий проект и никак не связан с Tabletop Audio.

## Лицензия

Код распространяется по лицензии [MIT](LICENSE). Она не распространяется на музыку Tabletop Audio.
