function initApp() {
    const showAllBtn = document.querySelector('#show-all-btn')
    const showActiveBtn = document.querySelector('#show-active-btn')
    const showInactiveBtn = document.querySelector('#show-inactive-btn')

    showAllBtn.addEventListener('click', showAllExtensions)
    showActiveBtn.addEventListener('click', showActiveExtensions)
    showInactiveBtn.addEventListener('click', showInactiveExtensions)

    const result = document.querySelector('.extensions')

    const STATUS = {
        SHOW_ALL: true,
        SHOW_ACTIVE: false,
        SHOW_INACTIVE: false,
    }

    let extensions = []
    let onScreenExtensions = []

    if(result) {
        getExtensions()
    }

    function getExtensions() {
        fetch('/assets/data/data.json')
            .then( resp => resp.json())
            .then( res => showHtmlExtensions(res))
    }

    function showHtmlExtensions(data) {
        if(STATUS.SHOW_ALL) {
            extensions = data
        }

        onScreenExtensions = data

        if(STATUS.SHOW_ALL && onScreenExtensions.length === 0) {
            const message = document.createElement('P')
            message.textContent = 'You not have extensions'
            message.classList.add('message')
            result.appendChild(message)
        }

        if(STATUS.SHOW_ACTIVE && onScreenExtensions.length === 0) {
            const message = document.createElement('P')
            message.textContent = 'You have not actived extensions'
            message.classList.add('message')
            result.appendChild(message)
        }

        if(STATUS.SHOW_INACTIVE && onScreenExtensions.length === 0) {
            const message = document.createElement('P')
            message.textContent = 'You have activated all extensions'
            message.classList.add('message')
            result.appendChild(message)
        }

        onScreenExtensions.forEach(el => {
            const card = document.createElement('DIV')
            card.classList.add('extension')
            card.id = el.id

            const top = document.createElement('DIV')
            top.classList.add('extension__top')

            const imageDiv = document.createElement('DIV')

            const image = document.createElement('IMG')
            image.src = `/assets/images/${el.image}`
            image.alt = `${el.name}`
            imageDiv.appendChild(image)
            top.appendChild(imageDiv)

            const infoDiv = document.createElement('DIV')
            const title = document.createElement('H2')
            title.classList.add('extension__title')

            const description = document.createElement('P')
            description.classList.add('extension__description')

            title.textContent = `${el.name}`
            description.textContent = `${el.description}`
            infoDiv.appendChild(title)
            infoDiv.appendChild(description)
            top.appendChild(infoDiv)
            card.appendChild(top)

            const bottom = document.createElement('DIV')
            bottom.classList.add('extension__bottom')

            const button = document.createElement('BUTTON')
            button.classList.add('extension__btn')
            button.textContent = 'Remove'
            bottom.appendChild(button)
            button.onclick = () => {
                removeExtension(el.id)
            }

            const switchLabel = document.createElement('LABEL')
            switchLabel.classList.add('toggle')
            switchLabel.for = `toggle-${el.id}`

            
            const switchInput = document.createElement('INPUT')
            switchInput.classList.add('toggle__input')
            switchInput.id = `toggle-${el.id}`
            switchInput.type = 'checkbox'
            switchInput.checked = el.active || false
            changeSwitchBg(switchInput.checked, switchLabel)

            switchLabel.appendChild(switchInput)

            switchInput.onchange = () => {
                changeSwitchBg(switchInput.checked, switchLabel)
                toggleSwitch(el.id, switchInput.checked)
            }

            const toggle = document.createElement('DIV')
            toggle.classList.add('toggle__circle')
            switchLabel.appendChild(toggle)

            bottom.appendChild(switchLabel)

            card.appendChild(bottom)

            result.appendChild(card)

        });


    }

    function showAllExtensions() {
        STATUS.SHOW_ALL = true
        STATUS.SHOW_ACTIVE = false
        STATUS.SHOW_INACTIVE = false
        
        showAllBtn.classList.add('navigation__btn--active')
        showActiveBtn.classList.remove('navigation__btn--active')
        showInactiveBtn.classList.remove('navigation__btn--active')

        cleanHtml(result)
        showHtmlExtensions(extensions)
    }

    function showActiveExtensions() {
        STATUS.SHOW_ALL = false
        STATUS.SHOW_ACTIVE = true
        STATUS.SHOW_INACTIVE = false

        showAllBtn.classList.remove('navigation__btn--active')
        showActiveBtn.classList.add('navigation__btn--active')
        showInactiveBtn.classList.remove('navigation__btn--active')

        cleanHtml(result)
        const updatedData = extensions.filter(el => el.active)
        showHtmlExtensions(updatedData)
    }

    function showInactiveExtensions() {
        STATUS.SHOW_ALL = false
        STATUS.SHOW_ACTIVE = false
        STATUS.SHOW_INACTIVE = true

        showAllBtn.classList.remove('navigation__btn--active')
        showActiveBtn.classList.remove('navigation__btn--active')
        showInactiveBtn.classList.add('navigation__btn--active')

        cleanHtml(result)
        const updatedData = extensions.filter(el => !el.active)
        showHtmlExtensions(updatedData)
    }

    function toggleSwitch(id, notChecked) {
        let updatedData = []
        let updatedOnScreenData = []

        if(notChecked) {
            if(STATUS.SHOW_INACTIVE) {
                cleanHtml(result)
                updatedOnScreenData = onScreenExtensions.map(el => {
                    if(el.id === id) {
                        return {...el, active: true}
                    } else {
                        return {...el}
                    }
                })
                onScreenExtensions = updatedOnScreenData.filter(el => !el.active)
                showHtmlExtensions(onScreenExtensions)
                
            }

            updatedData = extensions.map(el => {
                if(el.id === id) {
                    return {...el, active: true}
                } else {
                    return {...el}
                }
            })
        } else {
            if(STATUS.SHOW_ACTIVE) {
                cleanHtml(result)
                updatedOnScreenData = onScreenExtensions.map(el => {
                    if(el.id === id) {
                        return {...el, active: false}
                    } else {
                        return {...el}
                    }
                })

                onScreenExtensions = updatedOnScreenData.filter(el => el.active)
                
                showHtmlExtensions(onScreenExtensions)
            }
            updatedData = extensions.map(el => {
                if(el.id === id) {
                    return {...el, active: false}
                } else {
                    return {...el}
                }
            })
        }

        extensions = updatedData
        
    }

    function changeSwitchBg(checked, label) {
        if(checked) {
            label.classList.add('toggle--active')
        } else {
            label.classList.remove('toggle--active')
        }
    }

    function removeExtension(id) {
        cleanHtml(result)
        const updatedData = extensions.filter(el => el.id !== id)
        const updatedOnScreenData = onScreenExtensions.filter(el => el.id !== id)
        extensions = updatedData
        onScreenExtensions = updatedOnScreenData
        showHtmlExtensions(updatedOnScreenData)
    }

    function cleanHtml(selector) {
        while(selector.firstChild) {
            selector.removeChild(selector.firstChild)
        }
    }
}
document.addEventListener('DOMContentLoaded', initApp)