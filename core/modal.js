function defineModal() {
  const modal = select('#modal');
  const modalTitle = select('#modal-title');
  const modalGames = select('#modal-games');
  const modalDescription = select('#modal-description');
  const modalCloseButton = select('#modal-close');
  modalCloseButton.mousePressed(modalClose);


  function modalOpen({ name, games, description }) {
    modalTitle.elt.innerHTML = name;
    modalGames.elt.innerHTML = games;
    modalDescription.elt.innerHTML = description;

    modal.elt.style.display = 'flex';
  }

  function modalClose() {
    modal.elt.style.display = 'none';
  }

  return { modal, modalTitle, modalDescription, modalGames, modalCloseButton, modalClose, modalOpen };
};