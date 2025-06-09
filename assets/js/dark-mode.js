function darkMode() {
    const btn = document.querySelector('.header__btn')
    btn.addEventListener('click', () => {
        const btnLogo = document.querySelector('.button__logo')
        const head = document.querySelector('head')
        const logo = document.querySelector('.header__logo')

        const link = document.createElement('LINK')
        link.rel = 'stylesheet'
        link.href = '/assets/css/dark.css'
        link.id = 'dark'
        
        if(btn.getAttribute('data-theme') === 'light') {
            logo.src = '/assets/images/logo-dark.svg'

            btn.setAttribute('data-theme', 'dark')
            btnLogo.src = '/assets/images/icon-sun.svg'
            btnLogo.alt = 'icon sun'

            head.appendChild(link)
        } else {
            logo.src = '/assets/images/logo.svg'

            btn.setAttribute('data-theme', 'light')
            btnLogo.src = '/assets/images/icon-moon.svg'
            btnLogo.alt = 'icon moon'

            head.removeChild(document.querySelector('#dark'))
        }
    })
}
document.addEventListener('DOMContentLoaded', darkMode)