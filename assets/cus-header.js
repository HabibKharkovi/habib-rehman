document.addEventListener('DOMContentLoaded', function() {
    const toggleMenu = document.querySelectorAll('[js-toggle-menu-btn]')
      toggleMenu.forEach(btn => {
        btn.addEventListener('click', function({currentTarget}) {
            const headerWrapper = currentTarget.closest('[js-header-wrapper]')
            headerWrapper.classList.toggle('open')
        });
      })
})