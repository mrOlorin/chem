<style>
    .about {
        text-align: left;
    }
</style>
<template functional>
    <div class="about">
        <h2>Disclaimer</h2>
        <p>
            Содержит ошибки, не использовать в качестве источника данных!
        </p>
        <h2>Цели</h2>
        <ul>
            <li>Потрогать <a target="_blank" href="//vuejs.org">vue.js</a></li>
            <li>Научиться привязывать <a href="//threejs.org/" target="_blank">three.js</a>
                к html в больших масштабах, посмотреть на производительность
            </li>
            <li>Общее образование</li>
        </ul>
        <h2>Технические подробности</h2>
        <h3>Данные</h3>
        <h4>Нуклиды</h4>
        <p>
            <a href="//ru.wikipedia.org/wiki/Нуклид"
               target="_blank">Ядра</a> строятся из
            <a href="//ru.wikipedia.org/wiki/Нуклон"
               target="_blank">нуклонов</a>, нуклоны — из
            <a href="//ru.wikipedia.org/wiki/Кварк"
               target="_blank">кварков</a>.<br>
            Исходные данные — мин. и макс. количества нейтронов для 1..118 протонов, взяты из
            <a href="//ru.wikipedia.org/wiki/Таблица_нуклидов"
               target="_blank">таблицы нуклидов</a> в википедии.
        </p>
        <p>
            <a title="Спин" href="//ru.wikipedia.org/wiki/Спин" target="_blank">Спин</a> — сумма спинов
            нуклонов, спин нуклона — сумма
            <a title="Изотопический спин" href="//ru.wikipedia.org/wiki/Изотопический_спин"
               target="_blank">изоспинов</a> кварков.
        </p>
        <p>
            Масса — сумма масс нуклонов, масса нуклона — сумма масс кварков.
        </p>
        <p>
            Магнитный момент — сумма магнитных моментов нуклонов, значения из википедии.<br>
            Измеряется в
            <a href="//ru.wikipedia.org/wiki/Ядерный_магнетон" target="_blank">ядерных магнетонах</a>
            <span title="Мю эн">μN</span>
        </p>
        <p>
            <a href="//ru.wikipedia.org/wiki/Атомное_ядро#Радиус">Радиус ядра</a> в метрах =
            <span title="0.00000000000000123">r<sub>0</sub></span>*<a title="Массовое число"
                                                                      href="//ru.wikipedia.org/wiki/Массовое_число"
                                                                      target="_blank">A</a><sup>⅓</sup>.
        </p>
        <p>Энергия связи по <a href="https://ru.wikipedia.org/wiki/Капельная_модель_ядра#Вывод_формулы_Вайцзеккера"
                               target="_blank">формуле Вайцзеккера</a></p>
        <h4>Элементы</h4>
        <p>
            Элемент состоит из ядра и <a href="//ru.wikipedia.org/wiki/Электрон"
                                         target="_blank">электронов</a>.
        </p>
        <p>
            Электрон определяется четырьмя квантовыми числами:<br>
            <a href="//ru.wikipedia.org/wiki/Главное_квантовое_число"
               target="_blank">главным</a> (n),
            <a href="//ru.wikipedia.org/wiki/Орбитальное_квантовое_число"
               target="_blank">орбитальным</a> (l),
            <a href="//ru.wikipedia.org/wiki/Магнитное_квантовое_число"
               target="_blank">магнитным</a> (m) и
            <a href="//ru.wikipedia.org/wiki/Спин"
               target="_blank">спиновым</a> (ms).<br>
            Эти числа вычисляются уберфункцией. Для некотороых элементов правильно, для
            <a href="//ru.wikipedia.org/wiki/Правило_Клечковского#Исключения_из_правила_Клечковского"
               target="_blank">некотороых</a> — нет.
        </p>
        <p>
            Масса — сумма масс ядра и электронов.
        </p>
        <h3>Визуал</h3>
        <p>
            В каждой ячейке создаётся THREE.Scene
            с одним объектом (ядро — <a href="//threejs.org/docs/index.html#api/en/objects/Points">Points</a>).<br>
            Протоны красненькие, потому что положительные, нейтроны — зелёненькие, потому что нейтральные.<br>
            Распределение и анимация и внешний вид "нуклонов" не имеют отношения к реальности.
        </p>
    </div>
</template>
