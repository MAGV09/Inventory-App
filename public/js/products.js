const productsContainer = document.querySelector('#products-container');

productsContainer.addEventListener('click', async (e) => {
  if (e.target.classList.contains('del-product-btn')) {
    const id = e.target.dataset.id;
    console.log(id);
    const response = await fetch(`/products/delete/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to perform operation');
    }
    const data = await response.json();
    window.location.href = `${data.redirect}`;
  }
});
