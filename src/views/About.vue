<template functional>
    <div class="about">
        <h2>Disclaimer</h2>
        <p>
            Содержит ошибки, не использовать в качестве источника данных!
        </p>
        <h2>Цели</h2>
        <ul>
            <li>Потрогать <a target="_blank" href="//vuejs.org">vue.js</a></li>
            <li>Научиться привязывать three.js к html в больших масштабах, посмотреть на производительность</li>
            <li>Общее образование</li>
        </ul>
        <h2>Технические подробности</h2>
        <h3>Данные</h3>
        <p>
            <a href="//ru.wikipedia.org/wiki/Нуклид"
               target="_blank">Нуклиды</a> строятся из
            <a href="//ru.wikipedia.org/wiki/Нуклон"
               target="_blank">нуклонов</a>, нуклоны — из
            <a href="//ru.wikipedia.org/wiki/Кварк"
               target="_blank">кварков</a>.
            Исходные данные — мин. и макс. количества нейтронов для 1..118 протонов, взяты из
            <a href="//ru.wikipedia.org/wiki/Таблица_нуклидов"
               target="_blank">таблицы нуклидов</a> в википедии.
        </p>
        <p>
            <a title="Спин" href="//ru.wikipedia.org/wiki/Спин" target="_blank">Спин</a> вычисляется как сумма спинов
            нуклонов, спин нуклона — как сумма
            <a title="Изотопический спин" href="//ru.wikipedia.org/wiki/Изотопический_спин"
               target="_blank">изоспинов</a> кварков.
        </p>
        <p>
            Магнитный момент считается как сумма магнитных моментов нуклонов, значения из википедии:<br>
            для <a href="//ru.wikipedia.org/wiki/Протон" target="_blank">протона</a> <a
                href="//ru.wikipedia.org/wiki/Ядерный_магнетон" target="_blank" title="Мю эн">μN</a> = 2.79284734463,
            для <a href="//ru.wikipedia.org/wiki/Нейтрон" target="_blank">нейтрона</a> μN = -1.91304273
        </p>
        <p>
            <a href="//ru.wikipedia.org/wiki/Атомное_ядро#Радиус">Радиус ядра</a> в метрах =
            <span title="0.00000000000000123">r<sub>0</sub></span>*<a title="Массовое число"
                                                                      href="//ru.wikipedia.org/wiki/Массовое_число"
                                                                      target="_blank">A</a><sup>⅓</sup>.
        </p>
        <p>Энергия связи по <a href="https://ru.wikipedia.org/wiki/Капельная_модель_ядра#Вывод_формулы_Вайцзеккера"
                               target="_blank">формуле Вайцзеккера</a></p>
        <h3>Визуал</h3>
        <p>Текст и кружочек в кглу — svg.</p>
        <p>
            В каждой ячейке создаётся <a href="//threejs.org/" target="_blank">three.js</a> сцена
            с одним объектом <a href="//threejs.org/docs/index.html#api/en/objects/Points">Points</a>.<br>
            Протоны красненькие, потому что положительные, нейтроны — зелёненькие, потому что нейтральные.<br>
            Распределение точек немного завязано на энергию связи и магнитный момент.
        </p>
        <p>
            1 canvas, 1 камера, 3345 сцен, 466782 точки.
        </p>
    </div>
</template>
<style>
    .about {
        text-align: left;
    }
</style>
