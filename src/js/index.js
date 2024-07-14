function showLoader() {
  document.getElementById('loader').style.display = '';
  document.body.style.overflow = 'hidden';
}
function hideLoader() {
  document.getElementById('loader').style.display = 'none';
  document.body.style.overflow = 'auto';
}

const sidebarLinks = $('.nav-item a');

sidebarLinks.on('click', function () {
  const sectionToShow = $($(this).attr('href'));
  $('section').addClass('d-none');
  sectionToShow.removeClass('d-none');
  $('.navbar-hide').hide(500)
  $('.icon-x').hide(0)
  $('.icon').show(0)
});

$('.icon').on('click', function() {
  $('.navbar-hide').show(500);
  for (let i = 0; i < 5; i++) {
    $(".nav-item  a")
      .eq(i)
      .animate({
        top: 0,
      }, (i + 5) * 50);
  }
  $('.icon').hide(0);
  $('.icon-x').show(0);
});

$('.icon-x').on('click', function() {
  $('.navbar-hide').hide(500);
  $(".nav-item  a")
    .animate({
      top: 300,
    }, 200);
  $('.icon-x').hide(0);
  $('.icon').show(0);
});

$('#searchName').on('input', function () {
  searchMeal($('#searchName').val());
});

$('#searchLetter').on('input', function () {
  const inputValue = $('#searchLetter').val();
  if (inputValue.length === 1) {
    searchMealLetter(inputValue);
  } else {
    $('#searchLetter').val(inputValue.substring(0, 1));
  }
});

const hideBtn = document.getElementById('hideBtn');
hideBtn.addEventListener('click', () => {
  const getDetailsSection = document.getElementById('getDetails');
  getDetailsSection.classList.add('d-none');
  const sectionToShow = document.getElementById('rowData');
  sectionToShow.classList.remove('d-none');

});
const searchInputLetter = document.getElementById("searchLetter");
searchInputLetter.addEventListener('input', function () {
  const inputValue = searchInputLetter.value;
  if (inputValue.length === 1) {
    searchMealLetter(inputValue);
  } else {
    searchInputLetter.value = inputValue.substring(0, 1);
  }
});
function displayMealDetails(mealDetails) {
  if (mealDetails) {
    const getDetailsSection = document.getElementById('getDetails');
    getDetailsSection.classList.remove('d-none');

    document.getElementById('strSource').src = mealDetails.strMealThumb;
    document.getElementById('strMeal').textContent = mealDetails.strMeal;
    document.getElementById('strInstructions').textContent = mealDetails.strInstructions;
    document.getElementById('strArea').textContent = mealDetails.strArea;
    document.getElementById('strCategory').textContent = mealDetails.strCategory;
$('.navbar-hide').hide(500);
$('.icon-x').hide(0);
$('.icon').show(0);
    const recipes = [];
    for (let i = 1; i <= 20; i++) {
      if (mealDetails[`strIngredient${i}`] && mealDetails[`strMeasure${i}`]) {
        recipes.push(`${mealDetails[`strMeasure${i}`]} - ${mealDetails[`strIngredient${i}`]}`);
      }
    }
    const recipesHtml = recipes.map(recipe => `<span class="badge bg-info-subtle text-info text-opacity-75">${recipe}</span>`).join(' ');
    document.getElementById('strMeasure1').innerHTML = recipesHtml;
    document.getElementById('strTags').innerHTML = `<span class="badge bg-danger">${mealDetails.strTags}</span>`;
    document.getElementById('sourceBtn').href = mealDetails.strSource;
    document.getElementById('youtubeBtn').href = mealDetails.strYoutube;

    document.getElementById('rowData').classList.add('d-none');
  } else {
    console.error('Failed to retrieve meal details');
  }
}


async function getMealDetails(mealId) {
  try {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.meals[0];
  } catch (error) {
    console.error('Failed to retrieve meal details:', error);
    return null;
  }
}

async function getMeal(meal) {
  showLoader();
  try {
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
    const recipe = await api.json();
    const meals = recipe.meals;

    let cartona = "";
    meals.forEach(meal => {
      cartona += `
        <div class="item col-md-4 col-lg-3">
          <div data-id="${meal.idMeal}" role="button" class="meal-item overflow-hidden rounded-3 position-relative">
            <img src="${meal.strMealThumb}" class="w-100 " alt="${meal.strTags}" />
            <div class="overlay d-flex align-items-center justify-content-center text-black fw-bold">
              <p>${meal.strMeal}</p>
            </div>
          </div>
        </div>
      `
    });

    document.getElementById('rowData').innerHTML = cartona;

    const mealItemElements = document.querySelectorAll('.meal-item');
    mealItemElements.forEach(element => {
      element.addEventListener('click', async event => {
        const mealId = event.target.closest('.meal-item').getAttribute('data-id');
        const mealDetails = await getMealDetails(mealId);
        displayMealDetails(mealDetails);
      });
    });
  } catch (error) {
    console.error(error);
    document.getElementById('rowData').innerHTML = `<span class="text-danger fw-bold">Error: ${error.message}</span>`;
  } finally {
    hideLoader();
  }
}
getMeal("")

async function getCategories() {
  showLoader();
  try {
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    const recipe = await api.json();
    const categories = recipe.categories;
    let cartona = "";
    categories.forEach(category => {
      cartona += `
        <div class="item col-md-4 col-lg-3">
          <div data-category="${category.strCategory}" role="button" class="meal-Category overflow-hidden rounded-3 position-relative" >
            <img src="${category.strCategoryThumb}" class="w-100" alt="${category.strCategory}" />
            <div class="overlay d-flex flex-column p-2 text-center text-black">
              <h3 class="fs-4">${category.strCategory}</h3>
              <p class="overflow-hidden">${category.strCategoryDescription.substring(0, 110)}</p>
            </div>
          </div>
        </div>
      `;
    });

    document.getElementById('Categories').innerHTML = cartona;

    const categoryItems = document.querySelectorAll('.meal-Category');
    categoryItems.forEach(item => {
      item.addEventListener('click', async event => {
        const category = event.target.closest('.meal-Category').getAttribute('data-category');

        document.getElementById('Categories').classList.add('d-none');

        document.getElementById('CategoriesInfo').classList.remove('d-none');

        const categoryInfoHtml = await getCategoriesInfo(category);
        document.getElementById('CategoriesInfo').innerHTML = categoryInfoHtml;
      });
    });
  } catch (error) {
    console.error(error);
    document.getElementById('Categories').innerHTML = `<span class="text-danger fw-bold">Error: ${error.message}</span>`;
  } finally {
    hideLoader();
  }
}

getCategories()

async function getCategoriesInfo(category) {
  const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const categoriesInfo = data.meals;

    let CategoriesInfo = "";
    categoriesInfo.forEach(meal => {
      CategoriesInfo += `
      <div class="item col-md-4 col-lg-3">
        <div data-id="${meal.idMeal}" role="button" class="meal-item overflow-hidden rounded-3 position-relative">
          <img src="${meal.strMealThumb}" class="w-100 " alt="${meal.strMeal}" />
          <div class="overlay d-flex align-items-center justify-content-center text-black fw-bold">
            <p>${meal.strMeal}</p>
          </div>
        </div>
      </div>
    `;
    });
    document.getElementById('CategoriesInfo').innerHTML = CategoriesInfo;
    const categoriesInfoElement = document.getElementById('CategoriesInfo');
    categoriesInfoElement.addEventListener('click', async event => {
      if (event.target.closest('[data-id]')) {
        const mealId = event.target.closest('[data-id]').getAttribute('data-id');
        showLoader();
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const mealResponse = await api.json();
        const mealDetails = mealResponse.meals[0];
        displayMealDetails(mealDetails);
        categoriesInfoElement.classList.add('d-none');
        hideLoader();
      }
    });

    return CategoriesInfo;

  } catch (error) {
    console.error(error);
    return 'Error: ' + error.message;
  }
}

async function getAreaList() {
  showLoader();
  const api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
  const recipe = await api.json()
  const Areas = recipe.meals
  let cartona = ""
  Areas.forEach(Area => {
    cartona += `
<div class="item col-md-4 col-lg-3">
<div data-name="${Area.strArea}" class="text-white fw-bold d-flex flex-column  align-items-center" role="button" > 
<i class="fa-solid fa-house-laptop fa-5x"></i>
<span id="locationArea">${Area.strArea}</span>
</div>
</div>
      `
  })


  document.getElementById('Area').innerHTML = cartona;

  const areaElements = document.querySelectorAll('[data-name]');
  areaElements.forEach(element => {
    element.addEventListener('click', async event => {
      const areaName = event.target.closest('[data-name]').getAttribute('data-name');
      document.getElementById('Area').classList.add('d-none');
      document.getElementById('AreaMeals').classList.remove('d-none');
      await areaMeals(areaName);
    });
  });
  hideLoader();
}
getAreaList()

async function areaMeals(city) {
  showLoader();
  const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${city}`)
  const recipe = await api.json()
  const areaMeals = recipe.meals
  let cartona = "";
  areaMeals.forEach(meal => {
    cartona += `
      <div class="item col-md-4 col-lg-3">
        <div data-id="${meal.idMeal}" role="button" class="meal-item overflow-hidden rounded-3 position-relative">
          <img src="${meal.strMealThumb}" class="w-100 " alt="${meal.strMeal}" />
          <div class="overlay d-flex align-items-center justify-content-center text-black fw-bold">
            <p>${meal.strMeal}</p>
          </div>
        </div>
      </div>
    `;

  });

  document.getElementById('AreaMeals').innerHTML = cartona;
  document.body.style.overflow = 'auto';

  const mealItemElements = document.querySelectorAll('.meal-item');
  mealItemElements.forEach(element => {
    element.addEventListener('click', async event => {
      const mealId = event.target.closest('.meal-item').getAttribute('data-id');
      showLoader();
      const api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const mealResponse = await api.json();
      const mealDetails = mealResponse.meals[0];
      displayMealDetails(mealDetails);
      document.getElementById('AreaMeals').classList.add('d-none');
      hideLoader();
    });
  });
}
hideLoader();
async function getIngredients() {
  showLoader();
  try {
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    const recipe = await api.json();
    const ingredients = recipe.meals;

    let cartona = "";

    ingredients.slice(0, 20).forEach(ingredient => {
      cartona += `
          <div class="item col-md-4 col-lg-3 ">
          <div data-Ingredients="${ingredient.strIngredient}" class="text-white ingredients d-flex flex-column text-center align-items-center"  role="button">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <span class="fw-bold">  ${ingredient.strIngredient}</span>
  
            <p class="pt-2">
              ${ingredient.strDescription.substring(0, 130)}...
            </p>
          </div>
          </div>
        `;
    });
    document.getElementById('Ingredients').innerHTML = cartona;
    const ingredientElements = document.querySelectorAll('.ingredients');
    ingredientElements.forEach(element => {
      element.addEventListener('click', async event => {
        const ingredients = event.target.closest(".ingredients").getAttribute('data-Ingredients')
        console.log(ingredients);

        if (ingredients) {
          try {
            const meals = await getMealsByIngredient(ingredients);
            displayMeals(meals);
            document.getElementById('Ingredients').classList.add('d-none'); 
            document.getElementById('IngredientsMeal').classList.remove('d-none'); 
          } catch (error) {
            console.error('Failed to retrieve meals:', error);
          }
        } else {
          console.error('Ingredient not found');
        }
      });
    });
  } catch (error) {
    console.error('Failed to retrieve ingredients:', error);
  } finally {
    hideLoader();
  }
}
getIngredients()
async function getMealsByIngredient(ingredients) {
  showLoader();
  try {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
}

function displayMeals(meals) {
  let mealHtml = '';
  meals.forEach(meal => {
    mealHtml += `
        <div class="item col-md-4 col-lg-3">
          <div data-id="${meal.idMeal}" role="button" class="meal-item overflow-hidden rounded-3 position-relative">
            <img src="${meal.strMealThumb}" class="w-100" alt="${meal.strMeal}" />
            <div class="overlay d-flex align-items-center justify-content-center text-black fw-bold">
              <p>${meal.strMeal}</p>
            </div>
          </div>
        </div>
      `;
  });
  document.getElementById('IngredientsMeal').innerHTML = mealHtml;
  const mealItemElements = document.querySelectorAll('.meal-item');
  mealItemElements.forEach(element => {
    element.addEventListener('click', async event => {
      const mealId = event.target.closest('.meal-item').getAttribute('data-id');
      showLoader();
      const api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const mealResponse = await api.json();
      const mealDetails = mealResponse.meals[0];
      displayMealDetails(mealDetails);
      document.getElementById('IngredientsMeal').classList.add('d-none')
      hideLoader();
    });
  });
}


async function searchMeal(meal) {
  showLoader();
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
    const recipe = await response.json();
    renderMealList(recipe.meals);
  } catch (error) {
    console.error('Failed to retrieve meal data:', error);
  } finally {
    hideLoader();
  }
}

async function searchMealLetter(meal) {
  showLoader();
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${meal}`);
    const recipe = await response.json();
    renderMealList(recipe.meals);
  } catch (error) {
    console.error('Failed to retrieve meal data:', error);
  } finally {
    hideLoader();
  }
}

function renderMealList(meals) {
  if (!meals) {
    document.getElementById('rowData2').innerHTML = `<span class="text-danger fw-bold">No meals found.</span>`;
    return;
  }

  const mealHtml = meals.map(meal => {
    return `
      <div class="item col-md-4 col-lg-3">
        <div data-id="${meal.idMeal}" role="button" class="meal-item overflow-hidden rounded-3 position-relative">
          <img src="${meal.strMealThumb}" class="w-100 " alt="${meal.strTags}" />
          <div class="overlay d-flex align-items-center justify-content-center text-black fw-bold">
            <p>${meal.strMeal}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('rowData2').innerHTML = mealHtml;

  const mealItemElements = document.querySelectorAll('.meal-item');
  mealItemElements.forEach(element => {
    element.addEventListener('click', async event => {
      const mealId = event.target.closest('.meal-item').getAttribute('data-id');
      try {
        const mealDetails = await getMealDetails(mealId);
        renderMealDetails(mealDetails);
      } catch (error) {
        console.error('Failed to retrieve meal details:', error);
      }
    });
  });
}
function renderMealDetails(mealDetails) {
  displayMealDetails(mealDetails);
  const searchSection = document.getElementById('Search');
  searchSection.classList.add('d-none');
  document.getElementById('rowData2').classList.add('d-none');
}
const form = document.querySelector('form');
const inputs = form.querySelectorAll('input');
const alerts = form.querySelectorAll('.alert');
const submitButton = form.querySelector('#submitButton');

inputs.forEach((input) => {
  input.addEventListener('input', (e) => {
    const inputValue = e.target.value;
    const inputId = e.target.id;
    let isValid = true;

    switch (inputId) {
      case 'nameInput':
        const nameRegex = /^[A-Z][a-z]+$/;
        if (!nameRegex.test(inputValue)) {
          isValid = false;
        }
        break;
      case 'emailInput':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(inputValue)) {
          isValid = false;
        }
        break;
      case 'telInput':
        const telRegex = /^\d{11}$/;
        if (!telRegex.test(inputValue)) {
          isValid = false;
        }
        break;
      case 'numberInput':
        const numberRegex = /^(?:1[8-9]|[2-9][0-9]|100)$/;
        if (!numberRegex.test(inputValue)) {
          isValid = false;
        }
        break;
      case 'passwordInput':
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
        if (!passwordRegex.test(inputValue)) {
          isValid = false;
        }
        break;
      case 'Re-passwordInput':
        const rePasswordInputValue = document.querySelector('#passwordInput').value;
        if (inputValue !== rePasswordInputValue) {
          isValid = false;
        }
        break;
      default:
        break;
    }

    if (!isValid) {
      const alert = form.querySelector(`#${inputId}Alert`);
      alert.classList.remove('d-none');
      input.classList.remove('is-valid');

    } else {
      const alert = form.querySelector(`#${inputId}Alert`);
      alert.classList.add('d-none');
      input.classList.add('is-valid');
    }

    let allValid = true;
    Array.from(inputs).every((input) => {
      const inputValue = input.value;
      const inputId = input.id;
      let isValid = true;

      switch (inputId) {
        case 'nameInput':
          const nameRegex = /^[A-Z][a-z]+$/;
          if (!nameRegex.test(inputValue)) {
            isValid = false;
          }
          break;
        case 'emailInput':
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(inputValue)) {
            isValid = false;
          }
          break;
        case 'telInput':
          const telRegex = /^\d{11}$/;
          if (!telRegex.test(inputValue)) {
            isValid = false;
          }
          break;
        case 'numberInput':
          const numberRegex = /^(?:1[8-9]|[2-9][0-9]|100)$/;
          if (!numberRegex.test(inputValue)) {
            isValid = false;
          }
          break;
        case 'passwordInput':
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
          if (!passwordRegex.test(inputValue)) {
            isValid = false;
          }
          break;
        case 'Re-passwordInput':
          const rePasswordInputValue = document.querySelector('#passwordInput').value;
          if (inputValue !== rePasswordInputValue) {
            isValid = false;
          }
          break;
        default:
          break;
      }

      if (!isValid) {
        allValid = false;
      }

      return isValid;
    });

    if (allValid) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  });
});inputs.forEach((input) => {
  input.addEventListener('input', (e) => {
    const inputValue = e.target.value;
    const inputId = e.target.id;
    let isValid = true;

    switch (inputId) {
      case 'nameInput':
        const nameRegex = /^[A-Z][a-z]+$/;
        if (!nameRegex.test(inputValue)) {
          isValid = false;
        }
        break;
      case 'emailInput':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(inputValue)) {
          isValid = false;
        }
        break;
      case 'telInput':
        const telRegex = /^\d{11}$/;
        if (!telRegex.test(inputValue)) {
          isValid = false;
        }
        break;
      case 'numberInput':
        const numberRegex = /^(?:1[8-9]|[2-9][0-9]|100)$/;
        if (!numberRegex.test(inputValue)) {
          isValid = false;
        }
        break;
      case 'passwordInput':
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
        if (!passwordRegex.test(inputValue)) {
          isValid = false;
        }
        break;
      case 'Re-passwordInput':
        const rePasswordInputValue = document.querySelector('#passwordInput').value;
        if (inputValue !== rePasswordInputValue) {
          isValid = false;
        }
        break;
      default:
        break;
    }

    if (!isValid) {
      const alert = form.querySelector(`#${inputId}Alert`);
      alert.classList.remove('d-none');
      input.classList.remove('is-valid');

    } else {
      const alert = form.querySelector(`#${inputId}Alert`);
      alert.classList.add('d-none');
      input.classList.add('is-valid');
    }

    let allValid = true;
    Array.from(inputs).every((input) => {
      const inputValue = input.value;
      const inputId = input.id;
      let isValid = true;

      switch (inputId) {
        case 'nameInput':
          const nameRegex = /^[A-Z][a-z]+$/;
          if (!nameRegex.test(inputValue)) {
            isValid = false;
          }
          break;
        case 'emailInput':
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(inputValue)) {
            isValid = false;
          }
          break;
        case 'telInput':
          const telRegex = /^\d{11}$/;
          if (!telRegex.test(inputValue)) {
            isValid = false;
          }
          break;
        case 'numberInput':
          const numberRegex = /^(?:1[8-9]|[2-9][0-9]|100)$/;
          if (!numberRegex.test(inputValue)) {
            isValid = false;
          }
          break;
        case 'passwordInput':
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
          if (!passwordRegex.test(inputValue)) {
            isValid = false;
          }
          break;
        case 'Re-passwordInput':
          const rePasswordInputValue = document.querySelector('#passwordInput').value;
          if (inputValue !== rePasswordInputValue) {
            isValid = false;
          }
          break;
        default:
          break;
      }

      if (!isValid) {
        allValid = false;
      }

      return isValid;
    });

    if (allValid) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  });
});
