const categoriesContainer = document.querySelector('#categories-container');
const updateCategoryForm = document.querySelector('#update-category-form');

categoriesContainer?.addEventListener('click', async (e) => {
  if (e.target.classList.contains('del-category-btn')) {
    const id = e.target.dataset.id;
    try {
      const response = await fetch(`/categories/${id}/delete`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to perform operation');
      }
      const data = await response.json();
      window.location.href = data.redirect;
    } catch (err) {
      console.log(err);
    }
  }
});

updateCategoryForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = updateCategoryForm.dataset.id;
  const formData = new FormData(updateCategoryForm);
  try {
    const response = await fetch(`/categories/${id}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    const data = await response.json();
    if (!response.ok) throw new Error('Failed to perform operation');
    window.location.href = data.redirect;
  } catch (err) {
    console.log(err);
  }
});
