const vendorsContainer = document.querySelector('#vendors-container');
const updateVendorForm = document.querySelector('#update-vendor-form');

vendorsContainer?.addEventListener('click', async (e) => {
  if (e.target.classList.contains('del-vendor-btn')) {
    const id = e.target.dataset.id;
    try {
      const response = await fetch(`/vendors/${id}/delete`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to perform operation');
      const data = await response.json();
      window.location.href = data.redirect;
    } catch (err) {
      console.log(err);
    }
  }
});

updateVendorForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = updateVendorForm.dataset.id;
  const formData = new FormData(updateVendorForm);
  try {
    const response = await fetch(`/vendors/${id}/update`, {
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
