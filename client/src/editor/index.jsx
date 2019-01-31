import React from 'react'
import './index.scss'
import classNames from 'classnames'
import marked from '../helpers/marked'
import textInsert from '../helpers/insertText'
import keydownListen from '../helpers/keydownListen'
import 'highlight.js/styles/tomorrow.css'
import '../fonts/iconfont.css'

class MdEditor extends React.Component {
    constructor(props) {
        super(props)

        this.$vm = null
        this.handleEditorRef = $vm => {
            this.$vm = $vm;
        }

        this.state = {
            preview: window.innerWidth < 700 ? false : true,
            expand: false,
            f_history: [],
            f_history_index: 0,
            line_index: 1,
            height:600,
            width:1000
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    static defaultProps = {
        placeholder: '',
        lineNum: true,
        defaultValue:''
    }

    componentDidMount() {
        keydownListen(this);
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUpdate(props, state) {
        const { f_history } = this.state
        if (props.value && state.f_history.length === 0) {
            f_history.push(props.value)
            this.setState({
                f_history
            })
            this.handleLineIndex(props.value)
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleChange = e => {
        const value = e.target.value
        this.saveHistory(value)
        this.props.onChange(value)
    }

    insert = e => {
        const { $vm } = this
        const type = e.currentTarget ? e.currentTarget.getAttribute('data-type') : e
        textInsert($vm, type)
        this.props.onChange($vm.value)
        this.saveHistory($vm.value)
    }

    saveHistory(value) {
        let { f_history, f_history_index } = this.state
        window.clearTimeout(this.currentTimeout)
        this.currentTimeout = setTimeout(() => {

            if (f_history_index < f_history.length - 1) {
                f_history.splice(f_history_index + 1)
            }

            if (f_history.length >= 20) {
                f_history.shift()
            }

            f_history_index = f_history.length
            f_history.push(value)
            this.setState({
                f_history,
                f_history_index
            })
        }, 500)

        this.handleLineIndex(value)
    }

    handleLineIndex(value) {
        const line_index = value ? value.split('\n').length : 1
        this.setState({
            line_index: line_index
        })
    }

    undo = () => {
        const { f_history } = this.state
        let { f_history_index } = this.state
        f_history_index = f_history_index - 1
        if (f_history_index < 0) return
        this.setState({
            f_history_index
        })
        const value = f_history[f_history_index]
        this.props.onChange(value)
        this.handleLineIndex(value)
    }

    redo = () => {
        const { f_history } = this.state
        let { f_history_index } = this.state
        f_history_index = f_history_index + 1
        if (f_history_index >= f_history.length) return
        this.setState({
            f_history_index
        })
        const value = f_history[f_history_index]
        this.props.onChange(value)
        this.handleLineIndex(value)
    }

    preview = () => {
        this.setState({
            preview: !this.state.preview
        })
    }

    expand = () => {
        this.setState({
            expand: !this.state.expand
        })
    }

    save = () => {
        this.props.onSave()
    }

    massReplace(text, replacementArray) {
        let results = text;
        for (let [regex, replacement] of replacementArray) {
          results = results.replace(regex, replacement);
        }
        return results;
      }

    render() {
        const { preview, expand, line_index } = this.state
        const { value } = this.props
        const previewClass = classNames({
            'for-panel': true,
            'for-preview-hidden': !preview
        })
        const editorClass = classNames({
            'for-panel': true
        })
        const previewActive = classNames({
            'for-active': preview
        })
        const fullscreen = classNames({
            'for-container': true,
            'for-fullscreen': expand
        })
        const expandActive = classNames({
            'for-active': expand
        })
        const lineNumStyles = classNames({
            'for-line-num': true,
            hidden: !this.props.lineNum
        })

        const lineNum = function () {
            const list = []
            for (let i = 0; i < line_index; i++) {
                list.push(<li key={i + 1}>{i + 1}</li>)
            }
            return <ul className={lineNumStyles}>{list}</ul>
        }

        console.log(this.state);

        return (
            <div className={fullscreen} style={{ height: this.state.expand ? this.state.height : this.state.height-100 }}>
                <div className="for-controlbar" style={{display:this.state.width < 700 ? 'block' : 'flex'}}>
                    <ul>
                        <li data-type="h1" onClick={this.insert} title="Iso otsikko">
                            H1
                        </li>
                        <li data-type="h2" onClick={this.insert} title="Keskikokoinen otsikko">
                            H2
                        </li>
                        <li data-type="h3" onClick={this.insert} title="Pieni otsikko">
                            H3
                        </li>
                        <li data-type="bold" onClick={this.insert} title="Lihavoitu teksti (ctrl+b)">
                            <i className="fa fa-bold" />
                        </li>
                        <li data-type="italic" onClick={this.insert} title="Kursivoitu teksti (ctrl+i)">
                            <i className="fa fa-italic" />
                        </li>
                        <li data-type="image" onClick={this.insert} title="Kuva">
                            <i className="foricon for-image" />
                        </li>
                        <li data-type="link" onClick={this.insert} title="Linkki">
                            <i className="foricon for-link" />
                        </li>
                        <li data-type="linkButton" onClick={this.insert} title="Linkki painike">
                            <i className="fab fa-facebook-square" />
                        </li>
                        <li data-type="table" onClick={this.insert} title="Taulukko">
                            <i className="fa fa-table" />
                        </li>
                        <li data-type="list" onClick={this.insert} title="Lista">
                            <i className="fa fa-list" />
                        </li>
                        <li data-type="listUl" onClick={this.insert} title="Täplä lista">
                            <i className="fa fa-list-ul" />
                        </li>
                        <li data-type="listOl" onClick={this.insert} title="Numeroitu lista">
                            <i className="fa fa-list-ol" />
                        </li>
                    </ul>
                    <ul>
                        <li data-type="code" onClick={this.save} title="Tallenna (ctrl+s)">
                            <i className="foricon for-save" />
                        </li>
                        <li className={expandActive} onClick={this.expand}>
                            {expandActive ? (
                                <i className="foricon for-contract" />
                            ) : (
                                    <i className="foricon for-expand" />
                                )}
                        </li>
                        <li className={previewActive} onClick={this.preview}>
                            {previewActive ? (
                                <i className="foricon for-eye-off" />
                            ) : (
                                    <i className="foricon for-eye" />
                                )}
                        </li>
                        <li onClick={this.undo} title="Taaksepäin (ctrl+z)">
                            <i className="foricon for-undo" />
                        </li>
                        <li onClick={this.redo} title="Eteenpäin (ctrl+y)">
                            <i className="foricon for-redo" />
                        </li>
                    </ul>
                </div>
                <div className="for-editor">
                    <div className={editorClass}>
                        <div className="for-editor-wrapper">
                            {/* <div className="for-editor-wrapper-in"> */}
                            <div className="for-editor-block">
                                {lineNum()}
                                <div className="for-editor-content">
                                    <pre>{value} </pre>
                                    <textarea
                                        ref={this.handleEditorRef}
                                        value={value}
                                        onChange={this.handleChange}
                                        placeholder={this.props.placeholder}
                                        spellCheck="false"
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                    />
                                </div>
                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                    <div className={previewClass}>
                        <div
                            className="for-preview for-markdown-preview"
                            dangerouslySetInnerHTML={{ __html: marked(
                                this.props.defaultValue + this.massReplace(value,
                                   [ [/^###(.*)/gm,    '<h3>$1</h3>'],
                                    [/^##(.*)/gm,     '<h2>$1</h2>'],
                                    [/^#(.*)/gm,      '<h1>$1</h1>'],
                                    [/\?\[(.+?)\]\((.*\))/g, '<button class="customButton" href="$2">$1</button>'] ]
                                    )
                                    
                                ) }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default MdEditor
