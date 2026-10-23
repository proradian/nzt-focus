'use strict';
// Язык интерфейса: русский (исходный) или английский — выбор в настройках (settings.lang).
// Русский текст в разметке и коде — это ключ словаря: неподвижный текст страницы переводит apply(),
// меняющиеся строки в коде проходят через tr(). Подключается первым на всех страницах программы.
const I18N = (() => {
  // Словарь «как написано по-русски → по-английски». {x} — подставляемые значения.
  const EN = {
    // Окно и главный экран
    'Мини-режим: маленький таймер поверх окон': 'Mini mode: a small timer on top of other windows',
    'Мини-режим': 'Mini mode',
    'Поверх всех окон': 'Always on top',
    'Поверх всех окон: включено': 'Always on top: on',
    'Как пользоваться': 'How to use',
    'Настройки': 'Settings',
    'Сегодня ещё ни одной сессии': 'No sessions yet today',
    'Над чем работаешь?': 'What are you working on?',
    'необязательно': 'optional',
    'например: глава 3 диплома': 'e.g. thesis chapter 3',
    'Длительность': 'Duration',
    'Своё': 'Custom',
    'Секундомер без жёсткого конца': 'Stopwatch with no fixed end',
    'Фон': 'Sound',
    'Тишина': 'Silence',
    'Музыка на вход': 'Warm-up music',
    'Музыка весь блок': 'Music throughout',
    'Начать фокус': 'Start focus',
    'Больше не показывать': "Don't show again",
    'Впервые здесь?': 'New here?',
    'Выбери время и нажми «Начать фокус» — дальше Focus подскажет сам.': 'Pick a duration and press “Start focus” — Focus will guide you from there.',
    'Подсказки': 'Tips',
    'Неделя': 'Week',
    'История по дням': 'History by day',
    'Почему 60 минут и перерыв 10?': 'Why 60 minutes and a 10-minute break?',
    'Сегодня: {n} {blocks} · {time}': 'Today: {n} {blocks} · {time}',
    'Сегодня ещё ни одного блока': 'No blocks yet today',
    'Сегодня уже <b>{time}</b> фокуса. По исследованиям, глубокой работы в день выходит около 4 часов — это ориентир, а не правило. Остановиться сейчас — нормально.':
      'Already <b>{time}</b> of focus today. Research suggests about 4 hours of deep work a day — a guideline, not a rule. Stopping now is fine.',
    'Короткий блок: удобно, чтобы раскачаться, или для утомительной задачи.': 'A short block: handy for getting going or for a tiring task.',
    'Средний блок, как школьный урок.': 'A medium block, like a school lesson.',
    'Рекомендуемый: час работы → 10 минут отдыха. Так советуют нормы Японии, США и Великобритании.': 'Recommended: an hour of work → 10 minutes of rest. That is what the guidelines in Japan, the US and the UK advise.',
    'Длинный блок для глубокой работы. Дольше без отдыха лучше не тянуть.': "A long block for deep work. Better not to go longer without rest.",
    'Своя длительность от 10 до 120 минут.': 'Your own duration, from 10 to 120 minutes.',
    'Без жёсткого конца: таймер считает вверх и предложит перерыв на 60-й минуте.': 'No fixed end: the timer counts up and suggests a break at minute 60.',
    'Музыка делает начало приятнее, а думать лучше в тишине. Поэтому 5 минут звучит спокойная музыка без слов, потом она плавно стихает, и к 10-й минуте — тишина. Захочешь войти ещё раз — кнопка «Погружение».':
      'Music makes the start more pleasant, but thinking works better in silence. So calm instrumental music plays for 5 minutes, then fades out, and by minute 10 it is quiet. Want to warm up again? Press “Warm-up”.',
    'Спокойная музыка без слов весь блок. Может помочь на однообразной работе: почта, правки, разбор. Для чтения, письма и сложных задач лучше тишина или музыка на вход.':
      'Calm instrumental music for the whole block. It may help with repetitive work: email, edits, sorting. For reading, writing and hard tasks, silence or warm-up music is better.',
    'Лучший вариант для чтения, письма и сложных задач: ничто не отвлекает.': 'The best choice for reading, writing and hard tasks: nothing distracts you.',

    // Фокус
    'Фокус': 'Focus',
    'Фокус-сессия': 'Focus session',
    'Фокус · +{n} мин': 'Focus · +{n} min',
    'осталось': 'left',
    'прошло': 'elapsed',
    'пауза': 'paused',
    'Пауза': 'Pause',
    'Продолжить': 'Continue',
    'Завершить': 'Finish',
    'Точно завершить?': 'Really finish?',
    'Перерыв сейчас': 'Break now',
    'играет': 'playing',
    'Нравится — сохранить трек': 'Like — save this track',
    'Нравится': 'Like',
    'Убрать из понравившихся': 'Remove from liked',
    'Пауза музыки': 'Pause music',
    'Включить музыку': 'Play music',
    'Следующий трек': 'Next track',
    'Ещё раз музыка на вход: 5 минут звучит, к 10-й минуте стихает': 'Warm-up music again: plays for 5 minutes, fades out by minute 10',
    'Погружение': 'Warm-up',
    'Стоп погружения': 'Stop warm-up',
    'Остановить музыку сейчас — дальше тишина': 'Stop the music now — silence from here',
    'Открыть сайт и выбрать трек самому': 'Open the site and pick a track yourself',
    'Открыть сайт': 'Open site',
    'Громкость музыки': 'Music volume',
    'Tabletop Audio · вход': 'Tabletop Audio · warm-up',
    'Tabletop Audio · играет': 'Tabletop Audio · playing',
    'Tabletop Audio · тишина': 'Tabletop Audio · silence',
    'загружается…': 'loading…',
    'на паузе': 'paused',
    'Музыка — для приятного начала. К 10-й минуте она стихнет: думать лучше в тишине.': 'Music makes the start pleasant. It fades out by minute 10: thinking works better in silence.',
    'Дальше тишина — в ней лучше думается. Захочешь музыку снова — «Погружение».': 'Silence from here — it is better for thinking. Want music again? Press “Warm-up”.',
    'YouTube свёрнут': 'YouTube minimized',
    '{site} свёрнут': '{site} minimized',
    'Яндекс Музыка свёрнута': 'Yandex Music minimized',
    '{site} — после блока': '{site} — after the block',
    'Сейчас фокус. Вернёшься к нему после блока.': "Focus time. You'll get back to it after the block.",
    'Сейчас фокус. Если это нужно для работы — нажми кнопку справа.': 'Focus time. If you need it for work, press the button on the right.',
    'Ок': 'OK',
    'Нужно для работы': 'Need it for work',
    'Хорошо, до конца блока не трогаю': "OK, I won't touch it until the block ends",
    'Микропауза': 'Micro-break',
    'Микропауза: взгляд вдаль': 'Micro-break: look into the distance',
    'Отведи взгляд вдаль, расслабь плечи.': 'Look into the distance, relax your shoulders.',
    'Отведи взгляд вдаль на 20 секунд. Можно не отвлекаться от мысли.': 'Look into the distance for 20 seconds. You can keep your train of thought.',
    'с': 's',
    'Ты остановился на:': 'You stopped at:',
    'Уже несколько внеплановых перерывов. Похоже, задача тяжёлая — можно сделать сессию короче, это не проигрыш.': "Several unplanned breaks already. The task seems hard — it's fine to make the session shorter.",
    'Закончить через 10 минут': 'Finish in 10 minutes',
    'Блок закончится через 10 минут': 'The block will end in 10 minutes',
    'Компьютер спал или был выключен — сессия на паузе': 'The computer was asleep or off — session paused',
    'Окно поверх всех остальных': 'The window stays on top of others',
    'Окно больше не поверх остальных': 'The window no longer stays on top',

    // Конец блока
    'Блок завершён': 'Block complete',
    'Блок завершён. Время отдохнуть': 'Block complete. Time to rest',
    'Час прошёл. Время отдохнуть': 'An hour has passed. Time to rest',
    '{n} {minutes} фокуса. Пора отдохнуть': '{n} {minutes} of focus. Time to rest',
    '{n} {minutes} фокуса. Допиши мысль — и на перерыв.': '{n} {minutes} of focus. Finish your thought and take a break.',
    'Если ты посреди мысли — допиши её, перерыв подождёт.': "If you're mid-thought, finish it — the break can wait.",
    'Если ты посреди мысли — допиши её: до 10 минут после конца блока засчитаются.': "If you're mid-thought, finish it: up to 10 minutes after the block still count.",
    'Это уже {n} минут подряд — дальше внимание заметно падает. Лучше отдохнуть.': "That's {n} minutes in a row — attention drops noticeably after this. Better take a rest.",
    'после конца блока': 'after the block ended',
    'Где ты остановился?': 'Where did you stop?',
    'одна строка, чтобы легко вернуться': 'one line, so it is easy to come back',
    'например: дописать вывод к разделу 3.2': 'e.g. finish the conclusion of section 3.2',
    'Перерыв {n} мин': 'Break {n} min',
    'Перерыв 10 мин': 'Break 10 min',
    'Длинный перерыв {n} мин': 'Long break {n} min',
    'Ещё 5 минут — закончить мысль': '5 more minutes — finish the thought',
    'Закончить на сегодня': 'Done for today',

    // Перерыв
    'Перерыв': 'Break',
    'Длинный перерыв': 'Long break',
    'Внеплановый перерыв': 'Unplanned break',
    '{label} · {n} мин': '{label} · {n} min',
    'Отдых без экрана': 'Rest away from the screen',
    'Перерыв — отдых без экрана': 'Break — rest away from the screen',
    'отдыха': 'of rest',
    'Телефон и ленты отдыхают хуже: после перерыва с телефоном задачи решали медленнее, чем после такого же перерыва без него.': 'Phones and feeds rest you less: after a phone break, people solved tasks more slowly than after the same break without one.',
    '+5 минут': '+5 minutes',
    'Закончить перерыв': 'End break',
    'Перерыв окончен': 'Break over',
    'Готов продолжить?': 'Ready to continue?',
    'Готов к следующему блоку?': 'Ready for the next block?',
    'Возвращаемся к сессии': 'Back to the session',
    'Ты отходил — блок засчитан: {time}': 'You stepped away — the block counted: {time}',
    'Продолжить сессию': 'Continue session',
    'Продолжить · осталось {time}': 'Continue · {time} left',
    'Начать фокус · без таймера': 'Start focus · no timer',
    'Начать фокус · {n} мин': 'Start focus · {n} min',
    'Ещё 5 минут отдыха': '5 more minutes of rest',
    'Ты остановился на: {note}': 'You stopped at: {note}',
    'Можно продолжать.': 'Ready to continue.',
    'Встань и пройдись по комнате или по коридору.': 'Get up and walk around the room or the hallway.',
    'Посмотри в окно на что-нибудь далёкое — глазам это нужнее всего.': 'Look out of the window at something far away — your eyes need it most.',
    'Потянись: шея, плечи, спина, запястья.': 'Stretch: neck, shoulders, back, wrists.',
    'Налей воды или чая и выпей не за столом.': 'Pour some water or tea and drink it away from your desk.',
    'Несколько медленных вдохов с длинным выдохом.': 'Take a few slow breaths with long exhales.',
    'Посмотри секунд сорок на что-нибудь зелёное: деревья за окном, растение.': 'Look at something green for about forty seconds: trees outside, a plant.',
    'Выйди на улицу хотя бы на 10 минут.': 'Go outside for at least 10 minutes.',
    'Поешь не за рабочим столом и без экрана.': 'Eat away from your desk and without a screen.',
    'Поговори с кем-нибудь не о работе.': 'Talk to someone about something other than work.',
    'Сделай короткую прогулку или лёгкую разминку.': 'Take a short walk or do a light warm-up.',
    ' Можно вздремнуть 15–20 минут — но не дольше 30.': ' You can nap for 15–20 minutes — but no longer than 30.',

    // Итоги и тосты
    'Сохранено: {time} фокуса': 'Saved: {time} of focus',
    'Сохранено: {time} фокуса. Хорошая работа': 'Saved: {time} of focus. Good work',
    'Сессия отменена': 'Session cancelled',
    'До встречи. Хорошая работа': 'See you. Good work',

    // Заголовок окна и трей
    '{time} · Фокус': '{time} · Focus',
    '{time} фокуса': '{time} of focus',
    '{time} до перерыва': '{time} until break',
    'Пауза · NZT Focus': 'Paused · NZT Focus',
    'Перерыв? · NZT Focus': 'Break? · NZT Focus',
    'NZT Focus — время перерыва': 'NZT Focus — time for a break',
    '{time} · Перерыв': '{time} · Break',
    'NZT Focus — перерыв, ещё {time}': 'NZT Focus — break, {time} left',
    'Продолжаем? · NZT Focus': 'Continue? · NZT Focus',
    'NZT Focus — перерыв окончен': 'NZT Focus — break over',
    'NZT Focus работает в трее': 'NZT Focus is running in the tray',
    'Таймер идёт. Открыть — клик по значку у часов.': 'The timer keeps running. Click the icon near the clock to open it.',
    'Уведомления включены': 'Notifications on',
    'Открыть NZT Focus': 'Open NZT Focus',
    'Выйти': 'Quit',

    // Мини-режим, листы
    'Развернуть': 'Expand',
    'Таймер сессии встанет на паузу и продолжится после перерыва.': 'The session timer pauses and resumes after the break.',
    'одна строка': 'one line',
    'Сколько отдыхаем': 'How long to rest',
    '2 мин': '2 min', '5 мин': '5 min', '10 мин': '10 min',
    'Отмена': 'Cancel',
    'Начать перерыв': 'Start break',
    'Закрыть': 'Close',
    'Готово': 'Done',
    'Понятно': 'Got it',
    'Отключить «поверх всех окон»?': 'Turn off “always on top”?',
    'Focus перестанет быть виден поверх других программ. Его станет легко потерять из виду и забыть про таймер.': 'Focus will no longer stay above other programs. It becomes easy to lose sight of it and forget the timer.',
    'Оставить поверх': 'Keep on top',
    'Да, отключить': 'Yes, turn off',
    'Пока пусто — здесь появятся дни с завершёнными блоками.': 'Empty for now — days with finished blocks will appear here.',
    '{n}-й блок': 'Block {n}',
    'Всего: {all} за {n} {days}, в среднем {avg} в день': 'Total: {all} over {n} {days}, {avg} a day on average',

    // Настройки
    'Язык': 'Language',
    'Оформление': 'Appearance',
    'Прилив': 'Tide', 'Глубина': 'Deep', 'Индиго': 'Indigo', 'Янтарь': 'Amber', 'Спектр': 'Spectrum',
    'Перерыв после блока': 'Break after a block',
    'Длинный перерыв каждые': 'Long break every',
    'Предел блока': 'Block limit',
    'с продлениями': 'with extensions',
    'Микропаузы (взгляд вдаль каждые 20 мин)': 'Micro-breaks (look into the distance every 20 min)',
    'Звук': 'Sound signals',
    'Уведомления Windows': 'Windows notifications',
    'Показывать окно, когда фаза закончилась': 'Show the window when a phase ends',
    'Музыка и отвлечения': 'Music and distractions',
    'Звук в фокусе (музыка Tabletop Audio)': 'Sound during focus (Tabletop Audio music)',
    'Только спокойные треки': 'Calm tracks only',
    'Громкость': 'Volume',
    'Понравившиеся треки': 'Liked tracks',
    'Пока пусто. Нажми ♡ рядом с треком во время фокуса.': 'Empty for now. Tap ♡ next to a track during focus.',
    'Убрать': 'Remove',
    'Убрано из понравившихся': 'Removed from liked',
    '«{track}» — в понравившихся': '“{track}” added to liked',
    'Сворачивать отвлекающие сайты во время фокуса': 'Minimize distracting sites during focus',
    'Что сворачивать': 'What to minimize',
    'Свой сайт, например twitch.tv': 'Your own site, e.g. twitch.tv',
    'Адрес сайта': 'Site address',
    'Добавить': 'Add',
    'Сайт': 'Site',
    'ВКонтакте': 'VK',
    'Яндекс Музыка': 'Yandex Music',
    'Не похоже на адрес сайта. Пример: twitch.tv': "That doesn't look like a site address. Example: twitch.tv",
    '{site} уже есть в списке — включил': '{site} is already on the list — turned it on',
    '{site} уже есть в списке': '{site} is already on the list',
    '{site} уже в списке': '{site} is already on the list',
    'Можно добавить не больше {n} сайтов': 'You can add up to {n} sites',
    '{site} и его поддомены будут сворачиваться во время фокуса': '{site} and its subdomains will be minimized during focus',
    'Закрывать приложение Яндекс Музыки при старте': 'Close the Yandex Music app when focus starts',
    'Музыка —': 'Music —',
    '(tabletopaudio.com), бесплатно для личного использования. Проект живёт на поддержке слушателей через Patreon.': '(tabletopaudio.com), free for personal use. The project is supported by listeners on Patreon.',
    'Очистить историю': 'Clear history',
    'Нажми ещё раз, чтобы удалить': 'Click again to delete',
    'История очищена': 'History cleared',
    'мин': 'min',
    'блока': 'blocks',

    // Подсказки и исследования
    'Выбери время и нажми «Начать»': 'Pick a duration and press “Start”',
    '60 минут — золотая середина. Окно можно закрыть, таймер идёт.': '60 minutes is the sweet spot. You can close the window — the timer keeps running.',
    'Устал — «Перерыв сейчас»': 'Tired? “Break now”',
    'Блок кончится — Focus позовёт': 'When the block ends, Focus will call you',
    'Не дописал мысль? «Ещё 5 минут».': 'Mid-thought? “5 more minutes”.',
    'Всегда на виду': 'Always in sight',
    'Булавка — поверх всех окон, значок окошка — мини-плашка.': 'The pin keeps it on top; the window icon opens the mini bar.',
    '5 минут спокойной музыки, к 10-й минуте — тишина. Можно выбрать тишину или музыку на весь блок.': '5 minutes of calm music, silence by minute 10. You can choose silence or music for the whole block.',
    'YouTube и соцсети сворачиваются': 'YouTube and social media get minimized',
    '«Нужно для работы» — разрешить до конца блока.': '“Need it for work” allows it until the block ends.',
    'График — твоя неделя': 'The chart is your week',
    'Чем выше и ярче столбик, тем больше фокуса за день. Подробнее — «История по дням».': 'The taller and brighter the bar, the more focus that day. More in “History by day”.',
    'Почему именно так — исследования': 'Why it works this way — the research',
    'Почему так устроено': 'Why it works this way',
    '60 минут → 10–15 минут отдыха.': '60 minutes → 10–15 minutes of rest.',
    'Такую норму для работы за экраном дал японский Минздрав, близкое советуют в США и Великобритании. Испытания NIOSH: 5 минут отдыха каждый час снизили дискомфорт и усталость глаз без потери выработки.':
      "Japan's Ministry of Health set this norm for screen work; the US and the UK advise something similar. NIOSH trials: 5 minutes of rest every hour reduced discomfort and eye strain without lowering output.",
    'Перерыв длиннее 5 минут.': 'Breaks longer than 5 minutes.',
    'Метаанализ 2022 года (2 335 человек): короткие паузы бодрят и снимают усталость, а результат работы растёт с длиной перерыва.': 'A 2022 meta-analysis (2,335 people): short pauses refresh you and ease fatigue, and work performance grows with break length.',
    'Отдых без телефона.': 'Rest without the phone.',
    'После перерыва с телефоном задачи решали медленнее, чем после такого же перерыва без него.': 'After a phone break, people solved tasks more slowly than after the same break without one.',
    'Мягкий конец блока.': 'A soft end to the block.',
    'Прерывание посреди задачи раздражает сильнее всего — поэтому можно дописать 5 минут, но не бесконечно.': 'Being interrupted mid-task is the most irritating — so you can add 5 minutes, but not endlessly.',
    'Записка «где я остановился».': 'A “where I stopped” note.',
    'Помогает отпустить задачу на перерыве.': 'It helps you let go of the task during the break.',
    'Около 4 часов глубокой работы в день.': 'About 4 hours of deep work a day.',
    'Ориентир, а не правило: примерно столько в день занимаются лучшие музыканты.': 'A guideline, not a rule: roughly how much the best musicians practise a day.',
    'Подробности — в отчёте «Фокус и перерывы в работе».': 'Details are in the report “Focus and breaks at work”.',

    "Сегодня уже <b>{time}</b> фокуса. Дальше хуже всего идут трудные задачи и решения, а почта и рутина — нормально. Можно перейти на лёгкое или закончить: оба варианта нормальны.": "Already <b>{time}</b> of focus today. From here on, hard tasks and decisions suffer most, while email and routine work are fine. You can switch to something easy or stop: both are fine.",
    "Сегодня уже 4 ч фокуса. Дальше хуже всего идут трудные задачи и решения, а почта и рутина — нормально. Можно перейти на лёгкое или закончить: оба варианта нормальны.": "Already 4 h of focus today. From here on, hard tasks and decisions suffer most, while email and routine work are fine. You can switch to something easy or stop: both are fine.",
    "Почему 60 минут и перерыв 10–15?": "Why 60 minutes and a 10–15 minute break?",
    "Больше 2 часов фокуса без длинного отдыха — поэтому перерыв на 5 минут дольше.": "More than 2 hours of focus without a long rest — so the break is 5 minutes longer.",
    "Перерыв после часа работы": "Break after an hour of work",
    "после 2 ч подряд +5": "+5 after 2 h in a row",
    "Перерыв по длине блока, после 2 часов — дольше.": "Break sized to the block, longer after 2 hours.",
    "После 45 минут работы перерыв короче, после 90 — длиннее. Японский эксперимент 1987 года: если за экраном больше 2 часов в день, после каждого часа нужно от 15 минут отдыха.": "After 45 minutes of work the break is shorter, after 90 it is longer. A 1987 Japanese experiment: with more than 2 hours of screen work a day, each hour needs at least 15 minutes of rest.",
    "Длинный перерыв после 3 блоков подряд.": "A long break after 3 blocks in a row.",
    "Перерыв 20–30 минут перекрывает спад примерно за 2 часа работы. Если между блоками прошло столько же (обед, дела), это уже длинный отдых — счёт начинается заново.": "A 20–30 minute break offsets the decline from about 2 hours of work. If that much time passed between blocks (lunch, errands), it already counts as a long rest and the count starts over.",
    "Ориентир, а не предел: к концу долгого дня хуже всего идут трудные задачи и решения, а простые — нормально. Поэтому самое трудное лучше ставить в первые блоки.": "A guideline, not a limit: late in a long day, hard tasks and decisions suffer most while simple ones are fine. So put the hardest work in the first blocks.",

    "Сколько блоков": "How many blocks",
    "Меньше блоков": "Fewer blocks",
    "Больше блоков": "More blocks",
    "Нажми, чтобы изменить": "Click to edit",
    "Над чем работаешь": "What are you working on",
    "Последний блок завершён": "Last block done",
    "Все {n} {blocks} сделаны. Допиши мысль — и можно заканчивать.": "All {n} {blocks} done. Finish your thought and you can wrap up.",
    "Все {n} {blocks} сделаны: {time} фокуса. Хорошая работа": "All {n} {blocks} done: {time} of focus. Good work",
    "Блок {n} из {total} завершён": "Block {n} of {total} done",
    "Все {n} {blocks} сделаны": "All {n} {blocks} done",
    " · блок {n} из {total}": " · block {n} of {total}",
    "блок {n} из {total}": "block {n} of {total}",
    "+{n} мин": "+{n} min",
    "Перерыв закончился 5 минут назад": "The break ended 5 minutes ago",
    "Пора возвращаться: {next}.": "Time to get back: {next}.",
    " ({n} {long} по {min} мин)": " ({n} {long} of {min} min)",
    "{approx}{work} фокуса, закончишь около {end}.": "{approx}{work} of focus, done around {end}.",
    "{n} × {per} мин = {approx}{work} фокуса. С перерывами{longs} ≈ {total}, закончишь около {end}.": "{n} × {per} min = {approx}{work} of focus. With breaks{longs} ≈ {total}, done around {end}.",
    " Вместе с сегодняшними {done} выйдет {sum} — больше 4 часов: глубокой работы в день обычно выходит около 4 ч, дальше внимание проседает.": " Together with today's {done} that makes {sum} — over 4 hours: deep work usually comes to about 4 h a day, after that attention dips.",
    " Больше 4 часов: глубокой работы в день обычно выходит около 4 ч, дальше внимание проседает.": " Over 4 hours: deep work usually comes to about 4 h a day, after that attention dips.",
    "Закончить сессию": "End session",
    "возвращаемся к сессии": "back to the session",
    "дальше блок {n} из {total}": "next up: block {n} of {total}",
    "дальше следующий блок": "next up: the next block",
    "Перерыв скоро закончится": "The break is almost over",
    "Осталась минута, {next}. Пора возвращаться к столу.": "One minute left, {next}. Time to head back to your desk.",
    "Блок {x} на паузе": "Block {x} paused",
    "{n} из {total}": "{n} of {total}",
    "Сделано {x} · впереди {left}": "{x} done · {left} to go",
    "После этого ещё {x}": "{x} more after this",
    "Последний блок": "Last block",
    "Не лучший вариант: сложные задачи лучше идут в тишине. Музыка весь блок подходит разве что для однообразной работы — почта, правки, разбор. Для чтения, письма и сложных задач выбери тишину или музыку на вход.": "Not the best choice: complex tasks go better in silence. Music throughout suits only repetitive work — email, edits, sorting. For reading, writing and hard tasks choose silence or warm-up music.",

    "Сегодня": "Today",
    "Блоки и перерывы за сегодня": "Today's blocks and breaks",
    "Блоки и перерывы этого дня": "Blocks and breaks of this day",
    "Все дни": "All days",
    "Нажми на день — увидишь блоки по времени и перерывы между ними.": "Click a day to see its blocks by time and the breaks between them.",
    "сразу следующий блок": "next block right away",
    "{time} без фокуса": "{time} without focus",
    "перерыв {time}": "break {time}",
    " — почти без отдыха": " — barely any rest",
    "без таймера": "no timer",
    "прерван · {n} из {plan} мин": "cut short · {n} of {plan} min",
    "целый · +{n} мин": "full · +{n} min",
    "целый": "full",
    "Блок {n}": "Block {n}",
    "после блока прошло {time}": "{time} since the last block",
    " · сегодня": " · today",
    "{n} {blocks} · {time} фокуса": "{n} {blocks} · {time} of focus",
    " · перерывы {time}": " · breaks {time}",
    "паузы внутри {time}": "paused inside {time}",

    "Завершить блок?": "Finish the block?",
    "Продолжить блок": "Keep going",
    "Прошло меньше минуты — блок не сохранится.": "Less than a minute has passed — the block won't be saved.",
    "{time} фокуса засчитаются.": "{time} of focus will be counted.",
    "Сделано {n} из {plan} мин — они засчитаются.": "{n} of {plan} min done — they will be counted.",
    "Отменить блок": "Cancel block",
    "закончен раньше · {n} из {plan} мин": "finished early · {n} of {plan} min",
    "Прервали — «Пауза» или пробел. За 10 минут до конца блока — «Завершить» и перерыв.": "Interrupted? “Pause” or the space bar. In the last 10 minutes of a block, “Finish” goes straight to a break.",

    "Закончить блок с перерывом можно за {n} минут до конца — через {time}.": "You can finish the block with a break in its last {n} minutes — in {time}.",

    "Закрывать Steam при старте": "Close Steam when focus starts",
    "вместе с играми и загрузками": "along with games and downloads",


    "Закрывать Telegram при старте": "Close Telegram when focus starts",
    "приложение; сайт и так сворачивается": "the app; the website is minimized anyway",
    "Закрыто на время фокуса: {apps}": "Closed for this focus block: {apps}",

    // Плашка и занавес поверх отвлекающих сайтов
    'Сейчас фокус': 'Focus time',
    'Этот сайт': 'This site',
    '{site} подождёт до конца блока': '{site} can wait until the block ends',
    '{site} подождёт до конца блока.': '{site} can wait until the block ends.',
    'Этот сайт подождёт до конца блока.': 'This site can wait until the block ends.',
    'Мне нужно для работы': 'I need it for work',
    'Переключись на рабочую вкладку сверху — занавес исчезнет сам.': 'Switch to a work tab above — the curtain will disappear on its own.',
  };
  // Слова со счётом: русские три формы → английские две.
  const PLURAL_EN = { 'блок': ['block', 'blocks'], 'длинный': ['long', 'long'], 'минута': ['minute', 'minutes'], 'день': ['day', 'days'] };

  const readLang = () => { try { return JSON.parse(localStorage.getItem('focus.settings.v2'))?.lang; } catch { return null; } };
  let lang = readLang() === 'en' ? 'en' : 'ru';

  const fill = (s, v) => v ? s.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m)) : s;
  function t(ru, vars) { return fill(lang === 'en' && EN[ru] != null ? EN[ru] : ru, vars); }
  function plural(n, one, few, many) {
    if (lang === 'en') { const p = PLURAL_EN[one]; return p ? p[n === 1 ? 0 : 1] : t(n === 1 ? one : many); }
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  }

  // Неподвижный текст страницы и подписи элементов. Исходный русский запоминается, поэтому
  // можно переключаться туда и обратно без перезагрузки. Строки, которые выставляет код, сюда не попадают:
  // их код каждый раз пишет заново через tr().
  const origText = new WeakMap();
  const ATTRS = ['title', 'placeholder', 'aria-label'];
  const RU = /[А-Яа-яЁё]/;
  function swap(ru) {
    const core = ru.trim();
    if (lang !== 'en' || !core || EN[core] == null) return ru;
    return ru.replace(core, EN[core]);
  }
  function apply(root = document.body) {
    document.documentElement.lang = lang;
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentNode.closest('script,style') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      let ru = origText.get(n);
      if (ru === undefined) { if (!RU.test(n.nodeValue)) continue; ru = n.nodeValue; origText.set(n, ru); }
      const v = swap(ru);
      if (n.nodeValue !== v) n.nodeValue = v;
    }
    root.querySelectorAll('[title],[placeholder],[aria-label]').forEach(el => {
      ATTRS.forEach(a => {
        if (!el.hasAttribute(a)) return;
        const key = 'ru' + a.replace(/-./g, m => m[1].toUpperCase()).replace(/^./, c => c.toUpperCase());
        let ru = el.dataset[key];
        if (ru === undefined) { const cur = el.getAttribute(a); if (!RU.test(cur)) return; ru = el.dataset[key] = cur; }
        el.setAttribute(a, swap(ru));
      });
    });
  }

  return {
    get lang() { return lang; },
    set(l) { lang = l === 'en' ? 'en' : 'ru'; apply(); },
    // Перечитать язык из сохранённых настроек (для окон плашки и занавеса: язык могли сменить, пока они были скрыты).
    reload() { this.set(readLang()); },
    locale: () => (lang === 'en' ? 'en-GB' : 'ru-RU'),
    t, plural, apply
  };
})();
// tr, а не t: в коде программы t часто занято под время.
const tr = I18N.t;
document.addEventListener('DOMContentLoaded', () => I18N.apply());
if (document.readyState !== 'loading') I18N.apply();
