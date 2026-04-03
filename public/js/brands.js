const brandsContainer = document.querySelector('#brands-container');
const updateBrandForm = document.querySelector('#update-brand-form');

brandsContainer?.addEventListener('click', async (e) => {
  if (e.target.classList.contains('del-brand-btn')) {
    const id = e.target.dataset.id;
    try {
      const response = await fetch(`/brands/${id}/delete`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to perform operation');
      }
      const data = await response.json();
      window.location.href = `${data.redirect}`;
    } catch (err) {
      console.log(err);
    }
  }
});

updateBrandForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = updateBrandForm.dataset.id;
  const formData = new FormData(updateBrandForm);
  try {
    const response = await fetch(`/brands/${id}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error('Failed to perform operation');
    }

    window.location.href = `${data.redirect}`;
  } catch (err) {
    console.log(err);
  }
});
