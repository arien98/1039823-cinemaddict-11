import {AbstractComponent} from './abstract-component.js';

const RatingType = {
  GRADE_0: ``,
  GRADE_1: `Novice`,
  GRADE_2: `Fan`,
  GRADE_3: `Movie Buff`,
};

const RatingFilmsCount = {
  GRADE_0: 1,
  GRADE_1: 10,
  GRADE_2: 20
};

export const getRank = (filmsCount) => {
  let rank = 0;

  switch (true) {
    case (filmsCount <= RatingFilmsCount.GRADE_0):
      rank = RatingType.GRADE_0;
      break;
    case (filmsCount <= RatingFilmsCount.GRADE_1):
      rank = RatingType.GRADE_1;
      break;
    case (filmsCount <= RatingFilmsCount.GRADE_2):
      rank = RatingType.GRADE_2;
      break;
    case (filmsCount <= RatingFilmsCount.GRADE_3):
      rank = RatingType.GRADE_3;
      break;
  }
  return rank;
};

const createAvatarTemplate = (userRank) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export class ProfileComponent extends AbstractComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._userRank = null;
  }

  getTemplate() {
    const watchedFilms = this._filmsModel.getWatchedFilms()
      .filter((film) => film.isHistory === true);

    this._userRank = getRank(watchedFilms.length);

    return createAvatarTemplate(this._userRank);
  }

  getUserRank() {
    return this._userRank;
  }
}
