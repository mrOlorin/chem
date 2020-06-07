<style>
    .about {
        text-align: left;
    }
</style>
<template functional>
    <div class="about">
        <h2>Disclaimer</h2>
        <p>
            Содержит ошибки.
        </p>
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
        </p>
        <p>
            Исходные данные — минимальное и максимальное количества нейтронов для 1..118 протонов, взяты из
            <a href="//ru.wikipedia.org/wiki/Таблица_нуклидов"
               target="_blank">таблицы нуклидов</a>.
        </p>
        <p>
            Рамкой выделен примерно самый распространённый изотоп.
        </p>
        <p>
            <a href="//ru.wikipedia.org/wiki/Атомное_ядро#Радиус">Радиус ядра</a> в метрах =
            <span title="0.00000000000000123">r<sub>0</sub></span>*<a title="Массовое число"
                                                                      href="//ru.wikipedia.org/wiki/Массовое_число"
                                                                      target="_blank">A</a><sup>⅓</sup>.
        </p>
        <h4>Элементы</h4>
        <p>
            Элемент состоит из ядра и <a href="//ru.wikipedia.org/wiki/Электрон"
                                         target="_blank">электронов</a>.<br>
            Количество электронов = количество протонов = порядковый номер элемента.
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
            Для некотороых элементов эти числа вычисляются правильно.
        </p>
        <p>
            Орбитали рисуются <a href="//www.youtube.com/watch?v=PGtv-dBi2wE"
                                 target="_blank">raymarching</a>-ом.<br>
            <code>length(p) - r</code>, где <code>r</code> —
            <a href="//en.wikipedia.org/wiki/Table_of_spherical_harmonics#Real_spherical_harmonics"
               target="_blank">сферическая гармоника</a>
            в точке <code>p</code> для <code>l</code> и <code>m</code> данного электрона.
        </p>
        <p>
            Масса — сумма масс ядра и электронов.
        </p>
        <h3>Визуал</h3>
        <p>
            В каждой ячейке создаётся THREE.Scene с одним объектом.<br>
            Протоны красные, потому что положительные, нейтроны — зелёные, потому что нейтральные.<br>
            Распределение, анимация и внешний вид "нуклонов" не имеют отношения к реальности.
        </p>
    </div>
</template>
