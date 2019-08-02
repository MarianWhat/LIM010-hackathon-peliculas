const sliderMostVoted = document.getElementById('slider-most-voted');
const contAllSeries = document.getElementById('cont-all-series');
const selectSortByYear = document.getElementById('sort-by-year');
const selectSortByRating = document.getElementById('sort-by-rating');
const modalGenere = document.getElementById('modal-genere');
const modalSerie = document.getElementById('modal-serie');

const btnGenere = document.getElementById('btn-genere');
const btnClose = document.getElementById('btn-close');


const series = ['the walking dead','Into the Dark','the terror', 'Stranger things', 'The passage', 'Lucifer', 'American Horror Story', 'The haunting', 'The keepers', 'Bates Motel', 'The strain', 'Slasher', 'Hannibal', 'Grimm', 'Dead set'];
let allSeries = [];
let genereActive = 'all';

const apiData = () => {
  allSeries = [];
  return new Promise(function (exito, reject){
    for (let serie of series){
      fetch(`http://www.omdbapi.com/?t=${serie}&plot=full&r=json&apikey=79d0f85`)
      .then(resp => resp.json())
      .then((myJson) => {
        let newObjeto = {
          title: myJson.Title,
          poster: myJson.Poster,
          summary: myJson.Plot,
          totalSeasons: myJson.totalSeasons,
          actors: (myJson.Actors).split(', '),
          awards: myJson.Awards,
          country: myJson.Country,
          genere: (myJson.Genre).split(', '),
          language: myJson.Language,
          rated: myJson.Rated,
          date: myJson.Released,
          year: myJson.Year,
          duration: myJson.Runtime,
          type: myJson.Type,
          writer: myJson.Writer,
          rating: myJson.imdbRating,
          ratingVotes: myJson.imdbVotes
        };
      allSeries.push(newObjeto);
      })
      setTimeout(() =>{
        exito(allSeries);
       }, 900)
    } 
 })
     
};
apiData().then((obj) => {
     return obj;
 })
 .then((myJson) => {
  renderSeries(myJson, contAllSeries)
  genereList(myJson)
  renderModalSerie(myJson[2])
  return topSix(myJson)
 })
 .then((myJson) => {
  renderSeries(myJson, sliderMostVoted)
})
.then(() => {
  $('.slider-most-voted').slick({
    dots: true,
    infinite: true,
    speed: 300,
    variableWidth: true
  });
  accion();
});
let genres = '';
let actors = '';
//Funciona
const accion = () =>{
  $(".box-cover-serie").on("click",function(){
    id=$(this).attr("data-title");
    console.log(id);
    apiData().then((array) => {
      return array.filter(serie => serie.title === id);
  })
  .then((serie) => {
    genres = '';
    actors = '';
    console.log(serie)
    console.log(serie.genere)
  for (const genre of serie.genere) {
    genres += `<span class="item-genres">${genre}</span>`
  }
  for (const actor of serie.actors) {
    actors += `<span class="item-actors">${actor}</span>`
  }
  renderModalSerie(serie, genres, actors);
  })
})
}

const renderModalSerie = (serie, genres, actors) => {
  modalSerie.innerHTML = `<div class="partOne">
  <div class="poster-modal-serie" style="background-image: url(${serie.poster})"></div>
  <div class="cont-text">
  <h2>${serie.title}</h2>
  <p class="info-extra">${serie.duration} • ${serie.year} • Temporadas ${serie.totalSeasons}</p>
  <div class="genre-serie display-flex">${genres}</div>
  <p class="resumen">${serie.summary}</p>
</div>
<div class="info-ranting">
    <div class="info-ranting-rating display-flex"><img class="" src="img/icon-star.png"><span>${serie.rating}</span></div>
    <div class="info-ranting-ratingVotes display-flex"><img class="" src="img/icon-votes.png"><span>${serie.ratingVotes}</span></div>
  </div>
</div>
<div class="partActors">
<h3>Actors</h3>
<div class="display-flex"> ${actors}</div>
</div>`;
}
modalGenere.addEventListener('click', () => {
  modalGenere.classList.replace('display-flex', 'none');
});
btnGenere.addEventListener('click', () => {
  modalGenere.classList.replace('none', 'display-flex');
});
// all reciente antiguo
selectSortByYear.addEventListener('change', () => {
  UpdatedArray(selectSortByYear.value, 'all');
  selectSortByRating.value = 'all';
});
selectSortByRating.addEventListener('change', () => {
  UpdatedArray('all', selectSortByRating.value);
  selectSortByYear.value = 'all';
});
// Funciona que retorna un nuevo array con orden y filtrado selecionado XD
const UpdatedArray = (sortByYear, sortByRating) => {
  apiData().then(function(arrayOriginal) {
    return arrayOriginal;
  })
  .then((array) => {
    if (sortByYear==='all' && sortByRating==='all') {
      renderSeries(array, contAllSeries)
    }else{
    let arrayUpdate = sortGeneral(array, 'rating', sortByRating);
    let arrayUpdate2 = sortByDate(arrayUpdate, sortByYear);
    renderSeries(arrayUpdate2, contAllSeries)
    }
  })
};
const renderSeries = (seriesToShow, element) => {
  element.innerHTML = '';    
  for (let serie of seriesToShow) { 
    element.innerHTML += `<article class="box-cover-serie" data-title="${serie.title}">
      <h3 class="box-title">${serie.title}</h3>
      <img class="box-cover" src="${serie.poster}" alt="">
      <p class="box-year">${serie.year.substr(0,4)} • Temporadas ${serie.totalSeasons} • <img class="box-rating-img" src="img/icon-star.png">${serie.rating}</p>
    </article>`;
  };
};
// Array que contiene la lista de generos. XD
const genereList = (data) => {
  let newArray = [];
  for (let serie of data) {
    for (let genereEach of serie.genere)
      if (!(newArray.includes(genereEach)))
      newArray.push(genereEach);
  }
  for (let genere of newArray) { 
    modalGenere.innerHTML += `<button class="btn-genre" data-title="${genere}">${genere}</button>`;
  };
};
// Función que me devuelve el Array ordenado en Desc o Asc. (Proximo a simplificar) XD
const sortGeneral = (data, sortBy, ascOrDesc) => {
  return data.sort((prev, next) => {
    if (ascOrDesc==='asc') {
      return prev[sortBy] > next[sortBy] ? 1 : -1;
    }
    if (ascOrDesc==='desc') {
      return prev[sortBy] > next[sortBy] ? -1 : 1;  
    }
  })
};
// Función que me devuelve el Array ordenado por fecha. XD
const sortByDate = (data, sortBy) => {
  return data.sort((prev, next) =>{
    if (sortBy==='asc') {
      return  new Date(prev.date) - new Date(next.date);      
    }else if (sortBy==='desc') {
      return new Date(next.date) - new Date(prev.date);
    }else{
      console.log('XD')
    }
 });
};
// Función que filtra, recibe 3 argumentos.
//1) data = El array a usar. 2) filterBy = Filtar por Genero, Autor..., 3) Value = por ejemplo Drama.  XD
 const filterGeneral = (data, filterBy, value) => {
   return data.filter((serie) =>{
    return serie[filterBy].includes(value);
   })
 };
// Función que de mevuelve un array de las 6 series más votadas y por fecha asc.
const topSix = (data) =>{
  let newArray = [];
  const arrayByDate = sortByDate(data, 'desc');
  for (let index = 0; index < 6; index++) {
    newArray.push(arrayByDate[index]);
  }
  sortGeneral(newArray, 'rating', 'asc');
  return newArray;
};
// Función que de mevuelve un array de las 6 series más votadas y por fecha asc.
const topNew = () =>{
  let newArray = [];
  const arrayByDate = sortByDate(allSeries, 'asc');
  newArray.push(arrayByDate[0]);
  return newArray;
};
//  filterGeneral(allSeries, 'actors', 'Aurora Perrineau')
//  filterGeneral(allSeries, 'genere', 'Sci-Fi')
// sortByX(allSeries, 'rating');
// sortByX(allSeries, 'year');








