import React,{ Component } from 'react';
import TransitionContent from './CSSTransition';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { setRegisterWindow } from '../../actions';
import { updateCurrentUser } from '../../actions/authentication';
import { ADD_QUOTE } from '../../routes';
import TextField from '@material-ui/core/TextField';
import RadioButton from '../buttons/radio'
import Message from '../notification/message'
import isEmpty from '../../validation/is-empty';



import './inq.css';

class Quote extends Component {
    constructor(props) {
        super(props);
        this.state={
            devType: '',
            similarSites: '',
            goals: '',
            notes: '',
            slideNum: 1,
            businessName: '',
            websiteType: null,
            other: '',
            error: null,
            message: [],
        }
        this.onSlideTransition = this.onSlideTransition.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const classes = this.props;

        const developmentType = (
            <TransitionContent title={'Choose a development type'}>
                    <div className='qd-3-grid'>
                        <div>
                            <h3 className='center'>Font-end</h3>
                            <hr></hr>
                            <ul className='wd-list'>
                                <li>Using CPanel</li>
                                <li>Already have a back-end</li>
                                <li>Not much functionality</li>
                            </ul>
                            <h3 onClick={e => this.onTypeSelect('front')} className={this.state.devType == 'front' ? 'selected' : 'select'}>Select</h3>
                        </div>
                        <div>
                            <h3>Both</h3>
                            <hr></hr>
                            <ul className='wd-list'>
                                <li>Need the whole package</li>
                                <li>Have no website</li>
                                <li>Fully Customizable</li>
                            </ul>
                            <h3 onClick={e => this.onTypeSelect('both')} className={this.state.devType == 'both' ? 'selected' : 'select'}>Select</h3>
                        </div>
                        <div>
                            <h3>Back-end</h3>
                            <hr></hr>
                            <ul className='wd-list'>
                                <li>Need complex functionality</li>
                                <li>Need a database</li>
                                <li>Need API routes</li>
                            </ul>
                            <h3  onClick={e => this.onTypeSelect('back')} className={this.state.devType == 'back' ? 'selected' : 'select'}>Select</h3>
                        </div>
                    </div>
                    <div className='res-two-grid control-buttons'>
                        <div></div>
                        <button onClick={this.onSlideTransition} value={1} className='lg-btn'>Next</button>
                    </div>
                </TransitionContent>
        );

        const websiteTypes = (
            <TransitionContent title={'All about your website'}>
                <div className='form'>
                <h3>Website Type</h3>
                <div className='form-group'>
                    <div className='res-two-grid'>
                        <div>
                            <RadioButton handleChange={this.handleChange} value={'E-Commerce'}>E-Commerce</RadioButton>
                            <RadioButton handleChange={this.handleChange} value={'Personal'}>Personal</RadioButton>
                            <RadioButton handleChange={this.handleChange} value={'Blog'}>Blog</RadioButton>
                            <RadioButton handleChange={this.handleChange} value={'Informational'}>Informational</RadioButton>
                            <RadioButton handleChange={this.handleChange} value={'Portfolio'}>Portfolio</RadioButton>
                        </div>
                        <div>
                            <RadioButton handleChange={this.handleChange} value={'News'}>News</RadioButton>
                            <RadioButton handleChange={this.handleChange} value={'Online-Payment'}>Online Payment</RadioButton>
                            <RadioButton handleChange={this.handleChange} value={'Consultation'}>Consultation</RadioButton>
                            <RadioButton handleChange={this.handleChange} value={'Other'}>Other</RadioButton>
                            <TextField
                        label='Other'
                        className={classes.textField}
                        onChange={e => this.handleTextInput(e, 'other')}
                        value={this.state.other}
                    ></TextField>
                        </div>
                    </div>

                </div>

                    <br></br>
                    <h3>Website Information</h3>
                    <TextField
                        label='Business Name / Name'
                        className={classes.textField}
                        onChange={e => this.handleTextInput(e, 'businessName')}
                        value={this.state.businessName}
                        margin={"normal"}
                    ></TextField>
                    <br></br>
                    <TextField
                        label='Website Goals'
                        className={classes.textField}
                        onChange={e => this.handleTextInput(e, 'goals')}
                        value={this.state.goals}
                        helperText='What will your website be about?'
                        multiline={true}
                        fullWidth
                        margin={"normal"}
                    ></TextField>
                    <br></br>
                    <TextField
                        label='Links to similar websites'
                        className={classes.textField}
                        onChange={e => this.handleTextInput(e, 'similarSites')}
                        value={this.state.similarSites}
                        helperText='Websites with your desired look/functionality'
                        multiline={true}
                        fullWidth
                        margin={"normal"}
                    ></TextField>
                    <br></br>
                    <TextField
                        label='Remarks'
                        multiline={true}
                        onChange={e => this.handleTextInput(e, 'notes')}
                        value={this.state.notes}
                        className={classes.textField}
                        fullWidth
                        margin={"normal"}
                    ></TextField>
                </div>
                <div className='res-two-grid control-buttons'>
                    <button onClick={this.onSlideTransition} value={-1} className='lg-btn'>Back</button>
                    <button onClick={this.onSubmit} value={1} className='lg-btn green'>Submit</button>
                    
                </div>
            </TransitionContent>
        )

        const finishedPage = (
            <TransitionContent title={'All Done!'}>
                <div className='center'>
                    <img src='/images/icons/checkmark.png' alt='Checkmark Icon' />
                    <NavLink className='large-link' to='/account/'><p>Go to My Account<img className='large-link-img' src='/images/icons/right-arrow.png' alt='right arrow' /></p></NavLink>
                </div>
                
            </TransitionContent>
        )

        const errorMessage = (
            <Message type={'error'} list={this.state.message} />
        )

        const slideMap = [
            {
                content: developmentType
            },
            {
                content: websiteTypes
            },
            {
                content: finishedPage
            }
        ];

        return(
            <React.Fragment>
                <div className='qd-container'>
                <h1 className='title'>Development Quote</h1>

                {slideMap[this.state.slideNum - 1].content}
                {errorMessage}

                </div>
                <div className='help-banner'>
                <h3>Need Help?</h3>
                <p>We are happy to help! Just contact austin@webdreamtech.com</p>
            </div>
            </React.Fragment>

        )
    }
    componentWillMount() {
        if(isEmpty(this.props.userID)) {
            this.props.setRegisterWindow(true);
        }
    }

    handleTextInput = (event, name) => {
        this.setState({ [name]: event.target.value })
    }

    handleChange = event => {
        this.setState({ websiteType: event.target.value });
    }

    onTypeSelect(name) {
        this.setState({ devType: name })
    }

    onSlideTransition(e) {
        this.setState({ slideNum: this.state.slideNum + Number(e.target.value) })
    }

    async onSubmit() {
        try {
            const errors = await checkErrors(this.state);
            
            const response = await fetch(ADD_QUOTE, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({
                id: this.props.userID,
                developmentType: this.state.devType,
                websiteType: this.state.websiteType,
                similarSites: this.state.similarSites,
                goals: this.state.goals,
                notes: this.state.notes,
                businessName: this.state.businessName,
            })
            })
            const json = await response.json()
            this.setState({slideNum: this.state.slideNum + 1});
            this.props.updateCurrentUser(json);

        } catch (errors) {
            this.setState({
                error: true,
                message: errors
            })
        }
    }
}

function checkErrors(state) {
    return new Promise((resolve, reject) => {
        // Check if the FormData is filled
        var message = [];
        if(state.devType === '') {
            message.push('Choose a development type') 
        }
        if(state.goals === '') {
            message.push('Please List Goals')
        }
        if(state.similarSites === '') {
            message.push('Please List Similar Websites')
        }
        if(state.businessName === '') {
            message.push('Please Enter Business Name or your name')
        }
        if(state.websiteType === '') {
            message.push('Please choose a website type')
        }
        if (isEmpty(message)) {
            resolve()
        }
        else {
            reject(message)
        }
    })
} 

function mapStateToProps(state) {
    return {
        userID: state.auth.user.id
    };
}

export default connect(mapStateToProps, { updateCurrentUser, setRegisterWindow } )(Quote);