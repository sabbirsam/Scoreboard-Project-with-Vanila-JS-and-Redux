const initialState = {
    matches: [],
    count: 0,
    
  };

  function reducer(state = initialState, action) {
    switch (action.type) {
      case "ADD_MATCH":
        return {
          ...state,
          matches: [...state.matches, { id: state.count , result: 1}],
          count: state.count + 1,
        };
      case "REMOVE_MATCH":
        const matchIdToRemove = action.payload;
        const remoedUpdatedMatches = state.matches.filter(
          (match) => match.id !== matchIdToRemove
        );
        return { 
          ...state, 
          matches: remoedUpdatedMatches 
        };
      case "ADD_INCREMENT":
        const { matchIndex, incrementValue } = action.payload;
        const updatedMatches = state.matches.map((match, index) => {
          if (index === matchIndex && match.result) {
            match.result += incrementValue;
          }
          return match;
        });
        return {
          ...state,
          matches: updatedMatches,
        };  

      case "ADD_DECREMENT":
        const { matchIndexdecrement, decrementValue } = action.payload;
        const updateddecrementMatches = state.matches.map((match, index) => {
          if (index === matchIndexdecrement && match.result) {
            match.result -= decrementValue;
          }
          return match;
        });
        return {
          ...state,
          matches: updateddecrementMatches,
      };

      case "RESET":
        // return initialState;
        const resetMatches = state.matches.map(match => ({ ...match, result: 120 }));
        return {
          ...state,
          matches: resetMatches,
        };

      default:
        return state;
    }
  }
  const store = Redux.createStore(reducer);

  // Define the event handlers
  function handleAddMatch() {
    store.dispatch({ type: "ADD_MATCH" });
  }
  //Define the handle submit form
  function handleIncrementFormSubmit(event) {
    event.preventDefault();
    const incrementForm = event.target;
    const incrementInput = incrementForm.elements["increment"];
    const incrementValue = parseInt(incrementInput.value);
    const matchIndexString = incrementForm.getAttribute("data-match-id");
    const matchIndex = parseInt(matchIndexString, 10);
    console.log("matchIndexString:", matchIndexString);
    console.log("matchIndex:", matchIndex);
    console.log("incrementValue:", incrementValue);

    store.dispatch({ 
      type: "ADD_INCREMENT", 
      payload: { matchIndex, incrementValue } 
    });
    incrementInput.value = "";
  }
  function handleDecrementFormSubmit(event) {
    event.preventDefault();
    const decrementForm = event.target;
    const decrementInput = decrementForm.elements["decrement"];
    const decrementValue = parseInt(decrementInput.value);
    const matchIndexString = decrementForm.getAttribute("data-match-id");
    const matchIndexdecrement = parseInt(matchIndexString, 10);
    console.log("matchIndexString:", matchIndexString);
    console.log("matchIndex:", matchIndexdecrement);
    console.log("decrementValue:", decrementValue);

    store.dispatch({ type: "ADD_DECREMENT", payload: { matchIndexdecrement, decrementValue } });
    decrementInput.value = "";
  }

  //Reset
  function handleReset() {
    store.dispatch({ type: "RESET" });
  }



  // Render the matches
  function renderMatches(matches) {
    const container = document.getElementById("matches-container");
    container.innerHTML = "";
    matches.forEach((match) => {
      const matchElem = document.createElement("div");
      matchElem.className = "match";
      matchElem.innerHTML = `
          <div class="wrapper">
          <button class="lws-delete" data-match-id="${match.id}">
            <img src="./image/delete.svg" alt="" />
          </button>
          <h3 class="lws-matchName">Match ${match.id + 1}</h3>
        </div>
        <div class="inc-dec">
          <form class="incrementForm" data-match-id="${match.id}">
            <h4>Increment</h4>
            <input type="number" name="increment" class="lws-increment" />
          </form>
          <form class="decrementForm" data-match-id="${match.id}">
            <h4>Decrement</h4>
            <input type="number" name="decrement" class="lws-decrement" />
          </form>
        </div>
        <div class="numbers">
          <h2 class="lws-singleResult">${match.result}</h2>
        </div>
      `;
      //Increment
      const incrementForm = matchElem.querySelector(".incrementForm");
      incrementForm.addEventListener("submit", handleIncrementFormSubmit);
      //Decrement
      const decrementForm = matchElem.querySelector(".decrementForm");
      decrementForm.addEventListener("submit", handleDecrementFormSubmit);
     

      //delete
      const deleteButton = matchElem.querySelector(".lws-delete");
      deleteButton.addEventListener("click", () => {
        const matchId = parseInt(deleteButton.dataset.matchId);
        store.dispatch({ type: "REMOVE_MATCH", payload: matchId });
      });

      
      //APPEND all
      container.appendChild(matchElem);

     

    });
  }

  // Subscribe to the store and render initial matches.
  store.subscribe(() => {
    const matches = store.getState().matches;
    renderMatches(matches);
  });
  store.dispatch({ type: "ADD_MATCH" }); // To show on page load

  // Attach the event handlers
  const addMatchButton = document.getElementById("add-match-btn");
  addMatchButton.addEventListener("click", handleAddMatch);

  //Reset
  const resetButton = document.getElementById("reset-btn");
  resetButton.addEventListener("click", handleReset);

  /* const deleteButton = matchElem.querySelector(".lws-delete");
  deleteButton.addEventListener("click", () => {
    const matchId = parseInt(deleteButton.dataset.matchId);
    store.dispatch({ type: "REMOVE_MATCH", payload: matchId });
  }); */

