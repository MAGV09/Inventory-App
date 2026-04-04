const productsContainer = document.querySelector('#products-container');
const updateProductForm = document.querySelector('#update-product-form');

productsContainer?.addEventListener('click', async (e) => {
  if (e.target.classList.contains('del-product-btn')) {
    const id = e.target.dataset.id;
    try {
      const response = await fetch(`/products/delete/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to perform operation');
      const data = await response.json();
      window.location.href = data.redirect;
    } catch (err) {
      console.log(err);
    }
  }
});

updateProductForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = updateProductForm.dataset.id;
  const formData = new FormData(updateProductForm);
  try {
    const response = await fetch(`/products/update/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    if (!response.ok) throw new Error('Failed to perform operation');
    const data = await response.json();
    window.location.href = data.redirect;
  } catch (err) {
    console.log(err);
  }
});
