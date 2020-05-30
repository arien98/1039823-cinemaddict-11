import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {FilmGenres} from "../mocks/film.js";
import AbstractSmartComponent from "./abstract-smart-component";

export const StatFilter = {
  ALL: `All time`,
  TODAY: `today`,
  WEEK: `Week`,
  MONTH: `Month`,
  YEAR: `Year`
};

export class StatisticsComponent extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
    this._statFilter = StatFilter.ALL;
    this._statButtonClickHandler = null;
  }

  getTemplate() {
    const isShowAll = (this._statFilter === StatFilter.ALL) ? `checked` : ``;
    const isShowToday = (this._statFilter === StatFilter.TODAY) ? `checked` : ``;
    const isShowWeek = (this._statFilter === StatFilter.WEEK) ? `checked` : ``;
    const isShowMonth = (this._statFilter === StatFilter.MONTH) ? `checked` : ``;
    const isShowYear = (this._statFilter === StatFilter.YEAR) ? `checked` : ``;
    const wathedFilms = this._filmsModel.getWatchedFilms(this._statFilter);
    const wathedFilmsCount = wathedFilms.length;
    const wathedFilmsDuration = wathedFilms.map((it) => {
      return it.duration;
    });
      // .reduce((sum, num) => sum + num);
    const wathedFilmsDurationTemplate = `${Math.floor(wathedFilmsDuration / 60)}h ${wathedFilmsDuration % 60}m`;
    const stats = this._filmsModel.getGenreSelectedFilms(this._statFilter);
    const topGenre = stats[0].genre;


    return (
      `<section class="statistic visually-hidden">
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">Sci-Fighter</span>
        </p>
    
        <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
          <p class="statistic__filters-description">Show stats:</p>
    
          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${isShowAll}>
          <label for="statistic-all-time" class="statistic__filters-label" data-filter-type=${StatFilter.ALL}>All time</label>
    
          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${isShowToday}>
          <label for="statistic-today" class="statistic__filters-label" data-filter-type=${StatFilter.TODAY}>Today</label>
    
          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${isShowWeek}>
          <label for="statistic-week" class="statistic__filters-label" data-filter-type=${StatFilter.WEEK}>Week</label>
    
          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${isShowMonth}>
          <label for="statistic-month" class="statistic__filters-label" data-filter-type=${StatFilter.MONTH}>Month</label>
    
          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${isShowYear}>
          <label for="statistic-year" class="statistic__filters-label" data-filter-type=${StatFilter.YEAR}>Year</label>
        </form>
  
        <ul class="statistic__text-list">
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">You watched</h4>
            <p class="statistic__item-text">${wathedFilmsCount} <span class="statistic__item-description">movies</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Total duration</h4>
            <p class="statistic__item-text">${wathedFilmsDurationTemplate}</p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Top genre</h4>
            <p class="statistic__item-text">${topGenre}</p>
          </li>
        </ul>
    
        <div class="statistic__chart-wrap">
          <canvas class="statistic__chart" width="1000" aria-label="Statistics' chart" role="img"></canvas>
        </div>
      </section>`
    );
  }

  setStatFilter(statFilter) {
    this._statFilter = statFilter;
  }

  setStatButtonClickHandler(handler) {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, handler);
    this._statButtonClickHandler = handler;
  }

  recoveryListeners() {
    this.setStatButtonClickHandler(this._statButtonClickHandler);
  }

  rerender() {
    // super.rerender();
    this.getChart();
  }

  getChart() {
    const BAR_HEIGHT = 50;
    const statisticCtx = document.querySelector(`.statistic__chart`);
    const labelTypes = [...FilmGenres];

    // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
    statisticCtx.height = BAR_HEIGHT * labelTypes.length;

    const stats = this._filmsModel.getGenreSelectedFilms(this._statFilter);
    const genres = stats.map((it) => {
      return it.genre;
    });
    const genreCount = stats.map((it) => {
      return it.count;
    });

    return new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: genres,
        datasets: [{
          data: genreCount,
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }
}
