import React from 'react'
import '../../style/common/popUp.scss'

const { PropTypes, Component } = React
const propTypes = {
    onClose         : PropTypes.func.isRequired,
    visible         : PropTypes.bool,
    showMask        : PropTypes.bool,
    showCloseButton : PropTypes.bool,
    animation       : PropTypes.string,
    duration        : PropTypes.number,
    measure         : PropTypes.string
}

const defaultProps = {
    visible         : false,
    showMask        : true,
    showCloseButton : true,
    duration        : 300
}

const Dialog = props => {

    const className = `rodal-dialog rodal-fade-${props.animationType}`
    const CloseButton = props.showCloseButton ? <button className="rodal-close" onClick={props.onClose} ><p className="popup_confirm">确认</p></button> : null
    const {measure, duration } = props
    const style = {
        animationDuration       : duration + 'ms',
        WebkitAnimationDuration : duration + 'ms'
    }

    return (
        <div style={style} className={className}>
            <div className="closeBtn">
                {CloseButton}

            </div>
            {props.children}
        </div>
    )
}

class Rodal extends Component {

    constructor(props) {
        super(props)

        this.animationEnd = this.animationEnd.bind(this)
        this.state = {
            isShow        : false,
            animationType : 'leave'
        }
    }

    componentDidMount() {
        if (this.props.visible) {
            this.enter()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.enter()
        } else if (this.props.visible && !nextProps.visible) {
            this.leave()
        }
    }

    enter() {
        this.setState({
            isShow: true,
            animationType: 'enter'
        })
    }

    leave() {
        this.setState({
            animationType: 'leave'
        })
    }

    animationEnd() {
        if (this.state.animationType === 'leave') {
            this.setState({
                isShow: false
            })
        }
    }

    render() {
        const mask = this.props.showMask ? <div className="rodal-mask" onClick={this.props.onClose} /> : null
        const style = {
            display                 : this.state.isShow ? 'block' : 'none',
            WebkitAnimationDuration : this.props.duration + 'ms',
            animationDuration       : this.props.duration + 'ms'
        }

        return (
            <div style={style} className={"rodal rodal-fade-enter"} onAnimationEnd={this.animationEnd}>
                {mask}
                <Dialog {...this.props} animationType={this.state.animationType}>
                    {this.props.children}
                </Dialog>
            </div>
        )
    }
}

Rodal.propTypes = propTypes
Rodal.defaultProps = defaultProps

export default Rodal
