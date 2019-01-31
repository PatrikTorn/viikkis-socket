function insert($vm, prefix, hint = '', subfix = '') {
    const value = $vm.value
    if ($vm.selectionStart || $vm.selectionStart === 0) {
        let start = $vm.selectionStart
        let end = $vm.selectionEnd

        const restoreTop = $vm.scrollTop

        if (start === end) {
            $vm.value =
                value.substring(0, start) +
                prefix +
                hint +
                subfix +
                value.substring(end, value.length)
            $vm.selectionStart = start + prefix.length
            $vm.selectionEnd = end + prefix.length + hint.length
        } else {
            $vm.value =
                value.substring(0, start) +
                prefix +
                value.substring(start, end) +
                subfix +
                value.substring(end, value.length)
            $vm.selectionStart = start + prefix.length
            $vm.selectionEnd = end + prefix.length
        }

        $vm.focus()
        if (restoreTop >= 0) {
            $vm.scrollTop = restoreTop
        }
    }
}

const toolbar = {
    h1($vm) {
        insert($vm, '# ', 'Iso otsikko')
    },
    h2($vm) {
        insert($vm, '## ', 'Keskikokoinen otsikko')
    },
    h3($vm) {
        insert($vm, '### ', 'Pieni otsikko')
    },
    bold($vm) {
        insert($vm, '**', 'Lihavoitu teksti', '**')
    },
    italic($vm) {
        insert($vm, '*', 'Kursivoitu teksti', '*')
    },
    image($vm) {
        insert($vm, '![Kuvan vaihtoehtoinen teksti jos kuva ei toimi](', 'https://indecs.fi/indecs-fi/wp-content/uploads/2019/01/Indecs_logo_teksti.png', ')')
    },
    link($vm) {
        insert($vm, '[FB-tapahtuma](', 'http://www.facebook.com', ')')
    },
    linkButton($vm) {
        insert($vm, '?[FB-tapahtuma](', 'http://www.facebook.com', ')')
    },
    code($vm) {
        insert($vm, '```\n', 'Lainaus', '\n```')
    },
    list($vm) {
        insert($vm, 'Lista 1  \nLista 2  \n', 'Lista 3', '  ')
    },
    listUl($vm) {
        insert($vm, '- Lista 1\n- Lista 2\n- ', 'Lista 3')
    },
    listOl($vm) {
        insert($vm, '1. Lista 1\n2. Lista 2\n', '3. Lista 3')
    },
    table($vm) {
        insert($vm, '| Otsikko 1 | Otsikko 2 | Otsikko 3 |\n | - | - | - | \n| ', 'tähän', ' | tulee | sisältö |\n| toisen | rivin | sisältö |')
    },
    tab($vm) {
        insert($vm, '  ')
    }
}

export default ($vm, type) => {
    return toolbar[type]($vm)
}
