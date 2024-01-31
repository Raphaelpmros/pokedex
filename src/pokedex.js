const next = document.querySelector("#buttonNext");
const form = document.querySelector("#formPokemon");
const input = document.querySelector(".inputSearch");
const shiny = document.querySelector("#buttonShiny");
const pokeStatus = document.querySelector("#buttonStatus");
const search = document.querySelector("#searchButton");
const pokeName = document.querySelector(".pokemonName");
const pokeImage = document.querySelector(".pokemonImage");
const previous = document.querySelector("#buttonPrevious");
const pokeNumber = document.querySelector(".pokemonNumber");

let searchPokemon = 1;

let shinyClick = false;

let shinyEventListener = null;

const fetchPokemon = async (pokemon) => {
  pokeName.innerHTML = "Loading...";
  pokeNumber.innerHTML = "";
  const APIResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon}`
  );

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
};

const renderPokemon = async (pokemon) => {
  const data = await fetchPokemon(pokemon);

  if (data && pokemon < 650) {
    pokeName.innerHTML = data.name;
    pokeNumber.innerHTML = data.id;
    pokeImage.src =
      data["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
        "front_default"
      ];
    searchPokemon = data.id;

    if (shinyEventListener) {
      shiny.removeEventListener("click", shinyEventListener);
    }

    shinyEventListener = function () {
      if (!shinyClick) {
        pokeImage.src =
          data["sprites"]["versions"]["generation-v"]["black-white"][
            "animated"
          ]["front_shiny"];
        shinyClick = true;
      } else {
        pokeImage.src =
          data["sprites"]["versions"]["generation-v"]["black-white"][
            "animated"
          ]["front_default"];
        shinyClick = false;
      }
    };

    shiny.addEventListener("click", shinyEventListener);

    shiny.addEventListener("click", shinyEventListener);

    const pokemonInfo = {
      number: data.id,
      name: data.name,
      image:
        data["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
          "front_default"
        ],
      height: data.height * 10 + " cm",
      weight: data.weight / 10 + " kg",
      types: data.types.map((type) => type.type.name),
      abilities: data.abilities.map((ability) => ability.ability.name),
      moves: data.moves.map((move) => move.move.name),
    };

    pokeStatus.addEventListener("click", () => {
      showModal(pokemonInfo);
      modal.show();
    });
    if (pokeName.textContent.length > 10) {
      pokeName.style.fontSize = "1.5rem";
    }
  } else {
    pokeName.innerHTML = "Ash didn't found this pokemon yet";
    pokeNumber.innerHTML = "";
    pokeImage.src = "assets/img/Ash.gif";
    pokeName.style.fontSize = "1rem";
    pokeStatus.disabled = true;
    shiny.disable = true;
    if (shinyEventListener) {
      shiny.removeEventListener("click", shinyEventListener);
    }

    shinyEventListener = function () {
      console.log("Pokémon não encontrado. Botão shiny desativado.");
    };

    shiny.addEventListener("click", shinyEventListener);
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
  input.value = "";
  shinyClick = false;
});

next.addEventListener("click", () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
  shinyClick = false;
});

previous.addEventListener("click", () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
    shinyClick = false;
  }
});

search.addEventListener("click", () => {
  if (input.value) {
    form.dispatchEvent(new Event("submit"));
    shinyClick = false;
  }
});

const modal = new bootstrap.Modal(document.getElementById("pokemonModal"), {
  keyboard: false,
});

function showModal(pokemon) {
  const modalLabel = document.getElementById("modalLabel");
  const modalImage = document.getElementById("modalImage");
  const modalHeight = document.getElementById("modalHeight");
  const modalWeight = document.getElementById("modalWeight");
  const modalTypes = document.getElementById("modalTypes");
  const modalAbilities = document.getElementById("modalAbilities");
  const modalMoves = document.getElementById("modalMoves");

  modalLabel.textContent = `${pokemon.number} - ${pokemon.name}`;
  modalImage.src = pokemon.image;
  modalHeight.textContent = pokemon.height;
  modalWeight.textContent = pokemon.weight;
  modalTypes.textContent = pokemon.types.join(", ");
  modalAbilities.textContent = pokemon.abilities.join(", ");
  modalMoves.textContent = pokemon.moves.join(", ");

  modal.show();
}

renderPokemon(searchPokemon);
